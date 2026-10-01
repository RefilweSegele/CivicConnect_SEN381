//This is the database schema for the requested services by the users
const mongoose = require('mongoose');
const requestSchema = new mongoose.Schema({
    title:{String, required: true, trim:true},
    description:{String, required},
    status:{String, required:true},
    departmentId: {String, required:true},
    residentId:{type: mongoose.Schema.Types.ObjectId, required:true,ref: 'user' },
    assignedStaffId:{type:mongoose.Schema.Types.ObjectId, default:null, ref:'user'},
    createdAt: {Date, Timestamp:true},
    updatedAt: {Date, Timestamp:true}
});

module.exports = mogoose.model('request', requestSchema);