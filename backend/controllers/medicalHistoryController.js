const MedicalHistory = require('../models/medicalHistoryModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

const createMedicalHistory = async (req, res) => {
  try {
    const { medications, allergies, surgeries, familyHistory, vitalSigns } = req.body;
    const patientId = req.user.id;
    const createdBy = req.user.id;

    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Only patients can create their own medical history' });
    }

    let medicalHistory = await MedicalHistory.findOne({ patientId });
    if (medicalHistory) {
      if (medications) medicalHistory.medications.push(...medications);
      if (allergies) medicalHistory.allergies.push(...allergies);
      if (surgeries) medicalHistory.surgeries.push(...surgeries);
      if (familyHistory) medicalHistory.familyHistory.push(...familyHistory);
      if (vitalSigns) medicalHistory.vitalSigns.push(...vitalSigns);
      medicalHistory.updatedAt = Date.now();
    } else {
      medicalHistory = new MedicalHistory({
        patientId,
        createdBy,
        medications: medications || [],
        allergies: allergies || [],
        surgeries: surgeries || [],
        familyHistory: familyHistory || [],
        vitalSigns: vitalSigns || [],
      });
    }

    await medicalHistory.save();
    res.status(201).json({ message: 'Medical history created/updated', medicalHistory });
  } catch (error) {
    console.error('Error creating medical history:', error);
    res.status(500).json({ message: 'Error creating medical history', error: error.message });
  }
};

// Update Medical History (Anyone authenticated can update)
const updateMedicalHistory = async (req, res) => {
  try {
    const { patientId, conditions, medications, allergies, surgeries, familyHistory, vitalSigns, notes } = req.body;
    const updatedBy = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const medicalHistory = await MedicalHistory.findOne({ patientId });
    if (!medicalHistory) {
      return res.status(404).json({ message: 'Medical history not found for this patient' });
    }

    // Update fields if provided
    if (conditions) medicalHistory.conditions = conditions;
    if (medications) medicalHistory.medications = medications;
    if (allergies) medicalHistory.allergies = allergies;
    if (surgeries) medicalHistory.surgeries = surgeries;
    if (familyHistory) medicalHistory.familyHistory = familyHistory;
    if (vitalSigns) medicalHistory.vitalSigns = vitalSigns;
    if (notes !== undefined) medicalHistory.notes = notes;
    medicalHistory.updatedAt = Date.now();
    medicalHistory.createdBy = updatedBy; // Update who last modified it

    await medicalHistory.save();
    res.status(200).json({ message: 'Medical history updated', medicalHistory });
  } catch (error) {
    console.error('Error updating medical history:', error);
    res.status(500).json({ message: 'Error updating medical history', error: error.message });
  }
};

// Get Medical History by User (Patient sees own, others by patientId)
const getMedicalHistoryByUser = async (req, res) => {
  try {
    let patientId = req.user.role === 'patient' ? req.user.id : req.params.patientId;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }

    const medicalHistory = await MedicalHistory.findOne({ patientId })
      .populate('patientId', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName')
      .populate('medications.prescribedBy', 'firstName lastName')
      .populate('surgeries.surgeon', 'firstName lastName')
      .populate('vitalSigns.recordedBy', 'firstName lastName');

    if (!medicalHistory) {
      return res.status(404).json({ message: 'Medical history not found for this patient' });
    }

    res.status(200).json(medicalHistory);
  } catch (error) {
    console.error('Error fetching medical history:', error);
    res.status(500).json({ message: 'Error fetching medical history', error: error.message });
  }
};

// Get All Medical Histories (Admin only)
const getAllMedicalHistories = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access restricted to admins only' });
    }

    const medicalHistories = await MedicalHistory.find()
      .populate('patientId', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName')
      .populate('medications.prescribedBy', 'firstName lastName')
      .populate('surgeries.surgeon', 'firstName lastName')
      .populate('vitalSigns.recordedBy', 'firstName lastName');

    if (!medicalHistories || medicalHistories.length === 0) {
      return res.status(404).json({ message: 'No medical histories found' });
    }

    res.status(200).json(medicalHistories);
  } catch (error) {
    console.error('Error fetching all medical histories:', error);
    res.status(500).json({ message: 'Error fetching all medical histories', error: error.message });
  }
};

module.exports = {
  createMedicalHistory,
  updateMedicalHistory,
  getMedicalHistoryByUser,
  getAllMedicalHistories,
};