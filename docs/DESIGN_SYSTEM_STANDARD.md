# Design System Standard — Tiêu chuẩn ngành cho tài liệu Hệ thống Thiết kế

> **Mục đích:** Định nghĩa CẤU TRÚC, NỘI DUNG BẮT BUỘC, và TIÊU CHÍ CHẤT LƯỢNG mà mọi tài liệu Design System phải tuân thủ.
>
> **Tham chiếu ngành:**
> - Material Design 3 (Google) — Token Architecture
> - Carbon Design System (IBM) — Enterprise Governance, Grid, Breakpoints
> - Ant Design (Alibaba) — Enterprise Admin/ERP Patterns
> - Atlassian Design System — B2B SaaS, Content & Voice
> - WCAG 2.1 AA — Accessibility Baseline
> - Nielsen's 10 Usability Heuristics — Interaction Design

---

## Cấu trúc bắt buộc

Một tài liệu Design System hợp lệ PHẢI chứa tối thiểu **8 nhóm nội dung** (sections), sắp xếp theo thứ tự sau:

```
Design System Document
│
├── S1. PRINCIPLES          ← Triết lý thiết kế (TẠI SAO)
├── S2. FOUNDATIONS          ← Tech stack, công cụ
├── S3. DESIGN TOKENS        ← Ngôn ngữ thị giác (visual language)
│   ├── S3.a Color
│   ├── S3.b Status / Semantic Colors
│   ├── S3.c Typography
│   ├── S3.d Spacing
│   ├── S3.e Shape / Radius
│   ├── S3.f Elevation / Shadow
│   └── S3.g Dark Mode / Theming
├── S4. LAYOUT               ← Bố cục trang, responsive
│   ├── S4.a App Shell
│   ├── S4.b Page Templates
│   ├── S4.c Responsive / Breakpoints
│   └── S4.d Navigation
├── S5. INTERACTION & MOTION ← Chuyển động, phản hồi
├── S6. COMPONENTS           ← Quy ước sử dụng component
├── S7. ICONOGRAPHY          ← Icon set, sizing, accessibility
├── S8. CONTENT & VOICE      ← Ngôn ngữ, giọng điệu, error messages
├── S9. ACCESSIBILITY        ← WCAG, keyboard, ARIA
├── S10. CODE ORGANIZATION   ← File structure, decomposition rules
└── S11. GOVERNANCE          ← Ownership, versioning, deprecation
```

---

## Yêu cầu chi tiết từng section

### S1. PRINCIPLES — Triết lý thiết kế

| Tiêu chí | Bắt buộc | Mô tả |
|----------|---------|-------|
| Số lượng principles | ≥ 3 | Mỗi principle có tên, mô tả, và tham chiếu heuristic |
| Thứ tự ưu tiên | ✅ | Principles phải xếp theo priority khi xung đột |
| Do / Don't | ✅ | Mỗi principle có ít nhất 1 ví dụ Do và 1 Don't |
| Truy nguồn | ✅ | Tham chiếu Nielsen heuristic hoặc tiêu chuẩn ngành |
| Policy ID | ✅ | Mỗi principle có mã ID duy nhất (VD: `[DS-P1]`) |

**Tham chiếu ngành:** Ant Design (4 Values), Material Design (3 Principles), Carbon (3 Principles).

---

### S2. FOUNDATIONS — Nền tảng kỹ thuật

| Tiêu chí | Bắt buộc | Mô tả |
|----------|---------|-------|
| Tech stack table | ✅ | Framework, Styling, Component lib, Icons, Font, State, Utilities |
| Version numbers | ✅ | Ghi rõ phiên bản chính |

---

### S3. DESIGN TOKENS — Ngôn ngữ thị giác

#### S3.a Color Palette

| Tiêu chí | Bắt buộc |
|----------|---------|
| Semantic token table (name → purpose → class) | ✅ |
| Light + Dark value pairs | ✅ |
| Quy tắc "không dùng raw color" | ✅ |
| Ngoại lệ ghi rõ | ✅ |

#### S3.b Status / Semantic Colors

| Tiêu chí | Bắt buộc |
|----------|---------|
| Bảng mapping: Semantic → Palette → Entity statuses | ✅ |
| Code example ĐÚNG và SAI | ✅ |
| Source of truth file path | ✅ |
| Quy trình thêm status mới | ✅ |

#### S3.c Typography

| Tiêu chí | Bắt buộc |
|----------|---------|
| Type scale table (level → class → usage) | ✅ |
| Tối thiểu 4 levels (Title, Body, Caption, Mono) | ✅ |

#### S3.d Spacing

| Tiêu chí | Bắt buộc |
|----------|---------|
| Base unit declaration | ✅ |
| Context → value → class table | ✅ |
| Page padding rule (BẮT BUỘC cụ thể) | ✅ |

#### S3.e Shape / Radius

| Tiêu chí | Bắt buộc |
|----------|---------|
| Token → value → usage table | ✅ |

#### S3.f Elevation / Shadow

| Tiêu chí | Bắt buộc |
|----------|---------|
| Level → class → usage table | ✅ |
| Tối thiểu 3 levels (None, Medium, High) | ✅ |

#### S3.g Dark Mode / Theming

| Tiêu chí | Bắt buộc |
|----------|---------|
| Toggle mechanism | ✅ |
| Token override table (Light → Dark) | ✅ |
| Shadow rules trong dark mode | ✅ |
| Status color dark mode rules | ✅ |
| Do / Don't | ✅ |

---

### S4. LAYOUT — Bố cục trang

#### S4.a App Shell

| Tiêu chí | Bắt buộc |
|----------|---------|
| ASCII wireframe hoặc diagram | ✅ |
| Component → file mapping | ✅ |

#### S4.b Page Templates

| Tiêu chí | Bắt buộc |
|----------|---------|
| Tối thiểu 3 templates: List, Detail, Form | ✅ |
| Mỗi template có ASCII wireframe | ✅ |
| Component listing cho mỗi template | ✅ |
| Quy tắc bắt buộc có rule ID | ✅ |

#### S4.c Responsive / Breakpoints

| Tiêu chí | Bắt buộc |
|----------|---------|
| Breakpoint table (token → min-width → prefix → purpose) | ✅ |
| Responsive behavior per component | ✅ |
| Mobile-first rule | ✅ |
| Touch target minimum | ✅ |

**Tham chiếu ngành:** Carbon DS 5 breakpoints (sm 320, md 672, lg 1056, xlg 1312, max 1584).

#### S4.d Navigation

| Tiêu chí | Bắt buộc |
|----------|---------|
| Navigation pattern table | ✅ |
| URL/routing convention | ✅ |
| State preservation rules | ✅ |

---

### S5. INTERACTION & MOTION

| Tiêu chí | Bắt buộc |
|----------|---------|
| Transition duration table | ✅ |
| Easing function specs | ✅ |
| Hover & Focus state table | ✅ |
| Loading state patterns | ✅ |
| Max duration rule (enterprise: ≤ 300ms micro-interactions) | ✅ |

**Tham chiếu ngành:** Material Design Motion (Easing: Standard, Decelerate, Accelerate. Duration: 100-500ms).

---

### S6. COMPONENTS — Quy ước component

| Tiêu chí | Bắt buộc |
|----------|---------|
| Quy ước cho: Badge, Button, Dialog/Sheet | ✅ |
| Context → variant/size mapping table | ✅ |
| Khi nào dùng Dialog vs Sheet vs Full Page | ✅ |
| Search pattern variants | ✅ |
| Empty/Loading/Error pattern + import path | ✅ |

**Tham chiếu ngành:** Ant Design Component Catalog (60+ components, mỗi cái có API table).

> **Lưu ý:** Ở scope documentation, liệt kê convention là đủ. Component individual specs chi tiết (anatomy, states, props) thuộc scope Storybook/Figma.

---

### S7. ICONOGRAPHY

| Tiêu chí | Bắt buộc |
|----------|---------|
| Icon library declaration | ✅ |
| Size → class table (tối thiểu 3 sizes) | ✅ |
| Accessibility rule (aria-label) | ✅ |
| Icon + text layout rule | ✅ |

---

### S8. CONTENT & VOICE

| Tiêu chí | Bắt buộc |
|----------|---------|
| Default language declaration | ✅ |
| Error message patterns (≥ 3 types) | ✅ |
| Label & Placeholder conventions | ✅ |
| Quy tắc "không hiện technical error" | ✅ |

**Tham chiếu ngành:** Atlassian Design System — Voice and Tone, Writing Guidelines.

---

### S9. ACCESSIBILITY

| Tiêu chí | Bắt buộc |
|----------|---------|
| WCAG level declaration (≥ AA) | ✅ |
| Color contrast ratios | ✅ |
| Keyboard navigation table | ✅ |
| ARIA requirements table | ✅ |

**Tham chiếu ngành:** WCAG 2.1 AA — 4.5:1 text, 3:1 UI components.

---

### S10. CODE ORGANIZATION

| Tiêu chí | Bắt buộc |
|----------|---------|
| Max file size rule | ✅ |
| Screen decomposition pattern | ✅ |
| Directory tree | ✅ |

---

### S11. GOVERNANCE

| Tiêu chí | Bắt buộc |
|----------|---------|
| Ownership matrix (who owns what) | ✅ |
| Versioning scheme (SemVer) | ✅ |
| Contribution rules | ✅ |
| Deprecation policy | ✅ |
| Compliance checklist | ✅ |

**Tham chiếu ngành:** Carbon DS centralized governance, SemVer, migration guides.

---

## Tiêu chí chất lượng tổng thể

| # | Tiêu chí | Mô tả |
|---|----------|-------|
| Q1 | **Prescriptive, not descriptive** | Tài liệu nói "PHẢI làm X" chứ không phải "hiện tại đang làm X" |
| Q2 | **Traceable** | Mọi quy tắc truy nguồn được tới 1 Principle `[DS-P*]` |
| Q3 | **Actionable** | Developer/AI đọc xong biết chính xác dùng gì, import từ đâu |
| Q4 | **Do / Don't** | Mỗi section quan trọng có ví dụ ĐÚNG và SAI |
| Q5 | **Source of truth** | Ghi rõ file path cho token/utility/component |
| Q6 | **No stale content** | Không có "CẦN TẠO", "CHƯA CÓ" — chỉ ghi cái đã có |
| Q7 | **Version tracked** | Ghi phiên bản ở header |
