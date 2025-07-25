const express = require('express');
const Route = express.Router();
const commonController = require('../../controllers/commonController');

Route.get("/roles", commonController.getRoles);
Route.get("/classes", commonController.getClasses);

module.exports = Route;
