# US-ENR02-03: Thao tác Ghép lớp và Buổi học (Assignment)

## 1. Thông tin chung
- **Epic:** Học thử ghép buổi
- **Business Function:** `BF-ENR-02`
- **Menu ID:** `trial_class` (Row Action: Ghép lớp)
- **Loại:** User Story

## 2. Mục tiêu (User Story)
- **Là (As a):** CSM / Branch Manager (Người điều phối)
- **Tôi muốn (I want to):** Tìm một Lớp đang chạy và chọn một Buổi (Session) cụ thể để gắn Booking đang chờ vào.
- **Để (So that):** Xác nhận lịch học thử chính thức với khách hàng và đảm bảo lớp không bị quá tải.

## 3. Giao diện (UI/UX)
- Drawer hoặc Modal "Ghép Lớp Học Thử".
- **Step 1 - Smart Matching Lớp:** Hiển thị danh sách các Lớp thuộc Chương trình/Cơ sở của Booking. Ưu tiên Lớp đúng trình độ, có sĩ số (Current < Max).
- **Step 2 - Chọn Buổi:** Khi click vào 1 Lớp, load danh sách các Session sắp tới (Future Sessions) của Lớp đó. Hiển thị sĩ số dự kiến của buổi đó.
- **Step 3 - Xác nhận:** Điền ghi chú nội bộ cho GV và Confirm.

## 4. Acceptance Criteria (Tiêu chí nghiệm thu)
- **AC1:** Danh sách Lớp gợi ý (Matching) phải lọc chính xác theo Cơ sở và Chương trình của Booking.
- **AC2:** Session list chỉ hiển thị các buổi học ở tương lai (Start Time > Now).
- **AC3:** Nếu `(Session.Attendees + Session.TrialStudents) >= Class.Capacity`, disable nút Chọn (Hiển thị nhãn Full), trừ khi User có quyền Override.
- **AC4:** Khi xác nhận thành công, cập nhật `classId`, `sessionId`, `trialDate` vào `TrialBooking`, chuyển trạng thái sang `confirmed`.

## 5. Corner Cases
| Case ID | Tình huống | Xử lý mong muốn |
|---------|------------|-----------------|
| CC01 | Lớp không có session nào sắp tới (sắp kết thúc). | Báo "Lớp không còn buổi học nào trong tương lai". |
| CC02 | Người dùng cố tình dùng API ghép vào buổi đã qua. | Backend validate chặn lại. |
