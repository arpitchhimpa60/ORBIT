
const express = require("express");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

require("dotenv").config();

const connectDB = require("./config/db");
const User = require("./models/User");

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

// Make Socket.IO available inside controllers
app.set("io", io);

// Middleware
app.use(cors());
app.use(express.json());

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

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
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
