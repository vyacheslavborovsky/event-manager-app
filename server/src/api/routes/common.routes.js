/**
 * @namespace API Common Routes
 * @type {createApplication|*}
 */

const express = require('express');
const {getActivityData} = require("../controllers/event.controller");

const router = express.Router();

router.route('/activity')
    .get(getActivityData);

module.exports = router;
