const mongoose = require('mongoose');

const incentiveSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true,
        unique: true // Strict idempotency: One device = One reward
    },
    amount: {
        type: Number,
        required: true,
        default: 100 // Fixed reward amount for MVP
    },
    status: {
        type: String,
        enum: ['PENDING', 'ISSUED'],
        default: 'ISSUED'
    }
}, { timestamps: true });

// Index for quick lookup of user's rewards
incentiveSchema.index({ userId: 1 });

module.exports = mongoose.model('Incentive', incentiveSchema);
