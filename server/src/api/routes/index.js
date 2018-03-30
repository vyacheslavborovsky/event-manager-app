const express = require('express');
const authRoutes = require('./auth.routes');
const eventRoutes = require('./event.routes');
const commonRoutes = require('./common.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/common', commonRoutes);

module.exports = router;
