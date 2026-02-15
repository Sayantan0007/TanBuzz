const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
  {
    from_user_id: { type: String, ref: "User", required: true },
    to_user_id: { type: String, ref: "User", required: true },
    content: { type: String },
    msg_type: { type: String, enum: ["text", "image"] },
    media_url: { type: String },
    seen: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    minimize: false,
  },
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
