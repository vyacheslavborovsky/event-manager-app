const bcrypt = require('bcryptjs');
const config = require('./variable');
const LocalStrategy = require('passport-local').Strategy;
const TwitterTokenStrategy = require('passport-twitter-token');
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
            if (user) {
                return done(null, false, "This username is already reserved");
            }

            const newUser = new User({
                local: {
                    username: username,
                    password: bcrypt.hashSync(password, 8),
                    email: req.body.email
                }
            });

            newUser.save(function (err, newlyUser) {
                if (err) {
                    throw err;
                }

                return done(null, newlyUser);
            });
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
    const loginQuery = User.findOne({'local.username': username}).exec();

    loginQuery
        .then(function (user) {
            if (!user) {
                return done(null, false, "Account not found. Please, check your credential");
            }

            if (!bcrypt.compareSync(password, user.local.password)) {
                return done(null, false, "Password invalid. Try again, please");
            }

            return done(null, user);
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

function initPassportStrategies(passport) {
    passport.use('local-register', registerStrategy);
    passport.use('local-login', loginStrategy);
    passport.use(twitterAuthStrategy);
}

exports.initPassportStrategies = initPassportStrategies;
