# US-ENR02-05: Giáo viên nhận xét và Trả kết quả

## 1. Thông tin chung
- **Epic:** Học thử ghép buổi
- **Business Function:** `BF-ENR-02`
- **Menu ID:** `class_attendance` / `teacher_app`
- **Loại:** User Story

## 2. Mục tiêu (User Story)
- **Là (As a):** Teacher
- **Tôi muốn (I want to):** Điền một form nhận xét ngắn gọn về thái độ, năng lực của bé sau khi học xong.
- **Để (So that):** Trả kết quả chuyên môn về cho Sale, làm vũ khí tư vấn chốt deal với Phụ huynh.

## 3. Giao diện (UI/UX)
- Gắn một nút "Nhận xét" (Feedback) cạnh tên học sinh học thử trên màn hình Điểm danh. (Nút này chỉ Active nếu đã điểm danh là Present).
- **Form Modal "Nhận xét học thử":**
  - Đánh giá sao (1-5 sao) hoặc Rubric: Kỷ luật, Khả năng tiếp thu, Sự tự tin.
  - Textbox (Tùy chọn): Nhận xét chi tiết điểm mạnh/yếu.
  - Dropdown: Đề xuất trình độ phù hợp (Ví dụ bé đang thử lớp A nhưng GV khuyên xuống lớp B).

## 4. Acceptance Criteria (Tiêu chí nghiệm thu)
- **AC1:** Form nhận xét chỉ mở được với các TrialBooking đã được điểm danh `Present`.
- **AC2:** Bắt buộc nhập ít nhất 1 dòng text nhận xét và 1 tiêu chí đánh giá năng lực.
- **AC3:** Khi Submit form:
  - Lưu record `TeacherFeedback`.
  - Tự động chuyển trạng thái TrialBooking sang `completed`.
  - Push Notification cho Sale phụ trách Booking đó ("Giáo viên đã nhận xét bé XYZ, xem kết quả ngay").

## 5. Corner Cases
| Case ID | Tình huống | Xử lý mong muốn |
|---------|------------|-----------------|
| CC01 | GV quên nhận xét sau buổi học. | Hệ thống chạy Job mỗi cuối ngày, báo list các HV đã học thử (Present) nhưng chưa có Feedback để nhắc GV. |
