function AppError(message, status, isOperational) {
    Error.call(this);
    Error.captureStackTrace(this);
    this.message = message;
    this.status = status;
    this.isOperational = isOperational;
}

require('util').inherits(AppError, Error);

module.exports = AppError;
