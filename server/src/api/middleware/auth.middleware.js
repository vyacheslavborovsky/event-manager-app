require('../models/user.schema');

const User = require('mongoose').model('User');
const expressJwt = require('express-jwt');
const config = require("../../config/variable");

const authenticate = expressJwt({
    secret: config.common.jwtSecret,
    requestProperty: 'auth',
    getToken: function (req) {
        if (req.headers['x-auth-token']) {
            return req.headers['x-auth-token'];
        }

        return null;
    }
});

exports.authenticate = authenticate;
