require('../models/user.schema');
require('../models/event.schema');
const Event = require('mongoose').model('Event');
const initMongooseSession = require('../../config/mongoose');
const moment = require('moment');
const getSocketServer = require("../../config/websocket").getSocketServer;
const {sendNotificationMessage} = require("../utils/mailer");


startNotificationJob = function () {
    console.log(`Notification Job has started at ${new Date().toLocaleString()}`);
    return new Promise(function (resolve, reject) {
        Event.getUpcomingEvents()
            .then(function (response) {
                const now = new Date();

                const events = response
                    .filter(item => {
                        const diff = moment.duration(moment(item.startDate).diff(moment(now)));
                        return item.userId && diff['_data']['hours'] === 0 && diff['_data']['days'] === 0 && diff['_data']['minutes'] <= 15;
                    })
                    .map(item => {
                        const diff = moment.duration(moment(item.startDate).diff(moment(now)));
                        const minutes = diff['_data']['minutes'];
                        const seconds = diff['_data']['seconds'];

                        item['until'] = `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} and ${seconds} ${seconds > 1 ? 'seconds' : 'second'}`;

                        return item;
                    });

                const emailsArray = [];
                const wss = getSocketServer();

                events.forEach(event => {
                    const payload = {
                        ACTION_TYPE: 'UPCOMING_EVENT',
                        title: event['title'],
                        until: event['until']
                    };

                    //wss.setToParticularUser(event['userId']['_id'], payload);
                    emailsArray.push(sendNotificationMessage(
                        event['userId']['local']['username'],
                        event['userId']['local']['email'],
                        event['eventId'],
                        event['title'],
                        event['until']
                        )
                    );
                });

                Promise.all(emailsArray)
                    .then(function (result) {
                        resolve({message: 'Ended', total: result.length});
                    })
                    .catch(function (error) {
                        reject({message: 'Error: ' + error.message});
                    })
            })
            .catch(function (error) {
                reject({message: 'Error: ' + error.message});
            });
    });
};

process.on('message', function (message) {
    initMongooseSession.connect();

    if (message === 'startJob') {
        startNotificationJob()
            .then(function (response) {
                process.send(response)
            })
            .catch(function (error) {
                process.send(error);
            })
    }
});
