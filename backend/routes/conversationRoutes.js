
const express = require("express");

const router = express.Router();

const {
  createOrGetConversation,
  createGroup,
  addGroupMember,
  renameGroup,
  leaveGroup,
  getMyConversations,
  markConversationRead,
} = require("../controllers/conversationController");

const authMiddleware = require("../middleware/authMiddleware");

// Create a private conversation
router.post("/", authMiddleware, createOrGetConversation);

// Create a group
router.post("/group", authMiddleware, createGroup);

// Add a member to an existing group
router.post("/:conversationId/members", authMiddleware, addGroupMember);

// Rename a group (creator only)
router.patch("/:conversationId/name", authMiddleware, renameGroup);

// Leave a group (any member)
router.delete("/:conversationId/leave", authMiddleware, leaveGroup);

// Get all conversations
router.get("/", authMiddleware, getMyConversations);

// Mark a conversation as read
router.patch("/:conversationId/read", authMiddleware, markConversationRead);

module.exports = router;
