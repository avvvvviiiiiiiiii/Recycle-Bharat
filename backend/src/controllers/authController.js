const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

class AuthController {

    // POST /api/auth/register
    static async register(req, res) {
        const { email, password, role, full_name, phone, organization, avatar_url } = req.body;

        try {
            console.log('Register request body:', req.body); // Debug log

            // Validations
            if (!email || !password || !full_name || !role) {
                console.error('[Auth] Register Validation Failed: Missing fields', req.body);
                return res.status(400).json({ message: 'Missing fields. Received: ' + JSON.stringify(req.body) });
            }

            if (!['CITIZEN', 'COLLECTOR', 'RECYCLER'].includes(role)) {
                console.error('[Auth] Register Validation Failed: Invalid Role', role);
                return res.status(400).json({ message: 'Invalid role: ' + role });
            }

            const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                return res.status(409).json({ message: 'Email already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = await pool.query(
                'INSERT INTO users (email, password_hash, role, full_name, phone, organization, avatar_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email, role, full_name, organization, avatar_url',
                [email, hashedPassword, role, full_name, phone || null, organization || null, avatar_url || null]
            );

            res.status(201).json({
                message: 'User registered successfully',
                user: newUser.rows[0]
            });

        } catch (err) {
            console.error('Registration Error:', err);
            // Return actual error in dev mode
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }

    // POST /api/auth/login
    static async login(req, res) {
        const { email, password } = req.body;

        try {
            const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            if (userRes.rows.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const user = userRes.rows[0];
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT
            const payload = {
                id: user.id,
                email: user.email,
                role: user.role
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    full_name: user.full_name,
                    organization: user.organization,
                    avatar_url: user.avatar_url
                }
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = AuthController;
