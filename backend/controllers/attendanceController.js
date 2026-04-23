// This controller handles attendance-related operations.
// - markAttendance: Allows students to mark their attendance using a session token.
// - getReports: Retrieves attendance reports for the lecturer, showing all records.
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

exports.getStudentDashboardData = async (req, res) => {
    try {
        // 1. Get student attendance records
        const attendanceRecords = await Attendance.find({ student: req.user.id }).populate('session');
        const attendedSessionIds = attendanceRecords.map(r => r.session?._id);
        
        // 2. Identify relevant courses (any course the student has attended at least once)
        const courseNames = [...new Set(attendanceRecords.filter(r => r.session && r.session.course).map(r => r.session.course))];
        
        // 3. Count total sessions for these courses
        const totalSessionsCount = await Session.countDocuments({ course: { $in: courseNames } });
        const attendedCount = attendanceRecords.length;
        
        const attendanceRate = totalSessionsCount > 0 
            ? Math.round((attendedCount / totalSessionsCount) * 100) 
            : 0;

        // 4. Find upcoming/active sessions (not attended yet and not expired)
        const upcomingSessions = await Session.find({
            _id: { $nin: attendedSessionIds },
            expiresAt: { $gt: new Date() }
        });

        res.json({
            attendanceRate,
            attendedCount,
            totalSessionsCount,
            upcomingSessions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentHistory = async (req, res) => {
    try {
        // 1. Get all attendance records for this student
        const attendance = await Attendance.find({ student: req.user.id })
            .populate({
                path: 'session',
                populate: { path: 'course' }
            });
        
        const attendedSessionIds = attendance.filter(a => a.session).map(a => a.session._id.toString());
        const courseNames = [...new Set(attendance.filter(a => a.session?.course).map(a => a.session.course))];

        // 2. Get all sessions for these courses that are EXPIRED (so we can count them as missed if not attended)
        // Active sessions aren't "missed" yet, they are "upcoming/joinable"
        const sessions = await Session.find({ 
            course: { $in: courseNames },
            expiresAt: { $lt: new Date() } 
        }).sort({ createdAt: -1 });

        const history = sessions.map(session => {
            const wasPresent = attendedSessionIds.includes(session._id.toString());
            return {
                session,
                status: wasPresent ? 'Present' : 'Missed',
                markTime: wasPresent ? attendance.find(a => a.session && a.session._id.toString() === session._id.toString())?.markTime : null
            };
        });

        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
