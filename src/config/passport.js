const TwitterTokenStrategy = require('passport-twitter-token');
const User = require('mongoose').model('User');
const config = require('./variable');
const bcrypt = require('bcryptjs');

const LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-register', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        emailField: 'email',
        passReqToCallback: true
    }, function (req, username, password, done) {
        User.findOne({'local.username': username}, function (err, user) {
            if (err) {
                return done(err);
            }

            if (user) {
                return done(null, false, "This username is already reserved");
            }

            const newUser = new User({
                local: {
                    username: username,
                    password: bcrypt.hashSync(password, 8),
                    email: req.body['email']
                }
            });

            newUser.save(function (err, newlyUser) {
                if (err) {
                    throw err;
                }

                return done(null, newlyUser);
            })

        })


    }));


    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, username, password, done) {
        process.nextTick(function () {

            User.findOne({'local.username': username,}, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, "Account not found. Please, check your credential");
                }

                if (!bcrypt.compareSync(password, user.local.password)) {
                    return done(null, false, "Password invalid. Try again, please");
                }

                return done(null, user);
            })
        });
    }));


    passport.use(new TwitterTokenStrategy({
        consumerKey: config.twitterProvider.consumerKey,
        consumerSecret: config.twitterProvider.consumerSecret,
        callbackUrl: config.twitterProvider.callbackUrl,
        includeEmail: config.twitterProvider.includeEmail,
        passReqToCallback: true
    }, function (req, token, tokenSecret, profile, done) {
        process.nextTick(function () {
            User.insertTwitterData(req, token, tokenSecret, profile, function (err, user) {
                return done(err, user);
            })
        });
    }));

};
