const { pool } = require('./src/config/db');
const crypto = require('crypto');

async function debugFullFlow() {
    try {
        console.log('--- Debugging Full Controller Flow ---');
        const userRes = await pool.query('SELECT id FROM users LIMIT 1');
        const owner_id = userRes.rows[0].id;

        const device_uid = crypto.randomUUID();
        const model = 'DebugModelFull';

        // 1. Insert Device
        console.log('1. Inserting Device...');
        const newDevice = await pool.query(
            `INSERT INTO devices (owner_id, device_type, brand, model, purchase_year, serial_number, device_uid, device_uid_origin, current_state) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'MANUFACTURER', 'ACTIVE') 
            RETURNING *`,
            [owner_id, 'Smartphone', 'DebugBrand', model, 2024, 'SN-FULL', device_uid]
        );
        console.log('✅ Device ID:', newDevice.rows[0].id);

        // 2. Insert Lifecycle Event
        console.log('2. Inserting Lifecycle Event...');
        await pool.query(
            `INSERT INTO lifecycle_events (device_id, to_state, triggered_by_user_id, event_type, metadata)
            VALUES ($1, 'ACTIVE', $2, 'DEVICE_REGISTERED', $3)`,
            [newDevice.rows[0].id, owner_id, JSON.stringify({ uid: newDevice.rows[0].device_uid, model: model })]
        );
        console.log('✅ Lifecycle Event Inserted');

        // Cleanup
        await pool.query('DELETE FROM lifecycle_events WHERE device_id = $1', [newDevice.rows[0].id]);
        await pool.query('DELETE FROM devices WHERE id = $1', [newDevice.rows[0].id]);

    } catch (err) {
        console.error('❌ FAILED:', err.message);
        console.error(err);
    } finally {
        pool.end();
    }
}

debugFullFlow();
