const { pool } = require('../config/db');
const LifecycleService = require('../services/lifecycle');
const IncentiveService = require('../services/incentiveService');

class RecyclingController {

    // GET /api/recycling/dashboard
    static async getDashboardData(req, res) {
        try {
            // 1. Incoming Requests (PENDING)
            const requests = await pool.query(
                `SELECT rr.*, d.device_uid, d.device_type, d.brand, d.model, u.email as citizen_email 
                FROM recycling_requests rr
                JOIN devices d ON rr.device_id = d.id
                JOIN users u ON rr.citizen_id = u.id
                WHERE rr.status = 'PENDING'
                ORDER BY rr.created_at ASC`
            );

            // 2. Incoming Deliveries (COLLECTED -> In Transit)
            // We need to know WHICH collector has it.
            // Join collector_assignments where status = 'IN_PROGRESS' (picked up)
            const deliveries = await pool.query(
                `SELECT d.*, u.full_name as collector_name, u.email as collector_email, ca.actual_pickup_time as picked_at
                FROM devices d
                JOIN collector_assignments ca ON ca.request_id = (SELECT id FROM recycling_requests WHERE device_id = d.id LIMIT 1)
                JOIN users u ON ca.collector_id = u.id
                WHERE d.current_state = 'COLLECTED'`
            );

            // 3. Inventory (At Facility)
            const inventory = await pool.query(
                `SELECT d.*, u.full_name as collector_name
                FROM devices d
                JOIN collector_assignments ca ON ca.request_id = (SELECT id FROM recycling_requests WHERE device_id = d.id LIMIT 1)
                JOIN users u ON ca.collector_id = u.id
                WHERE d.current_state = 'DELIVERED_TO_RECYCLER'`
            );

            // 4. Active Dispatches (ASSIGNED but not yet collected)
            const assigned = await pool.query(
                `SELECT d.*, u.full_name as collector_name, u.email as collector_email, ca.scheduled_pickup_time, ca.status as assignment_status
                FROM devices d
                JOIN collector_assignments ca ON ca.request_id = (SELECT id FROM recycling_requests WHERE device_id = d.id LIMIT 1)
                JOIN users u ON ca.collector_id = u.id
                WHERE d.current_state = 'COLLECTOR_ASSIGNED'`
            );

            // 5. Active Collectors
            const collectors = await pool.query(
                `SELECT id, full_name, email FROM users WHERE role = 'COLLECTOR'`
            );

            res.json({
                requests: requests.rows,
                deliveries: deliveries.rows,
                inventory: inventory.rows,
                assigned: assigned.rows,
                collectors: collectors.rows
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // POST /api/recycling/requests/:id/assign
    static async assignCollector(req, res) {
        const requestId = req.params.id;
        const { collector_id, scheduled_time } = req.body;

        try {
            // 1. Get Request details
            const requestRes = await pool.query('SELECT * FROM recycling_requests WHERE id = $1', [requestId]);
            if (requestRes.rows.length === 0) return res.status(404).json({ message: 'Request not found' });

            const request = requestRes.rows[0];

            // 2. Transition Device State (RECYCLING_REQUESTED -> COLLECTOR_ASSIGNED)
            await LifecycleService.transitionState(
                request.device_id,
                'COLLECTOR_ASSIGNED',
                req.user
            );

            // 3. Create Assignment & Update Request Status
            // (Ideally in tx, doing sequentially for MVP)
            const assignment = await pool.query(
                `INSERT INTO collector_assignments (request_id, collector_id, scheduled_pickup_time, status)
                VALUES ($1, $2, $3, 'ASSIGNED')
                RETURNING *`,
                [requestId, collector_id, scheduled_time]
            );

            await pool.query(
                "UPDATE recycling_requests SET status = 'ASSIGNED' WHERE id = $1",
                [requestId]
            );

            res.json({
                message: 'Collector assigned successfully',
                assignment: assignment.rows[0]
            });

        } catch (err) {
            console.error(err);
            if (err.code === 'FSM_VIOLATION' || err.code === 'RBAC_VIOLATION') {
                return res.status(err.status || 400).json(err);
            }
            res.status(500).json({ message: 'Server error' });
        }
    }

    // POST /api/recycling/devices/:id/complete
    static async completeRecycling(req, res) {
        const deviceId = req.params.id;
        // Verify metadata (proof of recycling)
        const { proof_metadata } = req.body;

        try {
            const result = await LifecycleService.transitionState(
                deviceId,
                'RECYCLED',
                req.user,
                proof_metadata
            );

            // 2. Issue Reward to Citizen
            // We need the owner_id of the device. Let's fetch it first or use a join.
            const deviceRes = await pool.query('SELECT owner_id FROM devices WHERE id = $1', [deviceId]);
            if (deviceRes.rows.length > 0) {
                const ownerId = deviceRes.rows[0].owner_id;
                await IncentiveService.issueReward({ userId: ownerId, deviceId });
            }

            res.json({
                message: 'Device recycling marked as complete and reward issued',
                result
            });

        } catch (err) {
            console.error(err);
            if (err.code === 'FSM_VIOLATION' || err.code === 'RBAC_VIOLATION') {
                return res.status(err.status || 400).json(err);
            }
            res.status(500).json({ message: 'Server error' });
        }
    }

    // POST /api/recycling/devices/:id/handover
    static async confirmHandover(req, res) {
        const deviceId = req.params.id;
        const { duc } = req.body;

        try {
            // 1. Optional: Verify DUC if provided (though Lifecycle handled most checks)
            // For now, let's just perform the transition
            await LifecycleService.transitionState(
                deviceId,
                'DELIVERED_TO_RECYCLER',
                req.user,
                { handover_duc: duc }
            );

            // 2. Find and update collector assignment
            // We need to mark it as COMPLETED when delivered
            const assignmentRes = await pool.query(
                `SELECT id FROM collector_assignments 
                 WHERE request_id = (SELECT id FROM recycling_requests WHERE device_id = $1 LIMIT 1) 
                 AND status = 'IN_PROGRESS'`,
                [deviceId]
            );

            if (assignmentRes.rows.length > 0) {
                const assignmentId = assignmentRes.rows[0].id;
                await pool.query(
                    "UPDATE collector_assignments SET status = 'COMPLETED' WHERE id = $1",
                    [assignmentId]
                );
            }

            res.json({ message: 'Handover accepted successfully' });

        } catch (err) {
            console.error(err);
            if (err.code === 'FSM_VIOLATION' || err.code === 'RBAC_VIOLATION') {
                return res.status(err.status || 400).json(err);
            }
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = RecyclingController;
