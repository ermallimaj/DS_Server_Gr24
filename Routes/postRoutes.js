const express = require("express");
const AuthController = require("../Controllers/authController");
const PostController = require("../Controllers/postController");
const  postController = new PostController();
const authController = new AuthController();
const router = express.Router();

router.get("/", postController.getAllPosts);
router.post("/like-post/:id", authController.protect, postController.like);
router.post(
  "/dislike-post/:id",
  authController.protect,
  postController.dislike
);
router.post("/comment/:id", authController.protect, postController.comment);
router.delete(
  "/:postId/:commentId",
  authController.protect,
  postController.deleteComment
);
router.get(
  "/:id/comments",
  authController.protect,
  postController.getPostComments
);



module.exports = router;