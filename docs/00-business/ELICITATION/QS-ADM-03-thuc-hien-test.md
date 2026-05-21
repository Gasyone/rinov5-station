---
id: QS-ADM-03
title: "Thực hiện & Đánh giá Test đầu vào"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-TEACHER, PERSONA-BRANCH_MANAGER"
target_output: ["BF-ENR-01 validate", "US-BT03..05 validate"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, admissions, assessment, test-execution]
---

# QS-ADM-03: Thực hiện & Đánh giá Test

> **BF:** BF-ENR-01 · **Screen:** `booking_test` (detail)
> **Hỏi:** Teacher (người chấm) + BM (người duyệt kết quả).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Ai là người chấm test? Chỉ GV hay BM cũng chấm? | Chọn nhiều | ☐ GV ☐ BM ☐ Cả hai ☐ Hệ thống tự chấm (iPad) | US-BT04/05 |
| 2 | Test được làm trên gì? | Chọn 1 | ○ iPad/Tablet ○ Giấy ○ Máy tính ○ Kết hợp | US-BT05 device |
| 3 | Kết quả test gồm những gì? | Chọn nhiều | ☐ Điểm tổng ☐ Điểm theo kỹ năng ☐ Xếp loại trình độ ☐ Nhận xét GV ☐ Khác: ___ | US-BT04 output |
| 4 | Sau khi có kết quả, ai nhận? Bằng cách nào? | Mở | ___ | US-BT03 delivery |
| 5 | Kết quả test có ảnh hưởng đến việc xếp lớp không? | Chọn 1 | ○ Bắt buộc dùng ○ Tham khảo ○ Không liên quan | BR-004 link |
| 6 | Có trường hợp test lại (retest) không? Khi nào? | Mở | ___ | BF-ENR-01 corner case |
| 7 | Điều gì khó nhất trong quy trình test hiện tại? | Mở | ___ | Pain point |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-3 | BF-ENR-01, US-BT04/05 | Validate execution flow |
| 4 | US-BT03 | Delivery kết quả |
| 5 | BR-004 | Link test → xếp lớp |
| 6-7 | BF-ENR-01 corner case + SR | Retest + pain point |
