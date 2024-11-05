const setupSocket = require('../config/socket');

const setupMessageSocket = (server) => {
    const io = setupSocket(server);

    io.on('connection', (socket) => {
        const userID = socket.handshake.query.userID;

        // Tham gia Phòng Chat
        socket.on('join-room', (room) => {
            socket.join(room);
            console.log(`Người dùng ${userID} đã tham gia phòng ${room}`);
        });

        // Gửi tin nhắn
        socket.on('send-message', (msg) => {
            socket.to(msg.room).emit('receive-message', {
                message: msg.message, //message => object chứa {content,image_url,video_url,file_url}
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
            socket.to(data.room).emit('user-typing', {
                userId: userID,
                isTyping: true
            });
        });

        // Trạng thái người dùng ngừng nhập
        socket.on('stop-typing', (data) => {
            socket.to(data.room).emit('user-typing', {
                userId: userID,
                isTyping: false
            });
        });
    });

    return io;
};

module.exports = setupMessageSocket;
