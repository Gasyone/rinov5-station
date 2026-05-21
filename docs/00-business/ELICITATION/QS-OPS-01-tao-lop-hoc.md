---
id: QS-OPS-01
title: "Tạo Lớp học & Gán Lộ trình"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER"
target_output: ["BF-CLS-02 validate", "US-CLS02-01..03 validate"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, operations, class, create]
---

# QS-OPS-01: Tạo Lớp học & Gán Lộ trình

> **BF:** BF-CLS-02 · **Screen:** `classes`
> **Hỏi:** BM (người tạo/duyệt lớp).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Ai là người quyết định mở lớp mới? | Chọn 1 | ○ BM ○ Owner ○ Giáo vụ ○ Tự động khi đủ HV | BF-CLS-02 §2 |
| 2 | Khi mở lớp, bạn cần nhập thông tin gì? | Chọn nhiều | ☐ Tên lớp ☐ Môn ☐ Trình độ ☐ GV chủ nhiệm ☐ Phòng ☐ Khung giờ ☐ Sĩ số tối đa ☐ Khác: ___ | US-CLS02-02 fields |
| 3 | Lớp mới có cần gán khung chương trình (syllabus) ngay không? | Chọn 1 | ○ Bắt buộc ngay ○ Gán sau cũng được ○ Không cần | US-CLS02-03 |
| 4 | Tiêu chí nào để quyết định mở lớp? | Chọn nhiều | ☐ Đủ N HV chờ ☐ Có GV rảnh ☐ Có phòng trống ☐ Theo kế hoạch quý ☐ Khác: ___ | BF-CLS-02 Business Rule |
| 5 | Trung bình 1 tháng cơ sở mở bao nhiêu lớp mới? | Số | ___ lớp/tháng | Volume baseline |
| 6 | Có bao giờ mở lớp rồi phải đóng vì không đủ HV? | Có/Không | ○ Có (~___lần/năm) ○ Không | Corner case |
| 7 | Khi lớp đang chạy, có cần cập nhật gì thường xuyên? | Chọn nhiều | ☐ Đổi GV ☐ Đổi phòng ☐ Đổi khung giờ ☐ Thêm/bớt HV ☐ Khác: ___ | BF-CLS-02 update flow |
| 8 | Điều gì khó nhất khi tạo/quản lý lớp hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-4 | BF-CLS-02, US-CLS02-02/03 | Validate fields + rules |
| 5-6 | BR-002 baseline | Volume + corner case |
| 7 | BF-CLS-02 update flow | Cập nhật lớp |
| 8 | SR-BM tiềm năng | Pain point |
