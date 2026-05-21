---
id: QS-MDM-03
title: "Hộ gia đình & Quan hệ"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-SALE, PERSONA-CSM, PERSONA-BRANCH_MANAGER"
target_output: ["BF-MDM-02 validate", "US-MDM02-01..02 validate"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, mdm, household, family, relationship, billing]
---

# QS-MDM-03: Hộ gia đình & Quan hệ

> **BF:** BF-MDM-02 · **Screen:** `households`
> **Hỏi:** Sale (tư vấn gia đình) + CSM (chăm sóc) + BM (quản lý tài chính).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Có nhiều phụ huynh có 2-3 con cùng học tại trung tâm không? | Có/Không | ○ Có (~___%) ○ Hiếm ○ Không | BF-MDM-02 Household freq |
| 2 | Khi PH có nhiều con, bill/hóa đơn gộp hay tách riêng? | Chọn 1 | ○ Gộp 1 bill chung ○ Tách riêng từng HV ○ Tùy PH chọn | BF-MDM-02 Billing model |
| 3 | Ai là người thanh toán chính trong gia đình? | Chọn 1 | ○ Bố ○ Mẹ ○ Tùy gia đình ○ Cả hai đều có thể | BF-MDM-02 Payer role |
| 4 | Quan hệ nào cần ghi nhận trong hệ thống? | Chọn nhiều | ☐ Bố/Mẹ - Con ☐ Anh/Chị/Em ☐ Ông/Bà - Cháu ☐ Người giám hộ ☐ Khác: ___ | BF-MDM-02 Relationship types |
| 5 | Có trường hợp bố mẹ ly hôn, 2 người cùng theo dõi 1 HV? | Có/Không | ○ Có ○ Không/Hiếm | BF-MDM-02 Multi-guardian |
| 6 | Khi có ưu đãi "anh chị em" (sibling discount), hệ thống cần biết gì? | Mở | ___ | BF-MDM-02 Sibling discount |
| 7 | Ai tạo/quản lý thông tin hộ gia đình? | Chọn 1 | ○ Sale (khi tư vấn) ○ CSM (khi chăm sóc) ○ Hệ thống tự gộp theo SĐT ○ Khác: ___ | BF-MDM-02 §2 Vai trò |
| 8 | Có cần gửi thông báo cho tất cả PH trong hộ hay chỉ 1 người? | Chọn 1 | ○ Tất cả ○ Chỉ người liên hệ chính ○ Tùy loại thông báo | POLICY-MDM-04 Notification |
| 9 | Khi 1 HV chuyển đi, hộ gia đình còn lại xử lý sao? | Chọn 1 | ○ Giữ nguyên hộ ○ Xóa HV khỏi hộ ○ Không quan tâm | BF-MDM-02 Member removal |
| 10 | Điều gì bất tiện nhất khi quản lý quan hệ gia đình hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-3 | BF-MDM-02 | Household model + Billing |
| 4-5 | BF-MDM-02 | Relationship types + Multi-guardian |
| 6 | BF-MDM-02 | Sibling discount rule |
| 7 | BF-MDM-02 | Household admin role |
| 8 | POLICY-MDM-04 | Notification scope |
| 9 | BF-MDM-02 | Member lifecycle |
| 10 | SR-Sale/CSM/BM tiềm năng | Pain point |
