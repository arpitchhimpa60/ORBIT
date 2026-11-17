
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    // Check required fields
    if (!conversationId || !text || !text.trim()) {
      return res.status(400).json({
        message: "Conversation ID and message text are required",
      });
    }

    // Find the conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // Check whether the logged-in user belongs to this conversation
    const isParticipant = conversation.participants.some(
      (participant) => participant.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not a participant in this conversation",
      });
    }

    // Create and save the message
    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text: text.trim(),
    });

    // Update the conversation's updatedAt timestamp
    conversation.updatedAt = new Date();
    await conversation.save();

    res.status(201).json({
      message: "Message sent successfully",
      newMessage: message,
    });
  } catch (error) {
    console.log("Send message error:", error.message);

    res.status(500).json({
      message: "Server error while sending message",
    });
  }
};

// Get all messages from a conversation
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Find the conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // Check whether the logged-in user belongs to this conversation
    const isParticipant = conversation.participants.some(
      (participant) => participant.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not a participant in this conversation",
      });
    }

    // Fetch messages in chronological order
    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "name username")
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    console.log("Get messages error:", error.message);

    res.status(500).json({
      message: "Server error while fetching messages",
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
