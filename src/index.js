require("dotenv").config();

const express = require('express');
const cors = require('cors');
const initAPIRoutes = require('./routes/api');
const { createServer } = require('node:http');

const db = require('./config/databse');
const storage = require('./config/firebaseStorage');
const setupSocket = require('./config/setupSocket');
const host = process.env.PORT || 8000

const app = express();
const server = createServer(app);

app.use(cors());// Cho phép tất cả các nguồn
app.use(express.urlencoded({ extended: true }));// Middleware để phân tích cú pháp x-www-form-urlencoded
app.use(express.json());// Middleware để phân tích cú pháp JSON

initAPIRoutes(app);

app.use("/", (req, res) => {
    res.send("Welcome to server");
});

setupSocket(server);

server.listen(host, () => {
    console.log(`Server is running on http://localhost:${host}`);
});
