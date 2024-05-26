const SavedPost = require("../Model/savedPostModel");
const User = require("../Model/userModel");

class SavedPostController {
  getAllSavedPosts = async (req, res) => {
    try {
      const savedPosts = await SavedPost.find({ user: req.user._id }).populate("post");
      res.status(200).json({ status: "success", savedPosts });
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  savePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user._id;

      const newSavedPost = await SavedPost.create({ user: userId, post: postId });

      await User.findByIdAndUpdate(userId, { $push: { savedPosts: newSavedPost._id } });

      res.status(200).json({ status: "success", savedPost: newSavedPost });
    } catch (error) {
      console.error("Error saving post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  unsavePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user._id;

      const savedPost = await SavedPost.findOneAndDelete({ user: userId, post: postId });

      await User.findByIdAndUpdate(userId, { $pull: { savedPosts: savedPost._id } });

      res.status(200).json({ status: "success", message: "Post unsaved" });
    } catch (error) {
      console.error("Error unsaving post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = SavedPostController;
