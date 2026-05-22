---
id: US-CLS01-03
title: "Xếp lớp hàng loạt"
type: "User Story"
domain: "CAP-OPS"
bf: BF-CLS-03
status: "Draft"
tags: [user-story]
---

# US-CLS01-03: Xếp lớp hàng loạt

> **Tham chiếu:** BF-CLS-03 · `/app/students?status=cho_xep_lop`
> **Lưu ý:** Không còn màn hình riêng. Chức năng này nằm trong Quản lý Học viên khi lọc theo "Chờ xếp lớp".

## 1. User Story

**Là một** Giáo vụ,
**tôi muốn** chọn nhiều học viên chờ xếp lớp và xếp cùng lúc vào một lớp,
**để** tiết kiệm thời gian và xử lý nhanh các đợt khai giảng.

---

## 2. Mô tả

Trên màn hình **Quản lý Học viên** (`/app/students`), khi lọc trạng thái "Chờ xếp lớp":
- Chọn nhiều HV bằng ô chọn
- Thanh thao tác hàng loạt hiển thị: "Đã chọn X học viên" + nút "Xếp lớp hàng loạt"
- Hộp thoại chọn lớp đích → hiển thị danh sách lớp cùng Chương trình + Chi nhánh
- Kiểm tra sĩ số tổng thể, Level Matching cho từng HV
- Xác nhận → cập nhật tất cả cùng lúc

**Quy tắc:** Chỉ xếp hàng loạt cho HV cùng Chương trình. Nếu chọn khác Chương trình → vô hiệu nút "Xếp lớp hàng loạt".

---

## 3. Tiêu chí chấp nhận

- [ ] Chọn nhiều HV → hiển thị thanh thao tác hàng loạt
- [ ] Nút "Xếp lớp hàng loạt" vô hiệu nếu HV khác Chương trình
- [ ] Hộp thoại hiển thị lớp phù hợp (cùng Chi nhánh + Chương trình)
- [ ] Kiểm tra sĩ số: tính tổng chỗ cần vs chỗ còn trống
- [ ] Sau xác nhận: tất cả HV cập nhật trạng thái, thông báo thành công
- [ ] Nếu 1 HV không đủ điều kiện (trùng lịch, level sai): cảnh báo cụ thể

---

## Chỉ dẫn cho AI Agent & Lập trình viên

- Sử dụng `<BatchActionBar />` pattern từ shared components.
- Không tạo route mới — đây là hành động trong `/app/students`.
- Mock data: thêm `batchEnrollStudents()` vào `src/mocks/students.ts`.
