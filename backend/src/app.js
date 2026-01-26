const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const incentiveRoutes = require('./routes/incentiveRoutes');
const statsRoutes = require('./routes/statsRoutes');
const auditRoutes = require('./routes/auditRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/incentives', incentiveRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/audit', auditRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
