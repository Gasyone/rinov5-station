---
id: US-ORG-01-02
title: "Quản lý Phòng học & Sức chứa"
bf: BF-ORG-01
domain: CAP-HR
status: draft
tags: [facility, branch, room, capacity]
---

# US-ORG-01-02: Quản lý Phòng học & Sức chứa

> **Tham chiếu:** BF-ORG-01 · Giao diện Mẫu §4.2 (Danh sách dạng Bảng)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Quản lý Vận hành (Operations Manager), **tôi muốn** cấu hình danh sách các phòng học và sức chứa tối đa của từng phòng tại một chi nhánh cụ thể, **để** cung cấp dữ liệu cơ sở vật chất chính xác cho thuật toán xếp lịch và đánh giá sức chứa học viên.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Thuộc tab riêng trong màn hình Chi tiết Chi nhánh.
> - [x] **N**egotiable — Có thể sửa trực tiếp trên bảng hoặc dùng biểu mẫu nổi để tạo phòng.
> - [x] **V**aluable — Nếu không có phòng, hệ thống không thể xếp lịch dạy.
> - [x] **E**stimable — Logic dạng Thêm/Sửa/Xóa cơ bản.
> - [x] **S**mall — Hoàn thành nhanh gọn trong tab Phòng học.
> - [x] **T**estable — Có quy tắc khóa sức chứa.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-ORG-ROOM-01] Sức chứa cứng:** Sức chứa tối đa (Max Capacity) là rào cản cứng. Hệ thống xếp lớp (`CAP-OPS`) sẽ chặn nếu tổng học viên > Sức chứa phòng.
2. **[RULE-ORG-ROOM-02] Không xóa lịch sử:** Nếu phòng học đã từng diễn ra một Buổi học (Session) trong quá khứ, tuyệt đối không được Xóa (Delete). Chỉ được Vô hiệu hóa (Inactive).
3. **[RULE-ORG-ROOM-03] Định danh:** Tên/Mã phòng học phải là duy nhất TRONG CÙNG một chi nhánh. (Ví dụ: Không thể có 2 phòng "Phòng 101" ở cùng 1 CS Cầu Giấy).

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** Nằm trong Tab "Phòng học" của màn hình Chi tiết Chi nhánh (`US-ORG-01-01`). Sử dụng Bảng dữ liệu thu gọn.

### 3.1. Các nút Thao tác (Action Buttons)
| Nút | Vị trí | Quyền hạn | Chức năng |
|-----|--------|-----------|-----------|
| + Thêm Phòng | Góc trên bảng | Admin/Ops | Tạo 1 dòng mới trên bảng để nhập liệu nhanh hoặc mở Hộp thoại. |
| Lưu lại | Đầu/Cuối bảng | Admin/Ops | Lưu toàn bộ thay đổi. |
| Xóa/Khóa | Cột hành động | Admin/Ops | Xóa mềm hoặc vô hiệu hóa phòng. |

### 3.2. Bảng dữ liệu (Data Table)
| Cột | Loại hiển thị | Ghi chú |
|-----|-------------------------|---------|
| Tên phòng | Ô nhập chữ | Bắt buộc. Phải duy nhất trong cơ sở. |
| Loại phòng | Danh sách chọn (Lý thuyết, Lab, Hội trường) | Mặc định là Phòng lý thuyết. |
| Sức chứa | Ô nhập số | Bắt buộc. Phải > 0. |
| Trạng thái | Danh sách chọn / Công tắc | Đang hoạt động / Đang sửa chữa (Vô hiệu hóa). |
| Thao tác | Nút bấm trên dòng | Nút sửa / xóa. |

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Nhập trùng tên phòng hiện có | Báo lỗi trực tiếp: "Tên phòng này đã tồn tại trong chi nhánh." Ngăn lưu. |
| 4.2 | Xóa phòng đã dùng xếp lịch | Báo lỗi dạng hộp thoại: "Phòng này đã gắn với các buổi học trong quá khứ. Hệ thống đã chuyển trạng thái phòng sang Vô hiệu hóa để bảo toàn dữ liệu." (Tự động đổi trạng thái thay vì xóa). |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Phải kiểm tra phân quyền (Authorization) trước khi cho phép xem dữ liệu và thực hiện thao tác.
- Bố cục danh sách phải đáp ứng đúng chuẩn trải nghiệm người dùng. Vì đây là tab phụ, ưu tiên bảng cho phép sửa trực tiếp để thao tác nhanh.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** thêm cột, trường lọc ngoài danh sách đã được định nghĩa ở mục 3.
- **KHÔNG** thực hiện lệnh xóa vĩnh viễn dữ liệu khỏi hệ thống. Phải dùng cờ xóa hoặc đổi trạng thái.

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Thêm phòng thành công | Bấm "Thêm phòng", nhập "P101", sức chứa "20", Lưu. | Bảng hiện P101. Tên phòng lưu đúng chuẩn. |
| AC-02 | Chặn trùng tên phòng | Thêm "P101" lần 2 tại cùng chi nhánh. | Báo lỗi ngay tại ô nhập liệu hoặc khi bấm Lưu. Không tạo trùng. |
| AC-03 | Ràng buộc xóa an toàn | Xóa phòng "P101" đã dùng để học. | Nhận cảnh báo và phòng tự chuyển sang trạng thái "Đang sửa chữa / Vô hiệu hóa", không mất lịch sử cũ. |
