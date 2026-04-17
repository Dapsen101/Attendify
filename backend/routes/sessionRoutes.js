const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect('lecturer'), sessionController.createSession);
router.get('/active', protect('lecturer'), sessionController.getActiveSessions);
router.get('/stats', protect('lecturer'), sessionController.getLecturerStats);
router.post('/:id/end', protect('lecturer'), sessionController.endSession);

module.exports = router;
