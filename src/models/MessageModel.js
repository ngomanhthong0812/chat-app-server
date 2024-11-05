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
  // Kiểm tra đầu vào
  console.log("test id " + user_id + " " + chat_id);

  if (!user_id || !chat_id) {
    throw new Error("user_id và chat_id không được để trống.");
  }

  try {
    // Truy vấn để lấy thông tin tin nhắn
    const messagesQuery = `
      SELECT
        us.id AS user_id,
        us.first_name,
        us.last_name,
        us.avatar_url,
        msg.id AS message_id,
        msg.chat_id,
        msg.content AS message_content,
        msg.image_url,
        msg.video_url,
        msg.file_url,
        msg.sent_at AS message_sent_at,
        msg.seen_at,
        msg.is_read,
        CASE 
            WHEN us.id = ? THEN 'yes' 
            ELSE 'no' 
        END AS is_my_message
      FROM
        users us
      JOIN
        messages msg ON us.id = msg.user_id
      WHERE 
        msg.chat_id = ?;
    `;

    // Thay thế các tham số vào truy vấn
    const [results_message] = await db.execute(messagesQuery, [
      user_id,
      chat_id,
    ]);

    // Kiểm tra nếu không có kết quả
    if (results_message.length === 0) {
      console.log("Không tìm thấy tin nhắn nào cho chat_id:", chat_id);
      return {
        room_id: chat_id,
        name_room: "Chat Room", // Tên phòng mặc định nếu không có tin nhắn
        users: [], // Không có người dùng
        message: [],
      };
    }

    // Truy vấn để lấy thông tin người dùng trong chat
    const usersQuery = `
      SELECT
        us.id AS user_id,
        us.first_name,
        us.last_name,
        us.avatar_url,
        us.active_status
      FROM
        users us
      JOIN
        user_chat uc ON us.id = uc.user_id
      WHERE 
        uc.chat_id = ? AND uc.user_id != ?;  -- Lấy thông tin người dùng khác
    `;

    // Thay thế các tham số vào truy vấn
    const [results_users] = await db.execute(usersQuery, [chat_id, user_id]);

    // Tạo phản hồi
    const response = {
      users: results_users.map((user) => ({
        room_id: results_message[0].chat_id, // Lấy chat_id từ kết quả
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar_url: user.avatar_url,
        active_status: user.active_status,
      })), // Thêm danh sách người dùng khác vào phản hồi
      message: results_message.map((msg) => ({
        user_id: msg.user_id,
        sender_name: msg.first_name + " " + msg.last_name, // Kết hợp first_name và last_name
        avatar_url: msg.avatar_url, // Avatar của người gửi
        message_id: msg.message_id,
        message_content: msg.message_content,
        message_sent_at: msg.message_sent_at,
        message_image_url: msg.image_url,
        message_video_url: msg.video_url,
        message_file_url: msg.file_url,
      })),
    };

    return response; // Trả về kết quả
  } catch (error) {
    throw new Error("Lỗi: " + error.message);
  }
};
const getGroupChat = async (user_id, group_id) => {
  // Kiểm tra đầu vào
  console.log("test id " + user_id + " " + group_id);

  if (!user_id || !group_id) {
    throw new Error("user_id và group_id không được để trống.");
  }

  try {
    // Truy vấn để kiểm tra xem người dùng có tham gia vào nhóm không
    const userCheckQuery = `
      SELECT COUNT(*) AS count
      FROM user_group
      WHERE user_id = ? AND group_id = ?;
    `;

    const [userCheckResult] = await db.execute(userCheckQuery, [
      user_id,
      group_id,
    ]);

    // Nếu người dùng không tham gia vào nhóm, trả về thông báo
    if (userCheckResult[0].count === 0) {
      return {
        message: "Người dùng không tham gia vào nhóm này.",
      };
    }

    // Truy vấn để lấy tên nhóm
    const groupQuery = `
      SELECT
        g.id AS group_id,
        g.group_name,
        g.avatar_url
      FROM
        groups g
      WHERE
        g.id = ?;
    `;

    const [groupResult] = await db.execute(groupQuery, [group_id]);

    if (groupResult.length === 0) {
      return {
        message: "Không tìm thấy nhóm với group_id: " + group_id,
      };
    }

    const groupInfo = groupResult[0];

    // Truy vấn để lấy thông tin tin nhắn trong nhóm
    const messagesQuery = `
      SELECT
        us.id AS user_id,
        us.first_name,
        us.last_name,
        us.avatar_url,
        msg.id AS message_id,
        msg.group_id,
        msg.content AS message_content,
        msg.image_url,
        msg.video_url,
        msg.file_url,
        msg.sent_at AS message_sent_at,
        msg.seen_at,
        msg.is_read
      FROM
        users us
      JOIN
        messages msg ON us.id = msg.user_id
      WHERE 
        msg.group_id = ?; 
    `;

    // Thay thế các tham số vào truy vấn
    const [results_message] = await db.execute(messagesQuery, [group_id]);

    // Kiểm tra nếu không có kết quả tin nhắn
    if (results_message.length === 0) {
      console.log("Không tìm thấy tin nhắn nào cho group_id:", group_id);
    }

    // Tạo phản hồi
    const response = {
      group_id: groupInfo.group_id,
      group_name: groupInfo.group_name,
      avatar_url: groupInfo.avatar_url,
      messages: results_message.map((msg) => ({
        message_id: msg.message_id,
        message_content: msg.message_content,
        message_sent_at: msg.message_sent_at,
        message_image_url: msg.image_url,
        message_video_url: msg.video_url,
        message_file_url: msg.file_url,
        sender: {
          user_id: msg.user_id,
          sender_name: msg.first_name + " " + msg.last_name,
          avatar_url: msg.avatar_url,
        },
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
  getGroupChat,
};
