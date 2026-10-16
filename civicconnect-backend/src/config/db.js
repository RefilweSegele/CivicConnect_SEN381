const mongoose = require('mongoose');

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    
    const uri = process.env.NODE_ENV === 'test' || process.env.MONGO_URI_TEST 
        ? process.env.MONGO_URI_TEST 
        : process.env.MONGO_URI;

    await mongoose.connect(uri);
    console.log('MongoDB connected.');
};

module.exports = connectDB;