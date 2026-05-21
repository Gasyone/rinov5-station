---
title: "Năng lực Quản trị Dữ liệu Gốc"
type: "Capability"
domain: "CAP-MDM"
status: "Active"
id: "CAP-MDM"
parent_br: "BR-003"
---

# Capability: Năng lực Quản trị Dữ liệu Gốc

**ID:** `CAP-MDM`  
**Domain:** Quản trị Dữ liệu Gốc  
**Phân loại:** Năng lực Quản trị

---

## 1. Mục tiêu & Phạm vi

Quản trị toàn bộ hệ sinh thái dữ liệu thực thể dựa trên mô hình **Dữ liệu Đối tác** (Party Data Model). Đảm bảo tính duy nhất, độ chính xác và khả năng truy vết của thông tin con người và tổ chức.

**Phạm vi:** Định danh, hợp nhất và quản lý vòng đời của 2 nhánh thực thể cốt lõi: Cá nhân (Person) và Tổ chức/Nhóm (Account/Household). Cung cấp dữ liệu gốc cho toàn bộ các phân hệ khác.

**Trong mô hình 3 tầng thực thể:** Khối Dữ liệu Gốc sở hữu tầng **Định danh** — trả lời câu hỏi **"Đây LÀ AI?"** (bất kể họ là học viên, phụ huynh, giáo viên hay đối tác).

## 2. Thực thể Dữ liệu cốt lõi

Dựa theo mô hình Dữ liệu Đối tác, dữ liệu chia làm 2 nhánh:
*   **Thực thể Cá nhân (Bản ghi Vàng):** Bản ghi gốc chứa thông tin bất biến/ít biến đổi của một cá nhân độc lập (Mã ID, Họ tên, Ngày sinh, Giới tính, CCCD).
*   **Thực thể Nhóm / Tài khoản:** Tập hợp các Cá nhân có chung lợi ích hoặc tài chính.
    *   **Hộ gia đình (B2C):** Quản lý mạng lưới quan hệ (Cha mẹ - Con cái, Anh chị em) và định nghĩa Người thanh toán.
    *   **Tổ chức Đối tác (B2B):** Quản lý đối tác, trường liên kết, nhà cung cấp.

## 3. Tuân thủ Tiêu chuẩn (Policy Compliance)

Khối năng lực này chịu sự ràng buộc của các điều luật cốt lõi trong `ENTERPRISE_STANDARDS.md`:
1. **Tuân thủ `[POLICY-MDM-01]`:** Nguyên tắc Bản ghi Vàng. Bất kể khách hàng học ở chi nhánh nào, hệ thống chỉ tồn tại duy nhất 1 Mã định danh (Person ID).
2. **Tuân thủ `[POLICY-MDM-02]`:** Phân ly Bản dạng (Định danh) và Liên hệ. Không gộp SĐT/Email vào chung một bảng với Bản dạng.
3. **Tuân thủ `[POLICY-MDM-03]`:** Tách biệt 3 tầng Thực thể (Hồ sơ cá nhân — Nhân sự — Tài khoản).
4. **Tuân thủ `[POLICY-MDM-04]`:** Mô hình Dữ liệu Đối tác. Phân tách rõ Cá nhân và Nhóm.

## 4. Kiến trúc & Nguyên tắc cốt lõi

Khối Dữ liệu Gốc vận hành theo nguyên tắc **Tập trung hóa Dữ liệu (Centralized Data)**:
- Nguồn sự thật duy nhất (Single Source of Truth) cho mọi thực thể.
- Mọi dữ liệu định danh sinh ra từ các phân hệ khác (tạo khách hàng tiềm năng, đăng ký mới) đều phải đối soát để tránh trùng lặp trước khi cấp Mã định danh.

## 5. Giao tiếp Liên miền (Cross-Capability Interactions)

*   👉 **Cung cấp dữ liệu cho:**
    - `CAP-HR`: Cung cấp Hồ sơ cá nhân khi tiếp nhận nhân sự.
    - `CAP-SYS`: Cung cấp Hồ sơ cá nhân khi tạo Tài khoản truy cập.
    - `CAP-FIN`: Cung cấp Hộ gia đình để gộp hóa đơn học phí cho anh chị em ruột.
    - **Toàn bộ Khối Năng lực khác:** Thông tin định danh (Tên, SĐT, Email).
*   👈 **Nhận dữ liệu từ:**
    - `CAP-ADM`, `CAP-CARE`, `CAP-COM`: Yêu cầu tạo mới hoặc cập nhật thông tin định danh.

## 6. Phân ranh giới Sở hữu Dữ liệu

| Dữ liệu | Khối này sở hữu | Thuộc khối khác |
|----------|-----------------|-----------------|
| Định danh (Tên, Ngày sinh, CCCD, Ảnh đại diện) | ✅ | |
| Thông tin liên hệ (SĐT, Email, Địa chỉ) | ✅ | |
| Quan hệ Hộ gia đình | ✅ | |
| Hồ sơ Tổ chức Đối tác (B2B) | ✅ | |
| Chức danh, Phòng ban, Chi nhánh | | → `CAP-HR` |
| Tên đăng nhập, Mật khẩu, Vai trò | | → `CAP-SYS` |
| Đơn hàng, Lịch học | | → Các CAP lõi |

## 7. Danh sách Phân hệ Nghiệp vụ (Business Functions)

| Mã BF | Tên Phân hệ Nghiệp vụ | Trạng thái |
|-------|------------------------|------------|
| `BF-MDM-01` | Vòng đời Định danh Cá nhân | ✅ Đã chuẩn hóa |
| `BF-MDM-02` | Quản trị Hộ gia đình & Quan hệ | ✅ Đã chuẩn hóa |
| `BF-MDM-03` | Quản trị Thực thể Tổ chức Đối tác | ✅ Đã chuẩn hóa |
