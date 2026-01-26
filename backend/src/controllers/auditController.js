const { pool } = require('../config/db');

class AuditController {
    static async getMyActivity(req, res) {
        try {
            const userId = req.user.id;

            // Fetch lifecycle events triggered by this user
            const result = await pool.query(
                `SELECT 
                    id as _id, 
                    device_id, 
                    event_type as action, 
                    metadata as details, 
                    triggered_by_user_id as "actorId", 
                    timestamp as "createdAt"
                 FROM lifecycle_events 
                 WHERE triggered_by_user_id = $1 
                 ORDER BY timestamp DESC 
                 LIMIT 50`,
                [userId]
            );

            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error fetching activity logs' });
        }
    }
}

module.exports = AuditController;
