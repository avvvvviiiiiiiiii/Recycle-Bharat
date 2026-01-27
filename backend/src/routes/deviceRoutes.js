const express = require('express');
const router = express.Router();
const DeviceController = require('../controllers/deviceController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/rbac');

// All routes require authentication
router.use(authenticate);

// CITIZEN Routes
router.post('/', authorize(['CITIZEN']), DeviceController.registerDevice);
router.get('/', authorize(['CITIZEN']), DeviceController.getMyDevices);

// SHARED Routes (Access Controlled in Controller)
router.get('/:id', authorize(['CITIZEN', 'RECYCLER', 'ADMIN', 'COLLECTOR']), DeviceController.getDeviceById);

router.post('/:id/recycle', authorize(['CITIZEN']), DeviceController.requestRecycling);
router.get('/:id/duc', authorize(['CITIZEN']), DeviceController.revealDeviceDUC);

module.exports = router;
