const express = require("express");
const { sseController, messageController } = require("../controllers/messageController");
const protect = require("../middleware/auth");
const uploads = require("../configure/multer");
const msgRoute = express.Router();

msgRoute.get("/sse/:userId", sseController);
msgRoute.post("/send",uploads.single("image"),protect, messageController.sendMessage);
msgRoute.post("/get",protect, messageController.getMessages);

module.exports = msgRoute;