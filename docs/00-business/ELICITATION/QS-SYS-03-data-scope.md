---
id: QS-SYS-03
title: "Data Scope & Phạm vi dữ liệu"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER, PERSONA-OWNER"
target_output: ["BF-SYS-04 validate", "US-SYS04-03 validate"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, system, data-scope, abac, visibility]
---

# QS-SYS-03: Data Scope & Phạm vi dữ liệu

> **BF:** BF-SYS-04 (US-SYS-04-03) · **Screen:** `data_scope_config`
> **Hỏi:** BM (quản lý phạm vi nhìn thấy) + Owner (chính sách toàn hệ thống).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | BM có thấy dữ liệu toàn bộ cơ sở hay chỉ team mình quản lý? | Chọn 1 | ○ Toàn cơ sở ○ Chỉ team/phòng ○ Tùy cấu hình | US-SYS04-03 BM scope |
| 2 | Giáo viên thấy được thông tin gì? | Chọn nhiều | ☐ Chỉ lớp mình dạy ☐ Tất cả lớp cùng môn ☐ Thông tin HV lớp mình ☐ Điểm số HV ☐ Khác: ___ | US-SYS04-03 Teacher scope |
| 3 | Sale thấy được dữ liệu khách hàng của Sale khác không? | Chọn 1 | ○ Không, chỉ lead của mình ○ Có, toàn bộ ○ Tùy BM cấu hình | US-SYS04-03 Sale scope |
| 4 | Owner có thấy dữ liệu tất cả chi nhánh cùng lúc không? | Có/Không | ○ Có, dashboard tổng hợp ○ Có nhưng phải chọn chi nhánh ○ Không | US-SYS04-03 Owner scope |
| 5 | Có trường hợp nào cần share dữ liệu ngoại lệ (vượt scope)? | Có/Không | ○ Có (ví dụ: ___) ○ Không | BF-SYS-04 Exception rule |
| 6 | Khi HV chuyển cơ sở, ai thấy hồ sơ cũ? | Chọn 1 | ○ Cả 2 cơ sở ○ Chỉ cơ sở mới ○ Chỉ Owner thấy toàn bộ | BF-SYS-04 Transfer scope |
| 7 | Dữ liệu tài chính (doanh thu, công nợ) ai được xem? | Chọn nhiều | ☐ Owner ☐ BM ☐ Kế toán ☐ Sale (chỉ đơn mình) ☐ Không ai ngoài Owner | US-SYS04-03 Finance scope |
| 8 | Có cần log lại ai đã xem dữ liệu nhạy cảm không? | Có/Không | ○ Có ○ Không cần ○ Chưa nghĩ tới | BF-SYS-04 Audit trail |
| 9 | Điều gì bất tiện nhất về phạm vi dữ liệu hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-4 | US-SYS04-03 | Validate scope per role |
| 5-6 | BF-SYS-04 | Exception + Transfer rules |
| 7 | US-SYS04-03 | Finance data visibility |
| 8 | BF-SYS-04 | Audit trail requirement |
| 9 | SR-BM/Owner tiềm năng | Pain point |
