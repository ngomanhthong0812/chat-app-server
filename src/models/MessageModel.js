const db = require("../config/database");

class MessageModel {
  // Thêm tin nhắn mới
  static create(
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
  static getAll(callback) {
    const query = "SELECT * FROM messages ORDER BY sent_at DESC";
    db.query(query, (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    });
  }

  // Lấy tin nhắn theo ID
  static getById(id, callback) {
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
  static update(id, content, callback) {
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
  static delete(id, callback) {
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

  // Lấy tin nhắn giữa hai người dùng
  static getPrivateChat(user_id, chat_id, callback) {
    const query = `
      SELECT m.id, m.content, m.sent_at, m.image_url, m.video_url, m.file_url, 
             u.first_name, u.last_name 
      FROM messages m
      JOIN user_chat uc ON m.chat_id = uc.chat_id
      JOIN users u ON m.user_id = u.id
      WHERE uc.user_id = ? AND m.chat_id = ?
      ORDER BY m.sent_at ASC
    `;
    db.query(query, [user_id, chat_id], (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    });
  }
}

module.exports = MessageModel;
