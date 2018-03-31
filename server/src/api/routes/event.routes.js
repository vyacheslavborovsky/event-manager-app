const express = require('express');
const {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    deleteMultipleEvents
} = require("../controllers/event.controller");

const router = express.Router();

router.route('/')
    .get(getEvents)
    .patch(createEvent)
    .delete(deleteMultipleEvents);

router.route('/:eventId')
    .get(getEventById)
    .post(updateEvent)
    .delete(deleteEvent);

module.exports = router;
