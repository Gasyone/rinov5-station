---
id: QS-OPS-05
title: "Điểm danh & Nhận xét"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-TEACHER, PERSONA-BRANCH_MANAGER"
target_output: ["BF-CLS-05 validate", "US-CLS05-01..07 validate"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, operations, attendance, feedback]
---

# QS-OPS-05: Điểm danh & Nhận xét

> **BF:** BF-CLS-05 · **Screen:** `attendance`
> **Hỏi:** Teacher (người điểm danh) + BM (người duyệt).

---

## Câu hỏi cho Teacher

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Bạn điểm danh vào lúc nào? | Chọn 1 | ○ Đầu buổi ○ Cuối buổi ○ Sau buổi (về nhà) | US-CLS05-01 timing |
| 2 | Điểm danh trên thiết bị gì? | Chọn 1 | ○ Mobile ○ Laptop ○ Giấy rồi nhập sau | SR-TEACHER-001 |
| 3 | Mất bao lâu để điểm danh 1 lớp? | Chọn 1 | ○ < 2p ○ 2-5p ○ 5-10p ○ > 10p | SR-TEACHER-001 AC |
| 4 | Ngoài có mặt/vắng, bạn ghi thêm gì? | Chọn nhiều | ☐ Đi muộn ☐ Về sớm ☐ Nhận xét ☐ Điểm ☐ BTVN ☐ Không ghi thêm | US-CLS05-01 fields |
| 5 | Nhận xét HV bạn viết ở đâu? Dài bao nhiêu? | Mở | ___ | US-CLS05-01 UX |
| 6 | Bài tập về nhà giao bằng cách nào? | Chọn 1 | ○ Trên hệ thống ○ Viết bảng ○ Nhắn group ○ Không giao | US-CLS05-05/06 |
| 7 | Điều gì khiến việc điểm danh mất thời gian? | Mở | ___ | Pain point |

---

## Câu hỏi cho BM

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| B1 | Bạn có duyệt điểm danh của GV không? | Chọn 1 | ○ Có, hằng ngày ○ Có, cuối tuần ○ Không | US-CLS05-04 |
| B2 | Bạn biết GV nào chưa điểm danh bằng cách nào? | Mở | ___ | SR-BM pain point |
| B3 | Báo cáo điểm danh bạn cần xem dạng nào? | Chọn nhiều | ☐ Theo lớp ☐ Theo HV ☐ Theo GV ☐ Theo tuần/tháng | US-CLS05-03 |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-7 | BF-CLS-05, US-CLS05-01, SR-TEACHER-001 | Validate workflow + timing |
| B1-B3 | US-CLS05-03/04 | Duyệt + báo cáo |
| 7 | SR-TEACHER-001 | Pain point → ≤ 3 phút |
