const { pool } = require('../config/db');

class PublicStatsService {
    static async getPublicStats() {
        try {
            console.log('[PublicStatsService] Fetching statistics...');

            // Get public statistics without authentication
            const devicesRes = await pool.query('SELECT COUNT(*) FROM devices');
            console.log('[PublicStatsService] Devices query result:', devicesRes.rows);

            const usersRes = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'CITIZEN'");
            console.log('[PublicStatsService] Citizens query result:', usersRes.rows);

            const recycledRes = await pool.query("SELECT COUNT(*) FROM devices WHERE current_state = 'RECYCLED'");
            console.log('[PublicStatsService] Recycled query result:', recycledRes.rows);

            const centersRes = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'RECYCLER'");
            console.log('[PublicStatsService] Recyclers query result:', centersRes.rows);

            const totalDevices = parseInt(devicesRes.rows[0].count) || 0;
            const totalCitizens = parseInt(usersRes.rows[0].count) || 0;
            const recycledDevices = parseInt(recycledRes.rows[0].count) || 0;
            const recyclingCenters = parseInt(centersRes.rows[0].count) || 0;

            console.log('[PublicStatsService] Parsed values:', {
                totalDevices,
                totalCitizens,
                recycledDevices,
                recyclingCenters
            });

            // Calculate waste diversion rate
            const wasteDiversionRate = totalDevices > 0
                ? Math.round((recycledDevices / totalDevices) * 100)
                : 0;

            const result = {
                devicesRecycled: totalDevices,
                activeCitizens: totalCitizens,
                wasteDiverted: wasteDiversionRate,
                recyclingCenters: recyclingCenters
            };

            console.log('[PublicStatsService] Returning:', result);
            return result;
        } catch (err) {
            console.error('[PublicStatsService] Error:', err.message);
            console.error('[PublicStatsService] Error stack:', err.stack);
            // Return default values on error
            return {
                devicesRecycled: 0,
                activeCitizens: 0,
                wasteDiverted: 0,
                recyclingCenters: 0
            };
        }
    }
}

module.exports = PublicStatsService;
