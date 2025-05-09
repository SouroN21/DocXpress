const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  conditions: [
    {
      name: { type: String },
      diagnosedDate: { type: Date },
      status: {
        type: String,
        enum: ['active', 'resolved', 'chronic'],
        default: 'active',
      },
      notes: { type: String },
    },
  ],
  medications: [
    {
      name: { type: String },
      dosage: { type: String },
      frequency: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      prescribedBy: {  type: String,},
      notes: { type: String },
    },
  ],
  allergies: [
    {
      allergen: { type: String },
      reaction: { type: String },
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe'],
      },
      diagnosedDate: { type: Date },
      notes: { type: String },
    },
  ],
  surgeries: [
    {
      name: { type: String },
      date: { type: Date },
      hospital: { type: String },
      surgeon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
      },
      condition: { type: String },
      notes: { type: String },
    },
  ],
  vitalSigns: [
    {
      date: { type: Date, default: Date.now },
      bloodPressure: { type: String },
      heartRate: { type: Number, min: 0 },
      temperature: { type: Number },
      weight: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
      recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

medicalHistorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);
