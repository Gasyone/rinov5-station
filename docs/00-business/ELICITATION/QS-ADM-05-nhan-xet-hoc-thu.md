---
id: QS-ADM-05
title: "Ghép buổi & Nhận xét Học thử"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-TEACHER, PERSONA-BRANCH_MANAGER"
target_output: ["BF-ENR-02 validate", "US-ENR02-03..05 validate"]
duration: "15 phút"
status: "Active"
tags: [questionnaire, admissions, trial, teacher-feedback]
---

# QS-ADM-05: Ghép buổi & Nhận xét Học thử

> **BF:** BF-ENR-02 · **Screen:** `trial_class` (detail)
> **Hỏi:** Teacher (nhận xét) + BM (ghép buổi).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | GV có biết trước HV thử sẽ vào lớp mình không? | Chọn 1 | ○ Có, được báo trước ○ Không, biết khi vào lớp | US-ENR02-03 notification |
| 2 | GV nhận xét HV thử vào lúc nào? | Chọn 1 | ○ Ngay sau buổi ○ Cuối ngày ○ Hôm sau ○ Không nhận xét | US-ENR02-05 timing |
| 3 | Nhận xét gồm những gì? | Chọn nhiều | ☐ Thái độ ☐ Trình độ ☐ Tương tác ☐ Đề xuất lớp phù hợp ☐ Điểm số ☐ Khác: ___ | US-ENR02-05 fields |
| 4 | Nhận xét viết ở đâu? | Chọn 1 | ○ Hệ thống ○ Giấy ○ Nhắn tin BM ○ Không viết | US-ENR02-05 channel |
| 5 | Ai dùng nhận xét này? Để làm gì? | Mở | ___ | BR-004 (link test→sale) |
| 6 | Có trường hợp HV thử bị hủy/dời không? Xử lý thế nào? | Mở | ___ | US-ENR02-04 exception |
| 7 | Điều gì khó nhất khi ghép HV thử vào lớp? | Mở | ___ | Pain point |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1 | US-ENR02-03 | GV notification |
| 2-4 | US-ENR02-05 | Nhận xét workflow |
| 5 | BR-004 | Link nhận xét → chốt sale |
| 6 | US-ENR02-04 | Exception handling |
| 7 | SR tiềm năng | Pain point |
