---
id: QS-ACD-03
title: "Thiết lập Học thuật"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER"
target_output: ["BF-ACD-07 validate", "SR-BM tiềm năng"]
duration: "15 phút"
status: "Active"
tags: [questionnaire, academic, settings, configuration]
---

# QS-ACD-03: Thiết lập Học thuật

> **BF:** BF-ACD-07 · **Screen:** `academic_settings`
> **Hỏi:** BM (người cấu hình học thuật cho cơ sở).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Thời lượng 1 buổi học là bao lâu? Có khác nhau theo môn/trình độ? | Mở | ___ (VD: 60 phút, 90 phút, tùy môn) | BF-ACD-07 Duration |
| 2 | Sĩ số tối đa 1 lớp là bao nhiêu? Có khác theo loại lớp? | Số | ___ HV (VD: nhóm 8-12, 1-1, lớp lớn 15-20) | BF-ACD-07 Class size |
| 3 | Lịch nghỉ lễ/nghỉ hè được cấu hình thế nào? | Chọn 1 | ○ Theo lịch quốc gia ○ BM tự cấu hình ○ Owner quyết định chung ○ Khác: ___ | BF-ACD-07 Holiday config |
| 4 | Ai là người cấu hình các thiết lập học thuật? | Chọn 1 | ○ BM ○ Owner ○ Academic Manager ○ Admin hệ thống | BF-ACD-07 §2 Vai trò |
| 5 | Bao lâu các thiết lập học thuật thay đổi 1 lần? | Chọn 1 | ○ Hàng tháng ○ Hàng quý ○ Hàng năm ○ Hiếm khi ○ Khi có chương trình mới | BF-ACD-07 Change frequency |
| 6 | Có cần thiết lập khác nhau giữa các chi nhánh không? | Chọn 1 | ○ Giống nhau toàn hệ thống ○ Khác theo chi nhánh ○ Khác theo môn | BF-ACD-07 Scope |
| 7 | Thang điểm đánh giá HV hiện tại là gì? | Mở | ___ (VD: 10 điểm, A-B-C-D, Pass/Fail) | BF-ACD-07 Grading scale |
| 8 | Điều gì cần cải thiện trong cách cấu hình học thuật hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-2 | BF-ACD-07 | Duration + class size config |
| 3-4 | BF-ACD-07 | Holiday + role permissions |
| 5-6 | BF-ACD-07 | Change frequency + scope |
| 7 | BF-ACD-07 | Grading scale |
| 8 | SR-BM tiềm năng | Pain point |
