# RINOV5 Project Context

This is a Next.js 16 + React 19 + TypeScript frontend demo application, migrated from Vue 3 (Rinov4). It is an ERP system for education management and branch/school management. Everything uses mock data only. Do not add real API calls.

## Project Structure

```text
rinov5/
  docs/
    DESIGN_SYSTEM.md          ← Visual patterns & component conventions
    ENTERPRISE_STANDARDS.md   ← Business policies & governance rules
    business-functions/       ← CAP → BF → US → FLOW documentation
    templates/                ← Golden templates: CAP, BF, US-LIST, US-FORM, US-DETAIL, FLOW
  src/
    app/
      (auth)/login/page.tsx
      (dashboard)/
        page.tsx
        app/dashboard/
        app/[menuId]/
      api/auth/login/route.ts
      layout.tsx
      globals.css             ← CSS Variables / Design Tokens
    components/
      ui/                     ← shadcn/ui primitives (DO NOT EDIT)
      layout/                 ← App shell: Header, Sidebar, MainLayout
      shared/                 ← Reusable: EmptyState, LoadingSkeleton, ErrorState
      controls/               ← Toolbar controls: Search, Filter, Segmented
      data-table/             ← DataTableFrame
      filters/                ← FilterSheetPanel
      screens/                ← Screen components (per menuId or folder)
    config/
      navigation.ts
      screens.ts
    stores/
      useAuthStore.ts
      useUIStore.ts
    lib/
      utils.ts
      statusColors.ts         ← Centralized status → color mapping
    hooks/
      use-mobile.ts
    mocks/
    middleware.ts
  .storybook/
  package.json
```

## Tech Stack

- Next.js 16.2.6 with App Router. Local `dev` and default `build` use webpack for stability on Windows; Turbopack is available only through explicit `dev:turbo` and `build:turbo` scripts.
- React 19.2.4
- TypeScript 5
- TailwindCSS v4 with CSS variables in `globals.css`
- shadcn/ui components, New York style
- Zustand for state management
- lucide-react for icons
- Radix UI primitives

## Mock Auth Flow

- Login accepts any email/password for demo use.
- Successful login sets the `auth_session` cookie and redirects to `/app/dashboard`.
- The Next.js middleware (`src/middleware.ts`) checks the cookie and redirects unauthenticated users to `/login`.
- Supported demo roles: `admin`, `branch_manager`, `sale`, `csm`, `teacher`.

## Mock Data

All mock data lives in `src/mocks/`. Each entity file should include:

- Type or interface definitions
- Mock data arrays
- Helper functions for search, filter, pagination, or sorting when needed

Example:

```typescript
export interface Student {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  status: 'active' | 'inactive' | 'pending'
  enrolledClass?: string
  enrollmentDate: string
  branch: string
}

export const mockStudents: Student[] = []

export function getStudents(filters?: {
  search?: string
  branch?: string
  status?: string
}): Student[] {
  return mockStudents
}
```

## Code Generation Conventions

### ⛔ File Size & Decomposition Laws (MANDATORY)

These rules are NON-NEGOTIABLE. Violating them produces unmaintainable code.

1. **MAX 800 lines per component file.** If a screen component exceeds 800 lines, it MUST be decomposed into sub-components.
2. **Screen files (`*Screen.tsx`) are orchestrators, not monoliths.** They should:
   - Import and compose sub-components
   - Hold top-level state and callbacks
   - Define the page layout
   - Delegate rendering to child components
3. **Decomposition pattern for screens:**
   ```
   src/components/screens/
   └── booking-test/
       ├── BookingTestScreen.tsx     ← Orchestrator (≤ 800 lines)
       ├── BookingTestToolbar.tsx    ← Toolbar + filters + search
       ├── BookingTestTable.tsx      ← Table rendering
       ├── BookingTestDetailDialog.tsx
       ├── BookingTestCreateDialog.tsx
       ├── bookingTestHelpers.ts    ← Pure functions (format, filter, sort)
       └── bookingTestTypes.ts      ← Types & constants
   ```
4. **Extract when ANY of these is true:**
   - A JSX block is > 80 lines
   - A helper function is > 20 lines and pure (no state)
   - A Dialog/Modal has its own form state
   - Constants/config arrays are > 15 items
5. **Pure functions go to `*Helpers.ts`**, not inline in components.
6. **Types and constants go to `*Types.ts`** when shared across sub-components.

### 🎨 Design System Compliance (MANDATORY)

Before building ANY UI, read `docs/DESIGN_SYSTEM.md`. These rules are enforced:

1. **Status colors:** NEVER hardcode status badge colors inline.
   - ✅ `import { getStatusBadgeClass } from '@/lib/statusColors'`
   - ❌ `className="bg-emerald-50 text-emerald-700 border-emerald-200"`
2. **Empty states:** Use `<EmptyState />` from `@/components/shared`.
3. **Loading states:** Use `<ModuleLoadingSkeleton />` from `@/components/shared`.
4. **Error states:** Use `<ErrorState />` from `@/components/shared`.
5. **List Page Pattern:** Follow the standard layout: Toolbar → Status Tiles → DataTable → Pagination Footer.
6. **Confirm destructive actions:** Use `<ConfirmDialog />` from `@/components/shared` (wraps shadcn `AlertDialog`) before delete/deactivate/lock/cancel. NEVER fire a destructive `onClick` directly.
7. **Page padding:** `px-4 py-3 lg:px-6` — do not invent custom padding.
8. **Default page size:** 20 records/page, options `[20, 50, 100]`. Use `<DataTablePagination />` from `@/components/data-table` — do NOT hand-roll a pagination footer.
9. **List toolbar controls:** Use the components in `@/components/controls` (`SegmentedControl`, `ToolbarSelect`, `BranchSelect`, `InlineSelect`, `IconActionButton`, `FilterIconButton`, `ExpandableSearch`). NEVER use raw `<button>`, `<select>`, or unstyled `<input>` for toolbar UI.
10. **Forms:** Use `<FieldLabel />` from `@/components/shared` for stacked label+input pairs. For detail-page sections, use `<Panel />` + `<InfoField />`. For dropdown-style inputs inside forms, use `<InlineSelect />`.
11. **Detail page header:** Use `<PageHeader />` + `<BackButton />` from `@/components/shared` — do NOT rebuild title/status/code/action bars per screen.
12. **Metric cards:** Use `<MetricTile />` from `@/components/shared` instead of hand-rolling Card + value + trend.
13. **Mocks must NOT export Tailwind class strings.** Any color/style decision belongs in `statusColors.ts` or the screen — never in `src/mocks/`. If a `type`/`status` value needs a color, add it to `ENTITY_STATUS_MAP` and resolve via `getStatusBadgeClass(value)`.
14. **Barrel imports:** Prefer `from '@/components/shared'`, `from '@/components/controls'`, `from '@/components/data-table'`, `from '@/components/filters'`, `from '@/components/layout'` instead of deep paths like `'@/components/controls/ListControls'`.

### 📝 Documentation Governance (MANDATORY)

When writing or editing business documentation (CAP, BF, US, FLOW), you MUST:

**⚡ TEMPLATE-FIRST RULE:**
1. **Use Golden Templates:** ALWAYS start from `docs/templates/`. Pick the correct template:
   - New Capability → `TEMPLATE-CAP.md`
   - New Business Function → `TEMPLATE-BF.md`
   - New List Screen US → `TEMPLATE-US-LIST.md`
   - New Form/Modal US → `TEMPLATE-US-FORM.md`
   - New Detail Page US → `TEMPLATE-US-DETAIL.md`
   - New End-to-End Flow → `TEMPLATE-FLOW.md`
2. **Do NOT invent custom structures.** Every documentation file must strictly follow its template layout.
3. **Strict separation of Form and Detail:** For complex core entities (Branch, HR Worker, Student, etc.), NEVER merge "Create" and "Update" into a single US. "Create" MUST use `TEMPLATE-US-FORM.md` (representing a simple Popup/Wizard). "Update/View/Read" MUST use `TEMPLATE-US-DETAIL.md` (representing a complex multi-tab orchestrator page).

**📐 QUALITY STANDARDS (INVEST + SMART):**
3. **INVEST for User Stories:** Every US must be Independent, Negotiable, Valuable, Estimable, Small, Testable.
4. **SMART Acceptance Criteria:** Every acceptance criterion must be Specific, Measurable, Achievable, Relevant, Time-bound.
5. **Traceability Chain:** Each artifact MUST reference its parent:
   - US → references BF
   - BF → references CAP
   - FLOW → references US
   - All → reference `ENTERPRISE_STANDARDS.md` policies when applicable
   - All UI-related US/FLOW → reference `DESIGN_SYSTEM.md` patterns when applicable

**🎨 DESIGN SYSTEM CROSS-REFERENCE (per `[POLICY-DS-03]`):**
6. **Statuses:** Any entity status mentioned in a US or FLOW must exist in `src/lib/statusColors.ts`. If it doesn't, add it there FIRST.
7. **Screen references:** When a US describes a screen, reference the appropriate Design System pattern:
   - List screen → "§4.2 List Page Pattern"
   - Detail screen → "§4.3 Detail Page Pattern"
   - Form/Dialog → "§4.4 Form Pattern"
8. **Destructive actions:** If a US/FLOW includes Delete, Lock, Deactivate, Cancel — explicitly note the Confirm Dialog requirement per `[DS-P4]`.
9. **New entities:** When a BF introduces a new entity, define its status lifecycle and register all statuses in `statusColors.ts`.

**🚫 LANGUAGE RULES (per `[POLICY-DS-05]`):**
10. **No CSS in docs:** Business documents must NOT contain CSS classes or Tailwind utilities. Reference DS patterns by section number only.
11. **Natural language only:** Business docs (sections 1–4) MUST use 100% natural or business language. NEVER use:
    - CSS specs: `border-radius`, `opacity`, `min-width`, `shadow-lg`, `px`, `rem` → Use: "bo tròn nhẹ", "mờ đi", "có bóng đổ"
    - Code refs: `src/mocks/X.ts`, variable names, function names, events → REMOVE entirely
    - Dev jargon: `API`, `Backend`, `Frontend`, `middleware`, `cookie`, `DOM`, `JSON` → Use: "hệ thống", "giao diện", "phiên làm việc"
    - Component tech names: `Div`, `Checkbox grid`, `Floating panel` → Use: "ô chọn", "bảng nổi", "hộp thoại"
    - Tailwind color names: `nền indigo`, `màu emerald` → Use: "màu nhấn", "màu tích cực"
12. **Agent Guidelines section:** Technical jargon is ONLY permitted inside the dedicated "Chỉ dẫn cho AI Agent & Lập trình viên" section at the bottom of US/BF/FLOW templates.
13. **Document Driven (US First):** AI MUST NOT write UI or Logic code without an existing Tier 4 User Story (`US-*.md`) document. If the user requests a new feature, AI must find the US first, or write it and get it approved before coding.

### Architecture and Simplicity

- Prefer the smallest coherent design that solves the root problem.
- Do not stack workaround on workaround. If a fix requires special cases, duplicated state, nested scroll containers, or repeated cleanup logic, step back and adjust the core component, route, state owner, or script.
- Reusable components should have one clear responsibility and a data-driven API. Keep screen files responsible for business mapping and local workflow state, not low-level layout machinery.
- Avoid creating abstractions only to hide a local issue. Extract a component only when at least one of these is true: it is reused, it isolates a stable UI pattern, or it removes meaningful complexity from a screen.
- Runtime/tooling fixes belong in explicit scripts or config, not ad hoc terminal habits. Prefer `npm run dev:restart` when the local runtime is stale.
- Before adding new files or dependencies, check whether existing shadcn/ui, layout, store, mock, or utility patterns already solve the need.

### Component Style

- Use TypeScript React functional components.
- Do not add i18n. Hardcoded English text is acceptable for this demo.
- Use `cn()` from `@/lib/utils` for conditional `className` values.
- Use shadcn/ui components from `@/components/ui/`.
- Use shared components from `@/components/shared/` (EmptyState, ModuleLoadingSkeleton, ErrorState).
- Use status colors from `@/lib/statusColors` — never hardcode status badge colors.
- Use icons from `lucide-react`.
- Follow shadcn New York style and preserve existing `data-slot` conventions.

### Page Convention

- Dashboard app screens are routed through `src/app/(dashboard)/app/[menuId]/page.tsx`.
- Screen metadata is defined in `@/config/screens.ts`.
- Navigation is defined in `@/config/navigation.ts`.
- Screen implementations should live in `src/components/screens/[menuId]Screen.tsx` when a dedicated screen component is needed.
- Dynamic routes should resolve screens by `menuId`; avoid adding one-off route files unless the app structure requires it.
- Use mock data from `@/mocks/` or local component state.
- Prefer a data-table pattern for list screens: toolbar, filters/search, table, actions, pagination footer.
- Loading states should use `<ModuleLoadingSkeleton />` when available or shadcn `<Skeleton />`.
- Empty states should include a clear placeholder message.

### State Management

- Auth state belongs in `useAuthStore()`: `isAuthenticated`, `user`, `login()`, `logout()`.
- UI state belongs in `useUIStore()`: sidebar, theme, notifications, current menu, and other app-shell UI state.
- Screen-specific state should stay local with React `useState` unless it needs cross-screen persistence.

### Route and Navigation Mapping

When creating a new screen:

1. Check whether the screen ID already exists in `@/config/screens.ts`.
2. Check whether it is already present in `@/config/navigation.ts`.
3. Create mock data in `@/mocks/` if the entity does not already exist.
4. Create the screen component under `src/components/screens/` if needed.
5. Keep the dynamic `/app/[menuId]` route as the resolver.

## No Real APIs

- Do not import `@supabase/supabase-js` in screens.
- Do not create server actions or database queries for product data.
- Do not use external APIs for demo data.
- All business data must come from `@/mocks/` or local state.
- The only API routes should be mock infrastructure, such as `src/app/api/auth/login/route.ts` and logout/session helpers.

## Screen Priority

P0 screens:

- `/app/dashboard`
- `/app/students`
- `/app/classes`
- `/app/calendar_class_schedule`
- `/app/orders`
- `/app/hr_employees`
- `/app/products`

## Demo-Friendly Features

For list and management screens, include:

- Search
- Filters
- Sort controls where useful
- View/edit/delete/add actions
- Status badges such as Active, Inactive, Pending
- Pagination using mock data
- Empty, loading, and error states

## Storybook

Add `.stories.tsx` coverage for reusable components and important screen previews when adding or changing UI that should be exported to Figma later.

Storybook config lives in `.storybook/` and should include Tailwind styling through the existing preview setup.

## Migration Context

The original project was Vue 3 + Pinia + vue-router. The Rinov5 codebase is the Next.js migration target.

- 60+ menu IDs are expected.
- Around 30 screens may be implemented and around 30 may remain placeholders.
- Migration checklist: `C:\Users\Jacky Tran\Documents\Rinov4-MIGRATION-CHECKLIST.md`.
- Mock data structure should stay aligned with Rinov4 service/data files when practical.

## Agent Startup Checklist

When an AI agent starts work in this repo:

1. Read this `AGENTS.md`.
2. Read `docs/ENTERPRISE_STANDARDS.md` — understand policies before any work.
3. Read `docs/DESIGN_SYSTEM.md` — understand visual patterns before writing ANY UI code.
4. Read `docs/DESIGN_SYSTEM_STANDARD.md` — understand quality criteria for the Design System.
5. **Read `docs/templates/` — understand the Golden Templates for CAP, BF, US, FLOW before writing ANY documentation.**
6. Read `src/config/navigation.ts`.
7. Read `src/config/screens.ts`.
8. Read `src/stores/useAuthStore.ts` and `src/stores/useUIStore.ts`.
9. Read `src/components/layout/`.
10. Read `src/lib/statusColors.ts` — use this for ALL status badge colors.
11. Read `src/components/shared/index.ts` — full catalog of reusable primitives (Empty/Loading/Error state, StatusBadge, StatusTiles, MetricTile, ConfirmDialog, FieldLabel, InfoField, Panel, PageHeader, BackButton).
12. Read `src/components/controls/index.ts`, `src/components/data-table/index.ts`, `src/components/filters/index.ts` — toolbar / table / filter primitives.
13. Check `src/mocks/` for available data before creating new mock files.
14. Check `docs/business-functions/CATALOG.md` for existing CAP/BF structure before creating new documentation.

## Post-Coding Verification Checklist

Before reporting work as complete, the AI agent MUST verify:

1. **File Size**: Are component files under 800 lines? If not, refactor immediately.
2. **Status Colors**: Are ALL entity statuses using `getStatusBadgeClass` (or `<StatusBadge />`) from `statusColors.ts`? (No hardcoded `bg-emerald-*` / `text-red-*` / etc. anywhere in `src/components/` or `src/mocks/`.)
3. **Shared Components**: Have `<EmptyState />`, `<ModuleLoadingSkeleton />`, `<ErrorState />`, `<StatusBadge />`, `<StatusTiles />`, `<MetricTile />`, `<ConfirmDialog />`, `<FieldLabel />`, `<InfoField />`, `<Panel />`, `<PageHeader />`, `<BackButton />` been used wherever applicable instead of inline equivalents?
4. **Toolbar Controls**: Are list toolbars built from `@/components/controls` and `@/components/filters`? No raw `<button>`, `<select>`, or `<input>` for toolbar UI.
5. **Pagination**: Lists use `<DataTablePagination />` with default page size 20 and options `[20, 50, 100]`.
6. **Destructive Actions**: Every delete/cancel/lock/deactivate goes through `<ConfirmDialog />`, not a bare `onClick`.
7. **Mock Data**: Is the code strictly using mock data and Zustand state? (No real API/Supabase calls.) Mocks contain DATA only — no Tailwind class strings.
8. **Imports**: Are the new components imported from the barrel (`@/components/shared` etc.) rather than deep paths?
9. **Build**: `npx tsc --noEmit` exits 0 and `npx eslint "src/**/*.{ts,tsx}"` exits 0 with zero errors.
10. **Documentation**: Does the implemented UI match the patterns and validations described in the `US-*.md` document?

## Current Guardrails

- The repository may contain in-progress migration work and a dirty git tree. Do not revert unrelated changes.
- Preserve mock-only behavior.
- Keep changes scoped.
- Prefer existing shadcn/ui, Zustand, Tailwind, and layout patterns.
