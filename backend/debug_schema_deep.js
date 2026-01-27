const { pool } = require('./src/config/db');

async function debugSchemaDeep() {
    try {
        console.log('--- Checking origin_type ENUM values ---');
        const enumRes = await pool.query(`
            SELECT e.enumlabel
            FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid  
            WHERE t.typname = 'origin_type'
        `);
        console.log('origin_type values:', enumRes.rows.map(r => r.enumlabel));

        console.log('\n--- Checking device_uid column type ---');
        const colRes = await pool.query(`
            SELECT column_name, data_type, udt_name
            FROM information_schema.columns 
            WHERE table_name = 'devices' AND column_name = 'device_uid'
        `);
        console.log('device_uid:', colRes.rows[0]);

        console.log('\n--- Checking device_uid_origin column type ---');
        const originRes = await pool.query(`
            SELECT column_name, data_type, udt_name
            FROM information_schema.columns 
            WHERE table_name = 'devices' AND column_name = 'device_uid_origin'
        `);
        console.log('device_uid_origin:', originRes.rows[0]);

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

debugSchemaDeep();
