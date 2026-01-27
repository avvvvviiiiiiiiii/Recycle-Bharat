const { pool } = require('./src/config/db');

async function diagnose() {
    try {
        console.log('--- Tables ---');
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        tables.rows.forEach(r => console.log(r.table_name));

        console.log('\n--- Columns in devices ---');
        const columns = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'devices'
        `);
        columns.rows.forEach(r => console.log(`${r.column_name} (${r.data_type})`));

        console.log('\n--- Columns in audit_logs (if exists) ---');
        const auditCols = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'audit_logs'
        `);
        if (auditCols.rows.length === 0) console.log('audit_logs table NOT found');
        else auditCols.rows.forEach(r => console.log(`${r.column_name} (${r.data_type})`));

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

diagnose();
