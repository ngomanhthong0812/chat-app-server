require("dotenv").config();
const userService = require("../services/userService");
const userModel = require("../models/usersModel");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const {
    first_name,
    last_name,
    gender,
    password,
    email,
    birth_date,
    active_status,
  } = req.body;

  try {
    const userId = await userService.handleRegister(
      first_name,
      last_name,
      gender,
      password,
      email,
      birth_date,
      active_status
    );

    if (userId) {
      res.status(201).json({
        msg: "Create successful user",
        userId: userId,
      });
    } else {
      res.status(400).json({
        msg: "Email already in use",
      });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.handleLogin(email, password);

    if (user) {
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      res.status(200).json({
        msg: "Login successful",
        token: token,
        user: {
          user_id: user.id,
          avatar_url: user.avatar_url,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });
    } else {
      res.status(400).json({
        msg: "Email or password is wrong",
        email: email,
        password: password,
      });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

const logoutUser = async (req, res) => {
  if (req.method === "POST") {
    res.status(200).json({ message: "Logged out successfully" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const getUserInfo = async (req, res) => {
  const { token } = req.body;
  const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const user = await userModel.getUserbyId(verifyToken.id);
    if (user) {
      res.status(200).json({
        msg: "User infomation successful",
        user,
      });
    } else {
      res.status(404).json({
        msg: "User not found",
        email: email,
      });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
  logoutUser,
};
