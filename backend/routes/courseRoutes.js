// This file defines the routes for course-related endpoints.
// These routes are protected and require authentication.
// Routes:
// - POST /: Creates a new course (lecturers only)
// - GET /: Retrieves courses for the logged-in lecturer
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect(), courseController.createCourse);
router.get('/', protect(), courseController.getCourses);

module.exports = router;
