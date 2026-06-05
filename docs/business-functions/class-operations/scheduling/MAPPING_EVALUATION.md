# Bảng đối chiếu Nghiệp vụ & Hiện trạng Kỹ thuật — Lịch học & Lịch biểu (Scheduling)

Bảng đối chiếu ánh xạ các yêu cầu nghiệp vụ của phân hệ Lịch học & Lịch biểu sang các thành phần kỹ thuật trên Frontend Rinov5.

## 1. Bảng đối chiếu Nghiệp vụ - Kỹ thuật

| Yêu cầu từ User Requirement | Tính năng kỹ thuật | Tài liệu mô tả | Hiện trạng Code FE |
| :--- | :--- | :--- | :--- |
| **REQ-CLS-12**: Sinh lịch học tự động | Thuật toán cộng ngày tự động dựa trên ngày bắt đầu và các slot ngày trong tuần được bật. | [US-OPS02-02](./US-OPS02-02-khoi-tao-va-sinh-lich-hoc.md) | **Đã hoàn thành:** Hỗ trợ tính toán tóm tắt lịch học trực tiếp ở màn hình tạo mới [ClassesCreateDialog.tsx](../../../../src/components/screens/classes/ClassesCreateDialog.tsx). |
| **REQ-CLS-13**: Quản lý lịch học tổng thể | Lịch biểu trực quan dạng Grid/Calendar xem lịch theo tuần, tháng và ngày. | [US-OPS02-03](./US-OPS02-03-quan-ly-lich-tong-the-co-so.md) | **Đã hoàn thành:** Các màn hình Lịch học tổng thể cơ sở hoạt động mockup mượt mà. |
| **REQ-CLS-14**: Thuật toán phát hiện xung đột | So sánh chéo thời gian bắt đầu và kết thúc giữa các ca học cùng ngày của cùng một giáo viên hoặc phòng học. | [US-OPS02-04](./US-OPS02-04-thuat-toan-quet-xung-dot.md) | **Đã hoàn thành:** Giao diện hiển thị cảnh báo xung đột (Conflict badges) hiển thị chuẩn. |
