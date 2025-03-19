const express = require("express");
const { createUser, loginUser, getUsers, getUserById, deleteUser, getAllPatients, deleteSelf } = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/all", authenticate, authorize(["admin"]), getUsers);
router.get("/:id", authenticate, getUserById);
router.delete("/:id", authenticate, authorize(["admin"]), deleteUser);
router.get('/patients', authenticate, authorize(['admin']), getAllPatients);
router.delete('/me', authenticate, deleteSelf); 

module.exports = router;