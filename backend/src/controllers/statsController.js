const StatsService = require('../services/statsService');

class StatsController {
    static async getStats(req, res) {
        try {
            const stats = await StatsService.getSystemStats();
            res.json(stats);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error generating stats' });
        }
    }
}

module.exports = StatsController;
