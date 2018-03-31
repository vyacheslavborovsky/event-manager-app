const httpStatus = require('http-status');
const url = require('url');

require('../models/event.schema');
const Event = require('mongoose').model('Event');


exports.getEvents = function (req, res) {
    const urlParams = url.parse(req.url, true).query;
    const sortParam = urlParams['sort'] || 'startDate';
    if (req.auth.id) {
        Event
            .find({userId: req.auth.id})
            .sort(sortParam)
            .exec(function (err, events) {
                if (err) {
                    res.status(500);
                    return res.json({message: "Error fetching events."})
                }

                res.status(200);
                return !events || events.length < 1 ? res.json({events: []}) : res.json({events: events});
            })
    } else {
        res.status(httpStatus.UNAUTHORIZED);
        return res.json({message: 'No user found to get appropriate events.'});
    }
};

exports.createEvent = function (req, res) {
    if (req.body['startDate'] === undefined || req.body['endDate'] === undefined) {
        res.status(httpStatus.BAD_REQUEST);
        return res.json({message: "Invalid request payload", success: false});
    }

    const newEvent = new Event({
        title: req.body['title'],
        description: req.body['description'],
        startDate: new Date(req.body['startDate']),
        endDate: new Date(req.body['endDate']),
        allDayEvent: req.body['allDayEvent'] ? req.body['allDayEvent'] : false,
        location: req.body['location'] ? req.body['location'] : null,
        userId: req.auth.id
    });

    newEvent.save(function (err, event) {
        if (err) {
            console.log('Create Error ', err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR);
            return res.json({message: "Error occurred during creating event."})
        }

        res.status(httpStatus.CREATED);
        return res.json({message: "Event has been created successfully.", event: event});
    });
};

exports.updateEvent = function (req, res) {
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

        Event.findOneAndUpdate({eventId: eventId}, {$set: updateBody}, options, function (err, event) {
            if (err) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR);
                return res.json({message: "Error during updating event."})
            }

            res.status(httpStatus.OK);
            return res.json({message: "Event has been updated successfully", event: event});
        })
    } else {
        res.status(httpStatus.BAD_REQUEST);
        return res.json({message: 'No eventId passed to the server'});
    }
};

exports.deleteEvent = function (req, res) {
    const eventId = req.params.eventId;

    if (eventId && req.auth.id) {
        Event.findOne({
            eventId: eventId,
            userId: req.auth.id
        }, function (err, event) {
            if (err) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR);
                return res.json({message: "Error occurred on the server."})
            }

            if (!event) {
                res.status(httpStatus.NOT_FOUND);
                return res.json({message: 'Event not found for deleting.'})
            }

            event.remove(function (err, item) {
                if (err) {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR);
                    return res.json({message: "Error occurred on the server."})
                }

                res.status(httpStatus.OK);
                return res.json({message: "Event deleted successfully.", event: event});
            })
        })
    } else {
        res.status(httpStatus.BAD_REQUEST);
        return res.json({message: 'No user found to delete event.'})
    }
};

exports.getEventById = function (req, res) {
    const eventId = req.params.eventId;

    if (eventId) {
        Event.findOne({
            eventId: eventId,
            userId: req.auth.id
        }, function (err, event) {
            if (err) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR);
                return res.json({message: "Error occurred on the server."})
            }

            if (!event) {
                res.status(httpStatus.NOT_FOUND);
                return res.json({message: 'Your event not found.'})
            }

            res.status(httpStatus.OK);
            return res.json({event: event});
        })
    } else {
        res.status(httpStatus.BAD_REQUEST);
        return res.json({message: "No user found to get appropriate event."})
    }
};

exports.deleteMultipleEvents = function (req, res) {
    const eventIds = req.body['eventIds'];

    if (eventIds && req.auth.id && eventIds instanceof Array && eventIds.length > 0) {
        Event.remove({
            eventId: {$in: eventIds},
            userId: req.auth.id
        }, function (err) {
            if (err) {
                console.log('Delete Multiple Error ', err);
                res.status(httpStatus.INTERNAL_SERVER_ERROR);
                return res.json({message: "Error occurred during deleting events."})
            }

            res.status(httpStatus.OK);
            return res.json({message: "Events has been deleted successfully."});
        })
    } else {
        res.status(httpStatus.BAD_REQUEST);
        return res.json({message: "Invalid request payload.", success: false});
    }
};


exports.getActivityData = function (req, res) {
    try {
        Event.getUsersActivityData()
            .then(function (response) {
                res.status(httpStatus.OK);
                return res.json({data: response});
            })
            .catch(function (err) {
                console.log('Error ', err);
                res.status(httpStatus.INTERNAL_SERVER_ERROR);
                return res.json({message: 'Server error occurred during fetching users activities.'});
            })
    } catch (err) {
        console.log("Error: ", err);
    }
};

exports.loadEventsDynamic = function (req, res) {
    const urlParams = url.parse(req.url, true).query;

    const pageSize = urlParams['page_size'] || '3';
    const pageNumber = urlParams['page_number'] || '0';
    const sortBy = urlParams['sort'] || 'startDate';
    const type = urlParams['type'] || 'upcoming';

    if (req.auth.id) {
        switch (type) {
            case 'upcoming': {
                Event
                    .find({userId: Number.parseInt(urlParams['userId'], 10)})
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
                    .find({userId: Number.parseInt(urlParams['userId'], 10)})
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
};
