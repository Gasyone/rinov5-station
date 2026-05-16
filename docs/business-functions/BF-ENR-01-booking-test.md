# BF-ENR-01: Booking Test

> **Capability:** CAP-ADM
> **Giai đoạn:** 5 — Tuyển sinh & Bán hàng
> **Nhóm sidebar:** Quản lý sự kiện
> **Menu ID:** `booking_test`

---

## 1. Mô tả nghiệp vụ

Đặt lịch kiểm tra đầu vào: tạo booking, quản lý danh sách, xem chi tiết, chuyển trạng thái, đánh giá English Assessment (Speaking + LWR từ LMS).

## 2. Đối tượng sử dụng (Actors)

- Sale
- Branch Manager
- Teacher

## 3. Phạm vi (Scope)

### Trong phạm vi (In Scope)

- Quản lý lịch hẹn kiểm tra năng lực (Booking Test) cho học viên tiềm năng.
- Phân bổ giáo viên coi thi và phỏng vấn.
- Đồng bộ đề thi và thu thập kết quả làm bài từ thiết bị iPad (Device Service).
- Ghi nhận điểm phỏng vấn (Speaking) và điểm bài làm hệ thống (LWR / Math).
- Tự động tổng hợp điểm và xuất Link Báo cáo Tổng thể (Report Link).

### Ngoài phạm vi (Out of Scope)

- Tư vấn lộ trình và chốt Sale dựa trên kết quả (Thuộc về `BF-SAL-03: Đánh giá năng lực`).
- Đóng phí và lên đơn hàng (Thuộc về `BF-SAL-01` và `BF-SAL-02`).

## 4. Nghiệp vụ liên quan

- **Upstream:** `BF-CRM-01: Quản lý khách hàng` (Cung cấp hồ sơ Lead để tạo booking).
- **Downstream:** `BF-SAL-03: Đánh giá năng lực` (Nhận Link báo cáo để Sale tư vấn tiếp).
- **Related:** `BF-SYS-03: Quản lý thiết bị` (Đồng bộ session bài test xuống iPad).

## 5. User Stories

| Tài liệu | Tên User Story | Trạng thái |
|----------|----------------|------------|
| [US-BT01](./US-BT01-quan-ly-danh-sach-booking-test.md) | Quản lý danh sách Booking Test | ✅ Đã có |
| [US-BT02](./US-BT02-tao-moi-booking-test.md) | Tạo mới Booking Test | ✅ Đã có |
| [US-BT03](./US-BT03-xem-cap-nhat-chi-tiet-booking.md) | Xem, cập nhật chi tiết booking | ✅ Đã có |
| [US-BT04](./US-BT04-danh-gia-english-assessment-path.md) | Đánh giá English Assessment Path | ✅ Đã có |
| [US-BT05](./US-BT05-thuc-thi-va-dong-bo-ket-qua-test-ipad.md) | Thực thi và đồng bộ kết quả test iPad | ✅ Đã có |

## 6. Luồng vận hành tổng thể (End-to-End Flow)
 
> Xem chi tiết luồng Master tại: [FLOW-ENR-00: Vòng đời Tuyển sinh](./FLOW-ENR-00-vong-doi-tuyen-sinh.md)
> Xem chi tiết luồng vận hành của Booking Test tại: [FLOW-ENR-01: Vòng đời Booking Test](./FLOW-ENR-01-booking-test.md)

## 7. Quy tắc nghiệp vụ (Business Rules)

1. **Tính duy nhất:** Một học sinh (Profile) chỉ được tồn tại **1 booking test trạng thái Active** (Assessing/Booked) tại một thời điểm để tránh trùng lịch.
2. **Khôi phục bài làm (Resume):** Bài test trên iPad nếu bị gián đoạn, hệ thống lưu trữ state cục bộ để học sinh làm tiếp.
3. **Phân quyền chấm điểm:** Chỉ giáo viên được phân công trong Booking mới có quyền nhập điểm Speaking.
4. **Điều kiện hoàn thành:** Booking chỉ chuyển trạng thái `Completed` khi thu thập đủ điểm từ iPad VÀ điểm Speaking.

## 8. Dữ liệu chính (Key Data)

| Entity | Mô tả |
|--------|-------|
| `Booking_ID` | Mã định danh lịch hẹn (vd: E0005). |
| `Test_Session_Payload` | Gói dữ liệu JSON giao tiếp với iPad (Program, Level). |
| `Subject_Scores` | Điểm thành phần: `rawScore` (Toán), `LWR`, `Speaking`. |
| `Report_Link` | URL trỏ tới trang báo cáo tổng hợp để gửi Phụ huynh. |

## 9. Ghi chú triển khai

- **Backend:** [Chưa xác định]
- **Frontend:** [Chưa xác định]
- **Tích hợp:** [Chưa xác định]
