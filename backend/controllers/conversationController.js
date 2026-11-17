const Conversation = require("../models/Conversation");
const User = require("../models/User");

// Create a new private conversation or return an existing one
const createOrGetConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    // Check whether receiver ID is provided
    if (!receiverId) {
      return res.status(400).json({
        message: "Receiver ID is required",
      });
    }

    // Prevent starting a conversation with yourself
    if (senderId.toString() === receiverId) {
      return res.status(400).json({
        message: "You cannot start a conversation with yourself",
      });
    }

    // Check whether receiver exists
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    // Generate the same key regardless of who starts the conversation
    const participantIds = [
      senderId.toString(),
      receiverId.toString(),
    ].sort();

    const directKey = participantIds.join("_");

    // Check whether conversation already exists
    let conversation = await Conversation.findOne({
      directKey: directKey,
    }).populate("participants", "name username profilePicture");

    if (conversation) {
      return res.status(200).json({
        message: "Conversation already exists",
        conversation,
      });
    }

    // Create a new conversation
    conversation = await Conversation.create({
      participants: participantIds,
      directKey: directKey,
    });

    // Get participant details
    conversation = await Conversation.findById(
      conversation._id
    ).populate("participants", "name username profilePicture");

    res.status(201).json({
      message: "Private conversation created successfully",
      conversation,
    });
  } catch (error) {
    // Handle duplicate conversation creation
    if (error.code === 11000) {
      try {
        const participantIds = [
          req.user._id.toString(),
          req.body.receiverId,
        ].sort();

        const conversation = await Conversation.findOne({
          directKey: participantIds.join("_"),
        }).populate("participants", "name username profilePicture");

        return res.status(200).json({
          message: "Conversation already exists",
          conversation,
        });
      } catch (findError) {
        console.log("Find conversation error:", findError.message);
      }
    }

    console.log("Create conversation error:", error.message);

    res.status(500).json({
      message: "Server error while creating conversation",
    });
  }
};

// Get all private conversations of the logged-in user
const getMyConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "name username profilePicture")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      message: "Conversations fetched successfully",
      conversations,
    });
  } catch (error) {
    console.log("Get conversations error:", error.message);

    res.status(500).json({
      message: "Server error while fetching conversations",
    });
  }
};

module.exports = {
  createOrGetConversation,
  getMyConversations,
};
