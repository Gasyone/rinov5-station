---
id: QS-INTEGRATION-01
title: "Tích hợp & Di chuyển Dữ liệu"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-OWNER, PERSONA-BRANCH_MANAGER"
target_output: ["BR-INT validate", "Migration Plan", "NFR Integration"]
duration: "25 phút"
status: "Active"
tags: [questionnaire, integration, migration, data, api, lms, legacy, elicitation]
---

# QS-INTEGRATION-01: Tích hợp & Di chuyển Dữ liệu

> **Mục tiêu:** Hiểu hệ thống cũ, dữ liệu cần migrate, yêu cầu tích hợp, rủi ro.
> **Hỏi:** Owner (quyết định chiến lược), BM (hiểu dữ liệu vận hành).
> **Thời lượng dự kiến:** 25 phút
> **Output sẽ điền vào:** BR-INT, Migration Plan, NFR Integration

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Hiện cơ sở đang dùng hệ thống/phần mềm nào? | Chọn nhiều | ☐ Excel/Google Sheet ☐ Phần mềm quản lý (tên: ___) ☐ LMS (tên: ___) ☐ Kế toán (tên: ___) ☐ CRM ☐ Không dùng PM | BR-INT Legacy systems |
| 2 | Dữ liệu nào cần chuyển sang hệ thống mới? | Chọn nhiều | ☐ Danh sách HV ☐ Lịch sử điểm danh ☐ Kết quả học tập ☐ Lịch sử thanh toán ☐ Hợp đồng ☐ Tất cả ☐ Không cần migrate | BR-INT Migration scope |
| 3 | Khối lượng dữ liệu ước tính bao nhiêu? | Mở | ___ HV, ___ năm dữ liệu, ___ records | BR-INT Volume |
| 4 | Hệ thống LMS hiện tại tích hợp thế nào với quản lý? | Chọn 1 | ○ API tự động ○ Export/Import file ○ Nhập tay ○ Không tích hợp ○ Không dùng LMS | BR-INT LMS integration |
| 5 | Nếu cần tích hợp, ưu tiên API tự động hay chấp nhận nhập tay? | Chọn 1 | ○ Bắt buộc API tự động ○ Ưu tiên API nhưng chấp nhận manual ○ Manual cũng được | NFR Integration level |
| 6 | Thời gian downtime chấp nhận được khi chuyển đổi? | Chọn 1 | ○ 0 (không được ngừng) ○ 1-2 giờ ○ 1 ngày ○ 1 tuần ○ Cuối tuần | BR-INT Downtime tolerance |
| 7 | Rủi ro mất dữ liệu khi migrate — mức chấp nhận? | Chọn 1 | ○ Không chấp nhận mất bất kỳ dữ liệu nào ○ Chấp nhận mất dữ liệu > 2 năm ○ Chấp nhận mất dữ liệu không quan trọng | BR-INT Risk tolerance |
| 8 | Ai sẽ chịu trách nhiệm kiểm tra dữ liệu sau migrate? | Chọn 1 | ○ BM ○ Owner ○ IT ○ Vendor ○ Chưa xác định | Migration Plan Ownership |
| 9 | Có yêu cầu chạy song song (hệ thống cũ + mới) trong thời gian chuyển đổi? | Có/Không | ○ Có, chạy song song ___ tuần ○ Không, cắt thẳng | BR-INT Parallel run |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1 | BR-INT | Legacy system inventory |
| 2-3 | BR-INT | Migration scope + Volume |
| 4-5 | NFR Integration | LMS integration requirement |
| 6 | BR-INT | Downtime tolerance |
| 7 | BR-INT | Data loss risk acceptance |
| 8 | Migration Plan | Ownership & Validation |
| 9 | BR-INT | Parallel run requirement |
