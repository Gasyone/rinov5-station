---
id: VISION
title: "Tầm nhìn & Mục tiêu Kinh doanh — Rinov5 Station ERP"
type: "Vision"
domain: "Business"
status: "Draft-NeedsValidation"
tags: [vision, okr, kpi, north-star]
---

# Tầm nhìn Sản phẩm & Mục tiêu Kinh doanh

> **Vị trí:** Tier 0 — đứng cùng `STAKEHOLDERS.md`, là cha của các BR.
> **Trạng thái:** Bản dựng tối thiểu cho Pilot 4. Phần `⓪` cần Owner xác nhận.

---

## 1. Tầm nhìn (Vision Statement)

> *"Trở thành nền tảng vận hành chuẩn cho mọi cơ sở Station của RinoEdu, hợp nhất CRM/ERP/CARE phân mảnh thành một nguồn dữ liệu duy nhất, để mỗi học viên được phục vụ liền mạch xuyên suốt vòng đời học tập."*

---

## 2. Sứ mệnh (Mission)

Rinov5 phục vụ **Owner, Branch Manager, Sale, CSM, Teacher** tại các cơ sở Station bằng cách thay thế các hệ thống phân mảnh (CRM cũ, ERP cũ, CARE cũ) bằng một nền tảng all-in-one. Giá trị khác biệt: **một học viên = một bản ghi vàng** xuyên kênh, nghiệp vụ tự động hóa thay cho thao tác tay.

---

## 3. Vấn đề Đang Giải quyết (Problem Statement)

| # | Vấn đề Hiện tại | Đối tượng Bị ảnh hưởng | Mức độ Thiệt hại |
|---|-----------------|------------------------|------------------|
| 1 | Hồ sơ học viên/phụ huynh phân mảnh giữa CRM/ERP/CARE → trùng lặp, khó tổng hợp doanh thu trên 1 khách | OWNER, BM, SALE, CSM | ⓪ Cao — không đo được lifetime value chính xác |
| 2 | ⓪ Tỷ lệ tái phí giảm vì không phát hiện sớm học viên rủi ro nghỉ học | OWNER, BM, CSM | Cao — mất doanh thu định kỳ |
| 3 | Báo cáo cuối tháng phải tổng hợp tay từ 4 hệ thống | OWNER, BM | Cao — 1-2 ngày người làm/tháng |
| 4 | Không có quy trình chuẩn cho mọi cơ sở → mở cơ sở mới phải đào tạo lại từ đầu | OWNER | Cao — cản trở mở rộng |

---

## 4. Đối tượng Phục vụ (Target Users)

| Vai trò | Mô tả ngắn | Tham chiếu |
|---------|------------|------------|
| Chủ doanh nghiệp / Founder | Ra quyết định cấp chuỗi | `PERSONA-OWNER` |
| Quản lý cơ sở | Vận hành 1 cơ sở | `PERSONA-BRANCH_MANAGER` |
| Tư vấn tuyển sinh | Chốt đơn lead | `PERSONA-SALE` |
| Chăm sóc học viên | Retention + ticket | `PERSONA-CSM` |
| Giáo viên | Đứng lớp, điểm danh, nhận xét | `PERSONA-TEACHER` |

---

## 5. Phạm vi Có & Không (Scope)

### ✅ Có bao gồm
- 11 Capability: ADM, COM, OPS, ACD, CARE, FIN, HR, FCM, SYS, MDM, RPT.
- Mô hình Station (offline tại cơ sở).
- Tích hợp dữ liệu cơ bản với LMS (đọc kết quả test, đẩy điểm danh).

### ❌ Không bao gồm (Out of Scope)
- Vận hành Tutor / Digital — *Lý do: domain khác trong RinoEdu.*
- LMS content authoring — *Lý do: LMS là hệ thống riêng.*
- Payroll chi tiết / Kế toán — *Lý do: thuộc domain Finance backoffice riêng.*
- Mobile app cho học viên/phụ huynh — *Lý do: ưu tiên nhân viên trước.*

---

## 6. Chỉ số Bắc đẩu (North Star Metric)

> ⓪ Đề xuất, cần Owner xác nhận lần cuối.

| | Giá trị |
|---|---------|
| **Tên chỉ số** | Số học viên Active Hằng tháng được vận hành liền mạch qua Rinov5 (Đăng ký → Học → Tái phí) |
| **Đơn vị** | HV / tháng |
| **Mục tiêu năm** | ⓪ [Cần Owner đặt — ví dụ: 5.000 HV] |
| **Hiện tại** | ⓪ Baseline — chưa đo |
| **Tần suất đo** | Hằng ngày |

---

## 7. Mục tiêu Quý/Năm (OKR)

### `OKR-01` Hợp nhất dữ liệu khách hàng xuyên hệ thống

| Loại | Nội dung |
|------|----------|
| **Objective** | Mọi học viên/phụ huynh chỉ tồn tại dưới một bản ghi duy nhất trong toàn chuỗi. |
| **Key Result 1** | Tỷ lệ trùng hồ sơ Person ≤ 1% (đo bằng MDM merge tool). |
| **Key Result 2** | 100% màn hình hiển thị HV đều dùng `person_id` chung. |
| **Key Result 3** | ⓪ [Cần Owner đặt mốc thời gian] |
| **Hạn** | ⓪ [Q? năm ?] |
| **BR liên quan** | (sẽ tạo `BR-002` cho hợp nhất domain) |

### `OKR-02` Tăng giữ chân học viên

| Loại | Nội dung |
|------|----------|
| **Objective** | Học viên được phát hiện rủi ro sớm và can thiệp kịp thời để giảm tỷ lệ ngừng học. |
| **Key Result 1** | ⓪ Tỷ lệ tái phí (renewal rate) đạt mức `[X]%` (Owner đặt mục tiêu). |
| **Key Result 2** | ⓪ Tỷ lệ học viên at-risk được CSM tiếp xúc trong 48h ≥ 80%. |
| **Key Result 3** | ⓪ Số HV "im lặng" (vắng ≥ 3 buổi không liên hệ) giảm 50% so với baseline. |
| **Hạn** | ⓪ [Q? năm ?] |
| **BR liên quan** | `BR-001` (file kế tiếp) |

---

## 8. Chỉ số Vận hành (KPI)

⓪ Tham khảo — cần Owner / CFO chốt:

| Mã KPI | Tên KPI | Đơn vị | Mục tiêu | Tần suất | Người chịu trách nhiệm |
|--------|---------|--------|----------|----------|-------------------------|
| `KPI-001` | Renewal Rate | % | ⓪ ≥ 70% | Tháng | OWNER + BM |
| `KPI-002` | Tỷ lệ ticket CSM xử lý trong SLA | % | ⓪ ≥ 90% | Tuần | BM |
| `KPI-003` | Số HV at-risk phát hiện đúng | đếm | ⓪ ≥ 95% precision | Tuần | CSM |

---

## 9. Tham chiếu Tài liệu Liên quan

- `STAKEHOLDERS.md` — Bản đồ Stakeholder.
- `PERSONAS/*.md` — 5 Persona.
- `BR/BR-001-*.md` — Yêu cầu kinh doanh đầu tiên (retention).
- `ECOSYSTEM_OVERVIEW.md` — Định vị Rinov5 trong RinoEdu.
- `ENTERPRISE_STANDARDS.md` — Tier 1 policy.
