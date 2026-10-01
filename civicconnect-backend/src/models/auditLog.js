//added user logs
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    requestId: {type: mongoose.Schema.Types.ObjectId, required:true, ref:'request'},
    oldStatus: {String, required:true},
    newStatus: {String, required:true},
    changedBy:{type:mongoose.Schema.Types.ObjectId, required:true, ref:'user'},
    timestamp: {Date, Default: Date.now}
});

module.exports = mongoose.model('auditlog',auditLogSchema);