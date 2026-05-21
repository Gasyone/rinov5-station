---
id: QS-RPT-02
title: "Báo cáo Cơ sở & Xuất dữ liệu"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER"
target_output: ["BF-RPT-01 validate", "SR-BM tiềm năng"]
duration: "15 phút"
status: "Active"
tags: [questionnaire, reporting, branch-report, export]
---

# QS-RPT-02: Báo cáo Cơ sở & Xuất dữ liệu

> **BF:** BF-RPT-01 · **Screen:** `branch_reports`
> **Hỏi:** BM (người tạo & gửi báo cáo cơ sở).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | BM cần làm báo cáo nào hằng ngày? | Chọn nhiều | ☐ Doanh thu ngày ☐ Điểm danh ☐ Lead mới ☐ Booking test ☐ Không có báo cáo ngày ☐ Khác: ___ | BF-RPT-01 Daily reports |
| 2 | Báo cáo tuần/tháng gồm những nội dung gì? | Chọn nhiều | ☐ Tổng doanh thu ☐ Số HV mới ☐ Tỷ lệ duy trì ☐ Hiệu suất Sale ☐ Lớp mở/đóng ☐ Công nợ ☐ Khác: ___ | BF-RPT-01 Periodic reports |
| 3 | Báo cáo hiện tại ở định dạng gì? | Chọn 1 | ○ Excel ○ Google Sheets ○ PDF ○ Trên phần mềm ○ Viết tay/email | BF-RPT-01 Format |
| 4 | Báo cáo gửi cho ai? | Chọn nhiều | ☐ Owner ☐ Kế toán ☐ Quản lý vùng ☐ Lưu nội bộ ☐ Khác: ___ | BF-RPT-01 Recipients |
| 5 | Báo cáo được tạo tự động hay làm tay? | Chọn 1 | ○ Hoàn toàn tay ○ Bán tự động (lấy số liệu, format tay) ○ Tự động hoàn toàn ○ Khác: ___ | BF-RPT-01 Automation |
| 6 | Mất bao lâu để làm 1 báo cáo tuần/tháng? | Chọn 1 | ○ < 30 phút ○ 30-60 phút ○ 1-2 giờ ○ > 2 giờ | BF-RPT-01 Effort |
| 7 | Có cần xuất dữ liệu thô để phân tích riêng không? | Có/Không | ○ Có (mô tả: ___) ○ Không | BF-RPT-01 Raw export |
| 8 | Điều gì tốn thời gian nhất khi làm báo cáo? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-2 | BF-RPT-01 | Daily + periodic report content |
| 3-4 | BF-RPT-01 | Format + recipients |
| 5-6 | BF-RPT-01 | Automation level + effort |
| 7 | BF-RPT-01 | Raw data export needs |
| 8 | SR-BM tiềm năng | Pain point |
