const Session = require('../models/Session');
const Course = require('../models/Course'); // for verification if needed

exports.createSession = async (req, res) => {
  try {
    const { course } = req.body;
    
    // Generate a secure numerical token
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Default expiration: 10 mins from now
    const expiresAt = new Date(Date.now() + 10 * 60000);

    const session = await Session.create({
      lecturer: req.user.id,
      course,
      token,
      expiresAt
    });

    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getActiveSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ lecturer: req.user.id, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 }).populate('course');
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.endSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, lecturer: req.user.id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.expiresAt = new Date();
    await session.save();
    res.json({ message: 'Session ended successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLecturerStats = async (req, res) => {
  try {
    const sessions = await Session.find({ lecturer: req.user.id });
    const sessionIds = sessions.map(s => s._id);
    const Attendance = require('../models/Attendance');
    const uniqueStudents = await Attendance.distinct('student', { session: { $in: sessionIds } });
    
    res.json({ totalStudents: uniqueStudents.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
