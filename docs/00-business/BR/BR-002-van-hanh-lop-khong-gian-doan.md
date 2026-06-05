---
id: BR-002
title: "Vận hành lớp học không gián đoạn khi có biến động nhân sự và lịch"
type: "Business Requirement"
domain: "Business"
status: "Draft-NeedsValidation"
priority: "High"
tags: [br, operations, class, scheduling, teacher]
---

# BR-002: Vận hành lớp học không gián đoạn khi có biến động nhân sự và lịch

> **Vị trí:** Tier 0 — phát sinh từ `OKR-02` (giữ chân HV) + Pain Point của BM và Teacher.
> **Tham chiếu:** `VISION.md`, `STAKEHOLDERS.md`.

---

## 1. Phát biểu Yêu cầu (Requirement Statement)

> *"Tổ chức cần đảm bảo mọi buổi học diễn ra đúng lịch ngay cả khi giáo viên nghỉ đột xuất, phòng học bị bận, hoặc lịch xung đột — bằng cách phát hiện xung đột tự động và cung cấp phương án thay thế trong vòng 10 phút."*

---

## 2. Bối cảnh & Lý do (Context & Rationale)

### 2.1. Hiện trạng (As-Is)

- Khi GV báo nghỉ, BM phải tự gọi điện từng GV khác hỏi ai rảnh — mất 30-60 phút.
- Không có hệ thống phát hiện xung đột lịch tự động — đôi khi 2 lớp bị xếp cùng phòng.
- Học viên bị hủy buổi đột xuất → phụ huynh complaint → ảnh hưởng retention (liên kết `BR-001`).
- Khi cần học bù, BM phải tìm slot trống thủ công trên bảng Excel.

### 2.2. Mong muốn (To-Be)

- Hệ thống tự phát hiện xung đột GV/Phòng/HV khi xếp lịch hoặc khi có biến động.
- Khi GV báo nghỉ, hệ thống gợi ý ngay danh sách GV thay thế (cùng môn, cùng cấp, có slot rảnh).
- BM xử lý dạy thay / đổi phòng / dịch lịch trong ≤ 10 phút thay vì 30-60 phút.
- Tỷ lệ buổi học bị hủy do lỗi vận hành giảm xuống gần 0.

---

## 3. Mục tiêu Kinh doanh Liên quan (OKR/KPI Mapping)

| Mã | Loại | Tên | Đóng góp của BR này |
|----|------|-----|----------------------|
| `OKR-02` | Mục tiêu | Tăng giữ chân học viên | Giảm complaint do hủy buổi → tăng retention |
| `KPI-004` | Chỉ số (đề xuất) | Tỷ lệ buổi học diễn ra đúng lịch | Trực tiếp đo |
| `KPI-005` | Chỉ số (đề xuất) | Thời gian xử lý dạy thay trung bình | ≤ 10 phút |

---

## 4. Stakeholder Liên quan (RACI)

| Vai trò | R | A | C | I |
|---------|---|---|---|---|
| `PERSONA-BRANCH_MANAGER` | ✅ | | | | 
| `PERSONA-TEACHER` | | | ✅ | |
| `PERSONA-OWNER` | | ✅ | | |
| `PERSONA-CSM` | | | | ✅ |

---

## 5. Tiêu chí Thành công Kinh doanh (Business Success Criteria)

| # | Tiêu chí | Cách đo | Mức đạt | Hạn |
|---|----------|---------|---------|-----|
| BR-AC-01 | Hệ thống phát hiện 100% xung đột lịch trước khi lưu | Test tự động | 100% | ⓪ Q? |
| BR-AC-02 | Thời gian xử lý dạy thay từ "GV báo nghỉ" → "có GV thay confirm" | Đo log | ≤ 10 phút (trung vị) | ⓪ Q? |
| BR-AC-03 | Tỷ lệ buổi học bị hủy do lỗi vận hành | Đếm / tổng buổi | ⓪ ≤ 1% | ⓪ Q? |
| BR-AC-04 | BM có gợi ý GV thay thế tự động khi GV báo nghỉ | Có / Không | Có | ⓪ Q? |

---

## 6. Ràng buộc & Giả định

### 6.1. Ràng buộc
- **Dữ liệu:** Quỹ thời gian GV phải được cập nhật (`BF-HR-02`) trước khi gợi ý dạy thay.
- **Bảo mật:** Tuân thủ `[POLICY-ORG-01]` — chỉ gợi ý GV cùng cơ sở.
- **Kỹ thuật:** Thuật toán quét xung đột (`US-OPS02-04`) phải chạy real-time khi lưu lịch.

### 6.2. Giả định
- ⓪ GV sẵn sàng báo nghỉ qua hệ thống (thay vì chỉ nhắn tin BM).
- ⓪ Quỹ thời gian GV được cập nhật hằng tuần.

---

## 7. Stakeholder Requirements Phái sinh (SR Children)

| Mã SR | Persona | Tiêu đề | Trạng thái |
|-------|---------|---------|-----------|
| `SR-BRANCH_MANAGER-002` | BM | Workflow dạy thay < 10 phút | ⏳ Cần tạo |
| `SR-TEACHER-002` | Teacher | Báo nghỉ có gợi ý GV thay | ⏳ Cần tạo |

---

## 8. Năng lực Hệ thống Đáp ứng (CAP Mapping)

| CAP | Vai trò | Mức độ Đáp ứng |
|-----|---------|------------------|
| `CAP-OPS` | Chính — xếp lịch, quét xung đột, dạy thay, đổi phòng | Đầy đủ (`BF-OPS-02`, `BF-OPS-03`) |
| `CAP-HR` | Phụ — quỹ thời gian GV | Đầy đủ (`BF-HR-02`) |
| `CAP-FCM` | Phụ — phòng học khả dụng | Cần kiểm tra |

---

## 9. Tuân thủ Đạo luật

- `[POLICY-ORG-01]` Contextual Data Filtering: GV gợi ý chỉ trong cơ sở.
- `[POLICY-DS-04]` Safety: Hành động dạy thay cần Confirm Dialog.

---

## 10. Lịch sử Phê duyệt

| Phiên bản | Ngày | Người | Trạng thái |
|-----------|------|-------|-----------|
| v0.1 | 2026-05-19 | (AI Agent) | Draft |
| v1.0 | ⓪ TBD | OWNER + BM | Approved |
