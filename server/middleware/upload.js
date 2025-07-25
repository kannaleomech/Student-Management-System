const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ---------- Disk storage (student images) ----------
const uploadDir = path.join(__dirname, '..', 'uploads', 'student');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const uploadStudentImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ---------- Memory storage (Excel bulk upload) ----------
const excelFileFilter = (req, file, cb) => {
  const allowed =
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.mimetype === 'application/vnd.ms-excel';
  if (!allowed) return cb(new Error('Only Excel files are allowed'), false);
  cb(null, true);
};

const uploadExcel = multer({
  storage: multer.memoryStorage(),
  fileFilter: excelFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = {
  uploadStudentImage,
  uploadExcel,
};
