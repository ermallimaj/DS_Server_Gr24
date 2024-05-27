const Notification = require("../Model/notificationModel");
const { io } = require("../server");

class NotificationsController {
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
  getNotifications = async (req, res) => {
    try {
      const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
      res.status(200).json({
        status: "success",
        notifications,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  notifyUser = async (notification) => {
    try {
      const newNotification = await Notification.create(notification);
      io.emit("new-notification", newNotification);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

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
  markNotificationAsSeen = async (req, res) => {
    try {
      await Notification.updateMany(
        { user: req.user._id, seen: false },
        { seen: true }
      );
      res.status(200).json({
        status: "success",
        message: "Notifications marked as seen",
      });
    } catch (error) {
      console.error("Error marking notifications as seen:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = NotificationsController;
