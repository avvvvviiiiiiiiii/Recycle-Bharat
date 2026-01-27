const { pool } = require('./src/config/db');

async function fixEventData() {
    try {
        console.log('--- Fixing Event Data ---');

        // 1. Fix Event Types
        await pool.query(`UPDATE lifecycle_events SET event_type = 'STATUS_CHANGE' WHERE event_type = 'STATE_TRANSITION'`);
        await pool.query(`UPDATE lifecycle_events SET event_type = 'DEVICE_REGISTERED' WHERE event_type = 'DEVICE_REGISTRATION'`);
        console.log('✅ Event types normalized.');

        // 2. Backfill Metadata for STATUS_CHANGE
        // We join with devices to get UID, and use from_state/to_state columns
        const updateStatusChange = `
            UPDATE lifecycle_events le
            SET metadata = json_build_object(
                'uid', d.device_uid,
                'oldStatus', le.from_state,
                'newStatus', le.to_state
            )
            FROM devices d
            WHERE le.device_id = d.id
            AND le.event_type = 'STATUS_CHANGE'
            AND (le.metadata IS NULL OR le.metadata::text = '{}'::text);
        `;
        const res1 = await pool.query(updateStatusChange);
        console.log(`✅ Backfilled metadata for ${res1.rowCount} status changes.`);

        // 3. Backfill Metadata for DEVICE_REGISTERED
        const updateRegistration = `
            UPDATE lifecycle_events le
            SET metadata = json_build_object(
                'uid', d.device_uid,
                'model', d.model
            )
            FROM devices d
            WHERE le.device_id = d.id
            AND le.event_type = 'DEVICE_REGISTERED'
            AND (le.metadata IS NULL OR le.metadata::text = '{}'::text);
        `;
        const res2 = await pool.query(updateRegistration);
        console.log(`✅ Backfilled metadata for ${res2.rowCount} registrations.`);

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        pool.end();
    }
}

fixEventData();
