---
id: QS-SYS-04
title: "Cấu hình & Tham số vận hành"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER"
target_output: ["BF-SYS-02 validate", "US-SYS02-01..02 validate"]
duration: "15 phút"
status: "Active"
tags: [questionnaire, system, configuration, parameters]
---

# QS-SYS-04: Cấu hình & Tham số vận hành

> **BF:** BF-SYS-02 · **Screen:** `system_config`
> **Hỏi:** BM (người cấu hình vận hành cơ sở).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Những tham số nào cơ sở cần tự cấu hình? | Chọn nhiều | ☐ Sĩ số tối đa/lớp ☐ Thời lượng buổi học ☐ Số buổi/tuần ☐ Ngưỡng cảnh báo vắng ☐ Hạn thanh toán ☐ Khác: ___ | BF-SYS-02 Param list |
| 2 | Ai được phép thay đổi tham số hệ thống? | Chọn 1 | ○ Chỉ Owner ○ BM ○ Cả hai ○ Admin IT | BF-SYS-02 §2 Vai trò |
| 3 | Bao lâu thì cần thay đổi tham số 1 lần? | Chọn 1 | ○ Hiếm khi (1-2 lần/năm) ○ Mỗi quý ○ Mỗi tháng ○ Thường xuyên | BF-SYS-02 Change freq |
| 4 | Khi thay đổi tham số, có cần duyệt (approval) không? | Có/Không | ○ Có (ai duyệt: ___) ○ Không, đổi là có hiệu lực ngay | BF-SYS-02 Approval flow |
| 5 | Tham số có khác nhau giữa các chi nhánh không? | Có/Không | ○ Có (ví dụ: sĩ số khác nhau) ○ Không, đồng nhất toàn hệ thống | BF-SYS-02 Scope level |
| 6 | Có tham số nào cần cảnh báo khi vượt ngưỡng? | Chọn nhiều | ☐ Sĩ số vượt max ☐ Vắng liên tiếp N buổi ☐ Công nợ quá hạn ☐ Khác: ___ | BF-SYS-02 Alert rules |
| 7 | Khi đổi tham số, dữ liệu cũ có bị ảnh hưởng không? | Chọn 1 | ○ Chỉ áp dụng từ thời điểm đổi ○ Áp dụng ngược (retroactive) ○ Không rõ | BF-SYS-02 Effective date |
| 8 | Có cần lưu lịch sử thay đổi tham số không? | Có/Không | ○ Có ○ Không cần | BF-SYS-02 Audit log |
| 9 | Điều gì bất tiện nhất khi cấu hình hệ thống hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1 | BF-SYS-02 | Parameter catalog |
| 2-4 | BF-SYS-02 | Access + Approval flow |
| 5 | BF-SYS-02 | Branch-level vs Global config |
| 6-7 | BF-SYS-02 | Alert rules + Effective date |
| 8 | BF-SYS-02 | Audit requirement |
| 9 | SR-BM tiềm năng | Pain point |
