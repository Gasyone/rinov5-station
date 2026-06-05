---
title: "Năng lực Quản lý Cơ sở Vật chất"
type: "Capability"
domain: "CAP-FCM"
status: "Active"
id: "CAP-FCM"
parent_br: "TBD-NEEDS-BR"
---

# Capability: Năng lực Quản lý Cơ sở Vật chất

**ID:** `CAP-FCM`  
**Domain:** Cơ sở Vật chất  
**Phân loại:** Năng lực Hỗ trợ

---

## 1. Mục tiêu & Phạm vi

Quản trị vòng đời tài sản vật lý, không gian phòng học, và công tác bảo trì bảo dưỡng tại các điểm trường.

**Phạm vi:** Danh mục tài sản, kiểm tra định kỳ phòng học, và quản lý yêu cầu sửa chữa.

## 2. Thực thể Dữ liệu cốt lõi

*   **Tài sản:** Tài sản vật lý của trung tâm (Máy lạnh, Máy chiếu, Bàn ghế).
*   **Phòng học / Không gian:** Không gian phòng học, sảnh.
*   **Yêu cầu bảo trì:** Yêu cầu sửa chữa, bảo dưỡng.

## 3. Tuân thủ Tiêu chuẩn (Policy Compliance)

Khối năng lực này chịu sự ràng buộc của các điều luật cốt lõi trong `ENTERPRISE_STANDARDS.md`:
1. **Tuân thủ `[POLICY-ORG-01]`:** Tài sản gắn chi nhánh, phân quyền theo chi nhánh.

**Nguyên tắc riêng của Cơ sở Vật chất:**
1. **Định kỳ kiểm tra:** Cơ sở vật chất phải được kiểm tra theo danh mục trước khi diễn ra các buổi học.
2. **Quản trị rủi ro:** Các phòng học không đủ tiêu chuẩn (hư hỏng thiết bị chính) không được phép đưa vào xếp lịch học.

## 4. Kiến trúc & Nguyên tắc cốt lõi

Khối Cơ sở Vật chất vận hành theo mô hình **Vòng đời Tài sản**:
- **Tiếp nhận:** Đăng ký tài sản mới.
- **Vận hành:** Kiểm tra định kỳ, ghi nhận tình trạng.
- **Bảo trì:** Xử lý yêu cầu sửa chữa.
- **Thanh lý:** Gỡ bỏ tài sản hết hạn sử dụng.

## 5. Giao tiếp Liên miền (Cross-Capability Interactions)

*   👉 **Cung cấp dữ liệu cho:**
    - `CAP-OPS`: Đồng bộ danh sách Phòng học và tình trạng sử dụng để xếp lịch.
*   👈 **Nhận dữ liệu từ:**
    - `CAP-CARE`: Phụ huynh/Học viên báo cáo vấn đề cơ sở vật chất → tạo yêu cầu bảo trì.

## 6. Phân ranh giới Sở hữu Dữ liệu

| Dữ liệu | Khối này sở hữu | Thuộc khối khác |
|----------|-----------------|-----------------|
| Danh mục Tài sản | ✅ | |
| Phòng học / Không gian | ✅ | |
| Yêu cầu bảo trì | ✅ | |
| Lịch học sử dụng phòng | | → `CAP-OPS` |

## 7. Danh sách Phân hệ Nghiệp vụ (Business Functions)

| Mã BF | Tên Phân hệ Nghiệp vụ | Trạng thái |
|-------|------------------------|------------|
| `BF-QA-02` | Bảo trì & Kiểm tra Cơ sở vật chất | ⏳ Chờ làm |
