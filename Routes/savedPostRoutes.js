const express = require("express");
const SavedPostController = require("../Controllers/savedPostController");
const AuthController = require("../Controllers/authController");

const savedPostController = new SavedPostController();
const authController = new AuthController();
const router = express.Router();

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
router.get("/", authController.protect, savedPostController.getAllSavedPosts);

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
router.post("/save/:postId", authController.protect, savedPostController.savePost);

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
router.delete("/unsave/:postId", authController.protect, savedPostController.unsavePost);

module.exports = router;
