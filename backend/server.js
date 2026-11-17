
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

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
