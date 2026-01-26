const { eventBus, EVENTS } = require('../services/eventService');
const IncentiveService = require('../services/incentiveService');
const MockIncentiveService = require('../services/mockIncentiveService');

const Service = process.env.USE_MOCK_DB === 'true' ? MockIncentiveService : IncentiveService;

/**
 * Initializes the incentive subscriber to listen for lifecycle events.
 */
const initIncentiveSubscriber = () => {
    eventBus.on(EVENTS.STATUS_CHANGE, async ({ device, userId }) => {
        // Business Rule: Incentives are issued when a device is DELIVERED_TO_RECYCLER
        // This represents the point of verified physical recovery.
        if (device.status === 'DELIVERED_TO_RECYCLER') {
            console.log(`[Subscriber] Device ${device._id} reached verified delivery. Triggering incentive...`);
            try {
                await Service.issueReward({
                    userId: device.ownerId, // Reward goes to the owner
                    deviceId: device._id
                });
            } catch (err) {
                console.error('[Subscriber] Failed to issue incentive:', err.message);
            }
        }
    });
};

module.exports = initIncentiveSubscriber;
