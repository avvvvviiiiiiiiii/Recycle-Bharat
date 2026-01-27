const { pool } = require('../config/db');
const LifecycleService = require('../services/lifecycle');
const crypto = require('crypto');

class DeviceController {

    // POST /api/devices
    static async registerDevice(req, res) {
        const { device_type, brand, model, purchase_year, serial_number } = req.body;
        const owner_id = req.user.id;

        try {
            // Generate a simpler unique ID for the device public ID if not provided
            const device_uid = serial_number || `DEV-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

            const newDevice = await pool.query(
                `INSERT INTO devices (owner_id, device_type, brand, model, purchase_year, serial_number, device_uid, device_uid_origin, current_state) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, 'GENERATED', 'ACTIVE') 
                RETURNING *`,
                [owner_id, device_type, brand, model, purchase_year, serial_number, device_uid]
            );

            await pool.query(
                `INSERT INTO lifecycle_events (device_id, to_state, triggered_by_user_id, event_type, metadata)
                VALUES ($1, 'ACTIVE', $2, 'DEVICE_REGISTERED', $3)`,
                [newDevice.rows[0].id, owner_id, JSON.stringify({ uid: newDevice.rows[0].device_uid, model: model })]
            );

            res.status(201).json({
                message: 'Device registered successfully',
                device: newDevice.rows[0]
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error', error: err.message });
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
            // 1. Lifecycle Transition
            const transitionResult = await LifecycleService.transitionState(
                deviceId,
                'RECYCLING_REQUESTED',
                req.user
            );

            // 2. Create Recycling Request Record
            const newRequest = await pool.query(
                `INSERT INTO recycling_requests 
                (device_id, citizen_id, pickup_address, pickup_latitude, pickup_longitude, preferred_date, status)
                VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')
                RETURNING *`,
                [deviceId, req.user.id, pickup_address, pickup_latitude, pickup_longitude, preferred_date]
            );

            // 3. Generate initial DUC automatically upon request (Optional, or wait for explicit reveal)
            // Ideally, we can generate it now to ensure it exists.
            const duc = crypto.randomInt(100000, 999999).toString();
            await pool.query('UPDATE devices SET current_duc = $1 WHERE id = $2', [duc, deviceId]);

            res.json({
                message: 'Recycling requested successfully',
                device_state: transitionResult,
                request: newRequest.rows[0]
            });

        } catch (err) {
            console.error(err);
            if (err.code === 'FSM_VIOLATION' || err.code === 'RBAC_VIOLATION' || err.code === 'OWNERSHIP_VIOLATION') {
                return res.status(err.status || 400).json(err);
            }
            res.status(500).json({ message: 'Server error' });
        }
    }

    // GET /api/devices/:id/duc
    static async revealDeviceDUC(req, res) {
        const deviceId = req.params.id;
        const userId = req.user.id;

        try {
            const deviceRes = await pool.query('SELECT owner_id, current_duc, current_state FROM devices WHERE id = $1', [deviceId]);

            if (deviceRes.rows.length === 0) {
                return res.status(404).json({ message: 'Device not found' });
            }

            const device = deviceRes.rows[0];

            // RBAC Check
            if (device.owner_id !== userId) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            // Logic: Ensure DUC exists
            let duc = device.current_duc;
            if (!duc) {
                // If for some reason it wasn't generated at request time, generate now if state allows
                if (['RECYCLING_REQUESTED', 'COLLECTOR_ASSIGNED'].includes(device.current_state)) {
                    duc = crypto.randomInt(100000, 999999).toString();
                    await pool.query('UPDATE devices SET current_duc = $1 WHERE id = $2', [duc, deviceId]);
                } else {
                    return res.status(400).json({ message: 'DUC not available in current state' });
                }
            }

            // Audit the reveal
            await pool.query(
                `INSERT INTO audit_logs (user_id, action, target_id, details) 
                 VALUES ($1, 'DUC_REVEAL', $2, $3)`,
                [userId, deviceId, JSON.stringify({ device_id: deviceId })]
            );

            res.json({ rawDuc: duc });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = DeviceController;
