// This is the Mongoose model for User in the Attendx application.
// It defines the schema for user documents in the database, including fields:
// - name: User's full name
// - email: Unique email address
// - password: Hashed password
// - role: User role (e.g., 'student' or 'lecturer')
// - matric: Matriculation number (for students)
// - department: User's department
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  matric: String,
  department: String,
});

module.exports = mongoose.model("User", userSchema);
