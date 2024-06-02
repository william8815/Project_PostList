const express = require("express");
const router = express.Router();
const handleErrorAsync = require("../services/handleErrorAsync");
const upload = require("../services/image");
const { isAuth } = require("../services/auth");

const uploadController = require("../controllers/upload");
// 下方的 req.files 是由 middleware: multer 的 any() 語法產生出
router.post(
  "/file",
  isAuth,
  upload,
  handleErrorAsync(uploadController.uploadImage)
);
module.exports = router;
