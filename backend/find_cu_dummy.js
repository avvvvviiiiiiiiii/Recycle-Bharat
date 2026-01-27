const { pool } = require('./src/config/db');

async function findUser() {
    try {
        const res = await pool.query("SELECT id, full_name, email, organization, role FROM users WHERE email = 'cu_dummy@gmail.com' OR full_name = 'CU_dummy'");
        console.log('--- USER DATA ---');
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
findUser();
