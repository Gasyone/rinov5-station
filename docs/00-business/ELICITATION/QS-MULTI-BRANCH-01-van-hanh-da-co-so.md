---
id: QS-MULTI-BRANCH-01
title: "Vận hành Đa cơ sở"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-OWNER, PERSONA-BRANCH_MANAGER"
target_output: ["BF-HR-01 validate", "BR Multi-branch", "NFR Scalability"]
duration: "30 phút"
status: "Active"
tags: [questionnaire, multi-branch, scalability, operations, expansion, elicitation]
---

# QS-MULTI-BRANCH-01: Vận hành Đa cơ sở

> **Mục tiêu:** Hiểu mô hình vận hành nhiều cơ sở — giống/khác, chuyển đổi, mở rộng.
> **Hỏi:** Owner (chiến lược mở rộng), BM (vận hành thực tế).
> **Thời lượng dự kiến:** 30 phút
> **Output sẽ điền vào:** BF-HR-01, BR Multi-branch, NFR Scalability

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Hiện hệ thống có bao nhiêu cơ sở? Dự kiến mở thêm? | Số + Mở | ___ cơ sở hiện tại, dự kiến ___ trong 1 năm tới | BR Multi-branch Scale |
| 2 | Quy trình vận hành giữa các cơ sở giống hay khác nhau? | Chọn 1 | ○ Giống hoàn toàn ○ Giống 80%, khác 20% ○ Khác nhiều tùy cơ sở | BR Multi-branch Standardization |
| 3 | Điều gì khác nhau giữa các cơ sở? | Chọn nhiều | ☐ Chương trình học ☐ Giá ☐ Lịch học ☐ Quy mô ☐ Đối tượng HV ☐ Quy trình nội bộ ☐ Khác: ___ | BR Multi-branch Differences |
| 4 | Học viên có chuyển cơ sở không? Quy trình thế nào? | Mở | ___ | BF-OPS Transfer flow |
| 5 | Nhân viên có điều chuyển giữa các cơ sở không? | Chọn 1 | ○ Thường xuyên ○ Thỉnh thoảng ○ Hiếm khi ○ Không bao giờ | BF-HR-01 Staff transfer |
| 6 | Báo cáo có so sánh giữa các cơ sở không? Cần so sánh gì? | Chọn nhiều | ☐ Doanh thu ☐ Số HV ☐ Tỷ lệ retention ☐ Chi phí ☐ Hiệu suất GV ☐ Không so sánh | BR Multi-branch Reporting |
| 7 | Cấu hình hệ thống (giá, lịch, chương trình) nên chung hay riêng từng cơ sở? | Chọn 1 | ○ Chung tất cả ○ Chung template, cơ sở tùy chỉnh ○ Hoàn toàn riêng | NFR Configuration model |
| 8 | Khi mở cơ sở mới, quy trình setup mất bao lâu? | Chọn 1 | ○ < 1 tuần ○ 1-2 tuần ○ 1 tháng ○ > 1 tháng ○ Chưa có quy trình | BR Multi-branch Onboarding |
| 9 | Ai quyết định mở cơ sở mới? Cần chuẩn bị gì? | Mở | ___ | BR Multi-branch Decision |
| 10 | Điều gì khó khăn nhất khi quản lý nhiều cơ sở? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1 | BR Multi-branch | Scale + Growth plan |
| 2-3 | BR Multi-branch | Standardization level |
| 4 | BF-OPS | Student transfer flow |
| 5 | BF-HR-01 | Staff transfer policy |
| 6 | BR Multi-branch | Cross-branch reporting |
| 7 | NFR | Configuration architecture |
| 8-9 | BR Multi-branch | New branch onboarding |
| 10 | SR-Owner/BM tiềm năng | Pain point |
