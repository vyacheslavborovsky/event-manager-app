const bodyParser = require('body-parser');
const compress = require('compression');
const config = require('./variable');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const methodOverride = require('method-override');
const morgan = require('morgan');
const passport = require("passport");
const session = require('express-session');
const appRoutes = require('../api/routes');
const initMongooseSession = require('./mongoose');
const initAuthStrategies = require('./passport');
const runNotificationJob = require("../api/utils/usersNotifyProcess").runNotificationJob;

const app = express();

if (config.mode.trim() !== 'testing') {
    initMongooseSession.connect();

    if (config.mode.trim() === 'production') {
        runNotificationJob();
    }
}

initAuthStrategies(passport);

app.use(express.static(__dirname + "/../../webapp/build"));

app.use(morgan(config.logs));
app.use(cors());
app.use(compress());
app.use(helmet());
app.use(methodOverride());
app.use(cookieParser('my-super-power-secret'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'my-super-power-secret',
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1', appRoutes);


module.exports = app;
