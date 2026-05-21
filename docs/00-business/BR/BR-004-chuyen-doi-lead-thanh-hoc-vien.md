---
id: BR-004
title: "Chuyển đổi Lead thành Học viên nhanh chóng và không mất dữ liệu"
type: "Business Requirement"
domain: "Business"
status: "Draft-NeedsValidation"
priority: "High"
tags: [br, admissions, lead, conversion, enrollment]
---

# BR-004: Chuyển đổi Lead thành Học viên nhanh chóng và không mất dữ liệu

> **Vị trí:** Tier 0 — phát sinh từ Pain Point của Sale + BM.
> **Tham chiếu:** `VISION.md`, `FLOW-ENR-00-vong-doi-tuyen-sinh.md`.

---

## 1. Phát biểu Yêu cầu (Requirement Statement)

> *"Tổ chức cần một luồng liền mạch từ lúc phụ huynh liên hệ lần đầu đến khi học viên ngồi vào lớp học đầu tiên, sao cho mọi thông tin (kết quả test, nhận xét học thử, sản phẩm đã chọn) được truyền tải tự động giữa các bước mà không cần nhập lại, để giảm thời gian chuyển đổi và không mất khách giữa chừng."*

---

## 2. Bối cảnh & Lý do (Context & Rationale)

### 2.1. Hiện trạng (As-Is)

- Sale chốt đơn xong, phải tự nhắn BM "có HV mới cần xếp lớp" — không có workflow tự động.
- Kết quả test đầu vào nằm ở hệ thống Booking Test, khi xếp lớp BM phải mở tab khác tìm.
- Phụ huynh phải khai lại thông tin 2-3 lần (lúc đăng ký test, lúc mua gói, lúc xếp lớp).
- Thời gian từ "chốt đơn" → "HV vào lớp" trung bình ⓪ [X ngày] — quá lâu, phụ huynh mất kiên nhẫn.

### 2.2. Mong muốn (To-Be)

- Luồng Lead → Test → Học thử → Chốt đơn → Xếp lớp là 1 pipeline liên tục trong hệ thống.
- Khi Sale chốt đơn, HV tự động vào danh sách chờ xếp lớp với SLA cảnh báo.
- Kết quả test + nhận xét học thử tự động hiển thị khi BM xếp lớp (không phải tìm).
- Phụ huynh chỉ khai thông tin 1 lần (Golden Record `BR-003`).

---

## 3. Mục tiêu Kinh doanh Liên quan (OKR/KPI Mapping)

| Mã | Loại | Tên | Đóng góp của BR này |
|----|------|-----|----------------------|
| `OKR-02` | Mục tiêu | Tăng giữ chân HV | Giảm drop-off giữa chốt đơn và vào lớp |
| `KPI-008` | Chỉ số (đề xuất) | Thời gian trung bình Lead → Enrolled | Giảm ⓪ X% |
| `KPI-009` | Chỉ số (đề xuất) | Tỷ lệ Lead drop-off sau chốt đơn | ⓪ ≤ 5% |

---

## 4. Stakeholder Liên quan (RACI)

| Vai trò | R | A | C | I |
|---------|---|---|---|---|
| `PERSONA-SALE` | ✅ | | | |
| `PERSONA-BRANCH_MANAGER` | ✅ | | | |
| `PERSONA-OWNER` | | ✅ | | |
| `PERSONA-CSM` | | | | ✅ |
| `PERSONA-TEACHER` | | | ✅ | |

---

## 5. Tiêu chí Thành công Kinh doanh (Business Success Criteria)

| # | Tiêu chí | Cách đo | Mức đạt | Hạn |
|---|----------|---------|---------|-----|
| BR-AC-01 | Khi Sale chốt đơn, HV tự động xuất hiện trong danh sách chờ xếp lớp | Test | 100% tự động | ⓪ Q? |
| BR-AC-02 | Kết quả test + nhận xét học thử hiển thị trong màn hình xếp lớp | Test | Có, không cần mở tab khác | ⓪ Q? |
| BR-AC-03 | Thời gian Lead → Enrolled giảm so với baseline | Đo log | ⓪ Giảm X% | ⓪ Q? |
| BR-AC-04 | Phụ huynh không phải khai lại thông tin đã cung cấp | Kiểm tra UX | 0 lần nhập lại | ⓪ Q? |

---

## 6. Ràng buộc & Giả định

### 6.1. Ràng buộc
- **Phụ thuộc:** `BR-003` (Golden Record) phải hoạt động trước — nếu không, dữ liệu vẫn bị phân mảnh.
- **Bảo mật:** Tuân thủ `[POLICY-ORG-01]` — Sale chỉ thấy lead của mình.
- **Kỹ thuật:** Luồng xuyên 3 CAP (ADM → COM → OPS) cần event-driven hoặc state machine.

### 6.2. Giả định
- ⓪ Sale sẵn sàng dùng hệ thống mới thay vì nhắn tin BM.
- ⓪ BM chấp nhận SLA xếp lớp (VD: ≤ 3 ngày sau chốt đơn).

---

## 7. Stakeholder Requirements Phái sinh (SR Children)

| Mã SR | Persona | Tiêu đề | Trạng thái |
|-------|---------|---------|-----------|
| `SR-SALE-002` | Sale | Workflow tư vấn 1 luồng (đã đề xuất trong Persona) | ⏳ Cần tạo |
| `SR-SALE-003` | Sale | Theo dõi trạng thái xếp lớp HV của tôi | ⏳ Cần tạo |
| `SR-BRANCH_MANAGER-003` | BM | Cảnh báo SLA xếp lớp (đã đề xuất trong Persona) | ⏳ Cần tạo |

---

## 8. Năng lực Hệ thống Đáp ứng (CAP Mapping)

| CAP | Vai trò | Mức độ Đáp ứng |
|-----|---------|------------------|
| `CAP-ADM` | Chính — Lead, Booking Test, Học thử | Đầy đủ (`BF-ENR-01`, `BF-ENR-02`, `BF-CRM-01/02`) |
| `CAP-COM` | Chính — Đơn hàng | Đầy đủ (`BF-SAL-01`) |
| `CAP-OPS` | Chính — Xếp lớp | Đầy đủ (`BF-CLS-01`) |
| `CAP-MDM` | Phụ — Golden Record | Phụ thuộc `BR-003` |

---

## 9. Tuân thủ Đạo luật

- `[POLICY-MDM-01]` Golden Record — dữ liệu không nhập lại.
- `[POLICY-ORG-01]` Data Scope — Sale chỉ thấy lead/đơn của mình.
- `[POLICY-IAM-03]` RBAC+ABAC — phân quyền theo giai đoạn pipeline.

---

## 10. Lịch sử Phê duyệt

| Phiên bản | Ngày | Người | Trạng thái |
|-----------|------|-------|-----------|
| v0.1 | 2026-05-19 | (AI Agent) | Draft |
| v1.0 | ⓪ TBD | OWNER + Sale Lead | Approved |

---

## 11. Chỉ dẫn cho AI Agent & Lập trình viên

- BR-004 xuyên 3 CAP (ADM → COM → OPS) — đây là luồng `FLOW-ENR-00` đã thiết kế.
- Ưu tiên: nối `BF-ENR-01` (test) → `BF-SAL-01` (đơn) → `BF-CLS-01` (xếp lớp) thành pipeline.
- SLA xếp lớp cần cảnh báo tự động (liên kết `SR-BRANCH_MANAGER-003`).

### ⛔ Hàng rào An toàn
- **KHÔNG** tạo CAP riêng cho "Enrollment Pipeline" — đó là FLOW xuyên 3 CAP hiện có.
- **KHÔNG** bỏ qua bước test/học thử — đây là quy tắc nghiệp vụ bắt buộc của `CAP-ADM`.
