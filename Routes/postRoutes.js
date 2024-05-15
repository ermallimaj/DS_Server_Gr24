const express = require("express");
const AuthController = require("../Controllers/authController");
const PostController = require("../Controllers/postController");
const  postController = new PostController();
const authController = new AuthController();
const router = express.Router();


router.post("/like-post/:id", authController.protect, postController.like);


module.exports = router;