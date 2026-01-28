const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analyticsController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/rbac');

console.log('[AnalyticsRoutes] Initializing routes...');

router.use(authenticate);

// Only Govt and Admin
router.get('/reports', authorize(['GOVT', 'ADMIN']), (req, res, next) => {
    console.log('[AnalyticsRoutes] Hitting /reports');
    next();
}, AnalyticsController.getRecycledReports);

router.get('/overview', authorize(['GOVT', 'ADMIN']), AnalyticsController.getOverview);

module.exports = router;
