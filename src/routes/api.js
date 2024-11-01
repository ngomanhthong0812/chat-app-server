const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const initAPIRoutes = (app) => {
    // Đăng ký người dùng
    router.put('/register', userController.registerUser);
    router.post('/login', userController.loginUser);
    router.get('/userInfo', userController.getUserInfobyToken);

    return app.use('/api', router);
}


module.exports = initAPIRoutes;