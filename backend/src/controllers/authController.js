const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../config/db');
const emailService = require('../services/emailService');

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

            if (!['CITIZEN', 'COLLECTOR', 'RECYCLER', 'GOVT', 'ADMIN'].includes(role)) {
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

    // POST /api/auth/forgot-password
    static async requestPasswordReset(req, res) {
        const { email } = req.body;

        try {
            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }

            // Check if user exists
            const userRes = await pool.query('SELECT id, email, full_name FROM users WHERE email = $1', [email]);

            // Always return success to prevent email enumeration
            if (userRes.rows.length === 0) {
                return res.json({
                    message: 'If an account with that email exists, a password reset link has been sent.'
                });
            }

            const user = userRes.rows[0];

            // Generate secure random token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

            // Token expires in 1 hour
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

            // Delete any existing tokens for this user
            await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [user.id]);

            // Store hashed token in database
            await pool.query(
                'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
                [user.id, hashedToken, expiresAt]
            );

            // Send reset email
            try {
                await emailService.sendPasswordResetEmail(user.email, resetToken, user.full_name);
            } catch (emailError) {
                console.error('Failed to send reset email:', emailError);
                // Continue anyway - the token is still valid
            }

            res.json({
                message: 'If an account with that email exists, a password reset link has been sent.'
            });

        } catch (err) {
            console.error('Password reset request error:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // POST /api/auth/verify-reset-token
    static async verifyResetToken(req, res) {
        const { token } = req.body;

        try {
            if (!token) {
                return res.status(400).json({ message: 'Token is required' });
            }

            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

            const tokenRes = await pool.query(
                `SELECT prt.*, u.email, u.full_name 
                 FROM password_reset_tokens prt
                 JOIN users u ON prt.user_id = u.id
                 WHERE prt.token = $1 AND prt.used = false AND prt.expires_at > NOW()`,
                [hashedToken]
            );

            if (tokenRes.rows.length === 0) {
                return res.status(400).json({ message: 'Invalid or expired reset token' });
            }

            res.json({
                valid: true,
                email: tokenRes.rows[0].email
            });

        } catch (err) {
            console.error('Token verification error:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // POST /api/auth/reset-password
    static async resetPassword(req, res) {
        const { token, newPassword } = req.body;

        try {
            if (!token || !newPassword) {
                return res.status(400).json({ message: 'Token and new password are required' });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' });
            }

            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

            // Get token and user info
            const tokenRes = await pool.query(
                `SELECT prt.*, u.id as user_id, u.email, u.full_name 
                 FROM password_reset_tokens prt
                 JOIN users u ON prt.user_id = u.id
                 WHERE prt.token = $1 AND prt.used = false AND prt.expires_at > NOW()`,
                [hashedToken]
            );

            if (tokenRes.rows.length === 0) {
                return res.status(400).json({ message: 'Invalid or expired reset token' });
            }

            const tokenData = tokenRes.rows[0];

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password
            await pool.query(
                'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
                [hashedPassword, tokenData.user_id]
            );

            // Mark token as used
            await pool.query(
                'UPDATE password_reset_tokens SET used = true WHERE id = $1',
                [tokenData.id]
            );

            // Send confirmation email
            try {
                await emailService.sendPasswordResetConfirmation(tokenData.email, tokenData.full_name);
            } catch (emailError) {
                console.error('Failed to send confirmation email:', emailError);
                // Continue anyway - password was reset successfully
            }

            res.json({ message: 'Password reset successful. You can now log in with your new password.' });

        } catch (err) {
            console.error('Password reset error:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = AuthController;
