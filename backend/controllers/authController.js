const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Check required fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Remove unnecessary spaces
    const cleanName = name.trim();
    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Validate name
    if (!cleanName) {
      return res.status(400).json({
        message: "Name cannot be empty",
      });
    }

    // Validate username
    if (
      cleanUsername.length < 3 ||
      !/^[a-zA-Z0-9_]+$/.test(cleanUsername)
    ) {
      return res.status(400).json({
        message: "Username must be at least 3 characters and contain only letters, numbers or underscores",
      });
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters",
      });
    }

    // Check whether email or username already exists
    const existingUser = await User.findOne({
      $or: [
        { email: cleanEmail },
        { username: cleanUsername },
      ],
    });

    if (existingUser) {
      if (existingUser.email === cleanEmail) {
        return res.status(409).json({
          message: "Email is already registered",
        });
      }

      return res.status(409).json({
        message: "Username is already taken",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
    });

    // Send response without password
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        about: newUser.about,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (error) {
    // Handle duplicate email or username errors
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email or username already exists",
      });
    }

    console.log("Registration error:", error.message);

    res.status(500).json({
      message: "Server error during registration",
    });
  }
};

module.exports = { registerUser };
