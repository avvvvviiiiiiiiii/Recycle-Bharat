const { pool } = require('./src/config/db');

async function listSchema() {
    try {
        console.log('--- TABLES ---');
        const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        for (const table of tables.rows) {
            console.log(`\nTable: ${table.table_name}`);
            const columns = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table.table_name}'`);
            columns.rows.forEach(col => {
                console.log(`  - ${col.column_name} (${col.data_type})`);
            });
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
listSchema();
