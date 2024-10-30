__LUỒN HOẠT ĐỘNG__
- Router nhận các yêu cầu HTTP từ client và chuyển tiếp chúng đến Controller tương ứng.
- Controller nhận yêu cầu HTTP và sử dụng Service để xử lý yêu cầu, sau đó trả về phản hồi cho client.
- Service quản lý logic nghiệp vụ và gọi Model để thao tác với cơ sở dữ liệu.
- Model chứa logic để tương tác với cơ sở dữ liệu.


__CÁC MÃ TRẠNG THÁI HTTP__

**Mã thành công (2xx)**
200 OK: Thành công. Thường dùng khi trả về dữ liệu mà client yêu cầu, như kết quả của GET hoặc PUT.
201 Created: Thành công và đã tạo một tài nguyên mới. Thường dùng sau các yêu cầu POST khi thêm dữ liệu.
202 Accepted: Yêu cầu đã được chấp nhận nhưng chưa hoàn thành (thường được xử lý bất đồng bộ).
204 No Content: Yêu cầu thành công nhưng không có nội dung trả về (thường dùng cho DELETE hoặc PUT).

**Mã điều hướng (3xx)**
301 Moved Permanently: Tài nguyên đã chuyển vĩnh viễn sang một URL khác. Thường được dùng trong các API cũ chuyển sang đường dẫn mới.
302 Found: Tài nguyên tạm thời có URL khác.
304 Not Modified: Tài nguyên không thay đổi so với lần truy cập trước, giúp client có thể dùng dữ liệu lưu cache.

**Mã lỗi từ phía client (4xx)**
400 Bad Request: Yêu cầu từ client không hợp lệ, thường do dữ liệu đầu vào không đúng.
401 Unauthorized: Client cần xác thực. Thường gặp khi API yêu cầu token đăng nhập.
403 Forbidden: Không có quyền truy cập tài nguyên, ngay cả khi đã xác thực. Thường dùng để chặn quyền truy cập tài nguyên nhạy cảm.
404 Not Found: Không tìm thấy tài nguyên yêu cầu. Hay dùng khi client truy cập API hoặc dữ liệu không tồn tại.
405 Method Not Allowed: Phương thức HTTP không được hỗ trợ với tài nguyên này, ví dụ gọi PUT thay vì POST.
409 Conflict: Có xung đột với trạng thái hiện tại của tài nguyên, thường gặp khi trùng dữ liệu trong các yêu cầu POST.
429 Too Many Requests: Client gửi quá nhiều yêu cầu trong thời gian ngắn, thường dùng khi giới hạn tốc độ.

**Mã lỗi từ phía máy chủ (5xx)**
500 Internal Server Error: Lỗi từ máy chủ do nguyên nhân không xác định, như lỗi bất ngờ trong xử lý.
502 Bad Gateway: Máy chủ nhận được phản hồi không hợp lệ từ máy chủ khác (hay gặp khi proxy hoặc microservices lỗi).
503 Service Unavailable: Máy chủ không thể xử lý yêu cầu (thường do bảo trì hoặc quá tải).
504 Gateway Timeout: Máy chủ không nhận được phản hồi kịp thời từ máy chủ khác.
