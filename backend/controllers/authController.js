const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const cleanName = name.trim();
    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      return res.status(400).json({
        message: "Name cannot be empty",
      });
    }

    if (
      cleanUsername.length < 3 ||
      !/^[a-zA-Z0-9_]+$/.test(cleanUsername)
    ) {
      return res.status(400).json({
        message: "Invalid username",
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters",
      });
    }

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
    });

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

// Login an existing user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare entered password with stored hash
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send token and user details
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        about: user.about,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.log("Login error:", error.message);

    res.status(500).json({
      message: "Server error during login",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
