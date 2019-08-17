const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    name: String,
    brith: String,
    classID: {
        type: mongoose.Types.ObjectId,
        ref: "class"
    },
    province: String,
    ward: String,
    district: String,
    address: String,
    identityCard: Number,
    imgID:String
});

const StudentModel= mongoose.model("student", StudentSchema);
module.exports=StudentModel;