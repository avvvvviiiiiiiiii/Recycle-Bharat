const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
});

const addPasswordResetTokensTable = async () => {
    try {
        console.log('🔄 Adding password_reset_tokens table...');

        // Check if table already exists
        const checkTable = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'password_reset_tokens'
            );
        `);

        if (checkTable.rows[0].exists) {
            console.log('ℹ️  Table password_reset_tokens already exists. Skipping...');
            process.exit(0);
        }

        // Create the table
        await pool.query(`
            CREATE TABLE password_reset_tokens (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) NOT NULL,
                token VARCHAR(255) UNIQUE NOT NULL,
                expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                used BOOLEAN DEFAULT false,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create index
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_password_reset_tokens ON password_reset_tokens(token);
        `);

        console.log('✅ password_reset_tokens table created successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration Failed:', err.message);
        console.error('\n📝 Instructions:');
        console.error('1. Make sure PostgreSQL is running');
        console.error('2. Update DATABASE_URL in backend/.env with your actual database password');
        console.error('3. Run this script again: node src/db/migrate_password_reset.js');
        process.exit(1);
    }
};

addPasswordResetTokensTable();
