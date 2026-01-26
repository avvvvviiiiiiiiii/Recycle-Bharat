const DeviceModel = require('../models/deviceModel');
const IncentiveModel = require('../models/incentiveModel');

class StatsService {
    static async getSystemStats() {
        const totalDevices = await DeviceModel.countDocuments();
        const recycledDevices = await DeviceModel.countDocuments({ status: 'RECYCLED' });
        const pendingCollection = await DeviceModel.countDocuments({ status: { $in: ['RECYCLING_REQUESTED', 'COLLECTOR_ASSIGNED'] } });

        // Aggregation for total incentives issued
        const incentiveData = await IncentiveModel.aggregate([
            { $group: { _id: null, totalIssued: { $sum: "$amount" } } }
        ]);
        const totalIncentives = incentiveData[0]?.totalIssued || 0;

        // Monthly trends (mock for now or real if data allows)
        // For MVP, we'll return structured data reflecting the current state
        return {
            totalDevices,
            recycledDevices,
            recyclingRate: totalDevices > 0 ? (recycledDevices / totalDevices) * 100 : 0,
            totalIncentives,
            pendingCollection,
            trends: [
                { name: 'Jan', count: 10 },
                { name: 'Feb', count: 15 },
                { name: 'Mar', count: recycledDevices }
            ]
        };
    }
}

module.exports = StatsService;
