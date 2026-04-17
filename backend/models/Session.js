const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    course: String,
    token: String,
    expiresAt: Date
  }, { timestamps: true });
  
  module.exports = mongoose.model('Session', sessionSchema);