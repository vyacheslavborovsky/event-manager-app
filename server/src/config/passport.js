/**
 * @namespace passport
 */

const bcrypt = require('bcryptjs');
const config = require('./variable');
const LocalStrategy = require('passport-local').Strategy;
const TwitterTokenStrategy = require('passport-twitter-token');
const httpStatus = require('http-status');
const User = require('mongoose').model('User');
const AppError = require('../api/utils/error');

const registerStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    emailField: 'email',
    passReqToCallback: true
}, function (req, username, password, done) {
    const registerQuery = User.findOne({
        $or: [
            {'local.username': username},
            {'local.email': req.body.email}
        ]
    }).exec();

    registerQuery
        .then(user => {
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
                    .then(newlyUser => done(null, newlyUser))
                    .catch(err => done(err));
            } else {
                return Promise.reject(new AppError("User with such username/email already exists.", httpStatus.OK, true));
            }
        })
        .catch(error => done(error));
});

const loginStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, username, password, done) {
    User
        .findOne({'local.username': username})
        .exec()
        .then(user => {
            if (user) {
                if (!bcrypt.compareSync(password, user.local.password)) {
                    return Promise.reject(new AppError("Password invalid. Try again, please.", httpStatus.OK, true));
                }

                return done(null, user);
            } else {
                return Promise.reject(new AppError("Account not found. Please, check your credential.", httpStatus.OK, true));
            }
        })
        .catch(error => done(error));
});

const twitterAuthStrategy = new TwitterTokenStrategy({
    consumerKey: config.twitterProvider.consumerKey,
    consumerSecret: config.twitterProvider.consumerSecret,
    callbackUrl: config.twitterProvider.callbackUrl,
    includeEmail: config.twitterProvider.includeEmail,
    passReqToCallback: true
}, function (req, token, tokenSecret, profile, done) {
    User.insertTwitterData(req, token, tokenSecret, profile)
        .then(response => done(null, response))
        .catch(error => done(error));
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
    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser(id => User
        .findById(id)
        .exec()
        .then(user => done(null, user))
        .catch(error => done(error))
    );

    passport.use('local-register', registerStrategy);
    passport.use('local-login', loginStrategy);
    passport.use(twitterAuthStrategy);
}

exports.initPassportStrategies = initPassportStrategies;
