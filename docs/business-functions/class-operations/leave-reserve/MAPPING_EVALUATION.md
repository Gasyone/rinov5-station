# Bảng đối chiếu Nghiệp vụ & Hiện trạng Kỹ thuật — Đơn từ & Phê duyệt (Leave & Reserve)

Bảng đối chiếu ánh xạ các yêu cầu nghiệp vụ của phân hệ Đơn từ & Phê duyệt sang các thành phần kỹ thuật trên Frontend Rinov5.

## 1. Bảng đối chiếu Nghiệp vụ - Kỹ thuật

| Yêu cầu từ User Requirement | Tính năng kỹ thuật | Tài liệu mô tả | Hiện trạng Code FE |
| :--- | :--- | :--- | :--- |
| **REQ-CLS-07**: Phê duyệt và quản lý đơn từ | Giao diện danh sách đơn, bộ lọc đơn theo loại và trạng thái, nút phê duyệt nhanh. | [BF-CLS-06](./BF-CLS-06-nghi-hoc-bao-luu.md)<br>[US-CLS06-01](./US-CLS06-01-xu-ly-chuyen-lop.md) | **Đã hoàn thành:** Màn hình [LeaveReserveScreen.tsx](../../../../src/components/screens/leave-reserve/LeaveReserveScreen.tsx) hỗ trợ xem danh sách đơn, tạo đơn nháp mới, lọc tìm kiếm nâng cao và thực hiện duyệt đơn cập nhật state tức thời. |
