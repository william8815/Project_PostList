var express = require("express");
var router = express.Router();
const postController = require("../controllers/posts");
const handleErrorAsync = require("../services/handleErrorAsync");
const { isAuth } = require("../services/auth");

router.get("/", handleErrorAsync(postController.getPosts));
router.post("/", isAuth, handleErrorAsync(postController.createPost));
router.delete("/", isAuth, handleErrorAsync(postController.deletePosts));
router.delete("/:id", isAuth, handleErrorAsync(postController.deletePost));
router.patch("/:id", isAuth, handleErrorAsync(postController.updatePost));
router.post("/:id/likes", isAuth, handleErrorAsync(postController.createLikes));
router.delete(
  "/:id/likes",
  isAuth,
  handleErrorAsync(postController.deleteLikes)
);

module.exports = router;
