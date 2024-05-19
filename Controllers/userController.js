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
}

module.exports = UserController;
