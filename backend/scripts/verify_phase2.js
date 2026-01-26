const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runVerification = async () => {
    try {
        console.log('--- STARTING PHASE 2 VERIFICATION ---');

        // 1. Register Recycler (needed for testing Recycler flow)
        const recyclerEmail = `recycler_${Date.now()}@test.com`;
        console.log(`\n1. Registering Recycler: ${recyclerEmail}`);
        await axios.post(`${API_URL}/auth/register`, {
            email: recyclerEmail,
            password: 'password123',
            role: 'recycler'
        });
        console.log('   ✅ Recycler Registered');

        // 2. Login Recycler
        const recyclerLogin = await axios.post(`${API_URL}/auth/login`, {
            email: recyclerEmail, password: 'password123'
        });
        const recyclerToken = recyclerLogin.data.token;
        console.log('   ✅ Recycler Logged In');

        // 3. Register Citizen & Device (Simulating Citizen Flow)
        const citizenEmail = `citizen_p2_${Date.now()}@test.com`;
        const citizenLogin = await axios.post(`${API_URL}/auth/register`, { email: citizenEmail, password: 'pw', role: 'citizen' });
        // Auto-login logic isn't in backend register, so login manually
        const loginRes = await axios.post(`${API_URL}/auth/login`, { email: citizenEmail, password: 'pw' });
        const citizenToken = loginRes.data.token;

        console.log(`\n2. Citizen Registered & Logged In: ${citizenEmail}`);

        const deviceRes = await axios.post(`${API_URL}/devices/register`,
            { model: 'Phase 2 Test Device', description: 'Testing Recycler Flow' },
            { headers: { 'x-auth-token': citizenToken } }
        );
        const deviceId = deviceRes.data.id || deviceRes.data._id;
        console.log(`   ✅ Device Registered: ${deviceId}`);

        // 4. Request Recycling (Citizen)
        await axios.post(`${API_URL}/devices/${deviceId}/recycle`, {}, { headers: { 'x-auth-token': citizenToken } });
        console.log('   ✅ Recycling Requested');

        // 5. Verify Recycler Can See It (The New Feature)
        console.log('\n3. Verifying Recycler View (GET /devices/pending)');
        const pendingRes = await axios.get(`${API_URL}/devices/pending`, {
            headers: { 'x-auth-token': recyclerToken }
        });

        const found = pendingRes.data.find(d => d._id === deviceId || d.id === deviceId);
        if (found) {
            console.log(`   ✅ Recycler found pending device: ${found.model} (Status: ${found.status})`);
            console.log(`   ✅ Owner Email populated: ${found.ownerId.email}`);
        } else {
            throw new Error('Device not found in pending list');
        }

        // 6. Assign Collector (Recycler Action)
        console.log('\n4. Recycler Assigns Collector');
        await axios.patch(`${API_URL}/devices/${deviceId}/status`,
            { status: 'COLLECTOR_ASSIGNED' },
            { headers: { 'x-auth-token': recyclerToken } }
        );
        console.log('   ✅ Status updated to COLLECTOR_ASSIGNED');

        console.log('\n--- PHASE 2 VERIFICATION SUCCESSFUL ---');

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
