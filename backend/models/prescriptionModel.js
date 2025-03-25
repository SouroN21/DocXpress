// models/prescription.js
const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  medicines: [
    {
      medicineName: {
        type: String,
        required: true,
      },
      dosage: {
        type: String,
        required: true,
      },
      frequency: {
        type: String, 
        required: true,
      },
      duration: {
        type: String, 
        required: true,
      },
      notes: {
        type: String,
      },
    },
  ],
  issuedAt: {
    type: Date,
    default: Date.now,
  },
  finalNotes: {
    type: String,
  },
});

module.exports = mongoose.model('Prescription', prescriptionSchema);