const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Mock User Model for offline mode
const MockUser = {
    findById: (id) => ({
        select: () => ({
            _id: id,
            email: 'citizen@test.com',
            displayName: 'Mock Agent',
            role: 'citizen',
            preferences: {
                notifications: { email: true, sms: false },
                settings: { theme: 'dark', language: 'en' }
            }
        })
    }),
    findByIdAndUpdate: (id, update) => ({
        select: () => ({
            _id: id,
            ...update.$set,
            email: 'citizen@test.com',
            role: 'citizen'
        })
    })
};

const Model = process.env.USE_MOCK_DB === 'true' ? MockUser : User;

class ProfileController {
    static async getProfile(req, res) {
        try {
            const user = await Model.findById(req.user.id).select('-password');
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error fetching profile' });
        }
    }

    static async updateProfile(req, res) {
        try {
            const { displayName, organization, preferences } = req.body;
            const updateFields = {};
            if (displayName !== undefined) updateFields.displayName = displayName;
            if (organization !== undefined) updateFields.organization = organization;
            if (preferences !== undefined) updateFields.preferences = preferences;

            const user = await Model.findByIdAndUpdate(
                req.user.id,
                { $set: updateFields },
                { new: true, runValidators: true }
            ).select('-password');

            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error updating profile' });
        }
    }

    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            if (process.env.USE_MOCK_DB === 'true') {
                return res.json({ message: 'Password updated successfully (Mock Mode)' });
            }

            if (!currentPassword || !newPassword) {
                return res.status(400).json({ error: 'Please provide current and new passwords' });
            }

            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid current password' });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();

            res.json({ message: 'Password updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error changing password' });
        }
    }
}

module.exports = ProfileController;
