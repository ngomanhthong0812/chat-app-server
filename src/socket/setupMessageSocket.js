const MessageModel = require("../models/MessageModel");

const setupMessageSocket = (socket, userID, io) => {
    // Tham gia Phòng Chat
    socket.on('join-room', (room) => {
        console.log(room);

        socket.join(room);
        console.log(`Người dùng ${userID} đã tham gia phòng ${room}`);
    });

    // Xử lý khi người dùng rời khỏi phòng
    socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        console.log(`User ${userID} left room: ${roomId}`);
    });

    // Gửi tin nhắn
    socket.on('send-message', (msg) => {
        MessageModel.createMessage(
            msg.message.user_id,
            msg.message.chat_id,
            msg.message.group_id,
            msg.message.message_content,
            msg.message.message_image_url,
            msg.message.message_video_url,
            msg.message.message_file_url,
        );

        socket.to(msg.room).emit('receive-message', {
            message: msg.message, // message => object chứa {content, image_url, video_url, file_url}
            userId: userID,
        });
    });

    // Đánh dấu tin nhắn đã đọc
    socket.on('read-message', (msg) => {
        socket.to(msg.room).emit("message-read", {
            messageId: msg.id,
            userId: userID,
        });
    });

    // Trạng thái người dùng đang nhập
    socket.on('typing', (data) => {
        console.log('nguoi dung dang nhap', data, userID);
        socket.to(data.room).emit('user-typing', {
            userId: userID,
            isTyping: true
        });
    });

    // Trạng thái người dùng ngừng nhập
    socket.on('stop-typing', (data) => {
        console.log('nguoi dung ngung nhap', data, userID);
        socket.to(data.room).emit('user-typing', {
            userId: userID,
            isTyping: false
        });
    });
};

module.exports = setupMessageSocket;