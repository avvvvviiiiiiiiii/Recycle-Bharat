const express = require('express');
const router = express.Router();
const AuditController = require('../controllers/auditController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/my-activity', authMiddleware, AuditController.getMyActivity);

module.exports = router;
