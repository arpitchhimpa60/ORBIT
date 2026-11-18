
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

// Add a member to an existing group using their email
const addGroupMember = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: "Email address is required",
      });
    }

    // Find the group
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    // Check that this is a group conversation
    if (conversation.type !== "group") {
      return res.status(400).json({
        message: "Members can only be added to groups",
      });
    }

    // Check whether the logged-in user belongs to this group
    const isParticipant = conversation.participants.some(
      (participant) =>
        participant.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "Only group members can add new members",
      });
    }

    // Find the user using their registered email
    const newMember = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("_id name username profilePicture");

    if (!newMember) {
      return res.status(404).json({
        message: "No user found with this email address",
      });
    }

    // Prevent adding yourself
    if (newMember._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot add yourself to the group",
      });
    }

    // Prevent adding someone who is already a member
    const alreadyMember = conversation.participants.some(
      (participant) =>
        participant.toString() === newMember._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "This user is already a group member",
      });
    }

    const currentDate = new Date();

    // Add the new user to the group
    conversation.participants.push(newMember._id);

    // Initialize their unread-message tracking
    conversation.lastReadAt.push({
      user: newMember._id,
      date: currentDate,
    });

    await conversation.save();

    // Get the updated group with participant details
    const updatedConversation = await Conversation.findById(
      conversation._id
    )
      .populate("participants", "name username profilePicture")
      .populate("createdBy", "name username");

    res.status(200).json({
      message: "Member added successfully",
      conversation: updatedConversation,
    });
  } catch (error) {
    console.log("Add group member error:", error.message);

    res.status(500).json({
      message: "Server error while adding group member",
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


// Rename a group (only the creator can do this)
const renameGroup = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { groupName } = req.body;

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

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    if (conversation.type !== "group") {
      return res.status(400).json({
        message: "Only groups can be renamed",
      });
    }

    const isCreator =
      conversation.createdBy?.toString() === req.user._id.toString();

    if (!isCreator) {
      return res.status(403).json({
        message: "Only the group creator can rename this group",
      });
    }

    const isParticipant = conversation.participants.some(
      (participant) =>
        participant.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are no longer a member of this group",
      });
    }

    conversation.groupName = groupName.trim();
    await conversation.save();

    const updatedConversation = await Conversation.findById(
      conversation._id
    )
      .populate("participants", "name username profilePicture")
      .populate("createdBy", "name username");

    res.status(200).json({
      message: "Group renamed successfully",
      conversation: updatedConversation,
    });
  } catch (error) {
    console.log("Rename group error:", error.message);

    res.status(500).json({
      message: "Server error while renaming group",
    });
  }
};


// Leave a group (any member, including the creator, can leave)
const leaveGroup = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    if (conversation.type !== "group") {
      return res.status(400).json({
        message: "You can only leave a group conversation",
      });
    }

    const isParticipant = conversation.participants.some(
      (participant) =>
        participant.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "You are not a member of this group",
      });
    }

    // Remove the user from the participants list
    conversation.participants = conversation.participants.filter(
      (participant) =>
        participant.toString() !== req.user._id.toString()
    );

    // Remove their unread-message tracking entry
    conversation.lastReadAt = conversation.lastReadAt.filter(
      (entry) =>
        entry.user.toString() !== req.user._id.toString()
    );

    // If nobody remains, delete the group and its messages
    if (conversation.participants.length === 0) {
      await Message.deleteMany({
        conversation: conversation._id,
      });

      await Conversation.findByIdAndDelete(conversation._id);

      return res.status(200).json({
        message: "You left the group. The empty group was deleted.",
        groupDeleted: true,
      });
    }

    await conversation.save();

    res.status(200).json({
      message: "You left the group successfully",
      groupDeleted: false,
    });
  } catch (error) {
    console.log("Leave group error:", error.message);

    res.status(500).json({
      message: "Server error while leaving group",
    });
  }
};



module.exports = {
  createOrGetConversation,
  createGroup,
  addGroupMember,
  renameGroup,
  leaveGroup,
  getMyConversations,
  markConversationRead,
};

