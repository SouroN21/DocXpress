const Doctor = require('../models/doctorModel');
const User = require('../models/userModel');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(file.originalname.toLowerCase().split('.').pop());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only JPEG, JPG, and PNG images are allowed!'));
  },
});

const createDoctorProfile = async (req, res) => {
  try {
    const { specialization, licenseNumber, yearsOfExperience, clinicAddress, availability, consultationFee, qualifications } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user || user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create a profile' });
    }

    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor profile already exists' });
    }

    let imageUrl;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'doctor_profiles' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    let parsedAvailability = typeof availability === 'string' ? JSON.parse(availability) : availability;
    let parsedQualifications = typeof qualifications === 'string' ? JSON.parse(qualifications) : qualifications;

    const doctor = new Doctor({
      userId,
      specialization,
      licenseNumber,
      yearsOfExperience: Number(yearsOfExperience),
      clinicAddress,
      availability: parsedAvailability,
      consultationFee: Number(consultationFee),
      qualifications: parsedQualifications,
      image: imageUrl,
      status: 'pending',
    });

    await doctor.save();
    res.status(201).json({ message: 'Doctor profile created successfully', doctor });
  } catch (error) {
    console.error('Error creating doctor profile:', error);
    res.status(500).json({ message: 'Error creating doctor profile', error: error.message });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('userId', 'firstName lastName email phoneNumber')
      .select('-__v');
    if (!doctors || doctors.length === 0) {
      return res.status(404).json({ message: 'No doctors found' });
    }
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctorId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor ID format" });
    }
    const doctor = await Doctor.findById(doctorId).populate('userId', 'firstName lastName email phoneNumber');
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: "Error fetching doctor", error: error.message });
  }
};

const getDoctorByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const doctor = await Doctor.findOne({ userId }).populate('userId', 'firstName lastName email phoneNumber');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found for this user' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    console.error('Error fetching doctor by userId:', error);
    res.status(500).json({ message: 'Error fetching doctor profile', error: error.message });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const { specialization, licenseNumber, yearsOfExperience, clinicAddress, availability, consultationFee, qualifications } = req.body;
    const userId = req.user.id;

    const doctor = await Doctor.findOne({ userId });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    let imageUrl = doctor.image;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'doctor_profiles' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    let parsedAvailability = typeof availability === 'string' ? JSON.parse(availability) : availability;
    let parsedQualifications = typeof qualifications === 'string' ? JSON.parse(qualifications) : qualifications;

    doctor.specialization = specialization || doctor.specialization;
    doctor.licenseNumber = licenseNumber || doctor.licenseNumber;
    doctor.yearsOfExperience = yearsOfExperience ? Number(yearsOfExperience) : doctor.yearsOfExperience;
    doctor.clinicAddress = clinicAddress !== undefined ? clinicAddress : doctor.clinicAddress;
    doctor.availability = parsedAvailability || doctor.availability;
    doctor.consultationFee = consultationFee ? Number(consultationFee) : doctor.consultationFee;
    doctor.qualifications = parsedQualifications || doctor.qualifications;
    doctor.image = imageUrl;

    await doctor.save();
    res.status(200).json({ message: 'Doctor profile updated successfully', doctor });
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    res.status(500).json({ message: 'Error updating doctor profile', error: error.message });
  }
};

const updateDoctorStatus = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    doctor.status = status;
    await doctor.save();
    res.status(200).json({ message: 'Doctor status updated', doctor });
  } catch (error) {
    console.error('Error updating doctor status:', error);
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

module.exports = {
  createDoctorProfile: [upload.single('image'), createDoctorProfile],
  getAllDoctors,
  getDoctorById,
  getDoctorByUserId,
  updateDoctorProfile: [upload.single('image'), updateDoctorProfile],
  updateDoctorStatus,
};