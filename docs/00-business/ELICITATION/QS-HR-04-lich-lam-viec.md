---
id: QS-HR-04
title: "Đăng ký Lịch làm việc (Quỹ thời gian)"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-TEACHER, PERSONA-BRANCH_MANAGER"
target_output: ["BF-HR-02 validate", "US-HR02-01..02 validate"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, hr, schedule, availability, time-budget]
---

# QS-HR-04: Đăng ký Lịch làm việc (Quỹ thời gian)

> **BF:** BF-HR-02 · **Screen:** `hr_schedule`
> **Hỏi:** Teacher (đăng ký lịch) + BM (duyệt & xếp lịch).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | GV đăng ký lịch rảnh (availability) bằng cách nào? | Chọn 1 | ○ Trên hệ thống ○ Gửi tin nhắn BM ○ Bảng Excel chung ○ Khác: ___ | BF-HR-02 Registration method |
| 2 | Bao lâu GV đăng ký lịch 1 lần? | Chọn 1 | ○ Mỗi tuần ○ Mỗi 2 tuần ○ Mỗi tháng ○ Cố định không đổi | BF-HR-02 Frequency |
| 3 | BM có cần duyệt lịch đăng ký của GV không? | Có/Không | ○ Có ○ Không, GV tự đăng ký là xong | BF-HR-02 Approval |
| 4 | Khi GV đăng ký trùng với lịch đã xếp, xử lý thế nào? | Chọn 1 | ○ Hệ thống cảnh báo ○ BM giải quyết thủ công ○ Không kiểm tra | BF-HR-02 Conflict handling |
| 5 | GV có thể hủy/đổi lịch đã đăng ký không? Deadline? | Mở | ___ (trước bao lâu: ___) | BF-HR-02 Change policy |
| 6 | Có GV part-time (chỉ dạy vài buổi/tuần) không? | Có/Không | ○ Có (~___%) ○ Không, toàn full-time | BF-HR-02 Part-time handling |
| 7 | Số giờ tối thiểu/tối đa 1 GV dạy mỗi tuần? | Số | Min: ___ Max: ___ giờ/tuần | BF-HR-02 Time budget |
| 8 | Khi GV nghỉ đột xuất (ốm, việc riêng), ai thay? | Chọn 1 | ○ BM tìm GV thay ○ Hệ thống gợi ý ○ Hủy buổi ○ Khác: ___ | BF-HR-02 Substitute flow |
| 9 | Có theo dõi số giờ thực dạy vs giờ đăng ký không? | Có/Không | ○ Có ○ Không | BF-HR-02 Tracking |
| 10 | Điều gì khó nhất khi xếp lịch GV hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-3 | BF-HR-02 | Registration method + Approval |
| 4-5 | BF-HR-02 | Conflict + Change policy |
| 6-7 | BF-HR-02 | Part-time + Time budget |
| 8 | BF-HR-02 | Substitute flow |
| 9 | BF-HR-02 | Tracking requirement |
| 10 | SR-Teacher/BM tiềm năng | Pain point |
