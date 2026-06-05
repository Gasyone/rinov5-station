---
title: "Năng lực Thương mại & Bán hàng"
type: "Capability"
domain: "CAP-COM"
status: "Active"
id: "CAP-COM"
parent_br: "TBD-NEEDS-BR"
---

# Capability: Năng lực Thương mại & Bán hàng

**ID:** `CAP-COM`  
**Domain:** Thương mại & Bán hàng  
**Phân loại:** Năng lực Cốt lõi

---

## 1. Mục tiêu & Phạm vi

Đóng gói sản phẩm thương mại và xử lý các cam kết mua bán của khách hàng.

**Phạm vi:** Quản lý danh mục Sản phẩm, Gói ưu đãi, chính sách giá, và quá trình lập Đơn hàng.

## 2. Thực thể Dữ liệu cốt lõi

*   **Sản phẩm / Gói ưu đãi:** Khóa học, Sản phẩm vật lý (Sách, Balo), Gói kết hợp.
*   **Đơn hàng:** Cam kết thanh toán của khách hàng đối với một hoặc nhiều Sản phẩm.
*   **Mã giảm giá / Học bổng:** Ưu đãi áp dụng khi lập đơn.

## 3. Tuân thủ Tiêu chuẩn (Policy Compliance)

Khối năng lực này chịu sự ràng buộc của các điều luật cốt lõi trong `ENTERPRISE_STANDARDS.md`:
1. **Tuân thủ `[POLICY-ORG-01]`:** Đơn hàng phải gắn chi nhánh, phân quyền theo chi nhánh.

**Nguyên tắc riêng của Thương mại:**
1. **Mọi giao dịch qua Đơn hàng:** Mọi sản phẩm hoặc dịch vụ bán ra đều phải tồn tại dưới dạng một Đơn hàng.
2. **Độc lập với Tuyển sinh:** Đơn hàng có thể sinh ra từ học viên mới (do Tuyển sinh chốt) hoặc học viên cũ mua thêm (do Chăm sóc bán thêm).

## 4. Kiến trúc & Nguyên tắc cốt lõi

Khối Thương mại vận hành theo mô hình **Đơn hàng làm trung tâm**:
- Mọi dòng tiền và cam kết đều bắt nguồn từ Đơn hàng.
- Sản phẩm là bản mẫu, Đơn hàng là bản ghi giao dịch thực tế.

## 5. Giao tiếp Liên miền (Cross-Capability Interactions)

*   👉 **Cung cấp dữ liệu cho:**
    - `CAP-FIN`: Chuyển giao Đơn hàng để tiến hành thu tiền và ghi nhận thanh toán.
    - `CAP-OPS`: Cung cấp thông tin gói đăng ký để Giáo vụ xếp lớp.
*   👈 **Nhận dữ liệu từ:**
    - `CAP-ADM`: Kết quả tuyển sinh thành công → lập Đơn hàng.
    - `CAP-CARE`: Yêu cầu tái đăng ký / mua thêm → lập Đơn hàng.

## 6. Phân ranh giới Sở hữu Dữ liệu

| Dữ liệu | Khối này sở hữu | Thuộc khối khác |
|----------|-----------------|-----------------|
| Danh mục Sản phẩm | ✅ | |
| Gói ưu đãi | ✅ | |
| Đơn hàng | ✅ | |
| Mã giảm giá / Học bổng | ✅ | |
| Phiếu thu / Thanh toán | | → `CAP-FIN` |
| Hồ sơ Học viên | | → `CAP-MDM` |

## 7. Danh sách Phân hệ Nghiệp vụ (Business Functions)

| Mã BF | Tên Phân hệ Nghiệp vụ | Trạng thái |
|-------|------------------------|------------|
| `BF-PRD-01` | Quản lý Sản phẩm & Gói ưu đãi | ✅ Chuẩn vàng |
| `BF-SAL-01` | Lập Đơn hàng | ✅ Chuẩn vàng |
