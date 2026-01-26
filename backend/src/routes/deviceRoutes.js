const express = require('express');
const router = express.Router();
const DeviceController = require('../controllers/deviceController');
const authMiddleware = require('../middleware/authMiddleware');
const rbacMiddleware = require('../middleware/rbacMiddleware');

// All routes require auth
router.use(authMiddleware);

// Citizen Routes
router.post('/register', rbacMiddleware(['citizen']), DeviceController.registerDevice);
router.get('/my-devices', rbacMiddleware(['citizen']), DeviceController.getMyDevices);
router.post('/:id/recycle', rbacMiddleware(['citizen']), DeviceController.recycleRequest);
router.get('/:id/reveal-duc', rbacMiddleware(['citizen']), DeviceController.revealDuc);

// Recycler Routes
router.get('/pending', rbacMiddleware(['recycler']), DeviceController.getPendingDevices);
router.get('/deliveries', rbacMiddleware(['recycler']), DeviceController.getIncomingDeliveries);

// Collector & Recycler Shared Routes
router.get('/assigned', rbacMiddleware(['collector', 'recycler']), DeviceController.getAssignedPickups);
router.get('/collector-history', rbacMiddleware(['collector']), DeviceController.getCollectorHistory);
router.get('/inventory', rbacMiddleware(['recycler']), DeviceController.getInventory);

// Generic Transition Route (for Recycler, Collector)
// e.g. /api/devices/:id/status
router.patch('/:id/status', rbacMiddleware(['recycler', 'collector']), DeviceController.updateStatus);

// Get single device details
router.get('/:id', rbacMiddleware(['citizen', 'recycler', 'collector']), DeviceController.getDeviceById);

module.exports = router;
