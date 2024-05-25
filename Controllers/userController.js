const User = require("../Model/userModel");
const multer = require('multer');
const sharp = require('sharp');

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

  getUserData = (req, res, next) => {
    res.status(200).json({
      message: "success",
      user: req.user,
    });
  };

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
}

module.exports = { 
  UserController,
  uploadUserPhoto,
  resizeUserPhoto 
};
