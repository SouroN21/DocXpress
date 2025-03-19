const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  dateTime: { 
    type: Date, 
    required: true 
  }, 
  mode: { 
    type: String, 
    enum: ["In-Person", "Online"], 
    required: true 
  }, 
  paidStatus: { 
    type: String, 
    enum: ["Paid", "Pending"], 
    default: "Pending" 
  }, 
  status: { 
    type: String, 
    enum: ["Pending", "Confirmed", "Completed", "Canceled"], 
    default: "Pending" 
  }, 
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Appointment", appointmentSchema);