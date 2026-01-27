const { pool } = require('./src/config/db');

async function migrate_lifecycle() {
    try {
        console.log('Migrating lifecycle_events table...');

        await pool.query(`CREATE TABLE IF NOT EXISTS lifecycle_events (
            id SERIAL PRIMARY KEY,
            device_id INTEGER REFERENCES devices(id),
            from_state VARCHAR(50),
            to_state VARCHAR(50),
            triggered_by_user_id INTEGER REFERENCES users(id),
            event_type VARCHAR(50),
            metadata JSONB,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        // Add columns if they are missing (for existing table)
        await pool.query(`
            ALTER TABLE lifecycle_events 
            ADD COLUMN IF NOT EXISTS event_type VARCHAR(50),
            ADD COLUMN IF NOT EXISTS metadata JSONB,
            ADD COLUMN IF NOT EXISTS from_state VARCHAR(50),
            ADD COLUMN IF NOT EXISTS to_state VARCHAR(50), 
            ADD COLUMN IF NOT EXISTS triggered_by_user_id INTEGER;
        `);

        console.log('✅ lifecycle_events schema updated');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        pool.end();
    }
}

migrate_lifecycle();
