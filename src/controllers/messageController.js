const messageService = require("../services/MessageService");
const { successResponse, errorResponse } = require("../utils/responseHelper");

// Lấy tin nhắn riêng tư giữa hai người dùng
const getPrivateMessages = async (req, res) => {
  const userId = req.userId; // Lấy từ middleware
  const chatId = req.params.chatId; // Sửa lại `params` để lấy chatId từ URL

  try {
    const messages = await messageService.getMessages(userId, chatId);
    console.log("mess: " + messages);

    res.status(200).json(successResponse(messages));
  } catch (error) {
    console.log("messerror: " + error);

    console.error("Error fetching messages:", error);
    res.status(500).json(errorResponse(error.message));
  }
};

module.exports = {
  getPrivateMessages,
};
