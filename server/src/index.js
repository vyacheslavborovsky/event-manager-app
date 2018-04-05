const config = require("./config/variable");
const expressServer = require('./config/express');
const runNotificationJob = require("./api/utils/usersNotifyProcess").runNotificationJob;
const winston = require('winston');
const {initWebSocket} = require("./config/websocket");

let PORT = config.common.port || 5555;

let appServer = expressServer.listen(PORT, () => {
    winston.info(`server is running on port ${PORT}`);
});

initWebSocket(appServer);

if (config.mode === 'production') {
    runNotificationJob();
}
