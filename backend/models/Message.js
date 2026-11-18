
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

    // Type of message: text or image
    type: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },

    // Text content (used for text messages)
    text: {
      type: String,
      trim: true,
      default: "",
    },

    // Cloudinary URL (used for image messages)
    imageUrl: {
      type: String,
      default: null,
    },

    // Original message being replied to
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
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
