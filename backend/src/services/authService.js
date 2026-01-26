const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
require('dotenv').config();

class AuthService {
    static async register(email, password, role, displayName = '', organization = '') {
        // Check if user exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const user = await UserModel.create({
            email,
            password: passwordHash, // The model handles mapping this to password_hash column
            role,
            displayName,
            organization
        });
        return user;
    }

    static async login(email, password) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // UserModel maps password_hash to user.password for us
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Generate Token
        const payload = {
            user: {
                id: user.id, // PostgreSQL uses 'id' not '_id'
                role: user.role
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
        return { token, user: { id: user.id, email: user.email, role: user.role } };
    }

    static async getUsersByRole(role) {
        // Model.find returns the array of rows directly
        return await UserModel.find({ role });
    }
}

module.exports = AuthService;
