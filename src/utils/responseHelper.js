// utils/responseHelper.js

// Phản hồi thành công
function successResponse(data = [], code = 200) {
  return {
    code, // Mã trạng thái HTTP (mặc định là 200)
    data, // Dữ liệu trả về (mặc định là mảng rỗng)
  };
}

// Phản hồi lỗi với thông điệp và mã lỗi
function errorResponse(message, code = 500) {
  return {
    code, // Mã trạng thái HTTP
    message, // Thông điệp mô tả lỗi
  };
}

// Định nghĩa các mã lỗi phổ biến
const ErrorCodes = {
  NOT_FOUND: {
    code: 404,
    message: "Resource not found: Tài nguyên không tìm thấy",
  },
  INVALID_CREDENTIALS: {
    code: 401,
    message: "Invalid credentials: Thông tin đăng nhập không hợp lệ",
  },
  UNAUTHORIZED: {
    code: 403,
    message:
      "Unauthorized access: Người dùng không được phép truy cập tài nguyên",
  },
  FORBIDDEN: {
    code: 403,
    message: "Access forbidden: Người dùng bị cấm truy cập tài nguyên",
  },
  BAD_REQUEST: {
    code: 400,
    message:
      "Bad request: Yêu cầu không hợp lệ, thường do thiếu thông tin hoặc sai định dạng",
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: "Internal server error: Lỗi không xác định xảy ra trên máy chủ",
  },
};

// Hàm tiện ích để tạo phản hồi lỗi theo mã lỗi
function createErrorResponse(errorCode) {
  // Lấy mã và thông điệp tương ứng với mã lỗi đã định nghĩa
  const { code, message } =
    ErrorCodes[errorCode] || ErrorCodes.INTERNAL_SERVER_ERROR; // Nếu mã lỗi không xác định, trả về lỗi máy chủ
  return errorResponse(message, code); // Trả về phản hồi lỗi
}

module.exports = {
  successResponse,
  errorResponse,
  createErrorResponse,
  ErrorCodes,
};
