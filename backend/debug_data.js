const { pool } = require('./src/config/db');

async function check() {
    try {
        const requests = await pool.query("SELECT * FROM recycling_requests WHERE status != 'PENDING' LIMIT 5");
        console.log('--- RECYCLING REQUESTS ---');
        console.log(JSON.stringify(requests.rows, null, 2));

        const assignments = await pool.query("SELECT * FROM collector_assignments LIMIT 5");
        console.log('--- COLLECTOR ASSIGNMENTS ---');
        console.log(JSON.stringify(assignments.rows, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
