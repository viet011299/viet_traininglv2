const express = require("express");
const TokenModel = require("./model");

const tokenRouter = express();
// tokenRouter.get("/",async(req,res)=>{
//     try {
//         const newlist = await TokenModel.find();
//         res.status(201).json(newlist);
//     } catch (error) {
//         res.status(500).send(error.message)
//     }
// });
// tokenRouter.post("/:ID", async (req, res) => {
//     try {
//         const { ID } = req.params;
//         console.log(ID);
//         const tokenInfor = await TokenModel.findById(ID)
//             .populate('authID', "username")
//             .exec();
//         console.log(tokenInfor);
//         res.status(200).json(tokenInfor);
//     } catch (error) {
//         res.status(500).send(error.messager)
//     }
// });
module.exports = tokenRouter;