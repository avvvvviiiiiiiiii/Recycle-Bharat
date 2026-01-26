const IncentiveModel = require('../models/incentiveModel');
const AuditModel = require('../models/auditModel');

class IncentiveService {
    /**
     * Issues a reward to a user for a specific device completion.
     * Ensures idempotency: A device can only trigger one reward.
     */
    static async issueReward({ userId, deviceId }) {
        try {
            // Check if reward already exists (Idempotency)
            const existing = await IncentiveModel.findOne({ deviceId });
            if (existing) {
                console.log(`[IncentiveService] Reward already issued for device ${deviceId}. Skipping.`);
                return existing;
            }

            // Create incentive record
            const reward = await IncentiveModel.create({
                userId,
                deviceId,
                amount: 100 // MVP Flat reward
            });

            // Log the event in audit logs
            await AuditModel.create({
                actorId: userId,
                action: 'INCENTIVE_ISSUED',
                details: { deviceId, amount: reward.amount, incentiveId: reward._id }
            });

            console.log(`[IncentiveService] Issued ${reward.amount} points to user ${userId} for device ${deviceId}`);
            return reward;
        } catch (err) {
            // Handle race conditions or duplicate entries
            if (err.code === 11000) {
                console.log(`[IncentiveService] Race condition detected. Reward already exists for device ${deviceId}.`);
                return await IncentiveModel.findOne({ deviceId });
            }
            throw err;
        }
    }

    static async getUserBalance(userId) {
        const rewards = await IncentiveModel.find({ userId });
        return rewards.reduce((sum, r) => sum + r.amount, 0);
    }

    static async getUserRewards(userId) {
        return await IncentiveModel.find({ userId }).populate('deviceId', 'model uid').sort({ createdAt: -1 });
    }
}

module.exports = IncentiveService;
