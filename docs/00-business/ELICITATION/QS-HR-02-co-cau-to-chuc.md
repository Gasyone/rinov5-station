---
id: QS-HR-02
title: "Cơ cấu Tổ chức & Phòng ban"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER, PERSONA-OWNER"
target_output: ["BF-ORG-02 validate", "US-ORG02-01..02 validate"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, hr, organization, department, structure]
---

# QS-HR-02: Cơ cấu Tổ chức & Phòng ban

> **BF:** BF-ORG-02 · **Screen:** `org_structure`
> **Hỏi:** BM (quản lý nhân sự cơ sở) + Owner (thiết kế tổ chức).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Cơ sở chia thành mấy phòng/nhóm chức năng? | Số | ___ nhóm (liệt kê: ___) | BF-ORG-02 Dept list |
| 2 | Mỗi nhóm có trưởng nhóm (team lead) không? | Có/Không | ○ Có ○ Không, BM quản lý trực tiếp | BF-ORG-02 Hierarchy |
| 3 | Ai báo cáo cho ai? (Chuỗi báo cáo) | Mở | ___ (vẽ sơ đồ nếu cần) | BF-ORG-02 Reporting line |
| 4 | Có điều chuyển nhân sự giữa các cơ sở không? | Có/Không | ○ Có (~___lần/năm) ○ Không | BF-ORG-02 Transfer policy |
| 5 | Khi điều chuyển, thông tin gì cần cập nhật? | Chọn nhiều | ☐ Chi nhánh ☐ Phòng ban ☐ Vai trò ☐ Lịch làm việc ☐ Quyền truy cập ☐ Khác: ___ | BF-ORG-02 Transfer checklist |
| 6 | 1 nhân viên có thể thuộc nhiều nhóm/phòng cùng lúc không? | Có/Không | ○ Có (ví dụ: GV dạy 2 môn) ○ Không | BF-ORG-02 Multi-dept |
| 7 | Cơ cấu tổ chức có thay đổi thường xuyên không? | Chọn 1 | ○ Ổn định (1-2 lần/năm) ○ Thay đổi mỗi quý ○ Liên tục | BF-ORG-02 Change freq |
| 8 | Có vị trí nào kiêm nhiệm (1 người 2 chức danh)? | Có/Không | ○ Có (ví dụ: ___) ○ Không | BF-ORG-02 Dual role |
| 9 | Điều gì khó nhất khi quản lý cơ cấu tổ chức hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-3 | BF-ORG-02 | Department list + Hierarchy |
| 4-5 | BF-ORG-02 | Transfer policy + Checklist |
| 6, 8 | BF-ORG-02 | Multi-dept + Dual role |
| 7 | BF-ORG-02 | Change frequency |
| 9 | SR-BM/Owner tiềm năng | Pain point |
