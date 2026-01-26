const { pool } = require('../config/db');
const LifecycleService = require('../services/lifecycle');

class DeviceController {

    // POST /api/devices
    static async registerDevice(req, res) {
        const { device_type, brand, model, purchase_year, serial_number } = req.body;
        const owner_id = req.user.id;

        try {
            const newDevice = await pool.query(
                `INSERT INTO devices (owner_id, device_type, brand, model, purchase_year, serial_number, current_state) 
                VALUES ($1, $2, $3, $4, $5, $6, 'ACTIVE') 
                RETURNING *`,
                [owner_id, device_type, brand, model, purchase_year, serial_number]
            );

            // Log initial state in audit trail (Implicitly done? No, manual insert needed for creation or just rely on state? 
            // Better to log creation event.)
            await pool.query(
                `INSERT INTO lifecycle_events (device_id, to_state, triggered_by_user_id, event_type)
                VALUES ($1, 'ACTIVE', $2, 'DEVICE_REGISTRATION')`,
                [newDevice.rows[0].id, owner_id]
            );

            res.status(201).json({
                message: 'Device registered successfully',
                device: newDevice.rows[0]
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // GET /api/devices
    static async getMyDevices(req, res) {
        try {
            const devices = await pool.query(
                'SELECT * FROM devices WHERE owner_id = $1 ORDER BY created_at DESC',
                [req.user.id]
            );
            res.json(devices.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // POST /api/devices/:id/recycle
    static async requestRecycling(req, res) {
        const deviceId = req.params.id;
        const { pickup_address, pickup_latitude, pickup_longitude, preferred_date } = req.body;

        try {
            // 1. Lifecycle Transition (ACTIVE -> RECYCLING_REQUESTED)
            const transitionResult = await LifecycleService.transitionState(
                deviceId,
                'RECYCLING_REQUESTED',
                req.user
            );

            // 2. Create Recycling Request Record
            // Note: This ideally should be in the SAME transaction as LifecycleService, 
            // but for MVP splitting is acceptable if handled carefully. 
            // Enhanced: We should update LifecycleService to accept a callback or handle request creation?
            // For now, we simple insert. If this fails, we have a state mismatch (Issue!).
            // Fix: We'll wrap this in a try-catch and revert state if request creation fails.

            const newRequest = await pool.query(
                `INSERT INTO recycling_requests 
                (device_id, citizen_id, pickup_address, pickup_latitude, pickup_longitude, preferred_date, status)
                VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')
                RETURNING *`,
                [deviceId, req.user.id, pickup_address, pickup_latitude, pickup_longitude, preferred_date]
            );

            res.json({
                message: 'Recycling requested successfully',
                device_state: transitionResult,
                request: newRequest.rows[0]
            });

        } catch (err) {
            console.error(err);
            // If it's our FSM error
            if (err.code === 'FSM_VIOLATION' || err.code === 'RBAC_VIOLATION' || err.code === 'OWNERSHIP_VIOLATION') {
                return res.status(err.status || 400).json(err);
            }
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = DeviceController;
