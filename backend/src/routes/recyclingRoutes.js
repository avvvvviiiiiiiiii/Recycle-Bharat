const express = require('express');
const router = express.Router();
const RecyclingController = require('../controllers/recyclingController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/rbac');

router.use(authenticate);

// Only Authorization Recyclers (or Admins) can access
router.get('/dashboard', authorize(['RECYCLER', 'ADMIN']), RecyclingController.getDashboardData);
router.post('/requests/:id/assign', authorize(['RECYCLER', 'ADMIN']), RecyclingController.assignCollector);
router.post('/devices/:id/handover', authorize(['RECYCLER', 'ADMIN']), RecyclingController.confirmHandover);
router.post('/devices/:id/complete', authorize(['RECYCLER', 'ADMIN']), RecyclingController.completeRecycling);

module.exports = router;
