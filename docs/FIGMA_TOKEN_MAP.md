# Figma ↔ Code Token Map

**Single source of truth** for mapping Figma variables (in `Rinov5 Tokens` collection) to
code tokens (`src/app/globals.css` CSS variables and Tailwind utility classes).

**File:** Rinoedu Figma → collection `Rinov5 Tokens` (Light + Dark modes)
**Code:** `src/app/globals.css` + `src/lib/statusColors.ts`

> Rule: when AI builds a Figma screen, NEVER hard-code hex. Bind one of the variables below.
> When AI writes React code from a Figma node, look up the variable name in this table to
> find the Tailwind utility / CSS variable to use.

---

## 1. Theme tokens (shadcn/ui style)

| Figma variable | CSS variable | Tailwind utility (bg / text / border) |
|---|---|---|
| `color/background` | `--background` | `bg-background` |
| `color/foreground` | `--foreground` | `text-foreground` |
| `color/card` | `--card` | `bg-card` |
| `color/card-foreground` | `--card-foreground` | `text-card-foreground` |
| `color/popover` | `--popover` | `bg-popover` |
| `color/popover-foreground` | `--popover-foreground` | `text-popover-foreground` |
| `color/primary` | `--primary` | `bg-primary` / `text-primary` |
| `color/primary-foreground` | `--primary-foreground` | `text-primary-foreground` |
| `color/secondary` | `--secondary` | `bg-secondary` |
| `color/secondary-foreground` | `--secondary-foreground` | `text-secondary-foreground` |
| `color/muted` | `--muted` | `bg-muted` |
| `color/muted-foreground` | `--muted-foreground` | `text-muted-foreground` |
| `color/accent` | `--accent` | `bg-accent` |
| `color/accent-foreground` | `--accent-foreground` | `text-accent-foreground` |
| `color/destructive` | `--destructive` | `bg-destructive` |
| `color/destructive-foreground` | `--destructive-foreground` | `text-destructive-foreground` |
| `color/border` | `--border` | `border-border` |
| `color/input` | `--input` | `border-input` |
| `color/ring` | `--ring` | `ring-ring` |
| `color/sidebar` | `--sidebar` | `bg-sidebar` |
| `color/sidebar-foreground` | `--sidebar-foreground` | `text-sidebar-foreground` |
| `color/sidebar-primary` | `--sidebar-primary` | `bg-sidebar-primary` |
| `color/sidebar-accent` | `--sidebar-accent` | `bg-sidebar-accent` |
| `color/sidebar-border` | `--sidebar-border` | `border-sidebar-border` |

---

## 2. Status semantic tokens (badges, status tiles, dots)

These mirror `src/lib/statusColors.ts` semantic palette. Use them in Figma; in code resolve via
`getStatusColors(semantic)` or `getStatusBadgeClass(entityStatus)`.

### Figma → code mapping (per status × 3 roles)

| Figma variable | Tailwind utility (Light mode) |
|---|---|
| `status/success/surface` | `bg-emerald-50` |
| `status/success/border` | `border-emerald-200` |
| `status/success/text` | `text-emerald-700` |
| `status/info/surface` | `bg-sky-50` |
| `status/info/border` | `border-sky-200` |
| `status/info/text` | `text-sky-700` |
| `status/warning/surface` | `bg-amber-50` |
| `status/warning/border` | `border-amber-200` |
| `status/warning/text` | `text-amber-700` |
| `status/error/surface` | `bg-red-50` |
| `status/error/border` | `border-red-200` |
| `status/error/text` | `text-red-700` |
| `status/neutral/surface` | `bg-zinc-50` |
| `status/neutral/border` | `border-zinc-200` |
| `status/neutral/text` | `text-zinc-600` |
| `status/purple/surface` | `bg-violet-50` |
| `status/purple/border` | `border-violet-200` |
| `status/purple/text` | `text-violet-700` |
| `status/completed/surface` | `bg-cyan-50` |
| `status/completed/border` | `border-cyan-200` |
| `status/completed/text` | `text-cyan-700` |

### Entity status → semantic resolution

These come from `ENTITY_STATUS_MAP` in `src/lib/statusColors.ts`. When AI sees an entity
status string in Figma, look it up here to know which semantic palette to bind.

| Entity status (Vietnamese / data value) | Semantic |
|---|---|
| `active`, `available`, `qualified`, `registered`, `approved`, `paid`, `confirmed` | `success` |
| `in_use`, `started_assessment`, `class_session`, `event`, `scheduled`, `upcoming`, `in_progress`, `partial`, `new`, `on_leave` | `info` |
| `locked`, `probation`, `maintenance`, `tested`, `pending`, `contacted`, `seconded` (biệt phái), `needs_attention`, `placement_test`, `ongoing`, `unpaid` | `warning` |
| `deactivated`, `decommissioned`, `failed`, `rejected`, `declined` | `error` |
| `inactive`, `resigned`, `cancelled`, `lost`, `archived`, `draft`, `refunded`, `transferred`, `planned` | `neutral` |
| `interviewed`, `merged`, `workshop` | `purple` |
| `completed`, `converted`, `graduated`, `supplementary` | `completed` |

---

## 3. Spacing & sizing tokens

| Figma variable | Value | Tailwind equivalent |
|---|---|---|
| `spacing/page-x-mobile` | 16 | `px-4` |
| `spacing/page-x-desktop` | 24 | `lg:px-6` |
| `spacing/page-y` | 12 | `py-3` |
| `spacing/toolbar-gap` | 8 | `gap-2` |
| `spacing/form-field-gap` | 12 | `gap-3` |
| `spacing/table-cell` | 8 | `p-2` |
| `spacing/card-padding` | 16 | `p-4` |
| `size/header-height` | 64 | `h-16` |
| `size/sidebar-expanded` | 288 | `w-72` |
| `size/sidebar-collapsed` | 72 | `w-18` |
| `size/control-sm-height` | 32 | `h-8` |
| `size/touch-target` | 44 | (min hit area) |

---

## 4. Radius tokens

| Figma variable | Value | CSS / Tailwind |
|---|---|---|
| `radius/sm` | 5.6 | `rounded-sm` → `--radius-sm` |
| `radius/md` | 7.6 | `rounded-md` → `--radius-md` |
| `radius/base` | 9.6 | `rounded` (from `--radius`) |
| `radius/lg` | 9.6 | `rounded-lg` → `--radius-lg` |
| `radius/xl` | 13.6 | `rounded-xl` → `--radius-xl` |
| `radius/full` | 999 | `rounded-full` |

---

## 5. Deprecated collections (do NOT use)

These remain in the Figma file for backward-compat with old Rinov4 frames but MUST NOT be
bound to any new component or screen:

- `[DEPRECATED] Rinov3 Colors` (28 vars) — old surface/text scale
- `[DEPRECATED] localhost` (167 vars) — auto-imported CSS scrape
- `[DEPRECATED] RinoEdu DS V2` (46 vars) — alternate semantic naming

If a node still binds these, migrate to the equivalent in `Rinov5 Tokens` per this table.

---

## 6. Workflow for AI agents

1. **Building a Figma screen from React code:**
   - Read the Tailwind class on a node (e.g., `bg-card`).
   - Look it up in §1 → use Figma variable `color/card`.
   - Bind via `figma.variables.setBoundVariableForPaint(...)` — NEVER paste hex.

2. **Building React code from a Figma screen:**
   - Inspect the bound variable name on a node (`status/warning/surface`).
   - Look it up in §2 → use Tailwind class `bg-amber-50`.
   - For status badges, prefer `getStatusBadgeClass(status)` from `@/lib/statusColors` so
     entity status strings resolve to the right semantic.

3. **Adding a new token:**
   - Decide if it's theme (§1), status (§2), spacing (§3), or radius (§4).
   - Add the variable to `Rinov5 Tokens` collection with both Light and Dark mode values.
   - Add the equivalent CSS variable in `globals.css` AND update this map in the same PR.
