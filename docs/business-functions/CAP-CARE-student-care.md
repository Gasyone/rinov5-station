# Capability: Student Care (Năng lực Chăm sóc Học viên)

**ID:** `CAP-CARE`  
**Domain:** Care (Chăm sóc)  
**Class:** Core Operational (Vận hành Lõi)

## 1. Mục tiêu & Phạm vi (Goal & Scope)
Năng lực quản lý vòng đời chăm sóc học viên sau khi họ đã chính thức ghi danh (Enrollment) và tham gia học tập. 
**Phạm vi:** Từ lúc học viên học buổi đầu tiên, quản lý các tương tác thường xuyên (nhắn tin, gọi điện hỏi thăm), xử lý khiếu nại, cho đến quá trình thúc đẩy Tái phí (Renewal) khi học viên sắp kết thúc khóa học.

## 2. Thực thể dữ liệu cốt lõi (Key Entities)
*   **Active Student (Học viên hiện hữu):** Khách hàng đang có trạng thái "Đang học" hoặc "Bảo lưu".
*   **Care Ticket / Interaction Log:** Các vé chăm sóc và lịch sử ghi chú nội dung chăm sóc.
*   **Renewal Pipeline:** Phễu học viên sắp hết hạn học phí/buổi học cần gia hạn.

## 3. Nguyên tắc Vận hành (Core Principles)
1. **Tách biệt với CRM:** CRM giải quyết khách hàng "chưa chốt", trong khi CARE tập trung vào tối ưu hóa giá trị vòng đời khách hàng (LTV - Life Time Value) thông qua việc chăm sóc người "đã chốt".
2. **Kích hoạt tự động (Auto-trigger):** Kịch bản chăm sóc hoặc quy trình tái phí (Renewal) phải tự động nảy sinh dựa trên thời lượng học còn lại hoặc sự kiện (ví dụ: Học viên nghỉ học 3 buổi liên tiếp sẽ trigger một Care Ticket).

## 4. Giao tiếp liên miền (Cross-Capability Interactions)
*   👉 **Nhận dữ liệu từ `CAP-OPS`:** Cần biết lịch sử điểm danh, điểm số của buổi học để nhân viên Chăm sóc (CSM) có lý do gọi điện trao đổi với phụ huynh.
*   👉 **Chuyển giao cho `CAP-SALES`:** Khi quy trình Renewal thành công, học viên đồng ý đóng tiền học tiếp, luồng sẽ chuyển sang Năng lực Sales để tạo Đơn hàng/Phiếu thu mới.

## 5. Danh sách Business Functions (BF)
| Mã BF | Tên Business Function (Luồng E2E) | Trạng thái |
|-------|-----------------------------------|------------|
| `BF-CARE-01` | Student Care & Ticket Lifecycle (Chăm sóc & Xử lý khiếu nại) | ⏳ Chờ làm |
| `BF-CARE-02` | Renewal & Retention Campaign (Chiến dịch Tái phí) | ⏳ Chờ làm |
