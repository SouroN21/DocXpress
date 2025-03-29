const express = require("express");
const {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  deleteUser,
  getAllPatients,
  deleteSelf,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/all", authenticate, authorize(["admin"]), getUsers);
router.get("/:id", authenticate, getUserById);
router.delete("/:id", authenticate, deleteUser);
router.get('/patients', authenticate, authorize(['admin']), getAllPatients);
router.delete('/self', authenticate, deleteSelf); 
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);

module.exports = router;