const express = require('express');
const router = express.Router();

const studentRoutes = require('./studentRoute');
const dashboardRoutes = require('./dashboardRoute');
const auditLogRoutes = require('./auditLogRoute');

router.use('/students', studentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/audit-logs', auditLogRoutes);

module.exports = router;
