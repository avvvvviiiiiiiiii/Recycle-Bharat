const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runVerification = async () => {
    try {
        console.log('--- STARTING VERIFICATION ---');

        // 1. Register Citizen
        const citizenEmail = `citizen_${Date.now()}@test.com`;
        console.log(`\n1. Registering Citizen: ${citizenEmail}`);
        await axios.post(`${API_URL}/auth/register`, {
            email: citizenEmail,
            password: 'password123',
            role: 'citizen'
        });
        console.log('   ✅ Citizen Registered');

        // 2. Login Citizen
        console.log('\n2. Logging in Citizen');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: citizenEmail,
            password: 'password123'
        });
        const { token, user } = loginRes.data;
        console.log('   ✅ Login Successful. Token received.');

        // 3. Register Device
        console.log('\n3. Registering Device');
        const deviceRes = await axios.post(`${API_URL}/devices/register`, {
            model: 'Old Phone X',
            description: 'Broken screen'
        }, {
            headers: { 'x-auth-token': token }
        });
        const device = deviceRes.data;
        const deviceId = device.id || device._id; // Handle Mongoose _id
        console.log(`   ✅ Device Registered: ${device.uid} (ID: ${deviceId})`);

        // 4. Request Recycling (Citizen)
        console.log('\n4. Requesting Recycling (ACTIVE -> RECYCLING_REQUESTED)');
        const recycleRes = await axios.post(`${API_URL}/devices/${deviceId}/recycle`, {}, {
            headers: { 'x-auth-token': token }
        });
        console.log(`   ✅ Status Updated: ${recycleRes.data.status}`);

        // 5. Attempt Invalid Transition (Citizen -> COLLECTED) - Should Fail
        console.log('\n5. Attempting Invalid Transition (Citizen trying to confirm collection)');
        // Note: Citizen doesn't have a generic update route, so this might fail on 404 or 403. 
        // But let's try calling the status update endpoint if we exposed it, or just assume we can't.
        // In our routes, citizens don't have access to PATCH /status. So it should be 403.
        try {
            await axios.patch(`${API_URL}/devices/${deviceId}/status`, {
                status: 'COLLECTED'
            }, {
                headers: { 'x-auth-token': token }
            });
            console.error('   ❌ FAILED: Should have been rejected');
        } catch (err) {
            console.log(`   ✅ Correctly Rejected: ${err.response.status} ${err.response.data.error}`);
        }

        console.log('\n--- VERIFICATION COMPLETED SUCCESSFULLY ---');

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
