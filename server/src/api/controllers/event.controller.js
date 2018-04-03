/**
 * @namespace APIEventsRoutesHandlers
 */
require('../models/event.schema');
const Event = require('mongoose').model('Event');
const httpStatus = require('http-status');
const url = require('url');


/**
 * Returns all events associated with a current user
 *
 * @function getEvents
 * @param {string} url - GET /api/v1/events
 * @memberOf APIEventsRoutesHandlers
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 *
 * @param {object} req.query
 * @param {string} [req.query.sort=startDate]
 *
 * @param {number} res.status
 * @param {string} res.message
 * @param {Array<object>} res.events
 */
function getEvents(req, res) {
    const urlParams = url.parse(req.url, true).query;
    const sortParam = urlParams['sort'] || 'startDate';

    if (req.auth.id) {
        const findQuery = Event
            .find({userId: req.auth.id})
            .sort(sortParam)
            .exec();

        findQuery
            .then(function (events) {
                res.status(200);
                return !events || events.length < 1 ? res.json({events: []}) : res.json({events: events});
            })
            .catch(function (error) {
                res.status(500);
                return res.json({message: "Error fetching events."})
            })
    } else {
        res.status(httpStatus.UNAUTHORIZED);
        return res.json({message: 'No user found to get appropriate events.'});
    }
}

/**
 * Create a new user's event
 *
 * @function createEvent
 * @param {string} url - PATCH /api/v1/events
 * @memberOf APIEventsRoutesHandlers
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 *
 * @param {object} res.body
 * @param {string} res.body.title - Short title of the event
 * @param {string} res.body.description - Core explanation of the event
 * @param {object} res.body.startDate - Start timestamp of the event
 * @param {object} res.body.endDate - End timestamp of the event
 * @param {boolean} res.body.allDayEvent - Flag to mark all day event
 * @param {object} res.body.location - Optional location for the event
 *
 * @param {number} res.status
 * @param {string} res.message
 * @param {object} res.event - Created Event
 */
function createEvent(req, res) {
    if (req.body.startDate === undefined || req.body.endDate === undefined) {
        res.status(httpStatus.BAD_REQUEST);
        return res.json({message: "Invalid request payload", success: false});
    }

    const newEvent = new Event({
        title: req.body.title,
        description: req.body.description,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        allDayEvent: req.body.allDayEvent ? req.body.allDayEvent : false,
        location: req.body.location ? req.body.location : null,
        userId: req.auth.id
    });

    const saved = newEvent.save();

    saved
        .then(function (event) {
            res.status(httpStatus.CREATED);
            return res.json({message: "Event has been created successfully.", event: event});
        })
        .catch(function (error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR);
            return res.json({message: "Error occurred during creating event."})
        })
}

/**
 * Update outdated info of the event
 *
 * @function updateEvent
 * @param {string} url - POST /api/v1/events/:eventId
 * @memberOf APIEventsRoutesHandlers
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 *
 * @param {object} res.body
 * @param {string} res.body.title - Short title of the event
 * @param {string} res.body.description - Core explanation of the event
 * @param {object} res.body.startDate - Start timestamp of the event
 * @param {object} res.body.endDate - End timestamp of the event
 * @param {boolean} res.body.allDayEvent - Flag to mark all day event
 * @param {object} res.body.location - Optional location for the event
 *
 * @param {number} res.status
 * @param {string} res.message
 * @param {object} res.event - Updated Event
 */
function updateEvent(req, res) {
    const eventId = req.params.eventId;

    if (eventId) {
        const updateBody = {};

        for (let key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                if (key.indexOf('Date') !== -1) {
                    updateBody[key] = new Date(req.body[key])
                } else {
                    updateBody[key] = req.body[key]
                }
            }
        }

        const options = {upsert: false, 'new': true};
        const updated = Event.findOneAndUpdate({eventId: eventId}, {$set: updateBody}, options).exec();

        updated
            .then(function (event) {
                res.status(httpStatus.OK);
                return res.json({message: "Event has been updated successfully", event: event});
            })
            .catch(function (error) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR);
                return res.json({message: "Error during updating event."})
            })
    } else {
        res.status(httpStatus.BAD_REQUEST);
        return res.json({message: 'No eventId passed to the server'});
    }
}

/**
 * Delete event
 * @function deleteEvent
 * @param {string} url - DELETE /api/v1/events/:eventId
 * @memberOf APIEventsRoutesHandlers
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 *
 * @param {object} req.params
 * @param {string} req.params.eventId
 *
 * @param {number} res.status
 * @param {string} res.message
 * @param {object} res.event - Deleted Event
 */
function deleteEvent(req, res) {
    const eventId = req.params.eventId;

    if (eventId && req.auth.id) {
        const found = Event.findOne({
            eventId: eventId,
            userId: req.auth.id
        })
            .exec();

        found
            .then(function (event) {
                if (!event) {
                    res.status(httpStatus.NOT_FOUND);
                    return res.json({message: 'Event not found for deleting.'})
                }

                const removed = event.remove();

                removed
                    .then(function (item) {
                        res.status(httpStatus.OK);
                        return res.json({message: "Event deleted successfully.", event: event});
                    })
                    .catch(function (error) {
                        res.status(httpStatus.INTERNAL_SERVER_ERROR);
                        return res.json({message: "Error occurred on the server."})
                    })
            })
            .catch(function (error) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR);
                return res.json({message: "Error occurred on the server."})
            })
    } else {
        res.status(httpStatus.BAD_REQUEST);
        return res.json({message: 'No user found to delete event.'})
    }
}

/**
 * Fetch user's event
 *
 * @function getEventById
 * @param {string} url - GET /api/v1/events/:eventId
 * @memberOf APIEventsRoutesHandlers
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 *
 * @param {object} req.params
 * @param {string} req.params.eventId
 *
 * @param {number} res.status
 * @param {string} res.message
 * @param {object} res.event - Pulled Event
 */
function getEventById(req, res) {
    const eventId = req.params.eventId;

    if (eventId) {
        const found = Event.findOne({
            eventId: eventId,
            userId: req.auth.id
        })
            .exec();

        found
            .then(function (event) {
                if (!event) {
                    res.status(httpStatus.NOT_FOUND);
                    return res.json({message: 'Your event not found.'})
                }

                res.status(httpStatus.OK);
                return res.json({event: event});
            })
            .catch(function (error) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR);
                return res.json({message: "Error occurred on the server."})
            })
    } else {
        res.status(httpStatus.BAD_REQUEST);
        return res.json({message: "No user found to get appropriate event."})
    }
}


/**
 * Delete one or more events at once
 *
 * @function deleteMultipleEvents
 * @param {string} url - DELETE /api/v1/events
 * @memberOf APIEventsRoutesHandlers
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 *
 * @param {object} res.body
 * @param {Array<string>} res.body.eventIds - ids of events for delete them from the database
 *
 * @param {number} res.status
 * @param {string} res.message
 * @param {boolean} res.success
 */
function deleteMultipleEvents(req, res) {
    const eventIds = req.body.eventIds;

    if (eventIds && req.auth.id && eventIds instanceof Array && eventIds.length > 0) {
        const removed = Event.remove({
            eventId: {$in: eventIds},
            userId: req.auth.id
        });

        removed
            .then(function (event) {
                res.status(httpStatus.OK);
                return res.json({message: "Events has been deleted successfully."});
            })
            .catch(function (error) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR);
                return res.json({message: "Error occurred during deleting events."})
            })
    } else {
        res.status(httpStatus.BAD_REQUEST);
        return res.json({message: "Invalid request payload.", success: false});
    }
}

/**
 * Get all users current activity status
 *
 * @function getActivityData
 * @param {string} url - GET /api/v1/common/activity
 * @memberOf APIEventsRoutesHandlers
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object
 *
 * @param {object} res.body
 * @param {Array<string>} res.body.eventIds - ids of events for delete them from the database
 *
 * @param {number} res.status
 * @param {string} res.message
 * @param {Array<object>} res.data - array of numbers of events grouped by users and range types
 * @param {string} res.data[0].username - username of current user activity
 * @param {number} res.data[0].upcoming - number of upcoming events
 * @param {number} res.data[0].inProgress - number of events in progress status
 * @param {number} res.data[0].completed - number of already completed events
 */
function getActivityData(req, res) {
    Event.getUsersActivityData()
        .then(function (response) {
            res.status(httpStatus.OK);
            return res.json({data: response});
        })
        .catch(function (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR);
            return res.json({message: 'Server error occurred during fetching users activities.'});
        })
}

/**
 * GET events using lazy loading (not implemented yet)
 *
 * @function loadEventsDynamic
 *
 * @param {object} req - express self-generated http request object
 * @param {object} res - express self-generated http response object

 * @param {object} req.query
 * @param {number} req.query.page_size - print events per one page
 * @param {number} req.query.page_number - current page number
 * @param {string} req.query.sort - sort field
 * @param {string} req.query.type - type of events [upcoming, inProgress, completed]

 *
 * @param {number} res.status
 * @param {string} res.message
 * @param {object} res.events
 * @param {string} res.nextUrl
 */
function loadEventsDynamic(req, res) {
    const urlParams = url.parse(req.url, true).query;

    const pageSize = urlParams['page_size'] || '15';
    const pageNumber = urlParams['page_number'] || '0';
    const sortBy = urlParams['sort'] || 'startDate';
    const type = urlParams['type'] || 'upcoming';

    if (req.auth.id) {
        switch (type) {
            case 'upcoming': {
                Event
                    .find({userId: req.auth.id})
                    .where('startDate').gt(new Date()).eq(new Date())
                    .sort(sortBy)
                    .limit(Number.parseInt(pageSize))
                    .skip(Number.parseInt(pageNumber) * Number.parseInt(pageSize))
                    .exec(function (err, events) {
                        if (err) {
                            res.status(500);
                            return res.json({message: "Error fetching events."})
                        }

                        res.status(200);
                        const nextUrl = `/events/manage?page_size=15&page_number=${Number.parseInt(pageNumber) + 1}`;
                        return !events || events.length < 1 ? res.json({events: []}) : res.json({
                            events: events,
                            nextUrl: nextUrl
                        });
                    })
            }
                break;
            case 'completed': {
                Event
                    .find({userId: req.auth.id})
                    .where('endDate').lt(new Date())
                    .sort(sortBy)
                    .limit(Number.parseInt(pageSize))
                    .skip(Number.parseInt(pageNumber) * Number.parseInt(pageSize))
                    .exec(function (err, events) {
                        if (err) {
                            res.status(500);
                            return res.json({message: "Error fetching events."})
                        }

                        res.status(200);
                        const nextUrl = `/events/manage?page_size=15&page_number=${Number.parseInt(pageNumber) + 1}`;
                        return !events || events.length < 1 ? res.json({events: []}) : res.json({
                            events: events,
                            nextUrl: nextUrl
                        });
                    })
            }
                break;
            default: {
                res.status(httpStatus.BAD_REQUEST);
                return res.json({message: 'Invalid events type passed to the server'});
            }
        }
    } else {
        res.status(httpStatus.UNAUTHORIZED);
        return res.json({message: 'No user found to get appropriate events.'});
    }
}


exports.getEvents = getEvents;
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
exports.getEventById = getEventById;
exports.deleteMultipleEvents = deleteMultipleEvents;
exports.getActivityData = getActivityData;
exports.loadEventsDynamic = loadEventsDynamic;
