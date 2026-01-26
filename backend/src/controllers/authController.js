const AuthService = require('../services/authService');
const MockAuthService = require('../services/mockAuthService');

const Service = process.env.USE_MOCK_DB === 'true' ? MockAuthService : AuthService;

class AuthController {
    static async register(req, res) {
        try {
            const { email, password, role, displayName, organization } = req.body;
            if (!email || !password || !role) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Basic role validation
            const validRoles = ['citizen', 'collector', 'recycler', 'government', 'admin'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ error: 'Invalid role' });
            }

            const user = await Service.register(email, password, role, displayName, organization);
            res.status(201).json({ message: 'User registered successfully', user: { id: user.id, email: user.email, role: user.role } });
        } catch (err) {
            console.error(err);
            if (err.message === 'User already exists') {
                return res.status(409).json({ error: err.message });
            }
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Missing credentials' });
            }

            const result = await Service.login(email, password);
            res.json(result);
        } catch (err) {
            console.error(err);
            if (err.message === 'Invalid credentials') {
                return res.status(401).json({ error: err.message });
            }
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async getCollectors(req, res) {
        try {
            const collectors = await Service.getUsersByRole('collector');
            res.json(collectors);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = AuthController;
