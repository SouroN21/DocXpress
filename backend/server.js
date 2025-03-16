const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = express();

// Import routes using require
const appointmentRoutes = require("./routes/appointmentRoutes");

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

app.use("/appointments", appointmentRoutes); 

app.listen(5000, () => console.log("Server running on port 5000"));
