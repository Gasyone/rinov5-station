---
id: QS-HR-01
title: "Chi nhánh & Giờ hoạt động"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER, PERSONA-OWNER"
target_output: ["BF-ORG-01 validate", "US-ORG01-01..02 validate"]
duration: "15 phút"
status: "Active"
tags: [questionnaire, hr, branch, operating-hours, facility]
---

# QS-HR-01: Chi nhánh & Giờ hoạt động

> **BF:** BF-ORG-01 · **Screen:** `branches`
> **Hỏi:** BM (vận hành cơ sở) + Owner (quản lý chuỗi).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Mỗi cơ sở có bao nhiêu phòng học? | Số | ___ phòng (loại: ___) | BF-ORG-01 Room inventory |
| 2 | Giờ mở cửa và đóng cửa hàng ngày là mấy giờ? | Mở | Mở: ___ Đóng: ___ | BF-ORG-01 Operating hours |
| 3 | Có ngày nghỉ riêng của cơ sở (khác lịch chung) không? | Có/Không | ○ Có (ví dụ: ___) ○ Không, theo lịch chung | BF-ORG-01 Holiday policy |
| 4 | Ai quản lý thông tin cơ sở (địa chỉ, SĐT, giờ mở)? | Chọn 1 | ○ Owner ○ BM ○ Admin | BF-ORG-01 §2 Vai trò |
| 5 | Phòng học có phân loại không (VIP, thường, lab)? | Có/Không | ○ Có (loại: ___) ○ Không, đồng nhất | BF-ORG-01 Room type |
| 6 | Có cơ sở nào hoạt động khung giờ khác (chỉ chiều/tối)? | Có/Không | ○ Có ○ Không, giống nhau | BF-ORG-01 Variant schedule |
| 7 | Khi mở cơ sở mới, cần nhập thông tin gì vào hệ thống? | Chọn nhiều | ☐ Tên ☐ Địa chỉ ☐ SĐT ☐ Email ☐ Số phòng ☐ Sức chứa ☐ Ảnh ☐ Khác: ___ | US-ORG01-01 Fields |
| 8 | Trung bình 1 năm mở bao nhiêu cơ sở mới? | Số | ___ cơ sở/năm | Volume baseline |
| 9 | Điều gì bất tiện nhất khi quản lý thông tin cơ sở hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-2 | BF-ORG-01 | Room inventory + Operating hours |
| 3, 6 | BF-ORG-01 | Holiday + Variant schedule |
| 4-5 | BF-ORG-01 | Admin role + Room classification |
| 7 | US-ORG01-01 | Create branch fields |
| 8 | BR baseline | Volume sizing |
| 9 | SR-BM/Owner tiềm năng | Pain point |
