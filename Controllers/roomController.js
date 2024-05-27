const Message = require("../Model/messageModel");
const Room = require("../Model/roomModel");
const User = require("../Model/userModel");

class RoomController {
  createRoom = async (req, res) => {
    try {
      const { user1Id, user2Id } = req.body;

      let room = await Room.findOne({
        $or: [
          { participants: [user1Id, user2Id] },
          { participants: [user2Id, user1Id] },
        ],
      });

      if (!room) {
        room = new Room({
          participants: [user1Id, user2Id],
        });
        await room.save();
        await User.updateOne(
          { _id: user1Id },
          { $push: { roomId: room._id } }
        );
        await User.updateOne(
          { _id: user2Id },
          { $push: { roomId: room._id } }
        );
      }

      res.json({ roomId: room });
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  createMessage = async (req, res) => {
    try {
      const roomId = req.params.roomId;
      const { content, senderId, receiverId } = req.body;

      const message = new Message({
        content,
        sender: senderId,
        receiver: receiverId,
        room: roomId,
      });

      await message.save();

      await Room.updateOne(
        { _id: roomId },
        { $push: { messages: message._id } }
      );

      res.status(201).json({ message: "Message created successfully" });
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  getRoomMessages = async (req, res) => {
    const roomId = req.params.roomId;

    try {
      const room = await Room.findById(roomId)
        .populate("messages")
        .sort({ createdAt: -1 });
      res.status(200).json({ room });
    } catch (error) {
      console.error("Error fetching room messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  getMessagesBetweenUsers = async (req, res) => {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;

    try {
      const messages = await Message.find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId },
        ],
      }).sort({ createdAt: 1 });

      // Mark messages as seen
      await Message.updateMany(
        { sender: receiverId, receiver: senderId, seen: false },
        { seen: true }
      );

      res.status(200).json({ messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  getLastMessage = async (req, res) => {
    const { userId1, userId2 } = req.params;

    try {
      const lastMessage = await Message.findOne({
        $or: [
          { sender: userId1, receiver: userId2 },
          { sender: userId2, receiver: userId1 },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(1);

      res.status(200).json({ lastMessage });
    } catch (error) {
      console.error("Error fetching last message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  getUnreadMessagesCount = async (req, res) => {
    const { userId } = req.params;

    try {
      const unreadMessagesCount = await Message.countDocuments({
        receiver: userId,
        seen: false,
      });

      res.status(200).json({ unreadMessagesCount });
    } catch (error) {
      console.error("Error fetching unread messages count:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

module.exports = RoomController;
