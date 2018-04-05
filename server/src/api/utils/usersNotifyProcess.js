/**
 * @namespace Notification
 * @type {getSocketServer}
 */

const config = require('../../config/variable');
const winston = require("winston");
const sendWelcomeMessage = require("./mailer").sendWelcomeMessage;
const getSocketServer = require("../../config/websocket").getSocketServer;
const {fork} = require('child_process');
const notification = fork(__dirname + '/../services/notifications.js');


/**
 * Send message to child process to start notification job
 *
 * @function sendStartMessage
 * @memberOf Notification
 */
function sendStartMessage() {
    notification.send('startJob');
}


/**
 * Handler for incoming messages from child process
 * @function notificationHandler
 * @memberOf Notification
 *
 * @param {string} message
 * @param {object} payload
 * @param {number} payload.sentMessages
 * @param {number} payload.sentMessages
 * @param {string} payload.ACTION_TYPE
 * @param {string} payload.title
 * @param {string} payload.untill
 * @param {string} userId
 */
function notificationHandler({message, payload, userId}) {
    switch (message) {
        case 'Ended':
            winston.info(`Notification Job has been finished at ${new Date().toLocaleString()} with ${payload.sentMessages} sent ${payload.sentMessages === 1 ? 'message' : 'messages'}`);
            break;
        case 'Error':
            winston.info('Error during exec notification job');
            break;
        case 'Notify':
            getSocketServer().setToParticularUser(userId, JSON.parse(payload));
            break;
        default:
            winston.info(`Unknown incoming message: ${message}`);
    }
}

/**
 * Execute in a background thread the task to notify users about their upcoming events
 *
 * @function runNotificationJob
 * @memberOf Notification
 */
function runNotificationJob() {
    sendStartMessage();
    setInterval(sendStartMessage, config.common.notificationDelay);

    notification.on('message', notificationHandler);
}

/**
 * Send email
 */
function signUpNotify() {
    sendWelcomeMessage(user.local.username, user.local.email)
        .then((response) => {
            winston.info('Welcome message has been sent.');
        })
        .catch((error) => {
            winston.error(`Send welcome message error: ${error}`);
        });

    const payload = {
        ACTION_TYPE: 'REGISTERED_USER',
        username: user.local.username
    };

    getSocketServer().broadcast(payload);
}

exports.runNotificationJob = runNotificationJob;
exports.signUpNotify = signUpNotify;
