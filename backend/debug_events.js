const { pool } = require('./src/config/db');

async function checkEvents() {
    try {
        console.log('--- Current Lifecycle Events ---');
        const res = await pool.query(`
            SELECT id, event_type, metadata 
            FROM lifecycle_events 
            ORDER BY id DESC 
            LIMIT 10
        `);
        console.log(JSON.stringify(res.rows, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

checkEvents();
