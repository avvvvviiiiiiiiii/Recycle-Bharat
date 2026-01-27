const { pool } = require('./src/config/db');

async function testAuditQuery() {
    console.log('Testing Audit Query for common owners...');

    try {
        // Find a user with devices
        const usersRes = await pool.query('SELECT id, email FROM users LIMIT 5');
        for (const user of usersRes.rows) {
            console.log(`\nChecking activity for User ID ${user.id} (${user.email})`);

            const result = await pool.query(
                `SELECT 
                    le.id, 
                    le.device_id, 
                    le.event_type as action, 
                    le.metadata as details, 
                    d.owner_id
                 FROM lifecycle_events le
                 JOIN devices d ON le.device_id = d.id
                 WHERE d.owner_id = $1 OR le.triggered_by_user_id = $1
                 ORDER BY le.timestamp DESC`,
                [user.id]
            );

            if (result.rowCount > 0) {
                console.log(`Found ${result.rowCount} events:`);
                result.rows.forEach(r => {
                    console.log(`- ID: ${r.id}, Action: ${r.action}, Owner: ${r.owner_id}, MetadataUID: ${r.details?.uid}`);
                });
            } else {
                console.log('No events found.');
            }
        }
    } catch (err) {
        console.error('Test failed:', err);
    } finally {
        await pool.end();
    }
}

testAuditQuery();
