const express = require("express");
const AuthController = require("../Controllers/authController");
const RoomController = require("../Controllers/roomController");
const roomController = new RoomController();
const authController = new AuthController();
const router = express.Router();

router.post("/create", authController.protect, roomController.createRoom);

router.post(
  "/:roomId/createMessage",
  authController.protect,
  roomController.createMessage
);

router.get(
  "/:roomId/messages",
  authController.protect,
  roomController.getRoomMessages
);

router.get(
  "/last-message/:userId1/:userId2",
  authController.protect,
  roomController.getLastMessage
);

router.get(
  "/unread-messages/:userId",
  authController.protect,
  roomController.getUnreadMessagesCount
);

router.get(
  "/:senderId/:receiverId",
  authController.protect,
  roomController.getMessagesBetweenUsers
);

module.exports = router;
