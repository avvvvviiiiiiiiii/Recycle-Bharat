const { pool } = require('../config/db');

class AnalyticsController {

    // GET /api/analytics/overview
    static async getOverview(req, res) {
        try {
            const { period, region } = req.query;

            // Helper to determine start date
            const getStartDate = (p) => {
                const now = new Date();
                if (p === 'Last Month') {
                    // Start of last month
                    return new Date(now.getFullYear(), now.getMonth() - 1, 1);
                } else if (p === 'Last Quarter') {
                    // Start of 3 months ago
                    return new Date(now.getFullYear(), now.getMonth() - 3, 1);
                } else if (p === 'This Year') {
                    // Start of current year
                    return new Date(now.getFullYear(), 0, 1);
                }
                // Default: All time (epoch)
                return new Date(0);
            };

            const startDate = getStartDate(period);

            // Note: Region filtering is stubbed as 'region' column does not exist on users/devices yet.
            // Future: Add WHERE region = $2

            // 1. Basic Counts (Filtered by Time)
            const totalDevicesRes = await pool.query('SELECT COUNT(*) FROM devices WHERE created_at >= $1', [startDate]);

            // For Recycled, use lifecycle events to capture when it was recycled
            const recycledDevicesRes = await pool.query(
                "SELECT COUNT(DISTINCT device_id) FROM lifecycle_events WHERE to_state = 'RECYCLED' AND timestamp >= $1",
                [startDate]
            );

            const totalDevices = parseInt(totalDevicesRes.rows[0].count);
            const recycledDevices = parseInt(recycledDevicesRes.rows[0].count);
            // Rate logic: Recycled in period / Total added in period (approx) OR Recycled in period / Total active + recycled?
            // Simple: Recycled Count / Total Registered Count
            const recyclingRate = totalDevices > 0 ? (recycledDevices / totalDevices) * 100 : 0;

            // 2. Incentives
            const totalIncentivesRes = await pool.query('SELECT SUM(amount) FROM incentives WHERE issued_at >= $1', [startDate]);
            const totalIncentives = parseInt(totalIncentivesRes.rows[0].sum || 0);

            // 3. Trends (Recyling Events by Month)
            const trendsRes = await pool.query(`
                SELECT TO_CHAR(timestamp, 'Mon') as name, COUNT(*) as count
                FROM lifecycle_events 
                WHERE to_state = 'RECYCLED' AND timestamp >= $1
                GROUP BY TO_CHAR(timestamp, 'Mon'), DATE_TRUNC('month', timestamp)
                ORDER BY DATE_TRUNC('month', timestamp) ASC
                LIMIT 12
            `, [startDate]);

            // If no trends, and looking at basic mock data scenarios
            // We use the real DB result if available, or empty array.
            // Frontend handles empty trends gracefully?
            const trends = trendsRes.rows;

            // 4. Device Composition (Registered in period)
            const compositionRes = await pool.query(`
                SELECT device_type as name, COUNT(*) as value
                FROM devices
                WHERE created_at >= $1
                GROUP BY device_type
            `, [startDate]);

            // 5. User Demographics (Joined in period)
            const userStatsRes = await pool.query(`
                SELECT role as name, COUNT(*) as value
                FROM users
                WHERE created_at >= $1
                GROUP BY role
            `, [startDate]);

            // 6. Material Impact (Recycled in period)
            const materialRes = await pool.query(`
                SELECT metadata->>'recovered_material' as name, COUNT(*) as value
                FROM lifecycle_events 
                WHERE event_type = 'RECYCLED' 
                AND timestamp >= $1
                AND metadata->>'recovered_material' IS NOT NULL
                GROUP BY metadata->>'recovered_material'
            `, [startDate]);

            res.json({
                totalDevices,
                recycledDevices,
                totalIncentives,
                recyclingRate,
                trends,
                composition: compositionRes.rows,
                userStats: userStatsRes.rows,
                materials: materialRes.rows
            });

        } catch (err) {
            console.error('[Analytics] Error:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // GET /api/analytics/reports
    static async getRecycledReports(req, res) {
        console.log('[Analytics] Fetching recycled reports...');
        try {
            // Fetch devices that are RECYCLED
            const reportsRes = await pool.query(`
                SELECT 
                    d.id, 
                    d.device_uid, 
                    d.device_type, 
                    d.brand, 
                    d.model, 
                    d.serial_number, 
                    u.full_name as owner_name,
                    u.email as owner_email,
                    u.phone as owner_phone,
                    d.created_at as registered_at,
                    rr.pickup_address,
                    col.full_name as collector_name
                FROM devices d
                JOIN users u ON d.owner_id = u.id
                LEFT JOIN recycling_requests rr ON rr.device_id = d.id
                LEFT JOIN collector_assignments ca ON ca.request_id = rr.id
                LEFT JOIN users col ON ca.collector_id = col.id
                WHERE d.current_state = 'RECYCLED'
                ORDER BY d.updated_at DESC
            `);

            console.log(`[Analytics] Found ${reportsRes.rows.length} recycled devices.`);

            // For each device, fetch its lifecycle events
            const reports = await Promise.all(reportsRes.rows.map(async (device) => {
                const eventsRes = await pool.query(`
                    SELECT 
                        le.from_state, 
                        le.to_state, 
                        le.event_type, 
                        le.timestamp, 
                        le.metadata,
                        u.full_name as triggered_by
                    FROM lifecycle_events le
                    LEFT JOIN users u ON le.triggered_by_user_id = u.id
                    WHERE le.device_id = $1
                    ORDER BY le.timestamp ASC
                `, [device.id]);

                return {
                    ...device,
                    workflow: eventsRes.rows
                };
            }));

            res.json(reports);
        } catch (err) {
            console.error('[Analytics Reports] Error:', err);
            res.status(500).json({
                message: 'Server error fetching reports',
                error: err.message
            });
        }
    }
}

module.exports = AnalyticsController;
