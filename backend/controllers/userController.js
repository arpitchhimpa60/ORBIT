
const User = require("../models/User");

// Get all users except the logged-in user
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    }).select("name username about profilePicture lastSeen");

    // Get the list of currently connected users
    const onlineUsers = req.app.get("onlineUsers");

    // Add online status to every user
    const usersWithStatus = users.map((user) => {
      return {
        ...user.toObject(),
        isOnline: onlineUsers.has(user._id.toString()),
      };
    });

    res.status(200).json({
      message: "Users fetched successfully",
      users: usersWithStatus,
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
