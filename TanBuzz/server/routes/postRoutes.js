const express = require("express");
const router = express.Router();
const postControllers = require("../controllers/postController");
const uploads = require("../configure/multer");
const protect = require("../middleware/auth");

router.post(
  "/add",
  uploads.array("images", 4),
  protect,
  postControllers.addPost,
);
router.get("/feed", protect, postControllers.getPosts);
router.post("/like", protect, postControllers.likePosts);

module.exports = router;
