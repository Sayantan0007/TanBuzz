const imagekit = require("../configure/imageKit");
const Connection = require("../model/connection");
const User = require("../model/user");
const fs = require("fs");
const userControllers = {
  // get user data
  getUserData: async (req, res) => {
    try {
      const { userId } = req.auth();
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }
      res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  },
  //   update user data
  updateUserdata: async (req, res) => {
    try {
      const { userId } = req.auth();
      let { username, full_name, bio, location } = req.body;

      const tempUser = await User.findById(userId);

      !username && (username = tempUser.username);

      if (username !== tempUser.username) {
        const chkUsernameExists = await User.findOne({ username: username });
        if (chkUsernameExists) {
          username = tempUser.username;
        }
      }

      const updatedData = {
        username,
        bio,
        full_name,
        location,
      };

      const profile = req.files.profile && req.files.profile[0];
      const cover = req.files.cover && req.files.cover[0];

      if (profile) {
        const buffer = fs.readFileSync(profile.path);
        const response = await imagekit.upload({
          file: buffer,
          fileName: profile.originalname,
        });
        const url = await imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "512" },
          ],
        });
        updatedData.profile_picture = url;
      }

      if (cover) {
        const buffer = fs.readFileSync(cover.path);
        const response = await imagekit.upload({
          file: buffer,
          fileName: cover.originalname,
        });
        // response example
        // fileId: "abc123",
        // filePath: "/default-folder/image.jpg",
        // url: "https://ik.imagekit.io/xxx/image.jpg"
        const url = await imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "1280" },
          ],
        });
        updatedData.cover_photo = url;
      }
      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
      });
      res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({ success: false, message: error.message });
    }
  },
  // find users by username,email,location,name
  findUsers: async (req, res) => {
    try {
      const { userId } = req.auth();
      const { inputQuery } = req.body;
      // const inputQuery = inputQuery.trim();

      const allUsers = await User.find({
        $or: [
          { username: new RegExp(inputQuery, "i") }, // i for case insensitive
          { email: new RegExp(inputQuery, "i") },
          { full_name: new RegExp(inputQuery, "i") },
          { location: new RegExp(inputQuery, "i") },
        ],
      });

      const filteredUsers = allUsers.filter((user) => user._id !== userId);
      res.status(200).json({ success: true, users: filteredUsers });
    } catch (error) {
      console.log(error);
      return res.status(401).json({ success: false, message: error.message });
    }
  },
  // follow users
  followUser: async (req, res) => {
    try {
      const { userId } = req.auth();
      const { id } = req.body;

      const user = await User.findById(userId);
      if (user.following.includes(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Already following this user." });
      }
      user.following.push(id);
      await user.save();

      const toUser = await User.findById(id);
      toUser.followers.push(userId);
      await toUser.save();
      res.status(200).json({
        success: true,
        message: "Now you are following this user." + toUser.username,
      });
    } catch (error) {
      console.log(error);
      res.status(401).json({ success: false, message: error.message });
    }
  },
  // unfollow User
  unFollowUser: async (req, res) => {
    try {
      const { userId } = req.auth();
      const { id } = req.body;

      const user = await User.findById(userId);
      user.following = user.following.filter((uid) => uid !== id);
      await user.save();

      const toUser = await User.findById(id);
      toUser.followers = toUser.followers.filter((uid) => uid !== userId);
      await toUser.save();
      res.status(200).json({
        success: true,
        message: "Now you have unfollowed this user." + toUser.username,
      });
    } catch (error) {
      console.log(error);
      res.status(401).json({ success: false, message: error.message });
    }
  },
  // send connection request
  sendConnectionRequest: async (req, res) => {
    try {
      const { userId } = req.auth();
      const { id } = req.body;

      // check if user has sent more than 20 connection rquests in last 24 hours
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const connectionRequestsCount = await Connection.find({
        from_user_id: userId,
        createdAt: { $gte: last24Hours },
      });
      if (connectionRequestsCount.length >= 20) {
        return res.status(400).json({
          success: false,
          message:
            "You have reached the limit of 20 connection requests in last 24 hours. Please try again later.",
        });
      }
      // check if already connected
      const alreadConnected = await Connection.findOne({
        $or: [
          { from_user_id: userId, to_user_id: id },
          { from_user_id: id, to_user_id: userId },
        ],
      });
      if (!alreadConnected) {
        await Connection.create({
          from_user_id: userId,
          to_user_id: id,
        });
        res
          .status(200)
          .json({ success: true, message: "Request sent successfully" });
      } else if (alreadConnected && alreadConnected.status == "accepted") {
        res.status(400).json({
          success: false,
          message: "You are already connected to this user",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Connection request is pending",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(401).json({ success: false, message: error.message });
    }
  },
  // get User Connections
  getUserConnections: async (req, res) => {
    try {
      const { userId } = req.auth;
      const user = await User.findById(userId).populate(
        "following followers connections",
      );
      const connections = user.connections;
      const followers = user.followers;
      const following = user.following;
      const pendinConnectionRequests = (
        await Connection.find({
          to_user_id: userId,
          status: "pending",
        }).populate("from_user_id")
      ).map((conn) => conn.from_user_id);
      return res.status(200).json({
        success: true,
        connections,
        followers,
        following,
        pendinConnectionRequests,
      });
    } catch (error) {
      console.log(error);
      res.status(401).json({ success: false, message: error.message });
    }
  },
  // accept connection request
  acceptConnectionRequest: async (req, res) => {
    try {
      const { userId } = req.auth();
      const { id } = req.body;
      const connectionRequest = await Connection.findOne({
        from_user_id: id,
        to_user_id: userId,
        status: "pending",
      });
      if(!connectionRequest){
        return  res.status(400).json({ success: false, message: "Connection request not found." });
      }
      const user = await User.findById(userId);
      user.connections.push(id);
      await user.save();
      
      const toUser = await User.findById(id);
      toUser.connections.push(userId);
      await toUser.save();

      connectionRequest.status = "accepted";
      await connectionRequest.save();

      res.status(200).json({
        success: true,
        message: "Connection request accepted. You are now connected to " + toUser.username,
      });
    } catch (error) {
      console.log(error);
      res.status(401).json({ success: false, message: error.message });
    }
  },
};
module.exports = userControllers;
