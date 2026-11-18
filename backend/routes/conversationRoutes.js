
const express = require("express");

const router = express.Router();

const {
  createOrGetConversation,
  getMyConversations,
  markConversationRead,
} = require("../controllers/conversationController");

const authMiddleware = require("../middleware/authMiddleware");

// Create a private conversation or return an existing one
router.post("/", authMiddleware, createOrGetConversation);

// Get all conversations of the logged-in user
router.get("/", authMiddleware, getMyConversations);

// Mark a conversation as read
router.patch("/:conversationId/read", authMiddleware, markConversationRead);

module.exports = router;
