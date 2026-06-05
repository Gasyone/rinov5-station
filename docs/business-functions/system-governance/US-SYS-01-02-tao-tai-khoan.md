---
id: US-SYS-01-02
title: "Tạo tài khoản mới & Liên kết Person"
bf: BF-SYS-01
domain: CAP-SYS
status: standardized
tags: [sys, ilm, user-account, create, person-link, joiner, form]
---

# US-SYS-01-02: Tạo tài khoản mới & Liên kết Person (Create User Account — Joiner Flow)

> **Tham chiếu:** BF-SYS-01 · Design System §4.4 Form Pattern

## 1. User Story
**Là một** System Admin, **tôi muốn** tạo tài khoản đăng nhập mới cho nhân sự (liên kết với Person đã tồn tại và gán Role ban đầu), **để** nhân sự mới có thể đăng nhập và làm việc trên hệ thống với đúng quyền được cấp.

---

## 2. Đề xuất Kiến trúc Kỹ thuật (Dev/AI Architecture)

- **UI Component:** `Dialog` (Shadcn) hoặc Form Panel.
- **Form Library:** Sử dụng `react-hook-form` kết hợp `zod`.
- **Data Binding:** Data Submit gửi object: `{ personId: string, username: string, passwordHash: string, roleIds: string[] }`.
- **Đề xuất tách file:** `CreateAccountDialog.tsx`, `accountFormHelpers.ts` (lưu schema Zod).

---

## 3. Cấu trúc Giao diện (Form Layout)

**Bố cục:** 1 Cột. Render trong Dialog.

### 3.1. Các trường nhập liệu (Inputs)

| Tên trường | UI Component | Bắt buộc | Data Binding (Mock/State) | Ghi chú & Logic Validation |
|------------|--------------|----------|---------------------------|----------------------------|
| Chọn Person | `Autocomplete` | Có | `personId` | Search Person theo Tên/Email/SĐT. Nguồn: `mockPersons`. |
| Username | `Input` | Có | `username` | Gợi ý auto từ email Person (trước @). Báo lỗi nếu trùng. |
| Mật khẩu tạm | `PasswordInput` | Có | `passwordHash` | Có nút Auto-generate. Đi kèm thanh đo độ mạnh (Weak/Fair/Strong). |
| Bắt buộc đổi MK | `Checkbox` | Không | `forceChangePassword` | Mặc định: `true` (Checked). Không cho uncheck. |
| Gán Role | `MultiSelect` | Có | `roleIds` | Data list từ `mockRoles`. Ít nhất 1 role. |

### 3.2. Footer (Nút hành động)
| Nút | Loại | Action Logic |
|-----|------|--------------|
| Hủy bỏ | `Button(variant="outline")` | Đóng Dialog, reset form. |
| Tạo tài khoản | `Button` | Validate Zod. Nếu pass -> Gọi hàm Mock create, hiển thị MK tạm 1 lần duy nhất, đóng Dialog. |

---

## 4. Quy tắc Nghiệp vụ & Validation (Business Rules)

*Gợi ý Zod Schema / Logic check cho AI:*

1. **[RULE-FORM-01] Person Check:** `IF` Person đã có User Account `THEN` chặn submit, báo lỗi "Person này đã có tài khoản".
2. **[RULE-FORM-02] Unique Username:** Không cho phép Username chứa khoảng trắng. Regex: `^[a-zA-Z0-9_.]+$`. Kiểm tra trùng lặp realtime.
3. **[RULE-FORM-03] Password Strength:** `IF` Mật khẩu độ mạnh < 'Fair' `THEN` block submit.
4. **[RULE-FORM-04] Default Status:** Tài khoản mới tạo luôn có `status: 'active'`.

---

## 5. Trường hợp ngoại lệ (Corner Cases)
| # | Trường hợp (State) | Hành vi (Logic) |
|---|--------------------|-----------------|
| 5.1 | Person không có email | Không thể auto-gợi ý Username, Admin tự nhập tay. |
| 5.2 | Admin bấm ra ngoài nền (Click outside) | Chặn đóng Modal để tránh mất dữ liệu đang nhập. Phải ấn nút Hủy. |

## 6. Tiêu chí chấp nhận (Acceptance Criteria)
- [ ] Bố cục form hiển thị đúng trong Dialog Shadcn.
- [ ] Autocomplete tìm Person hoạt động đúng (đổ dữ liệu mock).
- [ ] Logic báo trùng Username và báo trùng Person hoạt động realtime.
- [ ] Validate mật khẩu (Strength bar) hoạt động.
- [ ] Khi tạo xong, hệ thống hiển thị bảng Pop-up Mật khẩu tạm (chỉ xem 1 lần) kèm nút Copy, sau đó mới refresh List Page.
