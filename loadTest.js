const io = require('socket.io-client');
const { Worker, isMainThread, workerData } = require('worker_threads');

function connectSocketIO(url) {
    const socket = io(url, {
        transports: ['websocket'],
        reconnection: false,
    });

    socket.on('connect', () => {
        console.log(`Connected: ${socket.id}`);

        // Gửi tin nhắn mỗi giây
        setInterval(() => {
            socket.emit('send-message', `Message from ${socket.id}`);
        }, 1000);
    });

    socket.on('send-message', (message) => {
        console.log(`Received: ${message}`);
    });

    socket.on('disconnect', () => {
        console.log(`Disconnected: ${socket.id}`);
    });

    socket.on('connect_error', (error) => {
        console.error(`Connection error: ${error.message}`);
    });
}

if (isMainThread) {
    const numberOfUsers = 200;
    const url = 'http://localhost:8080';

    for (let i = 0; i < numberOfUsers; i++) {
        new Worker(__filename, { workerData: { url } });
    }
} else {
    connectSocketIO(workerData.url);
}
