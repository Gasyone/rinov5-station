---
id: CONFLICT-RESOLUTION
title: "Hướng dẫn Xử lý Xung đột Yêu cầu"
type: "Guide"
domain: "Elicitation"
status: "Active"
tags: [guide, conflict, resolution, elicitation, persona, requirements]
---

# Hướng dẫn Xử lý Xung đột Yêu cầu

> **Mục đích:** Cung cấp quy trình rõ ràng khi 2+ Persona có yêu cầu mâu thuẫn nhau.
> **Dùng khi:** Phát hiện xung đột trong Synthesis hoặc trong quá trình phỏng vấn.

---

## 1. Khi nào Xảy ra Xung đột?

Xung đột xảy ra khi **2 Persona muốn điều khác nhau** cho cùng 1 tính năng:

- **BM** muốn báo cáo chi tiết 20 cột → **Teacher** muốn form ngắn gọn 3 field.
- **Owner** muốn kiểm soát chặt (phê duyệt mọi thứ) → **Sale** muốn tự chủ (tạo đơn nhanh).
- **CSM** muốn gọi điện tự do → **BM** muốn log mọi cuộc gọi.

> ⚠️ Xung đột là **bình thường** — không có Persona nào "sai". Quan trọng là cách giải quyết.

---

## 2. Quy trình 5 Bước

### Bước 1: Ghi nhận cả 2 bên

- Ghi rõ yêu cầu của từng Persona vào bảng xung đột (mục 3).
- **KHÔNG** bỏ qua hoặc giảm nhẹ yêu cầu của bên nào.

### Bước 2: Phân tích Root Cause

- Tại sao Persona A muốn X? (Mục đích thực sự là gì?)
- Tại sao Persona B muốn Y? (Mục đích thực sự là gì?)
- Có phải họ muốn cùng 1 kết quả nhưng khác cách tiếp cận?

### Bước 3: Tìm giải pháp Win-Win

- Áp dụng nguyên tắc **Progressive Disclosure**: hiển thị ít mặc định, mở rộng khi cần.
- Áp dụng nguyên tắc **RBAC/ABAC**: cùng 1 màn hình, khác quyền xem/sửa.
- Áp dụng nguyên tắc **Capability–Persona Decoupling**: 1 năng lực, cấu hình khác nhau.

### Bước 4: Nếu không Win-Win → Escalate lên Owner

- Trình bày cả 2 phương án + ưu/nhược điểm.
- Owner quyết định dựa trên chiến lược kinh doanh.
- Ghi lại quyết định + lý do.

### Bước 5: Ghi quyết định vào BR/SR

- Cập nhật BR/SR liên quan với quyết định cuối cùng.
- Ghi rõ "Đã giải quyết xung đột" + link đến Synthesis.

---

## 3. Bảng Mẫu Xung đột

| Persona A | Yêu cầu A | Persona B | Yêu cầu B | Root Cause | Giải pháp | Quyết định bởi |
|-----------|-----------|-----------|-----------|-----------|-----------|----------------|
| BM | Báo cáo điểm danh 10 cột | Teacher | Form điểm danh 3 field | BM cần data phân tích, Teacher cần tốc độ | Form 3 field bắt buộc + 7 field tùy chọn | Product Owner |
| Owner | Phê duyệt mọi đơn hàng | Sale | Tạo đơn nhanh không chờ | Owner lo rủi ro, Sale cần tốc độ | Auto-approve đơn ≤ 5tr, phê duyệt đơn > 5tr | Owner |
| CSM | Gọi điện tự do cho phụ huynh | BM | Log mọi cuộc gọi | CSM cần linh hoạt, BM cần kiểm soát | Gọi tự do + auto-log (không cần nhập tay) | BM + Owner |

---

## 4. Nguyên tắc Capability–Persona Decoupling

> **1 năng lực, khác nhau qua cấu hình — KHÔNG tạo 2 bản sao.**

- ❌ Sai: Tạo "Form điểm danh cho Teacher" + "Form điểm danh cho BM" (2 màn hình riêng).
- ✅ Đúng: 1 form điểm danh, Teacher thấy 3 field, BM thấy 10 field (qua RBAC/progressive disclosure).

Áp dụng khi:
- 2 Persona dùng **cùng 1 tính năng** nhưng cần **mức độ chi tiết khác nhau**.
- Giải pháp: Cấu hình hiển thị theo vai trò, không nhân đôi code/UI.

---

## 5. Ví dụ Thực tế

**Tình huống:** Teacher muốn form điểm danh chỉ 3 field (Có mặt / Vắng / Ghi chú). BM muốn 10 field (thêm: Lý do vắng, Đã liên hệ PH, Thời gian đến muộn, Thái độ, ...).

**Phân tích:**
- Teacher: Cần tốc độ — điểm danh 30 học viên trong 2 phút.
- BM: Cần data — phân tích tỷ lệ vắng, lý do, xu hướng.

**Giải pháp:** Progressive Disclosure
- **Mặc định:** 3 field bắt buộc (Có mặt / Vắng / Ghi chú ngắn).
- **Mở rộng:** 7 field tùy chọn (hiện khi click "Chi tiết" hoặc khi BM xem).
- **Kết quả:** Teacher nhanh, BM đủ data. Không ai "thua".

---

## 6. Guardrails (Hàng rào An toàn)

- **KHÔNG** để 1 Persona "thắng" mà không có lý do rõ ràng — phải có phân tích.
- **KHÔNG** tạo feature riêng cho từng Persona nếu có thể dùng chung (Decoupling).
- **KHÔNG** bỏ qua xung đột — ghi nhận và giải quyết, dù mất thời gian.
- **KHÔNG** để AI tự quyết định xung đột — escalate lên Owner/Product Owner.
- Mọi quyết định xung đột phải được **ghi lại** (ai quyết, khi nào, lý do gì).
