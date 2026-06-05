---
id: SR-CSM-001
title: "Inbox Hôm nay gộp các việc cần làm trong ngày của CSM"
type: "Stakeholder Requirement"
domain: "Business"
persona: "PERSONA-CSM"
parent_br: "BR-001"
status: "Draft"
priority: "High"
tags: [sr, csm, care, inbox]
---

# SR-CSM-001: Inbox "Hôm nay" gộp các việc cần làm trong ngày của CSM

> **Persona:** `PERSONA-CSM` (Chăm sóc Học viên)
> **BR cha:** `BR-001` (Tăng tỷ lệ tái phí qua phát hiện sớm và can thiệp kịp thời)
> **Tham chiếu:** `PERSONAS/PERSONA-CSM.md` JTBD #1 + Pain Point #1.

---

## 1. Phát biểu Yêu cầu (Requirement Statement)

> **Là** CSM,
> **tôi cần** một màn hình duy nhất gộp tất cả "việc cần làm hôm nay" (HV at-risk, HV sắp hết hạn, HV vắng 3 buổi liên tiếp, ticket SLA gần hết, HV mới cần welcome call),
> **để** không phải mở 4–5 màn hình tự nhặt việc mỗi sáng và không bỏ sót HV nào.

---

## 2. Bối cảnh Sử dụng (Usage Context)

| Trường | Giá trị |
|--------|---------|
| **Khi nào cần?** | Đầu mỗi ca làm (08:00 – 09:00) + giữa ngày để cập nhật |
| **Tần suất** | Mở 5–10 lần/ngày |
| **Thiết bị** | Web (laptop văn phòng) là chính |
| **Mức độ khẩn** | Trong ngày (real-time priority sort) |
| **Liên kết JTBD** | `PERSONA-CSM` mục 7 — JTBD #1 |

---

## 3. Pain Point Đang Giải quyết

| Pain Point Persona | Mức độ Giải quyết |
|--------------------|---------------------|
| `PERSONA-CSM` mục 3, item #1: "Số lượng HV phân công quá nhiều — không biết bắt đầu từ đâu mỗi sáng" | Đầy đủ |
| `PERSONA-CSM` mục 3, item #4: ⓪ "Phải tổng hợp ticket đã đóng cuối tuần" | Một phần (cần báo cáo riêng) |

---

## 4. Tiêu chí Chấp nhận (Acceptance Criteria)

| # | Tiêu chí | Cách đo | Kết quả mong đợi |
|---|----------|---------|-------------------|
| SR-AC-01 | Inbox gộp đủ 5 nhóm: at-risk, sắp hết hạn, vắng 3 buổi, ticket SLA, HV mới | Đếm các nhóm | 5/5 |
| SR-AC-02 | Mỗi item hiển thị: tên HV, lý do, deadline, action đề xuất | Kiểm tra từng dòng | Có đủ 4 trường |
| SR-AC-03 | CSM chỉ thấy HV trong scope phân công (`[POLICY-ORG-01]`) | Test với CSM khác cơ sở | 0 leak HV ngoài scope |
| SR-AC-04 | Inbox sort theo priority (deadline gần nhất / lý do nguy cơ cao nhất) | Kiểm tra thứ tự | Đúng thứ tự |
| SR-AC-05 | Click 1 item mở chi tiết HV + ghi chú nhanh kết quả | Đo số click | ≤ 2 click từ inbox tới ghi chú |
| SR-AC-06 | Mở Inbox khi có 200 item < 2 giây | Performance test | Hiển thị < 2s với 200 items |

---

## 5. Ràng buộc Phi chức năng (Non-functional Constraints)

| Khía cạnh | Yêu cầu |
|-----------|---------|
| **Hiệu năng** | Hiển thị inbox ≤ 2 giây với 200 items |
| **Bảo mật** | Tuân thủ `[POLICY-ORG-01]` Data Scope: CSM chỉ thấy HV phân công + cơ sở |
| **Khả dụng** | Truy cập 24/7 trong giờ hành chính cơ sở |
| **A11y** | Tuân thủ `DESIGN_SYSTEM.md` §9 (touch target, contrast, keyboard nav) |
| **Đa ngôn ngữ** | Tiếng Việt mặc định |

---

## 6. Mức độ Ưu tiên (Priority — MoSCoW)

| Mức | Đánh dấu | Lý do |
|-----|----------|-------|
| **M**ust have | ✓ | Là cốt lõi để CSM làm việc hiệu quả mỗi ngày |
| **S**hould have | — | |
| **C**ould have | — | |
| **W**on't have (this release) | — | |

---

## 7. User Stories Phái sinh (US Children)

> SR này được hiện thực hóa qua các US dưới đây. Đa số US đã có trong `BF-CARE-01` nhưng cần gộp lại thành 1 view duy nhất.

| Mã US | Tiêu đề | Loại | Trạng thái |
|-------|---------|------|------------|
| `US-CARE-01-01` | Quản lý danh sách Phiếu chăm sóc (gộp Inbox Hôm nay) | List | Đang soạn thảo |
| (đề xuất mới) `US-CARE-INBOX-01` | View "Hôm nay" gộp 5 nhóm | List composite | ⓪ Cần tạo |

> **Lưu ý:** Hiện navigation có 5 menu rời (`today_care`, `at_risk_care`, `expiring_soon_care`, `overdue_care`, `new_student_care`) — đây là **5 filter của cùng 1 dataset**, vi phạm Capability–Persona Decoupling. SR-CSM-001 yêu cầu hợp nhất thành 1 view với 5 tab/filter.

---

## 8. Quan hệ Trace (Traceability)

| Tầng | Mã | Liên kết |
|------|----|----|
| **Persona** | `PERSONA-CSM` | Người yêu cầu |
| **BR** (Tier 0) | `BR-001` | Yêu cầu kinh doanh cha |
| **CAP** (Tier 2) | `CAP-CARE` | Năng lực hệ thống đáp ứng |
| **BF** (Tier 3) | `BF-CARE-01` | Nghiệp vụ cụ thể |
| **US** (Tier 4) | `US-CARE-01-01`, `US-CARE-INBOX-01` (đề xuất) | Câu chuyện người dùng |
| **Screen** | `today_care` (sẽ gộp các filter) | Mã màn hình |

---

## 9. Phụ thuộc & Xung đột (Dependencies & Conflicts)

### 9.1. Phụ thuộc (Depends on)
- `BF-CLS-05` Điểm danh & Nhận xét: cấp tín hiệu vắng N buổi.
- `BF-CARE-02` Tái phí: cấp danh sách sắp hết hạn.
- `care_rule_engine`: chứa quy tắc đánh dấu at-risk.

### 9.2. Xung đột (Conflicts with)
- ⚠️ Hiện trạng navigation có 5 mục riêng cho 5 filter — SR-CSM-001 đề xuất gộp 1 màn hình. Cần dàn xếp với owner navigation.

### 9.3. Liên quan (Related)
- `SR-CSM-002`: Pipeline tái phí (sub-flow của Inbox).
- `SR-BRANCH_MANAGER-001`: Dashboard at-risk cấp BM (drill-up của SR này).

---

## 10. Lịch sử Phê duyệt (Approval Log)

| Phiên bản | Ngày | Người phê duyệt | Trạng thái | Ghi chú |
|-----------|------|------------------|-----------|---------|
| v0.1 | 2026-05-19 | (AI Agent) | Draft | Tạo từ JTBD #1 của PERSONA-CSM |
| v1.0 | ⓪ TBD | CSM thật + BM | Approved | Cần phỏng vấn CSM |
