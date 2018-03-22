const expressServer = require('./config/express');
const config = require("./config/variable");
const {initWebSocket} = require("./config/websocket");

const PORT = config.common.port || 5555;

const appServer = expressServer.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});

initWebSocket(appServer);

module.exports = appServer;
