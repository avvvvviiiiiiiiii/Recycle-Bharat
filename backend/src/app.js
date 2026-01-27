const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();


// Enforce restart to pick up authController changes
const app = express();

// Explicit CORS to prevent any blocking (MUST BE FIRST)
app.use(cors({
    origin: '*', // Allow all for dev
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-auth-token']
}));

// Security & Utility Middleware
app.use(helmet());
app.use(express.json());

// Helper Logger for Headers
app.use((req, res, next) => {
    // Only log api requests
    if (req.path.startsWith('/api')) {
        console.log(`[REQ] ${req.method} ${req.path}`);
        console.log(`[HEADERS] Type: ${req.headers['content-type']} | Auth: ${req.headers['authorization'] ? 'PRESENT' : 'MISSING'}`);
    }
    next();
});

// Health Check
app.get('/', (req, res) => {
    res.json({
        message: 'BharatRecycle API is running...',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/public', require('./routes/publicRoutes')); // Public routes (no auth)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/devices', require('./routes/deviceRoutes'));
app.use('/api/recycling', require('./routes/recyclingRoutes'));
app.use('/api/collector', require('./routes/collectorRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/incentives', require('./routes/incentiveRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/audit', require('./routes/auditRoutes'));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error_code: 'INTERNAL_ERROR',
        message: 'Something went wrong on the server',
        request_id: req.headers['x-request-id']
    });
});

module.exports = app;
