---
title: "Năng lực Quản lý Tuyển sinh"
type: "Capability"
domain: "CAP-ADM"
status: "Active"
id: "CAP-ADM"
parent_br: "BR-004"
---

# Capability: Năng lực Quản lý Tuyển sinh

**ID:** `CAP-ADM`  
**Domain:** Tuyển sinh  
**Phân loại:** Năng lực Cốt lõi

---

## 1. Mục tiêu & Phạm vi

Quản lý các hoạt động đầu vào liên quan đến sắp xếp và tổ chức trải nghiệm/đánh giá năng lực học viên trước khi nhập học.

**Phạm vi:** Tập trung vào các nghiệp vụ Đặt lịch, Tổ chức thi đầu vào và Tổ chức học thử.
*(Các hoạt động tìm kiếm khách hàng tiềm năng và tư vấn chốt bán hàng không thuộc phạm vi này.)*

## 2. Thực thể Dữ liệu cốt lõi

*   **Lịch hẹn kiểm tra / Học thử:** Bản ghi đặt lịch thi đầu vào hoặc học thử.
*   **Kết quả đánh giá:** Điểm thi, phân loại trình độ của học viên.
*   **Nhận xét Giáo viên:** Đánh giá của giáo viên sau buổi học thử.

## 3. Tuân thủ Tiêu chuẩn (Policy Compliance)

Khối năng lực này chịu sự ràng buộc của các điều luật cốt lõi trong `ENTERPRISE_STANDARDS.md`:
1. **Tuân thủ `[POLICY-ORG-01]`:** Lịch hẹn phải gắn với chi nhánh cụ thể, phân quyền theo chi nhánh.

**Nguyên tắc riêng của Tuyển sinh:**
1. **Xếp lớp dựa trên dữ liệu:** Điểm kiểm tra hoặc kết quả học thử là cơ sở bắt buộc để đưa ra quyết định xếp lớp chính thức.
2. **Tối ưu tài nguyên:** Các buổi test và học thử phải được điều phối dựa trên sức chứa phòng/lớp và lịch trống của giáo viên.

## 4. Kiến trúc & Nguyên tắc cốt lõi

Khối Tuyển sinh hoạt động theo mô hình **Phễu chuyển đổi**:
- **Giai đoạn 1 — Thu hút:** Tiếp nhận khách hàng tiềm năng, phân loại.
- **Giai đoạn 2 — Đánh giá:** Tổ chức kiểm tra đầu vào, xác định trình độ.
- **Giai đoạn 3 — Trải nghiệm:** Tổ chức học thử, giáo viên nhận xét.
- **Giai đoạn 4 — Chuyển giao:** Trả kết quả cho bộ phận Bán hàng để tư vấn chốt.

## 5. Giao tiếp Liên miền (Cross-Capability Interactions)

*   👉 **Cung cấp dữ liệu cho:**
    - `CAP-COM`: Trả kết quả đánh giá và nhận xét để bộ phận Bán hàng tư vấn chốt.
*   👈 **Nhận dữ liệu từ:**
    - `CAP-MDM`: Hồ sơ khách hàng để tiến hành đặt lịch.
    - `CAP-ACD`: Khung chương trình, đề kiểm tra chuẩn để thực hiện đánh giá.

## 6. Phân ranh giới Sở hữu Dữ liệu

| Dữ liệu | Khối này sở hữu | Thuộc khối khác |
|----------|-----------------|-----------------|
| Lịch hẹn kiểm tra đầu vào | ✅ | |
| Lịch hẹn học thử | ✅ | |
| Kết quả đánh giá | ✅ | |
| Nhận xét giáo viên (học thử) | ✅ | |
| Hồ sơ khách hàng | | → `CAP-MDM` |
| Đề kiểm tra chuẩn | | → `CAP-ACD` |
| Đơn hàng / Hợp đồng | | → `CAP-COM` |

## 7. Danh sách Phân hệ Nghiệp vụ (Business Functions)

| Mã BF | Tên Phân hệ Nghiệp vụ | Trạng thái |
|-------|------------------------|------------|
| `BF-CRM-01` | Quản lý khách hàng tiềm năng | ⏳ Chờ làm |
| `BF-CRM-02` | Theo dõi & Tương tác bán hàng | ⏳ Chờ làm |
| `BF-ENR-01` | Kiểm tra đầu vào | ✅ Chuẩn vàng |
| `BF-ENR-02` | Học thử ghép buổi | ✅ Chuẩn vàng |
| `BF-ENR-03` | Quản lý sự kiện tuyển sinh | ✅ Chuẩn vàng |
| `BF-SAL-03` | Đánh giá năng lực & Khuyến nghị | ⏳ Chờ làm |
