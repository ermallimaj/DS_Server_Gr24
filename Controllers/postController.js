const Post = require("../Model/postModel");
const User = require("../Model/userModel");

class PostController {



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

      res.status(200).json({
        status: "success",
        post,
        user: user,
      });
    }
  };
} 
module.exports = PostController;