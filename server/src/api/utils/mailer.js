/**
 * @namespace MailUtils
 */

const config = require('../../config/variable');
const mailer = require('nodemailer');
const winston = require('winston');

let transporter = mailer.createTransport(config.mailerProvider);

/**
 * Send welcome message when user has been registered successfully
 *
 * @function sendWelcomeMessage
 * @memberOf MailUtils
 *
 * @param {string} username - registered username
 * @param {string} toEmail - user email address
 */
function sendWelcomeMessage(username, toEmail) {
    let mailOptions = {
        from: 'vyacheslav.borovsky@gmail.com',
        to: toEmail,
        subject: 'Welcome to event manager app',
        text: `Dear ${username}! Welcome to our event manager app. We are glad to have you on a board. 
                Feel free to write us if you have any questions about the platform and happy working with your awesome events.
                `,
        html: `<p>Dear <b style="font-size: larger; color: brown; font-family: 'Copperplate Gothic Light',sans-serif">${username}</b>!</p> 
                <p>Welcome to our event manager app. We are glad to have you on a board.</p>
                <p>Feel free to contact us if you have any questions about the platform and happy working with your awesome events.<p/>
                <p>Best regards,</p>
                <p>Event Manager App support.</p>
                `
    };

    return sendEmail(mailOptions);
}

/**
 * Send email to user about his upcoming event
 *
 * @function sendNotificationMessage
 * @memberOf MailUtils
 *
 * @param {string} username
 * @param {string} toEmail
 * @param {string} eventId
 * @param {string} title
 * @param {string} until
 *
 * @return {Promise}
 */
function sendNotificationMessage(username, toEmail, eventId, title, until) {
    let mailOptions = {
        from: 'vyacheslav.borovsky@gmail.com',
        to: toEmail,
        subject: `${title} upcoming`,
        text: `Dear ${username}! 
            Just want to notify you that your event - ${title} should be start in ${until}.
            Best regards.
            Event manager app support.
        `,
        html: `<p>Dear <b style="font-size: larger; color: brown; font-family: 'Copperplate Gothic Light',sans-serif">${username}</b>!</p> 
                <p>Just want to notify you that your event - <a href=${`${config.appUrl}/#/events/${eventId}`} target="_blank">${title}</a> should be start in <b>${until}</b>.</p>
                </br>
                </br>
                <p>Best regards.</p>
                <p>Event manager app support.</p>
            `
    };

    return sendEmail(mailOptions)
}

/**
 * Util function to send email
 *
 * @function sendEmail
 * @memberOf MailUtils
 *
 * @param {object} mailOptions
 * @param {string} mailOptions.from
 * @param {string} mailOptions.to
 * @param {string} mailOptions.subject
 * @param {string} mailOptions.text
 * @param {string} mailOptions.html
 *
 * @return {Promise}
 */
function sendEmail(mailOptions) {
    return new Promise(function (resolve, reject) {
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                reject({data: error});
            } else {
                resolve();
            }
        });
    })
}

exports.sendWelcomeMessage = sendWelcomeMessage;
exports.sendNotificationMessage = sendNotificationMessage;
