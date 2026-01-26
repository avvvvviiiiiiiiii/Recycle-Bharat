const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Simple In-Memory Store
const mockUsers = [
    { _id: 'mock_citizen_id', email: 'citizen@test.com', password: 'password', role: 'citizen' },
    { _id: 'mock_collector_id', email: 'collector@test.com', password: 'password', role: 'collector' },
    { _id: 'mock_recycler_id', email: 'recycler@test.com', password: 'password', role: 'recycler' }
];

class MockAuthService {
    static async register(email, password, role, displayName = '', organization = '') {
        // Check if user already exists
        const existingUser = mockUsers.find(u => u.email === email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const newUser = { _id: `mock_${Date.now()}`, email, password, role, displayName, organization };
        mockUsers.push(newUser);
        return newUser;
    }

    static async login(email, password) {
        const user = mockUsers.find(u => u.email === email);
        if (!user) throw new Error('Invalid credentials');

        // Check if password is hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
        const isHashed = user.password.startsWith('$2');
        let isMatch = false;

        if (isHashed) {
            // Compare hashed password
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // Direct comparison for plain text (test accounts)
            isMatch = user.password === password;
        }

        if (!isMatch) throw new Error('Invalid credentials');

        const payload = { user: { id: user._id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });

        return { token, user: { id: user._id, email: user.email, role: user.role } };
    }

    static async getUsersByRole(role) {
        return mockUsers.filter(u => u.role === role);
    }
}

module.exports = MockAuthService;
