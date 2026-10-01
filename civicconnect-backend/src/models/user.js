//in preparation for milestone 3. Create the schema for the user
const mongoose = require('mongoose');

const userSchema =new mongoose.Schema({
    name: {String, required:true, trim:true},
    email :{String, required:true, unique:true, lowercase:true },
    password:{String, required:true, unique:true},
    role: {String, required:true, Enum:['resident', 'staff','supervisor', 'admin'], default:null},
    departmentId: {String, default:null},
    createdAt: {Date, Timestamp: true},
    updatedAt : {Date,Timestamp:true}
});

//export the model
module.exports = mogoose.model('user', userSchema);
