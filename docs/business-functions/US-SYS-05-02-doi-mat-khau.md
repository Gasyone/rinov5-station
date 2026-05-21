---
id: US-SYS-05-02
title: Đổi mật khẩu cá nhân
bf: BF-SYS-05
domain: CAP-SYS
status: defined
tags: [sys, authn, change-password]
---

# US-SYS-05-02: Đổi mật khẩu cá nhân (Change Own Password)

> **Tuân thủ Tiêu chuẩn:**
> - `[POLICY-IAM-01]` Decoupled IAM — Đổi MK cá nhân thuộc AuthN (user tự thao tác), khác với Reset MK thuộc ILM (Admin thao tác).

## Bối cảnh (Context)
- **Vị trí:** Profile cá nhân → Mục "Bảo mật" hoặc `/app/profile/security`
- **Mục đích:** User tự đổi mật khẩu định kỳ hoặc khi bị bắt buộc đổi sau Reset MK.

## Actor
- Mọi User đã đăng nhập

## User Story
> Với vai trò một user bất kỳ, tôi muốn tự đổi mật khẩu của mình, để bảo vệ tài khoản cá nhân.

## Giao diện dự kiến (Expected UI/UX)
- **Form đổi mật khẩu:**
  - Input: Mật khẩu hiện tại (bắt buộc xác thực)
  - Input: Mật khẩu mới
  - Input: Xác nhận mật khẩu mới
  - Thanh đánh giá độ mạnh MK (Weak / Fair / Strong)
- **Nút [Đổi mật khẩu]**
- **Sau khi đổi thành công:** Thông báo "Đổi mật khẩu thành công", giữ nguyên session hiện tại.

## Acceptance Criteria
1. Phải nhập đúng mật khẩu hiện tại mới cho đổi.
2. MK mới phải khác MK hiện tại.
3. MK mới phải đáp ứng policy (8+ ký tự, chữ hoa + thường + số).
4. Xác nhận MK mới phải khớp.
5. Session hiện tại không bị hủy sau khi đổi thành công.
6. Các session khác (nếu có — đăng nhập trên thiết bị khác) bị hủy.
