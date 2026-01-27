require('dotenv').config();
const app = require('./src/app');
const { pool } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Test DB Connection
pool.connect()
    .then(client => {
        console.log('✅ Connected to PostgreSQL Database');
        client.release();
    })
    .catch(err => console.error('❌ Database Connection Error:', err));

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
