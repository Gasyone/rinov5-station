---
title: "Năng lực Báo cáo & Phân tích"
type: "Capability"
domain: "CAP-RPT"
status: "Active"
id: "CAP-RPT"
parent_br: "TBD-NEEDS-BR"
---

# Capability: Năng lực Báo cáo & Phân tích

**ID:** `CAP-RPT`  
**Domain:** Báo cáo & Phân tích  
**Phân loại:** Năng lực Hỗ trợ

---

## 1. Mục tiêu & Phạm vi

Tổng hợp dữ liệu từ mọi phân hệ để cung cấp góc nhìn toàn cảnh cho các cấp quản lý từ Quản lý Chi nhánh đến Ban lãnh đạo.

**Phạm vi:** Từ thiết kế chỉ số đo lường, tổng hợp kho dữ liệu, đến xuất bản báo cáo trực tiếp hoặc định kỳ.

## 2. Thực thể Dữ liệu cốt lõi

*   **Chỉ số / Thước đo:** Chỉ số đo lường (Doanh thu, Tỷ lệ chuyển đổi, Tỷ lệ rời bỏ).
*   **Bảng điều khiển:** Bảng tổng hợp trực quan cho quản lý.
*   **Mẫu báo cáo:** Mẫu xuất ra tập tin (bảng tính, tài liệu).

## 3. Tuân thủ Tiêu chuẩn (Policy Compliance)

Khối năng lực này chịu sự ràng buộc của các điều luật cốt lõi trong `ENTERPRISE_STANDARDS.md`:
1. **Tuân thủ `[POLICY-ORG-01]`:** Quản lý chi nhánh A chỉ xem được báo cáo chi nhánh A, không xem được toàn chuỗi.

**Nguyên tắc riêng của Báo cáo:**
1. **Chỉ đọc:** Năng lực Báo cáo tuyệt đối không sửa đổi dữ liệu của bất kỳ phân hệ nào. Chỉ trích xuất và biến đổi.
2. **Phân quyền dữ liệu nghiêm ngặt:** Dữ liệu báo cáo phải tuân thủ ranh giới phân quyền theo chi nhánh.

## 4. Kiến trúc & Nguyên tắc cốt lõi

Khối Báo cáo vận hành theo mô hình **Thu thập → Biến đổi → Hiển thị**:
- **Thu thập:** Trích xuất dữ liệu từ toàn bộ các Khối Năng lực khác.
- **Biến đổi:** Tính toán chỉ số, tổng hợp theo chiều (thời gian, chi nhánh, sản phẩm).
- **Hiển thị:** Xuất bản bảng điều khiển trực quan và mẫu báo cáo.

## 5. Giao tiếp Liên miền (Cross-Capability Interactions)

*   👉 **Cung cấp dữ liệu cho:**
    - Ban lãnh đạo: Bảng điều khiển và báo cáo kinh doanh.
*   👈 **Nhận dữ liệu từ:**
    - **Toàn bộ Khối Năng lực:** Bán hàng (`CAP-COM`), Vận hành (`CAP-OPS`), Nhân sự (`CAP-HR`), Tài chính (`CAP-FIN`), v.v.

## 6. Phân ranh giới Sở hữu Dữ liệu

| Dữ liệu | Khối này sở hữu | Thuộc khối khác |
|----------|-----------------|-----------------|
| Định nghĩa Chỉ số | ✅ | |
| Mẫu báo cáo | ✅ | |
| Bảng điều khiển | ✅ | |
| Dữ liệu gốc (Đơn hàng, Điểm danh...) | | → Các CAP tương ứng |

## 7. Danh sách Phân hệ Nghiệp vụ (Business Functions)

| Mã BF | Tên Phân hệ Nghiệp vụ | Trạng thái |
|-------|------------------------|------------|
| `BF-RPT-01` | Báo cáo Tổng hợp & Phân tích | ⏳ Chờ làm |
