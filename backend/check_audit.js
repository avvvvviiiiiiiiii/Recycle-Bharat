const { pool } = require('./src/config/db');

async function check() {
    try {
        const res = await pool.query("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 20");
        console.log('--- AUDIT LOGS ---');
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
