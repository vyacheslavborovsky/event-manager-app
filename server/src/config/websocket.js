/**
 * @namespace WebSocket
 */

const subscribeToTwitterStream = require("./twitter").subscribeToTwitterStream;
const url = require('url');
const WebSocket = require('ws');
const winston = require('winston');

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

    function noop() {
    }

    webSocketServer.on('connection', function (ws, req) {
        const {query: {userId}} = url.parse(req.url, true);
        ws.id = userId;

        ws.on('pong', heartbeat);

        ws.on('message', message => winston.info(message));

        ws.on('error', error => winston.error(`Error: ${error}`));

        ws.on('close', () => winston.error('close ws'));
    });


    setInterval(() => {
        webSocketServer.clients.forEach(wsClient => {
            if (wsClient.isAlive === false) return wsClient.terminate();

            wsClient.isAlive = false;
            wsClient.ping(noop);
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
