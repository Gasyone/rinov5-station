---
id: US-OPS02-04
title: "Thuật toán Quét xung đột (Trùng lịch, Ngày nghỉ lễ)"
type: "User Story"
domain: "CAP-OPS"
bf: BF-OPS-02
status: "Draft"
tags: [user-story]
---

# US-OPS02-04: Thuật toán Quét xung đột (Trùng lịch, Ngày nghỉ lễ)

> Tài liệu đang chờ biên tập

## Đề xuất Giao diện (Expected UI/UX)
- **Màn hình:** Không có màn hình riêng. Đây là Logic Validation chạy ngầm khi người dùng bấm Lưu (Save) ở US-OPS02-01 hoặc các US đổi phòng/giáo viên.
- **Đề xuất UI:** Cảnh báo Inline Validation (chữ Đỏ/Vàng) thông báo lỗi: "Giáo viên A bận", "Phòng 101 trùng", hoặc "Ngày 20/11 là ngày nghỉ lễ Nhà giáo VN, không thể xếp lịch".


## Nguồn dữ liệu tham chiếu (Data Dependencies)
- **Danh sách Ngày nghỉ lễ (Holidays):** Đọc từ cấu hình của BF-SYS-02: Cấu hình hệ thống. Thuật toán sẽ đối chiếu ngày sinh buổi học với bảng này để tự động nhảy cóc (skip) các ngày trung tâm đóng cửa.
