const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('ssl=true') ? {
        rejectUnauthorized: false
    } : false
});

// Test the connection
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL Database');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    process.exit(-1);
});

// Helper for querying
const query = (text, params) => pool.query(text, params);

module.exports = {
    query,
    pool
};
