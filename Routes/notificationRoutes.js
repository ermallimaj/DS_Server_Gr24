const express = require("express");
const AuthController = require("../Controllers/authController");
const NotificationsController = require("../Controllers/notificationController");

const notificationsController = new NotificationsController();
const authController = new AuthController();
const router = express.Router();

router.get("/", authController.protect, notificationsController.getNotifications);

module.exports = router;
