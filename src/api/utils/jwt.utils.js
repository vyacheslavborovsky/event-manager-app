const httpStatus = require('http-status');
const jwt = require("jsonwebtoken");


const config = require("../../config/variable");


const createToken = function (user) {
    return jwt.sign({
            id: user.id,
        }, config.common.jwtSecret,
        {
            expiresIn: 60 * 120
        });
};


const generateToken = function (req, res, next) {
    req.token = createToken(req.user);
    return next();
};

const sendToken = function (req, res) {
    res.status(httpStatus.OK);
    return res.json({'x-auth-token': req.token, success: true});
};


exports.generateToken = generateToken;
exports.sendToken = sendToken;
