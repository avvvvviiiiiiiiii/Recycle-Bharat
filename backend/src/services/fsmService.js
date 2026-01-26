const VALID_TRANSITIONS = {
    ACTIVE: ['RECYCLING_REQUESTED'],
    RECYCLING_REQUESTED: ['COLLECTOR_ASSIGNED'],
    COLLECTOR_ASSIGNED: ['COLLECTED', 'PICKUP_FAILED'],
    PICKUP_FAILED: ['RECYCLING_REQUESTED'],
    COLLECTED: ['DELIVERED_TO_RECYCLER'],
    DELIVERED_TO_RECYCLER: ['RECYCLED'],
    RECYCLED: [] // TERMINAL STATE
};

const TRANSITION_ROLES = {
    ACTIVE: ['citizen'],
    RECYCLING_REQUESTED: ['recycler'],
    COLLECTOR_ASSIGNED: ['collector'], // Requires DUC from Citizen
    PICKUP_FAILED: ['recycler', 'collector'],
    COLLECTED: ['recycler'], // Delivery confirmed by Recycler (requires DUC from Collector)
    DELIVERED_TO_RECYCLER: ['recycler'], // Final Recycling
    RECYCLED: []
};

class FSMService {
    static validateTransition(currentStatus, newStatus, userRole) {
        if (!VALID_TRANSITIONS[currentStatus]) {
            throw new Error(`Invalid current status: ${currentStatus}`);
        }

        if (!VALID_TRANSITIONS[currentStatus].includes(newStatus)) {
            throw new Error(`Illegal transition from ${currentStatus} to ${newStatus}`);
        }

        // Role validation
        const allowedRoles = TRANSITION_ROLES[currentStatus];
        if (allowedRoles && !allowedRoles.includes(userRole)) {
            throw new Error(`Role ${userRole} is not authorized to move from ${currentStatus}`);
        }

        return true;
    }

    static getNextPossibleStates(currentStatus) {
        return VALID_TRANSITIONS[currentStatus] || [];
    }
}

module.exports = FSMService;
