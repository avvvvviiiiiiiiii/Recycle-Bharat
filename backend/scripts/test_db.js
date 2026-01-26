const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('URI:', process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connection Successful!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
        console.error(err);
        process.exit(1);
    }
};

testConnection();
