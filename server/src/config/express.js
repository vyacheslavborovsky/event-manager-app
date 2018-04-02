const appRoutes = require('../api/routes');
const bodyParser = require('body-parser');
const compress = require('compression');
const config = require('./variable');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require("../api/utils/common.utils").errorHandler;
const express = require('express');
const helmet = require('helmet');
const initMongooseSession = require('./mongoose');
const initPassportStrategies = require("./passport").initPassportStrategies;
const methodOverride = require('method-override');
const morgan = require('morgan');
const passport = require("passport");
const path = require('path');
const session = require('express-session');
const winston = require('./winston');
const {authenticate} = require("../api/middleware/auth.middleware");
const errorDomainMiddleware = require('express-domain-middleware');

const secretWord = 'my-super-power-secret';


const app = express();

if (config.mode !== 'testing') {
    initMongooseSession.connect();
}

initPassportStrategies(passport);

app.use(express.static(path.resolve(__dirname, '../../../client/build')));

app.use(morgan(config.logs, {stream: winston.stream}));
app.use(cors({
    origin: ['http://localhost:3000']
}));
app.use(compress());
app.use(helmet());
app.use(methodOverride());
app.use(cookieParser(secretWord));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: secretWord,
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(errorDomainMiddleware);

app.use('/api/v1', authenticate.unless({path: [/^\/api\/v1\/auth\w*((?!\/me).)/]}));
app.use('/api/v1', appRoutes);

app.use(errorHandler);

app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../../../client/build', 'index.html'));
});

module.exports = app;
