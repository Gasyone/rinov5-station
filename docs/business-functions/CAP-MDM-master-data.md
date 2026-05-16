# Capability: Master Data Management (Năng lực Quản trị Dữ liệu Gốc)

**ID:** `CAP-MDM`  
**Domain:** Master Data (Dữ liệu Gốc)  
**Class:** Governance Capability (Năng lực Quản trị)

## 1. Mục tiêu & Phạm vi (Goal & Scope)
Năng lực quản lý "Single Source of Truth" (Sự thật duy nhất) cho toàn bộ thực thể kinh doanh lõi (như Hồ sơ cá nhân, Gia đình, Tổ chức doanh nghiệp).
**Phạm vi:** Định danh, hợp nhất và quản lý vòng đời của một hồ sơ, bảo vệ tính duy nhất của dữ liệu (chống trùng lặp, Golden Record).

## 2. Thực thể dữ liệu cốt lõi (Key Entities)
*   **Individual Profile:** Hồ sơ cá nhân (Học viên, Phụ huynh).
*   **Family Profile:** Hồ sơ gia đình (Nhóm các cá nhân có quan hệ huyết thống/đóng chung ví tiền).
*   **Corporate Profile:** Hồ sơ doanh nghiệp (Đối tác, Khách hàng B2B).

## 3. Nguyên tắc Vận hành (Core Principles)
1. **Một Khách hàng - Một Hồ sơ:** Bất kể khách hàng học ở chi nhánh nào, hệ thống chỉ tồn tại duy nhất 1 ID Hồ sơ.
2. **Phân ly dữ liệu nghiệp vụ:** Dữ liệu cá nhân chỉ lưu tại MDM. Các hệ thống khác (SIS, ADM) chỉ lưu Reference ID, không nhân bản (duplication) thông tin PII.

## 4. Giao tiếp liên miền (Cross-Capability Interactions)
*   👉 **Hỗ trợ TOÀN BỘ các Capability khác:** Cung cấp thông tin định danh (Tên, SĐT, Email) cho ADM, SIS, CARE, FIN.

## 5. Danh sách Business Functions (BF)
| Mã BF | Tên Business Function | Trạng thái |
|-------|-----------------------|------------|
| `BF-PRF-01` | Individual Master Profile Lifecycle | ⏳ Chờ làm |
| `BF-PRF-02` | Family Profile Lifecycle | ⏳ Chờ làm |
| `BF-PRF-03` | Corporate/B2B Client Lifecycle | ⏳ Chờ làm |
