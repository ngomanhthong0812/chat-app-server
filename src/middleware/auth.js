const jwt = require("jsonwebtoken");

// Middleware xác thực người dùng
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Lấy token từ header
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Failed to authenticate token" });

    req.userId = decoded.id; // Lưu ID người dùng vào req để sử dụng trong route
    next(); // Tiếp tục đến middleware hoặc route tiếp theo
  });
}

module.exports = authMiddleware;
