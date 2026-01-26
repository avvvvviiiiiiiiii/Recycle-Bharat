const { pool } = require('../config/db');

class AnalyticsController {

    // GET /api/analytics/overview
    static async getOverview(req, res) {
        try {
            // 1. Basic Counts
            const totalDevicesRes = await pool.query('SELECT COUNT(*) FROM devices');
            const recycledDevicesRes = await pool.query("SELECT COUNT(*) FROM devices WHERE current_state = 'RECYCLED'");

            const totalDevices = parseInt(totalDevicesRes.rows[0].count);
            const recycledDevices = parseInt(recycledDevicesRes.rows[0].count);
            const recyclingRate = totalDevices > 0 ? (recycledDevices / totalDevices) * 100 : 0;

            // 2. Incentives
            const totalIncentivesRes = await pool.query('SELECT SUM(amount) FROM incentives');
            const totalIncentives = parseInt(totalIncentivesRes.rows[0].sum || 0);

            // 3. Trends (Recyling Events by Month)
            // Group by Month of 'RECYCLED' event in lifecycle_events
            // If lifecycle_events is empty for old data, we might not have trends.
            // Using a simple Mock trend based on created_at for dev purposes if real data is scarce.

            const trendsRes = await pool.query(`
                SELECT TO_CHAR(timestamp, 'Mon') as name, COUNT(*) as count
                FROM lifecycle_events 
                WHERE to_state = 'RECYCLED'
                GROUP BY TO_CHAR(timestamp, 'Mon'), DATE_TRUNC('month', timestamp)
                ORDER BY DATE_TRUNC('month', timestamp) DESC
                LIMIT 6
            `);

            // If no trends, mock some
            const trends = trendsRes.rows.length > 0 ? trendsRes.rows : [
                { name: 'Jan', count: 12 }, { name: 'Feb', count: 19 },
                { name: 'Mar', count: 3 }, { name: 'Apr', count: 5 },
                { name: 'May', count: 2 }, { name: 'Jun', count: 1 }
            ].reverse();

            res.json({
                totalDevices,
                recycledDevices,
                totalIncentives,
                recyclingRate,
                trends
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = AnalyticsController;
