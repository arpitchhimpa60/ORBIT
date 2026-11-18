
const express = require("express");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

require("dotenv").config();

const connectDB = require("./config/db");
const User = require("./models/User");
const Message = require("./models/Message");
const Conversation = require("./models/Conversation");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store active connections for each user
// Map format: userId -> Set of socket IDs
const onlineUsers = new Map();

// Make Socket.IO and online users available inside controllers
app.set("io", io);
app.set("onlineUsers", onlineUsers);

// Middleware
app.use(cors());

// Allow larger JSON requests for Base64 image uploads
app.use(express.json({ limit: "10mb" }));

// Check imported route types
console.log("authRoutes:", typeof authRoutes);
console.log("userRoutes:", typeof userRoutes);
console.log("conversationRoutes:", typeof conversationRoutes);
console.log("messageRoutes:", typeof messageRoutes);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("ORBIT Backend is running!");
});

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication token is required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.userId = user._id.toString();

    next();
  } catch (error) {
    console.log("Socket authentication failed:", error.message);
    next(new Error("Invalid or expired authentication token"));
  }
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("Authenticated user connected:", socket.userId);
  console.log("Socket ID:", socket.id);

  // Join the private room belonging to this user
  socket.join(`user:${socket.userId}`);

  console.log(`User joined room: user:${socket.userId}`);

  // Add this socket connection to the user's active connections
  let userConnections = onlineUsers.get(socket.userId);

  const isFirstConnection = !userConnections;

  if (!userConnections) {
    userConnections = new Set();
    onlineUsers.set(socket.userId, userConnections);
  }

  userConnections.add(socket.id);

  // Notify everyone only when the user becomes online for the first time
  if (isFirstConnection) {
    io.emit("userOnline", {
      userId: socket.userId,
    });

    console.log("User is now online:", socket.userId);
  }

  // Handle message delivery acknowledgement
  socket.on("messageDelivered", async (data) => {
    try {
      const { messageId } = data || {};

      if (!messageId) {
        return;
      }

      // Find the message
      const message = await Message.findById(messageId);

      if (!message) {
        return;
      }

      // Find the conversation
      const conversation = await Conversation.findById(
        message.conversation
      );

      if (!conversation) {
        return;
      }

      // Check whether the connected user belongs to this conversation
      const isParticipant = conversation.participants.some(
        (participant) => participant.toString() === socket.userId
      );

      if (!isParticipant) {
        return;
      }

      // The sender cannot acknowledge their own message
      if (message.sender.toString() === socket.userId) {
        return;
      }

      // Update only messages that have not already been delivered
      const updatedMessage = await Message.findOneAndUpdate(
        {
          _id: messageId,
          status: "sent",
        },
        {
          $set: {
            status: "delivered",
            deliveredAt: new Date(),
          },
        },
        {
          new: true,
        }
      );

      // Notify the sender's connected devices
      if (updatedMessage) {
        io.to(`user:${message.sender.toString()}`).emit(
          "messageStatusUpdated",
          {
            messageId: updatedMessage._id.toString(),
            status: updatedMessage.status,
            deliveredAt: updatedMessage.deliveredAt,
          }
        );

        console.log("Message delivered:", messageId);
      }
    } catch (error) {
      console.log("Delivery acknowledgement error:", error.message);
    }
  });

  // Handle disconnection
  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.userId);

    const userConnections = onlineUsers.get(socket.userId);

    if (!userConnections) {
      return;
    }

    // Remove this particular device connection
    userConnections.delete(socket.id);

    // If another device is still connected, keep the user online
    if (userConnections.size > 0) {
      console.log("User still online on another device:", socket.userId);
      return;
    }

    // No active connections remain
    onlineUsers.delete(socket.userId);

    const lastSeen = new Date();

    try {
      // Save the user's last online time
      await User.findByIdAndUpdate(socket.userId, {
        $set: {
          lastSeen: lastSeen,
        },
      });

      // Notify everyone that the user is offline
      if (!onlineUsers.has(socket.userId)) {
        io.emit("userOffline", {
          userId: socket.userId,
          lastSeen: lastSeen,
        });

        console.log("User is now offline:", socket.userId);
      }
    } catch (error) {
      console.log("Last seen update error:", error.message);
    }
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 9876;

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`ORBIT Server running on port ${PORT}`);
  });
};

startServer();
