---
id: US-ENR02-04
title: "Xử lý ngoại lệ Đổi buổi, Đổi lớp, Hủy lịch"
bf: BF-ENR-02
domain: CAP-ADM
status: draft
tags: [enrollment, trial, form]
---

# US-ENR02-04: Xử lý ngoại lệ (Đổi buổi, Đổi lớp, Hủy lịch)

> **Tham chiếu:** BF-ENR-02 · `[DS-P4]` Xác nhận hành động rủi ro · Giao diện Mẫu §4.4 (Biểu mẫu)

## 1. Yêu cầu Người dùng (User Story)

**Là một** nhân viên Tư vấn / Giáo vụ,
**tôi muốn** đổi sang buổi khác, đổi sang lớp khác, hoặc hủy lịch học thử,
**để** xử lý các tình huống phát sinh từ phía khách hàng (ốm, bận) hoặc từ phía trung tâm (giáo viên nghỉ, lớp đóng cửa).

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập.
> - [x] **N**egotiable — Giao diện hành động có thể thương lượng.
> - [x] **V**aluable — Đảm bảo linh hoạt vận hành, giải phóng tài nguyên kịp thời.
> - [x] **E**stimable — Đủ rõ để ước lượng.
> - [x] **S**mall — Hoàn thành trong 1 vòng phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-FORM-01] Đổi buổi:** Chỉ áp dụng khi booking đang ở trạng thái "Đã ghép lớp" hoặc "Cần đổi lịch".
2. **[RULE-FORM-02] Giải phóng slot:** Khi đổi buổi/đổi lớp thành công, hệ thống tự động giải phóng chỗ ở buổi/lớp cũ và chiếm chỗ ở buổi/lớp mới.
3. **[RULE-FORM-03] Hủy bắt buộc lý do:** Hủy lịch phải chọn Lý do từ danh sách chuẩn. Sau khi hủy, booking chuyển trạng thái và giải phóng chỗ.
4. **[RULE-FORM-04] Xác nhận hành động rủi ro:** Hủy lịch phải qua bước xác nhận trước khi thực hiện.
5. **[RULE-FORM-05] Tự động đổi lịch khi giáo viên hủy:** Khi giáo viên hủy buổi dạy, hệ thống tự chuyển tất cả booking học thử của buổi đó sang trạng thái "Cần đổi lịch" và thông báo cho người phụ trách.
6. **[RULE-FORM-06] Xử lý từng phần (Partial Reschedule/Cancel):** Đối với booking gồm nhiều buổi học (Multi-session), thao tác Đổi/Hủy lịch cho phép người dùng chọn áp dụng trên toàn bộ Booking hoặc chỉ trên từng buổi học cụ thể.

---

## 3. Cấu trúc Các trường nhập liệu

### 3.1. Hộp thoại Yêu cầu đổi lịch

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
|------------|---------------|----------|----------------|-------------------|
| Thông tin hiện tại | Vùng thông tin (chỉ đọc) | — | Lớp cũ, buổi cũ, ngày giờ | Nền cảnh báo. |
| Chọn buổi cần đổi | Checkbox list | Có | Danh sách buổi | (Dành cho Multi-session) Mặc định chọn tất cả. Có thể bỏ tick để chỉ đổi lịch 1 số buổi. |
| Lý do đổi lịch | Danh sách thả xuống | Có | Lý do | Các giá trị: Khách báo bận, Khách xin đổi ngày, GV nghỉ đột xuất, Lớp đầy cần chuyển, Lý do khác. |
| Ghi chú | Ô nhập văn bản dài | Không | Ghi chú | VD: "Khách xin dời sang cuối tuần". |

### 3.2. Hộp thoại Hủy lịch

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
|------------|---------------|----------|----------------|-------------------|
| Lý do hủy | Danh sách thả xuống | Có | Lý do | Các giá trị: Khách bận, Đã chốt sale sớm, Trung tâm hủy, GV nghỉ đột xuất, Khác. |
| Ghi chú | Ô nhập văn bản dài | Không | Ghi chú | |

### 3.3. Ví dụ Dữ liệu mẫu

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
|------------|-----------------|-------------------|
| Đổi lịch thành công | Lý do: Khách báo bận | Booking → "Cần đổi lịch", lớp cũ giải phóng, audit log. |
| Hủy thành công | Lý do: Trung tâm hủy | Booking → "Đã hủy", slot giải phóng. |
| Hủy thiếu lý do | Lý do: (bỏ trống) | Nút xác nhận vô hiệu. |

### 3.4. Nút hành động

| Nút | Loại hiển thị | Logic xử lý |
|-----|---------------|-------------|
| Đóng/Hủy | Nút viền nhạt | Đóng hộp thoại. |
| Gửi yêu cầu (Đổi lịch) | Nút màu nhấn | Kiểm tra → Cập nhật → Đóng. |
| Xác nhận hủy (Hủy lịch) | Nút nguy hiểm (đỏ) | Kiểm tra lý do → Cập nhật → Đóng. |

---

## 4. Xử lý Ngoại lệ

| # | Tình huống | Cách xử lý |
|---|-----------|------------|
| 4.1 | GV hủy buổi dạy đột xuất | Hệ thống tự chuyển tất cả booking học thử của buổi sang "Cần đổi lịch", thông báo cho người phụ trách. |
| 4.2 | Đổi buổi khi booking đã hoàn thành | Nút "Đổi buổi" không hiển thị. |
| 4.3 | Hủy khi booking đã hủy rồi | Nút "Hủy lịch" không hiển thị. |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Hủy lịch là hành động rủi ro — bắt buộc qua bước xác nhận (dùng hộp thoại xác nhận chuẩn).
- Khi đổi lịch: lưu thông tin lớp cũ (lịch sử) để hiển thị "Lớp cũ (đã giải phóng)" trong chi tiết.
- Audit log phải ghi nhận cả hành động đổi lịch/hủy lịch lẫn giải phóng lớp cũ.

### ⛔ Hàng rào An toàn (Guardrails)

- **KHÔNG** cho phép hủy trực tiếp mà không qua xác nhận.
- **KHÔNG** thay đổi danh sách lý do hủy/đổi mà chưa được phê duyệt.

---

## 6. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Đổi lịch | Chọn lý do, gửi | Booking → "Cần đổi lịch", lớp cũ giải phóng. |
| V-02 | Hủy lịch | Chọn lý do, xác nhận | Booking → "Đã hủy", slot giải phóng. |
| V-03 | Nút theo trạng thái | Kiểm tra booking đã hủy/hoàn thành | Không hiện nút hành động. |
| V-04 | Audit log | Kiểm tra lịch sử | Ghi đúng hành động + lý do. |

---

## 7. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|---------------------|----------------------|-------------------|
| AC-01 | Đổi buổi đúng điều kiện | Kiểm tra nút với các trạng thái | Chỉ hiện khi "Đã ghép lớp" hoặc "Cần đổi lịch". |
| AC-02 | Giải phóng slot | Đổi buổi thành công | Slot cũ giải phóng, slot mới chiếm. |
| AC-03 | Hủy bắt buộc lý do | Bỏ trống lý do | Nút vô hiệu. |
| AC-04 | Xác nhận hành động rủi ro | Hủy lịch | Phải qua bước xác nhận. |
