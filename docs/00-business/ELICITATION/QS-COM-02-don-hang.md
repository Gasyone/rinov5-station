---
id: QS-COM-02
title: "Tạo Đơn hàng & Chốt Sale"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-SALE, PERSONA-BRANCH_MANAGER"
target_output: ["BF-SAL-01 validate", "SR-SALE tiềm năng"]
duration: "25 phút"
status: "Active"
tags: [questionnaire, commercial, order, sale, enrollment]
---

# QS-COM-02: Tạo Đơn hàng & Chốt Sale

> **BF:** BF-SAL-01 · **Screen:** `orders`
> **Hỏi:** Sale (người tạo đơn) + BM (duyệt đơn & theo dõi).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Ai là người tạo đơn hàng? | Chọn nhiều | ☐ Sale ☐ BM ☐ Lễ tân ☐ Khác: ___ | BF-SAL-01 §2 Vai trò |
| 2 | Một đơn hàng gồm những thông tin gì? | Chọn nhiều | ☐ Tên HV ☐ Sản phẩm/khóa ☐ Số tiền ☐ Giảm giá ☐ Phương thức TT ☐ Ghi chú ☐ Khác: ___ | BF-SAL-01 Fields |
| 3 | Có chương trình giảm giá/khuyến mãi không? Ai duyệt? | Mở | ___ | BF-SAL-01 Discount policy |
| 4 | Đơn hàng có cần ai duyệt trước khi xác nhận không? | Chọn 1 | ○ Không, Sale tự xác nhận ○ BM duyệt ○ Owner duyệt nếu > N triệu ○ Khác: ___ | BF-SAL-01 Approval flow |
| 5 | Khi nào đơn hàng bị hủy? Ai có quyền hủy? | Mở | ___ | BF-SAL-01 Cancel policy |
| 6 | Đơn hàng có những trạng thái nào? | Chọn nhiều | ☐ Nháp ☐ Chờ duyệt ☐ Đã duyệt ☐ Đã thanh toán ☐ Hoàn thành ☐ Đã hủy ☐ Khác: ___ | BF-SAL-01 Status lifecycle |
| 7 | Một HV có thể mua nhiều đơn cùng lúc không? | Có/Không | ○ Có ○ Không ○ Tùy trường hợp | BF-SAL-01 Business Rule |
| 8 | Sau khi chốt đơn, bước tiếp theo là gì? | Chọn nhiều | ☐ Thu tiền ☐ Xếp lớp ☐ Gửi thông báo PH ☐ In hợp đồng ☐ Khác: ___ | BF-SAL-01 Post-order flow |
| 9 | Trung bình 1 tuần cơ sở tạo bao nhiêu đơn hàng? | Số | ___ đơn/tuần | Volume baseline |
| 10 | Điều gì mất thời gian nhất khi tạo đơn hàng? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-2 | BF-SAL-01 | Validate roles + order fields |
| 3-4 | BF-SAL-01 | Discount + approval flow |
| 5-6 | BF-SAL-01 | Cancel policy + status lifecycle |
| 7-8 | BF-SAL-01 | Business rules + post-order flow |
| 9 | BR baseline | Volume sizing |
| 10 | SR-SALE tiềm năng | Pain point |
