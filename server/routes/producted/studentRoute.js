const express = require('express');
const Route = express.Router();
const studentController = require('../../controllers/studentController');
const bulkUploadController = require('../../controllers/bulkUploadController');
const { uploadStudentImage, uploadExcel } = require('../../middleware/upload');

Route.get("/query", studentController.listStudents);
Route.post('/add', uploadStudentImage.single('profile'), studentController.addStudent);
Route.put('/update/:id', uploadStudentImage.single('profileNew'), studentController.editStudent);
Route.get('/view/:id', studentController.viewStudent);
Route.patch('/delete/:id', studentController.deleteStudent);
Route.post('/bulk-upload', uploadExcel.single('file'), bulkUploadController.bulkUploadStudents);


module.exports = Route;
