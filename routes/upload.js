const express = require("express");
const router = express.Router();
const handleErrorAsync = require("../services/handleErrorAsync");
const upload = require("../services/image");

const uploadController = require("../controllers/upload");
// 下方的 req.files 是由 middleware: multer 的 any() 語法產生出
router.post("/file", upload, handleErrorAsync(uploadController.uploadImage));
module.exports = router;
