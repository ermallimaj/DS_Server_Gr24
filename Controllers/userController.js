const User = require("../Model/userModel");

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

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          name: `${firstName} ${lastName}`,
          username,
          email,
        },
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
}

module.exports = UserController;
