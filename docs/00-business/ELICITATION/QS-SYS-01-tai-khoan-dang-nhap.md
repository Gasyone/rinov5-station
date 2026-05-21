---
id: QS-SYS-01
title: "Tài khoản & Đăng nhập"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER, PERSONA-OWNER"
target_output: ["BF-SYS-01 validate", "BF-SYS-05 validate", "US-SYS01-01..03 validate"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, system, account, login, iam]
---

# QS-SYS-01: Tài khoản & Đăng nhập

> **BF:** BF-SYS-01, BF-SYS-05 · **Screen:** `user_management`
> **Hỏi:** BM (quản lý user cơ sở) + Owner (chính sách chung).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Ai là người tạo tài khoản cho nhân viên mới? | Chọn 1 | ○ BM ○ Owner ○ Admin IT ○ Tự đăng ký | BF-SYS-01 §2 Vai trò |
| 2 | Quy trình onboard user mới gồm những bước gì? | Chọn nhiều | ☐ Tạo tài khoản ☐ Gán vai trò ☐ Gán chi nhánh ☐ Gửi email kích hoạt ☐ Hướng dẫn sử dụng ☐ Khác: ___ | BF-SYS-01 Flow |
| 3 | Nhân viên đăng nhập bằng gì? | Chọn nhiều | ☐ Email + Mật khẩu ☐ SĐT + OTP ☐ Google SSO ☐ Zalo ☐ Khác: ___ | BF-SYS-05 AuthN method |
| 4 | Khi nhân viên quên mật khẩu, quy trình reset là gì? | Chọn 1 | ○ Tự reset qua email ○ Gọi BM reset ○ Gọi IT ○ Chưa có quy trình | BF-SYS-05 Reset flow |
| 5 | Có trường hợp nào cần khóa tài khoản không? Ai khóa? | Mở | ___ | BF-SYS-01 Lock policy |
| 6 | Khi nhân viên nghỉ việc, tài khoản xử lý thế nào? | Chọn 1 | ○ Khóa ngay ○ Khóa sau N ngày ○ Xóa hẳn ○ Chưa có quy trình | BF-SYS-01 Offboard |
| 7 | Có bao giờ 1 người dùng nhiều tài khoản hoặc 1 tài khoản nhiều người dùng? | Có/Không | ○ Có (mô tả: ___) ○ Không | POLICY-MDM-03 validate |
| 8 | Trung bình 1 tháng có bao nhiêu user mới được tạo? | Số | ___ user/tháng | Volume baseline |
| 9 | Điều gì bất tiện nhất trong việc quản lý tài khoản hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-2 | BF-SYS-01 | Validate ILM flow (Joiner) |
| 3-4 | BF-SYS-05 | Validate AuthN methods + Reset |
| 5-6 | BF-SYS-01 | Lock/Offboard policy (Leaver) |
| 7 | POLICY-MDM-03 | Validate 3-Tier Entity |
| 8 | BR baseline | Volume sizing |
| 9 | SR-BM tiềm năng | Pain point |
