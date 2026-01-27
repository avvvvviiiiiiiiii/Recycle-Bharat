const { pool } = require('./src/config/db');
const IncentiveService = require('./src/services/incentiveService');

async function pushPendingRewards() {
    console.log('Final Polish: Checking for pending rewards on delivered devices...');

    try {
        // Find devices that are at facility but don't have a reward yet
        const pending = await pool.query(`
            SELECT d.id, d.owner_id, d.model 
            FROM devices d
            LEFT JOIN incentives i ON i.device_id = d.id
            WHERE d.current_state IN ('DELIVERED_TO_RECYCLER', 'RECYCLED')
            AND i.id IS NULL
        `);

        console.log(`Found ${pending.rowCount} devices awaiting reward synchronization.`);

        for (const dev of pending.rows) {
            console.log(`Synchronizing reward for ${dev.model} (Owner: ${dev.owner_id})...`);
            await IncentiveService.issueReward({ userId: dev.owner_id, deviceId: dev.id });
        }

        console.log('✅ Synchronization complete.');

    } catch (err) {
        console.error('Sync failed:', err);
    } finally {
        await pool.end();
    }
}

pushPendingRewards();
