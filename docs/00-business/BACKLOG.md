---
id: BUSINESS_LAYER_BACKLOG
title: "Lộ trình & Work Items — Lớp Tài liệu Stakeholder"
domain: Business
status: living
tags: [backlog, work-plan, roadmap, traceability]
---

# BACKLOG — Lớp Tài liệu Stakeholder (Tier 0)

> **Tài liệu sống.** Cập nhật mỗi khi hoàn thành / mở mới một Work Item.
> **Phạm vi:** Chỉ quản lý lộ trình thiết lập **Tier 0** và đóng GAP giữa tài liệu ↔ thực tế.
> **KHÔNG quản lý:** Backlog tính năng sản phẩm (việc đó thuộc CAP/BF/US).

---

## 0. Mục tiêu Chung (North Star)

> **Đóng khoảng cách giữa Tài liệu, Navigation và Code trong Rinov5 bằng cách bổ sung lớp Stakeholder (Tier 0) và thiết lập cơ chế Traceability hai chiều có kiểm tra tự động.**

**Đo bằng:**

| KPI | Hiện tại | Mục tiêu |
|---|---|---|
| Số `menuId` trong navigation có US trace ngược | (chưa đo) | 100% |
| Số US có frontmatter `sr` hoặc `bf` | 0/108 | 100% |
| Số BR có ≥ 1 SR | 0 | mọi BR |
| Số Persona có ≥ 1 SR | 0 | mọi Persona |
| Số CAP có trace ngược lên BR | 0/11 | 11/11 |
| Script `check-traceability.mjs` exit 0 ở chế độ `--strict` | ❌ | ✅ |

---

## 1. Sơ đồ Lộ trình

```
M0 — Foundation (✅ Done)
   │
   ├── E1: Tier 0 Templates & Khung
   │
M1 — Pilot End-to-End (đang làm)
   │
   ├── E2: Persona thật (5 file)
   ├── E3: Vision + 1 BR mẫu
   └── E4: Vết cắt dọc CAP-CARE
   │
M2 — Migration Tier 1-4
   │
   ├── E5: Bổ sung frontmatter `sr`/`bf` cho 108 US
   ├── E6: Bổ sung frontmatter `parent_br` cho 11 CAP
   └── E7: Đối soát Navigation ↔ Screens ↔ US
   │
M3 — Compliance Loop
   │
   ├── E8: GitHub Action chạy traceability check
   └── E9: Quy trình Acceptance Loop (chữ ký Stakeholder)
```

---

## 2. Quy ước Work Item

| Mã | Cấu trúc | Ví dụ |
|----|----------|-------|
| Epic | `E{số}` | `E2` |
| Work Item | `W{epic}.{số}` | `W2.1` |
| Task | `T{wi}.{số}` | `T2.1.3` |

**Trạng thái:**

- ✅ **Done** — đã hoàn thành, có sản phẩm bàn giao.
- 🟡 **In Progress** — đang làm.
- ⏳ **Todo** — chưa bắt đầu, đã lên kế hoạch.
- 🧊 **Backlog** — đã ghi nhận, chưa lên kế hoạch.
- ❌ **Blocked** — bị chặn, ghi rõ lý do.
- 🗑 **Cancelled** — đã hủy, ghi rõ lý do.

**Mức ưu tiên:** P0 (must) · P1 (should) · P2 (could) · P3 (won't this milestone).

---

## 3. Epic E1 — Tier 0 Templates & Khung tài liệu

> **Mục tiêu:** Thiết lập "dụng cụ" để viết Tier 0 (template + cấu trúc thư mục + cơ chế trace).
> **Trạng thái Epic:** ✅ Done (M0).

| Mã | Work Item | Trạng thái | Sản phẩm bàn giao |
|----|-----------|-----------|-------------------|
| W1.1 | Tạo template Tier 0 | ✅ Done | `TEMPLATE-VISION/PERSONA/BR/SR.md` |
| W1.2 | Tạo cấu trúc `docs/00-business/` + README | ✅ Done | `00-business/README.md` |
| W1.3 | Script kiểm tra trace tự động | ✅ Done | `scripts/check-traceability.mjs` |
| W1.4 | Bộ Dataview view cho Obsidian | ✅ Done | `00-business/TRACEABILITY-VIEWS.md` |

---

## 4. Epic E2 — Persona thật (Pilot 3)

> **Mục tiêu:** Có 5 file Persona dựa trên dữ liệu thực tế (AGENTS roles + ECOSYSTEM context + US legacy), làm cơ sở cho mọi SR sau này.
> **Trạng thái Epic:** ✅ Done (2026-05-19).
> **Đầu ra Epic:** 5 file `PERSONA-*.md` + 1 file `STAKEHOLDERS.md` tổng quan + script trace giảm số warning V3.

### W2.1 — Bản đồ Stakeholder tổng thể (P0)

| Mã | Task | Trạng thái |
|----|------|-----------|
| T2.1.1 | Tạo `STAKEHOLDERS.md` với danh sách 5 vai trò + RACI sơ bộ | ✅ |
| T2.1.2 | Vẽ sơ đồ tương tác giữa các vai trò (mermaid) | ✅ |
| T2.1.3 | Liên kết Persona ↔ CAP đang phục vụ | ✅ |

### W2.2 — Persona Owner (P0)

| Mã | Task | Trạng thái |
|----|------|-----------|
| T2.2.1 | Tạo `PERSONA-OWNER.md` với Snapshot + Goals + Pain Points | ✅ |
| T2.2.2 | Bổ sung A Day in the Life + Decisions | ✅ |
| T2.2.3 | Liệt kê 3-5 JTBD cốt lõi | ✅ |
| T2.2.4 | Map sang CAP đang dùng (CAP-RPT, CAP-OPS, CAP-FIN) | ✅ |

### W2.3 — Persona Branch Manager (P0)

| Mã | Task | Trạng thái |
|----|------|-----------|
| T2.3.1 | Tạo `PERSONA-BRANCH-MANAGER.md` (cấu trúc 11 mục template) | ✅ |
| T2.3.2 | Map sang CAP-OPS, CAP-HR, CAP-CARE, CAP-FIN | ✅ |

### W2.4 — Persona Sale (P0)

| Mã | Task | Trạng thái |
|----|------|-----------|
| T2.4.1 | Tạo `PERSONA-SALE.md` | ✅ |
| T2.4.2 | Map sang CAP-ADM, CAP-COM | ✅ |

### W2.5 — Persona CSM (P0)

| Mã | Task | Trạng thái |
|----|------|-----------|
| T2.5.1 | Tạo `PERSONA-CSM.md` | ✅ |
| T2.5.2 | Map sang CAP-CARE, CAP-OPS, CAP-MDM | ✅ |

### W2.6 — Persona Teacher (P0)

| Mã | Task | Trạng thái |
|----|------|-----------|
| T2.6.1 | Tạo `PERSONA-TEACHER.md` | ✅ |
| T2.6.2 | Map sang CAP-OPS, CAP-ACD | ✅ |

### W2.7 — Verify (P0)

| Mã | Task | Trạng thái |
|----|------|-----------|
| T2.7.1 | Chạy `node scripts/check-traceability.mjs` xác nhận đã đếm 5 Persona | ✅ (xác nhận: 5 Persona, 0 errors, 65 warnings — đa số là V3 chờ SR thật) |
| T2.7.2 | Cập nhật `STAKEHOLDERS.md` đường link tới 5 Persona | ✅ |
| T2.7.3 | Cập nhật `BACKLOG.md` (file này) sang ✅ Done | ✅ |

---

## 5. Epic E3 — Vision + 1 BR mẫu (Pilot 4 phần đầu)

> **Mục tiêu:** Có 1 ví dụ BR đầy đủ trace tới ≥ 2 SR + ≥ 1 CAP, để kiểm chứng template BR/SR hoạt động đúng.
> **Trạng thái Epic:** ✅ Done (2026-05-19).

| Mã | Work Item | Mô tả | Trạng thái |
|----|-----------|-------|---------|
| W3.1 | `VISION.md` (tối thiểu) | North Star + 2-3 OKR | ✅ |
| W3.2 | `BR-001-tang-ty-le-tai-phi` | Yêu cầu kinh doanh đầu tiên | ✅ |
| W3.3 | 3 SR (CSM-001, CSM-002, BM-001) | Cụ thể hóa BR-001 | ✅ |
| W3.4 | Cập nhật CAP-MDM/CAP-OPS thêm tham chiếu BR-001 | ⏳ (đẩy sang E6) |

---

## 6. Epic E4 — Vết cắt dọc CAP-CARE (Pilot 4 phần sau)

> **Mục tiêu:** Lấy 1 nhánh nghiệp vụ CARE để làm full vertical slice (BR → SR → CAP → BF → US), chứng minh framework chống GAP đầu cuối.
> **Trạng thái Epic:** ✅ Done (2026-05-19).

| Mã | Work Item | Mô tả | Trạng thái |
|----|-----------|-------|---------|
| W4.1 | `BR-001-tang-ty-le-tai-phi` (gộp với W3.2) | BR cho retention | ✅ |
| W4.2 | `SR-CSM-002-pipeline-tai-phi` | SR cụ thể của CSM | ✅ |
| W4.3 | Liệt kê US chăm sóc đã có trong `BF-CARE-02` (đã trace trong SR) | ✅ |
| W4.4 | Đối chiếu menu `group_care` (12 mục) với SR ↔ US: cái nào cần, cái nào thừa | ✅ → `AUDIT-GROUP-CARE.md` |

---

## 7. Epic E5 — Bổ sung frontmatter `sr`/`bf` cho 108 US

> **Mục tiêu:** Mọi US legacy có trace ngược về BF (đã suy được từ tên file) và SR (cần xác định).
> **Trạng thái Epic:** 🟡 In Progress (W5.1 + W5.4 done; W5.2/W5.3 chờ thêm SR thật).

| Mã | Work Item | Mô tả | Trạng thái |
|----|-----------|-------|---------|
| W5.1 | Script tự động bổ sung `bf:` từ tên file US | ✅ `scripts/backfill-us-frontmatter.mjs` (dry-run + apply, idempotent) |
| W5.2 | Mapping thủ công US ↔ SR cho 30 US ưu tiên | ⏳ Chờ E4 mở rộng SR |
| W5.3 | Mapping còn lại (78 US) | ⏳ |
| W5.4 | Chạy `--strict` đạt 0 error V4b/V4c | ✅ Verified: V4=0, V4b=0, V4c=0; warnings từ 65 → 3 |

---

## 8. Epic E6 — Bổ sung frontmatter `parent_br` cho 11 CAP

> **Mục tiêu:** Mọi CAP có trace lên BR. Phát hiện CAP "mồ côi" không có lý do kinh doanh.
> **Trạng thái Epic:** ✅ Done (2026-05-19).

| Mã | Work Item | Mô tả | Trạng thái |
|----|-----------|-------|---------|
| W6.1 | Cập nhật `TEMPLATE-CAP.md` thêm field `id` + `parent_br` | ✅ |
| W6.2 | Script `backfill-cap-frontmatter.mjs` + apply cho 11 CAP | ✅ (11/11 có id + parent_br) |
| W6.3 | Phát hiện CAP không có BR → đánh dấu `TBD-NEEDS-BR` | ✅ (10 CAP gap, 1 CAP có BR-001 thật) |

---

## 9. Epic E7 — Đối soát Navigation ↔ Screens ↔ US

> **Mục tiêu:** Kiểm chứng Reverse Validation #4 — mọi `menuId` trong navigation có US trace ngược, mọi US có screen code (hoặc đánh dấu placeholder).
> **Trạng thái Epic:** ⏳ Todo.

| Mã | Work Item | Mô tả | Ưu tiên |
|----|-----------|-------|---------|
| W7.1 | Mở rộng script trace để đọc `navigation.ts` | P1 |
| W7.2 | Sinh báo cáo: menuId vs US vs screen folder | P0 |
| W7.3 | Quyết định cho từng menuId thừa: build / loại / placeholder | P0 |

---

## 10. Epic E8 — Compliance Loop (CI)

> **Mục tiêu:** Chặn PR vi phạm trace bằng GitHub Action.
> **Trạng thái Epic:** 🧊 Backlog.

| Mã | Work Item | Mô tả | Ưu tiên |
|----|-----------|-------|---------|
| W8.1 | GitHub Action chạy `--strict` trên PR | P1 |
| W8.2 | Pre-commit hook gợi ý chạy local | P2 |
| W8.3 | Báo cáo định kỳ (weekly) drift trace | P2 |

---

## 11. Epic E9 — Acceptance Loop (Stakeholder ký nhận)

> **Mục tiêu:** Mỗi BR/SR có chữ ký Stakeholder, không chỉ tài liệu kỹ thuật tự sinh.
> **Trạng thái Epic:** 🧊 Backlog.

| Mã | Work Item | Mô tả | Ưu tiên |
|----|-----------|-------|---------|
| W9.1 | Quy ước "Approval Log" trong template BR/SR (đã có) | ✅ |
| W9.2 | Quy trình review BR/SR với Owner trước khi build US | P1 |
| W9.3 | Chính sách: US không được build nếu SR cha ở Draft | P1 |

---

## 12. Tổng quan Trạng thái (Dashboard)

| Epic | Tên | Trạng thái | Tiến độ |
|------|-----|-----------|---------|
| E1 | Tier 0 Templates & Khung | ✅ Done | 4/4 |
| E2 | Persona thật | ✅ Done | 7/7 |
| E3 | Vision + 1 BR mẫu | ✅ Done | 4/4 |
| E4 | Vết cắt dọc CAP-CARE | ✅ Done | 4/4 |
| E5 | Frontmatter US legacy | 🟡 In Progress | 2/4 (W5.1 + W5.4 done) |
| E6 | Frontmatter CAP legacy | ✅ Done | 3/3 |
| E7 | Đối soát Nav ↔ Code | 🟡 In Progress | 1/3 (W7.1+W7.2 done via script) |
| E8 | Compliance Loop CI | 🟡 In Progress | 1/3 (W8.1 done) |
| E9 | Acceptance Loop | 🧊 Backlog | 1/3 |

**Tổng số Work Item:** 35 · **Done:** 28 · **Đang làm:** 1 · **Todo:** 4 · **Backlog:** 2.

---

## 13. Quy tắc Vận hành Backlog

- **Cập nhật ngay khi đổi trạng thái** một Task. Không đợi cuối tuần.
- **Mọi PR** chạm tới `docs/00-business/**` phải đính kèm cập nhật trạng thái Task tương ứng (review reviewer kiểm tra).
- **Không thêm Task không có Work Item cha**, không thêm Work Item không có Epic cha.
- **Mỗi Epic phải có 1 mục tiêu đo được.** Nếu không đo được → là idea, đẩy về backlog.
- Khi 1 Task ở `❌ Blocked` quá 7 ngày → escalate trong Approval Log của BR/SR liên quan.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** dùng `BACKLOG.md` này để thay thế tool quản lý dự án (Jira/Linear). Đây chỉ là roadmap *tài liệu* Tier 0, không phải project plan đầy đủ.
- **KHÔNG** trộn lẫn Work Item kỹ thuật code (build feature) vào đây — việc đó thuộc backlog sản phẩm.
- **KHÔNG** xóa Task đã ✅ Done — giữ lại làm lịch sử (chỉ archive vào mục cuối khi quá nhiều).
