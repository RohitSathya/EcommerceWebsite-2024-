const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    message: { type: String, required: true },
    sender: { type: String, enum: ['admin', 'user'], required: true }, // Who sent the message
    username: String, // For displaying user/admin names
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
