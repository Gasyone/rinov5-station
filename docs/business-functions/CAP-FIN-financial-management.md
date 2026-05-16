# Capability: Financial Management (Năng lực Quản trị Tài chính)

**ID:** `CAP-FIN`  
**Domain:** Finance (Tài chính)  
**Class:** Supporting Capability (Năng lực Hỗ trợ)

## 1. Mục tiêu & Phạm vi (Goal & Scope)
Năng lực quản lý các luồng tiền thực tế ra vào hệ thống, kiểm soát công nợ, chính sách chiết khấu, và ghi nhận doanh thu kế toán.
**Phạm vi:** Từ thu tiền học viên (Receipt), quản lý công nợ (Debt), đến các luồng tính lương thù lao giáo viên, và phân bổ doanh thu (Revenue Recognition).

## 2. Thực thể dữ liệu cốt lõi (Key Entities)
*   **Receipt / Payment:** Phiếu thu, giao dịch thanh toán thực tế.
*   **Invoice:** Hóa đơn tài chính.
*   **Debt Record:** Hồ sơ công nợ.

## 3. Nguyên tắc Vận hành (Core Principles)
1. **Tách biệt Đơn hàng và Phiếu thu:** Đơn hàng (CAP-ADM) là cam kết mua, Phiếu thu (CAP-FIN) là dòng tiền thực tế.
2. **Ghi nhận doanh thu phân bổ (Deferred Revenue):** Tiền thu từ học viên là "Doanh thu chưa thực hiện", chỉ được ghi nhận thành "Doanh thu thực tế" khi học viên đã học xong buổi học tương ứng.

## 4. Giao tiếp liên miền (Cross-Capability Interactions)
*   👉 **Nhận dữ liệu từ `CAP-ADM`:** Tiếp nhận Đơn hàng để lên Phiếu thu.
*   👉 **Nhận dữ liệu từ `CAP-OPS`:** Lấy dữ liệu điểm danh, số buổi đã dạy để tiến hành ghi nhận doanh thu và tính lương giáo viên.
*   👉 **Cấp dữ liệu cho `CAP-RPT`:** Cung cấp số liệu tài chính cho báo cáo kinh doanh.

## 5. Danh sách Business Functions (BF)
| Mã BF | Tên Business Function | Trạng thái |
|-------|-----------------------|------------|
| `BF-SAL-02` | Quản lý Phiếu thu & Thanh toán | ⏳ Chờ làm |
