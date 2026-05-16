# BF-ENR-02: Học thử ghép buổi (Trial Session)

> **Capability:** CAP-ADM
> **Giai đoạn:** 5 — Tuyển sinh & Bán hàng
> **Nhóm sidebar:** Quản lý sự kiện
> **Menu ID:** `trial_class`

---

## 1. Mô tả nghiệp vụ

Quản lý toàn bộ vòng đời của một vé học thử (Trial Booking) theo mô hình **Ghép buổi** (Trial Session). 
Lead (Học viên tiềm năng) sẽ được sắp xếp tham gia trải nghiệm trực tiếp vào một buổi học (Session) của một Lớp chính thức đang vận hành để đánh giá sự phù hợp trước khi quyết định ghi danh.

## 2. Đối tượng sử dụng (Actors)

- Sale (Tư vấn viên)
- Branch Manager / CSM (Giáo vụ/Quản lý - người xếp lớp)
- Teacher / Lễ tân (Giáo viên / Điểm danh)

## 3. Phạm vi (Scope)

### Trong phạm vi (In Scope)

- Ghi nhận nhu cầu học thử từ Lead (Môn học, cơ sở, thời gian).
- Quản lý danh sách Booking Học thử theo các trạng thái vòng đời.
- Thực hiện ghép nối (Assignment) Booking vào một Lớp & Buổi học cụ thể (có kiểm tra sĩ số, độ tuổi).
- Xử lý các nghiệp vụ ngoại lệ: Đổi lịch, Đổi lớp, Hủy lịch học thử.
- Ghi nhận điểm danh (có mặt/vắng mặt) cho riêng học viên học thử tại lớp.
- Giáo viên điền form đánh giá, nhận xét năng lực sau buổi học.

### Ngoài phạm vi (Out of Scope)

- Tạo lớp học thử riêng biệt (Dedicated Trial Class).
- Tư vấn chốt Sale, tạo Đơn hàng và Thu tiền (Xử lý tại `BF-SAL-01` và `BF-SAL-02`).
- Xếp lớp học chính thức dài hạn (Xử lý tại `BF-CLS-01` - Xếp lớp).

## 4. Nghiệp vụ liên quan

- **Upstream:** `BF-CRM-01` (Cung cấp hồ sơ Lead để tạo lịch).
- **Downstream:** `BF-SAL-01` (Tạo đơn hàng sau khi Lead quyết định học), `BF-CLS-01` (Xếp lớp chính thức).
- **Related:** `BF-CLS-02` (Cung cấp danh sách Lớp), `BF-CLS-05` (Sử dụng chung UI Điểm danh).

## 5. User Stories

| Tài liệu | Tên User Story | Giai đoạn | Trạng thái |
|----------|----------------|-----------|------------|
| [US-ENR02-01](./US-ENR02-01-quan-ly-danh-sach-booking-hoc-thu.md) | Quản lý danh sách và Xem chi tiết Booking | 1. Quản lý | ✅ Đã có |
| [US-ENR02-02](./US-ENR02-02-tao-moi-booking-hoc-thu.md) | Tạo mới Booking học thử (Ghi nhận nhu cầu) | 1. Quản lý | ✅ Đã có |
| [US-ENR02-03](./US-ENR02-03-thao-tac-ghep-lop-va-buoi-hoc.md) | Thao tác Ghép lớp và Buổi học (Assignment) | 2. Sắp xếp | ✅ Đã có |
| [US-ENR02-04](./US-ENR02-04-xu-ly-ngoai-le-booking.md) | Xử lý ngoại lệ (Đổi buổi, Đổi lớp, Hủy lịch) | 2. Sắp xếp | ✅ Đã có |
| [US-ENR02-05](./US-ENR02-05-giao-vien-nhan-xet-va-tra-ket-qua.md) | Giáo viên nhận xét và Trả kết quả | 3. Đánh giá | ✅ Đã có |

## 6. Luồng vận hành tổng thể (End-to-End Flow)

> Xem chi tiết luồng vận hành tại: [FLOW-ENR-02: Vòng đời Học thử Ghép buổi](./FLOW-ENR-02-hoc-thu-ghep-buoi.md)

## 7. Quy tắc nghiệp vụ (Business Rules)

1. **Kiểm soát sĩ số:** Booking học thử chiếm 1 "slot cứng" của buổi học đó. Tổng số (HV chính thức + HV học thử) không được vượt quá Capacity tối đa của phòng/lớp.
2. **Quyền ghép lớp:** Sale có thể tạo nhu cầu, nhưng quyền thực hiện "Ghép lớp" (Assign) thường được phân cho Giáo vụ (CSM) hoặc Quản lý (BM) để kiểm soát chất lượng lớp.
3. **Phân biệt Roster:** Học viên học thử chỉ tồn tại trong danh sách của 1 Session duy nhất. Không được lưu vào danh sách học viên chính thức (Roster) của Class.

## 8. Dữ liệu chính (Key Data)

| Entity | Mô tả |
|--------|-------|
| `TrialBooking` | Thực thể chính. Nối `Lead` với `Class` và `Session`. Trạng thái: Pending, Confirmed, Cancelled, Reschedule, Completed. |
| `TeacherFeedback` | Record ghi nhận đánh giá của giáo viên (Rubric điểm, Text nhận xét) gắn với `TrialBooking`. |
