# US-ENR02-04: Xử lý ngoại lệ (Đổi buổi, Đổi lớp, Hủy lịch)

## 1. Thông tin chung
- **Epic:** Học thử ghép buổi
- **Business Function:** `BF-ENR-02`
- **Menu ID:** `trial_class` (Row Actions)
- **Loại:** User Story

## 2. Mục tiêu (User Story)
- **Là (As a):** Sale / CSM
- **Tôi muốn (I want to):** Đổi sang buổi khác, đổi sang lớp khác, hoặc Hủy lịch học thử.
- **Để (So that):** Xử lý các tình huống phát sinh từ phía khách hàng (ốm, bận) hoặc từ phía trung tâm (giáo viên nghỉ, lớp đóng cửa).

## 3. Giao diện (UI/UX)
- Menu thao tác (Dropdown) trên mỗi dòng Booking.
- **Action "Đổi buổi":** Mở popup load lại danh sách Session của lớp hiện tại.
- **Action "Đổi lớp":** Mở lại flow Ghép lớp (US-03) từ đầu.
- **Action "Hủy lịch":** Mở popup nhập Lý do hủy (Dropdown Enum: Khách bận, Đã chốt sale sớm, Trung tâm hủy) + Ghi chú text.

## 4. Acceptance Criteria (Tiêu chí nghiệm thu)
- **AC1:** "Đổi buổi" chỉ khả dụng với Booking có trạng thái `confirmed` hoặc `reschedule`.
- **AC2:** Thao tác "Đổi buổi" thành công sẽ giải phóng slot ở Session cũ và chiếm slot ở Session mới.
- **AC3:** "Hủy lịch" bắt buộc phải chọn Lý do. Sau khi hủy, Booking chuyển sang `cancelled` và giải phóng slot trong Session.

## 5. Corner Cases
| Case ID | Tình huống | Xử lý mong muốn |
|---------|------------|-----------------|
| CC01 | GV hủy Session do nghỉ đột xuất. | Hệ thống bắt event Hủy Session -> Tự động chuyển tất cả Trial Booking của Session đó sang trạng thái `reschedule` và báo Notification cho Sale. |
