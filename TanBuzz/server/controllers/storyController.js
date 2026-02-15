const imagekit = require("../configure/imageKit");
const fs = require("fs");
const Story = require("../model/story");
const User = require("../model/user");
const { inngest } = require("../inngest/index");
const storyController = {
  // add user story
  addStory: async (req, res) => {
    try {
      const { userId } = req.auth();
      const { content, media_type, background_color } = req.body;
      const media = req.file ? req.file : null;
      let media_url = "";

      if (media_type === "image" || media_type === "video") {
        if (!media) {
          return res.status(400).json({
            success: false,
            message: "Media file is required for image or video type",
          });
        }
        const fileBuffer = await fs.promises.readFile(media.path);
        const fileName = media.originalname;
        const response = await imagekit.upload({
          file: fileBuffer,
          fileName: fileName,
          folder: "story",
        });
        const url = await imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "720" },
          ],
        });
        media_url = url;
      }
      const newStory = await Story.create({
        user: userId,
        content,
        media_url,
        media_type,
        background_color,
      });
      // schedule story deletion after 24 hours using inngest
      inngest.send({
        name: "app/story.delete",
        data: {
          storyId: newStory._id,
        },
      });
      res
        .status(201)
        .json({ success: true, message: "Story added successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  // get user stories
  getStories: async (req, res) => {
    try {
      const { userId } = req.auth();
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "User is not authenticated" });
      }
      const allStoryIds = [userId, ...user.following, ...user.connections];
      const stories = await Story.find({ user: { $in: allStoryIds } })
        .populate("user view_count")
        .sort({ createdAt: -1 });
      res.status(200).json({ success: true, story: stories });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
module.exports = storyController;
