const { pool } = require('./src/config/db');
require('dotenv').config();

const checkTables = async () => {
    try {
        const tables = ['users', 'devices', 'recycling_requests', 'collector_assignments', 'lifecycle_events'];
        for (const table of tables) {
            try {
                const res = await pool.query(`SELECT count(*) FROM ${table}`);
                console.log(`✅ Table '${table}' exists. Row count: ${res.rows[0].count}`);
            } catch (err) {
                console.error(`❌ Table '${table}' missing or error: ${err.message}`);

                if (err.message.includes('does not exist')) {
                    console.log(`Table ${table} is missing!`);
                }
            }
        }
        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    }
};

checkTables();
