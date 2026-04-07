const express = require("express");
const router = express.Router();
const postControllers = require("../controllers/postController");
const uploads = require("../configure/multer");
const protect = require("../middleware/auth");

router.post(
  "/add",
  protect,
  uploads.array("images", 4),
  postControllers.addPost,
);
router.get("/feed", protect, postControllers.getPosts);
router.post("/like", protect, postControllers.likePosts);
router.put("/update", protect, uploads.array("images", 4), postControllers.updatePost);
router.delete("/delete", protect, postControllers.deletePost);

module.exports = router;
