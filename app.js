const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// 程式出現重大錯誤時，補捉程式錯誤
process.on("uncaughtException", (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error("Uncaughted Exception！");
  console.error(err); // 錯誤物件 (err.name、err.message)
  console.log(err.stack); // 錯誤堆疊 (切記: 不能將此錯誤訊息傳給使用者看)
  process.exit(1); // 錯誤狀態
});

require("./connections/posts");
require("./connections/passport");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const uploadRouter = require("./routes/upload");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/upload", uploadRouter);
// 404 錯誤
app.use((req, res, next) => {
  res.status(404);
  res.send({
    status: "error",
    message: "無此路由資訊",
  });
});
// product env 錯誤處理
// develop env 錯誤處理
// 錯誤處理
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  // dev
  if (process.env.NODE_ENV === "dev") {
    res.status(err.statusCode).send({
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  // product
  if (err.name === "ValidationError") {
    err.message = "資料欄位未填寫正確，請重新輸入！";
    err.isOperational = true;
  }
  if (err.name === "CastError") {
    err.message = `id ${err.value} 格式錯誤，請重新輸入`;
    err.isOperational = true;
  }
  if (err.name === "JsonWebTokenError") {
    err.message = "token 無效或過期，請重新登入!";
    err.isOperational = true;
  }
  if (err.isOperational) {
    res.status(err.statusCode).send({
      message: err.message,
    });
  } else {
    // log 紀錄
    console.error("出現重大錯誤", err);
    // 送出罐頭預設訊息
    res.status(500).json({
      status: "error",
      message: "系統錯誤，請恰系統管理員",
    });
  }
});

// 捕捉 Promise 的 catch (沒有寫 catch 出錯會到這來)
process.on("unhandledRejection", (reason, promise) => {
  console.error("未捕捉到的 rejection：", promise, "原因：", reason);
  // 記錄於 log 上
});

module.exports = app;
