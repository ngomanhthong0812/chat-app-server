require('dotenv').config()

const express = require('express')
const initAPIRoutes = require('./routes/api');
const initWebRoutes = require('./routes/web');
const { createServer } = require('node:http');

const db = require('./config/databse');
const firebase = require('./config/firebase');
const setupSocket = require('./socket/socket');
const host = process.env.PORT || 8000

const app = express()
const server = createServer(app);
app.use(express.json());

initAPIRoutes(app);
initWebRoutes(app);

setupSocket(server);

server.listen(host, () => {
    console.log(`Server is running on http://localhost:${host}`);
});