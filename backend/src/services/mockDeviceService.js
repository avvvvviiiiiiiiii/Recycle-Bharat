const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// In-Memory Device Store
const mockDevices = [
    {
        _id: 'mock_dev_1',
        uid: 'DEV-MOCK101',
        ownerId: 'mock_citizen_id',
        model: 'Demo Laptop',
        description: 'Mock data for testing',
        status: 'ACTIVE',
        isLegacy: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: 'mock_dev_2',
        uid: 'DEV-MOCK202',
        ownerId: 'mock_citizen_id',
        model: 'Regulated Phone',
        description: 'Modern device with ID',
        status: 'RECYCLING_REQUESTED',
        isLegacy: false,
        recycleNumber: '88889999',
        currentDuc: '123456',
        ducHash: '$2a$10$mockhash', // simulated
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

class MockDeviceService {
    static async register(userId, { model, description, recycleNumber }) {
        const uid = 'DEV-' + uuidv4().split('-')[0].toUpperCase();
        const device = {
            _id: `mock_dev_${Date.now()}`,
            uid,
            ownerId: userId,
            model,
            description,
            status: 'ACTIVE',
            isLegacy: !recycleNumber,
            recycleNumber: recycleNumber || null,
            currentDuc: null,
            ducHash: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        mockDevices.push(device);
        return device;
    }

    static async getUserDevices(userId) {
        return mockDevices.filter(d => d.ownerId.toString() === userId.toString())
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    static async getDevice(deviceId) {
        return mockDevices.find(d => d._id.toString() === deviceId.toString());
    }

    static async transitionStatus(deviceId, userId, userRole, newStatus, extraData = {}) {
        const device = mockDevices.find(d => d._id.toString() === deviceId.toString());
        if (!device) throw new Error('Device not found');

        device.status = newStatus;
        device.updatedAt = new Date();

        if (newStatus === 'RECYCLING_REQUESTED') {
            device.currentDuc = '777888'; // static for easy testing
            device.ducHash = await bcrypt.hash(device.currentDuc, 10);
        }

        if (newStatus === 'COLLECTOR_ASSIGNED' && extraData.collectorId) {
            device.collectorId = extraData.collectorId;
        }

        if (newStatus === 'RECYCLED') {
            device.isTerminated = true;
        }

        return device;
    }

    static async getPendingRequests() {
        return mockDevices.filter(d => d.status === 'RECYCLING_REQUESTED');
    }

    static async getAssignedPickups(collectorId = null) {
        return mockDevices.filter(d => {
            const matchesId = !collectorId || d.collectorId === collectorId;
            return matchesId && ['COLLECTOR_ASSIGNED', 'COLLECTED'].includes(d.status);
        });
    }

    static async getIncomingDeliveries() {
        return mockDevices.filter(d => d.status === 'COLLECTED');
    }

    static async getInventory() {
        return mockDevices.filter(d => d.status === 'DELIVERED_TO_RECYCLER');
    }

    static async getCollectorHistory(collectorId) {
        return mockDevices.filter(d =>
            d.collectorId === collectorId &&
            ['DELIVERED_TO_RECYCLER', 'RECYCLED'].includes(d.status)
        );
    }

    static async revealDuc(deviceId, userId) {
        const device = await this.getDevice(deviceId);
        return device?.currentDuc || '000000';
    }
}

module.exports = MockDeviceService;
