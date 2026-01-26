const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analyticsController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/rbac');

router.use(authenticate);

// Only Govt and Admin
router.get('/overview', authorize(['GOVT', 'ADMIN']), AnalyticsController.getOverview);

module.exports = router;
