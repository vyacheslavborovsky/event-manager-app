const express = require('express');
const passport = require("passport");
const {generateToken, sendToken} = require("../utils/jwt.utils");
const {getCurrentUser} = require("../controllers/auth.controller");
const {logIn, signUp} = require("../controllers/auth.controller");
const {twitterRequestToken, twitterAuth, sendTwitterData} = require("../controllers/auth.controller");


const router = express.Router();

router.route('/register/local')
    .post(passport.authenticate('local-register'), signUp);

router.route('/login/local')
    .post(passport.authenticate('local-login'), logIn, generateToken, sendToken);

router.route('/twitter/reverse')
    .post(twitterRequestToken);

router.route('/twitter')
    .post(twitterAuth, passport.authenticate('twitter-token'), sendTwitterData);

router.route('/me')
    .get(getCurrentUser);

module.exports = router;
