---
id: US-MDM-01-04
title: Hợp nhất hồ sơ trùng lặp (Merge Duplicates)
bf: BF-MDM-01
domain: CAP-MDM
status: defined
tags: [mdm, person, duplicate, merge, golden-record]
---

# US-MDM-01-04: Hợp nhất hồ sơ trùng lặp (Merge Duplicates)

> **Tuân thủ Tiêu chuẩn:**
> - `[POLICY-MDM-01]` Golden Record — Hệ thống chỉ cho phép 1 Person ID duy nhất cho 1 con người thật.

## Bối cảnh (Context)
- **Vị trí:** Màn hình quản lý Person → Section "Hồ sơ nghi trùng" hoặc Action [Merge] trên danh sách
- **Mục đích:** Khi Sale ở 2 chi nhánh khác nhau tạo Person cho cùng 1 khách hàng → hệ thống phát hiện và cho phép Admin hợp nhất.

## Actor
- System Admin (quyền Merge — hành vi đặc quyền)

## User Story
> Với vai trò System Admin, tôi muốn phát hiện và hợp nhất các hồ sơ trùng lặp thành 1 Golden Record, để đảm bảo tính duy nhất dữ liệu trên toàn hệ thống.

## Giao diện dự kiến (Expected UI/UX)
- **Section "Nghi trùng":** Danh sách các cặp Person nghi trùng (phát hiện tự động theo SĐT, Email, CCCD, hoặc Tên + DOB).
  - Mỗi cặp hiển thị: Thông tin Person A vs Person B, Độ tin cậy trùng (%), Lý do nghi trùng.
- **Màn hình Merge:** So sánh side-by-side 2 Person.
  - Cho phép chọn: Giữ lại thông tin nào cho từng trường (Tên A hay Tên B, Avatar A hay Avatar B).
  - Preview kết quả Golden Record trước khi xác nhận.
- **Nút [Hợp nhất]:** Xác nhận → Gộp tất cả Contact, lịch sử, liên kết nghiệp vụ vào 1 Person. Person bị gộp sẽ bị soft-delete.

## Acceptance Criteria
1. Chỉ System Admin mới được thực hiện Merge.
2. Hiển thị so sánh side-by-side rõ ràng trước khi merge.
3. Tất cả Contact, User Account, Enrollment, Order liên kết với Person bị gộp phải được chuyển sang Person chính.
4. Person bị gộp chuyển sang trạng thái `merged` (soft-delete) — không xóa vĩnh viễn.
5. Ghi Audit Log chi tiết: Ai merge, Person nào bị gộp vào Person nào, lúc nào.
6. Không thể undo Merge (hành vi không thể hoàn tác — hiện cảnh báo rõ).
