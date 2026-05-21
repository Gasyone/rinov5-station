---
title: "Năng lực Quản trị Tài chính"
type: "Capability"
domain: "CAP-FIN"
status: "Active"
id: "CAP-FIN"
parent_br: "TBD-NEEDS-BR"
---

# Capability: Năng lực Quản trị Tài chính

**ID:** `CAP-FIN`  
**Domain:** Tài chính  
**Phân loại:** Năng lực Hỗ trợ

---

## 1. Mục tiêu & Phạm vi

Quản lý các luồng tiền thực tế ra vào hệ thống, kiểm soát công nợ, chính sách tài chính, và ghi nhận doanh thu kế toán.

**Phạm vi:** Từ thu tiền học viên, quản lý công nợ, đến phân bổ doanh thu và tính lương thù lao giáo viên.

## 2. Thực thể Dữ liệu cốt lõi

*   **Phiếu thu / Giao dịch thanh toán:** Bản ghi dòng tiền thực tế.
*   **Hóa đơn:** Chứng từ tài chính.
*   **Hồ sơ công nợ:** Theo dõi nợ chưa thanh toán.
*   **Chính sách tài chính:** Quy tắc hoàn tiền, chiết khấu, phân bổ doanh thu.

## 3. Tuân thủ Tiêu chuẩn (Policy Compliance)

Khối năng lực này chịu sự ràng buộc của các điều luật cốt lõi trong `ENTERPRISE_STANDARDS.md`:
1. **Tuân thủ `[POLICY-ORG-01]`:** Phiếu thu gắn chi nhánh, phân quyền theo chi nhánh.

**Nguyên tắc riêng của Tài chính:**
1. **Tách biệt Đơn hàng và Phiếu thu:** Đơn hàng (CAP-COM) là cam kết mua, Phiếu thu (CAP-FIN) là dòng tiền thực tế.
2. **Doanh thu phân bổ:** Tiền thu từ học viên là "Doanh thu chưa thực hiện", chỉ ghi nhận thành "Doanh thu thực tế" khi học viên đã học xong buổi tương ứng.

## 4. Kiến trúc & Nguyên tắc cốt lõi

Khối Tài chính vận hành theo nguyên tắc **Tách biệt Cam kết và Thực thi**:
- Đơn hàng = Cam kết mua (thuộc Thương mại).
- Phiếu thu = Dòng tiền thực tế (thuộc Tài chính).
- Doanh thu = Ghi nhận theo tiến độ học thực tế.

## 5. Giao tiếp Liên miền (Cross-Capability Interactions)

*   👉 **Cung cấp dữ liệu cho:**
    - `CAP-RPT`: Số liệu tài chính cho báo cáo kinh doanh.
*   👈 **Nhận dữ liệu từ:**
    - `CAP-COM`: Tiếp nhận Đơn hàng để lên Phiếu thu.
    - `CAP-OPS`: Dữ liệu điểm danh, số buổi đã dạy để ghi nhận doanh thu và tính lương.

## 6. Phân ranh giới Sở hữu Dữ liệu

| Dữ liệu | Khối này sở hữu | Thuộc khối khác |
|----------|-----------------|-----------------|
| Phiếu thu / Giao dịch | ✅ | |
| Hóa đơn | ✅ | |
| Hồ sơ công nợ | ✅ | |
| Chính sách tài chính | ✅ | |
| Đơn hàng | | → `CAP-COM` |
| Điểm danh / Buổi học | | → `CAP-OPS` |

## 7. Danh sách Phân hệ Nghiệp vụ (Business Functions)

| Mã BF | Tên Phân hệ Nghiệp vụ | Trạng thái |
|-------|------------------------|------------|
| `BF-FIN-01` | Thiết lập Chính sách Tài chính | ✅ Mới tạo |
| `BF-SAL-02` | Quản lý Phiếu thu & Thanh toán | ⏳ Chờ làm |
