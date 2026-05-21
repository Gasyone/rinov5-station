---
id: US-CLS03-01
title: "Quản lý danh sách Học viên cơ sở (Operational Master List)"
type: "User Story"
domain: "CAP-CLS"
bf: BF-CLS-03
status: "Draft"
tags: [user-story]
---

# US-CLS03-01: Quản lý danh sách Học viên cơ sở (Operational Master List)

> Tài liệu đang chờ biên tập

## Đề xuất Giao diện (Expected UI/UX)
- **Màn hình:** Nằm ngoài menu chính của Vận hành: "Danh sách Học viên".
- **Đề xuất UI:** 
  - **Data Grid (Bảng dữ liệu):** Liệt kê các học viên đang có trạng thái Đang học (Active) hoặc Bảo lưu (Suspended). KHÔNG hiển thị Leads hoặc Đã nghỉ học.
  - **Cột dữ liệu:** Mã HV, Tên, Lớp đang học (dạng Tag), Số dư buổi học, Tình trạng công nợ (Đỏ/Xanh).
  - **Hành động (Action Column):** Nút ba chấm (Dropdown) chứa các lệnh: 'Chuyển lớp', 'Bảo lưu', 'Xếp lớp'. (Lưu ý: Click vào các nút này sẽ gọi Pop-up/UI của nhóm nghiệp vụ BF-CLS-06 và BF-CLS-01).
  - **Click vào Tên:** Bật lên Drawer "Hồ sơ 360" lấy từ CAP-MDM.
