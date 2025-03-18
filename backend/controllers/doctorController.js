const Doctor = require('../models/doctorModel');
const User = require('../models/userModel');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

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

exports.createDoctorProfile = async (req, res) => {
  try {
    console.log('Raw req.body:', JSON.stringify(req.body, null, 2));
    console.log('req.file:', req.file ? req.file : 'No file');

    const {
      specialization,
      licenseNumber,
      yearsOfExperience,
      clinicAddress,
      availability,
      consultationFee,
      qualifications,
    } = req.body;

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

    let parsedAvailability;
    if (typeof availability === 'string') {
      parsedAvailability = JSON.parse(availability);
    } else if (Array.isArray(availability)) {
      parsedAvailability = availability;
    } else {
      return res.status(400).json({ message: 'Availability must be a JSON string or array' });
    }

    let parsedQualifications;
    if (typeof qualifications === 'string') {
      parsedQualifications = JSON.parse(qualifications);
    } else if (Array.isArray(qualifications)) {
      parsedQualifications = qualifications;
    } else {
      return res.status(400).json({ message: 'Qualifications must be a JSON string or array' });
    }

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

exports.getAllDoctors = async (req, res) => {
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

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      'userId',
      'firstName lastName email phoneNumber'
    );
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Error fetching doctor', error: error.message });
  }
};

exports.getDoctorByUserId = async (req, res) => {
  try {
    const userId = req.user.id; // Use authenticated user ID, not URL param
    const doctor = await Doctor.findOne({ userId }).populate(
      'userId',
      'firstName lastName email phoneNumber'
    );
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found for this user' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    console.error('Error fetching doctor by userId:', error);
    res.status(500).json({ message: 'Error fetching doctor profile', error: error.message });
  }
};

module.exports = {
  createDoctorProfile: [upload.single('image'), exports.createDoctorProfile],
  getAllDoctors: exports.getAllDoctors,
  getDoctorById: exports.getDoctorById,
  getDoctorByUserId: exports.getDoctorByUserId,
};