const Comment = require("../Model/commentModel");
const Post = require("../Model/postModel");
const User = require("../Model/userModel");
const Notification = require("../Model/notificationModel");

class PostController {
  getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

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
