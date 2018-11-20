const config = require("../../config/variable");
const httpStatus = require('http-status');
const winston = require('winston');

/**
 * App errors handler middleware
 *
 * @function errorHandler
 *
 * @param {object} err - error object
 * @param {number} err.status
 * @param {string} err.message
 * @param {object} err.stackTrace
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 * @param {object} next - express self-generated method to pass request to the next handler in a queue
 */
function errorHandler(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = config.mode === 'development' ? err : {};

    // winston.error(`${err.status || httpStatus.INTERNAL_SERVER_ERROR} - ${err.message} - Is Operational: ${req.isOperational || 'False'} - ${req.originalUrl} - ${req.method} - on domain: ${process.domain.id} - ${req.ip}`);

    const status = err.status >= 100 && err.status < 600 ? err.status : 500
    res
        .status(status)
        .json({
            code: status,
            message: err.message || httpStatus[status]
        });

    res.end();
}

exports.errorHandler = errorHandler;
