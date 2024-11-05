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
        const userID = socket.handshake.query.userID;
        console.log('Người dùng kết nối:', userID);

        // Ngắt kết nối
        socket.on('disconnect', () => {
            console.log(`Người dùng ${userID} đã ngắt kết nối`);
        });

        return { io, userID };
    });

    return io;
};

module.exports = setupSocket;
