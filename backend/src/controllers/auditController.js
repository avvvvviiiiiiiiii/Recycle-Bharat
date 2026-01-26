const AuditModel = require('../models/auditModel');
const MockAuditModel = require('../models/mockAuditModel');

const Model = process.env.USE_MOCK_DB === 'true' ? MockAuditModel : AuditModel;

class AuditController {
    static async getMyActivity(req, res) {
        try {
            const userId = req.user.id;
            const logs = await Model.find({ actorId: userId })
                .sort({ createdAt: 1 })
                .limit(50);

            res.json(logs);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error fetching activity logs' });
        }
    }
}

module.exports = AuditController;
