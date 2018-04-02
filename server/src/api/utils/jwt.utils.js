const httpStatus = require('http-status');
const jwt = require("jsonwebtoken");
const config = require("../../config/variable");

/**
 * Create a new jwt token based on user id
 *
 * @function createToken
 *
 * @param {object} user
 *
 * @return {string} token
 */
function createToken(user) {
    return jwt.sign({
            id: user.id,
        }, config.common.jwtSecret,
        {
            expiresIn: 60 * 120
        });
}

/**
 * Generate jwt token
 *
 * @function generateToken
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 * @param {object} next - express self-generated method to pass request to the next handler in a queue
 *
 * @return {*}
 */
function generateToken(req, res, next) {
    req.token = createToken(req.user);
    return next();
}

/**
 * Send generated token to requested client
 *
 * @function sendToken
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 *
 * @param {number} res.status
 * @param {string} res.x-auth-token
 * @param {boolean} res.success
 */
function sendToken(req, res) {
    res.status(httpStatus.OK);
    return res.json({'x-auth-token': req.token, success: true});
}

exports.generateToken = generateToken;
exports.sendToken = sendToken;
