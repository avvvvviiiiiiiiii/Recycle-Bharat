const { pool } = require('./src/config/db');

async function migrate() {
    try {
        console.log('Running migration...');

        // Create audit_logs table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                action VARCHAR(50) NOT NULL,
                target_id INTEGER,
                details JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Created audit_logs table');

        // Add missing columns to devices
        await pool.query(`
            ALTER TABLE devices 
            ADD COLUMN IF NOT EXISTS current_duc VARCHAR(50),
            ADD COLUMN IF NOT EXISTS device_uid VARCHAR(50),
            ADD COLUMN IF NOT EXISTS device_uid_origin VARCHAR(50);
        `);
        console.log('✅ Updated devices schema');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        pool.end();
    }
}

migrate();
