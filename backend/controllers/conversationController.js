
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
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
    if (senderId.toString() === receiverId.toString()) {
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
    const currentDate = new Date();

    conversation = await Conversation.create({
      participants: participantIds,
      directKey: directKey,

      // Initialize the last-read time for both participants
      lastReadAt: participantIds.map((participantId) => ({
        user: participantId,
        date: currentDate,
      })),
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
          req.body.receiverId.toString(),
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

    // Calculate unread messages for every conversation
    const conversationsWithUnreadCount = await Promise.all(
      conversations.map(async (conversation) => {
        const currentUserReadTime = conversation.lastReadAt.find(
          (entry) =>
            entry.user.toString() === req.user._id.toString()
        );

        // Use conversation creation time for older conversations
        // that do not yet have a lastReadAt entry
        const lastReadDate = currentUserReadTime
          ? currentUserReadTime.date
          : conversation.createdAt;

        const unreadCount = await Message.countDocuments({
          conversation: conversation._id,
          sender: { $ne: req.user._id },
          createdAt: { $gt: lastReadDate },
        });

        return {
          ...conversation.toObject(),
          unreadCount: unreadCount,
        };
      })
    );

    res.status(200).json({
      message: "Conversations fetched successfully",
      conversations: conversationsWithUnreadCount,
    });
  } catch (error) {
    console.log("Get conversations error:", error.message);

    res.status(500).json({
      message: "Server error while fetching conversations",
    });
  }
};

// Mark a conversation as read for the logged-in user
const markConversationRead = async (req, res) => {
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
      (participant) =>
        participant.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not a participant in this conversation",
      });
    }

    // Find this user's last-read entry
    const readEntry = conversation.lastReadAt.find(
      (entry) =>
        entry.user.toString() === req.user._id.toString()
    );

    if (readEntry) {
      // Update only the logged-in user's timestamp
      readEntry.date = new Date();
    } else {
      // Add an entry for older conversations
      conversation.lastReadAt.push({
        user: req.user._id,
        date: new Date(),
      });
    }

    await conversation.save();

    res.status(200).json({
      message: "Conversation marked as read",
    });
  } catch (error) {
    console.log("Mark conversation read error:", error.message);

    res.status(500).json({
      message: "Server error while marking conversation as read",
    });
  }
};

module.exports = {
  createOrGetConversation,
  getMyConversations,
  markConversationRead,
};
