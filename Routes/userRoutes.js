const express = require("express");
const AuthController = require('../Controllers/authController');
const authController = new AuthController();
const { UserController, uploadUserPhoto, resizeUserPhoto } = require("../Controllers/userController");
const userController = new UserController();

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get("/get-user-data", authController.protect, userController.getUserData);
router.get('/user/all', authController.protect, userController.getAllUsers);
router.get('/user/:id', authController.protect, userController.getUserById);
router.put('/edit-profile', authController.protect, uploadUserPhoto, resizeUserPhoto, userController.updateUserData);

module.exports = router;
