---
id: US-SYS-05-03
title: Đăng xuất & Hủy session
bf: BF-SYS-05
domain: CAP-SYS
status: defined
tags: [sys, authn, logout, session]
---

# US-SYS-05-03: Đăng xuất & Hủy session (Logout & Session Termination)

> **Tuân thủ Tiêu chuẩn:**
> - `[POLICY-IAM-01]` Decoupled IAM — Session management thuộc AuthN.

## Bối cảnh (Context)
- **Vị trí:** Header → Avatar dropdown → [Đăng xuất]
- **Mục đích:** User kết thúc phiên làm việc, hủy session để bảo mật.

## Actor
- Mọi User đã đăng nhập

## User Story
> Với vai trò một user bất kỳ, tôi muốn đăng xuất khỏi hệ thống và hủy session hiện tại, để đảm bảo không ai truy cập tài khoản sau khi tôi rời đi.

## Giao diện dự kiến (Expected UI/UX)
- **Nút [Đăng xuất]** trong dropdown avatar ở Header.
- **Xác nhận đăng xuất:** Dialog "Bạn có chắc muốn đăng xuất?" → [Xác nhận] / [Hủy]
- **Sau khi đăng xuất:** Chuyển hướng về trang Login. Xóa phiên đăng nhập.
- **Auto-logout:** Session timeout sau 30 phút không thao tác → hiện dialog cảnh báo 5 phút trước khi hết hạn.

## Acceptance Criteria
1. Phiên đăng nhập bị xóa sau khi đăng xuất.
2. Chuyển hướng về trang Login sau khi đăng xuất thành công.
3. Không thể truy cập bất kỳ trang nào (trừ Login) sau khi đã đăng xuất (hệ thống kiểm tra phiên).
4. Auto-logout sau 30 phút inactive với dialog cảnh báo 5 phút trước.
5. Nút Back trên trình duyệt sau khi logout không hiển thị trang cũ (no cache).
