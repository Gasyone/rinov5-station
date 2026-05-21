---
id: QS-COMPLIANCE-01
title: "Bảo mật Dữ liệu & Tuân thủ"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-OWNER, PERSONA-BRANCH_MANAGER"
target_output: ["BR-SEC validate", "NFR Security & Compliance"]
duration: "25 phút"
status: "Active"
tags: [questionnaire, compliance, security, data-protection, pii, audit, elicitation]
---

# QS-COMPLIANCE-01: Bảo mật Dữ liệu & Tuân thủ

> **Mục tiêu:** Hiểu cách cơ sở quản lý dữ liệu cá nhân, bảo mật, tuân thủ pháp luật.
> **Hỏi:** Owner (chịu trách nhiệm pháp lý), BM (vận hành hàng ngày).
> **Thời lượng dự kiến:** 25 phút
> **Output sẽ điền vào:** BR-SEC, NFR Security, Compliance checklist

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Dữ liệu cá nhân (PII) của HV/PH hiện lưu ở đâu? | Chọn nhiều | ☐ Excel/Google Sheet ☐ Phần mềm quản lý ☐ Sổ giấy ☐ Cloud (Google Drive, OneDrive) ☐ Server riêng ☐ Khác: ___ | BR-SEC Data storage |
| 2 | Ai có quyền truy cập dữ liệu HV/PH? | Chọn nhiều | ☐ Owner ☐ BM ☐ CSM ☐ Sale ☐ GV ☐ Kế toán ☐ Tất cả NV | BR-SEC Access control |
| 3 | Có phân quyền truy cập (ai xem gì) không? | Chọn 1 | ○ Có, phân rõ theo vai trò ○ Có nhưng lỏng lẻo ○ Không, ai cũng xem được | BR-SEC Authorization |
| 4 | Có chính sách xóa dữ liệu khi HV nghỉ học không? | Chọn 1 | ○ Có, xóa sau X tháng ○ Giữ vĩnh viễn ○ Không có chính sách ○ Không biết | BR-SEC Data retention |
| 5 | Có ghi lại ai truy cập/sửa dữ liệu (audit trail) không? | Có/Không | ○ Có, hệ thống ghi tự động ○ Có nhưng thủ công ○ Không | BR-SEC Audit |
| 6 | Dữ liệu có được backup không? Tần suất? | Chọn 1 | ○ Hàng ngày ○ Hàng tuần ○ Hàng tháng ○ Không backup ○ Không biết | BR-SEC Backup |
| 7 | Cơ sở có biết về Nghị định 13/2023 (bảo vệ dữ liệu cá nhân VN) không? | Chọn 1 | ○ Biết và đang tuân thủ ○ Biết nhưng chưa làm gì ○ Không biết | BR-SEC Compliance awareness |
| 8 | Đã từng xảy ra sự cố rò rỉ/mất dữ liệu chưa? | Có/Không | ○ Có → Mô tả: ___ ○ Không ○ Không chắc | BR-SEC Incident history |
| 9 | Nếu hệ thống mới yêu cầu xác thực 2 lớp (2FA), NV có sẵn sàng? | Chọn 1 | ○ Sẵn sàng ○ Cần đào tạo ○ Sẽ phản đối | NFR Security acceptance |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1 | BR-SEC | Data storage inventory |
| 2-3 | BR-SEC | Access control + Authorization |
| 4 | BR-SEC | Data retention policy |
| 5 | BR-SEC | Audit trail requirement |
| 6 | BR-SEC | Backup & Recovery |
| 7 | BR-SEC | Compliance gap |
| 8 | BR-SEC | Incident history |
| 9 | NFR | Security acceptance level |
