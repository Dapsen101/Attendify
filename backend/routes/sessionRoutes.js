// This file defines the routes for session-related endpoints.
// These routes are protected and restricted to lecturers.
// Routes:
// - POST /create: Creates a new attendance session
// - GET /active: Gets active sessions for the lecturer
// - GET /stats: Gets statistics for the lecturer
// - POST /:id/end: Ends a specific session
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect('lecturer'), sessionController.createSession);
router.get('/active', protect('lecturer'), sessionController.getActiveSessions);
router.get('/stats', protect('lecturer'), sessionController.getLecturerStats);
router.post('/:id/end', protect('lecturer'), sessionController.endSession);

module.exports = router;
