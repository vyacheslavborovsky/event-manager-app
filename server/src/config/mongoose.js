/**
 * @namespace Mongoose
 */

const mongoose = require('mongoose');
const Promise = require('bluebird');
const winston = require('winston');
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
    mongoose
        .connect(globalConfig.mongo.uri + globalConfig.mongo.db, {
            keepAlive: 1,
            useMongoClient: true,
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            winston.error('DB error: ', error);
            process.exit(1);
        });
}

exports.connect = connect;
