---
id: BR-XXX
title: "[Tiêu đề Yêu cầu Kinh doanh]"
type: "Business Requirement"
domain: "Business"
status: "Draft"
priority: "High"
tags: [br, business, stakeholder]
---

# BR-XXX: [Tiêu đề Yêu cầu Kinh doanh]

> **Vị trí:** Tier 0 — phát sinh từ Vision/OKR, là cha của các Stakeholder Requirements (SR).
> **Loại tài liệu:** Yêu cầu của TỔ CHỨC (không phải của 1 cá nhân).
> **Tham chiếu:** `VISION.md`, `STAKEHOLDERS.md`.

---

## 1. Phát biểu Yêu cầu (Requirement Statement)

> *"[Một câu duy nhất, ≤ 40 từ, dùng ngôn ngữ kinh doanh. Tránh thuật ngữ kỹ thuật và giải pháp.]"*

**Ví dụ:** *"Tổ chức cần một nguồn dữ liệu duy nhất về học viên/phụ huynh xuyên các kênh Station-Tutor-Digital, để giảm trùng lặp hồ sơ và sai lệch trong vận hành."*

> **Lưu ý quan trọng:** BR mô tả VẤN ĐỀ và KẾT QUẢ MONG MUỐN, KHÔNG mô tả GIẢI PHÁP. Giải pháp được trình bày ở Tier 2-4 (CAP/BF/US).

---

## 2. Bối cảnh & Lý do (Context & Rationale)

[2-4 đoạn ngắn mô tả: vì sao yêu cầu này phát sinh? Tình huống hiện tại là gì? Vì sao không thể giữ nguyên trạng?]

### 2.1. Hiện trạng (As-Is)

[Mô tả tình hình ngày hôm nay khi chưa có yêu cầu này được giải quyết.]

### 2.2. Mong muốn (To-Be)

[Mô tả tình hình lý tưởng sau khi yêu cầu này được giải quyết.]

---

## 3. Mục tiêu Kinh doanh Liên quan (OKR/KPI Mapping)

| Mã | Loại | Tên | Đóng góp của BR này |
|----|------|-----|----------------------|
| `OKR-01` | Mục tiêu | [Tên OKR] | [Mô tả định lượng nếu có] |
| `KPI-001` | Chỉ số | [Tên KPI] | [Tăng/Giảm bao nhiêu] |

> Mọi BR **PHẢI** có ít nhất 1 OKR hoặc KPI để đo lường. Nếu không đo được, không phải BR — có thể là Idea hoặc Wish.

---

## 4. Stakeholder Liên quan (RACI)

| Vai trò | R | A | C | I | Ghi chú |
|---------|---|---|---|---|---------|
| `PERSONA-OWNER` | | ✅ | | | Người phê duyệt cuối |
| `PERSONA-XXX` | ✅ | | | | Người chịu trách nhiệm thực thi |
| `PERSONA-YYY` | | | ✅ | | Tham vấn |
| `PERSONA-ZZZ` | | | | ✅ | Được thông báo |

> **R**esponsible · **A**ccountable · **C**onsulted · **I**nformed

---

## 5. Tiêu chí Thành công Kinh doanh (Business Success Criteria)

> Sau khi BR này được giải quyết, làm sao biết là thành công?

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Mức đạt | Hạn |
|---|--------------------|-----------------------|---------|-----|
| BR-AC-01 | [Tiêu chí] | [Cách đo] | [Ngưỡng] | [Q/Năm] |
| BR-AC-02 | | | | |

> Theo chuẩn **SMART**: mỗi tiêu chí phải Specific, Measurable, Achievable, Relevant, Time-bound.

---

## 6. Ràng buộc & Giả định (Constraints & Assumptions)

### 6.1. Ràng buộc (Constraints)
- **Ngân sách:** [Nếu có]
- **Thời gian:** [Nếu có]
- **Pháp lý / Tuân thủ:** [Nếu có — VD: Luật bảo mật dữ liệu cá nhân]
- **Kỹ thuật:** [Hệ thống hiện hữu phải tích hợp với …]

### 6.2. Giả định (Assumptions)
- [Điều phải đúng để BR này có ý nghĩa]
- [Điều phải đúng để BR này có ý nghĩa]

---

## 7. Stakeholder Requirements Phái sinh (SR Children)

> Yêu cầu của tổ chức (BR) sẽ được cụ thể hóa thành các nhu cầu của từng nhóm (SR).

| Mã SR | Persona | Tiêu đề | Trạng thái |
|-------|---------|---------|------------|
| `SR-XXX-001-[name]` | `PERSONA-XXX` | [Tiêu đề SR] | Draft |
| `SR-YYY-001-[name]` | `PERSONA-YYY` | | |

---

## 8. Năng lực Hệ thống Đáp ứng (CAP Mapping)

> BR này được hiện thực hóa qua các Capability nào trong hệ thống?

| CAP | Vai trò | Mức độ Đáp ứng |
|-----|---------|------------------|
| `CAP-XXX` | [Vai trò chính / phụ] | [Đầy đủ / Một phần / Cần bổ sung] |
| `CAP-YYY` | | |

> Nếu không có CAP nào đáp ứng → BR là **gap nghiệp vụ** cần thiết kế CAP/BF mới.

---

## 9. Tuân thủ Đạo luật (Policy Compliance)

> Tham chiếu `ENTERPRISE_STANDARDS.md`.

- Tuân thủ `[POLICY-XXX-YY]`: [Mô tả ngắn]
- Tuân thủ `[POLICY-AAA-BB]`: [Mô tả ngắn]

---

## 10. Lịch sử Phê duyệt (Approval Log)

| Phiên bản | Ngày | Người phê duyệt | Trạng thái | Ghi chú |
|-----------|------|------------------|-----------|---------|
| v0.1 | YYYY-MM-DD | [Tên / Vai trò] | Draft | Tạo mới |
| v1.0 | | | Approved | |

---

## 11. Chỉ dẫn cho AI Agent & Lập trình viên

- BR là **đầu vào**, không phải đầu ra. AI **KHÔNG** tự sinh BR — phải có người ký xác nhận.
- Khi BR thay đổi, **PHẢI** trigger review tất cả SR/CAP/BF/US trace về nó (xem `TRACEABILITY-MATRIX.md`).
- Khi viết CAP/BF/US mới, **PHẢI** trace ngược về BR cha. Nếu không trace được → tạo BR mới hoặc loại bỏ CAP/BF/US đó.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** đặt giải pháp kỹ thuật vào BR (UI, API, schema, component name).
- **KHÔNG** copy nội dung từ CAP/BF/US ngược lên BR — quan hệ là **xuôi**, không ngược.
- **KHÔNG** dùng động từ kỹ thuật ("triển khai", "tích hợp API", "render UI") trong BR. Dùng động từ kinh doanh ("giảm", "tăng", "đảm bảo", "loại bỏ").
- **KHÔNG** thêm BR mới mà không có Owner ký xác nhận trong Approval Log.
