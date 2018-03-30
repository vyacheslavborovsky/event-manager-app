const WebSocket = require('ws');
const url = require('url');
const config = require("./variable");
const runNotificationJob = require("../api/utils/usersNotifyProcess").runNotificationJob;
const clearNotificationJob = require("../api/utils/usersNotifyProcess").clearNotificationJob;
const subscribeToTwitterStream = require("./twitter").subscribeToTwitterStream;

let webSocketServer;

exports.initWebSocket = function (server) {
    webSocketServer = new WebSocket.Server({server});

    webSocketServer.broadcast = function (data) {
        webSocketServer.clients.forEach(function (client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    };

    webSocketServer.setToParticularUser = function (userId, data) {
        webSocketServer.clients.forEach(function (client) {
            if (client.readyState === WebSocket.OPEN && client.id === userId) {
                client.send(JSON.stringify(data));
            }
        });
    };

    if (config.mode === 'production') {
        runNotificationJob();
    }

    subscribeToTwitterStream(webSocketServer);

    function heartbeat() {
        this.isAlive = true;
    }

    webSocketServer.on('connection', function (ws, req) {
        console.log('URL: ', req);
        const { query: { userId } } = url.parse(req.url, true);
        ws.id = userId;
        ws.on('pong', heartbeat);

        ws.on('message', function (message) {
            console.log(message);
        });

        ws.on('error', function (err) {
            console.log('Error: ', err)
        });

        ws.on('close', function () {
            console.log('close ws');
        });
    });

    function noop() {
    }

    const interval = setInterval(function ping() {
        webSocketServer.clients.forEach(function each(ws) {
            if (ws.isAlive === false) return ws.terminate();

            ws.isAlive = false;
            ws.ping(noop);
        });
    }, 30000);

    process.on('exit', function () {
        clearInterval(interval);
        clearNotificationJob();
    })
};

exports.getSocketServer = function () {
    return webSocketServer
};

