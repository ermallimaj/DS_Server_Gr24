class UserController{
    getUserData = (req, res, next) => {
        res.status(200).json({
          message: "success",
          user: req.user,
        });
      };
}

module.exports = UserController;

