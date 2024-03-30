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
}

module.exports = AuthController;
