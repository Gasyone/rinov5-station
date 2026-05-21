---
id: QS-COM-03
title: "Thanh toán & Phiếu thu"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER, PERSONA-OWNER"
target_output: ["BF-SAL-02 validate", "SR-BM tiềm năng"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, commercial, payment, receipt, finance]
---

# QS-COM-03: Thanh toán & Phiếu thu

> **BF:** BF-SAL-02 · **Screen:** `payments`
> **Hỏi:** BM (thu tiền & đối soát) + Owner (chính sách tài chính).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Phụ huynh thanh toán bằng phương thức nào? | Chọn nhiều | ☐ Tiền mặt ☐ Chuyển khoản ☐ Quẹt thẻ ☐ Ví điện tử ☐ QR Pay ☐ Khác: ___ | BF-SAL-02 Payment methods |
| 2 | Có cho phép trả góp/chia đợt không? | Chọn 1 | ○ Có, chia 2-3 đợt ○ Có, linh hoạt ○ Không, trả 1 lần ○ Tùy giá trị đơn | BF-SAL-02 Installment |
| 3 | Phiếu thu hiện tại dạng gì? | Chọn 1 | ○ In giấy ○ Điện tử (PDF/email) ○ Cả hai ○ Không có phiếu thu | BF-SAL-02 Receipt format |
| 4 | Khi cần hoàn tiền, quy trình như thế nào? | Mở | ___ | BF-SAL-02 Refund flow |
| 5 | Ai có quyền thu tiền và xuất phiếu thu? | Chọn nhiều | ☐ BM ☐ Sale ☐ Kế toán ☐ Lễ tân ☐ Khác: ___ | BF-SAL-02 §2 Vai trò |
| 6 | Cuối ngày có đối soát tiền thu không? Quy trình? | Chọn 1 | ○ Có, đối soát hằng ngày ○ Có, hằng tuần ○ Không có quy trình ○ Khác: ___ | BF-SAL-02 Reconciliation |
| 7 | Khi PH chuyển khoản, bao lâu xác nhận được? | Chọn 1 | ○ Ngay lập tức (auto) ○ Trong ngày ○ 1-2 ngày ○ Không kiểm soát được | BF-SAL-02 Confirmation |
| 8 | Có trường hợp nào thu sai/thiếu tiền không? Xử lý thế nào? | Mở | ___ | BF-SAL-02 Exception |
| 9 | Điều gì bất tiện nhất trong quy trình thu tiền hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-2 | BF-SAL-02 | Payment methods + installment policy |
| 3-5 | BF-SAL-02 | Receipt format + refund + roles |
| 6-7 | BF-SAL-02 | Reconciliation + confirmation |
| 8 | BF-SAL-02 | Exception handling |
| 9 | SR-BM tiềm năng | Pain point |
