---
id: QS-FCM-01
title: "Phòng học & Checklist CSVC"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER"
target_output: ["BF-QA-02 validate", "SR-BM tiềm năng"]
duration: "15 phút"
status: "Active"
tags: [questionnaire, facility, room, equipment, checklist]
---

# QS-FCM-01: Phòng học & Checklist CSVC

> **BF:** BF-QA-02 · **Screen:** `rooms`, `facility_checklist`
> **Hỏi:** BM (quản lý cơ sở vật chất).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Cơ sở có bao nhiêu phòng học? | Số | ___ phòng | Volume baseline |
| 2 | Sức chứa trung bình mỗi phòng là bao nhiêu? | Số | ___ HV/phòng | BF-QA-02 Capacity |
| 3 | Thiết bị trong phòng học gồm những gì? | Chọn nhiều | ☐ Bảng trắng ☐ TV/Màn hình ☐ Máy chiếu ☐ Loa ☐ Điều hòa ☐ Camera ☐ Máy tính ☐ Khác: ___ | BF-QA-02 Equipment |
| 4 | Có lịch bảo trì thiết bị định kỳ không? | Chọn 1 | ○ Có, hằng tuần ○ Có, hằng tháng ○ Có, hằng quý ○ Khi hỏng mới sửa ○ Không có | BF-QA-02 Maintenance |
| 5 | Có checklist kiểm tra phòng hằng ngày không? | Chọn 1 | ○ Có, đầu ngày ○ Có, trước mỗi ca ○ Không có checklist ○ Có nhưng không thực hiện đều | BF-QA-02 Daily checklist |
| 6 | Ai chịu trách nhiệm kiểm tra phòng/thiết bị? | Chọn nhiều | ☐ Nhân viên vệ sinh ☐ Lễ tân ☐ GV ☐ BM ☐ Khác: ___ | BF-QA-02 §2 Vai trò |
| 7 | Khi thiết bị hỏng, quy trình báo sửa thế nào? | Mở | ___ | BF-QA-02 Repair flow |
| 8 | Điều gì bất tiện nhất khi quản lý phòng học/CSVC hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-2 | BF-QA-02 | Volume + room capacity |
| 3-4 | BF-QA-02 | Equipment list + maintenance schedule |
| 5-6 | BF-QA-02 | Daily checklist + responsible roles |
| 7 | BF-QA-02 | Repair flow |
| 8 | SR-BM tiềm năng | Pain point |
