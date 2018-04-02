require('../models/user.schema');
require('../models/event.schema');
const Event = require('mongoose').model('Event');
const initMongooseSession = require('../../config/mongoose');
const moment = require('moment');
const {sendNotificationMessage} = require("../utils/mailer");


/**
 * Pull all upcoming in nearest 15 minutes events from the database and notify users via email and websocket channel
 * @returns {Promise}
 */
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

                        item.until = `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} and ${seconds} ${seconds > 1 ? 'seconds' : 'second'}`;

                        return item;
                    });

                const emailsArray = [];

                events.forEach(event => {
                    const payload = {
                        ACTION_TYPE: 'UPCOMING_EVENT',
                        title: event.title,
                        until: event.until
                    };

                    process.send({message: 'Notify', payload: JSON.stringify(payload), userId: event.userId._id});
                    emailsArray.push(sendNotificationMessage(
                        event.userId.local.username,
                        event.userId.local.email,
                        event.eventId,
                        event.title,
                        event.until
                        )
                    );
                });

                Promise.all(emailsArray)
                    .then(function (result) {
                        resolve({message: 'Ended', payload: result.length});
                    })
                    .catch(function () {
                        reject({message: 'Error'});
                    })
            })
            .catch(function () {
                reject({message: 'Error'});
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
