const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoute');
const commonRoutes = require('./commonRoute');

router.use('/auth', authRoutes);
router.use('/list', commonRoutes);

module.exports = router;
