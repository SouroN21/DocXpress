const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = express();

const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const reminderRoutes = require('./routes/reminderRoutes');
const medicalHistory = require('./routes/medicalHistoryRoutes');

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

app.use("/user", userRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/doc", doctorRoutes);
app.use('/reminder', reminderRoutes);
app.use('/medical-history',medicalHistory);

app.listen(5000, () => console.log("Server running on port 5000"));