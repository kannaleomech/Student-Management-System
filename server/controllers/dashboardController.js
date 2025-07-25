const { Student, Class } = require("../models");
const { Sequelize } = require("sequelize");

const getDashboardStats = async (req, res) => {
  try {
    // Total Students
    const totalStudents = await Student.count({ where: { status: 1 } });

    // Students Per Class (include class even if no students)
    const studentsPerClass = await Class.findAll({
      attributes: [
        ["name", "className"],
        [Sequelize.fn("COUNT", Sequelize.col("students.id")), "count"],
      ],
      include: [
        {
          model: Student,
          where: { status: 1 },
          as: "students",
          attributes: [],
          required: false,
        },
      ],
      group: ["Class.id"],
      raw: true,
    });

    // Gender Ratio
    const genderData = await Student.findAll({
      where: { status: 1 },
      attributes: [
        "gender",
        [Sequelize.fn("COUNT", Sequelize.col("gender")), "count"],
      ],
      group: ["gender"],
      raw: true,
    });

    // Initialize default gender structure
    const genderRatio = [
      { gender: "male", count: 0 },
      { gender: "female", count: 0 },
      { gender: "other", count: 0 },
    ];

    // Merge real counts into defaults
    genderData.forEach((g) => {
      const match = genderRatio.find((item) => item.gender === g.gender);
      if (match) match.count = parseInt(g.count);
    });

    return res.json({
      totalStudents,
      studentsPerClass,
      genderRatio,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch dashboard stats", details: err.message });
  }
};

module.exports = {
  getDashboardStats,
};
