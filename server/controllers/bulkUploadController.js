const XLSX = require("xlsx");
const { sequelize, Student, Class } = require("../models");
const { createAuditLog } = require("../helper/auditLog");

const VALID_GENDERS = ["male", "female", "other"];

const normalizeHeader = (h) =>
  String(h || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

const bulkUploadStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Excel file is required" });
    }

    // Read Excel
    const wb = XLSX.read(req.file.buffer, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rowsRaw = XLSX.utils.sheet_to_json(ws, { defval: "" });

    if (!rowsRaw.length) {
      return res.status(400).json({ error: "Sheet is empty" });
    }

    // Normalize headers
    const rows = rowsRaw.map((r) => {
      const out = {};
      Object.keys(r).forEach((k) => (out[normalizeHeader(k)] = r[k]));
      return out;
    });

    // Load classes
    const classes = await Class.findAll({ attributes: ["id", "name"] });

    const rowSet = new Set(); // For checking full row duplicates
    const validRows = [];
    const errors = [];

    rows.forEach((row, i) => {
      const rowNum = i + 2; // Considering header at row 1
      const name = String(row.name || row.studentname || "").trim();
      const gender = String(row.gender || "")
        .trim()
        .toLowerCase();
      const mobile = String(row.mobile || "").trim();
      const state = String(row.state || "").trim();
      const city = String(row.city || "").trim();
      const classRow = String(row.class || "").trim();

      const rowErrors = [];

      // Validate empty fields
      if (!name) rowErrors.push("name is required");
      if (!mobile) rowErrors.push("mobile is required");
      if (!gender) rowErrors.push("gender is required");
      if (!state) rowErrors.push("state is required");
      if (!city) rowErrors.push("city is required");
      if (gender && !VALID_GENDERS.includes(gender))
        rowErrors.push(`gender must be one of: ${VALID_GENDERS.join(", ")}`);

      // Validate class
      let classObj = null;
      const normalize = (str) =>
        String(str || "")
          .toLowerCase()
          .replace(/\s+/g, "");

      if (classRow) {
        classObj = classes.find(
          (c) => normalize(c.name) === normalize(classRow)
        );
        if (!classObj) rowErrors.push(`class ${classRow} not found`);
      } else {
        rowErrors.push("class is required");
      }

      // Check for duplicate row
      const rowKey = `${name}-${mobile}-${gender}-${state}-${city}-${
        classObj?.id || classRow
      }`;
      if (rowSet.has(rowKey)) {
        rowErrors.push("Duplicate row in Excel file");
      } else {
        rowSet.add(rowKey);
      }

      if (rowErrors.length) {
        errors.push({ row: rowNum, errors: rowErrors });
      } else {
        validRows.push({
          name,
          class: classObj?.id,
          gender,
          mobile,
          state,
          city,
          profile: null,
          status: 1,
        });
      }
    });

    if (!validRows.length) {
      return res.status(400).json({
        error: "No valid rows to insert",
        failed: errors.length,
        errors,
      });
    }

    // Insert valid rows
    const t = await sequelize.transaction();
    try {
      const created = await Student.bulkCreate(validRows, { transaction: t });
      await createAuditLog(
        req.user?.id || 0,
        "Student",
        `Bulk uploaded ${created.length} students`,
        1
      );
      await t.commit();

      return res.json({
        inserted: created.length,
        failed: errors.length,
        errors,
      });
    } catch (e) {
      await t.rollback();
      return res
        .status(500)
        .json({ error: "Failed to insert students", details: e.message });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to process file", details: err.message });
  }
};

module.exports = { bulkUploadStudents };
