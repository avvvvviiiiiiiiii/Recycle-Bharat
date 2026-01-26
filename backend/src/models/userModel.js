const { query } = require('../config/db');

class UserModel {
    /**
     * Find a user by their email
     * @param {Object} criteria - { email: '...' }
     */
    static async findOne(criteria) {
        if (criteria.email) {
            const result = await query(
                'SELECT * FROM users WHERE email = $1',
                [criteria.email]
            );
            if (result.rows.length === 0) return null;

            const user = result.rows[0];
            // Map postgres snake_case to app camelCase if needed, 
            // but for now we'll stick to adapting the service layer to the DB schema
            // Adapting password_hash to password for compatibility with existing service logic
            user.password = user.password_hash;
            return user;
        }
        throw new Error('Unsupported findOne criteria');
    }

    /**
     * Create a new user
     * @param {Object} userData 
     */
    static async create(userData) {
        const { email, password, role, displayName, organization } = userData;
        const result = await query(
            `INSERT INTO users (email, password_hash, role, full_name, is_active) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
            [email, password, role, displayName || 'User', true] // Mapping displayName to full_name
        );

        // Note: 'organization' is not in my SQL schema MVP, ignoring it for now 
        // or we could add it to metadata if needed.

        const user = result.rows[0];
        user.password = user.password_hash;
        return user;
    }

    /**
     * Find users by role (equivalent to find({ role }))
     * @param {Object} criteria 
     */
    static async find(criteria) {
        if (criteria.role) {
            const result = await query(
                'SELECT id, email, role, full_name, created_at FROM users WHERE role = $1',
                [criteria.role]
            );
            return result.rows; // Returns array, simplified
        }
        return [];
    }

    static async findById(id) {
        const result = await query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) return null;
        const user = result.rows[0];
        user.password = user.password_hash;
        return user;
    }
}

module.exports = UserModel;
