// This is the Mongoose model for Course in Attendx.
// It defines the schema for course documents, including:
// - title: Course title
// - code: Unique course code
// - lecturer: Reference to the User who teaches the course
// Timestamps are automatically added for createdAt and updatedAt.
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);

