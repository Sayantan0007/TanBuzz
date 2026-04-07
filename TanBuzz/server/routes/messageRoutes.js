const express = require("express");
const {
  sseController,
  messageController,
} = require("../controllers/messageController");
const protect = require("../middleware/auth");
const uploads = require("../configure/multer");
const msgRoute = express.Router();

msgRoute.post("/sse-token", protect, messageController.createSseToken);
msgRoute.get("/sse", sseController);
msgRoute.post("/send", protect, uploads.single("image"), messageController.sendMessage);
msgRoute.post("/get", protect, messageController.getMessages);
msgRoute.get("/recent", protect, messageController.getRecentMsgs);

module.exports = msgRoute;
