# Capability: Reporting & Analytics (Năng lực Báo cáo & Phân tích)

**ID:** `CAP-RPT`  
**Domain:** Reporting (Báo cáo)  
**Class:** Supporting Capability (Năng lực Hỗ trợ)

## 1. Mục tiêu & Phạm vi (Goal & Scope)
Năng lực tổng hợp dữ liệu từ mọi phân hệ để cung cấp góc nhìn toàn cảnh (Dashboard) cho các cấp quản lý từ Branch Manager đến C-Level.
**Phạm vi:** Từ việc thiết kế các chỉ số (Metrics), tổng hợp Data Warehouse, đến xuất bản các báo cáo real-time hoặc định kỳ.

## 2. Thực thể dữ liệu cốt lõi (Key Entities)
*   **Metric / KPI:** Chỉ số đo lường (Ví dụ: Doanh thu, Tỷ lệ chuyển đổi, Tỷ lệ rời bỏ - Churn Rate).
*   **Dashboard:** Bảng điều khiển trực quan.
*   **Report Template:** Mẫu báo cáo xuất ra Excel/PDF.

## 3. Nguyên tắc Vận hành (Core Principles)
1. **Read-only (Chỉ đọc):** Năng lực RPT tuyệt đối không được phép sửa đổi dữ liệu của bất kỳ phân hệ nào. Nó chỉ trích xuất (Extract) và Biến đổi (Transform).
2. **Phân quyền dữ liệu nghiêm ngặt:** Giám đốc chi nhánh A chỉ được xem báo cáo của chi nhánh A, không được xem toàn chuỗi.

## 4. Giao tiếp liên miền (Cross-Capability Interactions)
*   👉 **Thu thập dữ liệu từ TOÀN BỘ Capability:** Lấy dữ liệu bán hàng từ `CAP-SALES`, vận hành từ `CAP-OPS`, nhân sự từ `CAP-HR`, v.v. để lên báo cáo.

## 5. Danh sách Business Functions (BF)
| Mã BF | Tên Business Function | Trạng thái |
|-------|-----------------------|------------|
| `BF-RPT-01` | Executive Reporting & Analytics | ⏳ Chờ làm |
