const express = require('express');
const router = express.Router();
const IncentiveController = require('../controllers/incentiveController');
const authMiddleware = require('../middleware/authMiddleware');
const rbacMiddleware = require('../middleware/rbacMiddleware');

router.get('/my-rewards', authMiddleware, rbacMiddleware(['CITIZEN']), IncentiveController.getMyRewards);

module.exports = router;
