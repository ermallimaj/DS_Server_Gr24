const SavedPost = require("../Model/savedPostModel");
const User = require("../Model/userModel");

class SavedPostController {
  /**
   * @swagger
   * /savedposts:
   *   get:
   *     summary: Get all saved posts for a user
   *     tags: [Saved Posts]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: A list of saved posts
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/SavedPost'
   *       500:
   *         description: Internal server error
   */
  getAllSavedPosts = async (req, res) => {
    try {
      const savedPosts = await SavedPost.find({ user: req.user._id }).populate("post");
      res.status(200).json({ status: "success", savedPosts });
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * @swagger
   * /savedposts/save/{postId}:
   *   post:
   *     summary: Save a post
   *     tags: [Saved Posts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: postId
   *         schema:
   *           type: string
   *         required: true
   *         description: The post ID to save
   *     responses:
   *       200:
   *         description: Post saved successfully
   *       500:
   *         description: Internal server error
   */
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

  /**
   * @swagger
   * /savedposts/unsave/{postId}:
   *   delete:
   *     summary: Unsave a post
   *     tags: [Saved Posts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: postId
   *         schema:
   *           type: string
   *         required: true
   *         description: The post ID to unsave
   *     responses:
   *       200:
   *         description: Post unsaved successfully
   *       500:
   *         description: Internal server error
   */
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
