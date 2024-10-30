const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const initAPIRoutes = (app) => {
    // Đăng ký người dùng
    router.post('/api/register', userController.registerUser);
    
    return app.use('/api', router);
}


module.exports = initAPIRoutes;