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
      type: mongoose.Schema.ObjectId, // 引用 user model 中資料 _id
      required: [true, "貼文姓名未填寫"],
    },
    likes: [
      {
        ref: "user",
        type: mongoose.Schema.ObjectId,
      },
    ],
    photos: [String],
  },
  {
    versionKey: false,
    // 使用下面設定的副作用 : 會新增一個虛擬 id 屬性
    // 解決方法 : 新增 transform 方法 在轉換的時候 移除 id 屬性
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.id;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.id;
      },
    },
  }
);

// 增加 comment 虛擬欄位資料
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

const Post = mongoose.model("post", postSchema);
module.exports = Post;
