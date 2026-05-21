---
id: QS-OPS-06
title: "Quản lý Học viên trong Lớp"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER, PERSONA-CSM, PERSONA-TEACHER"
target_output: ["BF-CLS-03 validate", "SR-CSM tiềm năng"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, operations, class, student-management]
---

# QS-OPS-06: Quản lý Học viên trong Lớp

> **BF:** BF-CLS-03 · **Screen:** `class_students`
> **Hỏi:** BM (giám sát) + CSM (chăm sóc HV) + Teacher (dạy & theo dõi).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Bạn xem danh sách HV trong lớp ở đâu hiện tại? | Chọn 1 | ○ Excel ○ Phần mềm cũ ○ Sổ tay ○ Không có danh sách tập trung | BF-CLS-03 Current state |
| 2 | Khi xem danh sách HV lớp, bạn cần thấy thông tin gì? | Chọn nhiều | ☐ Tên HV ☐ SĐT PH ☐ Trình độ ☐ Ngày vào lớp ☐ Số buổi còn lại ☐ Điểm danh gần nhất ☐ Ghi chú ☐ Khác: ___ | BF-CLS-03 Fields |
| 3 | Có cần tag/đánh dấu HV "cần chú ý" không? Tiêu chí? | Có/Không | ○ Có (VD: nghỉ nhiều, học yếu, hết buổi) ○ Không cần | BF-CLS-03 Alert tag |
| 4 | GV/CSM có cần xem profile 360 của HV từ trong lớp không? | Chọn 1 | ○ Có, cần xem nhanh ○ Có, nhưng mở trang riêng ○ Không cần | BF-CLS-03 Profile access |
| 5 | Lịch sử HV (điểm danh, điểm số, ghi chú) cần hiển thị thế nào? | Chọn 1 | ○ Timeline ○ Bảng tổng hợp ○ Cả hai ○ Không cần | BF-CLS-03 History view |
| 6 | Khi HV có vấn đề (nghỉ nhiều, điểm thấp), ai được thông báo? | Chọn nhiều | ☐ GV chủ nhiệm ☐ CSM ☐ BM ☐ Phụ huynh ☐ Không ai | BF-CLS-03 Notification |
| 7 | Trung bình 1 lớp có bao nhiêu HV? | Số | ___ HV/lớp | Volume baseline |
| 8 | Sĩ số tối đa cho phép trong 1 lớp? | Số | ___ HV | BF-CLS-03 Capacity |
| 9 | Điều gì khó nhất khi theo dõi HV trong lớp hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-2 | BF-CLS-03 | Current state + required fields |
| 3-4 | BF-CLS-03 | Alert tags + profile access |
| 5-6 | BF-CLS-03 | History view + notification rules |
| 7-8 | BR baseline | Volume + capacity |
| 9 | SR-CSM tiềm năng | Pain point |
