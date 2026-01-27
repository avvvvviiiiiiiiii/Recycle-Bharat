const { pool } = require('./src/config/db');

async function checkSchema() {
    try {
        console.log('--- Columns in lifecycle_events ---');
        const columns = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'lifecycle_events'
        `);
        columns.rows.forEach(r => console.log(`${r.column_name} (${r.data_type})`));
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

checkSchema();
