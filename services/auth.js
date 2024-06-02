const User = require("../models/users");
const appError = require("../services/appError");
const jwt = require("jsonwebtoken");
const handleErrorAsync = require("../services/handleErrorAsync");
const isAuth = handleErrorAsync(async (req, res, next) => {
  // 確認 token 是否存在 (req.headers.Authorization)
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next(appError(401, "你尚未登入!!", next));
  // 驗證 token => 成功取得 user id
  const decode = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
  // 取得用戶資料
  const currentUser = await User.findById(decode.id);
  req.user = currentUser;
  next();
});

const generateSendJWT = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = undefined;
  res.status(statusCode).send({
    status: "success",
    user: {
      token,
      name: user.name,
    },
  });
};
const generateUrlJWT = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = undefined;
  res.redirect(`/callback?token=${token}&name=${user.name}`);
};

module.exports = { isAuth, generateSendJWT, generateUrlJWT };
