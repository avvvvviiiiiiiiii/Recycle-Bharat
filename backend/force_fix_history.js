const { pool } = require('./src/config/db');

async function forceFixHistory() {
    console.log('🚀 Starting Force Global History Fix...');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Disable trigger
        console.log('1. Temporarily disabling update protection trigger...');
        await client.query('ALTER TABLE lifecycle_events DISABLE TRIGGER trg_prevent_updates');

        // Fix metadata
        console.log('2. Syncing metadata with device UIDs...');
        const fixRes = await client.query(`
            UPDATE lifecycle_events le
            SET metadata = (COALESCE(le.metadata::jsonb, '{}'::jsonb) || jsonb_build_object('uid', d.device_uid))
            FROM devices d
            WHERE le.device_id = d.id 
            AND (le.metadata::jsonb->>'uid' = 'UNKNOWN' OR le.metadata::jsonb->>'uid' IS NULL)
        `);
        console.log(`✅ Fixed ${fixRes.rowCount} records.`);

        // Fix event types
        console.log('3. Normalizing event types...');
        await client.query(`
            UPDATE lifecycle_events 
            SET event_type = 'STATUS_CHANGE' 
            WHERE event_type IN ('state_transition', 'status_update', 'STATE_CHANGE')
        `);

        // Re-enable trigger
        console.log('4. Re-enabling update protection trigger...');
        await client.query('ALTER TABLE lifecycle_events ENABLE TRIGGER trg_prevent_updates');

        await client.query('COMMIT');
        console.log('✨ Force fix completed successfully!');

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error during force fix:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

forceFixHistory();
