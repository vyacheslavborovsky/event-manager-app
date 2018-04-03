const winston = require('winston');
const config = require("../../config/variable");
const httpStatus = require('http-status');

/**
 * App errors handler middleware
 *
 * @function errorHandler
 *
 * @param {object} err - error object
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 * @param {object} next - express self-generated method to pass request to the next handler in a queue
 */
function errorHandler(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = config.mode === 'development' ? err : {};
    console.log('Message: ', err.message);

    winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - on domain: ${process.domain.id} - ${req.ip}`);

    res.status(err.status);
    res.json({
        code: err.status,
        message: err.message || httpStatus[err.status]
    });
    res.end();
}

exports.errorHandler = errorHandler;
