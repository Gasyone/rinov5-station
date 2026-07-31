---
version: 1.2
name: RinoEdu-Design-System
description: "A professional, high-density enterprise education management dashboard aesthetic. Built around a clinical HSL light/dark theme utilizing Geist Sans and Geist Mono. The system values structural clarity, strict consistency across all tables and forms, and rigorous safety in destructive actions. Active statuses utilize vibrant HSL semantic badges managed strictly through central helper mapping rather than inline styles."

colors:
  primary: "hsl(195 70% 45%)"
  primary-foreground: "hsl(0 0% 98%)"
  background: "hsl(180 20% 99%)"
  foreground: "hsl(200 15% 18%)"
  card: "hsl(180 20% 100%)"
  card-foreground: "hsl(200 15% 18%)"
  popover: "hsl(180 20% 100%)"
  popover-foreground: "hsl(200 15% 18%)"
  secondary: "hsl(185 15% 95%)"
  secondary-foreground: "hsl(200 15% 18%)"
  muted: "hsl(185 12% 96%)"
  muted-foreground: "hsl(195 5% 45%)"
  accent: "hsl(185 20% 93%)"
  accent-foreground: "hsl(200 15% 18%)"
  destructive: "hsl(0 84.2% 60.2%)"
  destructive-foreground: "hsl(0 0% 98%)"
  border: "hsl(190 12% 85%)"
  input: "hsl(190 12% 85%)"
  ring: "hsl(195 70% 45%)"
  sidebar: "hsl(185 25% 97%)"
  sidebar-foreground: "hsl(200 10% 22%)"
  sidebar-primary: "hsl(195 70% 45%)"
  sidebar-border: "hsl(190 15% 90%)"

colors-dark:
  primary: "hsl(195 70% 52%)"
  primary-foreground: "hsl(200 30% 10%)"
  background: "hsl(200 30% 8%)"
  foreground: "hsl(195 10% 92%)"
  card: "hsl(200 30% 10%)"
  card-foreground: "hsl(195 10% 92%)"
  popover: "hsl(200 30% 10%)"
  popover-foreground: "hsl(195 10% 92%)"
  secondary: "hsl(195 20% 16%)"
  secondary-foreground: "hsl(195 10% 92%)"
  muted: "hsl(195 20% 16%)"
  muted-foreground: "hsl(195 8% 55%)"
  accent: "hsl(195 25% 20%)"
  accent-foreground: "hsl(195 10% 92%)"
  destructive: "hsl(0 63% 31%)"
  destructive-foreground: "hsl(195 10% 92%)"
  border: "hsl(195 25% 20%)"
  input: "hsl(195 25% 20%)"
  ring: "hsl(195 70% 52%)"
  sidebar: "hsl(200 30% 5%)"
  sidebar-foreground: "hsl(195 10% 88%)"
  sidebar-primary: "hsl(195 70% 52%)"
  sidebar-border: "hsl(195 20% 12%)"

typography:
  display-xl:
    fontFamily: Geist Sans
    fontSize: 80px
    fontWeight: 700
    lineHeight: 1.10
    letterSpacing: -2.0px
  display-lg:
    fontFamily: Geist Sans
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -1.5px
  display-md:
    fontFamily: Geist Sans
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: -1.0px
  page-title:
    fontFamily: Geist Sans
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.40
  section-title:
    fontFamily: Geist Sans
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.40
    letterSpacing: 0.5px
    textTransform: uppercase
  body:
    fontFamily: Geist Sans
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
  caption:
    fontFamily: Geist Sans
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.40
  mono:
    fontFamily: Geist Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.50

rounded:
  sm: "2px"
  md: "4px"
  lg: "6px"
  xl: "10px"
  full: "9999px"

spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
  page-padding: "16px px-4 py-3 lg:px-6"
  toolbar-gap: "8px gap-2"
  form-field-gap: "12px gap-3"
  table-cell: "8px p-2"
  card-internal: "16px p-4"

components:
  top-nav:
    backgroundColor: "{colors.background}"
    height: 64px
    borderBottom: "1px solid {colors.border}"
  sidebar:
    backgroundColor: "{colors.sidebar}"
    textColor: "{colors.sidebar-foreground}"
    borderRight: "1px solid {colors.sidebar-border}"
  data-table-header:
    backgroundColor: "hsl(185 12% 96% / 0.5)"
    textColor: "{colors.muted-foreground}"
    fontWeight: 500
  data-table-row:
    hoverBackgroundColor: "hsl(185 12% 96% / 0.5)"
    borderBottom: "1px solid {colors.border}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    fontSize: 14px
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.destructive-foreground}"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.card}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-internal}"
  dialog:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.lg}"
    shadow: "shadow-lg"
  status-badge:
    rounded: "{rounded.full}"
    fontSize: 12px
    fontWeight: 500
    padding: "2px 8px"
---

## 1. Visual Theme & Atmosphere

RinoEdu's visual language is built around **clean enterprise density, geometric alignments, and clinical structure**. It communicates extreme reliability and operational efficiency for education administrators, branch managers, sales agents, and teachers. 

The color scheme relies on soft teal-tinted off-white surfaces (`hsl(180 20% 99%)`) in light mode, lifting slightly onto clinical paper cards (`hsl(180 20% 100%)`). Contrast is maintained in dark mode through a robust dark charcoal canvas (`hsl(200 30% 8%)`) and elevated panels (`hsl(200 30% 10%)`). It actively avoids saturated background gradients, relying instead on clean, high-contrast typography, structural spacing, and razor-sharp 1px boundary rules.

---

## 2. Color Palette & Roles

### 2.1 Brand Accent Colors
* **Primary Teal-Blue** (`{colors.primary}` / `{colors-dark.primary}`): The signature RinoEdu accent used for brand mark highlights, primary call-to-actions (CTAs), focus rings, and link emphasis.
* **Secondary Slate** (`{colors.secondary}` / `{colors-dark.secondary}`): Used for secondary buttons, non-urgent states, and auxiliary controls.
* **Destructive Red** (`{colors.destructive}` / `{colors-dark.destructive}`): Restricted to error dialogs, destructive action buttons (Delete, Resign, Cancel), and critical status highlights.

### 2.2 Centralized Status Mapping
To maintain visual integrity, **status badge colors MUST NEVER be hardcoded inline** (e.g., `bg-emerald-50 text-emerald-700`). All status resolves through `@/lib/statusColors.ts` using `getStatusBadgeClass(status)`.

| Semantic State | Tailwind Palette | Mapped Entity Statuses | Visual Treatment (Light Mode) |
|---|---|---|---|
| **success** | Emerald | `active`, `available`, `approved`, `registered`, `present`, `homework_done`, `mo_khai_giang`, `makeup`, `qc_draft`, `checkin` | 🟢 Green badge with subtle border |
| **info** | Sky | `in_use`, `new`, `on_leave`, `scheduled`, `upcoming`, `online_tutor`, `excused`, `low` | 🔵 Light blue indicator |
| **warning** | Amber | `locked`, `pending`, `probation`, `unassigned_teacher`, `tested`, `seconded`, `late`, `pending_review`, `unpaid`, `medium` | 🟡 Amber/Yellow attention badge |
| **error** | Red | `deactivated`, `failed`, `decommissioned`, `reschedule`, `absent`, `high`, `homework_missing`, `qc_not_met` | 🔴 Saturated red alert badge |
| **neutral** | Zinc | `inactive`, `cancelled`, `draft`, `resigned`, `lost`, `archived`, `no_show`, `planned`, `session_ended` | ⬜ Gray/Neutral baseline badge |
| **purple** | Violet | `interviewed`, `merged`, `trial`, `reserve`, `online`, `assigned_class`, `enroll_later` | 💜 Purple special-event badge |
| **completed** | Cyan | `completed`, `converted`, `graduated`, `awaiting_opening`, `cho_khai_giang`, `dong_lop`, `audited` | 🩵 Cyan completed badge |

---

## 3. Typography Rules

RinoEdu utilizes **Geist Sans** for standard editorial layouts and **Geist Mono** for code tokens, system IDs, serial numbers, and codes. 

### 3.1 Type Hierarchy

| Token Name | Size (px) | Weight | Line Height | Letter Spacing | Ideal Application |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 80px | 700 | 1.10 | -2.0px | Large marketing banners, hero statistics |
| `{typography.display-lg}` | 56px | 600 | 1.15 | -1.5px | Major landing sections |
| `{typography.display-md}` | 40px | 600 | 1.20 | -1.0px | Segmented header openers |
| `{typography.page-title}` | 18px | 600 | 1.40 | Default | Global page header titles |
| `{typography.section-title}` | 14px | 600 | 1.40 | +0.5px (Uppercase) | Grouping cards, filter headers, tabs |
| `{typography.body}` | 14px | 400 | 1.50 | Default | Data-table cell values, forms, sidebars |
| `{typography.caption}` | 12px | 400 | 1.40 | Default | Timestamps, system info helper lines |
| `{typography.mono}` | 12px | 400 | 1.50 | Default | Booking IDs, transaction codes, phone numbers |

### 3.2 Key Rules
1. **Case-Contrast Eyebrows**: Section headers or sub-grouping headers should be uppercase with a slight positive tracking (`letter-spacing`) to differentiate taxonomy from body copy.
2. **Text Contrast**: Ensure a contrast ratio of at least `4.5:1` for standard text and `3:1` for large text elements across both light and dark modes.

---

## 4. Spacing, Shapes, and Elevation

### 4.1 Spacing Scale
RinoEdu is a **data-dense administrative application**. It maintains strict padding scales:
* **Page Outer Container**: `px-4 py-3 lg:px-6` (Mandatory). Outer margins collapse on mobile.
* **Control / Tool Bar Gap**: `gap-2` (8px). Keeps filter selectors and buttons tightly packed.
* **Form Layout Gap**: `gap-3` (12px) between stacked fields.
* **Table Cell Inner Padding**: `p-2` (8px) on table cells to maximize records visible per scroll.
* **Card Interior Padding**: `p-4` (16px) for compact widgets.

### 4.2 Shapes & Radius Mappings
* `{rounded.sm}` (2px): System tags and micro badge indicators.
* `{rounded.md}` (4px): Standard UI buttons, dropdown select menus, and form inputs.
* `{rounded.lg}` (6px): Default cards, dialog overlays, sheets, and elevated boxes.
* `{rounded.xl}` (10px): Media containers, product dashboard visual frames.
* `{rounded.full}` (9999px): Status badges (with circular borders) and employee avatar assets.

### 4.3 Depth & Elevation Ladder

| Level | Styling Treatment | Use Case |
|---|---|---|
| **Level 0 (Flat)** | No shadow, no border. Pure `{colors.background}` fill | Default page body background, data list containers |
| **Level 1 (Paper)** | `{colors.card}` canvas, 1px `{colors.border}` hairline border | Default grid cards, data table cells, list containers |
| **Level 2 (Float)** | 1px border, subtle `shadow-sm` | Search bars with dropdown autocompletes, hover states on cards |
| **Level 3 (Overlay)** | 1px border, deep `shadow-lg`, backdrop-blur overlay | System modals (`Dialog`), sheet slide-outs (`Sheet`) |

---

## 5. Layout Patterns

All pages in RinoEdu MUST conform to these pre-defined patterns to maintain complete structural consistency.

### 5.1 List Page Pattern (`[DS-P2]`)
Ideal for lists and management modules (Students, Classes, Staff, Invoices):
1. **Toolbar Group**: Top-level filters (Branch selector, segmented buttons), search bar (`ExpandableSearch`), and a primary dynamic Add action button (`+`).
2. **Status Tile Summary Bar**: Optional metric summaries (`StatusTiles`) displaying total record counts in real-time.
3. **Data Grid/Table Frame**: A `DataTableFrame` wrapping a dense header column and customizable grid cells. Table cells must support sticky columns on mobile wrappers.
4. **Pagination Footer**: `DataTablePagination` with default size 20 and navigation toggles (`◄ 1 2 3 ►`).

### 5.2 Detail Page Pattern (`[DS-P2]`)
Ideal for focused viewing and management of complex entities (Student details, Branch detail, HR Employee):
1. **Header Action Strip**: Left-aligned Ghost Back Button (`← Quay lại`), bold Title, dynamic Status Badge, and primary action items right.
2. **Tabbed Content Navigation**: Horizontal `Tabs` list containing logical categories. Tabs **must not** mutate page URL paths.
3. **Structured Information Layout**: Information within tabs is structured inside `Panel` containers utilizing two-column stacked `InfoField` elements (Label top, Value bottom).

### 5.3 Form & Dialog Pattern (`[DS-P1]`)
* **Stacked Form Design**: Field labels must sit **above** inputs, never inline left.
* **Inline validation**: Error messages must appear directly under inputs in `text-destructive text-xs` style.
* **Destructive Safe-Guards**: Actions that delete, resign, disable, or cancel MUST be triggered through a confirmation overlay (`ConfirmDialog` wrapping shadcn `AlertDialog`) requiring an active user confirmation.

---

## 6. Shared Components Reference Catalog

Developers and AI agents MUST import components from the centralized barrels instead of deep-importing custom blocks.

### 6.1 Central Shared Primitives (`@/components/shared`)
* **`<EmptyState />`**: Standard placeholder shown when lists, search results, or tables are completely empty.
* **`<ModuleLoadingSkeleton />`**: Centrally structured skeleton loading state for tables and lists.
* **`<ErrorState />`**: Pre-styled error display offering clear troubleshooting text and a "Retry" CTA.
* **`<PageHeader />`**: Orchestrator header displaying title, code tags, and primary options.
* **`<BackButton />`**: Pre-styled ghost chevron left link to navigate back to list screens.
* **`<ConfirmDialog />`**: The safety gate wrapper for all destructive actions.

### 6.2 Central Toolbar & Grid Controls (`@/components/controls`)
* **`<ExpandableSearch />`**: Auto-debounced (300ms) text search bar.
* **`<SegmentedControl />`**: Pill-based multi-option selection button.
* **`<InlineSelect />`**: Stacked select box for fast form values.
* **`<BranchSelect />`**: Central branch office filter selector.

---

## 7. Do's and Don'ts

### Do
* ✅ **DO** use `getStatusBadgeClass(status)` to map all entity statuses.
* ✅ **DO** verify that your components have separate files for types and helpers if code exceeds 300 lines.
* ✅ **DO** ensure the interface remains responsive down to 320px screen width.
* ✅ **DO** use a minimum `44px` touch target size on mobile layouts.
* ✅ **DO** utilize central components (EmptyState, ErrorState) for loading or empty edge cases.

### Don't
* ❌ **DON'T** write raw inline tailwind colors (e.g., `bg-emerald-500`) for text or borders inside screens.
* ❌ **DON'T** allow a component file to exceed **800 lines** under any circumstances (decompose screens early).
* ❌ **DON'T** trigger destructive actions (Delete, Cancel) directly through an `onClick` without a `ConfirmDialog`.
* ❌ **DON'T** use technical logs, stack traces, or raw database keys on user-facing error boundaries.
* ❌ **DON'T** include tailwind styling strings inside backend mock schemas (`src/mocks/*`).
