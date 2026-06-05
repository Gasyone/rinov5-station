---
id: US-ORG-01-01
title: "Thiết lập Giờ Hoạt động Chi nhánh"
bf: BF-ORG-01
domain: CAP-HR
status: draft
tags: [org, branch, hours, schedule, form]
---

# US-ORG-01-01: Thiết lập Giờ Hoạt động Chi nhánh (Branch Operating Hours)

> **Tham chiếu:** BF-ORG-01 · Giao diện Mẫu §4.4 (Biểu mẫu / Khung nhập liệu)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Quản lý Vận hành (Operations Manager), **tôi muốn** cấu hình chi tiết khung giờ mở cửa và đóng cửa của cơ sở mình theo từng ngày trong tuần, **để** hệ thống có dữ liệu rào cản (constraints) chính xác nhằm chặn các lịch học được xếp ngoài giờ mở cửa.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Thuộc tab riêng trong màn hình Chi tiết Chi nhánh.
> - [x] **N**egotiable — Có thể dùng dạng bảng hoặc danh sách cho giao diện chọn giờ.
> - [x] **V**aluable — Ngăn chặn lỗi vận hành khi xếp lịch vào lúc cơ sở đóng cửa.
> - [x] **E**stimable — Logic dạng Update mảng 7 phần tử (7 ngày).
> - [x] **S**mall — Hoàn thành nhanh gọn trong tab Giờ hoạt động.
> - [x] **T**estable — Có quy tắc kiểm tra valid Giờ Đóng > Giờ Mở.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-ORG-HOURS-01] Ràng buộc Khép kín:** `NẾU` một ngày được đánh dấu là Có hoạt động (`isOpen = true`), `THÌ` bắt buộc phải điền cả Giờ mở cửa và Giờ đóng cửa hợp lệ.
2. **[RULE-ORG-HOURS-02] Ràng buộc Vận hành:** Đây là điều kiện chặn cứng (Hard Constraint) cho thuật toán sinh lịch (`BF-OPS-02`). Bất kỳ ca học nào kéo dài vượt ra ngoài khung giờ hoạt động của chi nhánh sẽ bị hệ thống báo lỗi đỏ và từ chối lưu lịch.
3. **[RULE-ORG-HOURS-03] Không ghi đè lịch sử:** Việc thay đổi Giờ hoạt động chỉ áp dụng cho việc kiểm tra lịch học trong Tương lai. Các buổi học đã xếp lịch và diễn ra trong Quá khứ sẽ không bị ảnh hưởng hay báo lỗi hồi tố (Retroactive error).

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** Nằm trong Tab "Giờ Hoạt Động" của màn hình Chi tiết Chi nhánh. Hiển thị dạng danh sách (List) 7 dòng cho 7 ngày trong tuần.

### 3.1. Các trường thông tin (Form Fields)

| Khu vực | Trường | Bắt buộc | Validation | Ghi chú |
|---------|--------|----------|------------|---------|
| **Dòng cấu hình (Theo ngày)** | Thứ trong tuần | Có | Chỉ đọc | Hiển thị cố định từ Thứ 2 đến Chủ nhật. |
| | Trạng thái (Mở cửa) | Có | Đúng/Sai | Công tắc (Bật/Tắt). Nếu Tắt, các ô chọn giờ bị mờ và không thể tương tác. |
| | Giờ mở cửa | Khi isOpen = true | Định dạng HH:mm | |
| | Giờ đóng cửa | Khi isOpen = true | Phải > Giờ mở cửa | Định dạng HH:mm. |

### 3.2. Nút thao tác (Form Actions)
| Nút | Loại | Vị trí | Logic xử lý |
|-----|------|--------|-------------|
| Lưu cài đặt | Primary | Góc trên hoặc dưới cùng | Cập nhật cấu hình 7 ngày xuống hệ thống lưu trữ. |
| Khôi phục mặc định | Ghost | Bên cạnh nút Lưu | Reset về khung giờ chuẩn (VD: 08:00 - 21:00 cho cả 7 ngày). |

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Nhập Giờ đóng cửa nhỏ hơn Giờ mở cửa (VD: 21:00 đến 08:00) | Báo lỗi inline: "Giờ đóng cửa phải lớn hơn giờ mở cửa". Ngăn không cho lưu. |
| 4.2 | Bỏ trống giờ trong ngày isOpen = true | Báo lỗi inline: "Vui lòng nhập đầy đủ khung giờ hoạt động". |

---

## 5. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Tắt ngày nghỉ | Tắt công tắc ngày Chủ Nhật | Ô Giờ mở cửa và Giờ đóng cửa của ngày Chủ Nhật bị mờ đi và không thể tương tác, không cho nhập. |
| AC-02 | Chặn logic giờ | Chọn giờ mở cửa 20:00, giờ đóng cửa 18:00 | Ngay lập tức hiện dòng báo lỗi chữ đỏ. Nút Lưu bị vô hiệu hóa. |
| AC-03 | Lưu thành công | Điền giờ hợp lệ và bấm Lưu | Hệ thống ghi nhận thành công, hiển thị thông báo "Đã cập nhật giờ hoạt động", dữ liệu giữ nguyên sau khi tải lại trang. |
