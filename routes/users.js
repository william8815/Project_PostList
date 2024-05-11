var express = require("express");
var router = express.Router();
const userController = require("../controllers/users");
const handleErrorAsync = require("../services/handleErrorAsync");

const { isAuth } = require("../services/auth");

router.get("/", handleErrorAsync(userController.getUsers));
router.post("/signup", handleErrorAsync(userController.signup));
router.post("/login", handleErrorAsync(userController.login));
router.get("/profile/", isAuth, handleErrorAsync(userController.getProfile));
router.patch(
  "/profile/",
  isAuth,
  handleErrorAsync(userController.updateProfile)
);
router.post(
  "/updatePassword",
  isAuth,
  handleErrorAsync(userController.updatePassword)
);

module.exports = router;
