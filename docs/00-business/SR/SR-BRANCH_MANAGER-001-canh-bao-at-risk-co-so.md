---
id: SR-BRANCH_MANAGER-001
title: "Cảnh báo at-risk theo cơ sở cho Branch Manager"
type: "Stakeholder Requirement"
domain: "Business"
persona: "PERSONA-BRANCH_MANAGER"
parent_br: "BR-001"
status: "Draft"
priority: "High"
tags: [sr, branch-manager, care, dashboard]
---

# SR-BRANCH_MANAGER-001: Cảnh báo at-risk theo cơ sở

> **Persona:** `PERSONA-BRANCH_MANAGER`
> **BR cha:** `BR-001`
> **Tham chiếu:** `PERSONAS/PERSONA-BRANCH-MANAGER.md` Pain Point #3 + JTBD #4.

---

## 1. Phát biểu Yêu cầu (Requirement Statement)

> **Là** Branch Manager,
> **tôi cần** một widget trên Dashboard cơ sở thể hiện số lượng HV at-risk + sắp hết hạn + ticket SLA gần hết, có khả năng drill-down xuống danh sách CSM phụ trách,
> **để** can thiệp kịp thời khi CSM của tôi quá tải hoặc bỏ sót HV, và báo cáo Owner đúng số liệu chuỗi.

---

## 2. Bối cảnh Sử dụng (Usage Context)

| Trường | Giá trị |
|--------|---------|
| **Khi nào cần?** | Đầu ngày + cuối ngày (quick check); họp tuần với CSM (deep dive) |
| **Tần suất** | Mở 5–10 lần/ngày |
| **Thiết bị** | Web (laptop) |
| **Mức độ khẩn** | Trong ngày |
| **Liên kết JTBD** | `PERSONA-BRANCH_MANAGER` mục 7 — JTBD #4 (filter lịch tổng cơ sở) + cảm hứng từ JTBD #5 (báo cáo cuối ngày) |

---

## 3. Pain Point Đang Giải quyết

| Pain Point Persona | Mức độ Giải quyết |
|--------------------|---------------------|
| `PERSONA-BRANCH_MANAGER` Pain Point #3: "Phụ huynh complaint qua điện thoại nhưng CSM không log → BM không có lịch sử" | Một phần (cần ghép với enforcement log đầy đủ) |
| `PERSONA-BRANCH_MANAGER` Pain Point #4: ⓪ "Báo cáo cuối tháng tổng hợp tay" | Đầy đủ cho phần care |

---

## 4. Tiêu chí Chấp nhận (Acceptance Criteria)

| # | Tiêu chí | Cách đo | Kết quả mong đợi |
|---|----------|---------|-------------------|
| SR-AC-01 | Widget hiển thị 4 chỉ số: HV at-risk / Sắp hết hạn / Ticket SLA gần hết / Renewal rate tháng | Đếm tile | 4/4 |
| SR-AC-02 | Click số → drill-down danh sách HV với cột CSM phụ trách | Test | Đúng danh sách |
| SR-AC-03 | BM chỉ thấy HV thuộc cơ sở của mình (`[POLICY-ORG-01]`) | Test ABAC | 0 leak |
| SR-AC-04 | Số liệu cập nhật real-time hoặc tối đa 5 phút trễ | Test | ≤ 5 phút |
| SR-AC-05 | Có button "Export Excel" cho báo cáo họp tuần | Test | Excel có cùng số liệu |
| SR-AC-06 | Mở Dashboard < 2 giây | Performance | ≤ 2s |

---

## 5. Ràng buộc Phi chức năng

| Khía cạnh | Yêu cầu |
|-----------|---------|
| **Hiệu năng** | Dashboard tải ≤ 2 giây với 1000 HV trong cơ sở |
| **Bảo mật** | Tuân thủ `[POLICY-ORG-01]` Data Scope |
| **Khả dụng** | Truy cập 24/7 trong giờ làm |
| **A11y** | Tile có aria-label, drill-down có keyboard nav |

---

## 6. Mức độ Ưu tiên (Priority — MoSCoW)

| Mức | Đánh dấu | Lý do |
|-----|----------|-------|
| **M**ust have | ✓ | Là cách BM theo dõi BR-001 hằng ngày |
| **S**hould have | — | |
| **C**ould have | — | Tích hợp lịch sử trend 90 ngày |
| **W**on't have (this release) | — | So sánh giữa các cơ sở (đó là việc của Owner) |

---

## 7. User Stories Phái sinh (US Children)

| Mã US | Tiêu đề | Loại | Trạng thái |
|-------|---------|------|------------|
| (đề xuất mới) `US-RPT-CARE-BM-01` | Widget Care Dashboard cấp BM | Detail/Tile | ⓪ Cần tạo |
| (đề xuất mới) `US-RPT-CARE-BM-02` | Drill-down Care theo CSM | List | ⓪ Cần tạo |

> **Lưu ý:** Đây là 1 view của `CAP-RPT` với scope cơ sở — **KHÔNG** phải CAP riêng. Owner sẽ có view cùng UI với scope toàn chuỗi (đây là minh họa Capability–Persona Decoupling).

---

## 8. Quan hệ Trace

| Tầng | Mã |
|------|----|
| Persona | `PERSONA-BRANCH_MANAGER` |
| BR | `BR-001` |
| CAP chính | `CAP-RPT` (widget) |
| CAP nguồn dữ liệu | `CAP-CARE`, `CAP-OPS` |
| Screen | (đề xuất) `branch_dashboard` hoặc widget trên `dashboard` hiện có |

---

## 9. Phụ thuộc & Xung đột

### 9.1. Phụ thuộc
- `SR-CSM-001`: dữ liệu inbox CSM được aggregate.
- `BF-CARE-02`: dữ liệu phễu tái phí.
- `BF-CLS-05`: dữ liệu vắng mặt.

### 9.2. Xung đột
- ⚠️ Navigation hiện không có `branch_dashboard` riêng — cần quyết định: thêm 1 menu hay nhúng vào `dashboard`?

### 9.3. Liên quan
- `SR-CSM-001`, `SR-CSM-002`: nguồn dữ liệu cho widget này.

---

## 10. Lịch sử Phê duyệt

| Phiên bản | Ngày | Người | Trạng thái |
|-----------|------|-------|-----------|
| v0.1 | 2026-05-19 | (AI Agent) | Draft |
| v1.0 | ⓪ TBD | BM + Owner | Approved |
