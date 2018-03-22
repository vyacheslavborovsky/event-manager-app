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
const {authenticate} = require("../middleware/auth.middleware");

router.route('/')
    .get(authenticate, getEvents)
    .patch(authenticate, createEvent)
    .delete(authenticate, deleteMultipleEvents);

router.route('/:eventId')
    .get(authenticate, getEventById)
    .post(authenticate, updateEvent)
    .delete(authenticate, deleteEvent);

module.exports = router;
