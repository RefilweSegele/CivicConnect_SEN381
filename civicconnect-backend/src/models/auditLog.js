//added user logs
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    requestId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'request' },
    oldStatus: { type: String, required: true },
    newStatus: { type: String, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('auditlog', auditLogSchema);