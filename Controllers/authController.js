const { promisify } = require("util");
const User = require("../Model/userModel");
const jwt = require("jsonwebtoken");

class AuthController {
  signToken(id) {
    return jwt.sign({ id }, "my_secret", {
      expiresIn: "15d",
    });
  }

  createSendToken(user, statusCode, res) {
    const token = this.signToken(user._id);

    const cookieOptions = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
      success: true,
      token,
      data: {
        user,
      },
    });
  }

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

  login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (user) {
        const isPasswordCorrect = await user.comparePassword(password);
        if (isPasswordCorrect) {
          this.createSendToken(user, 200, res);
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
  };
  protect = async (req, res, next) => {
    // if (req.path === "/logout") {
    //   return next();
    // }
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new Error(
          `You are not logged in! Please log in to get access. ${token}`
        )
      );
    }

    const decoded = await promisify(jwt.verify)(token, "my_secret");

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      console.log(currentUser);

      return next(
        new Error("You are not logged in! Please log in to get access.")
      );
    }

    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    //   return next("User recently changed password! Please log in again.");
    // }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  };
}

module.exports = AuthController;