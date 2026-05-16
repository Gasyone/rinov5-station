# Capability: Commerce & Sales (Năng lực Thương mại & Bán hàng)

**ID:** `CAP-COM`  
**Domain:** Commerce (Thương mại)  
**Class:** Core Operational (Vận hành Lõi)

## 1. Mục tiêu & Phạm vi (Goal & Scope)
Năng lực đóng gói sản phẩm thương mại và xử lý các cam kết mua bán của khách hàng.
**Phạm vi:** Quản lý danh mục Sản phẩm (Product), Gói Combo ưu đãi (Bundle), chính sách giá, và quá trình lập Đơn hàng (Order Creation).

## 2. Thực thể dữ liệu cốt lõi (Key Entities)
*   **Product / Bundle:** Khóa học, Sản phẩm vật lý (Sách, Balo), Gói Combo ưu đãi.
*   **Order (Đơn hàng):** Cam kết thanh toán của khách hàng đối với một hoặc nhiều Sản phẩm.
*   **Discount / Voucher:** Mã giảm giá, học bổng.

## 3. Nguyên tắc Vận hành (Core Principles)
1. **Order-based Lifecycle:** Mọi sản phẩm hoặc dịch vụ bán ra đều phải tồn tại dưới dạng một Đơn hàng (Order). 
2. **Độc lập với Tuyển sinh:** Đơn hàng có thể sinh ra từ học viên mới (do ADM chốt Sale) hoặc học viên cũ mua thêm khóa học (do CARE upsell).

## 4. Giao tiếp liên miền (Cross-Capability Interactions)
*   👉 **Nhận dữ liệu từ `CAP-ADM` & `CAP-CARE`:** Khi chốt Enrollment hoặc Renewal thành công, luồng sẽ chuyển sang COM để lập Order.
*   👉 **Giao tiếp với `CAP-FIN`:** Chuyển giao Đơn hàng sang cho Năng lực Tài chính để tiến hành thu tiền (Receipt) và ghi nhận thanh toán.

## 5. Danh sách Business Functions (BF)
| Mã BF | Tên Business Function | Trạng thái |
|-------|-----------------------|------------|
| `BF-PRD-01` | Quản lý Sản phẩm & Combo | ⏳ Chờ làm |
| `BF-SAL-01` | Lập Đơn hàng (Order Creation) | ⏳ Chờ làm |
