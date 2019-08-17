const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    id: Number,
    token: String,
    authID: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "auth"
    },
    expiredAt: {
        type : Date
    }
});

const TokenModel = mongoose.model("token", TokenSchema);
module.exports=TokenModel;