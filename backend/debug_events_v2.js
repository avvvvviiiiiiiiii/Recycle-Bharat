const { pool } = require('./src/config/db');

async function checkEvents() {
    try {
        console.log('--- Current Lifecycle Events ---');
        const res = await pool.query(`
            SELECT id, event_type, metadata 
            FROM lifecycle_events 
            ORDER BY id DESC 
            LIMIT 5
        `);
        for (const row of res.rows) {
            console.log(`ID: ${row.id}, Type: ${row.event_type}, Meta: ${JSON.stringify(row.metadata)}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

checkEvents();
