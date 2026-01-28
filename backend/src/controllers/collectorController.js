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

    // GET /api/collector/history
    static async getJobHistory(req, res) {
        try {
            const history = await pool.query(
                `SELECT ca.*, rr.pickup_address, d.device_type, d.brand, d.model, d.device_uid, d.current_state
                 FROM collector_assignments ca
                 JOIN recycling_requests rr ON ca.request_id = rr.id
                 JOIN devices d ON rr.device_id = d.id
                 WHERE ca.collector_id = $1 AND ca.status = 'COMPLETED'
                 ORDER BY ca.actual_pickup_time DESC`,
                [req.user.id]
            );
            res.json(history.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // POST /api/collector/assignments/:id/pickup
    static async confirmPickup(req, res) {
        const assignmentId = parseInt(req.params.id, 10);
        const { verification_metadata } = req.body;

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // 1. Get Assignment & Device Details
            const assignmentRes = await client.query(
                `SELECT ca.*, rr.device_id, d.device_uid, d.current_duc, d.current_state
                 FROM collector_assignments ca
                 JOIN recycling_requests rr ON ca.request_id = rr.id
                 JOIN devices d ON rr.device_id = d.id
                 WHERE ca.id = $1 AND ca.collector_id = $2`,
                [assignmentId, req.user.id]
            );

            if (assignmentRes.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ message: 'Assignment not found' });
            }

            const assignment = assignmentRes.rows[0];

            // 2. Validate DUC (Device User Code)
            let validDuc = String(assignment.current_duc || '').trim();

            if (!validDuc && assignment.device_uid) {
                validDuc = assignment.device_uid.slice(-6).toUpperCase();
            }

            const providedDuc = (verification_metadata?.duc || '').trim().toUpperCase();

            console.log(`[Collector] DUC Check - Assignment: ${assignmentId}, Valid: '${validDuc}', Provided: '${providedDuc}'`);

            if (!validDuc || providedDuc !== validDuc) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    error: `Invalid DUC Code. Authentication Failed.`,
                    debug: `Required: ${validDuc || 'UNKNOWN'}`
                });
            }

            // 3. Transition Device State (COLLECTOR_ASSIGNED -> COLLECTED)
            await client.query(
                `UPDATE devices SET current_state = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
                ['COLLECTED', assignment.device_id]
            );

            // 3b. Log lifecycle event
            await client.query(
                `INSERT INTO lifecycle_events (device_id, from_state, to_state, event_type, triggered_by_user_id, metadata, timestamp)
                 VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
                [assignment.device_id, assignment.current_state, 'COLLECTED', 'COLLECTED', req.user.id, JSON.stringify({ ...verification_metadata, valid_duc: true })]
            );

            // 4. Update Assignment Status (Collector has picked it up)
            const updated = await client.query(
                "UPDATE collector_assignments SET status = $2, actual_pickup_time = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
                [assignmentId, 'COLLECTED']
            );

            // 5. Update Request Status
            await client.query(
                "UPDATE recycling_requests SET status = 'COLLECTED' WHERE id = $1",
                [assignment.request_id]
            );

            await client.query('COMMIT');

            res.json({
                message: 'Pickup confirmed',
                assignment: updated.rows[0]
            });

        } catch (err) {
            await client.query('ROLLBACK');
            console.error('[Collector] Pickup Error:', err);

            // Check if it's already collected (idempotency)
            try {
                const checkRes = await pool.query(
                    `SELECT d.current_state, ca.status 
                      FROM collector_assignments ca
                      JOIN recycling_requests rr ON ca.request_id = rr.id
                      JOIN devices d ON rr.device_id = d.id
                      WHERE ca.id = $1`,
                    [assignmentId]
                );

                if (checkRes.rows.length > 0) {
                    const { current_state, status } = checkRes.rows[0];
                    if (current_state === 'COLLECTED' && status === 'COLLECTED') {
                        return res.json({ message: 'Pickup confirmed (Idempotent)', assignment: checkRes.rows[0] });
                    }
                }
            } catch (retryErr) {
                console.error('[Collector] Idempotency Check Failed:', retryErr);
            }

            res.status(500).json({ message: 'Server error', error: err.message });
        } finally {
            client.release();
        }
    }

    // POST /api/collector/assignments/:id/deliver
    static async confirmDelivery(req, res) {
        const assignmentId = parseInt(req.params.id, 10);

        try {
            // 1. Get Assignment & Device Details
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
            console.error('[Collector] Delivery Error:', err);

            // Idempotency Handler for Delivery
            if (err.code === 'FSM_VIOLATION') {
                try {
                    const checkRes = await pool.query(
                        `SELECT d.current_state, ca.status 
                          FROM collector_assignments ca
                          JOIN recycling_requests rr ON ca.request_id = rr.id
                          JOIN devices d ON rr.device_id = d.id
                          WHERE ca.id = $1`,
                        [assignmentId]
                    );

                    if (checkRes.rows.length > 0) {
                        const { current_state, status } = checkRes.rows[0];
                        if (current_state === 'DELIVERED_TO_RECYCLER' && status === 'COMPLETED') {
                            return res.json({ message: 'Delivery confirmed (Idempotent)', assignment: checkRes.rows[0] });
                        }
                    }
                } catch (retryErr) {
                    console.error('[Collector] Delivery Idempotency Check Failed:', retryErr);
                }

                return res.status(err.status || 400).json({ error: err.message, code: err.code });
            }

            if (err.code === 'RBAC_VIOLATION') {
                return res.status(err.status || 400).json({ error: err.message, code: err.code });
            }
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = CollectorController;
