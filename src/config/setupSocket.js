const setupMessageSocket = require('../socket/setupMessageSocket');
const setupVideoSocket = require('../socket/setupVideoSocket');

const setupSocket = (server) => {
    const io = require('socket.io')(server, {
        path: '/socket.io',
        cors: {
            origin: "http://localhost:3000", // Thay đổi theo nhu cầu của bạn
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        const userID = socket.handshake.query.userID;

        // Thiết lập sự kiện cho tin nhắn
        setupMessageSocket(socket, userID, io);

        // Thiết lập sự kiện cho video
        setupVideoSocket(socket, userID, io);
    });

    return io;
};

module.exports = setupSocket;