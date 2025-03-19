const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  specialization: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  yearsOfExperience: { type: Number, required: true, min: 0 },
  clinicAddress: { type: String, required: false },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  }],
  consultationFee: { type: Number, required: true, min: 0 },
  qualifications: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: Number, required: true },
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending',
  },
  image: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Doctor', doctorSchema);