
const cloudinary = require("../config/cloudinary");

// Upload and update the logged-in user's profile picture
const updateProfilePicture = async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64 || !mimeType) {
      return res.status(400).json({
        message: "Please provide an image",
      });
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedMimeTypes.includes(mimeType)) {
      return res.status(400).json({
        message: "Only JPEG, PNG and WebP images are allowed",
      });
    }

    if (typeof imageBase64 !== "string") {
      return res.status(400).json({
        message: "Invalid image data",
      });
    }

    // Check approximate decoded image size (7 MB maximum)
    const estimatedSize = (imageBase64.length * 3) / 4;

    if (estimatedSize > 7 * 1024 * 1024) {
      return res.status(400).json({
        message: "Image size cannot exceed 7 MB",
      });
    }

    // Create a Cloudinary-compatible Base64 data URI
    const imageData = `data:${mimeType};base64,${imageBase64}`;

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(
      imageData,
      {
        folder: "orbit/profile-pictures",
        public_id: req.user._id.toString(),
        overwrite: true,
        resource_type: "image",
        invalidate: true,
      }
    );

    // Save the Cloudinary URL in MongoDB
    req.user.profilePicture = uploadedImage.secure_url;

    await req.user.save();

    return res.status(200).json({
      message: "Profile picture updated successfully",
      user: {
        id: req.user._id,
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        about: req.user.about,
        profilePicture: req.user.profilePicture,
      },
    });
  } catch (error) {
    console.log("Profile picture upload error:", error.message);

    return res.status(500).json({
      message: "Server error while updating profile picture",
    });
  }
};

module.exports = {
  updateProfilePicture,
};
