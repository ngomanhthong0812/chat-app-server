const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const chatGroupController = require("../controllers/chatGroupController");
const messageController = require("../controllers/messageController");
const authMiddleware = require("../middleware/auth");

const initAPIRoutes = (app) => {
  router.put("/register", userController.registerUser);
  router.post("/login", userController.loginUser);
  router.get("/userInfo/:user_id", userController.getUserInfo);
  router.post("/chatList", chatGroupController.chatList);
  router.post("/activeStatusChat", chatGroupController.activeStatusChat);
  router.post("/activeStatusGroup", chatGroupController.activeStatusGroup);
  router.post("/logout", userController.logoutUser);
  // Route lấy tin nhắn riêng tư
  router.post(
    "/messagesprivate",
    authMiddleware,
    messageController.getPrivateMessages
  );
  router.post(
    "/groupmessages",
    authMiddleware,
    messageController.getGroupMessages
  );

  console.log("test lỗi push");

  return app.use("/api", router);
};

module.exports = initAPIRoutes;
