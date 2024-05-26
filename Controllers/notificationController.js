const Notification = require("../Model/notificationModel");
const { io } = require("../server");

class NotificationsController {
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
