const express = require('express');
const passport = require("passport");
const postTwit = require("../../config/twitter").postTwit;
const {generateToken, sendToken} = require("../utils/jwt.utils");
const {getOne, getCurrentUser }= require("../utils/common.utils");
const {logIn, signUp} = require("../controllers/auth.controller");
const {twitterRequestToken, twitterAuth } = require("../controllers/auth.controller");


const router = express.Router();

router.route('/register/local')
    .post(passport.authenticate('local-register'), signUp);

router.route('/login/local')
    .post(passport.authenticate('local-login'), logIn, generateToken, sendToken );

router.route('/twitter/reverse')
    .post(twitterRequestToken);

router.route('/twitter')
    .post(twitterAuth, passport.authenticate('twitter-token'), function (req, res, next) {
        if (!req.user) {
            res.status(401);
            return res.json({message: 'User Not Authenticated'});
        }

        postTwit(".@" + req.user.twitter.name + " has been registered in my event manager app.");
        res.status(200);
        return res.json({twitterData: req.user.twitter})
    });

router.route('/me')
    .get(getCurrentUser, getOne);

module.exports = router;
