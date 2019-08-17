const express = require("express");
const AuthModel = require("./model");
const TokenModel = require("../token/model");
const bcryptjs = require("bcryptjs");// mã hóa mk
const jwt = require("jsonwebtoken");// sinh token
const moment = require('moment');
const authRouter = express();

authRouter.post("/register", async (req, res) => {
    try {
        //check user
        const userInfor = req.body;
        if (userInfor.username != "" && userInfor.passwor != '' && userInfor.name != '') {
            const regexUser = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
            if (userInfor.username.match(regexUser)) {
                const checkUser = await AuthModel.findOne({
                    username: req.body.username
                }).exec();
                if (checkUser) {
                    res.status(503).end("Username đã được sử dụng");
                }
                else {
                    //save database
                    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/;
                    if (userInfor.password.match(regexPassword)) {
                        const hashPassword = await bcryptjs.hash(userInfor.password, 10);
                        const newUser = await AuthModel.create({
                            ...userInfor,
                            password: hashPassword
                        })
                        res.status(201).json(newUser);
                    } else {
                        res.status(503).json({
                            message: "Mật khẩu sai định dạng : Mật khẩu có độ dài từ 8 đến 16 ký tự có ít nhất 1 số và 1 chữ cái "
                        })
                    }

                }

            } else {
                res.status(500).json({
                    message: "Tài khoản cần từ 8 tới 20 ký tự không có ký tự đặc biệt chỉ số và chữ"
                })
            }

        } else {
            res.status(500).json({
                message: "Vui lòng nhập đủ thông tin"
            })
        }

    } catch (error) {
        res.status(500).send(error.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const userInfor = req.body;
        const checkUserName = await AuthModel.findOne({
            username: req.body.username,
        }).exec();
        if (!checkUserName) {
            res.status(404).json({
                message: "Sai tài khoản"
            });
        } else {
            const comparePassword = await bcryptjs.compare(userInfor.password, checkUserName.password);
            if (comparePassword) {
                //update OnlineAt
                const updateOnlineAt = await AuthModel.findByIdAndUpdate(checkUserName._id, {
                    $set: {
                        onlineAT: new Date
                    }
                })
                // Token
                const token = jwt.sign({ username: checkUserName.username, authID: checkUserName._id }, 'abc', { expiresIn: '24h' });
                //Check token;
                const checkToken = await TokenModel.findOne({
                    authID: checkUserName._id
                }).lean();
                if (checkToken) {
                    //update token
                    await TokenModel.update(
                        { authID: checkUserName._id }, {
                            $set: {
                                expiredAt: moment().add(1, 'days'),
                                token: token
                            }

                        })
                } else {
                    //new Token
                    const newToken = TokenModel.create({
                        token: token,
                        authID: checkUserName._id,
                        expiredAt: moment().add(1, 'days')
                    })
                }
                res.status(200).json({
                    message: "Đăng nhập thành công",
                    username: userInfor.username,
                    token: token
                })
            } else {
                res.status(200).json({
                    message: "Mật khẩu không đúng",
                });
            }
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});
authRouter.post("/logout", verifyToken, (req, res) => {
    try {
        jwt.verify(req.token, 'abc', async (error, authData) => {
            if (error) {
                res.json({
                    error
                });
            } else {
                await TokenModel.findOneAndDelete({ authID: authData.authID });
                res.status(200).json({
                    message: "Đăng xuất thành công",
                });
            }
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
});

authRouter.post("/test", verifyToken, (req, res) => {
    jwt.verify(req.token, 'abc', async (error, authData) => {
        if (error) {
            res.send("mời đăng nhập lại");
        } else {
            if (await checkToken(authData.authID,req.token)) {
                res.status(200).json(authData);
            } else {
                res.status(200).json("Bạn đã đăng xuất mời đăng nhập lại");
            }
        }
    })

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
            message: "Đăng nhập lại"
        });
    }
}
async function checkToken(authId,token) {
    const checkToken = await TokenModel.findOne(
        { authID: authId,token: token }).exec();
    if (checkToken) { return true; }
    else { return false; }
}
module.exports = authRouter;