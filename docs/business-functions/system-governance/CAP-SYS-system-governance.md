---
title: "Năng lực Quản trị Hệ thống & Phân quyền"
type: "Capability"
domain: "CAP-SYS"
status: "Active"
id: "CAP-SYS"
parent_br: "TBD-NEEDS-BR"
---

# Capability: Năng lực Quản trị Hệ thống & Phân quyền

**ID:** `CAP-SYS`  
**Domain:** Quản trị Hệ thống & Phân quyền  
**Phân loại:** Năng lực Quản trị

---

## 1. Mục tiêu & Phạm vi

Thiết lập "luật chơi" cho toàn bộ nền tảng phần mềm — quản lý tài khoản, phân quyền, xác thực, cấu hình hệ thống và quản lý thiết bị.
Theo chuẩn Quản lý Định danh và Truy cập (IAM) hiện đại, các cấu phần này được tách bạch độc lập để đảm bảo an toàn và tuân thủ Phân tách Trách nhiệm (SoD).

**Phạm vi:** Bao trùm mọi khía cạnh IAM: từ thiết lập Vai trò/Quyền hạn → Tạo Tài khoản → Đăng nhập → Kiểm tra quyền khi vận hành.

**Trong mô hình 3 tầng thực thể:** Hệ thống sở hữu tầng **Truy cập** — trả lời câu hỏi **"Được phép LÀM GÌ trên hệ thống?"**

## 2. Thực thể Dữ liệu cốt lõi

*   **Tài khoản truy cập:** Thực thể đăng nhập hệ thống. Liên kết với Hồ sơ cá nhân từ Khối Dữ liệu Chủ (CAP-MDM).
*   **Vai trò / Nhóm quyền:** Tập hợp các quyền thao tác theo phân hệ/chức năng. 
*   **Ma trận quyền:** Bản ghi ánh xạ `vai trò × phân hệ × thao tác` (xem, thêm, sửa, xóa...).
*   **Phạm vi dữ liệu:** Mức phạm vi gắn trên Vai trò: cá nhân, nhóm, cấp dưới, toàn hệ thống. Kết hợp với chi nhánh/nhóm từ CAP-HR để lọc bản ghi thực tế.
*   **Cấu hình Hệ thống:** Tham số chung (ngôn ngữ, múi giờ, thương hiệu).

## 3. Tuân thủ Tiêu chuẩn (Policy Compliance)

Khối năng lực này chịu sự ràng buộc của các điều luật cốt lõi trong `ENTERPRISE_STANDARDS.md`:
1. **Tuân thủ `[POLICY-MDM-03]`:** Phân quyền cho Tài khoản truy cập, không phải Hồ sơ cá nhân hay Nhân sự. Tạo Tài khoản KHÔNG tự động tạo Nhân sự.
2. **Tuân thủ `[POLICY-IAM-01]`:** Phân tách IAM. Tách biệt Quản lý vòng đời tài khoản, Phân quyền, và Xác thực thành các dịch vụ độc lập.
3. **Tuân thủ `[POLICY-IAM-02]`:** Mặc định cấm (Default Deny).
4. **Tuân thủ `[POLICY-IAM-03]`:** Kết hợp Vai trò và Phạm vi dữ liệu. Quyền hiệu lực là tập hợp của tất cả các Vai trò đang hoạt động.
5. **Tuân thủ `[POLICY-ORG-01]`:** Phạm vi dữ liệu = Định nghĩa cấp độ (SYS) × Bối cảnh chi nhánh/nhóm (HR).

## 4. Kiến trúc & Nguyên tắc cốt lõi

Khối Quản trị Hệ thống thiết kế theo **Kiến trúc IAM 3 Trụ cột**:
- **Trụ cột 1 — Quản lý vòng đời tài khoản:** Tạo/Khóa/Xóa tài khoản. Trả lời: "Bạn là ai trên hệ thống?"
- **Trụ cột 2 — Phân quyền & Phê duyệt:** Tạo Vai trò, Ma trận quyền, Phạm vi dữ liệu. Trả lời: "Bạn được phép làm gì?"
- **Trụ cột 3 — Dịch vụ Xác thực:** Đăng nhập, Đăng xuất, Đổi mật khẩu. Trả lời: "Chứng minh bạn là ai?"

*Sự tách biệt này đảm bảo một người không thể vừa tự tạo tài khoản vừa tự cấp quyền tối cao cho mình.*

## 5. Giao tiếp Liên miền (Cross-Capability Interactions)

*   👉 **Cung cấp dữ liệu cho:**
    - **Toàn bộ Khối Năng lực:** Mọi thao tác trong hệ thống đều phải gọi qua dịch vụ Phân quyền để kiểm tra trước khi thực thi.
*   👈 **Nhận dữ liệu từ:**
    - `CAP-HR`: Bối cảnh chi nhánh/nhóm của nhân sự để quyết định Phạm vi dữ liệu thực tế.
    - `CAP-MDM`: Chọn Hồ sơ cá nhân khi tạo Tài khoản truy cập.

## 6. Phân ranh giới Sở hữu Dữ liệu

| Dữ liệu | Khối này sở hữu | Thuộc khối khác |
|----------|-----------------|-----------------|
| Tên đăng nhập, Mật khẩu | ✅ | |
| Trạng thái tài khoản | ✅ | |
| Vai trò, Ma trận quyền | ✅ | |
| Phạm vi dữ liệu | ✅ | |
| Chia sẻ bản ghi | ✅ | |
| Cấu hình hệ thống | ✅ | |
| Quản lý thiết bị | ✅ | |
| Thông tin cá nhân (Tên, SĐT) | | → `CAP-MDM` |
| Chi nhánh, Nhóm, Phòng ban | | → `CAP-HR` |
| Logic nghiệp vụ phân hệ | | → Các CAP lõi |

## 7. Danh sách Phân hệ Nghiệp vụ (Business Functions)

| Mã BF | Tên Phân hệ Nghiệp vụ | Trạng thái |
|-------|------------------------|------------|
| `BF-SYS-01` | Quản lý Vòng đời Tài khoản | ✅ Đã chuẩn hóa |
| `BF-SYS-02` | Quản trị Cấu hình Nền tảng | ✅ Chuẩn vàng |
| `BF-SYS-03` | Cấp phát & Giám sát Thiết bị | ✅ Chuẩn vàng |
| `BF-SYS-04` | Quản lý Quyền & Phân quyền | ✅ Đã chuẩn hóa |
| `BF-SYS-05` | Dịch vụ Xác thực | ✅ Đã chuẩn hóa |
