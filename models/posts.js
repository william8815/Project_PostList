const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Content 未填寫"],
    },
    image: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      ref: "user", // 連結 指定 model 的資料
      type: mongoose.Schema.ObjectId, // 引用 user model 中資料 id
      required: [true, "貼文姓名未填寫"],
    },
    likes: {
      type: Number,
      default: 0,
    },
    photos: [String],
  },
  {
    versionKey: false,
  }
);
const Post = mongoose.model("post", postSchema);
module.exports = Post;
