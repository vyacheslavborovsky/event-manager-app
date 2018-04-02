const getSocketServer = require("../../config/websocket").getSocketServer;
const {fork} = require('child_process');
const notification = fork(__dirname + '/../services/notifications.js');

const sendStartMessage = function () {
    notification.send('startJob');
};

function runNotificationJob() {
    const socketServer = getSocketServer();

    sendStartMessage();
    setInterval(sendStartMessage, 1000 * 60 * 15);

    notification.on('message', function ({message, payload, userId}) {
        switch (message) {
            case 'Ended':
                console.log(`Notification Job has been finished at ${new Date().toLocaleString()} with ${payload} sent ${payload === 1 ? 'message' : 'messages'}`);
                break;
            case 'Error':
                console.log('Error during exec notification job');
                break;
            case 'Notify':
                socketServer.setToParticularUser(userId, JSON.parse(payload));
                break;
            default:
                console.log('Unknown message');
        }
    });
}

exports.runNotificationJob = runNotificationJob;
