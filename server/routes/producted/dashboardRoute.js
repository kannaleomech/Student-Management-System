const express = require('express');
const Route = express.Router();
const dashboardController = require('../../controllers/dashboardController');

Route.get("/", dashboardController.getDashboardStats);

module.exports = Route;
