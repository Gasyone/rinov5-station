---
id: QS-HR-03
title: "Quản lý Nhân sự (Hire-to-Retire)"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER, PERSONA-OWNER"
target_output: ["BF-HR-01 validate", "US-HR01-01..03 validate"]
duration: "25 phút"
status: "Active"
tags: [questionnaire, hr, employee, hire, lifecycle, kpi]
---

# QS-HR-03: Quản lý Nhân sự (Hire-to-Retire)

> **BF:** BF-HR-01 · **Screen:** `hr_employees`
> **Hỏi:** BM (quản lý trực tiếp) + Owner (chính sách nhân sự).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Quy trình tuyển nhân viên mới gồm những bước gì? | Chọn nhiều | ☐ Phỏng vấn ☐ Dạy thử ☐ Ký HĐ thử việc ☐ Onboard hệ thống ☐ Đào tạo ☐ Khác: ___ | BF-HR-01 Hire flow |
| 2 | Thông tin nào cần lưu khi tạo hồ sơ nhân viên? | Chọn nhiều | ☐ Họ tên ☐ CCCD ☐ SĐT ☐ Email ☐ Địa chỉ ☐ Bằng cấp ☐ Kinh nghiệm ☐ Ảnh ☐ Tài khoản ngân hàng ☐ Khác: ___ | US-HR01-01 Fields |
| 3 | Nhân viên có những trạng thái nào? | Chọn nhiều | ☐ Thử việc ☐ Chính thức ☐ Tạm nghỉ ☐ Đã nghỉ ☐ Sa thải ☐ Khác: ___ | BF-HR-01 Status lifecycle |
| 4 | Thời gian thử việc bao lâu? Ai quyết định chuyển chính thức? | Mở | ___ tháng, người duyệt: ___ | BF-HR-01 Probation rule |
| 5 | Có theo dõi KPI nhân sự không? Những chỉ số nào? | Chọn nhiều | ☐ Số buổi dạy ☐ Đánh giá HV ☐ Tỷ lệ retention ☐ Doanh số (Sale) ☐ Đúng giờ ☐ Khác: ___ | BF-HR-01 KPI metrics |
| 6 | Khi nhân viên nghỉ việc, quy trình offboard gồm gì? | Chọn nhiều | ☐ Bàn giao lớp/HV ☐ Thu hồi thiết bị ☐ Khóa tài khoản ☐ Thanh toán lương ☐ Khác: ___ | BF-HR-01 Offboard flow |
| 7 | Có hợp đồng lao động lưu trên hệ thống không? | Có/Không | ○ Có (scan/upload) ○ Không, lưu giấy | US-HR01-02 Document |
| 8 | Trung bình 1 cơ sở có bao nhiêu nhân viên? | Số | ___ người | Volume baseline |
| 9 | Tỷ lệ nghỉ việc (turnover) khoảng bao nhiêu? | Mở | ___% /năm | HR metric baseline |
| 10 | Điều gì khó nhất khi quản lý nhân sự hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1 | BF-HR-01 | Hire flow validation |
| 2 | US-HR01-01 | Create employee fields |
| 3-4 | BF-HR-01 | Status lifecycle + Probation |
| 5 | BF-HR-01 | KPI metrics definition |
| 6 | BF-HR-01 | Offboard flow |
| 7 | US-HR01-02 | Document management |
| 8-9 | BR baseline | Volume + Turnover rate |
| 10 | SR-BM/Owner tiềm năng | Pain point |
