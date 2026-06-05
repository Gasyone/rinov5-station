---
id: US-ACD-07-02
title: "Thiết lập Lịch nghỉ lễ Học thuật"
bf: BF-ACD-07
domain: CAP-ACD
status: draft
tags: [acd, setup, holidays, calendar]
---

# US-ACD-07-02: Thiết lập Lịch nghỉ lễ Học thuật (Academic Holidays)

> **Tham chiếu:** BF-ACD-07 · Giao diện Mẫu §4.2 (Danh sách)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Trưởng phòng Học thuật, **tôi muốn** cập nhật danh sách các ngày nghỉ lễ trên toàn hệ thống (như Tết, Lễ Quốc khánh), **để** hệ thống tự động loại trừ các ngày này và không xếp lịch dạy/học vào ngày nghỉ.

---

## 2. Kiến trúc Giao diện & Kỹ thuật

- **Thành phần Giao diện chính:** Danh sách và Nút tạo mới (Bảng dữ liệu kết hợp Hộp thoại nổi).
- **Quản lý dữ liệu:** Liên kết trực tiếp ngày bắt đầu và kết thúc kỳ nghỉ.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Bảng danh sách Ngày nghỉ lễ

| Cột (Column) | Loại hiển thị | Trường Dữ liệu | Ghi chú / Định dạng |
|--------------|---------------|----------------|---------------------|
| Tên kỳ nghỉ | Văn bản | `name` | VD: "Nghỉ Tết Nguyên Đán" |
| Từ ngày | Ngày tháng | `startDate` | |
| Đến ngày | Ngày tháng | `endDate` | |
| Số ngày nghỉ | Con số | `duration` | Hệ thống tự tính từ ngày bắt đầu đến ngày kết thúc |
| Trạng thái | Nhãn màu | `status` | Áp dụng / Hết hạn / Đã hủy |

### 3.2. Hộp thoại Thêm/Sửa Ngày nghỉ

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc kiểm tra |
|------------|---------------|----------|----------------|----------------------------|
| Tên kỳ nghỉ | Ô nhập chữ | Có | `name` | Tối đa 255 ký tự. |
| Khoảng thời gian | Bộ chọn ngày (Từ - Đến) | Có | `startDate`, `endDate` | Ngày kết thúc không được trước ngày bắt đầu. |

---

## 4. Quy tắc Nghiệp vụ cốt lõi

1. **[RULE-ACD-HOL-01] Vùng cấm xếp lịch:** Hệ thống Vận hành (`CAP-OPS`) khi sinh lịch học tự động bắt buộc phải kiểm tra mảng ngày nghỉ này. `NẾU` một buổi học rơi vào ngày nghỉ `THÌ` buổi học đó sẽ tự động dời sang ngày tiếp theo của tuần sau.
2. **[RULE-ACD-HOL-02] Không trùng lặp:** Không cho phép tạo 2 kỳ nghỉ lễ có khoảng thời gian đè lên nhau (Overlap).

---

## 5. Tiêu chí Nghiệm thu
- [ ] Giao diện cho phép tạo và sửa khoảng thời gian nghỉ lễ.
- [ ] Hệ thống chặn và báo lỗi màu đỏ nếu Ngày bắt đầu lớn hơn Ngày kết thúc.
- [ ] Việc xếp lịch tự động bỏ qua chính xác các ngày đã được thêm vào đây.
