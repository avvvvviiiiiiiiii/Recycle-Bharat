const { pool } = require('../config/db');

class StatsService {
    static async getSystemStats() {
        try {
            // Parallelize queries for performance
            const [totalRes, recycledRes, pendingRes, incentiveRes] = await Promise.all([
                pool.query('SELECT COUNT(*) FROM devices'),
                pool.query("SELECT COUNT(*) FROM devices WHERE current_state = 'RECYCLED'"),
                pool.query("SELECT COUNT(*) FROM devices WHERE current_state IN ('RECYCLING_REQUESTED', 'COLLECTOR_ASSIGNED')"),
                pool.query('SELECT SUM(amount) as total FROM incentives')
            ]);

            const totalDevices = parseInt(totalRes.rows[0].count);
            const recycledDevices = parseInt(recycledRes.rows[0].count);
            const pendingCollection = parseInt(pendingRes.rows[0].count);
            const totalIncentives = parseInt(incentiveRes.rows[0].total || 0);

            // Mock trends for MVP as we don't have historical snapshots yet
            // In future, we can query lifecycle_events for timestamps of RECYCLED events
            return {
                totalDevices,
                recycledDevices,
                recyclingRate: totalDevices > 0 ? (recycledDevices / totalDevices) * 100 : 0,
                totalIncentives,
                pendingCollection,
                trends: [
                    { name: 'Jan', count: 10 },
                    { name: 'Feb', count: 15 },
                    { name: 'Mar', count: recycledDevices || 5 } // Ensure at least some data shows
                ]
            };
        } catch (err) {
            console.error('[StatsService] Error:', err);
            throw err; // Propagate to controller
        }
    }
}

module.exports = StatsService;
