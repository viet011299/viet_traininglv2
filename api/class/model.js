const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
    nameclass: String,
    group: String
    
});

const ClassModel = mongoose.model("class", ClassSchema);
module.exports = ClassModel;