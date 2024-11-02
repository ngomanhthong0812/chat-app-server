const MessageModel = require("../models/MessageModel");
const { successResponse, errorResponse } = require("../utils/responseHelper");
// Lấy tin nhắn riêng tư giữa hai người dùng
const getPrivateMessages = async (req, res) => {
  const chat_id = req.body.chat_id; // Lấy ID người dùng thứ hai từ yêu cầu

  console.log("messs :" + chat_id);
};
module.exports = {
  getPrivateMessages,
};
