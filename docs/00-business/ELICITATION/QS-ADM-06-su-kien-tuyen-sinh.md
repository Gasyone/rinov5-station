---
id: QS-ADM-06
title: "Sự kiện Tuyển sinh"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-SALE, PERSONA-BRANCH_MANAGER"
target_output: ["BF-ENR-03 validate", "SR-SALE tiềm năng"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, admissions, event, enrollment]
---

# QS-ADM-06: Sự kiện Tuyển sinh

> **BF:** BF-ENR-03 · **Screen:** `enrollment_events`
> **Hỏi:** Sale (tổ chức & thu lead) + BM (duyệt & đánh giá hiệu quả).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Cơ sở tổ chức sự kiện tuyển sinh bao lâu một lần? | Chọn 1 | ○ Hàng tuần ○ 2 tuần/lần ○ Hàng tháng ○ Theo mùa ○ Không định kỳ | BF-ENR-03 Frequency |
| 2 | Các loại sự kiện tuyển sinh thường tổ chức? | Chọn nhiều | ☐ Open Day ☐ Workshop miễn phí ☐ Thi thử ☐ Hội thảo phụ huynh ☐ Roadshow ☐ Online webinar ☐ Khác: ___ | BF-ENR-03 Event types |
| 3 | Khách tham dự check-in bằng cách nào? | Chọn nhiều | ☐ Điền form giấy ☐ Quét QR ☐ Điền form online ☐ Nhân viên nhập tay ☐ Chưa có check-in | BF-ENR-03 Check-in |
| 4 | Thông tin nào được thu thập từ khách tại sự kiện? | Chọn nhiều | ☐ Tên PH ☐ SĐT ☐ Email ☐ Tên HV ☐ Độ tuổi HV ☐ Môn quan tâm ☐ Khác: ___ | BF-ENR-03 Lead capture |
| 5 | Sau sự kiện, lead được nhập vào hệ thống thế nào? | Chọn 1 | ○ Nhập tay từng lead ○ Import file Excel ○ Tự động từ form online ○ Chưa nhập hệ thống | BF-ENR-03 → BF-CRM-01 |
| 6 | Bạn đo hiệu quả sự kiện bằng chỉ số nào? | Chọn nhiều | ☐ Số khách tham dự ☐ Số lead thu được ☐ Số booking test ☐ Số đăng ký thành công ☐ Chi phí/lead ☐ Không đo | BF-ENR-03 KPI |
| 7 | Trung bình 1 sự kiện thu được bao nhiêu lead? | Số | ___ lead/sự kiện | Volume baseline |
| 8 | Điều gì khó nhất khi tổ chức sự kiện tuyển sinh? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-2 | BF-ENR-03 | Validate frequency + event types |
| 3-4 | BF-ENR-03 | Check-in + lead capture flow |
| 5 | BF-ENR-03 → BF-CRM-01 | Event-to-CRM integration |
| 6-7 | BF-ENR-03 | KPI + volume baseline |
| 8 | SR-SALE tiềm năng | Pain point |
