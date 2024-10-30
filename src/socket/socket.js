const { Server } = require('socket.io');

const setupSocket = (server) => {
    const io = new Server(server, {
        connectionStateRecovery: {}
    });

    io.on('connect', (socket) => {
        console.log('Người dùng kết nối:', socket.id);
        socket.on('disconnect', (socket) => {
            console.log('Người dùng kết nối:', socket.id);
        })
        socket.on('join-room', (room) => {
            socket.join(room);
            console.log(`User ${socket.id} joined room ${room}`);
        })
        socket.on('on-chat', (msg) => {
            socket.to(msg.room).emit('user-chat', msg);
        });
    });

    return io;
}

module.exports = setupSocket;