---
id: BR-003
title: "Một học viên = Một bản ghi duy nhất xuyên toàn hệ sinh thái"
type: "Business Requirement"
domain: "Business"
status: "Draft-NeedsValidation"
priority: "High"
tags: [br, mdm, golden-record, deduplication]
---

# BR-003: Một học viên = Một bản ghi duy nhất xuyên toàn hệ sinh thái

> **Vị trí:** Tier 0 — phát sinh từ `OKR-01` (hợp nhất dữ liệu).
> **Tham chiếu:** `VISION.md` Problem #1, `ECOSYSTEM_OVERVIEW.md` mục 3.

---

## 1. Phát biểu Yêu cầu (Requirement Statement)

> *"Tổ chức cần đảm bảo mỗi học viên, phụ huynh, hoặc nhân sự chỉ tồn tại dưới một bản ghi duy nhất trong toàn bộ hệ thống, bất kể họ được tạo từ kênh nào (CRM, Booking Test, Đơn hàng, Nhân sự), để loại bỏ trùng lặp hồ sơ và có thể tính chính xác giá trị vòng đời khách hàng."*

---

## 2. Bối cảnh & Lý do (Context & Rationale)

### 2.1. Hiện trạng (As-Is)

- CRM cũ tạo 1 record "Lead" khi phụ huynh gọi đến.
- ERP cũ tạo 1 record "Student" khi đóng tiền.
- CARE cũ tạo 1 record "Contact" khi CSM gọi chăm sóc.
- → Cùng 1 phụ huynh có 3 bản ghi ở 3 hệ thống, không liên kết.
- Hệ quả: Sale gọi lại phụ huynh đã mua, CSM không biết lịch sử tư vấn, Owner không tính được lifetime value.

### 2.2. Mong muốn (To-Be)

- Mọi phân hệ (ADM, COM, OPS, CARE, HR) đều trỏ về cùng 1 `person_id`.
- Khi tạo mới, hệ thống tự kiểm tra trùng (SĐT, Email, CCCD) và gợi ý merge.
- Khi phát hiện trùng sau sự kiện, có workflow gộp bản ghi (merge duplicates).
- Báo cáo doanh thu / retention tính trên 1 khách hàng thật, không bị phồng số.

---

## 3. Mục tiêu Kinh doanh Liên quan (OKR/KPI Mapping)

| Mã | Loại | Tên | Đóng góp của BR này |
|----|------|-----|----------------------|
| `OKR-01` | Mục tiêu | Hợp nhất dữ liệu khách hàng | BR-003 là yêu cầu cốt lõi |
| `KPI-006` | Chỉ số (đề xuất) | Tỷ lệ trùng hồ sơ Person | ≤ 1% |
| `KPI-007` | Chỉ số (đề xuất) | Số Person có ≥ 2 bản ghi nghi trùng | Giảm về 0 |

---

## 4. Stakeholder Liên quan (RACI)

| Vai trò | R | A | C | I |
|---------|---|---|---|---|
| `PERSONA-OWNER` | | ✅ | | |
| `PERSONA-BRANCH_MANAGER` | | | ✅ | |
| `PERSONA-SALE` | ✅ | | | |
| `PERSONA-CSM` | ✅ | | | |
| `PERSONA-TEACHER` | | | | ✅ |

---

## 5. Tiêu chí Thành công Kinh doanh (Business Success Criteria)

| # | Tiêu chí | Cách đo | Mức đạt | Hạn |
|---|----------|---------|---------|-----|
| BR-AC-01 | Mọi màn hình tạo Person đều kiểm tra trùng trước khi lưu | Test | 100% | ⓪ Q? |
| BR-AC-02 | Tỷ lệ trùng hồ sơ Person trong hệ thống | Audit định kỳ | ≤ 1% | ⓪ Q? |
| BR-AC-03 | Có workflow merge duplicates hoạt động | Có / Không | Có | ⓪ Q? |
| BR-AC-04 | Mọi phân hệ (ADM, COM, OPS, CARE) đều dùng `person_id` chung | Code review | 100% | ⓪ Q? |

---

## 6. Ràng buộc & Giả định

### 6.1. Ràng buộc
- **Pháp lý:** Tuân thủ `[POLICY-MDM-01]` Golden Record — bắt buộc.
- **Pháp lý:** Tuân thủ `[POLICY-MDM-02]` Identity vs Contact split.
- **Kỹ thuật:** Merge phải giữ lịch sử (soft-merge, không xóa cứng).

### 6.2. Giả định
- ⓪ Dữ liệu cũ từ CRM/ERP/CARE sẽ được migrate và deduplicate 1 lần (batch).
- ⓪ Tiêu chí trùng: cùng SĐT HOẶC cùng Email HOẶC cùng CCCD.

---

## 7. Stakeholder Requirements Phái sinh (SR Children)

| Mã SR | Persona | Tiêu đề | Trạng thái |
|-------|---------|---------|-----------|
| `SR-SALE-004` | Sale | Tìm kiếm Person nhanh khi tạo lead (chống trùng) | ⏳ Cần tạo |
| `SR-OWNER-005` | Owner | Báo cáo doanh thu trên 1 khách hàng thật (không phồng) | ⏳ Cần tạo |

---

## 8. Năng lực Hệ thống Đáp ứng (CAP Mapping)

| CAP | Vai trò | Mức độ Đáp ứng |
|-----|---------|------------------|
| `CAP-MDM` | Chính — Golden Record, merge, dedup | Đầy đủ (`BF-MDM-01` đã chuẩn hóa) |
| `CAP-ADM` | Phụ — tạo Person khi có lead mới | Cần enforce dedup check |
| `CAP-COM` | Phụ — tạo Person khi có đơn hàng mới | Cần enforce dedup check |

---

## 9. Tuân thủ Đạo luật

- `[POLICY-MDM-01]` Golden Record — đây chính là BR hiện thực hóa policy này.
- `[POLICY-MDM-02]` Identity vs Contact split.
- `[POLICY-MDM-03]` 3-Tier Entity Separation.
- `[POLICY-MDM-04]` Party Data Model.

---

## 10. Lịch sử Phê duyệt

| Phiên bản | Ngày | Người | Trạng thái |
|-----------|------|-------|-----------|
| v0.1 | 2026-05-19 | (AI Agent) | Draft |
| v1.0 | ⓪ TBD | OWNER | Approved |
