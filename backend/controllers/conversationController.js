
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

// Create a new private conversation or return an existing one
const createOrGetConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    if (!receiverId) {
      return res.status(400).json({
        message: "Receiver ID is required",
      });
    }

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({
        message: "You cannot start a conversation with yourself",
      });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    const participantIds = [
      senderId.toString(),
      receiverId.toString(),
    ].sort();

    const directKey = participantIds.join("_");

    let conversation = await Conversation.findOne({
      directKey: directKey,
    }).populate("participants", "name username profilePicture");

    if (conversation) {
      return res.status(200).json({
        message: "Conversation already exists",
        conversation,
      });
    }

    const currentDate = new Date();

    conversation = await Conversation.create({
      type: "private",
      participants: participantIds,
      directKey: directKey,

      lastReadAt: participantIds.map((participantId) => ({
        user: participantId,
        date: currentDate,
      })),
    });

    conversation = await Conversation.findById(
      conversation._id
    ).populate("participants", "name username profilePicture");

    res.status(201).json({
      message: "Private conversation created successfully",
      conversation,
    });
  } catch (error) {
    if (error.code === 11000 && req.body.receiverId) {
      try {
        const participantIds = [
          req.user._id.toString(),
          req.body.receiverId.toString(),
        ].sort();

        const conversation = await Conversation.findOne({
          directKey: participantIds.join("_"),
        }).populate("participants", "name username profilePicture");

        if (conversation) {
          return res.status(200).json({
            message: "Conversation already exists",
            conversation,
          });
        }
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

// Create a new group conversation
const createGroup = async (req, res) => {
  try {
    const { groupName, memberIds } = req.body;

    const creatorId = req.user._id;

    if (!groupName || !groupName.trim()) {
      return res.status(400).json({
        message: "Group name is required",
      });
    }

    if (groupName.trim().length > 40) {
      return res.status(400).json({
        message: "Group name cannot exceed 40 characters",
      });
    }

    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({
        message: "Add at least one member to create a group",
      });
    }

    const uniqueMemberIds = [
      ...new Set(memberIds.map((id) => String(id))),
    ];

    if (uniqueMemberIds.includes(creatorId.toString())) {
      return res.status(400).json({
        message: "You cannot add yourself as another member",
      });
    }

    const members = await User.find({
      _id: { $in: uniqueMemberIds },
    }).select("_id");

    if (members.length !== uniqueMemberIds.length) {
      return res.status(404).json({
        message: "One or more selected users were not found",
      });
    }

    const participantIds = [
      creatorId,
      ...members.map((member) => member._id),
    ];

    const currentDate = new Date();

    let conversation = await Conversation.create({
      type: "group",
      groupName: groupName.trim(),
      createdBy: creatorId,
      participants: participantIds,

      lastReadAt: participantIds.map((participantId) => ({
        user: participantId,
        date: currentDate,
      })),
    });

    conversation = await Conversation.findById(
      conversation._id
    )
      .populate("participants", "name username profilePicture")
      .populate("createdBy", "name username");

    res.status(201).json({
      message: "Group created successfully",
      conversation,
    });
  } catch (error) {
    console.log("Create group error:", error.message);

    res.status(500).json({
      message: "Server error while creating group",
    });
  }
};

// Get all conversations of the logged-in user
const getMyConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "name username profilePicture")
      .populate("createdBy", "name username")
      .sort({ updatedAt: -1 });

    // Add unread count and latest message to every conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation) => {
        const currentUserReadTime = conversation.lastReadAt.find(
          (entry) =>
            entry.user.toString() === req.user._id.toString()
        );

        const lastReadDate = currentUserReadTime
          ? currentUserReadTime.date
          : conversation.createdAt;

        // Count messages received after the user last opened this chat
        const unreadCount = await Message.countDocuments({
          conversation: conversation._id,
          sender: { $ne: req.user._id },
          createdAt: { $gt: lastReadDate },
        });

        // Find the latest message in this conversation
        const lastMessage = await Message.findOne({
          conversation: conversation._id,
        })
          .sort({ createdAt: -1 })
          .populate("sender", "name username");

        return {
          ...conversation.toObject(),
          unreadCount: unreadCount,
          lastMessage: lastMessage,
        };
      })
    );

    res.status(200).json({
      message: "Conversations fetched successfully",
      conversations: conversationsWithDetails,
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

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants.some(
      (participant) =>
        participant.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not a participant in this conversation",
      });
    }

    const readEntry = conversation.lastReadAt.find(
      (entry) =>
        entry.user.toString() === req.user._id.toString()
    );

    if (readEntry) {
      readEntry.date = new Date();
    } else {
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
  createGroup,
  getMyConversations,
  markConversationRead,
};
