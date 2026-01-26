const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/statsController');
const authMiddleware = require('../middleware/authMiddleware');
const rbacMiddleware = require('../middleware/rbacMiddleware');

// Only Government and Admin can access analytics
router.get('/', authMiddleware, rbacMiddleware(['GOVT', 'ADMIN']), StatsController.getStats);

module.exports = router;
