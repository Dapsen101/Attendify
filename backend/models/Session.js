// This is the Mongoose model for Session in Attendx.
// Sessions represent attendance-taking periods created by lecturers.
// Fields:
// - lecturer: Reference to the User (lecturer) who created the session
// - course: Course name or code
// - token: Unique numerical token for students to mark attendance
// - expiresAt: Date when the session expires
// Timestamps are added automatically.
const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    token: String,
    expiresAt: Date,
    lat: Number,
    lng: Number
  }, { timestamps: true });
  
  module.exports = mongoose.model('Session', sessionSchema);
