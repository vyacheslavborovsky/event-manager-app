require('../models/user.schema');
const User = require('mongoose').model('User');

const getCurrentUser = function (req, res, next) {

    User.findById(req.auth.id, function (err, user) {
        if (err || !user) {
            res.status(404);
            return res.json({message: "could not get current user", success: false})
        } else {
            req.user = user;
            next();
        }
    });
};

const getOne = function (req, res) {
    const user = req.user.toObject();
    res.json(user);
};


exports.getCurrentUser = getCurrentUser;
exports.getOne = getOne;
