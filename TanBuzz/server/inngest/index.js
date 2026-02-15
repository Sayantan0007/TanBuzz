const { Inngest } = require("inngest");
const User = require("../model/user");
const Connection = require("../model/connection");
const sendEmail = require("../configure/nodemailer");
const Story = require("../model/story");
const Message = require("../model/message");

// Create a client to send and receive events
const inngest = new Inngest({ id: "tanbuzz-app" });

// Inngest Function to save user data to database
const syncUsercreation = inngest.createFunction(
  { id: "sync-user-from-clerk-create" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    let username = email_addresses[0].email_address.split("@")[0];

    // check availability of username in DB
    const checkUser = await User.findOne({ username: username });
    if (checkUser) {
      username = username + Math.floor(Math.random() * 10000);
    }
    const newUser = new User({
      _id: id,
      full_name: first_name + " " + last_name,
      email: email_addresses[0].email_address,
      username: username,
      profile_picture: image_url,
    });
    await newUser.save();
  },
);
const syncUserUpdation = inngest.createFunction(
  { id: "sync-user-from-clerk-update" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userUpdate = {
      full_name: first_name + " " + last_name,
      email: email_addresses[0].email_address,
      profile_picture: image_url,
    };
    await User.findByIdAndUpdate(id, userUpdate);
  },
);

const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-from-clerk-delete" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await User.findByIdAndDelete(id);
  },
);

// Inngest function to send Reminder when a new connection request is added
const sendConnectionRequestReminder = inngest.createFunction(
  { id: "send-connection-request-reminder" },
  { event: "app/connection-request" },
  async ({ event, step }) => {
    const { connectionId } = event.data;

    await step.run("send-connection-request-email", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "from_user_id to_user_id",
      );
      if (!connection) {
        throw new Error("Connection not found");
      }
      const subject = "👋 New Connection Request";
      const body = `<div style="font-family: Arial, sans-serif; padding:20px;">
      <p>Hi ${connection.to_user_id.full_name},</p>
        <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}.</p>
        <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color: #10b981">here</a> to view the request.</p>
        <p>Best,<br/>TanBuzz Team</p>
        </div>`;
      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body,
      });
    });

    const after24hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil("connection-request-reminder-email", after24hours);
    await step.run("send-connection-request-reminder-email", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "from_user_id to_user_id",
      );
      if (!connection) {
        throw new Error("Connection not found"); //If the connection value is null
      }
      if (connection.status === "accepted") {
        return { message: "Connection already accepted, no reminder needed." };
      }
      const subject = "⏰ Reminder: Pending Connection Request";
      const body = `<div style="font-family: Arial, sans-serif; padding:20px;">
      <p>Hi ${connection.to_user_id.full_name},</p>
        <p>This is a reminder that you have a pending connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}.</p>
        <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color: #10b981">here</a> to view the request.</p>
        <p>Best,<br/>TanBuzz Team</p>
        </div>`;
      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body,
      });
    });
  },
);
// delete story after 24 hours of creation
const deleteStroy = inngest.createFunction(
  { id: "delete-story-after-24hours" },
  { event: "app/story.delete" },
  async ({ event, step }) => {
    const { storyId } = event.data;
    const after24hrs = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil("delete-story", after24hrs);
    await step.run("delete-story", async () => {
      await Story.findByIdAndDelete(storyId);
      return { message: "Story deleted successfully" };
    });
  },
);
// send notification of unseen messages
const sendNotificationOfUnseenMsgs = inngest.createFunction(
  { id: "send-notification-of-unseen-messages" },
  { cron: "TZ=Asia/Kolkata 0 9 * * *" }, //every day at 9 AM IST
  async ({ step }) => {
    const messages = await Message.find({ seen: false }).populate("to_user_id");
    const unseenCount = {};
    messages.map((msg) => {
      unseenCount[msg.to_user_id._id] =
        (unseenCount[msg.to_user_id._id] || 0) + 1;
    });
    for (const userId in unseenCount) {
      const user = await User.findById(userId);
      const subject = `🔔 You have ${unseenCount[userId]} unread messages on TanBuzz`;
      const body = `<div style="font-family: Arial, sans-serif; padding:20px;">
        <h3>Hi ${user.full_name},</h3>
        <p>You have ${unseenCount[userId]} unread messages on TanBuzz.</p>
        <p>Click <a href="${process.env.FRONTEND_URL}/messages" style="color: #10b981">here</a> to view them.</p>
        <p>Best,<br/>TanBuzz Team - Stay Connected</p>
      </div>`;
      await sendEmail({
        to: user.email,
        subject,
        body,
      });
    }
    return { message: "Notification sent for unseen messages" };
  },
);
// Create an empty array where we'll export future Inngest functions
const functions = [
  syncUsercreation,
  syncUserUpdation,
  syncUserDeletion,
  sendConnectionRequestReminder,
  deleteStroy,
  sendNotificationOfUnseenMsgs,
];
module.exports = { inngest, functions };
