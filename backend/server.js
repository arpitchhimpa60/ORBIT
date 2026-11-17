
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

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

// Connect to MongoDB and start server
const PORT = process.env.PORT || 9876;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`ORBIT Server running on port ${PORT}`);
  });
};

startServer();
