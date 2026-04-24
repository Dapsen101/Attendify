// This file defines the routes for course-related endpoints.
// These routes are protected and require authentication.
// Routes:
// - POST /: Creates a new course (lecturers only)
// - GET /: Retrieves courses for the logged-in lecturer
const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const courseController = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

// Lecturer routes
router.post('/', protect('lecturer'), courseController.createCourse);
router.get('/', protect('lecturer'), courseController.getCourses);
router.get('/database', protect('lecturer'), courseController.getDatabaseCourses);
router.post('/assign', protect('lecturer'), courseController.assignCourse);

// Student routes
router.get('/available', protect('student'), enrollmentController.getAvailableCourses);
router.post('/enroll', protect('student'), enrollmentController.enroll);
router.get('/my-courses', protect('student'), enrollmentController.getStudentCourses);

module.exports = router;
