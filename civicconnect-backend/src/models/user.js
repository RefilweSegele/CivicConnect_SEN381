//in preparation for milestone 3. Create the schema for the user
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ['resident', 'staff', 'supervisor', 'admin'] },
    departmentId: { type: String, default: null }
}, { timestamps: true });

//export the model
module.exports = mongoose.model('user', userSchema);
