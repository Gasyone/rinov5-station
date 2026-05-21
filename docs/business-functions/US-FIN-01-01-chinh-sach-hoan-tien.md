---
id: US-FIN-01-01
title: "Thiết lập Chính sách Hoàn tiền"
bf: BF-FIN-01
domain: CAP-FIN
status: draft
tags: [fin, refund, policies, form]
---

# US-FIN-01-01: Thiết lập Chính sách Hoàn tiền (Refund Policies)

> **Tham chiếu:** BF-FIN-01 · Giao diện Mẫu §4.2 (Danh sách)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Kế toán trưởng, **tôi muốn** cấu hình danh sách các chính sách hoàn tiền học phí theo từng mốc thời gian, **để** hệ thống tự động tính toán đúng số tiền cần trả lại cho học viên khi có yêu cầu rút học phí.

---

## 2. Kiến trúc Giao diện & Kỹ thuật

- **Thành phần Giao diện chính:** Danh sách và Hộp thoại Thêm mới/Chỉnh sửa.
- **Quản lý dữ liệu:** Lưu trữ danh sách các chính sách hoàn tiền có thể áp dụng khi thanh lý hợp đồng.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Hộp thoại Thêm/Sửa Chính sách

| Tên trường | Loại hiển thị | Bắt buộc | Trường Dữ liệu | Ghi chú & Quy tắc kiểm tra |
|------------|---------------|----------|----------------|----------------------------|
| Tên chính sách | Ô nhập chữ | Có | `name` | VD: "Hoàn tiền trước ngày khai giảng". Tối đa 100 ký tự. |
| Thời hạn áp dụng | Ô nhập số | Có | `validDaysBeforeStart` | Số ngày trước (hoặc sau) khai giảng. |
| Tỷ lệ hoàn | Ô nhập số | Có | `refundPercentage` | Nhập từ 0 đến 100 (tương ứng %). |
| Trạng thái | Công tắc | Không | `isActive` | Cho phép sử dụng hay không. |

### 3.2. Nút hành động (Footer)
| Nút | Loại hiển thị | Logic xử lý |
|-----|---------------|-------------|
| Lưu | Nút màu nhấn | Kiểm tra tính hợp lệ và ghi nhận vào hệ thống. |

---

## 4. Quy tắc Nghiệp vụ cốt lõi

1. **[RULE-FIN-REF-01] Ràng buộc Tỷ lệ:** `NẾU` Tỷ lệ hoàn > 100 hoặc < 0 `THÌ` hệ thống cảnh báo và không cho phép lưu.
2. **[RULE-FIN-REF-02] Ràng buộc Ứng dụng:** Khi học viên yêu cầu hoàn tiền, hệ thống sẽ tự động đối chiếu khoảng thời gian từ hiện tại đến ngày khai giảng lớp học để đề xuất mức tỷ lệ hoàn tương ứng cao nhất đang có hiệu lực.

---

## 5. Tiêu chí Nghiệm thu
- [ ] Giao diện danh sách hiển thị đúng các thông số: Tên, Thời hạn, Tỷ lệ hoàn và Trạng thái.
- [ ] Quy tắc chặn nhập tỷ lệ ngoài khoản 0-100 hoạt động đúng.
- [ ] Có thể bật tắt trạng thái của một chính sách mà không cần xóa nó.
