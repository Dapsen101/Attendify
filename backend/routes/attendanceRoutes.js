const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/mark', protect('student'), attendanceController.markAttendance);
router.get('/reports', protect('lecturer'), attendanceController.getReports);

module.exports = router;
