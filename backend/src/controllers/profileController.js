const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

class ProfileController {
    static async getProfile(req, res) {
        try {
            const result = await pool.query(
                'SELECT id, email, role, full_name as "displayName", phone, address, created_at FROM users WHERE id = $1',
                [req.user.id]
            );

            if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

            // Add _id field to match frontend expectation (MongoDB legacy)
            const user = { ...result.rows[0], _id: result.rows[0].id.toString() };
            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error fetching profile' });
        }
    }

    static async updateProfile(req, res) {
        try {
            const { displayName, phone, address } = req.body;
            // Note: Frontend sends 'displayName', we map to 'full_name'
            // 'organization' and 'preferences' are not in standard schema currently, need to see where to store them.
            // For MVP, we only update core table fields. 

            // Construct dynamic update query
            const fields = [];
            const values = [];
            let idx = 1;

            if (displayName) {
                fields.push(`full_name = $${idx++}`);
                values.push(displayName);
            }
            if (phone) {
                fields.push(`phone = $${idx++}`);
                values.push(phone);
            }
            if (address) {
                fields.push(`address = $${idx++}`);
                values.push(address);
            }

            if (fields.length === 0) return res.json({ message: 'No changes provided' });

            values.push(req.user.id);
            const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, email, role, full_name as "displayName", phone, address`;

            const result = await pool.query(query, values);
            const user = { ...result.rows[0], _id: result.rows[0].id.toString() };

            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error updating profile' });
        }
    }

    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({ error: 'Please provide current and new passwords' });
            }

            // 1. Get current hash
            const userRes = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
            if (userRes.rows.length === 0) return res.status(404).json({ error: 'User not found' });

            const currentHash = userRes.rows[0].password_hash;

            // 2. Verify
            const isMatch = await bcrypt.compare(currentPassword, currentHash);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid current password' });
            }

            // 3. Hash New
            const salt = await bcrypt.genSalt(10);
            const newHash = await bcrypt.hash(newPassword, salt);

            // 4. Update
            await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, req.user.id]);

            res.json({ message: 'Password updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error changing password' });
        }
    }
}

module.exports = ProfileController;
