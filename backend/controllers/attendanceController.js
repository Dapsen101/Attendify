const Attendance = require('../models/Attendance');
const Session = require('../models/Session');

exports.markAttendance = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Only students can mark attendance' });
    }

    const session = await Session.findOne({ token, expiresAt: { $gt: new Date() } });
    if (!session) {
        return res.status(400).json({ message: 'Invalid or expired session token' });
    }

    // Check if attendance already marked
    const existing = await Attendance.findOne({ student: req.user.id, session: session._id });
    if (existing) {
        return res.status(400).json({ message: 'Attendance already marked for this session' });
    }

    await Attendance.create({
        student: req.user.id,
        session: session._id
    });

    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReports = async (req, res) => {
  try {
    // 1. Get all sessions matching the lecturer
    const sessions = await Session.find({ lecturer: req.user.id }).populate('course');
    const sessionIds = sessions.map(s => s._id);

    // 2. Fetch all attendance matching those sessions
    const records = await Attendance.find({ session: { $in: sessionIds } })
      .populate('student', 'name email matric department')
      .populate({
        path: 'session',
        populate: { path: 'course' }
      })
      .sort({ markTime: -1 });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
