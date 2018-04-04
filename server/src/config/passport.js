/**
 * @namespace passport
 */

const bcrypt = require('bcryptjs');
const config = require('./variable');
const LocalStrategy = require('passport-local').Strategy;
const TwitterTokenStrategy = require('passport-twitter-token');
const httpStatus = require('http-status');
const User = require('mongoose').model('User');

const registerStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    emailField: 'email',
    passReqToCallback: true
}, function (req, username, password, done) {
    const registerQuery = User.findOne({'local.username': username}).exec();

    registerQuery
        .then(function (user) {
            if (!user) {
                const newUser = new User({
                    local: {
                        username: username,
                        password: bcrypt.hashSync(password, 8),
                        email: req.body.email
                    }
                });

                newUser
                    .save()
                    .then(function (newlyUser) {
                        return done(null, newlyUser);
                    })
                    .catch(function (err) {
                        return done(err);
                    });
            } else {
                return done({
                    status: httpStatus.OK,
                    success: false,
                    message: "User with such username already exists."
                })
            }
        })
        .catch(function (error) {
            return done(error);
        });
});

const loginStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, username, password, done) {
    User
        .findOne({'local.username': username})
        .exec()
        .then(function (user) {
            if (user) {
                if (!bcrypt.compareSync(password, user.local.password)) {
                    return done({
                        status: httpStatus.OK,
                        success: false,
                        message: "Password invalid. Try again, please."
                    });
                }

                return done(null, user);
            } else {
                return done({
                    status: httpStatus.OK,
                    success: false,
                    message: "Account not found. Please, check your credential."
                })
            }
        })
        .catch(function (error) {
            return done(error);
        });
});

const twitterAuthStrategy = new TwitterTokenStrategy({
    consumerKey: config.twitterProvider.consumerKey,
    consumerSecret: config.twitterProvider.consumerSecret,
    callbackUrl: config.twitterProvider.callbackUrl,
    includeEmail: config.twitterProvider.includeEmail,
    passReqToCallback: true
}, function (req, token, tokenSecret, profile, done) {
    User.insertTwitterData(req, token, tokenSecret, profile)
        .then(function (response) {
            return done(null, response);
        })
        .catch(function (error) {
            return done(error);
        })
});

/**
 * Initialize register and login strategies for the app
 *
 * @function initPassportStrategies
 * @memberOf passport
 *
 * @param {object} passport
 */
function initPassportStrategies(passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id) {
        User
            .findById(id)
            .exec()
            .then(function (user) {
                done(null, user);
            })
            .catch(function (error) {
                done(error)
            })
    });

    passport.use('local-register', registerStrategy);
    passport.use('local-login', loginStrategy);
    passport.use(twitterAuthStrategy);
}

exports.initPassportStrategies = initPassportStrategies;
