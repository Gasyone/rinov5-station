---
id: US-SYS-03-02
title: Gán / Chuyển thiết bị giữa chi nhánh
bf: BF-SYS-03
domain: CAP-SYS
status: defined
tags: [sys, device, assignment, transfer]
---

# US-SYS-03-02: Gán / Chuyển thiết bị giữa chi nhánh (Device Assignment & Transfer)

> **Tuân thủ Tiêu chuẩn:**
> - `[POLICY-ORG-01]` Data Scope — Thiết bị luôn gắn với 1 chi nhánh duy nhất.

## Bối cảnh (Context)
- **Vị trí:** Trang chi tiết thiết bị → Action [Chuyển chi nhánh]
- **Mục đích:** Khi trung tâm A thừa thiết bị, trung tâm B thiếu → Admin chuyển thiết bị.

## Actor
- System Admin

## User Story
> Với vai trò System Admin, tôi muốn chuyển thiết bị từ chi nhánh này sang chi nhánh khác, để cân bằng tài nguyên giữa các trung tâm.

## Giao diện dự kiến (Expected UI/UX)
- **Dialog Transfer:** Hiển thị: Thiết bị (tên + serial), Chi nhánh hiện tại → Dropdown chọn chi nhánh đích.
- **Validation:** Không cho chuyển thiết bị đang ở trạng thái `in_use` (đang trong phiên test).
- **Lịch sử chuyển:** Tab trên chi tiết thiết bị, hiển thị bảng: Từ CN → Đến CN, Ngày chuyển, Người thực hiện.

## Acceptance Criteria
1. Thiết bị chỉ gán cho đúng 1 chi nhánh tại mỗi thời điểm.
2. Sau khi chuyển, trạng thái reset về `available`.
3. Không cho chuyển thiết bị đang `in_use` — phải kết thúc phiên test trước.
4. Ghi lịch sử chuyển vào bảng `device_transfers`.
5. Branch Manager chi nhánh đích nhìn thấy thiết bị mới ngay lập tức.
