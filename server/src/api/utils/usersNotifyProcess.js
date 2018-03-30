const {fork} = require('child_process');
const notification = fork(__dirname + '/../services/notifications.js');

let notificationTimer;

const sendStartMessage = function () {
    notification.send('startJob');
};

exports.runNotificationJob = function () {
    sendStartMessage();
    notificationTimer = setInterval(sendStartMessage, 1000 * 60 * 15);

    notification.on('message', function ({message, total}) {
        if (message === 'Ended') {
            console.log(`Notification Job has been finished at ${new Date().toLocaleString()} with ${total} sent ${total === 1 ? 'message' :  'messages'}`);
        } else if (message.includes('Error')) {
            console.log('Error during exec notification job: ', message)
        }
    });
};
