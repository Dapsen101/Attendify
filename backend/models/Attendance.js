const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session'
    }
  }, { timestamps: true });
  
  module.exports = mongoose.model('Attendance', attendanceSchema);