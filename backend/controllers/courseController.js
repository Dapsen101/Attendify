const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  console.log("createCourse HIT for user:", req.user.id);
  try {
    const { title, code } = req.body;
    if (!req.user.role || req.user.role.toLowerCase() !== 'lecturer') {
      return res.status(403).json({ message: 'Only lecturers can create courses' });
    }

    console.log("Attempting Course.create...");
    const course = await Course.create({
      title,
      code,
      lecturer: req.user.id
    });
    console.log("Course.create SUCCESS");

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ lecturer: req.user.id });
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
