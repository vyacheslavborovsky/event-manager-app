const path = require('path');

require('dotenv-safe').load({
    path: `./.env.${process.env.NODE_ENV.trim()}`,
    sample: './.env.example'/*path.join(__dirname, '/../../.env.example')*/,
});

module.exports = {
    mode: process.env.NODE_ENV,
    common: {
        jwtSecret: 'secret-code',
        port: process.env['PORT']
    },
    twitterProvider: {
        consumerKey: process.env['TWITTER_CONSUMER_KEY'],
        consumerSecret: process.env['TWITTER_CONSUMER_SECRET'],
        accessTokenKey: process.env['TWITTER_ACCESS_TOKEN'],
        accessTokenSecret: process.env['TWITTER_TOKEN_SECRET'],
        callbackUrl: process.env['TWITTER_CALLBACK_URL'],
        includeEmail: true
    },
    mailerProvider: {
        service: process.env['MAILER_SERVICE'],
        auth: {
            user: process.env['MAILER_AUTH_USER'],
            pass: process.env['MAILER_AUTH_PASSWORD']
        }
    },
    mongo: {
        uri: process.env['MONGO_URI'],
        db: process.env['MONGO_DB'],
    },
    logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
