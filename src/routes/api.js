const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const chatGroupController = require('../controllers/chatGroupController');

const initAPIRoutes = (app) => {
    router.put('/register', userController.registerUser);
    router.post('/login', userController.loginUser);
    router.get('/userInfo', userController.getUserInfo);
    router.post('/chatList', chatGroupController.chatList);
    router.post('/activeStatusChat', chatGroupController.activeStatusChat);
    router.post('/activeStatusGroup', chatGroupController.activeStatusGroup);
    router.post('/logout', userController.logoutUser);

    return app.use('/api', router);
}


module.exports = initAPIRoutes;