---
id: VISION
title: "Tầm nhìn & Mục tiêu Kinh doanh"
type: "Vision"
domain: "Business"
status: "Draft"
tags: [vision, okr, kpi, north-star]
---

# Tầm nhìn Sản phẩm & Mục tiêu Kinh doanh

> **Vị trí:** Tier 0 — đặt trước `ENTERPRISE_STANDARDS.md` (Tier 1).
> **Đối tượng đọc:** Owner, Stakeholder, Đầu não dự án.
> **Tần suất cập nhật:** Mỗi quý hoặc khi có thay đổi chiến lược.

---

## 1. Tầm nhìn (Vision Statement)

> *"[Một câu duy nhất, ≤ 30 chữ, mô tả trạng thái cuối mong muốn. Tránh thuật ngữ kỹ thuật.]"*

**Ví dụ tham khảo:** *"Trở thành nền tảng vận hành chuẩn cho mọi cơ sở giáo dục Station tại Việt Nam vào năm 20XX."*

---

## 2. Sứ mệnh (Mission)

[2-3 câu mô tả: Rinov5 phục vụ ai? Bằng cách nào? Tạo ra giá trị gì khác biệt?]

---

## 3. Vấn đề Đang Giải quyết (Problem Statement)

| # | Vấn đề Hiện tại | Đối tượng Bị ảnh hưởng | Mức độ Thiệt hại (định lượng nếu có) |
|---|-----------------|------------------------|--------------------------------------|
| 1 | [Mô tả vấn đề] | [Vai trò bị ảnh hưởng] | [Số liệu / cảm tính] |
| 2 | | | |
| 3 | | | |

> **Lưu ý:** Nêu vấn đề THỰC TẾ đang xảy ra, không phải vấn đề giả định. Mỗi vấn đề phải có ít nhất 1 BR phía dưới giải quyết.

---

## 4. Đối tượng Phục vụ (Target Users)

| Vai trò | Mô tả ngắn | Số lượng dự kiến | Tham chiếu Persona |
|---------|------------|------------------|---------------------|
| [Vai trò 1] | [Câu mô tả ngắn] | [N người] | `PERSONA-XXX` |
| [Vai trò 2] | | | |

---

## 5. Phạm vi Có & Không (Scope)

### ✅ Có bao gồm
- [Năng lực / Kết quả 1]
- [Năng lực / Kết quả 2]

### ❌ Không bao gồm (Out of Scope)
- [Năng lực bị loại trừ 1] — *Lý do: [thuộc domain khác / không ưu tiên]*
- [Năng lực bị loại trừ 2]

---

## 6. Chỉ số Bắc đẩu (North Star Metric)

> Một và chỉ một chỉ số duy nhất phản ánh giá trị cốt lõi mà Rinov5 mang lại. Toàn bộ OKR/KPI phía dưới đều dẫn về chỉ số này.

| | Giá trị |
|---|---------|
| **Tên chỉ số** | [Ví dụ: Số học viên active hàng tháng được vận hành qua Rinov5] |
| **Đơn vị** | [HV / Đơn / Phút / %] |
| **Mục tiêu năm** | [Số mục tiêu] |
| **Hiện tại** | [Baseline] |
| **Tần suất đo** | [Hàng ngày / Tuần / Tháng] |

---

## 7. Mục tiêu Quý/Năm (OKR)

### `OKR-01` [Tên Mục tiêu Đầu tiên]

| Loại | Nội dung |
|------|----------|
| **Objective** | [Câu định tính, truyền cảm hứng] |
| **Key Result 1** | [Đo được, có ngưỡng] |
| **Key Result 2** | |
| **Key Result 3** | |
| **Hạn** | [Q1/Q2/Q3/Q4 năm YYYY] |
| **BR liên quan** | `BR-XXX`, `BR-YYY` |

### `OKR-02` [...]

---

## 8. Chỉ số Vận hành (KPI)

| Mã KPI | Tên KPI | Đơn vị | Mục tiêu | Tần suất | Người chịu trách nhiệm |
|--------|---------|--------|----------|----------|-------------------------|
| `KPI-001` | [Tên] | [Đơn vị] | [Số] | [Tần suất] | [Vai trò] |
| `KPI-002` | | | | | |

---

## 9. Định vị Chiến lược (vs Hệ sinh thái RinoEdu)

> Tham chiếu: `docs/ECOSYSTEM_OVERVIEW.md`.

| Hệ thống | Vai trò | Quan hệ với Rinov5 |
|----------|---------|--------------------|
| Rinov5 | Station ERP All-in-One | Domain chính của tài liệu này |
| LMS | Nội dung học | Tích hợp, không thay thế |
| CRM cũ / ERP cũ / CARE cũ | Domain phân mảnh | Bị thay thế (Station scope) |

---

## 10. Cột mốc Lịch (Roadmap Tóm tắt)

| Mốc | Thời điểm | Năng lực bàn giao | OKR liên quan |
|-----|-----------|-------------------|---------------|
| M0 — Foundation | [QX/YYYY] | [Mô tả ngắn] | `OKR-01` |
| M1 — [Tên] | | | |
| M2 — [Tên] | | | |

---

## 11. Tham chiếu Tài liệu Liên quan

- `STAKEHOLDERS.md` — Bản đồ người liên quan và RACI.
- `PERSONAS/*.md` — Hồ sơ chi tiết người dùng.
- `BR/BR-*.md` — Yêu cầu kinh doanh phát sinh từ Vision này.
- `ENTERPRISE_STANDARDS.md` — Đạo luật kỹ thuật (Tier 1).

---

## 12. Chỉ dẫn cho AI Agent & Lập trình viên

- File này là **nguồn cấp cao nhất** cho mọi quyết định scope.
- Khi đề xuất tính năng mới, **phải** truy ngược về một OKR hoặc KPI cụ thể.
- Nếu một tính năng không khớp Vision, phải hoặc (a) cập nhật Vision có ký xác nhận của Owner, hoặc (b) loại bỏ tính năng.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** thay đổi North Star Metric mà không có phê duyệt của Product Owner.
- **KHÔNG** thêm OKR/KPI vượt quá năng lực thực tế của đội — phải dựa trên dữ liệu lịch sử.
- **KHÔNG** đặt nội dung kỹ thuật (kiến trúc, API, schema) vào file này — đó là việc của Tier 1-4.
