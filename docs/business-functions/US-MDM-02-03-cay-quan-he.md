---
id: US-MDM-02-03
title: Thiết lập Cây quan hệ & Phân vai trò (Billing / Guardian)
bf: BF-MDM-02
domain: CAP-MDM
status: defined
tags: [mdm, household, relationship-graph, billing, guardian]
---

# US-MDM-02-03: Thiết lập Cây quan hệ & Phân vai trò (Relationship & Roles)

> **Tuân thủ Tiêu chuẩn:**
> - `[POLICY-MDM-04]` Party Data Model — Household phải xác định rõ Billing Account và Primary Guardian.

## Bối cảnh (Context)
- **Vị trí:** Trang chi tiết Household → Tab "Quan hệ & Vai trò"
- **Mục đích:** Xác định cây quan hệ giữa các thành viên (Ai là bố/mẹ của ai, ai là anh/chị em). Phân vai trò hành chính: ai trả tiền, ai nhận thông báo.

## Actors
- Sale, CSM

## User Story
> Với vai trò Sale/CSM, tôi muốn thiết lập quan hệ giữa các thành viên và chỉ định ai là người trả tiền (Billing), ai là người nhận thông báo (Guardian), để phân hệ Tài chính và Chăm sóc hoạt động chính xác.

## Giao diện dự kiến (Expected UI/UX)
- **Sơ đồ quan hệ (Relationship Graph):** Hiển thị dạng cây hoặc card, thể hiện mối quan hệ Parent → Child, Sibling.
- **Bảng vai trò hành chính:**

| Vai trò | Người được chỉ định | Ý nghĩa | Actions |
|---------|---------------------|---------|---------|
| 💰 Billing Account | Nguyễn Văn A (Bố) | Nhận hóa đơn gộp học phí | [Thay đổi] |
| 🛡️ Primary Guardian | Nguyễn Thị B (Mẹ) | Nhận SMS/Zalo thông báo | [Thay đổi] |

- **Nút [Thay đổi]:** Dropdown chọn thành viên khác trong Household.

## Acceptance Criteria
1. Mỗi Household phải có đúng 1 Billing Account và đúng 1 Primary Guardian.
2. Billing Account và Guardian có thể là cùng 1 người hoặc 2 người khác nhau.
3. Chỉ thành viên đã có trong Household mới được chỉ định vai trò.
4. Khi thay đổi Billing Account → CAP-FIN được thông báo (event).
5. Khi thay đổi Primary Guardian → CAP-CARE cập nhật SĐT nhận thông báo.
6. Quan hệ Parent-Child tự động suy ra Sibling (nếu 2 children cùng parent).

## Nguồn dữ liệu
- `BF-MDM-02` (Household) → đọc/ghi quan hệ
- `BF-MDM-01` (Person) → thông tin định danh của từng thành viên
