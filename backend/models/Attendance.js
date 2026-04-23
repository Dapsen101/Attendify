// This is the Mongoose model for Attendance in Attendx.
// It records when a student marks their attendance for a session.
// Fields:
// - student: Reference to the User (student) who marked attendance
// - session: Reference to the Session for which attendance was marked
// Timestamps are added automatically.
const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session'
    },
    markTime: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      default: 'Present'
    }
  }, { timestamps: true });
  
  module.exports = mongoose.model('Attendance', attendanceSchema);
