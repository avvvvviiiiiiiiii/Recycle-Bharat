const { Pool } = require('pg');
require('dotenv').config();

async function listLogins() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        const res = await pool.query('SELECT id, email, full_name, role, organization, created_at FROM users ORDER BY created_at DESC');

        console.log(`Total users found: ${res.rows.length}\n`);

        res.rows.forEach((user, index) => {
            console.log(`${index + 1}. [${user.role}] ${user.full_name} (${user.email})`);
            console.log(`   Org/Aadhar: ${user.organization || 'N/A'}`);
            console.log(`   Registered: ${user.created_at}`);
            console.log('-----------------------------------');
        });

    } catch (err) {
        console.error('Error fetching users:', err.message);
    } finally {
        await pool.end();
    }
}

listLogins();
