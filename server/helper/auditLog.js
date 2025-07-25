const { AuditLog } = require("../models"); // Adjust the path as necessary
const createAuditLog = async (userId, module, action, status = 1) => {
  await AuditLog.create({
    userId,
    module,
    action,
    status,
  });
};

const buildStudentLog = (name, section, action) => {
  // action: "created", "updated", "deleted"
  const preposition = action === "deleted" ? "from" : "in";
  return `Student ${name} ${action} ${preposition} ${section}`;
};

module.exports = {
  createAuditLog,
  buildStudentLog
};
