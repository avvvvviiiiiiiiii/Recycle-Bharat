const { pool } = require('../config/db');
const LifecycleService = require('../services/lifecycle');

class CollectorController {

    // GET /api/collector/assignments
    static async getAssignedPickups(req, res) {
        try {
            const assignments = await pool.query(
                `SELECT ca.*, rr.pickup_address, rr.pickup_latitude, rr.pickup_longitude, 
                 d.device_type, d.brand, d.model 
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

    // POST /api/collector/assignments/:id/pickup
    static async confirmPickup(req, res) {
        const assignmentId = req.params.id;
        const { verification_metadata } = req.body; // e.g., scanned code matches

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

            // 2. Transition Device (COLLECTOR_ASSIGNED -> COLLECTED)
            await LifecycleService.transitionState(
                assignment.device_id,
                'COLLECTED',
                req.user,
                verification_metadata
            );

            // 3. Update Assignment Status
            const updated = await pool.query(
                "UPDATE collector_assignments SET status = 'IN_PROGRESS', actual_pickup_time = NOW() WHERE id = $1 RETURNING *",
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
            console.error(err);
            if (err.code === 'FSM_VIOLATION' || err.code === 'RBAC_VIOLATION') {
                return res.status(err.status || 400).json(err);
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

            // 2. Transition Device (COLLECTED -> DELIVERED_TO_RECYCLER)
            await LifecycleService.transitionState(
                assignment.device_id,
                'DELIVERED_TO_RECYCLER',
                req.user
            );

            // 3. Update Assignment Status
            const updated = await pool.query(
                "UPDATE collector_assignments SET status = 'COMPLETED' WHERE id = $1 RETURNING *",
                [assignmentId]
            );

            // 4. Update Request Status
            await pool.query(
                "UPDATE recycling_requests SET status = 'COMPLETED' WHERE id = $1",
                [assignment.request_id]
            );

            res.json({
                message: 'Delivery confirmed',
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
