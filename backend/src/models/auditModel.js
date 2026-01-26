const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
    actorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    action: {
        type: String,
        required: true
    },
    details: {
        type: Object, // Flexible JSON structure
        default: {}
    }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditSchema);
