const express = require('express');
const Route = express.Router();
const authController = require('../../controllers/authController');

Route.post("/login", authController.login);
Route.post("/register", authController.register);

module.exports = Route;
