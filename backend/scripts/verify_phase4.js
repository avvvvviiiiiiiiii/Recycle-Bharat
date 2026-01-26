const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runVerification = async () => {
    try {
        console.log('--- STARTING PHASE 4 VERIFICATION (Incentives) ---');

        // 1. Setup participants
        const citizenEmail = `citizen_p4_${Date.now()}@test.com`;
        await axios.post(`${API_URL}/auth/register`, { email: citizenEmail, password: 'pw', role: 'citizen' });
        const citizenLogin = await axios.post(`${API_URL}/auth/login`, { email: citizenEmail, password: 'pw' });
        const citizenToken = citizenLogin.data.token;
        const citizenId = citizenLogin.data.user.id;
        console.log(`\n1. Registered & Logged in Citizen: ${citizenEmail}`);

        const collectorEmail = `collector_p4_${Date.now()}@test.com`;
        await axios.post(`${API_URL}/auth/register`, { email: collectorEmail, password: 'pw', role: 'collector' });
        const collectorLogin = await axios.post(`${API_URL}/auth/login`, { email: collectorEmail, password: 'pw' });
        const collectorToken = collectorLogin.data.token;
        console.log(`2. Registered & Logged in Collector: ${collectorEmail}`);

        const recyclerEmail = `recycler_p4_${Date.now()}@test.com`;
        await axios.post(`${API_URL}/auth/register`, { email: recyclerEmail, password: 'pw', role: 'recycler' });
        const recyclerLogin = await axios.post(`${API_URL}/auth/login`, { email: recyclerEmail, password: 'pw' });
        const recyclerToken = recyclerLogin.data.token;
        console.log(`3. Registered & Logged in Recycler: ${recyclerEmail}`);

        // 2. Register Device
        const deviceRes = await axios.post(`${API_URL}/devices/register`,
            { model: 'Incentive Test Device', description: 'Testing Phase 4' },
            { headers: { 'x-auth-token': citizenToken } }
        );
        const deviceId = deviceRes.data.id || deviceRes.data._id;
        console.log(`\n4. Device Registered: ${deviceId}`);

        // 3. Complete Lifecycle
        console.log('\n5. Executing Lifecycle transitions...');

        // a. Citizen: Request Recycle
        await axios.post(`${API_URL}/devices/${deviceId}/recycle`, {}, { headers: { 'x-auth-token': citizenToken } });
        console.log('   -> RECYCLING_REQUESTED');

        // b. Recycler: Assign Collector
        await axios.patch(`${API_URL}/devices/${deviceId}/status`,
            { status: 'COLLECTOR_ASSIGNED' },
            { headers: { 'x-auth-token': recyclerToken } }
        );
        console.log('   -> COLLECTOR_ASSIGNED');

        // c. Collector: Confirm Pickup
        await axios.patch(`${API_URL}/devices/${deviceId}/status`,
            { status: 'COLLECTED' },
            { headers: { 'x-auth-token': collectorToken } }
        );
        console.log('   -> COLLECTED');

        // d. Collector: Deliver to Recycler (This triggers the INCENTIVE)
        console.log('   -> Triggering DELIVERY (Should trigger reward)');
        await axios.patch(`${API_URL}/devices/${deviceId}/status`,
            { status: 'DELIVERED_TO_RECYCLER' },
            { headers: { 'x-auth-token': collectorToken } }
        );
        console.log('   -> DELIVERED_TO_RECYCLER');

        // 4. Verify Incentive
        console.log('\n6. Verifying incentive issuance (GET /incentives/my-rewards)');
        // Wait a brief moment for the event subscriber to finish (since it's async in theory)
        await new Promise(resolve => setTimeout(resolve, 1000));

        const rewardsRes = await axios.get(`${API_URL}/incentives/my-rewards`, {
            headers: { 'x-auth-token': citizenToken }
        });

        const { balance, rewards } = rewardsRes.data;
        console.log(`   ✅ Balance: ${balance} Points`);

        const reward = rewards.find(r => r.deviceId?._id === deviceId || r.deviceId?.id === deviceId);
        if (reward) {
            console.log(`   ✅ Correct reward found for device: ${reward.deviceId.model}`);
            console.log(`   ✅ Reward Amount: ${reward.amount}`);
        } else {
            throw new Error('Reward not found for the completed device lifecycle.');
        }

        // 5. Test Idempotency (Moving to RECYCLED should NOT trigger another reward)
        console.log('\n7. Testing Idempotency (Moving to RECYCLED)');
        await axios.patch(`${API_URL}/devices/${deviceId}/status`,
            { status: 'RECYCLED' },
            { headers: { 'x-auth-token': recyclerToken } }
        );

        await new Promise(resolve => setTimeout(resolve, 500));

        const secondCheck = await axios.get(`${API_URL}/incentives/my-rewards`, {
            headers: { 'x-auth-token': citizenToken }
        });

        if (secondCheck.data.balance === balance) {
            console.log(`   ✅ Idempotency passed: Balance remained ${secondCheck.data.balance} (No double reward)`);
        } else {
            throw new Error(`Double reward issued! Balance jumped from ${balance} to ${secondCheck.data.balance}`);
        }

        console.log('\n--- PHASE 4 VERIFICATION SUCCESSFUL ---');

    } catch (err) {
        console.error('\n❌ VERIFICATION FAILED');
        if (err.response) {
            console.error(`Status: ${err.response.status}`);
            console.error('Data:', err.response.data);
        } else {
            console.error(err.message);
        }
    }
};

runVerification();
