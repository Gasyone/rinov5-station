---
id: US-SYS-03-01
title: Đăng ký & Quản lý danh sách thiết bị
bf: BF-SYS-03
domain: CAP-SYS
status: defined
tags: [sys, device, provisioning, inventory]
---

# US-SYS-03-01: Đăng ký & Quản lý danh sách thiết bị (Device Inventory)

> **Tuân thủ Tiêu chuẩn:**
> - `[POLICY-IAM-02]` Default Deny — System Admin toàn quyền, Branch Manager chỉ xem chi nhánh mình.
> - `[POLICY-ORG-01]` Data Scope — Branch Manager bị giới hạn theo chi nhánh.

## Bối cảnh (Context)
- **Vị trí:** Màn hình `/app/devices`
- **Mục đích:** Quản lý kho thiết bị (iPad/tablet) dùng cho test đầu vào tại các trung tâm.

## Actors
- System Admin (CRUD toàn bộ), Branch Manager (Xem chi nhánh mình)

## User Story
> Với vai trò System Admin, tôi muốn đăng ký thiết bị mới, xem danh sách thiết bị toàn hệ thống, và quản lý trạng thái vòng đời, để đảm bảo thiết bị sẵn sàng cho Booking Test.

## Giao diện dự kiến (Expected UI/UX)
- **Toolbar:** Ô tìm kiếm (theo tên, serial), Nút [+ Đăng ký thiết bị]
- **Bộ lọc:** Chi nhánh, Trạng thái (available / in_use / maintenance / decommissioned), Loại thiết bị
- **Bảng dữ liệu:** Tên, Serial Number, Loại, Model, Chi nhánh, Trạng thái, LMS Paired, Ngày đăng ký
- **Form đăng ký:** Tên thiết bị, Serial Number, Loại (iPad/Tablet/Laptop), Model, Chọn chi nhánh
- **Actions trên row:** [Chi tiết], [Chuyển CN], [Bảo trì], [Thu hồi]

## Acceptance Criteria
1. Serial Number unique trên toàn hệ thống — báo lỗi nếu trùng.
2. Thiết bị mới đăng ký có trạng thái mặc định `available`.
3. Branch Manager chỉ thấy thiết bị tại chi nhánh mình (Data Scope).
4. Hỗ trợ phân trang, sắp xếp theo cột.
5. Badge trạng thái có màu riêng (available=xanh, in_use=xanh dương, maintenance=vàng, decommissioned=đỏ).
