const User = require("../Model/userModel");
const multer = require('multer');
const sharp = require('sharp');
const Notification = require("../Model/notificationModel");
const NotificationsController = require("../Controllers/notificationController");
const notificationsController = new NotificationsController();

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

const uploadUserPhoto = upload.single('photo');

const resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/${req.file.filename}`);

  next();
};

class UserController {
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
  getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        status: "success",
        user,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

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
  getUserData = (req, res, next) => {
    res.status(200).json({
      message: "success",
      user: req.user,
    });
  };

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
  updateUserData = async (req, res) => {
    try {
      const { firstName, lastName, username, email } = req.body;
      const userId = req.user._id;

      const updatedData = {
        name: `${firstName} ${lastName}`,
        username,
        email,
      };

      if (req.file) {
        updatedData.profileImage = req.file.filename;
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updatedData,
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        status: "success",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

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
  getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('username profileImage'); // Fetch only necessary fields
      res.status(200).json({
        status: "success",
        users,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

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
  followUser = async (req, res) => {
    try {
      const userToFollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);

      if (!userToFollow || !currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!currentUser.following.includes(userToFollow._id)) {
        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);
        await currentUser.save();
        await userToFollow.save();

        const notification = {
          user: userToFollow._id,
          type: "follow",
          sentById: currentUser._id,
          userProfileImage: currentUser.profileImage,
          username: currentUser.username,
          postId: null,
        };
        await notificationsController.notifyUser(notification);
      }

      res.status(200).json({
        status: "success",
        message: `You are now following ${userToFollow.username}`,
      });
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

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
  unfollowUser = async (req, res) => {
    try {
      const userToUnfollow = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.id);

      if (!userToUnfollow || !currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      currentUser.following.pull(userToUnfollow._id);
      userToUnfollow.followers.pull(currentUser._id);
      await currentUser.save();
      await userToUnfollow.save();

      res.status(200).json({
        status: "success",
        message: `You have unfollowed ${userToUnfollow.username}`,
      });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

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
  getFollowers = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate('followers', 'username profileImage');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        status: "success",
        followers: user.followers,
      });
    } catch (error) {
      console.error("Error fetching followers:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

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
  getFollowing = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate('following', 'username profileImage');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({
        status: "success",
        following: user.following,
      });
    } catch (error) {
      console.error("Error fetching following:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = { 
  UserController,
  uploadUserPhoto,
  resizeUserPhoto 
};
