const express = require("express");
const NotificationController = require("../Controllers/notificationController");
const AuthController = require("../Controllers/authController");

const router = express.Router();
const notificationController = new NotificationController();
const authController = new AuthController();

router.get("/", authController.protect, notificationController.getNotifications);

module.exports = router;
