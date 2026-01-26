const DeviceService = require('../services/deviceService');
const MockDeviceService = require('../services/mockDeviceService');

const Service = process.env.USE_MOCK_DB === 'true' ? MockDeviceService : DeviceService;

// Use proper mock audit model
const AuditModel = process.env.USE_MOCK_DB === 'true'
    ? require('../models/mockAuditModel')
    : require('../models/auditModel');

class DeviceController {
    static async registerDevice(req, res) {
        try {
            const userId = req.user.id;
            const { model, description, recycleNumber } = req.body;

            const device = await Service.register(userId, { model, description, recycleNumber });
            res.status(201).json(device);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getMyDevices(req, res) {
        try {
            const userId = req.user.id;
            const devices = await Service.getUserDevices(userId);
            res.json(devices);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async recycleRequest(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;

            const device = await Service.transitionStatus(id, userId, userRole, 'RECYCLING_REQUESTED');
            res.json(device);
        } catch (err) {
            console.error(err);
            if (err.message.includes('Device not found')) {
                return res.status(404).json({ error: err.message });
            }
            if (err.message.includes('Illegal transition') || err.message.includes('not authorized')) {
                return res.status(400).json({ error: err.message });
            }
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, ...extraData } = req.body;
            const userId = req.user.id;
            const userRole = req.user.role;

            const device = await Service.transitionStatus(id, userId, userRole, status, extraData);
            res.json(device);
        } catch (err) {
            console.error(err);
            if (err.message.includes('Device not found')) {
                return res.status(404).json({ error: err.message });
            }
            if (err.message.includes('Illegal transition') || err.message.includes('not authorized')) {
                return res.status(400).json({ error: err.message });
            }
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getPendingDevices(req, res) {
        try {
            const devices = await Service.getPendingRequests();
            res.json(devices);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getAssignedPickups(req, res) {
        try {
            const userId = req.user.id;
            const userRole = req.user.role;

            const collectorId = userRole === 'collector' ? userId : null;

            const devices = await Service.getAssignedPickups(collectorId);
            res.json(devices);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async revealDuc(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const rawDuc = await Service.revealDuc(id, userId);
            res.json({ rawDuc });
        } catch (err) {
            console.error(err);
            if (err.message.includes('Unauthorized')) {
                return res.status(403).json({ error: err.message });
            }
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getIncomingDeliveries(req, res) {
        try {
            const devices = await Service.getIncomingDeliveries();
            res.json(devices);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getDeviceById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const device = await Service.getDevice(id);

            if (!device) return res.status(404).json({ error: 'Device not found' });

            if (device.ownerId.toString() !== userId.toString() && !['recycler', 'collector'].includes(req.user.role)) {
                return res.status(403).json({ error: 'Unauthorized access' });
            }

            res.json(device);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getCollectorHistory(req, res) {
        try {
            const userId = req.user.id;
            const history = await Service.getCollectorHistory(userId);
            res.json(history);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getInventory(req, res) {
        try {
            const inventory = await Service.getInventory();
            res.json(inventory);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = DeviceController;
