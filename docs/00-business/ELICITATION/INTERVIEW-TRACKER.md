---
id: INTERVIEW-TRACKER
title: "Bảng Theo dõi Tiến độ Phỏng vấn"
type: "Tracker"
domain: "Elicitation"
status: "Active"
tags: [tracker, elicitation, progress, coverage]
---

# Bảng Theo dõi Tiến độ Phỏng vấn

> **Mục đích:** Theo dõi tiến độ phỏng vấn, đảm bảo coverage đầy đủ cho tất cả Persona và bộ câu hỏi.
> **Cập nhật:** Sau mỗi buổi phỏng vấn (Planned → Done / Cancelled).

---

## 1. Bảng Tracking Chi tiết

| QS ID | Persona | Người được hỏi (ẩn danh) | Ngày | Thời lượng | File RS | Status |
|-------|---------|--------------------------|------|-----------|---------|--------|
| QS-PERSONA-VALIDATE | CSM | CSM-Q7-01 | ___ | ___ phút | RS-___-___ | ○ Planned ○ Done ○ Cancelled |
| QS-PERSONA-VALIDATE | BM | BM-Q1-01 | ___ | ___ phút | RS-___-___ | ○ Planned ○ Done ○ Cancelled |
| QS-PERSONA-VALIDATE | Sale | Sale-Q3-01 | ___ | ___ phút | RS-___-___ | ○ Planned ○ Done ○ Cancelled |
| QS-PERSONA-VALIDATE | Teacher | GV-Q7-01 | ___ | ___ phút | RS-___-___ | ○ Planned ○ Done ○ Cancelled |
| QS-PERSONA-VALIDATE | Owner | Owner-01 | ___ | ___ phút | RS-___-___ | ○ Planned ○ Done ○ Cancelled |
| QS-CAP-CARE | CSM | CSM-Q7-01 | ___ | ___ phút | RS-___-___ | ○ Planned ○ Done ○ Cancelled |
| QS-CAP-CARE | BM | BM-Q1-01 | ___ | ___ phút | RS-___-___ | ○ Planned ○ Done ○ Cancelled |
| QS-BR-DISCOVERY | Owner | Owner-01 | ___ | ___ phút | RS-___-___ | ○ Planned ○ Done ○ Cancelled |
| QS-BR-DISCOVERY | BM | BM-Q1-01 | ___ | ___ phút | RS-___-___ | ○ Planned ○ Done ○ Cancelled |

---

## 2. Coverage Matrix (Persona × QS)

> Đánh dấu ✓ khi đã hoàn thành ít nhất 1 buổi. Mục tiêu: mỗi ô ≥ 2 người.

| QS \ Persona | Owner | BM | Sale | CSM | Teacher |
|--------------|-------|----|------|-----|---------|
| QS-PERSONA-VALIDATE | ○ | ○ | ○ | ○ | ○ |
| QS-BR-DISCOVERY | ○ | ○ | — | — | — |
| QS-CAP-CARE | — | ○ | — | ○ | — |
| QS-CAP-OPS | — | ○ | — | — | ○ |
| QS-CAP-ADM | — | ○ | ○ | — | — |

> Ký hiệu: ✓ = Done (≥1), ✓✓ = Done (≥2, đủ so sánh), ○ = Planned, — = Không áp dụng

---

## 3. Mục tiêu Coverage

- Mỗi bộ câu hỏi (QS) hỏi **≥ 2 người cùng Persona** để có dữ liệu so sánh.
- Ưu tiên QS-PERSONA-VALIDATE trước (gỡ ⓪ sớm nhất có thể).
- Sau khi đủ 3 responses cho 1 QS → tạo file Synthesis (`SYN-{QS-ID}-{YYYY-MM}.md`).

---

## 4. Lịch Phỏng vấn Đề xuất

| Tuần | Bộ câu hỏi | Persona | Mục tiêu |
|------|-----------|---------|-----------|
| 1 | QS-PERSONA-VALIDATE | CSM (1-2 người) | Gỡ ⓪ PERSONA-CSM |
| 1 | QS-PERSONA-VALIDATE | BM (1 người) | Gỡ ⓪ PERSONA-BM |
| 2 | QS-CAP-CARE | CSM + BM | Validate SR-CSM-001/002 |
| 2 | QS-PERSONA-VALIDATE | Sale (1 người) | Gỡ ⓪ PERSONA-SALE |
| 3 | QS-BR-DISCOVERY | Owner + BM | Tìm BR mới cho 7 CAP TBD |
| 3 | QS-PERSONA-VALIDATE | Teacher (1 người) | Gỡ ⓪ PERSONA-TEACHER |
| 4 | QS-CAP-OPS | BM + Teacher | Validate BR-002 |
