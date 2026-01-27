const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, ProfileController.getProfile);
router.patch('/update', authMiddleware, ProfileController.updateProfile);
router.post('/update', authMiddleware, ProfileController.updateProfile);
router.post('/change-password', authMiddleware, ProfileController.changePassword);

module.exports = router;
