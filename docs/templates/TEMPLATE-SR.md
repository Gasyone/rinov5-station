---
id: SR-PERSONA-XXX
title: "[Tiêu đề Yêu cầu của Stakeholder]"
type: "Stakeholder Requirement"
domain: "Business"
persona: "PERSONA-XXX"
parent_br: "BR-YYY"
status: "Draft"
priority: "High"
tags: [sr, stakeholder, persona]
---

# SR-{PERSONA}-XXX: [Tiêu đề Yêu cầu của Stakeholder]

> **Persona:** `PERSONA-XXX` ([Tên Vai trò])
> **BR cha:** `BR-YYY` ([Tiêu đề BR])
> **Tham chiếu:** `PERSONAS/PERSONA-XXX.md`, `BR/BR-YYY-*.md`

---

## 1. Phát biểu Yêu cầu (Requirement Statement)

> **Là** [Persona],
> **tôi cần** [năng lực mà hệ thống phải cung cấp],
> **để** [đạt được mục tiêu công việc cụ thể].

**Ví dụ:** *"Là CSM, tôi cần xem được danh sách học viên sắp hết hạn trong vòng 30 ngày tới ngay khi vào ca làm, để chủ động liên hệ tái phí trước khi học viên ngưng học."*

> **Lưu ý:** SR mô tả NHU CẦU của 1 nhóm người dùng, KHÔNG mô tả màn hình/component cụ thể (việc đó dành cho US ở Tier 4).

---

## 2. Bối cảnh Sử dụng (Usage Context)

| Trường | Giá trị |
|--------|---------|
| **Khi nào cần?** | [Tình huống cụ thể: hằng ngày / khi có biến cố / theo lịch] |
| **Tần suất** | [Mỗi ngày N lần / Mỗi tuần N lần / Theo sự kiện] |
| **Thiết bị** | [Web / Mobile / Cả hai] |
| **Mức độ khẩn** | [Real-time / Trong ngày / Trong tuần] |
| **Liên kết JTBD** | `PERSONA-XXX` mục 7 — JTBD #N |

---

## 3. Pain Point Đang Giải quyết

> Yêu cầu này gắn với pain point nào trong Persona?

| Pain Point Persona | Mức độ Giải quyết |
|--------------------|---------------------|
| [Trích từ `PERSONA-XXX` mục 3, item #N] | [Đầy đủ / Một phần] |

---

## 4. Tiêu chí Chấp nhận (Acceptance Criteria)

> Theo chuẩn **SMART**. Mỗi tiêu chí phải đo được mà không cần xem code.

| # | Tiêu chí | Cách đo | Kết quả mong đợi |
|---|----------|---------|-------------------|
| SR-AC-01 | [Specific] | [Measurable] | [Achievable] |
| SR-AC-02 | | | |
| SR-AC-03 | | | |

---

## 5. Ràng buộc Phi chức năng (Non-functional Constraints)

| Khía cạnh | Yêu cầu |
|-----------|---------|
| **Hiệu năng** | [VD: Hiển thị danh sách ≤ 2 giây với 1000 bản ghi] |
| **Bảo mật** | [VD: Chỉ hiển thị học viên thuộc Data Scope của CSM] |
| **Khả dụng** | [VD: Truy cập được 24/7 trong giờ hành chính] |
| **A11y** | [Tuân thủ DESIGN_SYSTEM.md §9] |
| **Đa ngôn ngữ** | [Tiếng Việt mặc định] |

---

## 6. Mức độ Ưu tiên (Priority — MoSCoW)

| Mức | Đánh dấu | Lý do |
|-----|----------|-------|
| **M**ust have | [✓ / —] | [Lý do tại sao bắt buộc] |
| **S**hould have | [✓ / —] | |
| **C**ould have | [✓ / —] | |
| **W**on't have (this release) | [✓ / —] | |

---

## 7. User Stories Phái sinh (US Children)

> SR này được hiện thực hóa qua các US nào?

| Mã US | Tiêu đề | Loại | Trạng thái |
|-------|---------|------|------------|
| `US-XXX-YY-01` | [Tiêu đề] | List / Form / Detail / Flow | Draft |
| `US-XXX-YY-02` | | | |

> Nếu chưa có US nào → SR ở trạng thái **chưa được lập kế hoạch triển khai**.

---

## 8. Quan hệ Trace (Traceability)

| Tầng | Mã | Liên kết |
|------|----|----|
| **Persona** | `PERSONA-XXX` | Người yêu cầu |
| **BR** (Tier 0) | `BR-YYY` | Yêu cầu kinh doanh cha |
| **CAP** (Tier 2) | `CAP-XXX` | Năng lực hệ thống đáp ứng |
| **BF** (Tier 3) | `BF-XXX-YY` | Nghiệp vụ cụ thể |
| **US** (Tier 4) | `US-XXX-YY-ZZ` | Câu chuyện người dùng |

> Tham chiếu: `TRACEABILITY-MATRIX.md`.

---

## 9. Phụ thuộc & Xung đột (Dependencies & Conflicts)

### 9.1. Phụ thuộc (Depends on)
- `SR-XXX-YYY`: [Mô tả phụ thuộc — phải hoàn thành trước]

### 9.2. Xung đột (Conflicts with)
- `SR-XXX-YYY`: [Mô tả xung đột — cần dàn xếp]

### 9.3. Liên quan (Related)
- `SR-XXX-YYY`: [Liên kết logic không phải phụ thuộc cứng]

---

## 10. Lịch sử Phê duyệt (Approval Log)

| Phiên bản | Ngày | Người phê duyệt | Trạng thái | Ghi chú |
|-----------|------|------------------|-----------|---------|
| v0.1 | YYYY-MM-DD | [Tên / Vai trò] | Draft | Tạo mới |
| v1.0 | | | Approved | |
