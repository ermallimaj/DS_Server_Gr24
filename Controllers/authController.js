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

  /**
   * @swagger
   * /auth/signup:
   *   post:
   *     summary: Sign up a new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: John Doe
   *               email:
   *                 type: string
   *                 example: john@example.com
   *               username:
   *                 type: string
   *                 example: johndoe
   *               password:
   *                 type: string
   *                 example: password123
   *     responses:
   *       201:
   *         description: User created successfully
   *       500:
   *         description: Could not create user. Please try again later.
   */
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

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Log in a user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *                 example: johndoe
   *               password:
   *                 type: string
   *                 example: password123
   *     responses:
   *       200:
   *         description: User logged in successfully
   *       401:
   *         description: Invalid username or password
   *       500:
   *         description: Could not log in. Please try again later.
   */
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

  /**
   * @swagger
   * /auth/protect:
   *   get:
   *     summary: Protect a route
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Route protected successfully
   *       401:
   *         description: You are not logged in! Please log in to get access.
   */
  protect = async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not logged in! Please log in to get access.",
      });
    }

    try {
      const decoded = await promisify(jwt.verify)(token, "my_secret");

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return res.status(401).json({
          success: false,
          message: "The user belonging to this token does no longer exist.",
        });
      }

      req.user = currentUser;
      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(401).json({
        success: false,
        message: "You are not logged in! Please log in to get access.",
      });
    }
  };
}

module.exports = AuthController;
