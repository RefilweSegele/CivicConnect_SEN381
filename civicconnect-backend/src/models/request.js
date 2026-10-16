//This is the database schema for the requested services by the users
const mongoose = require('mongoose');
const requestSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    status: { type: String, required: true },
    departmentId: { type: String, required: true },
    residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    assignedStaffId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('request', requestSchema);