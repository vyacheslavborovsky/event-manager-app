/**
 * @namespace WebSocket
 */

const WebSocket = require('ws');
const url = require('url');
const subscribeToTwitterStream = require("./twitter").subscribeToTwitterStream;

let webSocketServer = null;

/**
 * Initialize an instance of WebSocket channel
 *
 * @function initWebSocket
 * @memberOf WebSocket
 *
 * @param {object} server - an instance of express server
 */
function initWebSocket(server) {
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

    subscribeToTwitterStream(webSocketServer);

    function heartbeat() {
        this.isAlive = true;
    }

    webSocketServer.on('connection', function (ws, req) {
        const {query: {userId}} = url.parse(req.url, true);
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

    setInterval(function ping() {
        webSocketServer.clients.forEach(function each(ws) {
            if (ws.isAlive === false) return ws.terminate();

            ws.isAlive = false;
            ws.ping(noop);
        });
    }, 30000);
}

/**
 * Returns instance of websocket server
 *
 * @function getSocketServer
 * @memberOf WebSocket
 *
 * @return {object} webSocketServer
 */
function getSocketServer() {
    return webSocketServer;
}

exports.initWebSocket = initWebSocket;
exports.getSocketServer = getSocketServer;
