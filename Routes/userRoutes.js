const express = require("express");
const AuthController = require('../Controllers/authController');
const authController = new AuthController();
const { UserController, uploadUserPhoto, resizeUserPhoto } = require("../Controllers/userController");
const userController = new UserController();

const router = express.Router();

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/signup', authController.signup);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /users/get-user-data:
 *   get:
 *     summary: Get logged in user data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/get-user-data", authController.protect, userController.getUserData);

/**
 * @swagger
 * /users/user/all:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get('/user/all', authController.protect, userController.getAllUsers);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", authController.protect, userController.getAllUsers);

/**
 * @swagger
 * /users/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/user/:id', authController.protect, userController.getUserById);

/**
 * @swagger
 * /users/edit-profile:
 *   put:
 *     summary: Edit user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/edit-profile', authController.protect, uploadUserPhoto, resizeUserPhoto, userController.updateUserData);

/**
 * @swagger
 * /users/follow/{id}:
 *   post:
 *     summary: Follow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID to follow
 *     responses:
 *       200:
 *         description: Successfully followed the user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/follow/:id', authController.protect, userController.followUser);

/**
 * @swagger
 * /users/unfollow/{id}:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID to unfollow
 *     responses:
 *       200:
 *         description: Successfully unfollowed the user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/unfollow/:id', authController.protect, userController.unfollowUser);

/**
 * @swagger
 * /users/followers/{id}:
 *   get:
 *     summary: Get user's followers
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Followers fetched successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/followers/:id', authController.protect, userController.getFollowers);

/**
 * @swagger
 * /users/following/{id}:
 *   get:
 *     summary: Get user's following
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Following fetched successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/following/:id', authController.protect, userController.getFollowing);

module.exports = router;
