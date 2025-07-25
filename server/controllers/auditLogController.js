const { AuditLog, User } = require("../models");
const { Op } = require("sequelize");

// Get Audit Logs with Pagination & Search
const listAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, userId } = req.query;
    const offset = (page - 1) * limit;

    // Build search condition
    const whereCondition = { status: 1 }; 
    
    if (userId) {
      whereCondition.userId = userId; 
    }

    if (search) {
      whereCondition[Op.or] = [
        { module: { [Op.like]: `%${search}%` } },
        { action: { [Op.like]: `%${search}%` } },
      ];
    }

    // Fetch logs
    const { rows, count } = await AuditLog.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"], // Add required fields
        },
      ],
      order: [["createdAt", "DESC"]],
      offset,
      limit,
    });

    return res.json({
      data: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch audit logs",
      details: error.message,
    });
  }
};

module.exports = { listAuditLogs };
