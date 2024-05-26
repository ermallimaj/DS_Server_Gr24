const express = require("express");
const SavedPostController = require("../Controllers/savedPostController");
const AuthController = require("../Controllers/authController");

const savedPostController = new SavedPostController();
const authController = new AuthController();
const router = express.Router();

router.get("/", authController.protect, savedPostController.getAllSavedPosts);
router.post("/save/:postId", authController.protect, savedPostController.savePost);
router.delete("/unsave/:postId", authController.protect, savedPostController.unsavePost);

module.exports = router;
