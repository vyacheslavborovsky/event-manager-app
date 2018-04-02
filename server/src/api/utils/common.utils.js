require('../models/user.schema');
const User = require('mongoose').model('User');
const httpStatus = require('http-status');
const winston = require('winston');
const config = require("../../config/variable");

function getCurrentUser(req, res, next) {

    User.findById(req.auth.id, function (err, user) {
        if (err || !user) {
            res.status(404);
            return res.json({message: "could not get current user", success: false})
        } else {
            req.user = user;
            next();
        }
    });
}

function getOne(req, res) {
    const user = req.user.toObject();
    res.json(user);
}

function errorHandler(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = config.mode === 'development' ? err : {};

    winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - on domain: ${process.domain.id} - ${req.ip}`);

    res.status(err.status);
    res.json({
        code: err.status,
        message: err.message || httpStatus[err.status]
    });
    res.end();
}

exports.getCurrentUser = getCurrentUser;
exports.getOne = getOne;
exports.errorHandler = errorHandler;
