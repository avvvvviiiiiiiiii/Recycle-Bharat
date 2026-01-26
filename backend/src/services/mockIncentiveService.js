// Mock Incentive Service for offline mode

const mockIncentives = [];

class MockIncentiveService {
    static async issueReward({ userId, deviceId }) {
        try {
            // Check if reward already exists (Idempotency)
            const existing = mockIncentives.find(i => i.deviceId === deviceId);
            if (existing) {
                console.log(`[MockIncentiveService] Reward already issued for device ${deviceId}. Skipping.`);
                return existing;
            }

            // Create incentive record
            const reward = {
                _id: `mock_incentive_${Date.now()}`,
                userId,
                deviceId,
                amount: 100, // MVP Flat reward
                createdAt: new Date(),
                updatedAt: new Date()
            };

            mockIncentives.push(reward);

            console.log(`[MockIncentiveService] Issued ${reward.amount} points to user ${userId} for device ${deviceId}`);
            return reward;
        } catch (err) {
            console.error('[MockIncentiveService] Error:', err);
            throw err;
        }
    }

    static async getUserBalance(userId) {
        const rewards = mockIncentives.filter(r => r.userId.toString() === userId.toString());
        return rewards.reduce((sum, r) => sum + r.amount, 0);
    }

    static async getUserRewards(userId) {
        const rewards = mockIncentives.filter(r => r.userId.toString() === userId.toString());
        // Sort by createdAt descending
        return rewards.sort((a, b) => b.createdAt - a.createdAt);
    }
}

module.exports = MockIncentiveService;
