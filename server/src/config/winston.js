const winston = require('winston');

const options = {
    file: {
        level: 'info',
        filename: `app.log`,
        timestamp: true,
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false
    },
    console: {
        level: 'debug',
        prettyPrint: true,
        silent: false,
        handleExceptions: true,
        json: false,
        colorize: process.stdout.isTTY,
    }
};

const logger = new winston.Logger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false
});

logger.stream = {
    write: function (message) {
        logger.info(message);
    }
};

module.exports = logger;
