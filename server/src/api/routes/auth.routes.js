const express = require('express');
const passport = require("passport");
const postTwit = require("../../config/twitter").postTwit;
const {getOne, getCurrentUser }= require("../utils/common.utils");
const {twitterRequestToken, twitterAuth } = require("../controllers/auth.controller");
const {authenticate }= require("../middleware/auth.middleware");
const {generateToken, sendToken} = require("../utils/jwt.utils");
const {logIn, signUp} = require("../controllers/auth.controller");


const router = express.Router();

router.route('/register/local')
    .post(signUp);

router.route('/login/local')
    .post(logIn, generateToken, sendToken );

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
    .get(authenticate, getCurrentUser, getOne);

module.exports = router;
