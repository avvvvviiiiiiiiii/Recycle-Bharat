const { pool } = require('./src/config/db');

async function checkTypes() {
    try {
        const res = await pool.query(`SELECT DISTINCT event_type FROM lifecycle_events`);
        console.log('Types:', res.rows.map(r => r.event_type));
    } catch (err) { console.error(err); } finally { pool.end(); }
}
checkTypes();
