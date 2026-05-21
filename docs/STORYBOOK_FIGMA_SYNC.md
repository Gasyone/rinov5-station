# Storybook ↔ Figma Sync Workflow

Storybook is the **runtime source of truth** for Rinov5 components. This doc
describes how to keep Figma's `02 Rinov5 Primitives` page in sync with the
Storybook catalog so AI agents can confidently round-trip between code and design.

**Current status:** 29 stories exist in code (`src/**/*.stories.tsx`).
21 of them have a matching Figma component set in `02 Rinov5 Primitives`.

---

## 1. Two-way binding model

```
React component (.tsx)
       ↓ Storybook auto-renders
Storybook canvas (live preview)
       ↓ (manual or via Chromatic) screenshot upload
Figma component set on '02 Rinov5 Primitives'
       ↓ FIGMA_COMPONENT_MAP.md links back to source
React component (.tsx)
```

The arrows are not all automatic. The arrows that ARE automatic vs manual:

| Arrow | Trigger | Tool |
|---|---|---|
| `.tsx` → Storybook canvas | Save the file | `npm run storybook` |
| Storybook → Chromatic snapshot | Git push to a branch | `npm run visual-storybook` (uses Chromatic CLI) |
| Chromatic snapshot → Figma | **Manual** (no auto sync) | Use Chromatic's "Open in Figma" link or download + paste |
| Figma component → React code | **Manual** (no Code Connect) | Look up in `FIGMA_COMPONENT_MAP.md` |

The Code-Connect arrow is missing because the org plan currently doesn't include
Developer seats. `FIGMA_COMPONENT_MAP.md` is the manual substitute.

---

## 2. When to sync

Sync Figma to Storybook every time one of these happens:

| Trigger | Action |
|---|---|
| New variant added to a Rinov5/* component | Update the Figma component set + bump the count in `FIGMA_COMPONENT_MAP.md` §1 |
| Component visual changed (color, spacing, radius) | Re-bind to the matching Rinov5 Tokens variable; re-render variant in Figma |
| New shared component added to `src/components/shared/` | Build a new Figma component set per the convention in `FIGMA_COMPONENT_MAP.md` §3, add to the catalog |
| Component deleted | Remove the Figma component set + remove its row from the catalog |

---

## 3. Practical sync routines

### 3a. Component code changed — sync to Figma

1. Run Storybook locally to confirm the new look:
   ```powershell
   npm run storybook
   ```
2. Open the relevant story (e.g., `shared/StatusBadge`).
3. Take a screenshot of each variant for reference.
4. Open Figma → page `02 Rinov5 Primitives`.
5. Locate the component set by name (e.g., `Rinov5/Shared/StatusBadge`).
6. Use `use_figma` with the component set's node id to update child variants.
   Pattern:
   ```js
   const set = await figma.getNodeByIdAsync('<setId>');
   const variant = set.children.find(c => c.name === 'semantic=success, withDot=false');
   // mutate fills / strokes / text on variant subtree
   ```
7. Re-screenshot the set, verify against Storybook, commit the changes.

### 3b. New component added — add to Figma

1. Run Storybook, confirm the component renders correctly with all variants.
2. Pick the matching Figma category: `Shared | Controls | Data | Filters`.
3. In Figma, on page `02 Rinov5 Primitives`, build the component using these
   rules (mirroring how the existing 21 sets were built):

   - Use `figma.createComponent()` for each variant.
   - Use `figma.combineAsVariants()` to merge them into a set.
   - Name the set `Rinov5/<Category>/<ComponentName>` per
     `FIGMA_COMPONENT_MAP.md` §3.
   - Bind every color / spacing / radius to a Rinov5 Tokens variable
     (`color/*`, `status/*/*`, `radius/*`, `spacing/*`). Never paste hex.
   - Set `componentSet.description` with the path back to the React source.

4. Append a new row to `docs/FIGMA_COMPONENT_MAP.md` §1, §2.

### 3c. Visual regression check — Chromatic

Chromatic publishes Storybook snapshots that catch visual diffs across PRs:
```powershell
npm run visual-storybook
```
The Chromatic UI shows side-by-side before/after for every story. Use it to
verify that Figma updates match the latest Storybook rendering before signing off.

---

## 4. Optional plugins to install in Figma

These improve the sync experience but are not required:

| Plugin | What it does |
|---|---|
| **Storybook Connect** (by Chromatic) | Embeds Chromatic story URLs into Figma component descriptions so designers can preview the live React story from inside Figma. Setup: install the plugin, paste a Chromatic story link into a component set's description. |
| **html.to.design** | One-shot conversion from a rendered URL to a Figma frame. Useful for snapshotting a complex screen quickly before manually relinking components. |
| **Figma Tokens (Tokens Studio)** | Two-way sync between `globals.css` CSS variables and Figma variables. Optional alternative to manually maintaining `Rinov5 Tokens`. |

We're not using any of these by default — `use_figma` + this doc + Chromatic is enough.

---

## 5. Future migration path: enable Code Connect

When the org upgrades to a plan with Developer seats, replace this manual map:

1. Install `@figma/code-connect`:
   ```powershell
   npm install --save-dev @figma/code-connect
   ```
2. For each Rinov5/* component set, create a `<ComponentName>.figma.tsx` file
   next to the source:
   ```tsx
   // src/components/shared/StatusBadge.figma.tsx
   import figma from '@figma/code-connect'
   import { StatusBadge } from './StatusBadge'

   figma.connect(
     StatusBadge,
     'https://www.figma.com/design/frct7JUaJQBN2uOSyfMqcL/Rinoedu?node-id=783-37',
     {
       props: {
         status: figma.enum('semantic', {
           success: 'active', info: 'in_progress', warning: 'pending',
           error: 'failed', neutral: 'inactive', purple: 'interviewed',
           completed: 'completed',
         }),
         withDot: figma.boolean('withDot'),
       },
       example: ({ status, withDot }) => (
         <StatusBadge status={status} withDot={withDot} />
       ),
     }
   )
   ```
3. Run `figma connect publish` to push the mappings to Figma.
4. After all 21 components are wired, deprecate `FIGMA_COMPONENT_MAP.md` §2
   (keep §1 as human-readable index).

---

## 6. Catalog coverage report

Run this anytime to verify Storybook ↔ Figma coverage:

```powershell
# Find all stories
Get-ChildItem -Path src -Filter '*.stories.tsx' -Recurse | Select-Object -ExpandProperty Name
```

Cross-reference the output against `FIGMA_COMPONENT_MAP.md` §1. Any story file
without a Figma row is a gap to fill.

**Known gaps (as of this commit):**
- `MainLayout.stories.tsx` — full layout, not a primitive; lives on `03 App Shell`.
- `HeaderBrand.stories.tsx` — layout primitive; lives on `03 App Shell`.
- Screen-level stories (`*Screen.stories.tsx` for Dashboard, Orders, Students,
  Classes, Products, Employees, CalendarClassSchedule, WorkRegistration) — these
  are compositions, mirrored as Figma frames on category pages
  (`11. Calendar`, `12. Booking`, `18. HR`, etc.), not as Rinov5/* primitives.
