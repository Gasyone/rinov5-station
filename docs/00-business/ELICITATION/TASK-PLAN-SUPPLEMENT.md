---
id: TASK-PLAN-SUPPLEMENT
title: "Kế hoạch Bổ sung Elicitation Toolkit theo Chuẩn Ngành"
domain: Elicitation
status: In-Progress
tags: [task-plan, elicitation, industry-standard]
---

# Kế hoạch Bổ sung Elicitation Toolkit

> **Mục tiêu:** Nâng cấp bộ công cụ thu thập yêu cầu từ "chỉ có questionnaire" lên đa kỹ thuật theo BABOK + bao phủ đầy đủ module theo chuẩn Education ERP.
> **Tham chiếu:** BABOK v3.0 Elicitation & Collaboration, erpresearch.com Education ERP Checklist 2026, OpenEduCat module list.

---

## Batch 1 — 4 Template BABOK (Đa kỹ thuật)

| # | File | Kỹ thuật | Trạng thái |
|---|------|----------|-----------|
| 1.1 | `templates/TEMPLATE-OBSERVATION.md` | Job Shadowing | ✅ |
| 1.2 | `templates/TEMPLATE-PROCESS-MAP.md` | Process Modeling (As-Is) | ✅ |
| 1.3 | `templates/TEMPLATE-WORKSHOP.md` | Workshop Facilitation | ✅ |
| 1.4 | `templates/TEMPLATE-PROTOTYPE-FEEDBACK.md` | Prototyping Feedback | ✅ |

## Batch 2 — 8 QS bổ sung (Gap ngành)

| # | File | Module ngành | Trạng thái |
|---|------|-------------|-----------|
| 2.1 | `QS-COMM-01-kenh-lien-lac.md` | Communication & Notification | ✅ |
| 2.2 | `QS-PORTAL-01-trai-nghiem-phu-huynh.md` | Parent/Student Portal | ✅ |
| 2.3 | `QS-COMPLIANCE-01-bao-mat-du-lieu.md` | Compliance & Data Privacy | ✅ |
| 2.4 | `QS-INTEGRATION-01-tich-hop-di-chuyen.md` | Integration & Migration | ✅ |
| 2.5 | `QS-MULTI-BRANCH-01-van-hanh-da-co-so.md` | Multi-branch Operations | ✅ |
| 2.6 | `QS-QA-01-danh-gia-chat-luong-giang-day.md` | Teaching Quality Assurance | ✅ |
| 2.7 | `QS-ALUMNI-01-tot-nghiep-cuu-hv.md` | Alumni & Graduation | ✅ |
| 2.8 | `QS-CHANGE-MGMT-01-quan-ly-thay-doi.md` | Change Management & Training | ✅ |

## Batch 3 — Cập nhật CATALOG + Verify

| # | Việc | Trạng thái |
|---|------|-----------|
| 3.1 | Cập nhật `CATALOG.md` thêm 8 QS mới + 4 template | ✅ (đã cập nhật trước đó) |
| 3.2 | Chạy `check-traceability.mjs` verify 0 errors | ✅ (48 QS, 0 errors, 243 nodes) |
| 3.3 | Cập nhật `BACKLOG.md` | ✅ |

---

## Tiêu chí Hoàn thành

- [x] 4 template BABOK tạo xong, có hướng dẫn sử dụng.
- [x] 8 QS bổ sung tạo xong, mỗi QS 7-10 câu, có Output Mapping.
- [x] Tổng QS = 48 (vượt mục tiêu 42 ban đầu).
- [x] Script trace: 0 errors.

## Kết quả Cuối

| Metric | Giá trị |
|--------|---------|
| Tổng QS files | **48** |
| Tổng template (mới) | **4** (Observation, Process Map, Workshop, Prototype Feedback) |
| Tổng nodes trong hệ thống | **243** |
| Errors | **0** |
| Bao phủ module ngành | **15/15** (100%) |
| Bao phủ kỹ thuật BABOK | **5/5** (Questionnaire + Observation + Process + Workshop + Prototype) |
