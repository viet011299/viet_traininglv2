const mongoose = require('mongoose');

const AuthSchenma = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    id: Number,
    numberLogin: Number,
    onlineAT: {
        type: Date,
        default: new Date()
    }
});
const AuthModel = mongoose.model("auth", AuthSchenma);
module.exports = AuthModel;