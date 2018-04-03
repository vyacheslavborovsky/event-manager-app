/**
 * @namespace Mongoose
 */

const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
const globalConfig = require('./variable');

/**
 * Establish connection with mongo database
 *
 * @function connect
 * @memberOf Mongoose
 *
 * @return {object} connection - mongo connection instance
 */
function connect() {
    mongoose.connect(globalConfig.mongo.uri + globalConfig.mongo.db, {
        keepAlive: 1,
        useMongoClient: true,
    }, function (err) {
        if (err) {
            console.log('DB error: ', err);
            process.exit(1);
        }
    });

    return mongoose.connection;
}

exports.connect = connect;
