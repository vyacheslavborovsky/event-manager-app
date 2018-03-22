const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    local: {
        type: {
            username: String, unique: true,
            password: String,
            email: {
                type: String,
                trim: true,
                match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            }
        }
    },
    twitter: {
        type: {
            id: String,
            token: {
                type: String,
                select: false
            },
            tokenSecret: {
                type: String,
                select: false
            },
            username: String,
            avatarUrl: String,
            name: String,
            email: {
                type: String,
                trim: true,
                match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            }
        }
    }
});

UserSchema.set('toJSON', {getters: true, virtuals: true});

UserSchema.statics.insertTwitterData = function (req, token, tokenSecret, profile, callback) {
    const User = this;

    if (!req.query['currentUserId']) {
        this.findOne({
            'twitter.id': profile.id
        }, function (err, user) {
            if (!user) {
                const newUser = new User({
                    twitter: {
                        id: profile['id'],
                        token: token,
                        tokenSecret: tokenSecret,
                        username: profile['displayName'],
                        name: profile['username'],
                        avatarUrl: profile['photos'][0]['value'],
                        email: profile['emails'][0]['value']
                    }
                });

                newUser.save(function (error, user) {
                    if (error) {
                        console.log(error);
                    }

                    return callback(error, user);
                });
            } else {
                return callback(null, user);
            }
        });
    } else {
        this.findById(req.query['currentUserId'], function (err, user) {
            if (err) {
                return callback(null, user);
            }

            if (user) {
                user['twitter'] = {
                    id: profile['id'],
                    token: token,
                    tokenSecret: tokenSecret,
                    username: profile['displayName'],
                    name: profile['username'],
                    avatarUrl: profile['photos'][0]['value'],
                    email: profile['emails'][0]['value']
                }
            }

            user.save(function (err, user) {
                if (err) {
                    throw err;
                }

                return callback(null, user);
            })
        });
    }
};


exports = mongoose.model('User', UserSchema);
