const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// 📚 GET ALL AVAILABLE COURSES
exports.getAvailableCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('lecturer', 'name');
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 📝 REGISTER FOR A COURSE
exports.enroll = async (req, res) => {
    const { courseId } = req.body;
    try {
        // check if course exists
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // check if already enrolled
        const existing = await Enrollment.findOne({ student: req.user.id, course: courseId });
        if (existing) return res.status(400).json({ message: 'Already registered for this course' });

        const enrollment = await Enrollment.create({
            student: req.user.id,
            course: courseId
        });

        res.status(201).json({ message: 'Successfully registered for course', enrollment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 🎓 GET STUDENT ENROLLMENTS
exports.getStudentCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user.id }).populate('course');
        res.json(enrollments.filter(e => e.course).map(e => e.course));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
