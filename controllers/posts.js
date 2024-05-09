const Post = require("../models/posts");
const User = require("../models/users");
const handleError = require("../services/handleError");
const handleSuccess = require("../services/handleSuccess");
const appError = require("../services/appError");

const postController = {
  getPosts: async (req, res, next) => {
    // 排序
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt";
    // 關鍵字搜尋
    let q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    let posts = await Post.find(q)
      .populate({
        path: "user",
        select: "name photo",
      })
      .sort(timeSort);
    handleSuccess(res, posts);
  },
  createPost: async (req, res, next) => {
    let { user, content } = req.body;
    // 自訂定錯誤
    if (user === undefined) next(appError(400, "無此 user 資料", next));
    if (content === undefined) next(appError(400, "無填寫 content 資料", next));
    let post = await Post.create({
      user,
      content,
    });
    handleSuccess(res, post);
  },
  deletePosts: async (req, res, next) => {
    let post = await Post.deleteMany({});
    handleSuccess(res, post);
  },
  deletePost: async (req, res, next) => {
    let { id } = req.params;
    if (id === undefined) return next(appError(400, "無此 貼文id", next));
    let post = await Post.findByIdAndDelete(id);
    handleSuccess(res, post);
  },
  updatePost: async (req, res, next) => {
    let { id } = req.params;
    if (id === undefined) return next(appError(400, "無此 貼文id", next));
    let { name, content, image } = req.body;
    let post = await Post.findByIdAndUpdate(id, {
      name,
      content,
      image,
    });
    handleSuccess(res, post);
  },
};
module.exports = postController;
