const express = require("express");
const moment = require('moment');
const StudentModel = require("./model");
const TokenModel = require("../token/model");
const ClassModel = require("../class/model");
const studenRouter = express();
const jwt = require("jsonwebtoken");
const multer = require("multer");

studenRouter.post("/", verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'abc', async (error, authData) => {
            if (error) {
                res.status(404).json({
                    message: "Mời đăng nhập lại"
                });
            } else {
                if (await checkToken(authData.authID, req.token)) {
                    const newList = await StudentModel.find()
                        .populate('classID', "group")
                        .exec();
                    res.json({
                        message: "Thành công",
                        authData,
                        newList
                    })
                } else {
                    res.status(404).json({
                        message: "Mời đăng nhập lại"
                    });
                }
            }
        }
        );
    } catch (error) {
        res.status(500).send(error.messager);
    }
});
studenRouter.post("/search", verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'abc', async (error, authData) => {
            if (error) {
                res.status(404).json({
                    message: "Mời đăng nhập lại"
                });
            } else {
                if (await checkToken(authData.authID, req.token)) {
                    const { nameSearch, provinceSearch, classSearch, yearSearch } = req.query;
                    const studentQuery = StudentModel.find().populate("classID", "group");
                    const classQuery = ClassModel.find();
                    if (nameSearch) {
                        studentQuery.where('name', {
                            $regex: new RegExp(nameSearch, 'i')
                        })
                    }
                    if (provinceSearch) {
                        studentQuery.where('province', {
                            $regex: new RegExp(provinceSearch, 'i')
                        })
                    }
                    if (classSearch) {
                        studentQuery.where('classID.group', {
                            $regex: new RegExp(classSearch, 'i')
                        });
                    }
                    if (yearSearch) {
                        studentQuery.where('brith', {
                            $regex: new RegExp(yearSearch, 'i')
                        });
                    }
                    const listStudents = await studentQuery;
                    res.jsonp({
                        authData,
                        listStudents
                    });
                } else {
                    res.status(404).json({
                        message: "Mời đăng nhập lại"
                    });
                }
            }
        });

    } catch (error) {
        res.status(500).send(error.messager);
    }
});

studenRouter.post("/create", verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'abc', async (error, authData) => {
            if (error) {
                res.status(404).json({
                    error,
                    message: "Mời đăng nhập lại"
                });
            } else {
                if (await checkToken(authData.authID, req.token)) {
                    const regexbrith = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
                    const sutdentInfor = req.body;
                    if (sutdentInfor.brith.match(regexbrith)) {
                        if (sutdentInfor.name != "" || sutdentInfor.brith != "" || sutdentInfor.group != "" || sutdentInfor.province != "") {
                            const classId = await ClassModel.findOne({ group: sutdentInfor.group });
                            console.log(classId);
                            const newStudent = await StudentModel.create({
                                ...sutdentInfor,
                                classID: classId._id
                            }
                            )
                            console.log(newStudent);
                            const newList = await StudentModel.find();
                            res.status(200).json({
                                authData,
                                newList
                            }
                            )
                        } else {
                            res.status(404).json({
                                message: "Nhập đủ các thông tin về tên ,ngày/tháng/năm sinh, các lớp trong lớp hiện có "
                            })
                        }
                    } else {
                        res.status(404).json({
                            message: "Nhập lại ngày theo định dạng ngày/tháng/năm"
                        })
                    }
                } else {
                    res.status(404).json({
                        message: "Mời đăng nhập lại"
                    });
                }
            }
        })

    } catch (error) {
        res.status(500).send(error.messager);
    }
});
studenRouter.post("/edit/:id", verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'abc', async (error, authData) => {
            if (error) {
                res.status(404).json({
                    error,
                    message: "Mời đăng nhập lại"
                });
            } else {
                if (await checkToken(authData.authID, req.token)) {
                    const { id } = req.params;
                    console.log(id);
                    const editInfor = req.body;
                    console.log(req.body);
                    const editSutudent = await StudentModel.findByIdAndUpdate(id, {
                        $set: {
                            name: editInfor.name,
                            province: editInfor.province
                        }
                    })
                    const newList = await StudentModel.find();
                    res.status(200).json({
                        messager: "Thay đổi thành công",
                        authData,
                        newList
                    })
                } else {
                    res.status(404).json({
                        message: "Mời đăng nhập lại"
                    });
                }
            }
        });

        // const newList = await StudentModel.find();

    } catch (error) {
        res.status(500).send(error.messager);
    }
});
studenRouter.post("/delete/:id", verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'abc', async (error, authData) => {
            if (error) {
                res.status(404).json({
                    message: "Mời đăng nhập lại"
                });
            } else {
                if (await checkToken(authData.authID, req.token)) {
                    const { id } = req.params;
                    console.log(id);
                    const deleteStudent = await StudentModel.findByIdAndDelete(id);
                    const newList = await StudentModel.find();
                    res.status(200).json({
                        messager: "Xóa thành công",
                        authData,
                        newList
                    })
                } else {
                    res.status(404).json({
                        message: "Mời đăng nhập lại"
                    });
                }
            }
        })
    } catch (error) {
        res.status(500).send(error.messager);
    }
});
studenRouter.post("/uploadavata/:id", async(req,res)=> {
    upload(req,res,async (error)=>{
        const {id}= req.params
        if (error){
            res.json({
                
                message: error.message
            })
        }else {
            await StudentModel.findByIdAndUpdate(id,{
                $set:{
                    imgID: req.file.filename
                }
            })
            res.json({
                message: "up thành công"
            })
        }
    });
});
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.status(404).json({
            message: "Không nhận được token"
        });
    }
}
async function checkToken(authId, token) {
    const checkToken = await TokenModel.findOne(
        { authID: authId, token: token }).exec();
    if (checkToken) { return true; }
    else { return false; }
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './image')
    },
    filename: function (req, file, cb) {
      cb(null,file.fieldname + '-' + Date.now()+'.jpg')
    }
  })

var upload = multer({ 
    storage: storage,
    limits: {fullsize: 100} 
}).single('img');
function checkFileType(file,cb){
    const fileTypes= /jpeg|jpg|png/;

}
module.exports = studenRouter