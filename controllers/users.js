const User = require("../models/users");
const appError = require("../services/appError");
const handleError = require("../services/handleError");
const handleSuccess = require("../services/handleSuccess");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
    if (!name) next(appError(400, "名稱 不能為空", next));
    if (!email) next(appError(400, "email 不能為空", next));
    if (!password) next(appError(400, "密碼 不能為空", next));
    if (!confirmPassword) next(appError(400, "密碼確認 不能為空", next));
    // 密碼確認
    if (password !== confirmPassword) next(appError(400, "密碼不一致", next));
    // 密碼 8 碼以上
    if (!validator.isLength(password, { min: 8 }))
      next(appError(400, "密碼不能低於 8 碼", next));
    // 確認 email 格式
    if (!validator.isEmail(email))
      next(appError(400, "Email 格式不正確", next));
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
    if (!email) next(appError(400, "帳號 欄位不能為空", next));
    if (!password) next(appError(400, "密碼 欄位不能為空", next));
    // 將用戶的 password 顯示出來 做比對
    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) return next(appError(400, "您輸入的密碼不正確", next));
    // 登入成功
    // 產生 & 回傳 JWT token
    generateSendJWT(user, 200, res);
  },
  getProfile: (req, res, next) => {
    res.send({
      status: "success",
      user: req.user,
    });
  },
  updatePassword: async (req, res, next) => {
    let { password, confirmPassword } = req.body;
    // 不能為空值
    if (!password) next(appError(400, "密碼欄位不能為空", next));
    if (!confirmPassword) next(appError(400, "確認密碼欄位不能為空", next));
    // 密碼高於 8 碼
    if (!validator.isLength(password, { min: 8 }))
      next(appError(400, "密碼不能低於 8 碼", next));
    // 密碼確認
    if (password !== confirmPassword) next(appError(400, "新密碼不一致", next));
    // 密碼加密
    password = await bcrypt.hash(password, 12);
    // 更新用戶密碼
    const user = await User.findByIdAndUpdate(req.user.id, { password });
    // 產生 & 回傳 JWT token
    generateSendJWT(user, 200, res);
  },
};
module.exports = userController;
