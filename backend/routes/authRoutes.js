// This file defines the routes for authentication endpoints.
// It uses Express Router to handle POST requests for user registration and login.
// Routes:
// - POST /register: Calls authController.register
// - POST /login: Calls authController.login
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;