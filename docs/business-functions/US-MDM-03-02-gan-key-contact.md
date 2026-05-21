---
id: US-MDM-03-02
title: Gán Key Contact (Person) vào Doanh nghiệp
bf: BF-MDM-03
domain: CAP-MDM
status: defined
tags: [mdm, b2b, partner, key-contact, person-link]
---

# US-MDM-03-02: Gán Key Contact (Person) vào Doanh nghiệp (Assign Key Contacts)

> **Tuân thủ Tiêu chuẩn:**
> - `[POLICY-MDM-04]` Party Data Model — Business Account chứa tham chiếu đến Person, không nhân bản PII.
> - `[POLICY-MDM-01]` Golden Record — Person phải tồn tại trước khi gán làm Key Contact.

## Bối cảnh (Context)
- **Vị trí:** Trang chi tiết Business Account → Tab "Key Contacts"
- **Mục đích:** Mỗi doanh nghiệp có nhiều người liên hệ (Giám đốc, Kế toán trưởng, HR). Cần gán các Person vào Business Account và xác định vai trò.

## Actors
- B2B Sales, Partnership Manager

## User Story
> Với vai trò B2B Sales, tôi muốn gán các Person (đã có trong hệ thống) làm Key Contact của một Doanh nghiệp, và chỉ định vai trò (Decision Maker, Finance, HR), để biết liên hệ ai khi cần.

## Giao diện dự kiến (Expected UI/UX)
- **Danh sách Key Contacts:** Bảng: Avatar, Tên Person, Chức danh tại DN, Vai trò (Decision Maker / Finance / HR / Other), SĐT (from Contact), Email (from Contact), Actions.
- **Nút [+ Gán người liên hệ]:** Ô tìm kiếm Person (autocomplete từ `BF-MDM-01`). Sau khi chọn Person → form nhập: Chức danh tại DN (text), Vai trò (dropdown).
- **Nút [Gỡ liên hệ]:** Gỡ Person khỏi Business Account (Person vẫn tồn tại).

## Acceptance Criteria
1. Chỉ gán được Person đã tồn tại trong hệ thống.
2. 1 Person có thể là Key Contact của nhiều Doanh nghiệp (quan hệ N-N).
3. Bắt buộc chọn Vai trò khi gán.
4. SĐT và Email hiển thị từ Contact của Person (read-only, không nhập lại).
5. Mỗi Business Account nên có ít nhất 1 Key Contact (cảnh báo nếu không có).
