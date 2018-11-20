const path = require('path');
const mode = process.env.NODE_ENV.trim();

if (mode !== 'production') {
    require('dotenv-safe').load({
        path: path.join(__dirname, `../../.env.${mode}`),
        sample: path.join(__dirname, '../../.env.example')
    });
}

module.exports = {
    mode: mode,
    appUrl: process.env.APP_URL,
    common: {
        jwtSecret: 'secret-code',
        jwtExpire: 7200,
        jwtHeader: 'x-auth-token',
        notificationDelay: 900000,
        expressSessionSecret: "my-super-power-secret",
        port: process.env.PORT,
        reactDevUri: process.env.REACT_LOCAL_URI
    },
    twitterProvider: {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        accessTokenKey: process.env.TWITTER_ACCESS_TOKEN,
        accessTokenSecret: process.env.TWITTER_TOKEN_SECRET,
        callbackUrl: process.env.TWITTER_CALLBACK_URL,
        twitterAccessUrl: 'https://api.twitter.com/oauth/access_token?oauth_verifier',
        twitterRequestUrl: 'https://api.twitter.com/oauth/request_token',
        twitterTimeout: 120000,
        includeEmail: true
    },
    mailerProvider: {
        service: process.env.MAILER_SERVICE,
        auth: {
            user: process.env.MAILER_AUTH_USER,
            pass: process.env.MAILER_AUTH_PASSWORD
        }
    },
    mongo: {
        uri: process.env.MONGO_URI,
        db: process.env.MONGO_DB,
    },
    logs: mode === 'production' ? 'combined' : 'dev',
};
