/**
 * @namespace APIAuthRoutesHandlers
 */
require('../models/user.schema');
const AppError = require('../../api/utils/error');
const config = require("../../config/variable");
const httpStatus = require('http-status');
const postTwit = require("../../config/twitter").postTwit;
const request = require("request-promise");
const User = require('mongoose').model('User');
const winston = require('winston');
const signUpNotify = require("../utils/usersNotifyProcess").signUpNotify;


/**
 ** Check user's provided data and create a new user on success
 *
 * @function signUp
 * @param {string} url - POST /api/v1/auth/register/local
 * @memberOf APIAuthRoutesHandlers
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 *
 * @param {object} res.body
 * @param {string} res.body.username
 * @param {string} res.body.password
 * @param {object} res.body.email
 *
 * @param {number} res.status
 * @param {string} res.message
 * @param {boolean} res.success
 * @param {object} res.account
 */
function signUp(req, res) {
    if (!req.user) {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({message: "Error during register.", success: false});
    }

    signUpNotify();

    return res
        .status(httpStatus.OK)
        .json({message: "Account has been created", success: true, account: req.user});
}

/**
 ** Check user's provided data and pass the request to provide a jwt token middleware
 *
 * @function logIn
 * @param {string} url - POST /api/v1/auth/login/local
 * @memberOf APIAuthRoutesHandlers
 *
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 * @param {object} next - express self-generated method to pass request to the next handler in a queue
 *
 * @param {object} res.body
 * @param {string} res.body.username
 * @param {string} res.body.password
 */
function logIn(req, res, next) {
    if (req.user) {
        return next();
    }

    return res
        .status(httpStatus.NOT_FOUND)
        .json({message: "User not found.", success: false});
}

/**
 ** Pass the request to twitter auth API to get access_token and pass it to passport twitter auth middleware to get user profile info
 *
 * @function twitterAuth
 * @param {string} url - POST /api/v1/auth/twitter
 * @memberOf APIAuthRoutesHandlers
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 * @param {object} next - express self-generated method to pass request to the next handler in a queue
 *
 * @param {object} req.queryString
 * @param {string} req.queryString.userId
 * @param {string} req.queryString.oauth_token
 * @param {string} req.queryString.oauth_verifier
 *
 * @param {object} res.body
 * @param {string} res.body.username
 * @param {string} res.body.password
 * @param {object} res.body.email
 *
 * @param {number} res.status
 * @param {string} res.message
 */
function twitterAuth(req, res, next) {
    const params = req.query.userId.split('?');
    const verifier = params[1].split('=')[1];

    let options = {
        url: config.twitterProvider.twitterAccessUrl,
        oauth: {
            consumer_key: config.twitterProvider.consumerKey,
            consumer_secret: config.twitterProvider.consumerSecret,
            token: req.query.oauth_token
        },
        form: {
            oauth_verifier: verifier
        }
    };

    request
        .post(options)
        .then((body) => {
            let bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
            let parsedBody = JSON.parse(bodyString);

            req.body.oauth_token = parsedBody.oauth_token;
            req.body.oauth_token_secret = parsedBody.oauth_token_secret;
            req.body.user_id = parsedBody.user_id;
            req.query.currentUserId = params[0];

            return next();
        })
        .catch((error) => res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({message: error.message}));
}

/**
 ** Pass the request to twitter auth API to create request_token
 *
 * @function twitterRequestToken
 * @param {string} url - POST /api/v1/auth/twitter/reverse
 * @memberOf APIAuthRoutesHandlers
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 *
 * @param {number} res.status
 * @param {string} res.message
 * @param {object} res.data
 * @param {string} res.data.oauth_token
 * @param {string} res.data.oauth_token_secret
 * @param {string} res.data.user_id - twitter profile id
 */
function twitterRequestToken(req, res) {
    let options = {
        url: config.twitterProvider.twitterRequestUrl,
        oauth: {
            oauth_callback: config.twitterProvider.callbackUrl,
            consumer_key: config.twitterProvider.consumerKey,
            consumer_secret: config.twitterProvider.consumerSecret
        }
    };

    request
        .post(options)
        .then((body) => {
            const jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
            return res.send(JSON.parse(jsonStr));
        })
        .catch((error) => {
            return res.send(500, {message: error.message})
        });
}

/**
 * Find user object from database using auth data
 *
 * @function getCurrentUser
 * @param {string} url - POST /api/v1/twitter
 * @memberOf APIAuthRoutesHandlers
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 *
 * @param {number} res.status
 * @param {object} res.user
 */

function sendTwitterData(req, res) {
    if (!req.user) {
        return res
            .status(httpStatus.NOT_FOUND)
            .json({message: 'User Not Authenticated'});
    }

    postTwit(".@" + req.user.twitter.name + " has been registered in my event manager app.")
        .then((data) => {
            winston.info('Register twit has been posted.');
        })
        .catch((error) => {
            winston.error(`An error occurred during posting the twit: ${error.message}`);
        });

    return res
        .status(httpStatus.OK)
        .json({twitterData: req.user.twitter})
}

/**
 * Find user object from database using auth data
 *
 * @function getCurrentUser
 * @param {string} url - POST /api/v1/auth/me
 * @memberOf APIAuthRoutesHandlers
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 *
 * @param {number} res.status
 * @param {object} res.user
 * @param {boolean} res.success
 * @param {string} res.message
 */
function getCurrentUser(req, res) {
    User
        .findById(req.auth.id)
        .exec()
        .then((user) => {
            if (user) {
                return res.status(httpStatus.OK).json(user);
            } else {
                return Promise.reject(new AppError(`Couldn\'t find user with id ${req.auth.id}`, httpStatus.OK, true))
            }
        })
        .catch((error) => res
            .status(error.status || httpStatus.INTERNAL_SERVER_ERROR)
            .json({
                message: `Error on getting current user: ${error.message}`,
                success: false
            }));
}

exports.getCurrentUser = getCurrentUser;
exports.sendTwitterData = sendTwitterData;
exports.logIn = logIn;
exports.signUp = signUp;
exports.twitterAuth = twitterAuth;
exports.twitterRequestToken = twitterRequestToken;
