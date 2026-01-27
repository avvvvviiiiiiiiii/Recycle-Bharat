const { pool } = require('./src/config/db');
const crypto = require('crypto');

async function debugRegistration() {
    try {
        console.log('--- Starting Debug Registration V2 ---');

        const userRes = await pool.query('SELECT id FROM users LIMIT 1');
        const owner_id = userRes.rows[0].id;

        const device_uid = `TEST-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        console.log('Attempting Device Insert with GENERATED...');
        try {
            await pool.query(
                `INSERT INTO devices (owner_id, device_type, brand, model, purchase_year, serial_number, device_uid, device_uid_origin, current_state) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, 'GENERATED', 'ACTIVE') 
                RETURNING *`,
                [owner_id, 'Smartphone', 'DebugBrand', 'DebugModel', 2024, 'SN-123', device_uid]
            );
            console.log('✅ GENERATED worked.');
        } catch (e) {
            console.log('❌ GENERATED failed:', e.message);
        }

        console.log('Attempting Device Insert with MANUFACTURER...');
        try {
            await pool.query(
                `INSERT INTO devices (owner_id, device_type, brand, model, purchase_year, serial_number, device_uid, device_uid_origin, current_state) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, 'MANUFACTURER', 'ACTIVE') 
                RETURNING *`,
                [owner_id, 'Smartphone', 'DebugBrand', 'DebugModel', 2024, 'SN-456', device_uid + '_2']
            );
            console.log('✅ MANUFACTURER worked.');
        } catch (e) {
            console.log('❌ MANUFACTURER failed:', e.message);
        }

    } catch (err) {
        console.error('Final Error:', err);
    } finally {
        pool.end();
    }
}

debugRegistration();
