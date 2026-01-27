const { pool } = require('./src/config/db');
const crypto = require('crypto');

async function debugRegistration() {
    try {
        console.log('--- Starting Debug Registration ---');

        // 1. Get a user
        const userRes = await pool.query('SELECT id FROM users LIMIT 1');
        if (userRes.rows.length === 0) {
            console.log('No users found to test with.');
            return;
        }
        const owner_id = userRes.rows[0].id;
        console.log('Test User ID:', owner_id);

        // 2. Prepare Data
        const device_uid = `TEST-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
        const device_type = 'Smartphone';
        const brand = 'DebugBrand';
        const model = 'DebugModel';
        const purchase_year = 2024;
        const serial_number = 'SN-12345';

        console.log('Attempting Device Insert...');
        // 3. Insert Device
        const newDevice = await pool.query(
            `INSERT INTO devices (owner_id, device_type, brand, model, purchase_year, serial_number, device_uid, device_uid_origin, current_state) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'GENERATED', 'ACTIVE') 
            RETURNING *`,
            [owner_id, device_type, brand, model, purchase_year, serial_number, device_uid]
        );
        console.log('✅ Device Inserted. ID:', newDevice.rows[0].id);

        // 4. Insert Lifecycle Event
        console.log('Attempting Lifecycle Event Insert...');
        await pool.query(
            `INSERT INTO lifecycle_events (device_id, to_state, triggered_by_user_id, event_type, metadata)
            VALUES ($1, 'ACTIVE', $2, 'DEVICE_REGISTERED', $3)`,
            [newDevice.rows[0].id, owner_id, JSON.stringify({ uid: newDevice.rows[0].device_uid, model: model })]
        );
        console.log('✅ Lifecycle Event Inserted.');

        // Clean up
        await pool.query('DELETE FROM lifecycle_events WHERE device_id = $1', [newDevice.rows[0].id]);
        await pool.query('DELETE FROM devices WHERE id = $1', [newDevice.rows[0].id]);
        console.log('Cleaned up test data.');

    } catch (err) {
        console.error('❌ ERROR CAUGHT:');
        console.error(err.message);
        console.error('Full Error:', err);
    } finally {
        pool.end();
    }
}

debugRegistration();
