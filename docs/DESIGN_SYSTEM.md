# RinoEdu Design System

> **Phiên bản:** 1.2  
> **Vị trí:** Ngang hàng `ENTERPRISE_STANDARDS.md` — là "hiến pháp" của mặt giao diện.  
> **Đối tượng:** AI Agent, Developer, Designer, QA.  
> **Tiêu chuẩn tham chiếu:**
> - Ant Design System — Enterprise admin pattern (Natural, Certain, Meaningful, Growing)
> - Nielsen's 10 Usability Heuristics — Interaction design
> - WCAG 2.1 AA — Accessibility baseline
> - Material Design 3 — Token architecture

---

## 1. Design Principles (Triết lý Thiết kế)

Mọi quyết định UI/UX trong RinoEdu PHẢI tuân thủ 5 nguyên tắc sau, xếp theo thứ tự ưu tiên:

### `[DS-P1]` Clarity First — Rõ ràng trên hết

> **Nielsen #2, #8:** Match real world + Minimalist design.

- Giao diện phải tự giải thích. Người dùng (Sale, CSM, Giáo viên) không cần training để hiểu màn hình.
- Dùng ngôn ngữ nghiệp vụ, KHÔNG dùng thuật ngữ kỹ thuật. VD: "Trạng thái" thay vì "Status enum", "Nhóm quyền" thay vì "Role".
- Mỗi màn hình chỉ phục vụ **1 mục đích chính**. Nếu có 2 mục đích → tách thành 2 tab hoặc 2 page.

**Do:**
- Tiêu đề rõ ràng: "Danh sách Tài khoản", "Tạo Person mới"
- Trạng thái có màu sắc + text rõ nghĩa: 🟢 Active, 🟡 Locked, 🔴 Deactivated

**Don't:**
- Không dùng icon không có label (trừ toolbar actions đã quen thuộc như 👁✏🗑)
- Không hiển thị ID kỹ thuật (UUID) trên giao diện — dùng mã ngắn (VD: `PER-001`)

---

### `[DS-P2]` Consistency — Nhất quán xuyên suốt

> **Nielsen #4:** Consistency and Standards.

- Cùng 1 hành động → cùng 1 pattern trên MỌI màn hình.
- Cùng 1 trạng thái → cùng 1 màu badge trên MỌI entity.
- Cùng 1 layout → mọi list screen trông giống nhau.

**Quy tắc cụ thể:**
- Status colors: LUÔN dùng `@/lib/statusColors.ts` — xem §3.2.
- List Page: LUÔN theo pattern Toolbar → Tiles → Table → Footer — xem §4.2.
- Empty/Loading/Error: LUÔN dùng `@/components/shared/` — xem §6.5.
- Page padding: LUÔN `px-4 py-3 lg:px-6` — không tự đặt.

**Do:**
- Mọi list screen dùng cùng toolbar layout, cùng pagination footer.
- Status badge "Active" luôn là Emerald ở mọi nơi (Person, Account, Device).

**Don't:**
- Không tự chế layout mới cho list screen — dùng §4.2.
- Không đặt pagination style khác nhau giữa các module.

---

### `[DS-P3]` Efficiency — Hiệu quả thao tác

> **Nielsen #7:** Flexibility and Efficiency of Use.

- User thường xuyên (Sale, CSM) phải hoàn thành task trong **ít click nhất**.
- Hỗ trợ power user: keyboard shortcuts, bulk actions, quick search.
- Hiển thị thông tin quan trọng nhất ở vị trí dễ thấy nhất (góc trên trái).

**Do:**
- Search debounce 300ms — không bắt user bấm Enter.
- Filter giữ trạng thái trong session — không reset khi navigate.
- Row click → mở chi tiết ngay — không bắt chọn rồi bấm "Xem".

**Don't:**
- Không bắt user click "Search" button — debounce tự động.
- Không thêm bước trung gian khi 1 click đã đủ.

---

### `[DS-P4]` Safety — An toàn thao tác

> **Nielsen #3, #5:** User control + Error prevention.

- Hành động phá hủy (Xóa, Khóa, Hủy) → BẮT BUỘC confirm dialog.
- Cho phép Undo khi có thể (VD: soft-delete → có thể khôi phục).
- Không cho submit form khi data chưa valid — disable nút, hiện lỗi inline.

**Do:**
- "Khóa tài khoản" → AlertDialog xác nhận + lý do.
- Form submit button disabled khi required fields chưa fill.

**Don't:**
- Không xóa trực tiếp khi click — phải có bước confirm.
- Không cho submit form rỗng rồi hiện lỗi sau.

---

### `[DS-P5]` Feedback — Phản hồi kịp thời

> **Nielsen #1:** Visibility of System Status.

- Mọi hành động phải có phản hồi tức thì (loading → success/error).
- Trạng thái hệ thống phải luôn nhìn thấy (badge, progress, timestamp).
- Lỗi phải mô tả rõ ràng + gợi ý cách sửa.

**Do:**
- Submit → Loading spinner trên button → Toast success/error.
- Validation → Lỗi inline dưới field ngay khi onBlur.
- API error → `<ErrorState />` với nút Retry.

**Don't:**
- Không để user click submit mà không thấy gì xảy ra.
- Không hiện error chung chung "Error" — phải mô tả cụ thể.

---

## 2. Nền tảng Kỹ thuật

| Hạng mục | Giá trị |
|----------|---------|
| Framework | Next.js 16 + React 19 + TypeScript 5 |
| Styling | Tailwind CSS v4 + CSS Variables (`globals.css`) |
| Component Library | shadcn/ui — New York style |
| Icons | lucide-react (24px grid, stroke-width 2) |
| Font | Geist Sans (sans), Geist Mono (mono) |
| Theme | Light / Dark (class `.dark` trên `<html>`) |
| State | Zustand |
| Toast | sonner |
| Utility | `cn()` from `@/lib/utils` (clsx + twMerge) |

---

## 3. Design Tokens

> **Tiêu chuẩn:** Material Design 3 Token Architecture — Primitive → Semantic → Component.

### 3.1. Color Palette (Semantic Tokens)

Được định nghĩa trong `src/app/globals.css`. Mỗi token có cặp Light/Dark.

| Token | Light | Dark | Mục đích |
|-------|-------|------|----------|
| `--background` / `--foreground` | `hsl(0 0% 100%)` / `hsl(222 10% 15%)` | `hsl(222 47% 8%)` / `hsl(210 10% 94%)` | Nền + text toàn app |
| `--primary` / `--primary-foreground` | `hsl(221 83% 53%)` / `hsl(210 40% 98%)` | `hsl(217 91% 60%)` / `hsl(222 47% 11%)` | CTA, link, focus ring |
| `--muted` / `--muted-foreground` | `hsl(210 8% 96%)` / `hsl(215 4% 48%)` | `hsl(217 37% 18%)` / `hsl(215 10% 60%)` | Nền phụ, text phụ |
| `--accent` / `--accent-foreground` | `hsl(210 8% 92%)` / `hsl(222 10% 15%)` | `hsl(217 37% 22%)` / `hsl(210 10% 94%)` | Hover, active state |
| `--destructive` / `--destructive-foreground` | `hsl(0 84% 60%)` / `hsl(0 0% 98%)` | `hsl(0 63% 31%)` / `hsl(0 86% 97%)` | Xóa, lỗi, hủy |
| `--card` / `--card-foreground` | `hsl(0 0% 100%)` / `hsl(222 10% 15%)` | `hsl(222 47% 11%)` / `hsl(210 10% 94%)` | Card, dialog |
| `--border` | `hsl(214 10% 82%)` | `hsl(217 37% 22%)` | Border bảng, card, input |

**Quy tắc:**
- KHÔNG dùng Tailwind raw color (`bg-blue-500`) cho nền, text, border chính. `[DS-P2]`
- LUÔN dùng semantic token (`bg-primary`, `text-foreground`, `border-border`). `[DS-P2]`
- Ngoại lệ duy nhất: Status Colors (§3.2) — dùng Tailwind palette qua `statusColors.ts`.

### 3.2. Status Colors

> **Source of Truth:** `src/lib/statusColors.ts`

| Semantic | Palette | Entity statuses | Ý nghĩa |
|----------|---------|----------------|---------|
| `success` | Emerald | `active`, `available`, `approved`, `checkin` | ✅ Tích cực |
| `info` | Sky | `in_use`, `in_progress` | 🔵 Đang xử lý |
| `warning` | Amber | `locked`, `pending`, `maintenance` | ⚠️ Cần chú ý |
| `error` | Red | `deactivated`, `failed`, `rejected` | ❌ Nghiêm trọng |
| `neutral` | Zinc | `inactive`, `cancelled`, `draft` | ⬜ Trung tính |
| `purple` | Violet | `interviewed`, `merged` | 💜 Đặc biệt |
| `completed` | Cyan | `completed` | 🩵 Hoàn tất |

```tsx
// ✅ ĐÚNG
import { getStatusBadgeClass } from '@/lib/statusColors'
<Badge className={getStatusBadgeClass(entity.status)}>{label}</Badge>

// ❌ SAI — vi phạm [DS-P2] Consistency
<Badge className="bg-emerald-50 text-emerald-700">Active</Badge>
```

**Thêm status mới:** Thêm vào `ENTITY_STATUS_MAP` trong `statusColors.ts`, KHÔNG hardcode ở screen.

> [!NOTE]
> **Nhãn tag buổi học (Session Milestone Tags):** Các nhãn cột mốc tiến trình của học viên như `buoi_1`, `buoi_2`, `buoi_3`, `buoi_cuoi` được đăng ký màu sắc trong `statusColors.ts` để tối ưu hóa khả năng tái sử dụng. Tuy nhiên, đây là **nhãn tag buổi học** phản ánh tiến trình học tại thời điểm cụ thể, **không phải là trạng thái thực thể (entity status)** chính thức của học viên. Tránh nhầm lẫn khi thiết lập tài liệu nghiệp vụ hoặc cơ sở dữ liệu.

### 3.3. Typography

| Level | Class | Khi nào dùng |
|-------|-------|-------------|
| Page Title | `text-lg font-semibold` | Tiêu đề trang (nếu cần hiện rõ) |
| Section Title | `text-sm font-semibold uppercase tracking-wider text-muted-foreground` | Label group, filter header |
| Body | `text-sm` (14px) | Mọi text trong bảng, form, card |
| Caption | `text-xs text-muted-foreground` | Timestamp, ID, helper text |
| Mono | `font-mono text-xs` | Booking code, serial number |

### 3.4. Spacing

> **Tiêu chuẩn:** Base unit 4px (Tailwind default). Ant Design dùng 8px.

| Context | Giá trị | Class |
|---------|---------|-------|
| Page padding | 16px / 24px (lg) | `px-4 py-3 lg:px-6` **(BẮT BUỘC)** |
| Toolbar gap | 8px | `gap-2` |
| Form field gap | 12px | `gap-3` |
| Table cell | 8px | `p-2` |
| Card internal | 16px | `p-4` |

### 3.5. Border Radius

| Token | Giá trị | Dùng cho |
|-------|---------|----------|
| `--radius` (base) | `0.6rem` | shadcn default |
| Buttons, inputs | `rounded-md` | Hầu hết controls |
| Badges | `rounded-full` | Status badge, avatar |
| Cards, dialogs | `rounded-lg` | Container |

### 3.6. Shadows

| Level | Class | Dùng cho |
|-------|-------|----------|
| None | — | Bảng, content area (flat design) |
| Subtle | `shadow-xs` | Expanded search bar |
| Medium | `shadow-md` | Avatar, user menu card |
| Dialog | `shadow-lg` | Dialog, Sheet overlay |

### 3.7. Dark Mode

> **Cơ chế:** Class-based toggling (`.dark` trên `<html>`) qua `useUIStore`.

**Quy tắc token override:**

| Token | Light | Dark | Ghi chú |
|-------|-------|------|---------|
| `--background` | `hsl(0 0% 100%)` | `hsl(222 47% 8%)` | Nền đậm, không đen tuyệt đối |
| `--foreground` | `hsl(222 10% 15%)` | `hsl(210 10% 94%)` | Text sáng, không trắng tuyệt đối |
| `--card` | `hsl(0 0% 100%)` | `hsl(222 47% 11%)` | Card nhô nhẹ so với background |
| `--border` | `hsl(214 10% 82%)` | `hsl(217 37% 22%)` | Border tối hơn |
| `--muted` | `hsl(210 8% 96%)` | `hsl(217 37% 18%)` | Table header, toolbar nền |

**Quy tắc shadow trong Dark Mode:**
- Shadow `shadow-xs`, `shadow-md` → gần như invisible trong dark mode — chấp nhận được.
- Dialog overlay → dùng `bg-black/80` (dark) thay vì `bg-black/50` (light) để tăng tương phản.
- KHÔNG dùng drop-shadow trắng/sáng trong dark mode.

**Quy tắc Status Colors trong Dark Mode:**
- `statusColors.ts` đã có dark mode classes (`dark:border-*-800 dark:bg-*-950 dark:text-*-400`).
- Badge text trong dark mode dùng shade `400` (sáng hơn) thay vì `700` (tối) để đảm bảo contrast.

**Do / Don't:**
- ✅ Kiểm tra mọi text-on-background đạt contrast ratio ≥ 4.5:1 trong cả 2 mode.
- ❌ KHÔNG hardcode `text-white` hoặc `bg-black` — luôn dùng semantic token.
- ❌ KHÔNG giả định user dùng light mode — test cả 2.

---

## 4. Layout Patterns

### 4.1. App Shell

```
┌──────────────────────────────────────────┐
│ HeaderBar (h-16, sticky, backdrop-blur)  │
├──────────┬───────────────────────────────┤
│ Sidebar  │ Content Area                  │
│ (collap- │ (flex-1, overflow-auto)       │
│  sible)  │ ← Screen component ở đây     │
└──────────┴───────────────────────────────┘
```

| Component | File | Chức năng |
|-----------|------|-----------|
| `HeaderBar` | `layout/HeaderBar.tsx` | Logo, Search, Settings, Notifications, User Menu |
| `SidebarNav` | `layout/SidebarNav.tsx` | Navigation groups, collapsible |
| `MainLayout` | `layout/MainLayout.tsx` | Orchestrator shell |

### 4.2. List Page Pattern ⭐

> Pattern cho **~60% màn hình** — Bắt buộc tuân thủ cho mọi danh sách.

```
┌─ Toolbar ────────────────────────────────┐
│ [Segment] [Select]    [Search][Filter][+]│
├─ Status Tiles ───────────────────────────┤
│ [All:120] [Active:80] [Pending:30] ...   │
├─ DataTableFrame ─────────────────────────┤
│ ☐ │ Col1    │ Col2   │ Status │ Actions  │
│ ☐ │ data    │ data   │ Badge  │ [👁][✏] │
├─ Footer ─────────────────────────────────┤
│ Showing 120 records   [20/page] [◄ 1 ►] │
└──────────────────────────────────────────┘
```

**Quy tắc bắt buộc:**

| # | Quy tắc | Lý do (Principle) |
|---|---------|-------------------|
| L1 | Page size mặc định: **20**, options `[20, 50, 100]` | `[DS-P2]` Consistency |
| L2 | Table header: `bg-muted/50 font-medium whitespace-nowrap` | `[DS-P2]` |
| L3 | Row hover: `hover:bg-muted/50` | `[DS-P5]` Feedback |
| L4 | Sticky columns cho bảng rộng (Checkbox left-0, Col1 left-12) | `[DS-P3]` Efficiency |
| L5 | Row click → mở chi tiết | `[DS-P3]` Efficiency |
| L6 | Empty state dùng `<EmptyState />` | `[DS-P2]` Consistency |
| L7 | Status badge dùng `getStatusBadgeClass()` | `[DS-P2]` Consistency |

### 4.3. Detail Page Pattern

```
┌─ Header ─────────────────────────────────┐
│ [← Back] Entity Name       [Edit] [Act] │
│ Badge: Active  │  ID: PER-001            │
├─ Tabs ───────────────────────────────────┤
│ [Thông tin] [Liên lạc] [Household] [Log] │
├─ Tab Content ────────────────────────────┤
│ Nội dung tùy theo tab                    │
└──────────────────────────────────────────┘
```

**Components:** `Button` (back), `Badge` (status), `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` (shadcn), `Card`.

**Quy tắc bắt buộc:**

| # | Quy tắc | Principle |
|---|---------|----------|
| D1 | Back button dùng `variant="ghost"` với icon `ChevronLeft` | `[DS-P3]` Efficiency |
| D2 | Entity name + status badge ở header, luôn visible | `[DS-P1]` Clarity |
| D3 | ID hiển thị dạng mã ngắn (`PER-001`), KHÔNG UUID | `[DS-P1]` Clarity |
| D4 | Tab không thay đổi URL | `[DS-P2]` Consistency |
| D5 | Tab đầu tiên là thông tin chính (overview) | `[DS-P1]` Clarity |

### 4.4. Form Pattern

| Loại | Component | Khi nào |
|------|-----------|--------|
| Đơn giản (< 5 fields) | `Dialog` | Quick Contact, Gán Label |
| Trung bình (5-10 fields) | `Sheet` side=right | Tạo Booking, Tạo User |
| Phức tạp (wizard) | Full page + Tabs | Tạo Person + Contact |

**Quy tắc form:**

| # | Quy tắc | Principle |
|---|---------|-----------|
| F1 | Label ở **trên** field (stack), KHÔNG bên trái | `[DS-P1]` Clarity |
| F2 | Validation lỗi hiển thị dưới field: `text-destructive text-xs` | `[DS-P5]` Feedback |
| F3 | Submit ở footer Dialog/Sheet hoặc cuối form | `[DS-P2]` Consistency |
| F4 | Destructive submit → `AlertDialog` confirm | `[DS-P4]` Safety |
| F5 | Mỗi form chỉ **1 primary button** | `[DS-P1]` Clarity |

### 4.5. Responsive & Breakpoints

> **Tiêu chuẩn:** Carbon DS dùng 5 breakpoints. RinoEdu dùng Tailwind v4 default (tương đương).

**Breakpoint table:**

| Token | Min-width | Tailwind prefix | Mục đích |
|-------|----------|----------------|----------|
| Mobile | 0px | (default) | Sidebar ẩn, single-column |
| Small | 640px | `sm:` | Search expand, form 2-col bắt đầu |
| Medium | 768px | `md:` | Sidebar overlay, table scroll ngang |
| Large | 1024px | `lg:` | Sidebar persistent, page padding tăng |
| XL | 1280px | `xl:` | Toolbar full row, table full columns |
| 2XL | 1536px | `2xl:` | Max content width, wide table |

**Responsive rules theo component:**

| Component | Mobile (< 768px) | Tablet (768-1023px) | Desktop (≥ 1024px) |
|-----------|-----------------|--------------------|--------------------|  
| **Sidebar** | Ẩn, mở bằng hamburger | Overlay khi mở | Persistent, collapsible |
| **HeaderBar** | Logo + hamburger + user | + Search icon | + Full search + notifications |
| **Data Table** | Scroll ngang, ẩn cột phụ | Scroll ngang, hiện thêm cột | Full columns, sticky columns |
| **Toolbar** | Stack dọc (wrap) | 1 row, search collapse | 1 row, search expand |
| **Dialog** | Full-screen (`max-w-full`) | `max-w-lg` centered | `max-w-lg` centered |
| **Sheet** | Full-width bottom | Side right `w-96` | Side right `w-[480px]` |
| **Status Tiles** | Scroll ngang | 1 row | 1 row |
| **Form** | 1 column | 2 columns | 2 columns |
| **Pagination** | Page numbers ẩn, chỉ ◄► | Hiện 3 pages | Hiện 5 pages |

**Quy tắc bắt buộc:**
- `[R1]` Mobile-first: viết style mobile trước, dùng `md:` / `lg:` để mở rộng.
- `[R2]` Table PHẢI có `overflow-x-auto` container — KHÔNG bao giờ truncate data.
- `[R3]` Touch target tối thiểu **44px** trên mobile (`[DS-P4]` Safety + WCAG).
- `[R4]` Toolbar buttons trên mobile dùng icon-only, tooltip cho label.

### 4.6. Navigation Patterns

| Pattern | Component | Behavior |
|---------|-----------|----------|
| **Sidebar Navigation** | `SidebarNav` | Groups, collapsible, active highlight, 60+ menu items |
| **Breadcrumb** | Không dùng | App dùng flat menu → breadcrumb không cần |
| **Back button** | `Button` variant=ghost | Chỉ dùng trong Detail Page (← Quay lại danh sách) |
| **Deep link** | URL = `/app/{menuId}` | Mỗi screen có URL duy nhất, bookmarkable |
| **Tab navigation** | `Tabs` (shadcn) | Trong Detail Page, KHÔNG thay đổi URL |

**Quy tắc:**
- `[N1]` Sidebar active item = `menuId` hiện tại trong URL.
- `[N2]` Navigate giữa screens → KHÔNG mất filter/search state (trừ khi khác module).
- `[N3]` Detail page → Back button quay về list page + giữ scroll position.

---

## 5. Interaction & Motion

### 5.1. Transitions

| Context | Duration | Easing | Class |
|---------|----------|--------|-------|
| Hover state | 150ms | ease-out | `transition-colors` |
| Expand/collapse | 200ms | ease-in-out | `transition-[width,height]` |
| Dialog enter | 200ms | ease-out | shadcn default |
| Toast appear | 300ms | spring | sonner default |

**Quy tắc:**
- KHÔNG dùng animation > 300ms cho micro-interactions. `[DS-P3]` Efficiency
- KHÔNG dùng bounce/elastic cho enterprise UI — cảm giác không chuyên nghiệp. `[DS-P1]` Clarity
- Sidebar collapse: `transition-[width] duration-200`. `[DS-P5]` Feedback

### 5.2. Hover & Focus

| Element | Hover | Focus |
|---------|-------|-------|
| Button | `hover:bg-primary/90` | `focus-visible:ring-2 ring-ring` |
| Table Row | `hover:bg-muted/50` | — |
| Icon Button | `hover:bg-accent hover:text-foreground` | `focus-visible:ring-2` |
| Input | — | `focus:ring-2 ring-ring` |

### 5.3. Loading States

| Tình huống | Pattern | Duration |
|-----------|---------|----------|
| Page load | `<ModuleLoadingSkeleton />` | Cho đến khi data ready |
| Button submit | Spinner trong button + disabled | Cho đến khi response |
| Inline update | Opacity 0.5 trên element | 0-2 giây |

---

## 6. Component Conventions

### 6.1. Badge

| Mục đích | Cách dùng |
|----------|-----------|
| Status entity | `<Badge className={getStatusBadgeClass(status)}>` |
| Label/Tag | `<Badge variant="outline">` |
| Count | `<Badge variant="secondary">` |

### 6.2. Button

| Context | Size | Variant |
|---------|------|---------|
| Toolbar CTA | `sm` | `default` (primary) |
| Row action | `icon-sm` | `ghost` hoặc `outline` |
| Dialog submit | `default` | `default` |
| Dialog cancel | `default` | `outline` |
| Destructive | `default` | `destructive` |
| Pagination | `icon-sm` | `outline` |

### 6.3. Dialog vs Sheet vs Page

| Khi nào | Component | Ví dụ |
|---------|-----------|-------|
| Form < 5 fields | `Dialog` | Quick Contact |
| Detail read-heavy | `Sheet` right | Booking Detail |
| Form wizard | Full page | Tạo Person |
| Filter panel | `Sheet` right | Bộ lọc |

### 6.4. Search

| Pattern | Component | Behavior |
|---------|-----------|----------|
| Global | Header Search | Expand on hover/focus |
| List | `ExpandableSearch` | Debounce 300ms |
| Autocomplete | `Command` (shadcn) | Dropdown + click chọn |

### 6.5. Empty, Loading & Error

| State | Component | Import |
|-------|-----------|--------|
| Empty | `<EmptyState />` | `@/components/shared` |
| Loading | `<ModuleLoadingSkeleton />` | `@/components/shared` |
| Error | `<ErrorState />` | `@/components/shared` |

**KHÔNG tự viết inline empty/loading/error.** Luôn dùng shared components.

---

## 7. Iconography

> **Thư viện:** lucide-react — MIT license, 24px grid, stroke-width 2.

| Context | Size Class | Ví dụ |
|---------|-----------|-------|
| Toolbar button | `h-4 w-4` | Search, Filter, Plus |
| Icon button (header) | `h-5 w-5` | Settings, Bell, Logout |
| Empty state | `h-7 w-7` | Inbox illustration |
| Status dot | `h-2 w-2 rounded-full` | Dot indicator |

**Quy tắc:**
- Icon đơn lẻ (không có text) → PHẢI có `aria-label`. (WCAG 2.1 — §9.3)
- Icon + text → icon ở bên trái, `gap-2`. `[DS-P2]` Consistency
- KHÔNG dùng emoji thay icon trong UI production (chỉ dùng trong docs). `[DS-P1]` Clarity
- Icon cùng context PHẢI dùng cùng size — không mix `h-4` và `h-5` trong 1 toolbar. `[DS-P2]`

---

## 8. Content & Voice (Nội dung & Giọng điệu)

> **Tiêu chuẩn:** Nielsen #2 — Match between system and real world.

### 8.1. Ngôn ngữ

- UI mặc định của các màn nghiệp vụ: **Tiếng Việt có dấu đầy đủ**.
- Màn đăng nhập có thể hỗ trợ thêm English, Tiếng Việt, 中文 theo nhu cầu demo.
- Tiếng Việt PHẢI có dấu đầy đủ — không viết tắt ("Khong tim thay" ❌ → "Không tìm thấy" ✅).

### 8.2. Error Messages

| Loại | Pattern | Ví dụ |
|------|---------|-------|
| Validation | "[Field] [vấn đề]" | "Email không đúng định dạng" |
| Not found | "Không tìm thấy [gì]" | "Không tìm thấy kết quả phù hợp" |
| Permission | "Bạn không có quyền [gì]" | "Bạn không có quyền truy cập module này" |
| Server error | "Đã xảy ra lỗi. Vui lòng thử lại." | Generic fallback |

**Quy tắc:**
- KHÔNG hiện technical error (stack trace, HTTP status code).
- LUÔN gợi ý hành động tiếp theo (retry, liên hệ admin).

### 8.3. Labels & Placeholders

| Element | Convention | Ví dụ |
|---------|-----------|-------|
| Label | Ngắn gọn, viết hoa chữ đầu | "Họ và tên", "Ngày sinh" |
| Placeholder | Gợi ý format hoặc ví dụ | "VD: nguyenvana@email.com" |
| Button | Động từ + danh từ | "Tạo tài khoản", "Lưu thay đổi" |
| Empty state | Mô tả + CTA | "Chưa có dữ liệu. Bắt đầu bằng cách [tạo mới]." |

---

## 9. Accessibility

> **Tiêu chuẩn:** WCAG 2.1 Level AA.

### 9.1. Color Contrast

| Element | Minimum ratio |
|---------|--------------|
| Body text | 4.5:1 |
| Large text (≥18px bold) | 3:1 |
| UI components (border, icon) | 3:1 |
| Status badge text | 4.5:1 (đã đảm bảo trong statusColors.ts) |

**Quy tắc:** KHÔNG dùng color alone để truyền đạt ý nghĩa — luôn kèm text hoặc icon.

### 9.2. Keyboard Navigation

| Element | Keyboard |
|---------|----------|
| Button, Link | `Tab` focus, `Enter`/`Space` activate |
| Dialog | `Escape` đóng, `Tab` trap bên trong |
| Dropdown | `Arrow Up/Down` navigate, `Enter` chọn |
| Table row | `Tab` đến row actions |

### 9.3. ARIA

| Tình huống | Requirement |
|-----------|-------------|
| Icon button không có text | `aria-label` bắt buộc |
| Dialog | `aria-labelledby` trỏ đến title |
| Status badge | `role="status"` nếu dynamic |
| Loading skeleton | `aria-busy="true"` |

---

## 10. File & Code Organization

### 10.1. Screen Decomposition (MAX 300 dòng)

```
src/components/screens/
└── booking-test/
    ├── BookingTestScreen.tsx       ← Orchestrator (≤ 300 dòng)
    ├── BookingTestToolbar.tsx      ← Toolbar + filters
    ├── BookingTestTable.tsx        ← Table rendering
    ├── BookingTestDetailDialog.tsx ← Chi tiết
    ├── BookingTestCreateDialog.tsx ← Tạo mới
    ├── bookingTestHelpers.ts      ← Pure functions
    └── bookingTestTypes.ts        ← Types & constants
```

### 10.2. Component Directory & Reusable Catalog

```
src/
├── components/
│   ├── ui/           ← shadcn/ui (42 files). KHÔNG SỬA.
│   ├── layout/       ← HeaderBar, HeaderBrand, SidebarNav, MainLayout
│   ├── shared/       ← Cross-cutting primitives (xem bảng dưới)
│   ├── controls/     ← Toolbar controls (xem bảng dưới)
│   ├── data-table/   ← DataTableFrame, DataTablePagination
│   ├── filters/      ← FilterSheetPanel, FilterClearAllButton
│   └── screens/      ← Screen components (per menuId hoặc folder)
├── lib/
│   ├── utils.ts      ← cn()
│   └── statusColors.ts ← Status → color mapping
└── app/
    └── globals.css   ← CSS Variables (Design Tokens)
```

**`@/components/shared` (barrel — luôn ưu tiên import từ đây):**

| Component | Mục đích | Spec |
|-----------|----------|------|
| `EmptyState` | Bảng rỗng, no-result | §6.5 |
| `ModuleLoadingSkeleton` | Loading toolbar + table | §6.5 |
| `ErrorState` | Lỗi fetch + retry | §6.5 |
| `StatusBadge` | Status badge với dot tuỳ chọn | §3.2, §6.1 |
| `StatusTiles` | Hàng tile filter theo status | §4.2 |
| `FieldLabel` | Stacked form label + input | §4.4 F1 |
| `InfoField` | Read-only label/value cho Detail Page | §4.3 |
| `Panel` | Detail Page section header + content | §4.3 |
| `PageHeader` | Title + status + code + actions | §4.3 D2-D3 |
| `BackButton` | Ghost + ChevronLeft cho Detail Page | §4.3 D1 |
| `ConfirmDialog` | AlertDialog wrapper cho destructive actions | §4.4 F4, [DS-P4] |
| `MetricTile` | KPI tile cho Dashboard | — |

**`@/components/controls` (barrel):** `SegmentedControl`, `ToolbarSelect`, `BranchSelect`, `InlineSelect`, `IconActionButton`, `FilterIconButton`, `ExpandableSearch`.

**`@/components/data-table` (barrel):** `DataTableFrame`, `DataTablePagination`, `DEFAULT_PAGE_SIZE`, `DEFAULT_PAGE_SIZE_OPTIONS`.

**`@/components/filters` (barrel):** `FilterSheetPanel`, `FilterClearAllButton`.

**`@/components/layout` (barrel):** `HeaderBar`, `HeaderBrand`, `SidebarNav`, `MainLayout`.

**Quy tắc bắt buộc:**
- `[CAT-1]` Luôn import qua barrel: `from '@/components/shared'` thay vì deep path.
- `[CAT-2]` Trước khi viết inline `<Card>` + state + value + trend, kiểm tra catalog xem có shared component chưa.
- `[CAT-3]` Mock files (`src/mocks/*`) **không được** export Tailwind class strings — chỉ DATA. Mọi `type`/`status` cần màu phải có entry trong `ENTITY_STATUS_MAP`.

---

## 11. Governance (Quản trị Design System)

> **Tiêu chuẩn:** Carbon DS centralized governance + SemVer versioning.

### 11.1. Ownership

| Hạng mục | Ai sở hữu | Ai được sửa |
|----------|-----------|-------------|
| `DESIGN_SYSTEM.md` | Product Owner | PO hoặc AI Agent (có review) |
| `globals.css` (Tokens) | Frontend Lead | Frontend Lead |
| `statusColors.ts` | Frontend Lead | AI Agent (nếu thêm status mới) |
| `components/ui/` | shadcn/ui upstream | **KHÔNG SỬA** — chỉ override qua class |
| `components/shared/` | Frontend Lead | AI Agent (có review) |
| `components/screens/` | Developer/AI Agent | Tự quản, tuân thủ DS |

### 11.2. Versioning

- Design System dùng **SemVer** (Major.Minor).
- **Major** (2.0): Thay đổi Design Principles, đổi component library, đổi color system.
- **Minor** (1.1): Thêm pattern, thêm status color, thêm component convention.
- Ghi version ở đầu file (`Phiên bản: 1.0`).

### 11.3. Contribution Rules

| Hành động | Quy trình |
|-----------|-----------|
| Thêm status color mới | Thêm vào `ENTITY_STATUS_MAP` trong `statusColors.ts` + update §3.2 |
| Thêm shared component mới | Tạo trong `components/shared/` + export trong `index.ts` + update DS |
| Thêm layout pattern mới | Document trong §4 + tạo ví dụ screen |
| Đổi design token | Update `globals.css` + update §3.1 + test cả Light/Dark |
| Đổi Design Principle | **Major version bump** + PO approval |

### 11.4. Deprecation

- Pattern deprecated phải ghi rõ trong DS: `⚠️ DEPRECATED — dùng [pattern mới] thay thế`.
- Giữ lại deprecated pattern tối thiểu **1 minor version** trước khi xóa.
- Code sử dụng deprecated pattern phải có `// TODO: migrate to [new pattern]`.

### 11.5. Compliance Checklist

Mỗi screen mới hoặc cập nhật PHẢI pass checklist trước khi merge:

**Tokens & màu sắc**
- [ ] Status badges dùng `getStatusBadgeClass()` hoặc `<StatusBadge />` — không hardcode
- [ ] Không có raw Tailwind color (`bg-blue-*`, `text-emerald-*`, …) ngoài `statusColors.ts`
- [ ] Mock files không export Tailwind class strings
- [ ] Test cả Light Mode và Dark Mode

**Shared components**
- [ ] Empty state dùng `<EmptyState />`
- [ ] Loading state dùng `<ModuleLoadingSkeleton />`
- [ ] Error state dùng `<ErrorState />`
- [ ] Metric/KPI dùng `<MetricTile />`
- [ ] Destructive action wrap trong `<ConfirmDialog />`
- [ ] Detail Page header dùng `<PageHeader />` + `<BackButton />`
- [ ] Form field dùng `<FieldLabel />`; section dùng `<Panel />` + `<InfoField />`

**List Page**
- [ ] Toolbar dùng components từ `@/components/controls` (không raw `<button>`/`<select>`/`<input>`)
- [ ] Pagination dùng `<DataTablePagination />`, page size mặc định 20, options [20, 50, 100]
- [ ] Page padding `px-4 py-3 lg:px-6`

**A11y & responsive**
- [ ] Touch target ≥ 44px trên mobile
- [ ] Icon-only buttons có `aria-label`

**Imports & cấu trúc**
- [ ] Import qua barrel `@/components/{shared,controls,data-table,filters,layout}`
- [ ] File component ≤ 300 dòng
- [ ] `npx tsc --noEmit` exit 0 và `npx eslint` exit 0

---

## 12. Notification Patterns (Thông báo In-App)

> **Tiêu chuẩn tham chiếu:** US-NOTIF-01 · BF-NOTIF-01 · BF-NOTIF-02 · CAP-NOTIFICATION
> **Mục tiêu:** Đảm bảo thông báo trong ứng dụng nhất quán về giao diện, tương tác, và khả năng tiếp cận.

### 12.1. Bell Icon + Badge

| Thành phần | Spec | Ví dụ |
|------------|------|-------|
| Icon | Bell từ lucide-react, kích thước h-5 w-5 | Trong HeaderBar |
| Badge | Rounded full, bg-destructive, text-destructive-foreground | Trên góc phải Bell |
| Badge content | Số unread, tối đa "99+" | 3 → "3", 150 → "99+" |
| Ẩn badge | Khi unread = 0 | Không hiển thị badge |
| Padding badge | absolute -right-0.5 -top-0.5 | Vị trí overlap Bell |

**Quy tắc:**
- `[N-BELL-1]` Badge luôn hiển thị số unread thực tế từ store. KHÔNG hardcode.
- `[N-BELL-2]` Tooltip/aria-label = "Thông báo" cho accessibility.

### 12.2. Notification Panel

| Thành phần | Spec | Ví dụ |
|------------|------|-------|
| Width | w-80 (320px) | Đủ rộng cho title + message |
| Max height | max-h-[360px] overflow-y-auto | Cuộn khi > 5 items |
| Header | Tiêu đề "Thông báo" + nút "Đánh dấu tất cả đã đọc" | Border-bottom phân cách |
| Filter | SegmentedControl 5 tabs: All, System, Workflow, Reminder, Alert | Mỗi tab có số lượng |
| Empty state | Icon Bell mờ + text "Chưa có thông báo nào" | Centered, py-8 |

**Quy tắc:**
- `[N-PANEL-1]` Panel mở khi click Bell, đóng khi click ngoài. Tuân thủ shadcn DropdownMenu.
- `[N-PANEL-2]` SegmentedControl từ @/components/controls — KHÔNG tự viết inline.
- `[N-PANEL-3]` Danh sách sắp xếp theo timestamp giảm dần — mới nhất trên cùng.

### 12.3. Notification Item

| Thành phần | Spec | Ví dụ |
|------------|------|-------|
| Layout | Flex row: Icon + Content + Time | Gap 3 (12px) |
| Category icon | h-4 w-4, text-muted-foreground | System=Settings, Workflow=ArrowRight, Reminder=Clock, Alert=AlertTriangle |
| Title | Line-clamp-2, text-sm | Unread: font-semibold; Read: font-normal text-muted-foreground |
| Message | Line-clamp-1, text-xs, text-muted-foreground | Optional, dưới title |
| Time | Relative time, text-[11px], text-muted-foreground | "5 phút trước", "2 giờ trước" |
| Read indicator | Border-l-4 (unread) hoặc border-l (read) | Unread: border-l-primary; Read: border-l-border |
| Unread background | bg-primary/[0.03] | Nền nhẹ để phân biệt |
| Priority dot | h-1.5 w-1.5 rounded-full | Cao: destructive, Trung bình: amber-400, Thấp: muted-foreground |

**Quy tắc:**
- `[N-ITEM-1]` Click item → mark as read → navigate tới targetRoute.
- `[N-ITEM-2]` Hover → hiển thị actions: Mark as Read (✓), Delete (X).
- `[N-ITEM-3]` Delete hành động phá hủy → yêu cầu ConfirmDialog trước khi xóa ([DS-P4]).
- `[N-ITEM-4]` Relative time: < 60p → phút, < 24h → giờ, < 7d → ngày, ≥ 7d → date locale.

### 12.4. Data Flow Architecture

```
[BF Event Trigger] → [Mock Generator] → [useUIStore.notifications]
                                                  │
                                      ┌───────────┼────────────┐
                                      ▼           ▼            ▼
                                Bell Badge   Notification   Panel
                                                   Item
```

- Store: `useUIStore.notifications` (Zustand)
- Mock data: `notificationHelpers.ts` — generator từ Bảng Routing Rules BF-NOTIF-02
- Component: `<NotificationDropdown />` trong `@/components/layout`

### 12.5. Compliance Checklist

- [ ] Badge count reactive với store unread count
- [ ] Item unread có border-l-4 border-primary + bg-primary/[0.03]
- [ ] Item read có border-l border-border, font-normal, text-muted-foreground
- [ ] Priority colors: destructive/amber-400/muted-foreground — KHÔNG hardcode
- [ ] Relative time tính đúng theo mốc 60p/24h/7d
- [ ] SegmentedControl từ @/components/controls
- [ ] Empty state có icon + text centered
- [ ] Delete action có ConfirmDialog ([DS-P4])
