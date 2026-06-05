---
id: US-MDM-03-01
title: Xem & Quản lý danh sách Đối tác / Doanh nghiệp
bf: BF-MDM-03
domain: CAP-MDM
status: defined
tags: [mdm, b2b, partner, business-account, list]
---

# US-MDM-03-01: Xem & Quản lý danh sách Đối tác / Doanh nghiệp (B2B Account List)

> **Tuân thủ Tiêu chuẩn:**
> - `[POLICY-MDM-04]` Party Data Model — Business Account là thực thể phi-nhân-loại, tách biệt khỏi Person.

## Bối cảnh (Context)
- **Vị trí:** Màn hình `/app/mdm_partners`
- **Mục đích:** Quản lý danh sách các tổ chức/doanh nghiệp có quan hệ với RinoEdu (Trường liên kết, Khách hàng B2B, Vendor).

## Actors
- B2B Sales, Partnership Manager

## User Story
> Với vai trò B2B Sales, tôi muốn xem và quản lý danh sách tất cả Đối tác / Doanh nghiệp, tìm kiếm theo tên công ty hoặc mã số thuế, để theo dõi và phát triển quan hệ đối tác.

## Giao diện dự kiến (Expected UI/UX)
- **Toolbar:** Ô tìm kiếm (tên công ty, MST), Nút [+ Tạo Doanh nghiệp]
- **Bộ lọc:** Loại Account (B2B_Client / Partner_School / Vendor), Trạng thái (Active / Inactive)
- **Bảng dữ liệu:**
  - Tên Doanh nghiệp
  - Mã số thuế
  - Loại (B2B Client / Trường liên kết / Vendor)
  - Ngành nghề
  - Key Contact (Tên + SĐT)
  - Trạng thái
  - Ngày tạo
- **Form tạo mới:** Tên DN (bắt buộc), MST, Ngành nghề, Quy mô, Địa chỉ, Loại Account.
- **Actions trên row:** [Xem chi tiết], [Chỉnh sửa], [Vô hiệu hóa]

## Acceptance Criteria
1. MST nếu nhập phải unique trên toàn hệ thống.
2. Bắt buộc chọn Loại Account khi tạo mới.
3. Hỗ trợ phân trang, sắp xếp, lọc theo loại.
4. Badge trạng thái Active (xanh) / Inactive (xám).
