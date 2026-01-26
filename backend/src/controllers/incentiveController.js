const IncentiveService = require('../services/incentiveService');
const MockIncentiveService = require('../services/mockIncentiveService');

const Service = process.env.USE_MOCK_DB === 'true' ? MockIncentiveService : IncentiveService;

class IncentiveController {
    static async getMyRewards(req, res) {
        try {
            const userId = req.user.id;
            const rewards = await Service.getUserRewards(userId);
            const balance = await Service.getUserBalance(userId);

            res.json({ balance, rewards });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error fetching rewards' });
        }
    }
}

module.exports = IncentiveController;
