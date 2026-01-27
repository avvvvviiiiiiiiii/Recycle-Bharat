const express = require('express');
const router = express.Router();
const PublicStatsController = require('../controllers/publicStatsController');

// Public route - no authentication required
router.get('/stats', PublicStatsController.getPublicStats);

module.exports = router;
