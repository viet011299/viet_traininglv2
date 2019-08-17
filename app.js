const express = require('express');// Giao thuc
const path = require('path'); // Chuyen duong dan   
const bodyParser = require('body-parser');// dich du lieu
const mongoose = require('mongoose');
const TokeModel= require("./api/token/model")
const authRouter = require("./api/auth/router");
const tokenRouter = require("./api/token/router");
const studentRouter = require("./api/student/router");
const classRouter = require("./api/class/router");
mongoose.connect("mongodb://localhost:27017/student", (error) => {
    console.log("Conect");
    if (error) {
        throw error;
    }
    const server = express();
    server.use(express.static('./image'));
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));

    server.use("/api/auth", authRouter);
    server.use("/api/token", tokenRouter);
    server.use("/api/student", studentRouter);
    server.use("/api/class",classRouter);
    
    server.listen(3000, async(error) => {
        if (!error) {
            await checkTime();
            console.log("sever listen port 3000");
        }
    })
});
function checkTime(){
    setInterval(async function(){
        // console.log("Hàm check thời gian token đang chạy ");
        const listToken= await TokeModel.find();
        for (let token of listToken){
            if(token.expiredAt.getTime()<Date.now()){
                await TokeModel.findByIdAndDelete(token._id);
            }
        }
    },10000);
}