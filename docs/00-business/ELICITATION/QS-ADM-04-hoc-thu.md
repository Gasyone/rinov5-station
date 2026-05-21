---
id: QS-ADM-04
title: "Đặt lịch Học thử"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-SALE, PERSONA-BRANCH_MANAGER"
target_output: ["BF-ENR-02 validate", "US-ENR02-01..02 validate"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, admissions, trial-class]
---

# QS-ADM-04: Đặt lịch Học thử

> **BF:** BF-ENR-02 · **Screen:** `trial_class`
> **Hỏi:** Sale + BM.

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Học thử ở cơ sở bạn là ghép vào lớp có sẵn hay mở lớp riêng? | Chọn 1 | ○ Ghép buổi ○ Lớp riêng ○ Cả hai tùy trường hợp | BF-ENR-02 §3 Scope |
| 2 | Ai quyết định ghép HV thử vào lớp nào? | Chọn 1 | ○ Sale ○ BM ○ Giáo vụ ○ Hệ thống gợi ý | US-ENR02-03 logic |
| 3 | Tiêu chí ghép lớp là gì? | Chọn nhiều | ☐ Trình độ ☐ Độ tuổi ☐ Khung giờ ☐ Sĩ số còn chỗ ☐ GV phù hợp ☐ Khác: ___ | US-ENR02-03 matching |
| 4 | Sau buổi học thử, GV nhận xét bằng cách nào? | Chọn 1 | ○ Trên hệ thống ○ Viết tay ○ Nhắn tin BM ○ Không nhận xét | US-ENR02-05 |
| 5 | Phụ huynh nhận kết quả học thử bằng cách nào? Ai gửi? | Mở | ___ | US-ENR02-05 delivery |
| 6 | Có trường hợp HV thử xong nhưng không chốt đơn? Tỷ lệ? Lý do? | Mở | ___ | BR-004 drop-off |
| 7 | Từ lúc đặt học thử đến lúc HV thử xong, trung bình mất mấy ngày? | Số | ___ ngày | KPI-008 baseline |
| 8 | Điều gì khó nhất trong quy trình học thử hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-3 | BF-ENR-02, US-ENR02-03 | Validate ghép buổi logic |
| 4-5 | US-ENR02-05 | GV nhận xét + trả kết quả |
| 6-7 | BR-004 | Drop-off rate + timeline |
| 8 | SR tiềm năng | Pain point mới |
