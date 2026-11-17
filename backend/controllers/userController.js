
const User = require("../models/User");

// Get all users except the logged-in user
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    }).select("name username about profilePicture");

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.log("Get users error:", error.message);

    res.status(500).json({
      message: "Server error while fetching users",
    });
  }
};

module.exports = {
  getAllUsers,
};
