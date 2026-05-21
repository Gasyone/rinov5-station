---
title: "Năng lực Tổ chức & Nhân sự"
type: "Capability"
domain: "CAP-HR"
status: "Active"
id: "CAP-HR"
parent_br: "TBD-NEEDS-BR"
---

# Capability: Năng lực Tổ chức & Nhân sự

**ID:** `CAP-HR`  
**Domain:** Tổ chức & Nhân sự  
**Phân loại:** Năng lực Hỗ trợ

---

## 1. Mục tiêu & Phạm vi

Quản lý mối quan hệ giữa Con người và Tổ chức — xây dựng cơ cấu tổ chức, tiếp nhận/cho thôi nhân sự, phân bổ vào vị trí, quản lý quỹ thời gian.

**Phạm vi:** Từ khi thành lập chi nhánh mới, xây cây tổ chức, tiếp nhận nhân sự vào chi nhánh, cho đến khi nhân sự nghỉ việc hoặc luân chuyển. Bao gồm đăng ký lịch làm việc cho giáo viên.

**Trong mô hình 3 tầng thực thể:** Nhân sự sở hữu tầng **Vai trò / Hợp đồng** — trả lời câu hỏi **"Làm GÌ, ở ĐÂU trong tổ chức?"**

## 2. Thực thể Dữ liệu cốt lõi

*   **Chi nhánh / Cơ sở:** Đơn vị vật lý trực tiếp giảng dạy. Bao gồm phòng học, sức chứa, giờ hoạt động.
*   **Đơn vị tổ chức:** Một nút trên sơ đồ tổ chức (Khối, Vùng, Phòng ban, Tổ nhóm).
*   **Hồ sơ Nhân sự:** Liên kết hồ sơ cá nhân (từ CAP-MDM) với chức danh, chi nhánh, hợp đồng.
*   **Phân bổ tổ chức:** Gán nhân sự vào đơn vị tổ chức kèm chức danh và phạm vi dữ liệu.
*   **Đăng ký Lịch làm việc:** Quỹ thời gian rảnh/bận do giáo viên khai báo.

## 3. Tuân thủ Tiêu chuẩn (Policy Compliance)

Khối năng lực này chịu sự ràng buộc của các điều luật cốt lõi trong `ENTERPRISE_STANDARDS.md`:
1. **Tuân thủ `[POLICY-MDM-03]`:** Tách biệt 3 tầng (Hồ sơ cá nhân — Nhân sự — Tài khoản). Bắt buộc chọn hồ sơ cá nhân (từ CAP-MDM) để tạo nhân sự. Tạo nhân sự KHÔNG tự động tạo tài khoản.
2. **Tuân thủ `[POLICY-ORG-01]`:** Cung cấp bối cảnh (chi nhánh, nhóm) để CAP-SYS áp dụng bộ lọc dữ liệu.

**Nguyên tắc riêng của Nhân sự:**
1. **Gắn kết chi nhánh:** Mọi nhân sự phải được gắn với ít nhất một Chi nhánh hoặc Phòng ban. Không có nhân sự "trôi nổi".
2. **Nguồn sự thật duy nhất về thời gian:** Lịch rảnh từ Nhân sự là nguồn duy nhất để xếp lịch lớp học bên Vận hành.

## 4. Kiến trúc & Nguyên tắc cốt lõi

Khối Nhân sự thiết kế theo mô hình **3 tầng thực thể**:
- **Tầng 1 — Hồ sơ Cá nhân (Person):** Thuộc CAP-MDM, chứa thông tin cá nhân gốc.
- **Tầng 2 — Hồ sơ Nhân sự (Worker):** Thuộc CAP-HR, liên kết Person với vị trí, hợp đồng.
- **Tầng 3 — Tài khoản (User):** Thuộc CAP-SYS, cấp quyền truy cập hệ thống.

## 5. Giao tiếp Liên miền (Cross-Capability Interactions)

*   👉 **Cung cấp dữ liệu cho:**
    - `CAP-OPS`: Quỹ thời gian giáo viên để xếp lịch và kiểm tra xung đột.
    - `CAP-SYS`: Chi nhánh, nhóm, phòng ban để áp dụng phân quyền theo bối cảnh.
*   👈 **Nhận dữ liệu từ:**
    - `CAP-MDM`: Chọn hồ sơ cá nhân khi tạo nhân sự mới.

## 6. Phân ranh giới Sở hữu Dữ liệu

| Dữ liệu | Khối này sở hữu | Thuộc khối khác |
|----------|-----------------|-----------------|
| Chi nhánh, Phòng học, Sức chứa | ✅ | |
| Cây tổ chức | ✅ | |
| Chức danh, Hợp đồng | ✅ | |
| Phân bổ tổ chức | ✅ | |
| Đăng ký Lịch làm việc | ✅ | |
| Giờ hoạt động Chi nhánh | ✅ | |
| Thông tin cá nhân (Tên, SĐT, Email) | | → `CAP-MDM` |
| Tài khoản, Mật khẩu, Vai trò | | → `CAP-SYS` |
| Xếp lịch lớp học | | → `CAP-OPS` |
| Tính lương, thuế | | → `CAP-FIN` |

## 7. Danh sách Phân hệ Nghiệp vụ (Business Functions)

| Mã BF | Tên Phân hệ Nghiệp vụ | Trạng thái |
|-------|------------------------|------------|
| `BF-ORG-01` | Thiết lập Chi nhánh & Phòng học | ✅ Chuẩn vàng |
| `BF-ORG-02` | Quản trị Sơ đồ Tổ chức | ✅ Chuẩn vàng |
| `BF-HR-01` | Vòng đời Nhân sự | ✅ Đã có US |
| `BF-HR-02` | Đăng ký Quỹ thời gian | ✅ Đã chuẩn hóa |
