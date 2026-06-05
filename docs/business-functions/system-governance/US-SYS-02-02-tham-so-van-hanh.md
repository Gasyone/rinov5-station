---
id: US-SYS-02-02
title: "Thiết lập Tham số Kỹ thuật & Bảo mật"
bf: BF-SYS-02
domain: CAP-SYS
status: standardized
tags: [sys, configuration, security, technical, form]
---

# US-SYS-02-02: Thiết lập Tham số Kỹ thuật & Bảo mật (Security & Tech Policies)

> **Tham chiếu:** BF-SYS-02 · Design System §4.4 Form Pattern

## 1. User Story
**Là một** System Admin, **tôi muốn** cấu hình các chính sách bảo mật hệ thống (như độ mạnh mật khẩu, thời gian hết hạn phiên làm việc), **để** bảo vệ an toàn dữ liệu và tuân thủ các chính sách bảo mật nội bộ.

---

## 2. Đề xuất Kiến trúc Kỹ thuật (Dev/AI Architecture)

- **UI Component:** `Card` layout chứa Form, nằm trong tab Security của hệ thống cấu hình (`/app/system_config/security`).
- **Form Library:** `react-hook-form` + `zod`.
- **Data Binding:** Gửi list Key-Value (`{ key: 'SESSION_TTL', value: 30 }`) lên hàm cập nhật.
- **Tương tác:** Tham số lưu vào DB, các Middleware bảo vệ (ở `US-SYS-05`) sẽ dựa vào đây để chặn request.

---

## 3. Cấu trúc Giao diện (Form Layout)

**Bố cục:** Full Page Form.

### 3.1. Các trường nhập liệu (Inputs)

| Tên trường | UI Component | Bắt buộc | Data Binding (Mock/State) | Ghi chú & Logic Validation |
|------------|--------------|----------|---------------------------|----------------------------|
| Thời gian Timeout | `Input(type="number")` | Có | `SESSION_TTL_MINUTES` | Thời gian không hoạt động (idle) dẫn đến tự động logout. (VD: 30, 60, 120 phút). Min = 15. |
| Mật khẩu phức tạp | `Switch` | Không | `PASSWORD_REQUIRE_COMPLEXITY` | `true`: Bắt buộc có ký tự đặc biệt, hoa, thường, số khi tạo MK mới. |
| Chiều dài MK tối thiểu | `Input(type="number")` | Có | `PASSWORD_MIN_LENGTH` | Min = 8. |
| Khóa TK khi sai MK | `Input(type="number")` | Có | `LOCKOUT_ATTEMPTS` | Số lần login sai liên tiếp bị khóa tạm (Brute-force protection). |
| Giới hạn File Upload | `Select` | Có | `MAX_UPLOAD_SIZE_MB` | Dropdown: [5MB, 10MB, 20MB, 50MB]. |

### 3.2. Footer (Nút hành động)
| Nút | Loại | Action Logic |
|-----|------|--------------|
| Khôi phục mặc định | `Button(variant="outline")` | Load lại các tham số về hardcoded default. |
| Lưu thay đổi | `Button` | Cập nhật các Key-Value vào CSDL, hiện toast. Ghi Audit Log. |

---

## 4. Quy tắc Nghiệp vụ & Validation (Business Rules)

1. **[RULE-SEC-01] TTL Bound:** Không cho phép đặt `SESSION_TTL_MINUTES` dưới 15 phút (gây phiền cho người dùng) hoặc trên 1440 phút (quá kém bảo mật).
2. **[RULE-SEC-02] Backward Compatibility:** Khi đổi cấu hình `PASSWORD_MIN_LENGTH`, nó không làm mất hiệu lực của tài khoản hiện tại, chỉ áp dụng lúc Create/Reset Password.

---

## 5. Tiêu chí chấp nhận (Acceptance Criteria)
- [ ] Giao diện form hiển thị đúng và tải được giá trị từ `mockConfigs`.
- [ ] Các input number (Thời gian, Độ dài MK) có validation chặn nhập số âm.
- [ ] Nút Khôi phục mặc định hoạt động đúng, reset UI về trạng thái an toàn nhất.
- [ ] Bấm lưu thành công hiện thông báo Toast.
