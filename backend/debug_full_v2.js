const { pool } = require('./src/config/db');
const crypto = require('crypto');

async function debugFullFlow() {
    try {
        console.log('--- Debugging Full Controller Flow (Empty Serial) ---');
        const userRes = await pool.query('SELECT id FROM users LIMIT 1');
        const owner_id = userRes.rows[0].id;

        const device_uid = crypto.randomUUID();
        const model = 'DebugModelEmptySN';

        // Simulate empty serial number
        const serial_number = ''; // or undefined

        // 1. Insert Device
        console.log('1. Inserting Device...');
        const newDevice = await pool.query(
            `INSERT INTO devices (owner_id, device_type, brand, model, purchase_year, serial_number, device_uid, device_uid_origin, current_state) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'MANUFACTURER', 'ACTIVE') 
            RETURNING *`,
            [owner_id, 'Smartphone', 'DebugBrand', model, 2024, serial_number, device_uid]
        );
        console.log('✅ Device ID:', newDevice.rows[0].id);

        // Cleanup
        await pool.query('DELETE FROM devices WHERE id = $1', [newDevice.rows[0].id]);

    } catch (err) {
        console.error('❌ FAILED:', err.message);
    } finally {
        pool.end();
    }
}

debugFullFlow();
