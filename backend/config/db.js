// This file handles the database connection for the Attendx backend.
// It uses Mongoose to connect to MongoDB using the MONGO_URI from environment variables.
// If the connection fails, it logs the error and exits the process.
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
