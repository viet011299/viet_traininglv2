const express = require("express");
const ClasstModel = require("./model");
const classRouter = express();
const jwt = require("jsonwebtoken");
classRouter.post("/create", async (req, res) => {
    try {
        const classtInfor = req.body;
        const newClass = await ClasstModel.create(
            classtInfor
        )
        const newList = await ClasstModel.find();
        res.status(200).json(
            newList
        )
    } catch (error) {
        res.status(500).send(error.messager);
    }
});
module.exports=classRouter;