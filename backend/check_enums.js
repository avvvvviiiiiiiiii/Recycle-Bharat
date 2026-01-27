const { pool } = require('./src/config/db');

async function checkEnums() {
    try {
        console.log('--- Checking Enums ---');
        const res = await pool.query(`
            SELECT t.typname as enum_name, e.enumlabel as enum_value
            FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        `);
        res.rows.forEach(r => console.log(`${r.enum_name}: ${r.enum_value}`));

        console.log('\n--- Checking Device Table Columns ---');
        const cols = await pool.query(`
            SELECT column_name, udt_name 
            FROM information_schema.columns 
            WHERE table_name = 'devices'
        `);
        cols.rows.forEach(r => console.log(`${r.column_name}: ${r.udt_name}`));

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

checkEnums();
