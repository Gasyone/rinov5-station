---
id: QS-SYS-05
title: "Thiết bị & Đồng bộ LMS"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER, PERSONA-TEACHER"
target_output: ["BF-SYS-03 validate", "US-SYS03-01..02 validate"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, system, device, lms, sync, tablet]
---

# QS-SYS-05: Thiết bị & Đồng bộ LMS

> **BF:** BF-SYS-03 · **Screen:** `device_management`
> **Hỏi:** BM (quản lý thiết bị) + Teacher (sử dụng hàng ngày).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Cơ sở hiện có bao nhiêu iPad/tablet dùng cho học viên? | Số | ___ thiết bị | BF-SYS-03 Device inventory |
| 2 | Thiết bị được dùng cho mục đích gì? | Chọn nhiều | ☐ Làm bài test ☐ Học trên LMS ☐ Xem video ☐ Chơi game giáo dục ☐ Khác: ___ | BF-SYS-03 Use cases |
| 3 | Kết quả bài test trên tablet đồng bộ về hệ thống thế nào? | Chọn 1 | ○ Tự động real-time ○ Đồng bộ khi có wifi ○ GV nhập tay ○ Không đồng bộ | BF-SYS-03 Sync method |
| 4 | Khi mất kết nối internet, thiết bị xử lý thế nào? | Chọn 1 | ○ Vẫn làm bài, sync sau ○ Không làm được ○ Lưu local, GV upload sau | BF-SYS-03 Offline mode |
| 5 | Ai quản lý/cài đặt thiết bị (reset, cập nhật app)? | Chọn 1 | ○ BM ○ GV ○ IT trung tâm ○ Không ai cụ thể | BF-SYS-03 Device admin |
| 6 | Có bao giờ thiết bị bị lỗi giữa buổi test không? Xử lý sao? | Mở | ___ | BF-SYS-03 Fallback |
| 7 | LMS hiện tại là gì? Có API để lấy kết quả không? | Mở | ___ (tên LMS: ___) | BF-SYS-03 Integration |
| 8 | Trung bình 1 ngày có bao nhiêu bài test được thực hiện trên thiết bị? | Số | ___ bài/ngày | Volume baseline |
| 9 | GV có cần xem kết quả test ngay trên hệ thống sau khi HV làm xong? | Có/Không | ○ Có, cần ngay ○ Xem sau cũng được ○ Không cần | US-SYS03-02 Realtime need |
| 10 | Điều gì bất tiện nhất khi dùng thiết bị/LMS hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-2 | BF-SYS-03 | Device inventory + Use cases |
| 3-4 | BF-SYS-03 | Sync method + Offline handling |
| 5-6 | BF-SYS-03 | Device admin + Fallback |
| 7 | BF-SYS-03 | LMS integration spec |
| 8 | BR baseline | Volume sizing |
| 9 | US-SYS03-02 | Realtime requirement |
| 10 | SR-BM/Teacher tiềm năng | Pain point |
