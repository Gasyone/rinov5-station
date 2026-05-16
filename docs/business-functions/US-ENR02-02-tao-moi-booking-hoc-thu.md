# US-ENR02-02: Tạo mới Booking học thử (Ghi nhận nhu cầu)

## 1. Thông tin chung
- **Epic:** Học thử ghép buổi
- **Business Function:** `BF-ENR-02`
- **Menu ID:** `trial_class` (Action Button: Tạo Booking)
- **Loại:** User Story

## 2. Mục tiêu (User Story)
- **Là (As a):** Sale
- **Tôi muốn (I want to):** Lập một phiếu đăng ký nhu cầu học thử cho khách hàng mới.
- **Để (So that):** Chuyển yêu cầu này sang bộ phận Giáo vụ (CSM) để tìm lớp và xếp lịch phù hợp.

## 3. Giao diện (UI/UX)
- Modal "Tạo Booking Học thử".
- **Form fields:**
  - Chọn Lead (Tìm kiếm từ CRM).
  - Chọn Cơ sở mong muốn.
  - Chọn Chương trình / Môn học (Dropdown).
  - Trình độ dự kiến (Optional - dựa trên kết quả test đầu vào nếu có).
  - Ghi chú thêm (VD: Khách rảnh buổi tối, bé nhát cần GV nữ).

## 4. Acceptance Criteria (Tiêu chí nghiệm thu)
- **AC1:** Bắt buộc nhập các trường: Lead, Cơ sở, Chương trình.
- **AC2:** Validate Lead: Một Lead không thể tạo 2 Booking Học thử có trạng thái "Active" (Pending/Confirmed) cho CÙNG 1 môn học.
- **AC3:** Khi Submit thành công, tạo record `TrialBooking` với trạng thái mặc định là `pending_assignment` (Chờ ghép lớp).
- **AC4:** Hệ thống tự động sinh mã Booking (VD: TR-2605-001) và hiển thị Toast thông báo thành công.

## 5. Corner Cases
| Case ID | Tình huống | Xử lý mong muốn |
|---------|------------|-----------------|
| CC01 | Lead đã có Booking trạng thái Active. | Chặn submit, báo lỗi "Lead này đang có lịch học thử chờ xử lý". |
