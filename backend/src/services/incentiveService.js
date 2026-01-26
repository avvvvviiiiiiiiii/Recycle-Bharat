const { pool } = require('../config/db');

class IncentiveService {
    /**
     * Issues a reward to a user for a specific device completion.
     * Ensures idempotency: A device can only trigger one reward.
     */
    static async issueReward({ userId, deviceId }) {
        try {
            // Check if incentive already exists (Idempotency) verification
            const existingRes = await pool.query('SELECT * FROM incentives WHERE device_id = $1', [deviceId]);
            if (existingRes.rows.length > 0) {
                console.log(`[IncentiveService] Reward already issued for device ${deviceId}. Skipping.`);
                return existingRes.rows[0];
            }

            // Create incentive record
            const rewardRes = await pool.query(
                `INSERT INTO incentives (user_id, device_id, amount, status)
                 VALUES ($1, $2, 100, 'PAID')
                 RETURNING *`,
                [userId, deviceId]
            );
            const reward = rewardRes.rows[0];

            // Log the event in audit logs
            await pool.query(
                `INSERT INTO lifecycle_events (device_id, triggered_by_user_id, event_type, metadata, to_state)
                 VALUES ($1, $2, 'INCENTIVE_ISSUED', $3, 'RECYCLED')`,
                [deviceId, userId, JSON.stringify({ amount: 100, incentiveId: reward.id })]
                // Note: 'to_state' is required by schema, assuming this happens at RECYCLED state or keeping distinct
            );

            console.log(`[IncentiveService] Issued ${reward.amount} points to user ${userId} for device ${deviceId}`);
            return reward;
        } catch (err) {
            console.error('[IncentiveService] Error:', err);
            // Handle race conditions or duplicate entries
            if (err.code === '23505') { // Postgres Unique Violation
                console.log(`[IncentiveService] Race condition detected. Reward already exists for device ${deviceId}.`);
                const existing = await pool.query('SELECT * FROM incentives WHERE device_id = $1', [deviceId]);
                return existing.rows[0];
            }
            throw err;
        }
    }

    static async getUserBalance(userId) {
        const res = await pool.query('SELECT SUM(amount) as balance FROM incentives WHERE user_id = $1', [userId]);
        return parseInt(res.rows[0].balance || 0);
    }

    static async getUserRewards(userId) {
        // Fetch rewards with device details
        const res = await pool.query(
            `SELECT i.*, d.model, d.device_uid as uid 
             FROM incentives i
             LEFT JOIN devices d ON i.device_id = d.id
             WHERE i.user_id = $1 
             ORDER BY i.issued_at DESC`,
            [userId]
        );
        return res.rows;
    }
}

module.exports = IncentiveService;
