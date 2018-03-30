const httpStatus = require('http-status');
const passport = require('passport');
const request = require("request");
const config = require("../../config/variable");
const {sendWelcomeMessage} = require("../utils/mailer");
const {getSocketServer} = require('../../config/websocket');


exports.signUp = (req, res, next) => {
    passport.authenticate('local-register', function (err, user, info) {
        if (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR);
            return res.json({message: 'An error occur', success: false});
        }

        if (!user) {
            res.status(httpStatus.OK);
            return res.json({message: info, success: false});
        }

        sendWelcomeMessage(user.local.username, user.local.email, getSocketServer());
        const wss = getSocketServer();

        const payload = {
            ACTION_TYPE: 'REGISTERED_USER',
            username: user.local.username
        };
        
        wss.broadcast(payload);

        res.status(httpStatus.OK);
        return res.json({message: "Account has been created", success: true, account: user});
    })(req, res, next);
};

exports.logIn = (req, res, next) => {
    passport.authenticate('local-login', function (err, user, info) {
        if (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR);
            return res.json({message: 'Server error occur during login', success: false});
        }

        if (!user) {
            res.status(httpStatus.OK);
            return res.json({message: info, success: false});
        }

        req.user = user;

        return next();
    })(req, res, next);
};

exports.twitterAuth = (req, res, next) => {
    const params = req.query['userId'].split('?');
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
        req.query['currentUserId'] = params[0];

        next();
    });
};

exports.twitterRequestToken = (req, res) => {
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
};
