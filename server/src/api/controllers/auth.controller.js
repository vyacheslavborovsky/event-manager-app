/**
 * @namespace APIAuthRoutesHandlers
 */

const config = require("../../config/variable");
const httpStatus = require('http-status');
const request = require("request");
const {getSocketServer} = require('../../config/websocket');
const {sendWelcomeMessage} = require("../utils/mailer");


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
        res.status(httpStatus.INTERNAL_SERVER_ERROR);
        return res.json({message: "Error during register.", success: false});
    }

    sendWelcomeMessage(user.local.username, user.local.email, getSocketServer());
    const wss = getSocketServer();

    const payload = {
        ACTION_TYPE: 'REGISTERED_USER',
        username: user.local.username
    };

    wss.broadcast(payload);

    res.status(httpStatus.OK);
    return res.json({message: "Account has been created", success: true, account: req.user});
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

    res.status(httpStatus.NOT_FOUND);
    return res.json({message: "User not found.", success: false});
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

    request.post({
        url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
        oauth: {
            consumer_key: config.twitterProvider.consumerKey,
            consumer_secret: config.twitterProvider.consumerSecret,
            token: req.query['oauth_token']
        },
        form: {
            oauth_verifier: verifier
        }
    }, function (err, r, body) {
        if (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR);
            return res.json({message: err.message})
        }

        const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        const parsedBody = JSON.parse(bodyString);

        req.body['oauth_token'] = parsedBody.oauth_token;
        req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
        req.body['user_id'] = parsedBody.user_id;
        req.query.currentUserId = params[0];

        next();
    });
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
    request.post({
        url: 'https://api.twitter.com/oauth/request_token',
        oauth: {
            oauth_callback: config.twitterProvider.callbackUrl,
            consumer_key: config.twitterProvider.consumerKey,
            consumer_secret: config.twitterProvider.consumerSecret
        }
    }, function (err, r, body) {
        if (err) {
            return res.send(500, {message: err.message});
        }

        const jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        res.send(JSON.parse(jsonStr));
    })
}

exports.signUp = signUp;
exports.logIn = logIn;
exports.twitterAuth = twitterAuth;
exports.twitterRequestToken = twitterRequestToken;
