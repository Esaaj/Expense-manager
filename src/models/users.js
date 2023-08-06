const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
        email: String,
        password: String,
        name: String,
        currency: String,
    },
    { 
        timestamps: true 
    },
);

module.exports = mongoose.model('users', UserSchema);