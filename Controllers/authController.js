const User = require("../Model/userModel");

class AuthController {
  async signup(req, res, next) {
    try {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      });
      const savedUser = await newUser.save();
      res.status(201).json({
        status: "Success",
        message: "User created successfully",
        user: savedUser,
      });
    } catch (error) {
      console.error("Error signing up:", error);
      res.status(500).json({
        success: false,
        message: "Could not create user. Please try again later.",
      });
    }
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (user) {
        const isPasswordCorrect = await user.comparePassword(password);
        if (isPasswordCorrect) {
          res.status(200).json({
            success: true,
            message: "Login successful",
            user,
          });
        } else {
          res.status(401).json({
            success: false,
            message: "Invalid password",
          });
        }
      } else {
        res.status(401).json({
          success: false,
          message: "User not found",
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({
        success: false,
        message: "Could not log in. Please try again later.",
      });
    }
  }
}

module.exports = AuthController;
