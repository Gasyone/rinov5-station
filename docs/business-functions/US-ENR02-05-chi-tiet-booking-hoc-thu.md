---
id: US-ENR02-05
title: "Xem và cập nhật Chi tiết Booking Học thử"
bf: BF-ENR-02
domain: CAP-ADM
status: draft
tags: [enrollment, trial, detail, modal]
---

# US-ENR02-05: Xem và cập nhật Chi tiết Booking Học thử

> **Tham chiếu:** BF-ENR-02 · Giao diện Mẫu §4.3 (Trang chi tiết / Modal chi tiết)

## 1. Yêu cầu Người dùng (User Story)

**Là một** nhân viên Tư vấn / Giáo vụ,
**tôi muốn** xem toàn bộ thông tin chi tiết của một Booking Học thử,
**để** nắm bắt tiến độ, thông tin khách hàng, lịch sử các buổi học, kết quả đánh giá và thực hiện các thao tác chuyển đổi trạng thái phù hợp.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập.
> - [x] **N**egotiable — Chi tiết các panel có thể thương lượng.
> - [x] **V**aluable — Cung cấp cái nhìn 360 độ về một phiên học thử của khách.
> - [x] **E**stimable — Đủ rõ để ước lượng công sức.
> - [x] **S**mall — Hoàn thành trong 1 vòng phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-DETAIL-01] Quản lý thao tác:** Các nút hành động (Ghép lớp, Đổi/Hủy lịch) chỉ hiển thị khi Booking ở các trạng thái tương ứng cho phép thao tác (VD: Booking "Đã hủy" hoặc "Hoàn thành" sẽ ẩn các nút này).
2. **[RULE-DETAIL-02] Liên kết Đánh giá:** Khung hiển thị "Kết quả đánh giá" chỉ xuất hiện khi trạng thái Booking là "Hoàn thành" hoặc đã có dữ liệu Feedback gửi về từ Giáo viên.
3. **[RULE-DETAIL-03] Lịch sử hoạt động:** Mọi thao tác đổi trạng thái (Tạo mới, Ghép lớp, Đổi lịch, Điểm danh) phải tự động ghi nhận vào Lịch sử hoạt động (Audit Log).

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-01] Lịch sử:** Tải mặc định 20 dòng lịch sử mới nhất trong panel Lịch sử, sắp xếp từ mới nhất đến cũ nhất.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** Hộp thoại chi tiết (Modal Dialog) chia 2 cột: Cột trái (Tóm tắt thông tin & Liên hệ) 30% / Cột phải (Chi tiết lịch học, Kết quả & Lịch sử) 70%.

### 3.1. Tiêu đề & Nút thao tác (Header Actions)

| Nút | Loại | Logic chuyển trạng thái | Điều kiện |
|-----|------|-------------------------|-----------|
| Hủy Booking | Nút màu cảnh báo | Gọi hộp thoại hủy (US-ENR02-04) | Trạng thái đang mở (Chờ ghép, Đã ghép, Cần đổi) |
| Đổi / Hủy buổi | Nút viền nhạt | Mở hộp thoại đổi lịch (US-ENR02-04) | Trạng thái 'Đã ghép lớp' hoặc 'Cần đổi lịch' |
| Xếp lớp | Nút màu nhấn | Mở hộp thoại ghép lớp (US-ENR02-03) | Trạng thái 'Chờ ghép lớp' hoặc 'Cần đổi lịch' |

### 3.2. Cột trái — Tóm tắt & Liên hệ

| Khu vực | Loại | Trường | Ghi chú |
|---------|------|--------|---------|
| Tóm tắt | Tiêu đề lớn + Nhãn | Tên Lead, ID, Trạng thái (Nhãn màu) | |
| Khách hàng | Khung thông tin | Số điện thoại, Phụ huynh, Lần học thử | Có nút Copy SĐT. |
| Người phụ trách | Khung thông tin | Creator (Người tạo), Owner (Người phụ trách) | Hiển thị Avatar + Tên. Owner lấy theo lớp/buổi học (Nếu đã ghép). |
| Ghi chú nội bộ | Ô nhập liệu tự lưu | Ghi chú vận hành | |

### 3.3. Cột phải — Chi tiết Lịch học & Kết quả

| Khu vực | Loại | Trường | Ghi chú |
|---------|------|--------|---------|
| Chương trình | Khung thông tin | Tên chương trình, Môn học | |
| Lịch học ghép | Bảng / Danh sách | Tên lớp, Các buổi học (Multi-sessions), Thời gian | Nếu chưa ghép hiển thị "Chờ gán lớp/buổi học". |
| Kết quả | Bảng liên kết | Link xem bài test/kết quả (Textlink) | Tách biệt các link kết quả (như kết quả GV đánh giá). Hiển thị mờ (Empty state) nếu chưa có. |

### 3.4. Cột phải — Lịch sử hoạt động (Audit Log)

| Thành phần | Loại | Dữ liệu | Hoạt động |
|------------|------|---------|-----------|
| Dòng thời gian | Danh sách dọc | Lịch sử | Mới nhất trên cùng. Hiển thị thời gian, người thực hiện, hành động và chi tiết. |

---

## 4. Xử lý Ngoại lệ

| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Dữ liệu bị xóa ngoài hệ thống | Đóng modal và báo lỗi "Dữ liệu không tồn tại". |
| 4.2 | Booking đã đóng | Ẩn toàn bộ nút hành động sửa đổi (Xếp lớp, Hủy booking, Đổi buổi). |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Tuân thủ chặt chẽ ranh giới trách nhiệm: Giao diện Modal chi tiết đóng vai trò Orchestrator, gọi các component con (Bảng lịch sử, Khung thông tin, Form Ghép lớp, Form Ngoại lệ). Không tự thân xử lý logic update dữ liệu sâu bên trong.
- Thiết kế UI cần tối ưu không gian chiều dọc (loại bỏ border thừa, dùng padding hợp lý). Link kết quả sử dụng định dạng Textlink (không border/background) theo chuẩn Design System.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** ôm đồm form Ghép Lớp vào trực tiếp Modal này (phải mở qua Dialog/Sheet phụ theo US-ENR02-03).
- **KHÔNG** hiển thị nút Hủy/Đổi nếu Booking đã kết thúc (Hoàn thành / Đã Hủy).

---

## 6. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Phân quyền hiển thị | Xem Booking đã hoàn thành | Ẩn các nút ghép, đổi, hủy. |
| V-02 | Lịch sử | Thao tác đổi lịch | Lịch sử lưu hành động trên cùng. |
| V-03 | Kết quả đánh giá | Booking chưa có kết quả | Hiển thị Empty state hoặc ẩn phần Kết quả. |

---

## 7. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Bố cục 2 cột | So với thiết kế mẫu | Trái 30%, Phải 70%. |
| AC-02 | Điều hướng thao tác | Bấm nút 'Xếp lớp' | Mở đúng Hộp thoại Ghép lớp (US-ENR02-03). |
| AC-03 | Quản lý trạng thái nút | Kiểm tra trạng thái Booking | Chỉ hiển thị các nút thao tác khả dụng. |
| AC-04 | Dữ liệu đa buổi học | Xem Booking đa buổi | Bảng Lịch học ghép hiển thị đủ danh sách các buổi. |
