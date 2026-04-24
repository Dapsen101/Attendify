// This file defines the routes for attendance-related endpoints.
// Routes:
// - POST /mark: Allows students to mark attendance (protected for students)
// - GET /reports: Allows lecturers to get attendance reports (protected for lecturers)
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/mark', protect('student'), attendanceController.markAttendance);
router.get('/dashboard', protect('student'), attendanceController.getStudentDashboardData);
router.get('/history', protect('student'), attendanceController.getStudentHistory);
router.get('/my-stats', protect('student'), attendanceController.getStudentCoursesWithStats);
router.get('/reports', protect('lecturer'), attendanceController.getReports);

module.exports = router;
