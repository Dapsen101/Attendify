// This controller handles attendance-related operations.
// - markAttendance: Allows students to mark their attendance using a session token.
// - getReports: Retrieves attendance reports for the lecturer, showing all records.
const Attendance = require('../models/Attendance');
const Session = require('../models/Session');

const Enrollment = require('../models/Enrollment');

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // radius in metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

exports.markAttendance = async (req, res) => {
  try {
    const { token, courseId, lat, lng } = req.body;
    
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Only students can mark attendance' });
    }

    if (!courseId) {
        return res.status(400).json({ message: 'Please select a course to mark attendance for' });
    }

    const session = await Session.findOne({ token, expiresAt: { $gt: new Date() } }).populate('course');
    if (!session) {
        return res.status(400).json({ message: 'Invalid or expired session token' });
    }

    // 🔥 Check if the session is for the SELECTED course
    if (session.course._id.toString() !== courseId) {
        return res.status(400).json({ message: 'This token is not for the selected course' });
    }

    // 📍 GEOFENCING CHECK
    if (session.lat && session.lng) {
        if (!lat || !lng) {
            return res.status(400).json({ message: 'Location data is required to mark attendance' });
        }
        
        const distance = getDistance(session.lat, session.lng, lat, lng);
        if (distance > 100) { // 100 meters limit
            return res.status(403).json({ 
                message: 'You are too far from the lecturer to mark attendance',
                distance: Math.round(distance)
            });
        }
    }

    // 🔥 Check if student is REGISTERED for this course
    const isEnrolled = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (!isEnrolled) {
        return res.status(403).json({ message: 'You are not registered for this course' });
    }

    // Check if attendance already marked
    const existing = await Attendance.findOne({ student: req.user.id, session: session._id });
    if (existing) {
        return res.status(400).json({ message: 'Attendance already marked for this session' });
    }

    await Attendance.create({
        student: req.user.id,
        session: session._id,
        lat,
        lng
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

exports.getStudentCoursesWithStats = async (req, res) => {
    try {
        // 1. Get all enrollments
        const enrollments = await Enrollment.find({ student: req.user.id }).populate('course');
        
        // 2. Get all attendance records for this student
        const attendance = await Attendance.find({ student: req.user.id }).populate('session');

        // 3. Calculate stats per course
        const coursesWithStats = await Promise.all(
            enrollments
                .filter(enroll => enroll.course) // 🔥 Filter out deleted courses
                .map(async (enroll) => {
                    const course = enroll.course;
                    
                    // Total sessions for this course
                    const totalSessions = await Session.countDocuments({ course: course._id });
                    
                    // Sessions attended by this student for this course
                    const attendedSessions = attendance.filter(a => 
                        a.session && 
                        a.session.course && 
                        a.session.course.toString() === course._id.toString()
                    ).length;

                    const percentage = totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 100) : 0;

                    return {
                        id: course._id,
                        code: course.code,
                        title: course.title,
                        totalSessions,
                        attendedSessions,
                        percentage
                    };
                })
        );

        res.json(coursesWithStats);
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
