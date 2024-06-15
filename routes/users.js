var express = require("express");
var router = express.Router();
const userController = require("../controllers/users");
const handleErrorAsync = require("../services/handleErrorAsync");
const { isAuth, generateUrlJWT } = require("../services/auth");
const passport = require("passport");

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
// google 登入
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"], // 要傳回來的資訊
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false, // 前後端分離須做此設定
    failureRedirect: "/login", // 取消 google 登入導回路由
  }),
  (req, res) => {
    // 生成 token 並導向前端指定頁面
    generateUrlJWT(req.user, res);
  }
);
router.get(
  "/getLikeList",
  isAuth,
  handleErrorAsync(userController.getLikeList)
);
router.post(
  "/:id/follow",
  isAuth,
  handleErrorAsync(userController.createFollow)
);
router.delete(
  "/:id/unfollow",
  isAuth,
  handleErrorAsync(userController.deleteFollow)
);
router.get("/following", isAuth, handleErrorAsync(userController.getFollowing));
router.get("/followers", isAuth, handleErrorAsync(userController.getFollower));

module.exports = router;
