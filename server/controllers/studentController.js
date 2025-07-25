const { Student, Class } = require("../models");
const { Op } = require("sequelize");
const { createAuditLog, buildStudentLog } = require("../helper/auditLog");
const fs = require("fs");
const path = require("path");

// List Students with search, filter, pagination
const listStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      classId,
      gender,
      city,
      state,
    } = req.query;
    const where = { status: 1 };

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { mobile: { [Op.like]: `%${search}%` } },
      ];
    }
    if (classId) where.class = classId;
    if (gender) where.gender = gender;
    if (city) where.city = city;
    if (state) where.state = state;

    const students = await Student.findAndCountAll({
      where,
      include: [{ model: Class, as: "classInfo", attributes: ["name"] }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      data: students.rows,
      total: students.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(students.count / limit),
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to list students", details: err.message });
  }
};

// Add Student
const addStudent = async (req, res) => {
  try {
    const { name, class: classId, gender, mobile, state, city } = req.body;
    const profile = req.file?.filename || null;

    const student = await Student.create({
      name,
      class: classId,
      gender,
      mobile,
      state,
      city,
      profile,
      status: 1,
    });

    const cls = await Class.findByPk(classId, { attributes: ["name"] });

    const logMessage = buildStudentLog(
      student.name,
      cls?.name || classId,
      "created"
    );

    await createAuditLog(req.user?.id || 0, "Student", logMessage);

    return res.status(201).json(student);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to add student", details: err.message });
  }
};

// Edit Student
const editStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.findByPk(id, {
      include: [{ model: Class, as: "classInfo", attributes: ["name"] }],
    });
    if (!student) return res.status(404).json({ error: "Student not found" });

    const { name, class: classId, gender, mobile, state, city } = req.body;
    const newProfile = req.file?.filename;

    const oldImagePath = student.profile
      ? path.join(__dirname, "..", "uploads/student", student.profile)
      : null;
    if (newProfile && oldImagePath && fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }

    // Update student data
    await student.update({
      name,
      class: classId,
      gender,
      mobile,
      state,
      city,
      profile: newProfile || student.profile,
    });

    const logMessage = buildStudentLog(
      student.name,
      student.classInfo?.name || classId,
      "updated"
    );

    await createAuditLog(req.user?.id || 0, "Student", logMessage);

    return res.json(student);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to edit student", details: err.message });
  }
};

// View Student
const viewStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.findByPk(id, {
      include: [{ model: Class, as: "classInfo", attributes: ["name"] }],
    });
    if (!student) return res.status(404).json({ error: "Student not found" });

    return res.json(student);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to view student", details: err.message });
  }
};

// Delete Student
const deleteStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.findByPk(id, {
      include: [{ model: Class, as: "classInfo", attributes: ["name"] }],
    });
    if (!student) return res.status(404).json({ error: "Student not found" });

    await student.update({ status: 0 });
    
    const oldImagePath = student.profile
      ? path.join(__dirname, "..", "uploads/student", student.profile)
      : null;

    if (oldImagePath && fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }

    const logMessage = buildStudentLog(
      student.name,
      student.classInfo?.name || student.class,
      "deleted"
    );

    await createAuditLog(req.user?.id || 0, "Student", logMessage);

    return res.json({ message: "Student deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to delete student", details: err.message });
  }
};

module.exports = {
  listStudents,
  addStudent,
  editStudent,
  viewStudent,
  deleteStudent,
};
