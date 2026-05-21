---
id: QS-MDM-02
title: "Thông tin Liên lạc (Contact)"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-SALE, PERSONA-CSM"
target_output: ["BF-MDM-01 validate", "US-MDM01-03 validate"]
duration: "15 phút"
status: "Active"
tags: [questionnaire, mdm, contact, phone, email, communication]
---

# QS-MDM-02: Thông tin Liên lạc (Contact)

> **BF:** BF-MDM-01 (US-MDM-01-03) · **Screen:** `contact_info`
> **Hỏi:** Sale (liên hệ khách) + CSM (chăm sóc HV).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | 1 người (PH/HV) thường có mấy số điện thoại liên lạc? | Số | ___ SĐT (ví dụ: cá nhân + công việc) | POLICY-MDM-02 Contact 1-N |
| 2 | Có cần phân biệt SĐT chính và SĐT phụ không? | Có/Không | ○ Có (đánh dấu primary) ○ Không, dùng SĐT nào cũng được | US-MDM01-03 Primary flag |
| 3 | Khi PH đổi số điện thoại, quy trình cập nhật là gì? | Chọn 1 | ○ CSM sửa trực tiếp ○ PH tự cập nhật ○ Gửi yêu cầu BM duyệt ○ Khác: ___ | US-MDM01-03 Update flow |
| 4 | Ai được phép sửa thông tin liên lạc? | Chọn nhiều | ☐ Sale ☐ CSM ☐ BM ☐ Chỉ BM ☐ Khách tự sửa | BF-MDM-01 Edit permission |
| 5 | Có cần lưu lịch sử thay đổi SĐT/Email không? | Có/Không | ○ Có (để truy vết) ○ Không cần | POLICY-MDM-02 Change history |
| 6 | Kênh liên lạc nào được dùng nhiều nhất? | Chọn nhiều | ☐ Gọi điện ☐ Zalo ☐ SMS ☐ Email ☐ App nội bộ ☐ Khác: ___ | US-MDM01-03 Channel priority |
| 7 | Có trường hợp SĐT không liên lạc được (sai số, khóa)? Xử lý sao? | Mở | ___ | BF-MDM-01 Invalid contact |
| 8 | 1 SĐT có thể thuộc nhiều người trong hệ thống không? (VD: PH có 2 con) | Có/Không | ○ Có ○ Không, mỗi SĐT 1 người | POLICY-MDM-01 Uniqueness |
| 9 | Điều gì bất tiện nhất khi quản lý thông tin liên lạc hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-2 | POLICY-MDM-02, US-MDM01-03 | Contact 1-N + Primary flag |
| 3-4 | US-MDM01-03, BF-MDM-01 | Update flow + Permission |
| 5 | POLICY-MDM-02 | Change history requirement |
| 6 | US-MDM01-03 | Channel priority |
| 7 | BF-MDM-01 | Invalid contact handling |
| 8 | POLICY-MDM-01 | SĐT uniqueness rule |
| 9 | SR-Sale/CSM tiềm năng | Pain point |
