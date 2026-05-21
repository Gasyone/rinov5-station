---
id: QS-SYS-02
title: "Phân quyền & Nhóm quyền"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER, PERSONA-OWNER"
target_output: ["BF-SYS-04 validate", "US-SYS04-01..03 validate"]
duration: "25 phút"
status: "Active"
tags: [questionnaire, system, authorization, role, rbac]
---

# QS-SYS-02: Phân quyền & Nhóm quyền

> **BF:** BF-SYS-04 · **Screen:** `role_management`
> **Hỏi:** BM (gán quyền hàng ngày) + Owner (chính sách phân quyền).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Hiện tại cơ sở có bao nhiêu vai trò (role) khác nhau? | Số | ___ vai trò (liệt kê: ___) | BF-SYS-04 Role list |
| 2 | Ai là người gán/thay đổi quyền cho nhân viên? | Chọn 1 | ○ Owner ○ BM ○ Admin IT ○ Tự chọn | BF-SYS-04 §2 Vai trò |
| 3 | Quyền được phân theo hành động hay theo dữ liệu? | Chọn nhiều | ☐ Theo hành động (xem/sửa/xóa) ☐ Theo dữ liệu (chi nhánh/lớp) ☐ Kết hợp cả hai ☐ Không rõ | POLICY-IAM-03 validate |
| 4 | Có trường hợp nào quyền bị gán sai gây sự cố không? | Có/Không | ○ Có (mô tả: ___) ○ Không | BF-SYS-04 Corner case |
| 5 | Khi nhân viên chuyển vị trí (Sale → CSM), quyền thay đổi thế nào? | Chọn 1 | ○ Gỡ role cũ + gán role mới ○ Thêm role mới giữ cũ ○ Chưa có quy trình | BF-SYS-04 Mover flow |
| 6 | Có nhu cầu tạo nhóm quyền tùy chỉnh (custom role) không? | Có/Không | ○ Có (ví dụ: ___) ○ Không, dùng role cố định | BF-SYS-04 Custom role |
| 7 | 1 người có thể giữ nhiều vai trò cùng lúc không? | Có/Không | ○ Có (ví dụ: GV kiêm CSM) ○ Không | BF-SYS-04 Multi-role |
| 8 | Có quyền nào chỉ Owner mới được phép (không ủy quyền)? | Mở | ___ | BF-SYS-04 Exclusive perms |
| 9 | Bao lâu thì cần review lại quyền của nhân viên? | Chọn 1 | ○ Mỗi tháng ○ Mỗi quý ○ Khi có sự cố ○ Không review | POLICY-IAM-02 Audit |
| 10 | Điều gì khó nhất khi phân quyền hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-2 | BF-SYS-04 | Role catalog + assignment flow |
| 3 | POLICY-IAM-03 | Validate RBAC+ABAC model |
| 4-5 | BF-SYS-04 | Corner case + Mover flow |
| 6-7 | BF-SYS-04 | Custom role + Multi-role policy |
| 8 | BF-SYS-04 | Exclusive permissions |
| 9 | POLICY-IAM-02 | Audit cycle |
| 10 | SR-BM/Owner tiềm năng | Pain point |
