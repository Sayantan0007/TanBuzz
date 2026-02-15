const Post = require("../model/post");
const fs = require("fs");
const imagekit = require("../configure/imageKit");
const User = require("../model/user");
const postControllers = {
  //add post
  addPost: async (req, res) => {
    try {
      const { userId } = req.auth();
      let { content, post_type } = req.body;
      const images = req.files;
      let image_urls = [];
      if (images?.length) {
        image_urls = await Promise.all(
          images.map(async (image) => {
            const fileBuffer = fs.readFileSync(image.path);
            const response = await imagekit.upload({
              file: fileBuffer,
              fileName: image.originalname,
              folder: "posts",
            });
            const url = await imagekit.url({
              path: response.filePath,
              transformation: [
                { quality: "auto" },
                { format: "webp" },
                { width: "1280" },
              ],
            });
            return url;
          }),
        );
      }
      await Post.create({
        user: userId,
        content,
        image_urls,
        post_type,
      });
      return res
        .status(200)
        .json({ success: true, message: "Post created successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  // get posts
  getPosts: async (req, res) => {
    try {
      const { userId } = req.auth();
      const user = await User.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // user can see posts of his own, following and connections
      const allUserIds = [userId, ...user.following, ...user.connections];

      const posts = await Post.find({
        user: { $in: allUserIds },
      })
        .populate("user")
        .sort({ createdAt: -1 }); // Sort by newest first

      return res.status(200).json({ success: true, posts });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  // like post
  likePosts: async (req, res) => {
    try {
      const { userId } = req.auth();
      const { postId } = req.body;
      const post = await Post.findById(postId);

      if (!post) {
        return res
          .status(404)
          .json({ success: false, message: "Post not found" });
      }
      if (post.likes_count.includes(userId)) {
        post.likes_count = post.likes_count.filter((uid) => uid !== userId);
        await post.save();
        return res
          .status(200)
          .json({ success: true, message: "Post unliked successfully" });
      } else {
        post.likes_count.push(userId);
        await post.save();
        return res
          .status(200)
          .json({ success: true, message: "Post liked successfully" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
module.exports = postControllers;