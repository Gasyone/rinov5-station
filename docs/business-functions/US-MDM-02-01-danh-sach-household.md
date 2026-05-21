---
id: US-MDM-02-01
title: Xem & Tìm kiếm danh sách Hộ gia đình
bf: BF-MDM-02
domain: CAP-MDM
status: defined
tags: [mdm, household, list, billing-account]
---

# US-MDM-02-01: Xem & Tìm kiếm danh sách Hộ gia đình (Household List)

> **Tuân thủ Tiêu chuẩn:**
> - `[POLICY-MDM-04]` Party Data Model — Household Account là container chứa các Person có chung lợi ích tài chính.

## Bối cảnh (Context)
- **Vị trí:** Màn hình `/app/mdm_households`
- **Mục đích:** Tìm kiếm và quản lý các Household Account trên hệ thống. Giúp Kế toán xác định nhóm thanh toán chung, giúp CSM hiểu mối quan hệ gia đình.

## Actors
- Sale, CSM, Kế toán

## User Story
> Với vai trò Sale/CSM, tôi muốn xem danh sách tất cả Hộ gia đình, tìm kiếm theo tên gia đình hoặc tên thành viên, để quản lý quan hệ khách hàng hiệu quả.

## Giao diện dự kiến (Expected UI/UX)
- **Toolbar:** Ô tìm kiếm (theo tên Household, hoặc tên thành viên bên trong), Nút [+ Tạo Hộ gia đình]
- **Bộ lọc:** Chi nhánh gốc, Số lượng thành viên, Có Billing Account hay chưa
- **Bảng dữ liệu:**
  - Tên Household (VD: "GĐ Nguyễn Văn A")
  - Số thành viên
  - Billing Account (Tên người trả tiền)
  - Primary Guardian (Tên người giám hộ chính)
  - Chi nhánh gốc
  - Ngày tạo
- **Actions trên row:** [Xem chi tiết], [Thêm thành viên]
- **Phân trang:** 20 record/trang

## Acceptance Criteria
1. Tìm kiếm theo tên Household hoặc tên bất kỳ thành viên bên trong.
2. Hiển thị badge số thành viên.
3. Hiển thị rõ ai là Billing Account và Primary Guardian.
4. Hỗ trợ phân trang, sắp xếp theo cột.
