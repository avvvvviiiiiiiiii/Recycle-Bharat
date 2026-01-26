const { pool } = require('../config/db');

const migrate = async () => {
    try {
        console.log('⏳ Running migration to add missing fields...');

        await pool.query(`
            ALTER TABLE devices 
            ADD COLUMN IF NOT EXISTS description TEXT,
            ADD COLUMN IF NOT EXISTS recycle_number VARCHAR(20),
            ADD COLUMN IF NOT EXISTS duc_hash VARCHAR(255),
            ADD COLUMN IF NOT EXISTS current_duc VARCHAR(20),
            ADD COLUMN IF NOT EXISTS failed_duc_attempts INTEGER DEFAULT 0,
            ADD COLUMN IF NOT EXISTS is_terminated BOOLEAN DEFAULT false;
        `);

        console.log('✅ Migration successful: Added fields to devices table.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
};

migrate();
