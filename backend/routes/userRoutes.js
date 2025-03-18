const express = require("express");
const { createUser, loginUser, getUsers, getUserById, deleteUser, getAllDoctors } = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/doctors", getAllDoctors);
router.get("/all", authenticate, authorize(["admin"]), getUsers);
router.get("/:id", authenticate, getUserById);
router.delete("/:id", authenticate, authorize(["admin"]), deleteUser);

module.exports = router;