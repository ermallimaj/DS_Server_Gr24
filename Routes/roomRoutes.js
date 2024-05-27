const express = require("express");
const AuthController = require("../Controllers/authController");
const RoomController = require("../Controllers/roomController");
const roomController = new RoomController();
const authController = new AuthController();
const router = express.Router();

/**
 * @swagger
 * /room/create:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user1Id:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109ca
 *               user2Id:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109cb
 *     responses:
 *       200:
 *         description: Room created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/create", authController.protect, roomController.createRoom);

/**
 * @swagger
 * /room/{roomId}/createMessage:
 *   post:
 *     summary: Create a new message in a room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *         description: The room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Hello!"
 *               senderId:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109ca
 *               receiverId:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109cb
 *     responses:
 *       201:
 *         description: Message created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/:roomId/createMessage", authController.protect, roomController.createMessage);

/**
 * @swagger
 * /room/{roomId}/messages:
 *   get:
 *     summary: Get all messages in a room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *         description: The room ID
 *     responses:
 *       200:
 *         description: A list of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       500:
 *         description: Internal server error
 */
router.get("/:roomId/messages", authController.protect, roomController.getRoomMessages);

/**
 * @swagger
 * /room/last-message/{userId1}/{userId2}:
 *   get:
 *     summary: Get the last message between two users
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId1
 *         schema:
 *           type: string
 *         required: true
 *         description: The first user ID
 *       - in: path
 *         name: userId2
 *         schema:
 *           type: string
 *         required: true
 *         description: The second user ID
 *     responses:
 *       200:
 *         description: Last message fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/last-message/:userId1/:userId2", authController.protect, roomController.getLastMessage);

/**
 * @swagger
 * /room/unread-messages/{userId}:
 *   get:
 *     summary: Get unread messages count for a user
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Unread messages count fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/unread-messages/:userId", authController.protect, roomController.getUnreadMessagesCount);

/**
 * @swagger
 * /room/{senderId}/{receiverId}:
 *   get:
 *     summary: Get messages between two users
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: senderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The sender ID
 *       - in: path
 *         name: receiverId
 *         schema:
 *           type: string
 *         required: true
 *         description: The receiver ID
 *     responses:
 *       200:
 *         description: A list of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       500:
 *         description: Internal server error
 */
router.get("/:senderId/:receiverId", authController.protect, roomController.getMessagesBetweenUsers);

module.exports = router;
