/**
 * @namespace CommonUtils
 */

require('../models/user.schema');
const User = require('mongoose').model('User');
const httpStatus = require('http-status');

/**
 * Find user object from database using auth data
 *
 * @function getCurrentUser
 * @memberOf CommonUtils
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 * @param {object} next - express self-generated method to pass request to the next handler in a queue
 */
function getCurrentUser(req, res, next) {

    User.findById(req.auth.id, function (err, user) {
        if (err || !user) {
            res.status(httpStatus.NOT_FOUND);
            return res.json({message: "could not get current user", success: false})
        } else {
            req.user = user;
            next();
        }
    });
}

/**
 * Send user to the client
 *
 * @function getOne
 * @memberOf CommonUtils
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 */
function getOne(req, res) {
    const user = req.user.toObject();
    res.json(user);
}

exports.getCurrentUser = getCurrentUser;
exports.getOne = getOne;
