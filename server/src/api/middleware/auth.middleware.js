require('../models/user.schema');

const User = require('mongoose').model('User');
const expressJwt = require('express-jwt');
const config = require("../../config/variable");

/**
 * Middleware function to extract jwt token from incoming request
 * @type {middleware}
 */
function authenticate() {
    let jwtOptions = {
        secret: config.common.jwtSecret,
        requestProperty: 'auth',
        getToken: function (req) {
            if (req.headers[config.common.jwtHeader]) {
                return req.headers[config.common.jwtHeader];
            }

            return null;
        }
    };

    return expressJwt(jwtOptions);
}


exports.authenticate = authenticate;
