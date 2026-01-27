const PublicStatsService = require('../services/publicStatsService');

class PublicStatsController {
    // GET /api/public/stats - No authentication required
    static async getPublicStats(req, res) {
        try {
            const stats = await PublicStatsService.getPublicStats();
            res.json(stats);
        } catch (err) {
            console.error('[PublicStatsController] Error:', err);
            res.status(500).json({
                error: 'Failed to fetch statistics',
                devicesRecycled: 0,
                activeCitizens: 0,
                wasteDiverted: 0,
                recyclingCenters: 0
            });
        }
    }
}

module.exports = PublicStatsController;
