const express = require("express");
const AuthController = require('../Controllers/authController')
const authController = new AuthController()
const router = express.Router();


router.post('/signup', authController.signup)

module.exports = router;