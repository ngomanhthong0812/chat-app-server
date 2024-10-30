require('dotenv').config()

const express = require('express')
const initAPIRoutes = require('./routes/api');
const { createServer } = require('node:http');

const db = require('./config/databse');
const firebase = require('./config/firebase');
const setupSocket = require('./socket/socket');
const host = process.env.PORT || 8000

const app = express()
const server = createServer(app);

// Middleware để phân tích cú pháp x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Middleware để phân tích cú pháp JSON
app.use(express.json());

initAPIRoutes(app);

app.use('/', (req, res) => {
    res.send('Welcome to server');
})

setupSocket(server);

server.listen(host, () => {
    console.log(`Server is running on http://localhost:${host}`);
});