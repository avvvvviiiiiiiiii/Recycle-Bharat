require('dotenv').config();
const app = require('./src/app');
const { pool } = require('./src/config/db');
// const initIncentiveSubscriber = require('./src/subscribers/incentiveSubscriber'); // Commenting out until refactored

// Initialize Event Subscribers
// initIncentiveSubscriber();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Test DB Connection
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Database connected:', res.rows[0].now);

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error('❌ Database connection failed', err);
        process.exit(1);
    }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Server shutting down');
    await pool.end();
    process.exit(0);
});
