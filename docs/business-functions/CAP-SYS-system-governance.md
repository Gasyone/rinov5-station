# Capability: System Governance (Năng lực Quản trị Hệ thống)

**ID:** `CAP-SYS`  
**Domain:** System (Hệ thống)  
**Class:** Governance Capability (Năng lực Quản trị)

## 1. Mục tiêu & Phạm vi (Goal & Scope)
Năng lực thiết lập các "luật chơi" cốt lõi cho toàn bộ nền tảng phần mềm. Đảm bảo an toàn thông tin, bảo mật dữ liệu và cấu hình hệ thống phù hợp với chính sách của doanh nghiệp.
**Phạm vi:** Bao trùm mọi khía cạnh cấu hình ứng dụng, nhưng quan trọng nhất là Phân quyền (Access Control) và Data Sharing.

## 2. Thực thể dữ liệu cốt lõi (Key Entities)
*   **User (Tài khoản truy cập):** Thực thể đăng nhập hệ thống.
*   **Role / Permission Topic (Nhóm quyền):** Tập hợp các quyền thao tác (Xem, Thêm, Sửa, Xóa).
*   **Data Scope (Phạm vi dữ liệu):** Giới hạn dữ liệu User được phép nhìn thấy (VD: Chỉ xem được data của nhánh Cầu Giấy).
*   **System Configuration (Cấu hình HT):** Các tham số hệ thống chung (Email SMTP, Cổng thanh toán, Tax rate).

## 3. Nguyên tắc Vận hành (Core Principles)
1. **Phân quyền ma trận (Matrix Access Control):** Quyền của một User là sự giao thoa giữa Quyền tính năng (Nó làm được gì) và Phạm vi dữ liệu (Nó tác động lên chi nhánh nào).
2. **Không cấp quyền trực tiếp:** Khuyến khích cấp quyền thông qua Vai trò (Role/Topic) thay vì cấp quyền lẻ tẻ cho từng tài khoản để dễ dàng quản trị ở quy mô lớn.

## 4. Giao tiếp liên miền (Cross-Capability Interactions)
*   👉 **Chi phối TOÀN BỘ các Capability khác:** Bất cứ hành động nào trong hệ thống (Tạo lớp học bên `CAP-OPS`, Xóa học viên bên `CAP-CARE`) đều phải gọi qua `CAP-SYS` để check phân quyền (Authorization) trước khi thực thi.

## 5. Danh sách Business Functions (BF)
| Mã BF | Tên Business Function (Luồng E2E) | Trạng thái |
|-------|-----------------------------------|------------|
| `BF-SYS-01` | Access Control Lifecycle (Phân quyền & Kiểm soát truy cập E2E) | ✅ Đã có US |
| `BF-SYS-02` | Platform Configuration Governance (Cấu hình nền tảng) | ⏳ Chờ làm |
| `BF-SYS-03` | Device Provisioning Lifecycle (Cấp phát & Giám sát thiết bị) | ⏳ Chờ làm |
