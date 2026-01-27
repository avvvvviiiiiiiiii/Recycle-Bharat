const { pool } = require('./src/config/db');

async function fixEventDataSafe() {
    try {
        console.log('--- Fixing Event Data Safe ---');

        // 1. Check Metadata Column Type
        const colRes = await pool.query(`
            SELECT data_type 
            FROM information_schema.columns 
            WHERE table_name = 'lifecycle_events' AND column_name = 'metadata'
        `);
        console.log('Metadata column type:', colRes.rows[0]?.data_type);

        // 2. Normal Updates
        await pool.query(`UPDATE lifecycle_events SET event_type = 'STATUS_CHANGE' WHERE event_type = 'STATE_TRANSITION'`);
        await pool.query(`UPDATE lifecycle_events SET event_type = 'DEVICE_REGISTERED' WHERE event_type = 'DEVICE_REGISTRATION'`);
        console.log('✅ Event types normalized.');

        // 3. Simple Backfill (One by one to avoid complex join errors if any)
        const rows = await pool.query(`SELECT id, device_id, event_type, from_state, to_state FROM lifecycle_events WHERE metadata IS NULL`);
        console.log(`Found ${rows.rowCount} rows with missing metadata.`);

        for (const row of rows.rows) {
            // Fetch device uid
            const devRes = await pool.query(`SELECT device_uid, model FROM devices WHERE id = $1`, [row.device_id]);
            if (devRes.rows.length === 0) continue;

            const device = devRes.rows[0];
            let meta = {};

            if (row.event_type === 'STATUS_CHANGE') {
                meta = {
                    uid: device.device_uid,
                    oldStatus: row.from_state || 'UNKNOWN',
                    newStatus: row.to_state || 'UNKNOWN'
                };
            } else if (row.event_type === 'DEVICE_REGISTERED') {
                meta = {
                    uid: device.device_uid,
                    model: device.model
                };
            }

            await pool.query(`UPDATE lifecycle_events SET metadata = $1 WHERE id = $2`, [JSON.stringify(meta), row.id]);
        }
        console.log('✅ Manual Node.js backfill complete.');

    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        pool.end();
    }
}

fixEventDataSafe();
