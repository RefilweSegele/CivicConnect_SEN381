const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true, default: 'Submitted' },
    departmentId: { type: String, required: true, default: 'General' },
    residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    assignedStaffId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'user' },
    owner: { type: String, default: null },
    notes: [{
        at: { type: Date, default: Date.now },
        text: { type: String, required: true }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('request', requestSchema);