---
id: SR-CSM-002
title: "Pipeline tái phí với template tin nhắn theo loại học viên"
type: "Stakeholder Requirement"
domain: "Business"
persona: "PERSONA-CSM"
parent_br: "BR-001"
status: "Draft"
priority: "High"
tags: [sr, csm, care, renewal]
---

# SR-CSM-002: Pipeline tái phí với template tin nhắn theo loại học viên

> **Persona:** `PERSONA-CSM`
> **BR cha:** `BR-001`
> **Tham chiếu:** `PERSONAS/PERSONA-CSM.md` JTBD #4 + Pain Point #5; `BF-CARE-02`.

---

## 1. Phát biểu Yêu cầu (Requirement Statement)

> **Là** CSM,
> **tôi cần** một pipeline rõ ràng cho học viên sắp hết hạn, kèm template tin nhắn / email gắn sẵn theo từng loại HV (mới học < 3 tháng / đang học ổn / đã từng nghỉ),
> **để** không phải gõ tay nội dung từng người và đẩy nhanh tốc độ chiến dịch tái phí.

---

## 2. Bối cảnh Sử dụng (Usage Context)

| Trường | Giá trị |
|--------|---------|
| **Khi nào cần?** | Buổi chiều hằng ngày (15:00 – 16:30), khi CSM đẩy chiến dịch tái phí |
| **Tần suất** | 5–10 HV / CSM / ngày |
| **Thiết bị** | Web (laptop) |
| **Mức độ khẩn** | Trong tuần (HV còn 5–10 buổi mới hết hạn) |
| **Liên kết JTBD** | `PERSONA-CSM` mục 7 — JTBD #4 |

---

## 3. Pain Point Đang Giải quyết

| Pain Point Persona | Mức độ Giải quyết |
|--------------------|---------------------|
| `PERSONA-CSM` Pain Point #5: ⓪ "Khi đẩy chiến dịch tái phí, không có template tin nhắn / email" | Đầy đủ |

---

## 4. Tiêu chí Chấp nhận (Acceptance Criteria)

| # | Tiêu chí | Cách đo | Kết quả mong đợi |
|---|----------|---------|-------------------|
| SR-AC-01 | Pipeline có 4 trạng thái khớp `BF-CARE-02`: Sắp hết hạn → Đang tư vấn → Thành công / Thất bại | Kiểm tra board | 4 lane |
| SR-AC-02 | Mỗi card HV trong pipeline hiển thị: số buổi còn, lịch sử liên hệ cuối, gói gợi ý tiếp theo | Mở 1 card | Có đủ 3 thông tin |
| SR-AC-03 | Hệ thống có ít nhất 3 template tin nhắn theo loại HV (mới / ổn / nghỉ trước đây) | Đếm template | ≥ 3 |
| SR-AC-04 | Click "Gửi" mở dialog preview template với tên HV, gói, ngày hết hạn được tự điền | Test | Đúng dữ liệu |
| SR-AC-05 | Khi HV đóng tiền (`CAP-COM`), card tự chuyển sang "Thành công" | Test | Tự động `[RULE-CARE-02-01]` |
| SR-AC-06 | Khi đánh dấu "Thất bại" bắt buộc chọn lý do từ chối | Test | Bắt buộc |

---

## 5. Ràng buộc Phi chức năng (Non-functional Constraints)

| Khía cạnh | Yêu cầu |
|-----------|---------|
| **Hiệu năng** | Pipeline tải ≤ 2 giây |
| **Bảo mật** | CSM chỉ thấy HV phân công, không gửi mass-message ra ngoài scope |
| **Tuân thủ** | Mọi thay đổi trạng thái card ghi log theo `BF-CARE-02` |
| **A11y** | Drag-drop có keyboard alternative |

---

## 6. Mức độ Ưu tiên (Priority — MoSCoW)

| Mức | Đánh dấu | Lý do |
|-----|----------|-------|
| **M**ust have | ✓ | Trực tiếp ảnh hưởng `KPI-001 Renewal Rate` |
| **S**hould have | — | |
| **C**ould have | — | Template gợi ý theo AI/LLM (giai đoạn 2) |
| **W**on't have (this release) | — | Mass-send tự động (vi phạm guardrail) |

---

## 7. User Stories Phái sinh (US Children)

| Mã US | Tiêu đề | Loại | Trạng thái |
|-------|---------|------|------------|
| `US-CARE-02-01` | Quản lý Phễu Tái phí (đã có trong CATALOG) | List | Đang soạn thảo |
| `US-CARE-02-02` | Chi tiết & Ghi nhận Tư vấn Tái phí | Detail/Form | Đang soạn thảo |
| (đề xuất mới) `US-CARE-02-03` | Quản lý Template Tin nhắn Tái phí | Form | ⓪ Cần tạo |

---

## 8. Quan hệ Trace (Traceability)

| Tầng | Mã | Liên kết |
|------|----|----|
| **Persona** | `PERSONA-CSM` | |
| **BR** | `BR-001` | |
| **CAP** | `CAP-CARE` | |
| **BF** | `BF-CARE-02` | Đã chuẩn vàng |
| **US** | `US-CARE-02-01`, `US-CARE-02-02`, `US-CARE-02-03` (đề xuất) | |
| **Screen** | `renewal`, `expiring_soon_care` (sẽ gộp / liên kết) | |

---

## 9. Phụ thuộc & Xung đột

### 9.1. Phụ thuộc
- `CAP-COM` `BF-SAL-01`: Đơn hàng — để tự đóng card "Thành công".
- `BF-PRD-01`: Bộ sản phẩm/combo — để gợi ý gói tiếp theo.

### 9.2. Xung đột
- ⚠️ Hiện có 2 menu `renewal` + `expiring_soon_care` đang trùng chức năng. SR-CSM-002 đề xuất 1 màn hình duy nhất với 2 view (sắp hết hạn / pipeline).

### 9.3. Liên quan
- `SR-CSM-001`: Inbox Hôm nay (sắp hết hạn là 1 nhóm trong inbox).

---

## 10. Lịch sử Phê duyệt

| Phiên bản | Ngày | Người phê duyệt | Trạng thái |
|-----------|------|------------------|-----------|
| v0.1 | 2026-05-19 | (AI Agent) | Draft |
| v1.0 | ⓪ TBD | CSM + BM | Approved |
