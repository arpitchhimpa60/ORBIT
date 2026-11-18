
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Conversation in which this message was sent
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    // User who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Actual message content
    text: {
      type: String,
      required: true,
      trim: true,
    },

    // Delivery status of the message
    status: {
      type: String,
      enum: ["sent", "delivered"],
      default: "sent",
    },

    // Time when the recipient received the message
    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
