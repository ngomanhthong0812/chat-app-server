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

const getPrivateChat = async (user_id, other_user_id, chat_id) => {
  console.log("Lấy ID user_id:", user_id);
  console.log("Lấy ID chat_id:", chat_id);
  console.log("Lấy ID other_user_id:", other_user_id);

  // Kiểm tra đầu vào
  if (!user_id || !chat_id || !other_user_id) {
    throw new Error("user_id, other_user_id và chat_id không được để trống.");
  }

  try {
    const query = `
    SELECT 
        u.id AS user_id,
        CONCAT(u.first_name, ' ', u.last_name) AS sender_name,
        u.avatar_url AS avatar_url,  /* Lấy avatar_url */
        m.id AS message_id,
        m.content AS message_content,
        m.sent_at AS message_sent_at,
        m.image_url AS message_image_url,
        m.video_url AS message_video_url,
        m.file_url AS message_file_url,
        c.id AS chat_id,
        CASE 
            WHEN u.id = ? THEN (SELECT CONCAT(u2.first_name, ' ', u2.last_name) FROM users u2 WHERE u2.id = ?) 
            ELSE (SELECT CONCAT(u.first_name, ' ', u.last_name) FROM users u WHERE u.id = ?) 
        END AS chat_name
    FROM messages m
    JOIN user_chat uc ON m.chat_id = uc.chat_id
    JOIN users u ON m.user_id = u.id
    JOIN chats c ON m.chat_id = c.id
    WHERE m.chat_id = ? 
      AND (m.user_id = ? OR m.user_id = ?)
    ORDER BY m.sent_at ASC;
  `;

    // Thay thế các tham số vào truy vấn
    const [results] = await db.execute(query, [
      user_id,
      other_user_id,
      user_id,
      chat_id, // Sử dụng chat_id ở đây
      user_id,
      other_user_id,
    ]);

    if (results.length === 0) {
      console.log(
        "Không tìm thấy tin nhắn cho userId:",
        user_id,
        "và chatId:",
        chat_id
      );
      return { code: 200, data: [] }; // Trả về mảng rỗng nếu không có tin nhắn
    }

    // Lấy tên đoạn chat từ kết quả
    const chat_name = results[0].chat_name;

    // Tạo đối tượng kết quả trả về theo định dạng mong muốn
    const response = {
      room_id: chat_id, // Sử dụng chat_id từ tham số
      name_rom: chat_name,
      avatar_url: results[0].avatar_url, // Nếu bạn muốn đưa avatar của người gửi đầu tiên vào phản hồi
      message: results.map((msg) => ({
        user_id: msg.user_id,
        sender_name: msg.sender_name,
        avatar_url: msg.avatar_url, // Thêm avatar_url vào mỗi tin nhắn
        message_id: msg.message_id,
        message_content: msg.message_content,
        message_sent_at: msg.message_sent_at,
        message_image_url: msg.message_image_url,
        message_video_url: msg.message_video_url,
        message_file_url: msg.message_file_url,
      })),
    };

    return response; // Trả về kết quả
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
