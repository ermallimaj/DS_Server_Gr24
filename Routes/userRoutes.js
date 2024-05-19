const express = require("express");
const AuthController = require('../Controllers/authController');
const authController = new AuthController();
const UserController = require("../Controllers/userController");
const userController = new UserController();
const router = express.Router();


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get("/get-user-data",authController.protect,  userController.getUserData);
router.get("/user/:id", authController.protect, userController.getUserById);

module.exports = router;

