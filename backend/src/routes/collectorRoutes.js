const express = require('express');
const router = express.Router();
const CollectorController = require('../controllers/collectorController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/rbac');

router.use(authenticate);

// Only Collectors can access
router.get('/assignments', authorize(['COLLECTOR']), CollectorController.getAssignedPickups);
router.get('/history', authorize(['COLLECTOR']), CollectorController.getPickupHistory);
router.post('/assignments/:id/pickup', authorize(['COLLECTOR']), CollectorController.confirmPickup);
router.post('/assignments/:id/deliver', authorize(['COLLECTOR']), CollectorController.confirmDelivery);

module.exports = router;
