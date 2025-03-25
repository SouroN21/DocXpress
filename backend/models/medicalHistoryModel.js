const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (assuming patients are users)
    required: true,
    index: true, // Improves query performance for lookups by patient
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the doctor or admin who created/updated the record
    required: true,
  },
  conditions: [
    {
      name: { type: String, required: true }, // e.g., "Diabetes", "Hypertension"
      diagnosedDate: { type: Date, required: true },
      status: {
        type: String,
        enum: ['active', 'resolved', 'chronic'],
        default: 'active',
      },
      notes: { type: String }, // Additional details
    },
  ],
  medications: [
    {
      name: { type: String, required: true }, // e.g., "Metformin", "Lisinopril"
      dosage: { type: String, required: true }, // e.g., "500 mg"
      frequency: { type: String, required: true }, // e.g., "Twice daily"
      startDate: { type: Date, required: true },
      endDate: { type: Date }, // Optional, if medication is discontinued
      prescribedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Doctor who prescribed it
      },
      notes: { type: String },
    },
  ],
  allergies: [
    {
      allergen: { type: String, required: true }, // e.g., "Penicillin", "Peanuts"
      reaction: { type: String, required: true }, // e.g., "Rash", "Anaphylaxis"
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe'],
        required: true,
      },
      diagnosedDate: { type: Date },
      notes: { type: String },
    },
  ],
  surgeries: [
    {
      name: { type: String, required: true }, // e.g., "Appendectomy"
      date: { type: Date, required: true },
      hospital: { type: String },
      surgeon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Doctor who performed the surgery
      },
      outcome: {
        type: String,
        enum: ['successful', 'complications', 'ongoing'],
        default: 'successful',
      },
      notes: { type: String },
    },
  ],
  familyHistory: [
    {
      relation: {
        type: String,
        enum: ['parent', 'sibling', 'grandparent', 'other'],
        required: true,
      },
      condition: { type: String, required: true }, // e.g., "Heart Disease"
      notes: { type: String },
    },
  ],
  vitalSigns: [
    {
      date: { type: Date, default: Date.now },
      bloodPressure: { type: String }, // e.g., "120/80 mmHg"
      heartRate: { type: Number, min: 0 }, // e.g., 72 bpm
      temperature: { type: Number }, // e.g., 98.6 F
      weight: { type: Number, min: 0 }, // e.g., 70 kg
      height: { type: Number, min: 0 }, // e.g., 170 cm
      recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Doctor or staff who recorded it
      },
    },
  ],
  notes: { type: String }, // General notes about the patient's history
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update `updatedAt` before saving
medicalHistorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);