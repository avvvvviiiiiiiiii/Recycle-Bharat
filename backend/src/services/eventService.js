const EventEmitter = require('events');

class EventBus extends EventEmitter { }

const eventBus = new EventBus();

// Event names constants
const EVENTS = {
    STATUS_CHANGE: 'device.status_changed',
    DEVICE_CREATED: 'device.created',
    DEVICE_COLLECTED: 'device.collected',
    DEVICE_DELIVERED: 'device.delivered',
    DEVICE_RECYCLED: 'device.recycled'
};

module.exports = { eventBus, EVENTS };
