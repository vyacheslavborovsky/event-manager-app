const expressServer = require('./config/express');
const config = require("./config/variable");
const {initWebSocket} = require("./config/websocket");
const cluster = require('cluster');
const runNotificationJob = require("./api/utils/usersNotifyProcess").runNotificationJob;
const numCPUs = require('os').cpus().length;

const PORT = config.common.port || 5555;

const appServer = expressServer.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});

initWebSocket(appServer);

/*if (config.mode === 'production') {
    runNotificationJob();
}*/

/*if (cluster.isMaster) {
    console.error(`Node cluster master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
    });

} else {
    const PORT = config.common.port || 5555;

    const appServer = expressServer.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });

    initWebSocket(appServer);

    if (config.mode === 'production') {
        runNotificationJob();
    }
}*/
