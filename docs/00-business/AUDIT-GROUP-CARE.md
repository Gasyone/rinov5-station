---
id: AUDIT-GROUP-CARE
title: "Audit Menu group_care — đối soát Tier 0 ↔ Navigation"
domain: Business
status: Draft
tags: [audit, traceability, navigation, gap-analysis]
---

# Audit: Đối soát menu `group_care` ↔ Tier 0 (BR/SR/Persona)

> **Phương pháp:** Reverse Validation lần đầu trên một nhóm menu thật.
> **Đầu vào:** `src/config/navigation.ts` mục `group_care` (12 mục) + `BR-001` + 3 SR + 5 Persona.
> **Mục tiêu:** Phân loại từng menuId thành 1 trong 3 nhóm:
> - **🟢 KEEP** — đã trace được về SR/BR, có Persona dùng.
> - **🟡 MERGE** — thừa, nhưng trùng chức năng với menu khác → gộp.
> - **🔴 DROP** — không có Persona / SR nào cần → xem xét loại.

---

## 1. 12 mục hiện có trong `group_care`

```typescript
items: [
  { id: 'student_care_new',     label: 'Chăm sóc học viên mới' },
  { id: 'care_schedule',        label: 'Lịch chăm sóc' },
  { id: 'today_care',           label: 'Hôm nay', hiddenInSidebar: true },
  { id: 'new_student_care',     label: 'Học viên mới' },
  { id: 'at_risk_care',         label: 'Có nguy cơ', hiddenInSidebar: true },
  { id: 'expiring_soon_care',   label: 'Sắp hết hạn', hiddenInSidebar: true },
  { id: 'renewal',              label: 'Gia hạn' },
  { id: 'overdue_care',         label: 'Quá hạn', hiddenInSidebar: true },
  { id: 'special_care',         label: 'Chăm sóc đặc biệt' },
  { id: 'care_event',           label: 'Sự kiện chăm sóc' },
  { id: 'care_rule_engine',     label: 'Quy tắc chăm sóc' },
]
```

12 mục — trong đó 4 đã `hiddenInSidebar: true` (today_care, at_risk_care, expiring_soon_care, overdue_care) → là dấu hiệu chính nhóm này đã không sạch ngay từ thiết kế navigation.

---

## 2. Phân loại từng menu

### 2.1. `today_care` 🟢 KEEP (nhưng promote)

| Đối soát | Kết quả |
|----------|---------|
| Persona dùng | `PERSONA-CSM` (cao), `PERSONA-BRANCH_MANAGER` (trung) |
| SR trace về | `SR-CSM-001` Inbox Hôm nay (M-must) |
| BR | `BR-001` |
| BF | `BF-CARE-01` |
| Code | Chưa có screen — cần tạo |
| Action | **Promote** từ hidden → visible. Đây là entry point chính của CSM theo SR-CSM-001. |

### 2.2. `at_risk_care` 🟡 MERGE

| Đối soát | Kết quả |
|----------|---------|
| Persona dùng | Cùng `PERSONA-CSM` với `today_care` |
| SR trace về | `SR-CSM-001` (cùng SR với today_care) |
| Vai trò khác biệt | Chỉ là 1 filter của Inbox |
| Action | **Merge vào `today_care`** dưới dạng tab/segmented. Loại khỏi navigation. |

### 2.3. `expiring_soon_care` 🟡 MERGE

| Đối soát | Kết quả |
|----------|---------|
| Persona dùng | Cùng `PERSONA-CSM` |
| SR trace về | `SR-CSM-001` (1 trong 5 nhóm Inbox) + `SR-CSM-002` (đầu vào pipeline) |
| Vai trò khác biệt | Là 1 filter |
| Action | **Merge** một phần vào `today_care`, một phần vào `renewal`. Loại khỏi navigation. |

### 2.4. `overdue_care` 🟡 MERGE

| Đối soát | Kết quả |
|----------|---------|
| Persona dùng | Cùng `PERSONA-CSM` |
| SR trace về | `SR-CSM-001` (1 nhóm trong Inbox) |
| Vai trò khác biệt | Filter ticket SLA gần hết |
| Action | **Merge** vào `today_care`. Loại khỏi navigation. |

### 2.5. `new_student_care` 🟡 MERGE

| Đối soát | Kết quả |
|----------|---------|
| Persona dùng | Cùng `PERSONA-CSM` |
| SR trace về | `SR-CSM-001` (1 nhóm trong Inbox: HV mới cần welcome call) |
| Vai trò khác biệt | Welcome call cho HV mới đăng ký |
| Action | **Merge** vào `today_care`. Loại khỏi navigation. |

### 2.6. `student_care_new` 🔴 DROP (hoặc rename)

| Đối soát | Kết quả |
|----------|---------|
| Persona dùng | Không rõ |
| SR trace về | KHÔNG có |
| Phân tích | Tên gần giống `new_student_care` ở mục 2.5 — có vẻ là duplicate menu do typo / thiết kế lúc sớm |
| Action | **Drop**. Chỉ giữ 1 trong 2. Khi merge vào `today_care` thì cả 2 đều biến mất. |

### 2.7. `renewal` 🟢 KEEP

| Đối soát | Kết quả |
|----------|---------|
| Persona dùng | `PERSONA-CSM` (cao), `PERSONA-BRANCH_MANAGER` (trung) |
| SR trace về | `SR-CSM-002` Pipeline tái phí |
| BR | `BR-001` |
| BF | `BF-CARE-02` |
| Code | Chưa có screen — cần tạo |
| Action | **Keep**. Là pipeline kanban-style cho `BF-CARE-02`. |

### 2.8. `care_schedule` ⚪ NEEDS-CLARIFICATION

| Đối soát | Kết quả |
|----------|---------|
| Persona dùng | ⓪ Chưa rõ — có thể `PERSONA-CSM` |
| SR trace về | KHÔNG có (chưa có SR mô tả nhu cầu lịch chăm sóc) |
| Phân tích | Có thể là lịch các cuộc gọi CSM định kỳ — nếu vậy là thuộc Inbox Hôm nay sort theo thời gian |
| Action | **Cần phỏng vấn CSM**. Tạm `[NEEDS-CLARIFICATION]` cho đến khi có SR. Nếu thực sự là 1 view "calendar" thì giữ; nếu là filter theo thời gian thì merge. |

### 2.9. `special_care` ⚪ NEEDS-CLARIFICATION

| Đối soát | Kết quả |
|----------|---------|
| Persona dùng | ⓪ Chưa rõ |
| SR trace về | KHÔNG có |
| Phân tích | Có thể là HV VIP / HV đặc biệt cần chăm sóc khác — chưa có business rule rõ trong BF-CARE |
| Action | **Cần SR riêng** nếu có lý do kinh doanh. Hiện tại đánh dấu `[NEEDS-CLARIFICATION]`. Nếu không xuất hiện trong BR/SR sau 1 sprint → DROP. |

### 2.10. `care_event` ⚪ NEEDS-CLARIFICATION

| Đối soát | Kết quả |
|----------|---------|
| Persona dùng | ⓪ Chưa rõ |
| SR trace về | KHÔNG có |
| Phân tích | Tên giống `BF-ENR-03` Quản lý sự kiện tuyển sinh nhưng nằm trong group_care → có thể là sự kiện chăm sóc HV (workshop, gặp mặt) |
| Action | **Cần SR riêng**. Nếu trùng `BF-ENR-03` → drop. Nếu khác (sự kiện chỉ cho HV hiện hữu) → cần BF mới. |

### 2.11. `care_rule_engine` 🟢 KEEP

| Đối soát | Kết quả |
|----------|---------|
| Persona dùng | `PERSONA-BRANCH_MANAGER` (config), ⓪ có thể `PERSONA-OWNER` |
| SR trace về | Gián tiếp qua `BR-001` (cần quy tắc để phát hiện at-risk) |
| BF | `BF-CARE-01` `[RULE-CARE-01-02]` |
| Code | Chưa có screen — cần tạo |
| Action | **Keep**. Đây là cấu hình rule engine, không phải view nghiệp vụ. |

---

## 3. Tổng hợp Quyết định

| Quyết định | Số menu | Danh sách |
|-----------|---------|-----------|
| 🟢 KEEP | 3 | `today_care`, `renewal`, `care_rule_engine` |
| 🟡 MERGE vào `today_care` | 4 | `at_risk_care`, `overdue_care`, `new_student_care`, một phần `expiring_soon_care` |
| 🔴 DROP (duplicate) | 1 | `student_care_new` |
| ⚪ NEEDS-CLARIFICATION | 4 | `care_schedule`, `special_care`, `care_event`, một phần `expiring_soon_care` |

**Trước:** 12 menu (8 hiện + 4 hidden).
**Sau (đề xuất):** 3–5 menu (tuỳ kết quả phỏng vấn 4 mục clarify).

---

## 4. Đề xuất Cấu trúc mới cho `group_care`

```typescript
// Đề xuất sau audit:
items: [
  { id: 'today_care',       label: 'Hôm nay' },              // 🟢 PROMOTE từ hidden
  { id: 'renewal',          label: 'Gia hạn' },              // 🟢 KEEP
  { id: 'care_rule_engine', label: 'Quy tắc chăm sóc' },     // 🟢 KEEP
  // — sau khi clarify các mục NEEDS-CLARIFICATION:
  // { id: 'care_schedule',   label: 'Lịch chăm sóc' },       // ⚪ KEEP nếu khác Today
  // { id: 'care_event',      label: 'Sự kiện chăm sóc' },    // ⚪ KEEP nếu khác BF-ENR-03
]
```

---

## 5. Tác động lên Capability–Persona Decoupling

Nguyên tắc đã được nhắc trong `00-business/README.md` mục 5: *"Có CAP/BF nào tồn tại 2 phiên bản chỉ vì khác Persona không?"*

Audit này cho thấy:
- 5 menu `today_care / at_risk_care / new_student_care / overdue_care / expiring_soon_care` thực chất là **5 filter của cùng 1 dataset Phiếu Chăm sóc** trong `BF-CARE-01`. Không có Persona riêng cho từng menu — đều là CSM dùng.
- Việc tách 5 menu là một dạng "Feature-by-Filter" — **vi phạm Capability–Persona Decoupling**.
- Đề xuất hợp nhất là 1 ứng dụng cụ thể của nguyên tắc.

---

## 6. Ảnh hưởng tới Backlog

Audit này tạo các Work Item mới đề xuất cho M2 (sau khi Pilot 4 verify):

| Đề xuất WI | Mô tả | Liên quan |
|-----------|-------|-----------|
| W7.4 | Cập nhật `navigation.ts`: gộp 5 menu thành 1 `today_care` với segmented | E7 |
| W7.5 | Phỏng vấn CSM/BM xác nhận 4 mục `[NEEDS-CLARIFICATION]` | E7 |
| W7.6 | Tạo screen `today_care` theo `SR-CSM-001` (chưa có code) | E7 / E5 |
| W7.7 | Tạo screen `renewal` theo `SR-CSM-002` (chưa có code) | E7 / E5 |
| W7.8 | Tạo widget BM Dashboard theo `SR-BRANCH_MANAGER-001` | E7 / E5 |

---

## 7. Chỉ dẫn cho AI Agent & Lập trình viên

- Đây là báo cáo audit **lần đầu** dùng framework Tier 0. Cần phỏng vấn để chuyển ⓪ và `[NEEDS-CLARIFICATION]` thành Approved.
- Trước khi sửa `navigation.ts`, phải có:
  1. Phỏng vấn CSM/BM xác nhận audit.
  2. SR cho 4 mục `[NEEDS-CLARIFICATION]` (giữ hoặc drop có lý do).
  3. Lộ trình migration (URL cũ redirect URL mới — nếu cần).

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** xóa menu nào trước khi có chữ ký Stakeholder (Branch Manager phụ trách CARE).
- **KHÔNG** đổi tên menu mà không cập nhật mọi tài liệu US tham chiếu.
- **KHÔNG** dùng audit này như quyết định cuối — đây là *đề xuất có lập luận*, cần 1 vòng review với người dùng thật.
