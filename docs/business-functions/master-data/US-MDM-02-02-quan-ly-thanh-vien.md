---
id: US-MDM-02-02
title: Thêm / Bớt thành viên vào Hộ gia đình
bf: BF-MDM-02
domain: CAP-MDM
status: defined
tags: [mdm, household, members, person-link]
---

# US-MDM-02-02: Thêm / Bớt thành viên vào Hộ gia đình (Manage Household Members)

> **Tuân thủ Tiêu chuẩn:**
> - `[POLICY-MDM-04]` Party Data Model — Household chỉ chứa tham chiếu đến Person, không nhân bản PII.
> - `[POLICY-MDM-01]` Golden Record — Person phải tồn tại trước khi thêm vào Household.

## Bối cảnh (Context)
- **Vị trí:** Trang chi tiết Household → Tab "Thành viên"
- **Mục đích:** Gom nhóm các cá nhân có quan hệ gia đình vào cùng 1 Household Account. VD: Bố + Mẹ + 2 con → 1 Household.

## Actors
- Sale, CSM

## User Story
> Với vai trò Sale, tôi muốn thêm các Person (đã có trong hệ thống) vào một Hộ gia đình, để gom nhóm học viên cùng gia đình phục vụ gộp bill và quản lý quan hệ.

## Giao diện dự kiến (Expected UI/UX)
- **Danh sách thành viên hiện tại:** Bảng: Avatar, Tên, Vai trò trong GĐ (Bố/Mẹ/Con), Billing Account (⭐), Guardian (🛡️), Actions.
- **Nút [+ Thêm thành viên]:** Ô tìm kiếm Person (autocomplete từ `BF-MDM-01`). Sau khi chọn Person → popup chọn Vai trò (Bố/Mẹ/Con/Ông/Bà/Khác).
- **Nút [Xóa khỏi GĐ]:** Gỡ Person khỏi Household (Person vẫn tồn tại trong hệ thống, chỉ mất liên kết Household).

## Acceptance Criteria
1. Chỉ thêm được Person đã tồn tại (không tạo Person mới từ form này).
2. 1 Person có thể thuộc tối đa 1 Household (không cho thêm nếu đã có Household khác).
3. Khi xóa thành viên cuối cùng → cảnh báo "Household sẽ trống, bạn có muốn xóa Household?"
4. Bắt buộc chọn Vai trò khi thêm thành viên.
5. Cập nhật realtime số lượng thành viên trên danh sách Household.
