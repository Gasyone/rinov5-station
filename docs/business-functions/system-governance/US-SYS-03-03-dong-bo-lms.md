---
id: US-SYS-03-03
title: Đồng bộ thiết bị với LMS
bf: BF-SYS-03
domain: CAP-SYS
status: defined
tags: [sys, device, lms, pairing, health-check]
---

# US-SYS-03-03: Đồng bộ thiết bị với LMS (Device Pairing & Health Check)

> **Tuân thủ Tiêu chuẩn:**
> - `[POLICY-IAM-02]` Default Deny — Chỉ System Admin thực hiện pairing.

## Bối cảnh (Context)
- **Vị trí:** Trang chi tiết thiết bị → Tab "LMS Integration"
- **Mục đích:** Ghép thiết bị với hệ thống LMS để sẵn sàng cho phiên test online (Booking Test). Kiểm tra sức khỏe thiết bị.

## Actor
- System Admin

## User Story
> Với vai trò System Admin, tôi muốn ghép thiết bị với LMS và kiểm tra trạng thái sức khỏe, để đảm bảo thiết bị sẵn sàng khi học viên đến test đầu vào.

## Giao diện dự kiến (Expected UI/UX)
- **Section Pairing:** Trạng thái pairing (Paired / Unpaired), Nút [Pair với LMS] / [Unpair], Mã LMS Device ID.
- **Section Health Check:** Kết nối mạng (Online/Offline), Phiên bản phần mềm, Dung lượng pin cuối cùng, Lần check cuối.
- **Nút [Chạy Health Check]:** Gửi tín hiệu kiểm tra đến thiết bị thông qua dịch vụ LMS, cập nhật trạng thái.

## Acceptance Criteria
1. Chỉ thiết bị ở trạng thái `available` mới được Pair.
2. Hiển thị rõ ràng trạng thái Paired/Unpaired bằng badge.
3. Health Check hiển thị kết quả: Online (xanh) / Offline (đỏ) / Unknown (xám).
4. Nếu thiết bị Offline quá 7 ngày → cảnh báo "Cần kiểm tra".
5. Ghi log mỗi lần Pair/Unpair/Health Check.
