---
id: QS-COM-01
title: "Sản phẩm & Combo"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-BRANCH_MANAGER, PERSONA-OWNER"
target_output: ["BF-PRD-01 validate", "SR-BM tiềm năng"]
duration: "20 phút"
status: "Active"
tags: [questionnaire, commercial, product, combo, pricing]
---

# QS-COM-01: Sản phẩm & Combo

> **BF:** BF-PRD-01 · **Screen:** `products`
> **Hỏi:** BM (quản lý sản phẩm cơ sở) + Owner (chính sách giá & combo).

---

## Câu hỏi

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| 1 | Hiện tại cơ sở có bao nhiêu sản phẩm/khóa học đang bán? | Số | ___ sản phẩm | Volume baseline |
| 2 | Sản phẩm được phân loại theo tiêu chí gì? | Chọn nhiều | ☐ Theo môn ☐ Theo trình độ ☐ Theo độ tuổi ☐ Theo thời lượng ☐ Theo hình thức (1-1, nhóm) ☐ Khác: ___ | BF-PRD-01 Classification |
| 3 | Combo gồm những gì? Ai quyết định tạo combo? | Mở | ___ | BF-PRD-01 Combo rules |
| 4 | Ai có quyền tạo/sửa/xóa sản phẩm? | Chọn nhiều | ☐ Owner ☐ BM ☐ Admin hệ thống ☐ Khác: ___ | BF-PRD-01 §2 Vai trò |
| 5 | Giá sản phẩm thay đổi bao lâu một lần? | Chọn 1 | ○ Hàng tháng ○ Hàng quý ○ Hàng năm ○ Khi có chương trình KM ○ Hiếm khi | BF-PRD-01 Price policy |
| 6 | Khi thay đổi giá, HV đang học có bị ảnh hưởng không? | Chọn 1 | ○ Không, giữ giá cũ ○ Có, áp dụng ngay ○ Tùy trường hợp | BF-PRD-01 Business Rule |
| 7 | Sản phẩm có ngày hết hạn hoặc ngừng bán không? | Có/Không | ○ Có (mô tả: ___) ○ Không | BF-PRD-01 Lifecycle |
| 8 | Giá có khác nhau giữa các chi nhánh không? | Chọn 1 | ○ Giống nhau toàn hệ thống ○ Khác theo vùng ○ BM tự quyết ○ Khác: ___ | BF-PRD-01 Pricing model |
| 9 | Điều gì bất tiện nhất khi quản lý sản phẩm/giá hiện tại? | Mở | ___ | Pain point → SR |

---

## Output Mapping

| Câu | → File | Mục |
|-----|--------|-----|
| 1-2 | BF-PRD-01 | Volume + classification |
| 3-4 | BF-PRD-01 | Combo rules + role permissions |
| 5-6 | BF-PRD-01 | Price change policy + business rules |
| 7-8 | BF-PRD-01 | Product lifecycle + pricing model |
| 9 | SR-BM tiềm năng | Pain point |
