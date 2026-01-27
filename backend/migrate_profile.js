const { pool } = require('./src/config/db');

const migrate = async () => {
    try {
        console.log('Starting migration...');

        // Add organization column
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS organization TEXT');
        console.log('✅ Added organization column');

        // Add avatar_url column
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT');
        console.log('✅ Added avatar_url column');

        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
