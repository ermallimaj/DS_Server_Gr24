const express = require("express");
const NotificationController = require("../Controllers/notificationController");
const AuthController = require("../Controllers/authController");

const router = express.Router();
const notificationController = new NotificationController();
const authController = new AuthController();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications for a user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Internal server error
 */
router.get("/", authController.protect, notificationController.getNotifications);

/**
 * @swagger
 * /notifications/mark-notification-as-seen:
 *   post:
 *     summary: Mark all notifications as seen
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications marked as seen
 *       500:
 *         description: Internal server error
 */
router.post("/mark-notification-as-seen", authController.protect, notificationController.markNotificationAsSeen);

module.exports = router;
