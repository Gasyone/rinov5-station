---
id: BR-001
title: "Tăng tỷ lệ tái phí học viên qua phát hiện sớm và can thiệp kịp thời"
type: "Business Requirement"
domain: "Business"
status: "Draft-NeedsValidation"
priority: "High"
tags: [br, retention, care, renewal]
---

# BR-001: Tăng tỷ lệ tái phí học viên qua phát hiện sớm và can thiệp kịp thời

> **Vị trí:** Tier 0 — phát sinh từ `OKR-02` của `VISION.md`.
> **Là cha của:** `SR-CSM-001`, `SR-CSM-002`, `SR-BRANCH_MANAGER-001`.
> **Tham chiếu:** `VISION.md`, `STAKEHOLDERS.md`, `ECOSYSTEM_OVERVIEW.md` mục 3.

---

## 1. Phát biểu Yêu cầu (Requirement Statement)

> *"Tổ chức cần phát hiện sớm các học viên có dấu hiệu nghỉ học và đưa thông tin đó tới đúng người chăm sóc trong vòng 48 giờ, để tăng tỷ lệ tái phí và giảm tỷ lệ rời bỏ trước khi quá muộn để can thiệp."*

> **Lưu ý:** BR mô tả VẤN ĐỀ và KẾT QUẢ MONG MUỐN, KHÔNG mô tả GIẢI PHÁP. Cách hệ thống làm điều đó được trình bày ở `CAP-CARE` / `BF-CARE-01` / `BF-CARE-02` (Tier 2-3).

---

## 2. Bối cảnh & Lý do (Context & Rationale)

### 2.1. Hiện trạng (As-Is)

- ⓪ Hệ thống CARE cũ chỉ ghi nhận ticket khi phụ huynh chủ động khiếu nại — phản ứng, không chủ động.
- ⓪ Học viên "im lặng" (vắng vài buổi liên tiếp, điểm thấp dần) thường không bị phát hiện cho đến khi không tái phí.
- CSM phải tự lập danh sách hằng ngày bằng Excel + cảm tính — không có tiêu chí thống nhất, dễ sót.
- Branch Manager không có cảnh báo định kỳ về số học viên rủi ro của cơ sở.
- Hệ quả: ⓪ Tỷ lệ tái phí thấp hơn benchmark ngành; doanh thu định kỳ bị bào mòn không rõ nguyên nhân.

### 2.2. Mong muốn (To-Be)

- Hệ thống tự động đánh dấu học viên "at-risk" theo bộ quy tắc (vắng N buổi, điểm giảm M%, không liên hệ K ngày).
- CSM mở app vào ca làm có ngay danh sách "Hôm nay" gộp tất cả việc cần xử lý — không phải tự nhặt.
- BM có dashboard cảnh báo tổng hợp at-risk + sắp hết hạn, drill-down xuống từng HV.
- Tỷ lệ học viên at-risk được CSM tiếp xúc trong 48h trở thành chỉ số đo được.
- Owner thấy `KPI-001 Renewal Rate` real-time thay vì chờ báo cáo cuối tháng.

---

## 3. Mục tiêu Kinh doanh Liên quan (OKR/KPI Mapping)

| Mã | Loại | Tên | Đóng góp của BR này |
|----|------|-----|----------------------|
| `OKR-02` | Mục tiêu | Tăng giữ chân học viên | BR-001 là yêu cầu cốt lõi để đạt OKR-02 |
| `KPI-001` | Chỉ số | Renewal Rate | BR-001 trực tiếp tăng KR1 của OKR-02 |
| `KPI-002` | Chỉ số | Ticket xử lý trong SLA | BR-001 đẩy ticket sớm hơn → SLA cải thiện |
| `KPI-003` | Chỉ số | At-risk detection precision | BR-001 yêu cầu phát hiện đúng |

---

## 4. Stakeholder Liên quan (RACI)

| Vai trò | R | A | C | I | Ghi chú |
|---------|---|---|---|---|---------|
| `PERSONA-OWNER` | | ✅ | | | Phê duyệt KPI Renewal Rate |
| `PERSONA-BRANCH_MANAGER` | ✅ | | | | Chịu trách nhiệm thực thi tại cơ sở |
| `PERSONA-CSM` | ✅ | | | | Người trực tiếp gọi HV at-risk |
| `PERSONA-TEACHER` | | | ✅ | | Cung cấp tín hiệu (điểm, vắng mặt) |
| `PERSONA-SALE` | | | | ✅ | Được thông báo khi HV cũ chuyển sang đơn mới |

---

## 5. Tiêu chí Thành công Kinh doanh (Business Success Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Mức đạt | Hạn |
|---|--------------------|-----------------------|---------|-----|
| BR-AC-01 | Hệ thống tự động phát hiện HV at-risk theo bộ quy tắc | Số HV được đánh dấu at-risk / tổng HV active | ⓪ ≥ 95% precision (kiểm chứng qua audit ngẫu nhiên) | ⓪ Q? |
| BR-AC-02 | Học viên at-risk được CSM tiếp xúc trong 48h | Thời gian từ "đánh dấu at-risk" → "ghi nhận liên hệ đầu tiên" | ⓪ ≥ 80% trong 48h | ⓪ Q? |
| BR-AC-03 | Tỷ lệ tái phí cải thiện so với baseline | Renewal Rate (`KPI-001`) | ⓪ +X% so với baseline | ⓪ Q? |
| BR-AC-04 | BM có dashboard cảnh báo at-risk theo cơ sở | Có / Không | Có | ⓪ Q? |

---

## 6. Ràng buộc & Giả định (Constraints & Assumptions)

### 6.1. Ràng buộc (Constraints)
- **Pháp lý / Tuân thủ:** Tuân thủ `[POLICY-MDM-01]` Golden Record — không nhân bản hồ sơ HV để chăm sóc.
- **Bảo mật:** Tuân thủ `[POLICY-IAM-03]` RBAC+ABAC + `[POLICY-ORG-01]` Data Scope — CSM chỉ thấy HV trong scope cơ sở.
- **Kỹ thuật:** Tín hiệu điểm danh, điểm số đến từ `CAP-OPS` — không được duplicate dữ liệu sang `CAP-CARE`.

### 6.2. Giả định (Assumptions)
- ⓪ Mức độ chấp nhận tự động hóa của CSM: chấp nhận hệ thống đẩy việc thay vì tự nhặt.
- ⓪ Bộ quy tắc at-risk có thể tinh chỉnh trong 1-2 tháng đầu (`care_rule_engine`).
- ⓪ Phụ huynh không phản đối khi CSM gọi sớm hơn (chứ không phải khi đã rời bỏ).

---

## 7. Stakeholder Requirements Phái sinh (SR Children)

| Mã SR | Persona | Tiêu đề | Trạng thái |
|-------|---------|---------|-----------|
| `SR-CSM-001` | `PERSONA-CSM` | Inbox "Hôm nay" gộp các việc cần làm | Draft |
| `SR-CSM-002` | `PERSONA-CSM` | Pipeline tái phí có template tin nhắn | Draft |
| `SR-BRANCH_MANAGER-001` | `PERSONA-BRANCH_MANAGER` | Cảnh báo at-risk theo cơ sở | Draft |

---

## 8. Năng lực Hệ thống Đáp ứng (CAP Mapping)

| CAP | Vai trò | Mức độ Đáp ứng |
|-----|---------|------------------|
| `CAP-CARE` | Chính | Đầy đủ — `BF-CARE-01` (ticket) + `BF-CARE-02` (renewal) đã chuẩn vàng |
| `CAP-OPS` | Phụ — cấp tín hiệu | Đầy đủ — điểm danh, điểm số đã có trong `BF-CLS-05` |
| `CAP-MDM` | Phụ — Person/Family | Đầy đủ — `BF-MDM-01` đã có |
| `CAP-RPT` | Phụ — báo cáo Owner | ⓪ Cần thêm widget Renewal Rate |
| `CAP-SYS` | Phụ — RBAC/ABAC | Đầy đủ — `BF-SYS-04` |

> Không cần CAP/BF mới. BR-001 được hiện thực hóa bởi các CAP/BF đã thiết kế sẵn — chỉ cần điều chỉnh ưu tiên triển khai và bổ sung quy tắc.

---

## 9. Tuân thủ Đạo luật (Policy Compliance)

- Tuân thủ `[POLICY-MDM-01]` Golden Record: 1 HV = 1 person_id.
- Tuân thủ `[POLICY-IAM-03]` RBAC+ABAC: CSM thấy HV trong scope.
- Tuân thủ `[POLICY-ORG-01]` Contextual Data Filtering: server-side filter.
- Tuân thủ `[POLICY-DS-03]` Documentation-Design Alignment: trạng thái at-risk đăng ký trong `statusColors.ts`.

---

## 10. Lịch sử Phê duyệt (Approval Log)

| Phiên bản | Ngày | Người phê duyệt | Trạng thái | Ghi chú |
|-----------|------|------------------|-----------|---------|
| v0.1 | 2026-05-19 | (AI Agent) | Draft | Tạo từ context dự án + 5 Persona |
| v1.0 | ⓪ TBD | OWNER | Approved | Cần Owner xác nhận |

---

## 11. Chỉ dẫn cho AI Agent & Lập trình viên

- BR-001 không yêu cầu CAP/BF mới — phải khai thác `CAP-CARE` đã có.
- Ưu tiên triển khai 2 màn hình `today_care` + `at_risk_care` + `renewal` (đã có trong navigation).
- Khi tăng `KPI-001` → trigger review BR-001 hằng quý.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** đặt giải pháp kỹ thuật vào BR (UI mockup, API endpoint).
- **KHÔNG** tạo CAP riêng cho "At-risk detection" — đó là 1 quy tắc trong `care_rule_engine` của `CAP-CARE`.
- **KHÔNG** chấp nhận BR-AC-01..04 mà không có dữ liệu baseline trước khi triển khai.
