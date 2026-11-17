
const express = require("express");

const router = express.Router();

const {
  createOrGetConversation,
  getMyConversations,
} = require("../controllers/conversationController");

const authMiddleware = require("../middleware/authMiddleware");

// Create a private conversation or return an existing one
router.post("/", authMiddleware, createOrGetConversation);

// Get all conversations of the logged-in user
router.get("/", authMiddleware, getMyConversations);

module.exports = router;
