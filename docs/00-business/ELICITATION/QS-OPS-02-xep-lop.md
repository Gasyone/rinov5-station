---
id: QS-OPS-02
title: "Xếp lớp cho Học viên"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER"
target_output: ["BF-CLS-03 validate", "US-CLS01-01..03 validate"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, operations, class-assignment, enrollment]
---

# QS-OPS-02: Xếp lớp cho Học viên

> **BF:** BF-CLS-03 (Quản lý Học viên · Chờ xếp lớp) · **Screen:** `/app/students?status=cho_xep_lop`
> **Hỏi:** BM (người xếp lớp).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Ai là người xếp HV vào lớp? | Chọn nhiều | ☐ BM ☐ Giáo vụ ☐ Sale (đề xuất) ☐ Hệ thống tự gợi ý | BF-CLS-03 §6 |
| 2 | Tiêu chí xếp lớp là gì? | Chọn nhiều + xếp hạng | ☐ Trình độ ☐ Độ tuổi ☐ Khung giờ phù hợp ☐ Sĩ số còn chỗ ☐ Yêu cầu phụ huynh ☐ Khác: ___ | US-CLS01-01 matching |
| 3 | Khi có nhiều lớp phù hợp, bạn chọn lớp nào? Dựa vào gì? | Mở | ___ | US-CLS01-01 smart matching |
| 4 | Có bao giờ HV chờ xếp lớp quá lâu? Bao lâu là "quá lâu"? | Có/Không + số | ○ Có (>___ ngày) ○ Không | BR-004 SLA |
| 5 | Khi HV chờ quá lâu, bạn xử lý thế nào? | Mở | ___ | SR-BM-003 (SLA cảnh báo) |
| 6 | Có xếp nhiều HV cùng lúc (batch) không? Bao nhiêu? | Có/Không + số | ○ Có (~___HV/lần) ○ Không, từng người | US-CLS01-03 batch |
| 7 | Sau khi xếp xong, phụ huynh/HV được thông báo bằng cách nào? | Chọn nhiều | ☐ SMS ☐ Zalo ☐ Email ☐ Gọi điện ☐ Không | Notification flow |
| 8 | Điều gì khó nhất khi xếp lớp hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-3 | BF-CLS-03, US-CLS01-01 | Validate matching logic |
| 4-5 | BR-004, SR-BM-003 | SLA xếp lớp |
| 6 | US-CLS01-03 | Batch enrollment |
| 7 | Notification (chưa có US) | Phát hiện mới |
| 8 | SR tiềm năng | Pain point |
