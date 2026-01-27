const { pool } = require('./src/config/db');

async function check() {
    try {
        const res = await pool.query("SELECT id, email, full_name, organization FROM users WHERE email = 'cu_dummy@gmail.com'");
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
