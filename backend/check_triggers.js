const { pool } = require('./src/config/db');

async function checkTriggers() {
    try {
        console.log('--- Triggers ---');
        const res = await pool.query(`
            SELECT event_object_table, trigger_name 
            FROM information_schema.triggers
        `);
        res.rows.forEach(r => console.log(`${r.event_object_table}: ${r.trigger_name}`));
    } catch (err) { console.error(err); } finally { pool.end(); }
}
checkTriggers();
