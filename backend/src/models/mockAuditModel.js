// Mock Audit Model for offline mode

const mockAuditLogs = [];

class MockAuditModel {
    static async create(data) {
        const log = {
            _id: `mock_audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        mockAuditLogs.push(log);
        console.log('Mock Audit:', data);
        return log;
    }

    static find(query) {
        // Filter by actorId if provided
        let results = mockAuditLogs;
        if (query && query.actorId) {
            results = results.filter(log => log.actorId.toString() === query.actorId.toString());
        }

        // Return chainable object with sort and limit methods
        return {
            sort: (sortObj) => {
                return {
                    limit: (limitNum) => {
                        // Sort by createdAt if specified
                        if (sortObj && sortObj.createdAt) {
                            const sorted = [...results].sort((a, b) => {
                                return sortObj.createdAt === 1
                                    ? a.createdAt - b.createdAt
                                    : b.createdAt - a.createdAt;
                            });
                            return Promise.resolve(sorted.slice(0, limitNum));
                        }
                        return Promise.resolve(results.slice(0, limitNum));
                    }
                };
            }
        };
    }

    static async findOne(query) {
        return mockAuditLogs.find(log => {
            if (query.actorId && log.actorId.toString() !== query.actorId.toString()) return false;
            if (query._id && log._id !== query._id) return false;
            return true;
        });
    }
}

module.exports = MockAuditModel;
