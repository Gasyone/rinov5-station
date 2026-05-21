---
id: US-SYS-01-04
title: "Reset mật khẩu cho user khác"
bf: BF-SYS-01
domain: CAP-SYS
status: standardized
tags: [sys, ilm, user-account, password-reset, action]
---

# US-SYS-01-04: Reset mật khẩu cho user khác (Admin Password Reset)

> **Tham chiếu:** BF-SYS-01 · Design System §4.4 Form Pattern

## 1. User Story
**Là một** System Admin, **tôi muốn** reset mật khẩu cho tài khoản của user khác, **để** họ có thể đăng nhập trở lại khi quên mật khẩu.

---

## 2. Đề xuất Kiến trúc Kỹ thuật (Dev/AI Architecture)

- **UI Component:** `Dialog` (Shadcn).
- **Form Library:** `react-hook-form` + `zod`.
- **Data Binding:** Data Submit gửi: `{ accountId: string, newPasswordHash: string, forceChange: boolean }`.
- **Đề xuất tách file:** `AdminResetPasswordDialog.tsx`.

---

## 3. Cấu trúc Giao diện (Form Layout)

**Bố cục:** 1 Cột. Dialog cỡ vừa.

### 3.1. Các trường nhập liệu (Inputs)

| Tên trường | UI Component | Bắt buộc | Data Binding | Ghi chú & Logic Validation |
|------------|--------------|----------|--------------|----------------------------|
| Mật khẩu mới | `PasswordInput` | Có | `newPasswordHash` | Có nút Auto-generate. Thanh độ mạnh MK. |
| Bắt buộc đổi MK | `Checkbox` | Không | `forceChange` | Mặc định Checked. Admin có thể uncheck (khác với lúc Tạo mới bắt buộc check). |

### 3.2. Footer (Nút hành động)
| Nút | Loại | Action Logic |
|-----|------|--------------|
| Hủy bỏ | `Button(variant="outline")` | Đóng Dialog. |
| Xác nhận | `Button` | Check độ mạnh MK. Pass -> Đổi MK. Đóng Modal. Hiển thị Popup kết quả chứa MK mới + nút Copy. |

---

## 4. Quy tắc Nghiệp vụ & Validation (Business Rules)

1. **[RULE-ACT-01] Password Strength:** `IF` độ mạnh MK < 'Fair' `THEN` chặn submit.
2. **[RULE-ACT-02] Locked Override:** Reset mật khẩu KHÔNG tự động mở khóa tài khoản (nếu tài khoản đang bị Locked). Admin phải mở khóa riêng.
3. **[RULE-ACT-03] Audit Trail:** Lưu lịch sử hành động Admin reset MK.

---

## 5. Tiêu chí chấp nhận (Acceptance Criteria)
- [ ] Form hiển thị đầy đủ Input password và thanh strength meter.
- [ ] Submit thành công sẽ hiện popup Mật khẩu chỉ xem 1 lần + nút Copy.
- [ ] Bật cờ `force_change_password` đúng theo trạng thái Checkbox.
