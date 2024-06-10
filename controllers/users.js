const User = require("../models/users");
const appError = require("../services/appError");
const handleSuccess = require("../services/handleSuccess");
const validator = require("validator");
const bcrypt = require("bcrypt");
const Post = require("../models/posts");

const { generateSendJWT } = require("../services/auth");
const userController = {
  getUsers: async (req, res, next) => {
    let users = await User.find();
    handleSuccess(res, users);
  },
  signup: async (req, res, next) => {
    // 抓取 email、密碼、密碼確認
    let { name, email, password, confirmPassword } = req.body;
    // 內容不能為空
    if (!name) return next(appError(400, "名稱 不能為空", next));
    if (!email) return next(appError(400, "email 不能為空", next));
    let hasSameEamil = await User.findOne({ email: email });
    if (hasSameEamil) return next(appError(400, "email 已被註冊", next));
    if (!password) return next(appError(400, "密碼 不能為空", next));
    if (!confirmPassword) return next(appError(400, "密碼確認 不能為空", next));
    // 密碼確認
    if (password !== confirmPassword)
      return next(appError(400, "密碼不一致", next));
    // 密碼 8 碼以上
    if (!validator.isLength(password, { min: 8 }))
      return next(appError(400, "密碼不能低於 8 碼", next));
    // 確認 email 格式
    if (!validator.isEmail(email))
      return next(appError(400, "Email 格式不正確", next));
    // 確認 email 是否已註冊過

    // 密碼加密
    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      email,
      password,
      name,
    });
    // 註冊成功
    // 產生 & 回傳 JWT token
    generateSendJWT(newUser, 201, res);
  },
  login: async (req, res, next) => {
    // 取得 email password
    let { email, password } = req.body;
    // 內容不能為空
    if (!email) return next(appError(400, "帳號 欄位不能為空", next));
    if (!password) return next(appError(400, "密碼 欄位不能為空", next));
    // 帳號尚未註冊
    let unSign = await User.findOne({ email: email });
    if (!unSign) return next(appError(400, "此帳號尚未被註冊", next));
    // 將用戶的 password 顯示出來 做比對
    const user = await User.findOne({ email }).select("+password");
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) return next(appError(400, "您輸入的密碼不正確", next));
    // 登入成功
    // 產生 & 回傳 JWT token
    generateSendJWT(user, 200, res);
  },
  getProfile: async (req, res, next) => {
    res.send({
      status: "success",
      user: req.user,
    });
  },
  updateProfile: async (req, res, next) => {
    let { name, sex, photo } = req.body;
    // 不能為空值
    if (!name) return next(appError(400, "名稱欄位不能為空", next));
    let newUserProfile = {
      name,
      sex,
      photo,
    };
    const user = await User.findByIdAndUpdate(req.user.id, newUserProfile, {
      runValidators: true,
    });
    res.send({
      status: "success",
      user,
    });
  },
  updatePassword: async (req, res, next) => {
    let { password, confirmPassword } = req.body;
    // 不能為空值
    if (!password) return next(appError(400, "密碼欄位不能為空", next));
    if (!confirmPassword)
      return next(appError(400, "確認密碼欄位不能為空", next));
    // 密碼高於 8 碼
    if (!validator.isLength(password, { min: 8 }))
      return next(appError(400, "密碼不能低於 8 碼", next));
    // 密碼確認
    if (password !== confirmPassword)
      return next(appError(400, "新密碼不一致", next));
    // 密碼加密
    password = await bcrypt.hash(password, 12);
    // 更新用戶密碼
    const user = await User.findByIdAndUpdate(req.user.id, { password });
    // 產生 & 回傳 JWT token
    generateSendJWT(user, 200, res);
  },
  getLikeList: async (req, res, next) => {
    const likeList = await Post.find({
      likes: { $in: [req.user.id] },
    }).populate({
      path: "user",
      select: "name _id",
    });
    res.status(200).json({
      status: "success",
      likeList,
    });
  },
  createFollow: async (req, res, next) => {
    if (req.params.id === req.user.id) {
      return next(appError(401, "您無法追蹤自己", next));
    }
    await User.updateOne(
      {
        _id: req.user.id,
        "following.user": { $ne: req.params.id },
      },
      {
        $addToSet: { following: { user: req.params.id } },
      }
    );
    await User.updateOne(
      {
        _id: req.params.id,
        "followers.user": { $ne: req.user.id },
      },
      {
        $addToSet: { followers: { user: req.user.id } },
      }
    );
    res.status(200).json({
      status: "success",
      message: "您已成功追蹤！",
    });
  },
  deleteFollow: async (req, res, next) => {
    if (req.params.id === req.user.id) {
      return next(appError(401, "您無法取消追蹤自己", next));
    }
    await User.updateOne(
      {
        _id: req.user.id,
      },
      {
        $pull: { following: { user: req.params.id } },
      }
    );
    await User.updateOne(
      {
        _id: req.params.id,
      },
      {
        $pull: { followers: { user: req.user.id } },
      }
    );
    res.status(200).json({
      status: "success",
      message: "您已成功取消追蹤！",
    });
  },
};
module.exports = userController;
