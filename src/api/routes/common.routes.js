const express = require('express');
const {
    getActivityData
} = require("../controllers/event.controller");

const router = express.Router();
const {authenticate} = require("../middleware/auth.middleware");

router.route('/activity')
    .get(authenticate, getActivityData);

module.exports = router;
