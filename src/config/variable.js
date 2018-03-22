const path = require('path');

require('dotenv-safe').load({
    path: path.join(__dirname + `/../../.env.${process.env.NODE_ENV.trim()}`),
    sample: path.join(__dirname, '/../../.env.example'),
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
    instagramProvider: {
        clientId: process.env['INSTAGRAM_APP_CLIENT_ID'],
        clientSecret: process.env['INSTAGRAM_CLIENT_SECRET'],
        redirectUri: process.env['INSTAGRAM_CLIENT_CALLBACK_URL'],
        authUrl: `${process.env['INSTARGRAM_AUTH_URL']}/?client_id=${process.env['INSTAGRAM_APP_CLIENT_ID']}&redirect_uri=${process.env['INSTAGRAM_CLIENT_CALLBACK_URL']}&response_type=code`,
        accessTokenUrl: process.env['INSTAGRAM_ACCESS_TOKEN_URL'],
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
