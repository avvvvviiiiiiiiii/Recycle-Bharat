const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runVerification = async () => {
    try {
        console.log('--- STARTING PHASE 3 VERIFICATION ---');

        // 1. Register Collector
        const collectorEmail = `collector_${Date.now()}@test.com`;
        console.log(`\n1. Registering Collector: ${collectorEmail}`);
        await axios.post(`${API_URL}/auth/register`, {
            email: collectorEmail,
            password: 'password123',
            role: 'collector'
        });

        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: collectorEmail, password: 'password123'
        });
        const collectorToken = loginRes.data.token;
        console.log('   ✅ Collector Logged In');

        // 2. Setup Data: Citizen -> Request -> Recycler -> Assign
        // We reuse the Recycler functionality from Phase 2 to create a task
        const recyclerEmail = `recycler_helper_${Date.now()}@test.com`;
        await axios.post(`${API_URL}/auth/register`, { email: recyclerEmail, password: 'pw', role: 'recycler' });
        const recyclerLogin = await axios.post(`${API_URL}/auth/login`, { email: recyclerEmail, password: 'pw' });
        const recyclerToken = recyclerLogin.data.token;

        const citizenEmail = `citizen_helper_${Date.now()}@test.com`;
        await axios.post(`${API_URL}/auth/register`, { email: citizenEmail, password: 'pw', role: 'citizen' });
        const citizenLogin = await axios.post(`${API_URL}/auth/login`, { email: citizenEmail, password: 'pw' });
        const citizenToken = citizenLogin.data.token;

        const deviceRes = await axios.post(`${API_URL}/devices/register`,
            { model: 'Phase 3 Pickup Item', description: 'Pending Pickup' },
            { headers: { 'x-auth-token': citizenToken } }
        );
        const deviceId = deviceRes.data.id || deviceRes.data._id;

        await axios.post(`${API_URL}/devices/${deviceId}/recycle`, {}, { headers: { 'x-auth-token': citizenToken } });

        // Recycler Assigns
        await axios.patch(`${API_URL}/devices/${deviceId}/status`,
            { status: 'COLLECTOR_ASSIGNED' },
            { headers: { 'x-auth-token': recyclerToken } }
        );
        console.log('   ✅ Setup: Device is in COLLECTOR_ASSIGNED state');

        // 3. Collector View Assigned (GET /assigned)
        console.log('\n2. Verifying Collector View (GET /devices/assigned)');
        const assignedRes = await axios.get(`${API_URL}/devices/assigned`, {
            headers: { 'x-auth-token': collectorToken }
        });
        const task = assignedRes.data.find(d => d._id === deviceId || d.id === deviceId);
        if (task) {
            console.log(`   ✅ Collector found assigned task: ${task.model}`);
        } else {
            throw new Error('Task not found in assigned list');
        }

        // 4. Confirm Pickup
        console.log('\n3. Collector Confirms Pickup (-> COLLECTED)');
        const pickupRes = await axios.patch(`${API_URL}/devices/${deviceId}/status`,
            { status: 'COLLECTED' },
            { headers: { 'x-auth-token': collectorToken } }
        );
        console.log(`   ✅ Status updated to: ${pickupRes.data.status}`);

        // 5. Confirm Delivery (Phase 3 Complete)
        console.log('\n4. Collector Confirms Delivery (-> DELIVERED_TO_RECYCLER)');
        const deliveryRes = await axios.patch(`${API_URL}/devices/${deviceId}/status`,
            { status: 'DELIVERED_TO_RECYCLER' },
            { headers: { 'x-auth-token': collectorToken } }
        );
        console.log(`   ✅ Status updated to: ${deliveryRes.data.status}`);

        console.log('\n--- PHASE 3 VERIFICATION SUCCESSFUL ---');

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
