const express = require("express");
const route = express.Router();
const UC = require("../controllers/userController");
const protect = require("../middleware/auth");
const uploads = require("../configure/multer");
const { messageController } = require("../controllers/messageController");

route.get("/data", protect, UC.getUserData);
route.post(
  "/update",
  uploads.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  protect,
  UC.updateUserdata,
);
route.post("/search", protect, UC.findUsers);
route.post("/follow", protect, UC.followUser);
route.post("/unfollow", protect, UC.unFollowUser);
route.post("/connect", protect, UC.sendConnectionRequest);
route.post("/accept", protect, UC.acceptConnectionRequest);
route.get("/getconnections", protect, UC.getUserConnections);
route.post("/viewprofile", protect, UC.viewProfile);
route.get("/recent-messages", protect, messageController.getRecentMsgs);

module.exports = route;
