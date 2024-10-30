const { Server } = require('socket.io');

const setupSocket = (server) => {
    const io = new Server(server, {
        connectionStateRecovery: {},
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('Người dùng kết nối:', socket.handshake.query.userID);
        // Khi người dùng ngắt kết nối
        socket.on('disconnect', () => {
            console.log('Người ngắt kết nối:', socket.handshake.query.userID);
        })

        // Tham gia Phòng Chat
        socket.on('join-room', (room) => {
            socket.join(room);
            console.log(`User ${socket.handshake.query.userID} joined room ${room}`);
        })

        // Gửi tin nhắn
        socket.on('send-message', (msg) => {
            socket.to(msg.room).emit('receive-message', msg);
        });

        // Đánh dấu tin nhắn đã đọc
        socket.on('read-message', (msg) => {
            socket.to(msg.room).emit("message-read", {
                messageId: msg.id,
                userId: socket.handshake.query.userID,
            });
        });

        // Trạng thái người dùng đang nhập
        socket.on('typing', (data) => {
            socket.to(data.room).emit('user-typing', {
                userId: socket.handshake.query.userID,
                isTyping: true
            });
        });

        // Trạng thái người dùng ngừng nhập
        socket.on('stop-typing', (data) => {
            socket.to(data.room).emit('user-typing', {
                userId: socket.handshake.query.userID,
                isTyping: false
            });
        });

    });

    return io;
}

module.exports = setupSocket;