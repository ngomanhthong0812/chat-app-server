const express = require('express');
const router = express.Router();
const path = require('path');

const initWebRoutes = (app) => {
    router.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../container.html'));
    })
    router.get('/index', function (req, res) {
        res.sendFile(path.join(__dirname, '../index.html'));
    })

    return app.use('/', router)
}

module.exports = initWebRoutes;