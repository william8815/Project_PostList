const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "comment can not be empty!"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      require: ["true", "user must belong to a post."],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "post",
      require: ["true", "comment must belong to a post."],
    },
  },
  {
    versionKey: false,
  }
);

// 在使用 mongoose find 相關語法 取得 comment 對應資料前，先將 user 欄位資料展開 (沒這段僅顯示 userId)
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name _id createdAt",
  });
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
