const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");
const authMiddleware = require("../middleware/auth");

const initAPIRoutes = (app) => {
  // Đăng ký người dùng
  router.put("/register", userController.registerUser);
  router.post("/login", userController.loginUser);
  router.get("/userInfo", userController.getUserInfobyToken);
  router.get(
    "/message/:chatId",
    authMiddleware,
    messageController.getPrivateMessages
  );

  return app.use("/api", router);
};

module.exports = initAPIRoutes;
