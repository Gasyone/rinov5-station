---
id: QS-MDM-01
title: "Hồ sơ Cá nhân (Person/Identity)"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-SALE, PERSONA-CSM, PERSONA-BRANCH_MANAGER"
target_output: ["BF-MDM-01 validate", "US-MDM01-01..03 validate"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, mdm, person, identity, golden-record]
---

# QS-MDM-01: Hồ sơ Cá nhân (Person/Identity)

> **BF:** BF-MDM-01 · **Screen:** `students`, `contacts`
> **Hỏi:** Sale (nhập khách mới) + CSM (quản lý HV) + BM (giám sát).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Khi có khách hàng mới (phụ huynh/HV), ai là người nhập thông tin? | Chọn 1 | ○ Sale ○ Lễ tân ○ CSM ○ Khách tự điền form ○ Khác: ___ | BF-MDM-01 §2 Vai trò |
| 2 | Thông tin nào bắt buộc phải có khi tạo hồ sơ? | Chọn nhiều | ☐ Họ tên ☐ SĐT ☐ Email ☐ Ngày sinh ☐ Giới tính ☐ Địa chỉ ☐ CCCD ☐ Khác: ___ | US-MDM01-01 Required fields |
| 3 | Có kiểm tra trùng lặp khi nhập khách mới không? | Chọn 1 | ○ Có (theo SĐT) ○ Có (theo tên + ngày sinh) ○ Không kiểm tra ○ Khác: ___ | POLICY-MDM-01 Dedup rule |
| 4 | Khi phát hiện trùng, xử lý thế nào? | Chọn 1 | ○ Gộp (merge) ○ Cảnh báo rồi cho tạo ○ Không cho tạo ○ Chưa có quy trình | POLICY-MDM-01 Merge flow |
| 5 | Phân biệt Phụ huynh và Học viên thế nào trong hệ thống? | Chọn 1 | ○ 2 bản ghi riêng ○ 1 bản ghi chung gắn tag ○ PH là contact của HV | POLICY-MDM-03 Entity model |
| 6 | Thông tin nào của HV thay đổi thường xuyên nhất? | Chọn nhiều | ☐ SĐT ☐ Địa chỉ ☐ Email ☐ Trường học ☐ Lớp (trường phổ thông) ☐ Khác: ___ | US-MDM01-03 Update fields |
| 7 | Ai được phép sửa thông tin cá nhân của HV/PH? | Chọn nhiều | ☐ Sale ☐ CSM ☐ BM ☐ Chỉ BM ☐ Khác: ___ | BF-MDM-01 Edit permission |
| 8 | Có cần lưu ảnh đại diện (avatar) không? | Có/Không | ○ Có ○ Không cần | US-MDM01-01 Avatar field |
| 9 | Trung bình 1 tháng có bao nhiêu khách mới được nhập? | Số | ___ người/tháng | Volume baseline |
| 10 | Điều gì bất tiện nhất khi nhập/quản lý hồ sơ khách hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-2 | BF-MDM-01, US-MDM01-01 | Create person flow + Fields |
| 3-4 | POLICY-MDM-01 | Golden Record dedup + Merge |
| 5 | POLICY-MDM-03 | Entity model validation |
| 6-7 | US-MDM01-03, BF-MDM-01 | Update fields + Permission |
| 8 | US-MDM01-01 | Avatar requirement |
| 9 | BR baseline | Volume sizing |
| 10 | SR-Sale/CSM tiềm năng | Pain point |
