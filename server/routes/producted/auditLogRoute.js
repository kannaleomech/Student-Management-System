const express = require("express");
const router = express.Router();
const auditLogController= require("../../controllers/auditLogController");

router.get("/query", auditLogController.listAuditLogs);

module.exports = router;
