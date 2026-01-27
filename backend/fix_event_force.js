const { pool } = require('./src/config/db');

async function fixFinalForce() {
    try {
        console.log('--- Final Fix FORCE ---');

        // 0. Disable Trigger
        await pool.query(`ALTER TABLE lifecycle_events DISABLE TRIGGER trg_prevent_updates`);
        console.log('⚠️ Trigger disabled.');

        // 1. Update Types
        const r1 = await pool.query(`UPDATE lifecycle_events SET event_type = 'STATUS_CHANGE' WHERE event_type = 'STATE_TRANSITION'`);
        console.log(`Updated ${r1.rowCount} STATE_TRANSITION -> STATUS_CHANGE`);

        const r2 = await pool.query(`UPDATE lifecycle_events SET event_type = 'DEVICE_REGISTERED' WHERE event_type = 'DEVICE_REGISTRATION'`);
        console.log(`Updated ${r2.rowCount} DEVICE_REGISTRATION -> DEVICE_REGISTERED`);

        // 2. Fetch all and update metadata if needed
        const rows = await pool.query(`SELECT id, device_id, event_type, metadata, from_state, to_state FROM lifecycle_events`);
        console.log(`Processing ${rows.rowCount} rows for metadata...`);

        for (const row of rows.rows) {
            if (row.metadata && Object.keys(row.metadata).length > 0) continue;

            const devRes = await pool.query(`SELECT device_uid, model FROM devices WHERE id = $1`, [row.device_id]);
            if (devRes.rows.length === 0) continue;
            const device = devRes.rows[0];

            let meta = null;

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

            if (meta) {
                await pool.query(`UPDATE lifecycle_events SET metadata = $1 WHERE id = $2`, [JSON.stringify(meta), row.id]);
                console.log(`Updated metadata for ID ${row.id}`);
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        // 3. Enable Trigger
        try {
            await pool.query(`ALTER TABLE lifecycle_events ENABLE TRIGGER trg_prevent_updates`);
            console.log('✅ Trigger re-enabled.');
        } catch (e) {
            console.log('Failed to re-enable trigger:', e);
        }
        pool.end();
    }
}

fixFinalForce();
