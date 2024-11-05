const setupSocket = require('../config/socket');

const setupVideoSocket = (server) => {
    const io = setupSocket(server);

    io.on('connection', socket => {
        const userID = socket.handshake.query.userID; // Lấy userID từ handshake

        // Khi người dùng bắt đầu cuộc gọi
        socket.on('start-call', (roomId) => {
            console.log(`Người dùng ${userID} đã bắt đầu cuộc gọi tới phòng: ${roomId}`);
            io.to(roomId).emit('incoming-call', {
                userId: userID,
                message: `Người dùng ${userID} đang gọi bạn!`
            });
        });

        // Tham gia cuộc gọi
        socket.on('join-call', (roomId) => {
            socket.join(roomId);
            console.log(`Người dùng ${userID} đã tham gia phòng: ${roomId}`);
            io.to(roomId).emit('user-joined', { userId: userID });
        });

        // Từ chối cuộc gọi
        socket.on('reject-call', (roomId) => {
            console.log(`Người dùng ${userID} từ chối tham gia phòng: ${roomId}`);
            io.to(roomId).emit('call-rejected', { userId: userID });
        });

        // Kết thúc cuộc gọi
        socket.on('end-call', (roomId) => {
            console.log(`Người dùng ${userID} đã kết thúc cuộc gọi trong phòng: ${roomId}`);
            io.to(roomId).emit('call-ended', { userId: userID });
            socket.leave(roomId);
        });
    });

    return io;
};

module.exports = setupVideoSocket;
