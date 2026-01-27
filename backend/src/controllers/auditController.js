const { pool } = require('../config/db');

class AuditController {
    static async getMyActivity(req, res) {
        try {
            const userId = req.user.id;

            // Fetch lifecycle events related to devices owned by this user
            // This ensures they see events triggered by collectors/recyclers on their devices
            const result = await pool.query(
                `SELECT 
                    le.id as _id, 
                    le.device_id, 
                    le.event_type as action, 
                    le.metadata as details, 
                    le.triggered_by_user_id as "actorId", 
                    le.timestamp as "createdAt"
                 FROM lifecycle_events le
                 JOIN devices d ON le.device_id = d.id
                 WHERE d.owner_id = $1 OR le.triggered_by_user_id = $1
                 ORDER BY le.timestamp DESC 
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
