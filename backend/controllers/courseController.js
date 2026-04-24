// This controller handles course-related operations.
// - createCourse: Allows lecturers to create new courses.
// - getCourses: Retrieves all courses created by the logged-in lecturer.
const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const { title, code } = req.body;
    
    // Safety check (though protect middleware handles this)
    if (!req.user || req.user.role?.toLowerCase() !== 'lecturer') {
      return res.status(403).json({ message: 'Only lecturers can create courses' });
    }

    const course = await Course.create({
      title,
      code,
      lecturer: [req.user.id]
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    // Find courses where req.user.id is in the lecturer array
    const courses = await Course.find({ lecturer: req.user.id });
    res.json(courses);
  } catch (error) {
    console.error("Get Courses Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDatabaseCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        console.error("Get DB Courses Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.assignCourse = async (req, res) => {
    let courseId;
    try {
        courseId = req.body.courseId;
        const course = await Course.findById(courseId);
        
        if (!course) return res.status(404).json({ message: 'Course not found' });
        
        // 🛠️ MIGRATION & ASSIGNMENT: Force updated as an array using $addToSet
        // $addToSet handles both "if it matches" and "must be an array" issues better
        await Course.updateOne(
            { _id: courseId },
            { $addToSet: { lecturer: req.user.id } }
        );
        
        res.json({ message: 'Course added to your list' });
    } catch (error) {
        console.error("Assign Course Error:", error);
        
        // 🛠️ MIGRATION FALLBACK: Catch errors where MongoDB refuses to push to old non-array data
        const isNonArrayError = error.message.includes('must be an array') || 
                                error.message.includes('non-array field');

        if (isNonArrayError) {
            try {
                console.log("🛠️ Starting manual migration for course:", courseId);
                const course = await Course.findById(courseId);
                
                // Construct a fresh array of unique lecturer strings
                const lecturersSet = new Set();
                lecturersSet.add(req.user.id);
                
                if (course.lecturer && !Array.isArray(course.lecturer)) {
                    lecturersSet.add(course.lecturer.toString());
                } else if (Array.isArray(course.lecturer)) {
                    course.lecturer.forEach(l => lecturersSet.add(l.toString()));
                }
                
                const finalLecturers = Array.from(lecturersSet);
                
                await Course.updateOne(
                    { _id: courseId },
                    { $set: { lecturer: finalLecturers } }
                );
                
                return res.json({ message: 'Course added to your list (migrated)' });
            } catch (innerError) {
                console.error("Migration Error:", innerError);
                return res.status(500).json({ message: 'Migration failed: ' + innerError.message });
            }
        }
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};
