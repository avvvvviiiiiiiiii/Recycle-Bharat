const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runVerification = async () => {
    try {
        console.log('--- STARTING PHASE 5 VERIFICATION (Analytics) ---');

        // 1. Setup Participants
        const govEmail = `official_${Date.now()}@test.com`;
        await axios.post(`${API_URL}/auth/register`, { email: govEmail, password: 'pw', role: 'government' });
        const govLogin = await axios.post(`${API_URL}/auth/login`, { email: govEmail, password: 'pw' });
        const govToken = govLogin.data.token;
        console.log(`1. Registered & Logged in Official: ${govEmail}`);

        const citizenEmail = `citizen_v5_${Date.now()}@test.com`;
        await axios.post(`${API_URL}/auth/register`, { email: citizenEmail, password: 'pw', role: 'citizen' });
        const citizenLogin = await axios.post(`${API_URL}/auth/login`, { email: citizenEmail, password: 'pw' });
        const citizenToken = citizenLogin.data.token;
        console.log(`2. Registered Citizen: ${citizenEmail}`);

        // 2. Test RBAC (Unauthorized access)
        console.log('\n3. Testing RBAC (Citizen accessing Stats)...');
        try {
            await axios.get(`${API_URL}/stats`, { headers: { 'x-auth-token': citizenToken } });
            throw new Error('FAILED: Citizen was allowed to access stats');
        } catch (err) {
            if (err.response?.status === 403 || err.response?.status === 400 || err.response?.status === 401) {
                console.log(`   ✅ Correctly Rejected: ${err.response.status}`);
            } else {
                throw err;
            }
        }

        // 3. Verify Data Aggregation
        console.log('\n4. Verifying Data Aggregation (Official access)...');
        const statsRes = await axios.get(`${API_URL}/stats`, { headers: { 'x-auth-token': govToken } });
        const initialCount = statsRes.data.totalDevices;
        console.log(`   ✅ Initial Device Count: ${initialCount}`);

        // Register a new device to see if stats update
        await axios.post(`${API_URL}/devices/register`,
            { model: 'Stat Proof Device', description: 'Phase 5' },
            { headers: { 'x-auth-token': citizenToken } }
        );

        const updatedRes = await axios.get(`${API_URL}/stats`, { headers: { 'x-auth-token': govToken } });
        if (updatedRes.data.totalDevices === initialCount + 1) {
            console.log(`   ✅ Stats updated correctly: ${updatedRes.data.totalDevices} Total Devices`);
        } else {
            throw new Error(`Stats did not update properly. Expected ${initialCount + 1}, got ${updatedRes.data.totalDevices}`);
        }

        console.log('   ✅ Analytics Data Structure Validated');
        console.log(`   ✅ Recycled Devices: ${updatedRes.data.recycledDevices}`);
        console.log(`   ✅ Recycling Rate: ${updatedRes.data.recyclingRate.toFixed(2)}%`);

        console.log('\n--- PHASE 5 VERIFICATION SUCCESSFUL ---');

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
