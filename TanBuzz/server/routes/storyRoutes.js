const express = require("express");
const protect = require("../middleware/auth");
const storyController = require("../controllers/storyController");
const uploads = require("../configure/multer");
const route = express.Router();

route.get("/get", protect, storyController.getStories);
route.post(
  "/add",
  uploads.single("story"),
  protect,
  storyController.addStory,
);
module.exports = route;