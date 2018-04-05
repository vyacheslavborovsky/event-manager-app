const appRoutes = require('../api/routes');
const bodyParser = require('body-parser');
const compress = require('compression');
const config = require('./variable');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorDomainMiddleware = require('express-domain-middleware');
const express = require('express');
const helmet = require('helmet');
const initMongooseSession = require('./mongoose');
const initPassportStrategies = require("./passport").initPassportStrategies;
const methodOverride = require('method-override');
const morgan = require('morgan');
const passport = require("passport");
const path = require('path');
const RateLimit = require('express-rate-limit');
const session = require('express-session');
const winston = require('./winston');
const errorHandler = require("../api/middleware/common").errorHandler;
const {authenticate} = require("../api/middleware/auth.middleware");

const secretWord = '';

let authRateLimiter = new RateLimit({
    windowMs: 60 * 60 * 60,
    delayAfter: 1,
    delayMs: 3 * 1000,
    max: 5,
    message: 'There are too many auth requests from this IP address. Try again after 1 hour.'
});

let app = express();

if (config.mode !== 'testing') {
    initMongooseSession.connect();
}

initPassportStrategies(passport);
app.use(cors({origin: [config.common.reactDevUri]}));
app.use(helmet());
app.use(morgan(config.logs, {stream: winston.stream}));
app.use(express.static(path.resolve(__dirname, '../../../client/build')));
app.use(compress());
app.use(methodOverride());
app.use(cookieParser(secretWord));
app.use(bodyParser.json());
app.use(session({secret: secretWord, resave: true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(errorDomainMiddleware);

app.use('/api/v1/auth', authRateLimiter);
app.use('/api/v1', authenticate().unless({path: [/^\/api\/v1\/auth\w*((?!\/me).)/]}));
app.use('/api/v1', appRoutes);

app.use(errorHandler);

app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../../../client/build', 'index.html'));
});

module.exports = app;
