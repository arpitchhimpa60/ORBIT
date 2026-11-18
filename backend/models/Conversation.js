
const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // Private or group conversation
    type: {
      type: String,
      enum: ["private", "group"],
      default: "private",
      required: true,
    },

    // Users who belong to this conversation
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Stores when each participant last opened this conversation
    lastReadAt: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Used only for private conversations
    directKey: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Used only for group conversations
    groupName: {
      type: String,
      trim: true,
      maxlength: 40,
    },

    // Creator of a group
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);

module.exports = Conversation;
