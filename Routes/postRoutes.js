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



module.exports = router;