const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

const {
  updateProfilePicture,
} = require("../controllers/profilePictureController");

const authMiddleware = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get logged-in user's profile
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "User authenticated successfully",
    user: {
      id: req.user._id,
      name: req.user.name,
      username: req.user.username,
      email: req.user.email,
      about: req.user.about,
      profilePicture: req.user.profilePicture,
    },
  });
});

// Update logged-in user's profile
router.patch("/me", authMiddleware, updateProfile);

// Change logged-in user's password
router.patch("/change-password", authMiddleware, changePassword);

// Update logged-in user's profile picture
router.patch(
  "/profile-picture",
  authMiddleware,
  updateProfilePicture
);

module.exports = router;
