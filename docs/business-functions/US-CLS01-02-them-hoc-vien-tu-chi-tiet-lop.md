---
id: US-CLS01-02
title: "Thêm học viên từ Chi tiết Lớp học"
type: "User Story"
domain: "CAP-OPS"
bf: BF-CLS-03
status: "Draft"
tags: [user-story]
---

# US-CLS01-02: Thêm học viên từ Chi tiết Lớp học

> **Tham chiếu:** BF-CLS-03 · `/app/classes/[id]` > Tab Học viên
> **Lưu ý:** Không còn màn hình riêng. Chức năng này nằm trong Chi tiết Lớp học, tab Roster.

## 1. User Story

**Là một** Giáo vụ,
**tôi muốn** thêm học viên từ danh sách chờ ngay trong Chi tiết Lớp học,
**để** nhanh chóng bổ sung học viên vào lớp mà không phải mở màn hình khác.

---

## 2. Mô tả

Trên màn hình **Chi tiết Lớp học** (`/app/classes/[id]`), tab **Học viên**:
- Nút "Thêm học viên" mở hộp thoại danh sách HV đang `Cho_xep_lop` cùng Chi nhánh + Chương trình
- Chọn 1 hoặc nhiều HV → Xác nhận → Cập nhật Roster
- Kiểm tra sĩ số, Level Matching, Trùng lịch trước khi lưu

---

## 3. Tiêu chí chấp nhận

- [ ] Nút "Thêm học viên" hiển thị trong tab Roster của Chi tiết Lớp
- [ ] Hộp thoại chỉ hiển thị HV có trạng thái `Cho_xep_lop`, cùng Chi nhánh + Chương trình khớp
- [ ] Kiểm tra sĩ số trước khi xác nhận
- [ ] Cảnh báo nếu Level không khớp
- [ ] Sau thao tác: Roster cập nhật, số đếm sĩ số thay đổi

---

## Chỉ dẫn cho AI Agent & Lập trình viên

- Sử dụng `<Dialog />` hoặc `<Sheet />` từ shadcn/ui.
- Không tạo route mới — đây là thành phần con của `/app/classes/[id]`.
- Tuân thủ `[DS-P4]` cho xác nhận ghi đè sĩ số.
