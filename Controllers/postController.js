const Comment = require("../Model/commentModel");
const Post = require("../Model/postModel");
const User = require("../Model/userModel");
const Notification = require("../Model/notificationModel");
const multer = require("multer");

class PostController {
  /**
   * @swagger
   * /posts:
   *   get:
   *     summary: Get all posts
   *     tags: [Posts]
   *     responses:
   *       200:
   *         description: A list of posts
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Post'
   */
  getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * @swagger
   * /posts/{id}:
   *   get:
   *     summary: Get posts by user ID
   *     tags: [Posts]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The user ID
   *     responses:
   *       200:
   *         description: A list of posts
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Post'
   *       500:
   *         description: Internal server error
   */
  getUserPosts = async (req, res) => {
    try {
      const userId = req.params.id;
      const posts = await Post.find({ user: userId });
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  upload = multer({ storage: this.storage }).single("image");

  /**
   * @swagger
   * /posts/upload-post:
   *   post:
   *     summary: Upload a new post
   *     tags: [Posts]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               image:
   *                 type: string
   *                 format: binary
   *               caption:
   *                 type: string
   *     responses:
   *       200:
   *         description: Post uploaded successfully
   *       500:
   *         description: Internal server error
   */
  post = async (req, res) => {
    this.upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const userId = req.user._id;

      const newPost = new Post({
        image: req.file.filename,
        caption: req.body.caption,
        user: userId,
      });

      try {
        const savedPost = await newPost.save();

        await User.updateOne(
          { _id: userId },
          { $push: { posts: savedPost._id } }
        );

        res.status(200).json({
          status: "success",
          savedPost,
        });
      } catch (error) {
        // Handle errors
        console.error("Error saving post:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });
  };

  /**
   * @swagger
   * /posts/like-post/{id}:
   *   post:
   *     summary: Like a post
   *     tags: [Posts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The post ID
   *     responses:
   *       200:
   *         description: Post liked successfully
   *       404:
   *         description: Post already liked
   *       500:
   *         description: Internal server error
   */
  like = async (req, res) => {
    const postId = req.params.id;
    const user = req.user;
    const post = await Post.findById(postId);

    if (post.likes.includes(user._id)) {
      res.status(404).json({
        msg: "You have already liked this post",
      });
    } else {
      await User.updateOne({ _id: user._id }, { $push: { liked: postId } });
      await Post.updateOne({ _id: postId }, { $push: { likes: user._id } });

      // Create a notification
      const notification = new Notification({
        user: post.user,
        type: "like",
        postId: post._id,
        userProfileImage: user.profileImage,
        postImage: post.image,
        username: user.username,
        sentById: user._id,
      });
      await notification.save();

      res.status(200).json({
        status: "success",
        post,
        user: user,
      });
    }
  };

  /**
   * @swagger
   * /posts/dislike-post/{id}:
   *   post:
   *     summary: Dislike a post
   *     tags: [Posts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The post ID
   *     responses:
   *       200:
   *         description: Post disliked successfully
   *       500:
   *         description: Internal server error
   */
  dislike = async (req, res) => {
    const postId = req.params.id;
    const user = req.user;
    const post = await Post.findById(postId);

    if (post.likes.includes(user._id)) {
      await User.updateOne({ _id: user._id }, { $pull: { liked: postId } });
      await Post.updateOne({ _id: postId }, { $pull: { likes: user._id } });
    } else {
      res.status(200).json({
        status: "success",
        post,
        user: user,
      });
    }
  };

  /**
   * @swagger
   * /posts/comment/{id}:
   *   post:
   *     summary: Comment on a post
   *     tags: [Posts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The post ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               comment:
   *                 type: string
   *                 example: This is a comment
   *     responses:
   *       200:
   *         description: Comment added successfully
   *       500:
   *         description: Internal server error
   */
  comment = async (req, res) => {
    const postId = req.params.id;
    const user = req.user;
    const post = await Post.findById(postId);
    const comment = req.body.comment;

    const newComment = await Comment.create({
      comment,
      onPost: postId,
      postedBy: user._id,
    });

    await User.updateOne(
      { _id: user._id },
      { $push: { commented: newComment._id } }
    );

    await Post.updateOne(
      { _id: postId },
      { $push: { comments: newComment._id } }
    );

    const notification = new Notification({
      user: post.user,
      type: "comment",
      postId: post._id,
      userProfileImage: user.profileImage,
      postImage: post.image,
      username: user.username,
      commentText: comment,
      sentById: user._id,
    });
    await notification.save();

    res.status(200).json({
      status: "success",
      comment: newComment,
    });
  };

  /**
   * @swagger
   * /posts/{postId}/{commentId}:
   *   delete:
   *     summary: Delete a comment
   *     tags: [Posts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: postId
   *         schema:
   *           type: string
   *         required: true
   *         description: The post ID
   *       - in: path
   *         name: commentId
   *         schema:
   *           type: string
   *         required: true
   *         description: The comment ID
   *     responses:
   *       200:
   *         description: Comment deleted successfully
   *       403:
   *         description: Unauthorized to delete this comment
   *       500:
   *         description: Internal server error
   */
  deleteComment = async (req, res) => {
    const commentId = req.params.commentId;
    const postId = req.params.postId;
    const user = req.user;

    try {
      const comment = await Comment.findById(commentId);

      if (comment.postedBy.toString() !== user._id.toString()) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this comment" });
      }

      await Comment.findByIdAndDelete(commentId);

      await User.updateOne(
        { _id: user._id },
        { $pull: { commented: commentId } }
      );

      await Post.updateOne({ _id: postId }, { $pull: { comments: commentId } });

      res.status(200).json({
        status: "success",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * @swagger
   * /posts/{id}/comments:
   *   get:
   *     summary: Get comments for a post
   *     tags: [Posts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The post ID
   *     responses:
   *       200:
   *         description: Comments fetched successfully
   *       500:
   *         description: Internal server error
   */
  getPostComments = async (req, res) => {
    const postId = req.params.id;

    const comments = await Comment.find({ onPost: postId }).populate(
      "postedBy"
    );

    res.status(200).json({
      status: "success",
      comments,
    });
  };

  /**
   * @swagger
   * /posts/post/{id}:
   *   get:
   *     summary: Get a post by ID
   *     tags: [Posts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The post ID
   *     responses:
   *       200:
   *         description: Post fetched successfully
   *       404:
   *         description: Post not found
   *       500:
   *         description: Internal server error
   */
  getPostById = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate("user")
        .populate({
          path: "comments",
          populate: {
            path: "postedBy",
          },
        });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json({
        status: "success",
        post,
      });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  deletePost = async (req, res) => {
    const postId = req.params.id;
    await Post.findByIdAndDelete(postId);

    await User.updateOne({ _id: req.user._id }, { $pull: { posts: postId } });

    res.status(200).json({
      status: "deleted",
    });
  };
}

module.exports = PostController;
