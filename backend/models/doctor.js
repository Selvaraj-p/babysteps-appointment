// models/doctor.js

const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workingHours: {
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  // (Optional) Add additional fields like specialization, if needed
  specialization: { type: String }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
