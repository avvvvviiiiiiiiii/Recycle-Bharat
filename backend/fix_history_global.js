const { pool } = require('./src/config/db');

async function fixHistoryAndMetadata() {
    console.log('Starting Global History & Metadata Fix...');

    try {
        // 1. Fix "UNKNOWN" in metadata for all records
        console.log('Step 1: Fixing UNKNOWN UIDs in lifecycle_events...');
        const updateRes = await pool.query(`
            UPDATE lifecycle_events le
            SET metadata = (le.metadata::jsonb || jsonb_build_object('uid', d.device_uid))
            FROM devices d
            WHERE le.device_id = d.id 
            AND (le.metadata::jsonb->>'uid' = 'UNKNOWN' OR le.metadata::jsonb->>'uid' IS NULL)
            RETURNING le.id;
        `);
        console.log(`Updated ${updateRes.rowCount} records with correct context.`);

        // 2. Ensure all event types are normalized for display
        console.log('Step 2: Normalizing event types...');
        // (Just in case some are lowercase or slightly different)
        await pool.query(`
            UPDATE lifecycle_events 
            SET event_type = 'STATUS_CHANGE' 
            WHERE event_type IN ('state_transition', 'status_update', 'Status Update');
        `);

        // 3. Inspect the data for a specific owner if possible (optional debug)
        const recentEvents = await pool.query(`
            SELECT le.*, d.owner_id, d.device_uid 
            FROM lifecycle_events le 
            JOIN devices d ON le.device_id = d.id 
            ORDER BY le.timestamp DESC LIMIT 10
        `);
        console.log('Recent events inspection:');
        console.table(recentEvents.rows.map(r => ({
            id: r.id,
            owner: r.owner_id,
            triggered_by: r.triggered_by_user_id,
            type: r.event_type,
            uid: r.metadata.uid,
            to: r.to_state
        })));

    } catch (err) {
        console.error('Error during fix:', err);
    } finally {
        await pool.end();
    }
}

fixHistoryAndMetadata();
