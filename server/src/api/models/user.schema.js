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

UserSchema.statics.insertTwitterData = function (req, token, tokenSecret, profile) {
    const User = this;

    return new Promise(function (resolve, reject) {
        if (req.query.currentUserId) {
            const findQuery = User.findById(req.query.currentUserId).exec();

            findQuery
                .then(function (user) {
                    if (user) {
                        user.twitter = {
                            id: profile['id'],
                            token: token,
                            tokenSecret: tokenSecret,
                            username: profile['displayName'],
                            name: profile['username'],
                            avatarUrl: profile['photos'][0]['value'],
                            email: profile['emails'][0]['value']
                        };

                        const saveQuery = user.save();

                        saveQuery
                            .then(function (user) {
                                resolve(user);
                            })
                            .catch(function (error) {
                                reject('Error during save twitter data: ', error);
                            });
                    }
                })
                .catch(function (error) {
                    reject('Error during find user: ', error);
                });
        } else {
            reject('userId field is missing. Request has benn terminated.')
        }
    });
};

exports = mongoose.model('User', UserSchema);
