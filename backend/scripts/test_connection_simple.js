const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
    console.log('Testing MongoDB Connection...');
    console.log('URI:', process.env.MONGO_URI);
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('SUCCESS: Connection established to MongoDB Atlas!');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE: Could not connect to MongoDB Atlas.');
        console.error('Error Name:', err.name);
        console.error('Error Message:', err.message);
        if (err.message.includes('IP not whitelisted')) {
            console.error('DETAILED DIAGNOSIS: Your current IP is not whitelisted in Atlas.');
        }
        process.exit(1);
    }
};

testConnection();
