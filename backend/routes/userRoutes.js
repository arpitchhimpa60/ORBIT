
const express = require("express");

const router = express.Router();

const { getAllUsers } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all registered users
router.get("/", authMiddleware, getAllUsers);

module.exports = router;
