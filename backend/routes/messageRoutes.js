
const express = require("express");

const router = express.Router();

const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

const authMiddleware = require("../middleware/authMiddleware");

// Send a message
router.post("/", authMiddleware, sendMessage);

// Get messages from a conversation
router.get("/:conversationId", authMiddleware, getMessages);

module.exports = router;
