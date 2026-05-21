---
id: QS-OPS-03
title: "Tạo Lịch & Sinh Buổi học"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER"
target_output: ["BF-OPS-02 validate", "US-OPS02-01..04 validate"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, operations, scheduling, session]
---

# QS-OPS-03: Tạo Lịch & Sinh Buổi học

> **BF:** BF-OPS-02 · **Screen:** `calendar_class_schedule`
> **Hỏi:** BM.

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Khi lớp mới mở, ai tạo lịch học (khung giờ lặp lại)? | Chọn 1 | ○ BM ○ Giáo vụ ○ Hệ thống tự sinh | BF-OPS-02 §2 |
| 2 | Lịch học thường lặp theo pattern nào? | Chọn nhiều | ☐ 2 buổi/tuần cố định ☐ 3 buổi/tuần ☐ Hằng ngày ☐ Linh hoạt ☐ Khác: ___ | US-OPS02-02 pattern |
| 3 | Khi tạo lịch, hệ thống có tự kiểm tra trùng (GV/Phòng/HV) không? | Chọn 1 | ○ Có, tự động ○ Phải tự kiểm tra ○ Không kiểm tra | US-OPS02-04 conflict |
| 4 | Có bao giờ bị trùng lịch mà không phát hiện kịp? Hậu quả? | Mở | ___ | BR-002 pain point |
| 5 | Buổi học được sinh tự động hay tạo tay từng buổi? | Chọn 1 | ○ Tự động từ khung lịch ○ Tạo tay ○ Kết hợp | US-OPS02-02 |
| 6 | Khi có ngày nghỉ lễ, lịch học xử lý thế nào? | Chọn 1 | ○ Tự bỏ buổi ○ Phải xóa tay ○ Dịch sang ngày khác | US-OPS02-02 holiday |
| 7 | Bạn xem lịch tổng cơ sở dưới dạng nào? | Chọn nhiều | ☐ Calendar tuần ☐ Calendar tháng ☐ Bảng danh sách ☐ Không xem tổng | US-OPS02-03 view |
| 8 | Khi xem lịch tổng, thông tin nào quan trọng nhất? | Xếp hạng | 1.___ 2.___ 3.___ | US-OPS02-03 priority |
| 9 | Điều gì khó nhất khi quản lý lịch hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-2 | BF-OPS-02, US-OPS02-02 | Validate scheduling logic |
| 3-4 | US-OPS02-04, BR-002 | Conflict detection |
| 5-6 | US-OPS02-02 | Auto-generate + holiday |
| 7-8 | US-OPS02-03 | Calendar view preference |
| 9 | SR tiềm năng | Pain point |
