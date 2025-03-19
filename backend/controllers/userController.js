const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phoneNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      phoneNumber,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const user = await User.findById(userId).select('-password -__v');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
 
const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password -__v');
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: "Error fetching patients", error: error.message });
  }
};

const deleteSelf = async (req, res) => {
  try {
    const userId = req.user.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: "Error deleting account", error: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  deleteUser,
  getAllPatients,
  deleteSelf,
};