// models/medicineReminder.js
const mongoose = require('mongoose');

const medicineReminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Comes from JWT token
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
      timesPerDay: {
        type: Number,
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      reminderTimes: [
        {
          type: String, 
          required: true,
        },
      ],
      notes: {
        type: String,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MedicineReminder', medicineReminderSchema);