
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const cloudinary = require("../config/cloudinary");

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const {
      conversationId,
      type = "text",
      text,
      imageBase64,
      mimeType,
    } = req.body;

    // Check conversation ID
    if (!conversationId) {
      return res.status(400).json({
        message: "Conversation ID is required",
      });
    }

    // Check whether the message has valid content
    if (type === "text" && (!text || !text.trim())) {
      return res.status(400).json({
        message: "Message text is required",
      });
    }

    if (type === "image" && !imageBase64) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    if (type !== "text" && type !== "image") {
      return res.status(400).json({
        message: "Invalid message type",
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

    // Prepare the message data
    const messageData = {
      conversation: conversationId,
      sender: req.user._id,
      type: type,
    };

    // Handle text messages
    if (type === "text") {
      messageData.text = text.trim();
    }

    // Handle image messages
    if (type === "image") {
      const imageData = `data:${mimeType || "image/jpeg"};base64,${imageBase64}`;

      // Upload image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(imageData, {
        folder: "orbit/messages",
        resource_type: "image",
      });

      // Save the Cloudinary image URL
      messageData.imageUrl = uploadResult.secure_url;
    }

    // Create and save the message
    const message = await Message.create(messageData);

    // Update the conversation's updatedAt timestamp
    conversation.updatedAt = new Date();
    await conversation.save();

    // Get the saved message with sender information
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name username");

    // Get the Socket.IO server
    const io = req.app.get("io");

    // Send the message to every participant's user room
    if (io) {
      conversation.participants.forEach((participant) => {
        io.to(`user:${participant.toString()}`).emit(
          "newMessage",
          populatedMessage
        );
      });
    }

    res.status(201).json({
      message: "Message sent successfully",
      newMessage: populatedMessage,
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
