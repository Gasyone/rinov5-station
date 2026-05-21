---
id: QS-FIN-01
title: "Chính sách Tài chính & Hoàn tiền"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER, PERSONA-OWNER"
target_output: ["BF-FIN-01 validate", "SR-BM tiềm năng"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, finance, refund, policy]
---

# QS-FIN-01: Chính sách Tài chính & Hoàn tiền

> **BF:** BF-FIN-01 · **Screen:** `finance_policy`
> **Hỏi:** BM (thực thi chính sách) + Owner (ban hành chính sách).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Chính sách hoàn tiền hiện tại quy định thế nào? | Mở | ___ | BF-FIN-01 Refund policy |
| 2 | Ai có quyền duyệt hoàn tiền? | Chọn 1 | ○ BM ○ Owner ○ Kế toán ○ Tùy số tiền (BM < N, Owner > N) | BF-FIN-01 Approval |
| 3 | Điều kiện nào để HV được hoàn tiền? | Chọn nhiều | ☐ Chưa bắt đầu học ☐ Học dưới N buổi ☐ Có lý do chính đáng ☐ Trong thời hạn N ngày ☐ Khác: ___ | BF-FIN-01 Conditions |
| 4 | Thời gian xử lý hoàn tiền trung bình bao lâu? | Chọn 1 | ○ Trong ngày ○ 3-5 ngày ○ 7-14 ngày ○ Trên 14 ngày ○ Không cố định | BF-FIN-01 SLA |
| 5 | Có trường hợp đặc biệt nào không theo chính sách chung? | Mở | ___ (VD: VIP, giới thiệu nhiều, khiếu nại) | BF-FIN-01 Exceptions |
| 6 | Hoàn tiền bằng hình thức nào? | Chọn nhiều | ☐ Tiền mặt ☐ Chuyển khoản ☐ Voucher/Credit ☐ Trừ vào đơn mới ☐ Khác: ___ | BF-FIN-01 Refund method |
| 7 | Có chính sách phạt khi HV hủy muộn không? | Chọn 1 | ○ Có, trừ ___% ○ Không phạt ○ Tùy trường hợp ○ Chưa quy định | BF-FIN-01 Penalty |
| 8 | Trung bình 1 tháng có bao nhiêu yêu cầu hoàn tiền? | Số | ___ yêu cầu/tháng | Volume baseline |
| 9 | Điều gì gây tranh cãi nhất khi xử lý hoàn tiền? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-2 | BF-FIN-01 | Refund policy + approval |
| 3-4 | BF-FIN-01 | Conditions + SLA |
| 5-7 | BF-FIN-01 | Exceptions + method + penalty |
| 8 | BR baseline | Volume sizing |
| 9 | SR-BM tiềm năng | Pain point |
