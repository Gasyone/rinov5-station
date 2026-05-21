---
id: BUSINESS_LAYER_README
title: "Lớp Tài liệu Nghiệp vụ Stakeholder (Tier 0)"
domain: Business
status: foundation
tags: [business, stakeholder, requirements, traceability]
---

# Lớp Tài liệu Nghiệp vụ Stakeholder — Tier 0

> **Vị trí trong hệ thống tài liệu:** Đặt **TRƯỚC** Tier 1 (`ENTERPRISE_STANDARDS.md`).
> **Vai trò:** Trả lời câu hỏi *"Vì sao Rinov5 tồn tại? Ai cần nó? Họ cần gì?"* trước khi `CAP/BF/US` trả lời câu hỏi *"Hệ thống được xây thế nào?"*.
> **Trạng thái:** Foundation — khung trống, chờ điền nội dung theo từng pilot.

---

## 1. Lý do tồn tại của lớp này

Hệ tài liệu hiện tại của Rinov5 (Tier 1 → Tier 4) mô tả **giải pháp** rất chi tiết, nhưng chưa có lớp mô tả **vấn đề**. Hệ quả:

- Không có cách kiểm chứng một `US` có cần thiết hay không.
- Không có cách phát hiện một `menuId` thừa thãi trong `navigation.ts`.
- Không có chứng cứ để Stakeholder ký nhận phạm vi.
- Không có chỉ số đo lường thành công sau khi triển khai.

Lớp Tier 0 này bổ sung 4 hạng mục theo chuẩn BABOK / IIBA:

| Hạng mục | Trả lời câu hỏi | Tài liệu mẫu |
|----------|----------------|--------------|
| **Vision & Goals** | Vì sao tổ chức cần Rinov5? Đo bằng gì? | `TEMPLATE-VISION.md` |
| **Stakeholder Map & Persona** | Ai là người liên quan? Hằng ngày họ làm gì? | `TEMPLATE-PERSONA.md` |
| **Business Requirements (BR)** | Doanh nghiệp cần đạt được điều gì? | `TEMPLATE-BR.md` |
| **Stakeholder Requirements (SR)** | Mỗi nhóm cần gì để hoàn thành công việc? | `TEMPLATE-SR.md` |

---

## 2. Cấu trúc thư mục

```
docs/
├── 00-business/                    ← Lớp Tier 0 (mới)
│   ├── README.md                   ← Bạn đang đọc
│   ├── VISION.md                   ← (chưa tạo) Tầm nhìn + OKR
│   ├── STAKEHOLDERS.md             ← (chưa tạo) Bản đồ Stakeholder + RACI
│   ├── TRACEABILITY-MATRIX.md      ← (chưa tạo) Ma trận BR↔SR↔CAP↔BF↔US↔Screen
│   ├── PERSONAS/                   ← (chưa tạo) Mỗi Persona 1 file
│   │   ├── PERSONA-OWNER.md
│   │   ├── PERSONA-BRANCH-MANAGER.md
│   │   ├── PERSONA-SALE.md
│   │   ├── PERSONA-CSM.md
│   │   └── PERSONA-TEACHER.md
│   ├── BR/                         ← (chưa tạo) Business Requirements
│   │   └── BR-001-*.md
│   └── SR/                         ← (chưa tạo) Stakeholder Requirements
│       └── SR-{PERSONA}-001-*.md
│
├── ENTERPRISE_STANDARDS.md         ← Tier 1 (đã có)
├── DESIGN_SYSTEM.md                ← Đã có
├── business-functions/             ← Tier 2-4 (đã có)
└── templates/
    ├── TEMPLATE-VISION.md          ← (mới) Tier 0
    ├── TEMPLATE-PERSONA.md         ← (mới) Tier 0
    ├── TEMPLATE-BR.md              ← (mới) Tier 0
    ├── TEMPLATE-SR.md              ← (mới) Tier 0
    ├── TEMPLATE-CAP.md             ← (đã có)
    ├── TEMPLATE-BF.md              ← (đã có)
    ├── TEMPLATE-US-LIST.md         ← (đã có)
    ├── TEMPLATE-US-FORM.md         ← (đã có)
    ├── TEMPLATE-US-DETAIL.md       ← (đã có)
    └── TEMPLATE-FLOW.md            ← (đã có)
```

---

## 3. Quy ước mã định danh

Đồng nhất với quy ước hiện có trong `DOCUMENTATION_GUIDELINES.md`:

| Loại | Cú pháp | Ví dụ |
|------|---------|-------|
| Business Requirement | `BR-{số 3 chữ}-{tên-kebab}` | `BR-001-hop-nhat-domain` |
| Stakeholder Requirement | `SR-{PERSONA}-{số 3 chữ}-{tên-kebab}` | `SR-CSM-001-pipeline-cham-soc` |
| Persona | `PERSONA-{ROLE}` | `PERSONA-CSM` |
| OKR | `OKR-{số 2 chữ}` | `OKR-01` |
| KPI | `KPI-{số 3 chữ}` | `KPI-001` |

Vai trò Persona dùng tên viết hoa, dấu gạch dưới (theo cách viết role hiện tại trong `useAuthStore`): `OWNER`, `BRANCH_MANAGER`, `SALE`, `CSM`, `TEACHER`.

> **Lưu ý convention:** **id** dùng `BRANCH_MANAGER` (khớp với role string trong code), nhưng **tên file** dùng kebab-case `PERSONA-BRANCH-MANAGER.md` (khớp với convention `docs/business-functions/US-...`). Đây là sự nhất quán có chủ đích giữa 2 thế giới.

---

## 4. Mô hình Truy vết (Traceability)

Quy tắc cứng để chống GAP giữa tài liệu và thực tế:

```
OKR / KPI
   ▲
   │ đo lường
   │
   BR ────────────► CAP (Tier 2)
   ▲                 │
   │ phát sinh từ    │
   │                 ▼
   SR ────────────► BF (Tier 3)
   ▲                 │
   │ thuộc           │
   │                 ▼
PERSONA            US (Tier 4) ────► Screen (code)
```

| Quan hệ | Ràng buộc |
|---------|-----------|
| BR → OKR/KPI | Mọi BR phải có ≥ 1 chỉ số đo. |
| SR → BR | Mọi SR phải trace ngược về ≥ 1 BR. |
| SR → Persona | Mọi SR phải gắn với ≥ 1 Persona. |
| US → SR | Mọi US phải trace ngược về ≥ 1 SR. |
| Screen → US | Mọi `menuId` trong `navigation.ts` phải có ≥ 1 US. |

Tất cả ràng buộc được giám sát bằng `TRACEABILITY-MATRIX.md`.

---

## 5. Cơ chế chống GAP (3 lớp)

### 5.1. Traceability Matrix
1 file CSV/MD duy nhất ánh xạ `BR ↔ SR ↔ Persona ↔ CAP ↔ BF ↔ US ↔ Screen`. Cập nhật mỗi khi thêm/đổi tài liệu ở bất kỳ tầng nào.

### 5.2. Reverse Validation (định kỳ)
Chạy 4 câu hỏi đối soát ngược:
- BR nào chưa có CAP/BF triển khai? → **Gap nghiệp vụ**.
- US nào không trace về SR? → **Scope creep**.
- Persona nào không xuất hiện trong AC của bất kỳ US nào? → **Persona giả tưởng**.
- `menuId` nào trong navigation không có US? → **Code đi nhanh hơn doc**.

### 5.3. Acceptance Loop
- BR/SR phải được Stakeholder ký xác nhận (commit ID hoặc note trong PR).
- US chỉ được build khi BR/SR cha ở trạng thái `Approved`.
- Khi 1 BR thay đổi → trigger review tất cả SR/CAP/BF/US trace về nó.

---

## 6. Quy trình Tích hợp với 4-Tier hiện có

Lớp này **không thay thế** Tier 1-4 mà bổ sung phía trên. Sau khi pilot validate:

1. Cập nhật `DOCUMENTATION_GUIDELINES.md` để khai báo Tier 0.
2. Cập nhật `CATALOG.md` để các CAP tham chiếu BR cha.
3. Cập nhật template `TEMPLATE-CAP.md` thêm mục "BR liên quan".
4. Cập nhật template `TEMPLATE-US-*.md` thêm mục "SR liên quan".

Trước khi tích hợp, lớp này hoạt động độc lập như một thử nghiệm.

---

## 7. Trạng thái Pilot

| Pilot | Mô tả | Trạng thái |
|-------|-------|-----------|
| Pilot 2 — Foundation | Cấu trúc thư mục + 4 template + README | ✅ Đang triển khai |
| Pilot 3 — Stakeholders + 5 Persona | Điền nội dung thật | ⏳ Chưa bắt đầu |
| Pilot 4 — Vết cắt dọc CAP-CARE | 1 BR + 2-3 SR + Matrix mẫu | ⏳ Chưa bắt đầu |
| Pilot 1 — Audit Matrix toàn dự án | Đối soát 11 CAP / 42 BF / ~150 US | ⏳ Chưa bắt đầu |

---

## 8. Chỉ dẫn cho AI Agent & Lập trình viên

- **KHÔNG** tạo file thật trong `00-business/` cho đến khi có pilot tương ứng được phê duyệt.
- **PHẢI** đọc `README.md` này trước khi đề xuất Persona/BR/SR mới.
- **PHẢI** dùng template tương ứng trong `docs/templates/` thay vì sáng tạo cấu trúc mới.
- Khi tham chiếu chéo, dùng cú pháp mã định danh thay vì copy nội dung (giống `DOCUMENTATION_GUIDELINES.md` mục 3).

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** sửa `ENTERPRISE_STANDARDS.md`, `CAP-*`, `BF-*`, `US-*` với mục đích "căn chỉnh" với BR/SR khi chưa có quy trình tích hợp chính thức.
- **KHÔNG** đặt logic kỹ thuật (API, schema, code) vào BR/SR — đó là việc của Tier 3-4.
- **KHÔNG** tạo Persona dựa trên suy đoán — phải có dữ liệu thực từ phỏng vấn hoặc xác nhận của Stakeholder.
