---
id: QS-ADM-02
title: "Đặt lịch Booking Test"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-SALE, PERSONA-BRANCH_MANAGER"
target_output: ["BF-ENR-01 validate", "US-BT01..02 validate", "SR-SALE tiềm năng"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, admissions, booking-test]
---

# QS-ADM-02: Đặt lịch Booking Test

> **BF:** BF-ENR-01 · **Screen:** `booking_test`
> **Hỏi:** Sale (người tạo booking) + BM (người duyệt/theo dõi).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Ai là người tạo booking test? Chỉ Sale hay BM cũng tạo? | Chọn nhiều | ☐ Sale ☐ BM ☐ Lễ tân ☐ Khác: ___ | BF-ENR-01 §2 Vai trò |
| 2 | Khi tạo booking, bạn cần nhập những thông tin gì? | Chọn nhiều | ☐ Tên HV ☐ SĐT phụ huynh ☐ Ngày giờ ☐ Môn ☐ Chi nhánh ☐ GV chấm ☐ Khác: ___ | US-BT02 §3 Fields |
| 3 | Bạn chọn ngày giờ test dựa trên gì? | Chọn nhiều | ☐ Lịch trống GV ☐ Lịch trống phòng ☐ Yêu cầu phụ huynh ☐ Tự chọn bất kỳ | US-BT02 logic |
| 4 | Có bao giờ bị trùng lịch test không? Xử lý thế nào? | Mở | ___ | BF-ENR-01 Business Rule |
| 5 | Sau khi tạo booking, phụ huynh được thông báo bằng cách nào? | Chọn nhiều | ☐ SMS ☐ Zalo ☐ Email ☐ Gọi điện ☐ Không thông báo | US-BT02 notification |
| 6 | Trung bình 1 tuần cơ sở có bao nhiêu booking test? | Số | ___ booking/tuần | Performance baseline |
| 7 | Có trường hợp nào phụ huynh đặt rồi không đến (no-show)? Tỷ lệ? | Có/Không + % | ○ Có (~___%) ○ Hiếm ○ Không | BF-ENR-01 corner case |
| 8 | Khi HV đã có trong hệ thống (đã từng test), bạn tìm lại bằng cách nào? | Mở | ___ | BR-003 (Golden Record) |
| 9 | Điều gì khiến việc đặt lịch test mất thời gian nhất? | Mở | ___ | Pain point → SR |
| 10 | Nếu cải thiện 1 thứ trong quy trình đặt test, bạn chọn gì? | Mở | ___ | SR ưu tiên |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-3 | BF-ENR-01, US-BT02 | Validate fields + logic |
| 4 | BF-ENR-01 Business Rules | Xung đột lịch |
| 5 | US-BT02 | Notification flow |
| 6-7 | BR-004 baseline | Volume + no-show rate |
| 8 | BR-003 | Dedup khi tạo booking |
| 9-10 | SR-SALE tiềm năng | Pain point mới |
