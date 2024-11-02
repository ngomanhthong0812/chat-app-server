const db = require("../config/databse");

// Thêm tin nhắn mới
function createMessage(
  user_id,
  chat_id,
  content,
  image_url,
  video_url,
  file_url,
  callback
) {
  const query = `
    INSERT INTO messages (user_id, chat_id, content, image_url, video_url, file_url, sent_at, is_read) 
    VALUES (?, ?, ?, ?, ?, ?, NOW(), false)
  `;
  db.query(
    query,
    [user_id, chat_id, content, image_url, video_url, file_url],
    (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, {
        id: results.insertId,
        user_id,
        chat_id,
        content,
        image_url,
        video_url,
        file_url,
        sent_at: new Date(), // Thời gian gửi tin nhắn
        is_read: false, // Đánh dấu là chưa đọc
      });
    }
  );
}

// Lấy tất cả tin nhắn
function getAllMessages(callback) {
  const query = "SELECT * FROM messages ORDER BY sent_at DESC";
  db.query(query, (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
}

// Lấy tin nhắn theo ID
function getMessageById(id, callback) {
  const query = "SELECT * FROM messages WHERE id = ?";
  db.query(query, [id], (error, results) => {
    if (error) {
      return callback(error);
    }
    if (results.length === 0) {
      return callback(new Error("Message not found"));
    }
    callback(null, results[0]);
  });
}

// Cập nhật nội dung tin nhắn theo ID
function updateMessage(id, content, callback) {
  const query =
    "UPDATE messages SET content = ?, updated_at = NOW() WHERE id = ?";
  db.query(query, [content, id], (error, results) => {
    if (error) {
      return callback(error);
    }
    if (results.affectedRows === 0) {
      return callback(new Error("Message not found"));
    }
    callback(null, { id, content });
  });
}

// Xóa tin nhắn theo ID
function deleteMessage(id, callback) {
  const query = "DELETE FROM messages WHERE id = ?";
  db.query(query, [id], (error, results) => {
    if (error) {
      return callback(error);
    }
    if (results.affectedRows === 0) {
      return callback(new Error("Message not found"));
    }
    callback(null, { message: "Message deleted" });
  });
}

const getPrivateChat = async (user_id, chat_id) => {
  console.log("Lấy ID user_id:", user_id);
  console.log("Lấy ID chat_id:", chat_id);

  // Kiểm tra đầu vào
  if (!user_id || !chat_id) {
    throw new Error("user_id và chat_id không được để trống.");
  }

  const query = `
            SELECT 
          u.id AS user_id,
          CONCAT(u.first_name, ' ', u.last_name) AS sender_name, -- Kết hợp first_name và last_name
          m.id AS message_id,
          m.content AS message_content,
          m.sent_at AS message_sent_at,
          m.image_url AS message_image_url,
          m.video_url AS message_video_url,
          m.file_url AS message_file_url
      FROM messages m
      JOIN user_chat uc ON m.chat_id = uc.chat_id
      JOIN users u ON m.user_id = u.id
      WHERE uc.user_id = ? AND m.chat_id = ?
      ORDER BY m.sent_at ASC;
  `;

  try {
    const [results] = await db.execute(query, [user_id, chat_id]);

    if (results.length === 0) {
      console.log(
        "Không tìm thấy tin nhắn cho userId:",
        user_id,
        "và chatId:",
        chat_id
      );
      return []; // Trả về mảng rỗng nếu không có tin nhắn
    }

    console.log("Kết quả truy vấn:", results); // In ra kết quả
    return results; // Trả về kết quả
  } catch (error) {
    throw new Error("Lỗi: " + error.message);
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
  getPrivateChat,
};
