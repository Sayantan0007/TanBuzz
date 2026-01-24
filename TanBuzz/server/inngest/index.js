const { Inngest } = require("inngest");
const User = require("../model/user");

// Create a client to send and receive events
const inngest = new Inngest({ id: "tanbuzz-app" });

// Inngest Function to save user data to database
const syncUsercreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
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
// Create an empty array where we'll export future Inngest functions
const functions = [syncUsercreation, syncUserUpdation, syncUserDeletion];
module.exports = { inngest, functions };
