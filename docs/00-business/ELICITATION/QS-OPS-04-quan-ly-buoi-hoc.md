---
id: QS-OPS-04
title: "Quản lý Buổi học (Dạy thay, Đổi phòng, Hủy, Học bù)"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER, PERSONA-TEACHER"
target_output: ["BF-OPS-03 validate", "US-OPS03-01..04 validate", "BR-002 validate"]
duration: "25 phút"
status: "Active"
tags: [questionnaire, operations, session, substitute, reschedule]
---

# QS-OPS-04: Quản lý Buổi học (Biến động)

> **BF:** BF-OPS-03 · **Screen:** `calendar_class_schedule`
> **Hỏi:** BM (xử lý) + Teacher (báo nghỉ).

---

## Câu hỏi cho BM

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Khi GV báo nghỉ đột xuất, bạn biết bằng cách nào? | Chọn nhiều | ☐ Nhắn tin ☐ Gọi điện ☐ Trên hệ thống ☐ Qua đồng nghiệp | US-OPS03-01 trigger |
| 2 | Bạn tìm GV thay bằng cách nào? | Mở | ___ | US-OPS03-01 workflow |
| 3 | Mất bao lâu từ lúc biết GV nghỉ đến khi có GV thay? | Chọn 1 | ○ < 10p ○ 10-30p ○ 30p-1h ○ > 1h ○ Đôi khi không tìm được | BR-002 §5 baseline |
| 4 | Tiêu chí chọn GV thay là gì? | Chọn nhiều | ☐ Cùng môn ☐ Cùng cấp ☐ Có slot rảnh ☐ Quen lớp ☐ Khác: ___ | US-OPS03-01 matching |
| 5 | Có bao giờ phải hủy buổi vì không tìm được GV thay? Tỷ lệ? | Có/Không + % | ○ Có (~___%) ○ Không | BR-002 §5 AC-03 |
| 6 | Khi cần đổi phòng, quy trình thế nào? | Mở | ___ | US-OPS03-02 |
| 7 | Khi hủy buổi, HV/phụ huynh được thông báo bằng cách nào? | Chọn nhiều | ☐ SMS ☐ Zalo ☐ GV nhắn ☐ Không thông báo | US-OPS03-03 notification |
| 8 | Học bù tổ chức thế nào? Ai quyết định ngày giờ? | Mở | ___ | N/A (Học bù bỏ qua) |
| 9 | Điều gì khó nhất khi xử lý biến động buổi học? | Mở | ___ | Pain point → SR |

---

## Câu hỏi cho Teacher

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| T1 | Khi cần nghỉ, bạn báo bằng cách nào? Trước bao lâu? | Mở | ___ | SR-TEACHER-002 |
| T2 | Bạn có biết ai có thể dạy thay mình không? | Chọn 1 | ○ Biết, tự đề xuất ○ Không biết, BM tìm | US-OPS03-01 |
| T3 | Bạn có muốn hệ thống gợi ý GV thay khi bạn báo nghỉ? | Chọn 1 | ○ Có, rất cần ○ Không cần, BM lo | SR-TEACHER-002 validate |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-5 | BF-OPS-03, US-OPS03-01, BR-002 | Dạy thay workflow + baseline |
| 6 | US-OPS03-02 | Đổi phòng |
| 7 | US-OPS03-03 | Hủy + notification |
| 8 | N/A | Học bù (Bỏ qua) |
| 9, T1-T3 | SR-BM-002, SR-TEACHER-002 | Pain point + validate |
