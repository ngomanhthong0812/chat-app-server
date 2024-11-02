const MessageModel = require("../models/MessageModel");

async function getMessages(user_id, chat_id) {
  try {
    // Lấy tin nhắn giữa hai người dùng
    const messages = await MessageModel.getPrivateChat(user_id, chat_id);
    return messages;
  } catch (error) {
    throw new Error("Error fetching messages");
  }
}

async function sendMessage(
  user_id,
  chat_id,
  content,
  image_url = null,
  video_url = null,
  file_url = null
) {
  try {
    // Tạo tin nhắn mới
    const message = await MessageModel.createMessage(
      user_id,
      chat_id,
      content,
      image_url,
      video_url,
      file_url
    );
    return message;
  } catch (error) {
    throw new Error("Error sending message");
  }
}

module.exports = {
  getMessages,
  sendMessage,
};
