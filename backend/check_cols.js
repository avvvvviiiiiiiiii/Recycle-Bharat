const { pool } = require('./src/config/db');
require('dotenv').config();

const checkColumns = async () => {
    try {
        const tables = ['users', 'devices', 'recycling_requests', 'collector_assignments', 'lifecycle_events'];
        for (const table of tables) {
            const res = await pool.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = '${table}'
            `);
            console.log(`\n--- Columns for ${table} ---`);
            res.rows.forEach(col => console.log(`${col.column_name} (${col.data_type})`));
        }
        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    }
};

checkColumns();
