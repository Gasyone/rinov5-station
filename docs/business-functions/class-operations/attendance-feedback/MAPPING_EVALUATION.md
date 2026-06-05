# Bảng đối chiếu Nghiệp vụ & Hiện trạng Kỹ thuật — Điểm danh & Nhận xét (Attendance & Feedback)

Bảng đối chiếu ánh xạ các yêu cầu nghiệp vụ của phân hệ Điểm danh & Nhận xét sang các thành phần kỹ thuật trên Frontend Rinov5.

## 1. Bảng đối chiếu Nghiệp vụ - Kỹ thuật

| Yêu cầu từ User Requirement | Tính năng kỹ thuật | Tài liệu mô tả | Hiện trạng Code FE |
| :--- | :--- | :--- | :--- |
| **REQ-CLS-08**: Tinh gọn menu V1 | Đổi mảng điều hướng sidebar ở V1. | [navigation.ts](../../../../src/config/navigation.ts) | **Đã hoàn thành:** Chuyển mục Điểm danh vào nhóm Vận hành lớp học V1. |
| **REQ-CLS-10**: Điểm danh chuyên cần | Giao diện bảng danh sách checkbox điểm danh và upload media. | [US-CLS05-01](./US-CLS05-01-diem-danh-cham-diem-theo-buoi.md) | **Đã hoàn thành:** Component [AttendanceScreen.tsx](../../../../src/components/screens/attendance/AttendanceScreen.tsx) và Bảng điểm danh đã chạy mockup. |
| **REQ-CLS-11**: Nhận xét sau buổi học | Dialog form nhận xét học viên chi tiết. | [US-CLS05-02](./US-CLS05-02-danh-gia-dinh-ky-theo-lop.md) | **Đã hoàn thành:** Màn hình [SessionFeedbackScreen.tsx](../../../../src/components/screens/session-feedback/SessionFeedbackScreen.tsx) và Form nhận xét chạy tốt. |
