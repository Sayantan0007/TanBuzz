const fs = require("fs");
const imagekit = require("../configure/imageKit");
const Message = require("../model/message");
// create an empty object to store SS Event connections
const connections = {};

// controller function for the SSE endpoint
const sseController = (req, res) => {
  const { userId } = req.params;
  console.log("New Client Connected : ", userId);

  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Store the connection
  connections[userId] = res;

  // Send a welcome message to the client
  res.write(`data: Welcome, User ${userId}!\n\n`);

  // Handle client disconnection
  req.on("close", () => {
    console.log("Client disconnected:", userId);
    delete connections[userId];
  });
};

const messageController = {
  // send message
  sendMessage: async (req, res) => {
    try {
      const { userId } = req.auth();
      const { to_user_id, content } = req.body;
      const image = req.file;
      let media_url = "";
      let msg_type = text ? "text" : "image";
      if (msg_type === "image") {
        const fileBuffer = fs.readFileSync(image.path);
        const response = await imagekit.upload({
          file: fileBuffer,
          fileName: image.originalname,
          folder: "messages",
        });
        const url = imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "1280" },
          ],
        });
        media_url = url;
      }
      const newMessage = await Message.create({
        from_user_id: userId,
        to_user_id,
        content,
        msg_type,
        media_url,
      });
      res
        .status(201)
        .json({ success: true, message: "Message sent", data: newMessage });

      // send message to the recipient using SSE
      const messageWithUserData = await Message.findById(
        newMessage._id,
      ).populate("from_user_id");
      if (connections[to_user_id]) {
        connections[to_user_id].write(
          `data: ${JSON.stringify(messageWithUserData)}\n\n`,
        );
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },
  // get chat messages
  getMessages: async (req, res) => {
    try {
      const { userId } = req.auth();
      const { to_user_id } = req.body;

      // 1️⃣ Mark messages as seen first
      await Message.updateMany(
        {
          from_user_id: to_user_id, //update where sender is other user and receiver is me and seen is false
          to_user_id: userId,
          seen: false,
        },
        { $set: { seen: true } },
      );

      // 2️⃣ Fetch updated messages
      const messages = await Message.find({
        $or: [
          { from_user_id: userId, to_user_id },
          { from_user_id: to_user_id, to_user_id: userId },
        ],
      }).sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },
  // get recent chats
  getRecentMsgs: async (req, res) => {
    try {
      const { userId } = req.auth();
      const recentMsgs = await Message.find({ to_user_id: userId })
        .populate("from_user_id to_user_id", "name profile_pic")
        .sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: recentMsgs });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
module.exports = { sseController, messageController };
