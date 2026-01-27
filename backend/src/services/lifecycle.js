const { pool } = require('../config/db');

// State Machine Definition
// [CurrentState]: { [NextState]: [AllowedRole] }
const FSM = {
    'ACTIVE': {
        'RECYCLING_REQUESTED': ['CITIZEN']
    },
    'RECYCLING_REQUESTED': {
        'COLLECTOR_ASSIGNED': ['RECYCLER', 'ADMIN'] // System/Recycler assigns collector
    },
    'COLLECTOR_ASSIGNED': {
        'COLLECTED': ['COLLECTOR']
    },
    'COLLECTED': {
        'DELIVERED_TO_RECYCLER': ['COLLECTOR', 'RECYCLER']
    },
    'DELIVERED_TO_RECYCLER': {
        'RECYCLED': ['RECYCLER']
    },
    'RECYCLED': {} // Terminal State
};

class LifecycleService {

    /**
     * Transition a device to a new state with strict FSM and RBAC checks
     * @param {number} deviceId - ID of the device
     * @param {string} newState - Target state
     * @param {object} user - Authenticated user object {id, role}
     * @param {object} metadata - Optional context (location, proofs, etc.)
     */
    static async transitionState(deviceId, newState, user, metadata = {}) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // 1. Fetch Current Device State with Lock
            const deviceRes = await client.query(
                'SELECT current_state, owner_id FROM devices WHERE id = $1 FOR UPDATE',
                [deviceId]
            );

            if (deviceRes.rowCount === 0) {
                throw { status: 404, message: 'Device not found' };
            }

            const currentState = deviceRes.rows[0].current_state;
            const ownerId = deviceRes.rows[0].owner_id;

            // 2. Validate Transition Exists
            if (!FSM[currentState] || !FSM[currentState][newState]) {
                throw {
                    status: 400,
                    code: 'FSM_VIOLATION',
                    message: `Invalid state transition from ${currentState} to ${newState}`
                };
            }

            // 3. Validate Role Permission
            const allowedRoles = FSM[currentState][newState];
            if (!allowedRoles.includes(user.role)) {
                throw {
                    status: 403,
                    code: 'RBAC_VIOLATION',
                    message: `Role ${user.role} is not authorized to perform this transition`
                };
            }

            // 4. Specific Owner Check for CITIZEN
            if (currentState === 'ACTIVE' && user.role === 'CITIZEN' && user.id !== ownerId) {
                throw {
                    status: 403,
                    code: 'OWNERSHIP_VIOLATION',
                    message: 'You can only request recycling for your own devices'
                };
            }

            // 5. Update Device State
            await client.query(
                'UPDATE devices SET current_state = $1, updated_at = NOW() WHERE id = $2',
                [newState, deviceId]
            );

            // 6. Append to Immutable Audit Log
            await client.query(
                `INSERT INTO lifecycle_events 
                (device_id, from_state, to_state, triggered_by_user_id, event_type, metadata) 
                VALUES ($1, $2, $3, $4, 'STATUS_CHANGE', $5)`,
                [deviceId, currentState, newState, user.id, JSON.stringify({ ...metadata, uid: deviceRes.rows[0].device_uid || 'UNKNOWN', oldStatus: currentState, newStatus: newState })]
            );

            await client.query('COMMIT');

            return {
                device_id: deviceId,
                previous_state: currentState,
                new_state: newState,
                timestamp: new Date()
            };

        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}

module.exports = LifecycleService;
