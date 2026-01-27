const { pool } = require('../config/db');
const LifecycleService = require('../services/lifecycle');

class CollectorController {

    // GET /api/collector/assignments
    static async getAssignedPickups(req, res) {
        try {
            const assignments = await pool.query(
                `SELECT ca.*, rr.pickup_address, rr.pickup_latitude, rr.pickup_longitude, 
                 d.device_type, d.brand, d.model, d.device_uid, d.current_duc 
                 FROM collector_assignments ca
                 JOIN recycling_requests rr ON ca.request_id = rr.id
                 JOIN devices d ON rr.device_id = d.id
                 WHERE ca.collector_id = $1 AND ca.status != 'COMPLETED'
                 ORDER BY ca.scheduled_pickup_time ASC`,
                [req.user.id]
            );
            res.json(assignments.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // GET /api/collector/history
    static async getPickupHistory(req, res) {
        console.log(`[CollectorAPI] Fetching history for user ID: ${req.user.id} (${req.user.role})`);
        try {
            const history = await pool.query(
                `SELECT ca.id, ca.actual_pickup_time, ca.status as assignment_status, 
                        rr.pickup_address, d.device_type, d.brand, d.model, d.device_uid, d.current_duc,
                        d.current_state as status
                 FROM collector_assignments ca
                 JOIN recycling_requests rr ON ca.request_id = rr.id
                 JOIN devices d ON rr.device_id = d.id
                 WHERE ca.collector_id = $1 AND (ca.status = 'COMPLETED' OR d.current_state IN ('DELIVERED_TO_RECYCLER', 'RECYCLED'))
                 ORDER BY ca.id DESC`,
                [req.user.id]
            );
            console.log(`[CollectorAPI] Found ${history.rows.length} completed jobs for user ${req.user.id}`);
            res.json(history.rows);
        } catch (err) {
            console.error('[CollectorAPI] History Fetch Error:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // POST /api/collector/assignments/:id/pickup
    static async confirmPickup(req, res) {
        const assignmentId = req.params.id;
        const { verification_metadata } = req.body; // e.g., scanned code matches
        console.log(`[Collector] Confirming pickup for Assgn ${assignmentId} with metadata:`, verification_metadata);

        try {
            // 1. Get Assignment & Request Details
            const assignmentRes = await pool.query(
                `SELECT ca.*, rr.device_id 
                 FROM collector_assignments ca
                 JOIN recycling_requests rr ON ca.request_id = rr.id
                 WHERE ca.id = $1 AND ca.collector_id = $2`,
                [assignmentId, req.user.id]
            );

            if (assignmentRes.rows.length === 0) return res.status(404).json({ message: 'Assignment not found' });

            const assignment = assignmentRes.rows[0];

            // 2. Validate DUC (Device Unique Code)
            const deviceCheck = await pool.query("SELECT current_duc FROM devices WHERE id = $1", [assignment.device_id]);
            const actualDuc = deviceCheck.rows[0].current_duc;
            const providedDuc = verification_metadata?.duc;

            if (!actualDuc || actualDuc !== providedDuc) {
                return res.status(400).json({ error: 'Invalid Handover Code (DUC). Please check with the citizen.' });
            }

            // 3. Transition Device (COLLECTOR_ASSIGNED -> COLLECTED)
            await LifecycleService.transitionState(
                assignment.device_id,
                'COLLECTED',
                req.user,
                verification_metadata
            );

            // 3. Update Assignment Status
            const updated = await pool.query(
                "UPDATE collector_assignments SET status = 'COLLECTED', actual_pickup_time = NOW() WHERE id = $1 RETURNING *",
                [assignmentId]
            );

            // 4. Update Request Status
            await pool.query(
                "UPDATE recycling_requests SET status = 'COLLECTED' WHERE id = $1",
                [assignment.request_id]
            );

            res.json({
                message: 'Pickup confirmed',
                assignment: updated.rows[0]
            });

        } catch (err) {
            console.error('[Collector] Pickup Failed:', err);
            if (err.code === 'FSM_VIOLATION' || err.code === 'RBAC_VIOLATION' || err.message.includes('DUC')) {
                return res.status(400).json({ error: err.message || 'Verification Failed' });
            }
            res.status(500).json({ message: 'Server error' });
        }
    }

    // POST /api/collector/assignments/:id/deliver
    static async confirmDelivery(req, res) {
        const assignmentId = req.params.id;

        try {
            // 1. Get Assignment & Request Details
            const assignmentRes = await pool.query(
                `SELECT ca.*, rr.device_id 
                 FROM collector_assignments ca
                 JOIN recycling_requests rr ON ca.request_id = rr.id
                 WHERE ca.id = $1 AND ca.collector_id = $2`,
                [assignmentId, req.user.id]
            );

            if (assignmentRes.rows.length === 0) return res.status(404).json({ message: 'Assignment not found' });
            const assignment = assignmentRes.rows[0];

            // NOTE: We no longer transition device state here.
            // The Recycler must verify receipt to transition to DELIVERED_TO_RECYCLER.
            // We only mark the Collector's assignment as COMPLETED from their perspective.

            // 2. Update Assignment Status
            const updated = await pool.query(
                "UPDATE collector_assignments SET status = 'COMPLETED' WHERE id = $1 RETURNING *",
                [assignmentId]
            );

            // 3. Update Request Status
            await pool.query(
                "UPDATE recycling_requests SET status = 'DELIVERED' WHERE id = $1",
                [assignment.request_id]
            );

            res.json({
                message: 'Delivery reported. Awaiting Recycler verification.',
                assignment: updated.rows[0]
            });

        } catch (err) {
            console.error(err);
            if (err.code === 'FSM_VIOLATION' || err.code === 'RBAC_VIOLATION') {
                return res.status(err.status || 400).json(err);
            }
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = CollectorController;
