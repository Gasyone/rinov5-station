# Figma ↔ Code Component Map

**Manual Code-Connect substitute.** Since the Figma org plan currently doesn't
include Developer seats, this file is the single source of truth that maps each
Figma component set on page `02 Rinov5 Primitives` to its React implementation.

**File:** Rinoedu Figma → page `02 Rinov5 Primitives`
**Code:** `src/components/shared/`, `src/components/controls/`,
`src/components/data-table/`, `src/components/filters/`

> Rule: when AI builds a Figma screen and needs a component, use
> `figma.importComponentSetByKeyAsync(<key>)` with one of the keys below.
> When AI writes React from a Figma node, find the node's component-set name
> in the table and import the matching React component.

---

## 1. Component sets (Rinov5/*)

All 21 component sets live on Figma page `02 Rinov5 Primitives`.

### Shared atoms

| Figma component set | Variant axes | Variant count | React component | Source file |
|---|---|---|---|---|
| `Rinov5/Shared/StatusBadge` | `semantic` × `withDot` | 14 | `<StatusBadge />` | [`src/components/shared/StatusBadge.tsx`](../src/components/shared/StatusBadge.tsx) |
| `Rinov5/Shared/StatusTile` | `semantic` × `active` | 14 | `<StatusTiles />` (single tile) | [`src/components/shared/StatusTiles.tsx`](../src/components/shared/StatusTiles.tsx) |
| `Rinov5/Shared/MetricTile` | `trend` (none/up/down) | 3 | `<MetricTile />` | [`src/components/shared/MetricTile.tsx`](../src/components/shared/MetricTile.tsx) |
| `Rinov5/Shared/PageHeader` | `showBackButton` | 2 | `<PageHeader />` | [`src/components/shared/PageHeader.tsx`](../src/components/shared/PageHeader.tsx) |
| `Rinov5/Shared/BackButton` | `state=default` | 1 | `<BackButton />` | [`src/components/shared/BackButton.tsx`](../src/components/shared/BackButton.tsx) |
| `Rinov5/Shared/EmptyState` | `withAction` | 2 | `<EmptyState />` | [`src/components/shared/EmptyState.tsx`](../src/components/shared/EmptyState.tsx) |
| `Rinov5/Shared/ErrorState` | `withRetry` | 2 | `<ErrorState />` | [`src/components/shared/ErrorState.tsx`](../src/components/shared/ErrorState.tsx) |
| `Rinov5/Shared/ModuleLoadingSkeleton` | `state=loading` | 1 | `<ModuleLoadingSkeleton />` | [`src/components/shared/ModuleLoadingSkeleton.tsx`](../src/components/shared/ModuleLoadingSkeleton.tsx) |
| `Rinov5/Shared/FieldLabel` | `state` (default/required/error) | 3 | `<FieldLabel />` | [`src/components/shared/FieldLabel.tsx`](../src/components/shared/FieldLabel.tsx) |
| `Rinov5/Shared/InfoField` | `state=default` | 1 | `<InfoField />` | [`src/components/shared/FieldLabel.tsx`](../src/components/shared/FieldLabel.tsx) |
| `Rinov5/Shared/Panel` | `state=default` | 1 | `<Panel />` | [`src/components/shared/FieldLabel.tsx`](../src/components/shared/FieldLabel.tsx) |
| `Rinov5/Shared/ConfirmDialog` | `variant` (default/destructive) | 2 | `<ConfirmDialog />` | [`src/components/shared/ConfirmDialog.tsx`](../src/components/shared/ConfirmDialog.tsx) |
| `Rinov5/Shared/EntityCell` | `avatar` (initials/image) | 2 | `<EntityCell />` | [`src/components/shared/EntityCell.tsx`](../src/components/shared/EntityCell.tsx) |

### Data table

| Figma component set | Variant axes | Variant count | React component | Source file |
|---|---|---|---|---|
| `Rinov5/Data/DataTableActions` | `actions` (view-only/view-edit/full) | 3 | `<DataTableActions />` | [`src/components/shared/DataTableActions.tsx`](../src/components/shared/DataTableActions.tsx) |
| `Rinov5/Data/DataTablePagination` | `state=default` | 1 | `<DataTablePagination />` | [`src/components/data-table/DataTablePagination.tsx`](../src/components/data-table/DataTablePagination.tsx) |
| `Rinov5/Data/DataTableFrame` | `state=default` | 1 | `<DataTableFrame />` | [`src/components/data-table/DataTableFrame.tsx`](../src/components/data-table/DataTableFrame.tsx) |

### Controls (toolbar)

| Figma component set | Variant axes | Variant count | React component | Source file |
|---|---|---|---|---|
| `Rinov5/Controls/SegmentedControl` | `segments` (2/3/4) | 3 | `<SegmentedControl />` | [`src/components/controls/ListControls.tsx`](../src/components/controls/ListControls.tsx) |
| `Rinov5/Controls/ToolbarSelect` | `style` (default/dashed) | 2 | `<ToolbarSelect />`, `<BranchSelect />`, `<InlineSelect />` | [`src/components/controls/ListControls.tsx`](../src/components/controls/ListControls.tsx) |
| `Rinov5/Controls/IconActionButton` | `icon` × `badge` | 8 | `<IconActionButton />`, `<FilterIconButton />` | [`src/components/controls/ListControls.tsx`](../src/components/controls/ListControls.tsx) |
| `Rinov5/Controls/ExpandableSearch` | `state` (collapsed/expanded) | 2 | `<ExpandableSearch />` | [`src/components/controls/ListControls.tsx`](../src/components/controls/ListControls.tsx) |

### Filters

| Figma component set | Variant axes | Variant count | React component | Source file |
|---|---|---|---|---|
| `Rinov5/Filters/FilterSheetPanel` | `state=open` | 1 | `<FilterSheetPanel />` | [`src/components/filters/FilterSheetPanel.tsx`](../src/components/filters/FilterSheetPanel.tsx) |
| `Rinov5/Filters/FilterClearAllButton` | `state` (default/disabled) | 2 | `<FilterClearAllButton />` | [`src/components/filters/FilterClearAllButton.tsx`](../src/components/filters/FilterClearAllButton.tsx) |

---

## 2. Component keys (for `importComponentSetByKeyAsync`)

When AI builds a Figma screen and wants to drop in a component, use these keys
with the Plugin API call below.

```js
const set = await figma.importComponentSetByKeyAsync('<key>');
const variant = set.children.find(c => c.name.includes('variant=primary'));
const instance = variant.createInstance();
parent.appendChild(instance);
```

| Component set | Key |
|---|---|
| `Rinov5/Shared/StatusBadge` | `265617e5708d00f043356d11316428b522c122b4` |
| `Rinov5/Shared/StatusTile` | `6d3c3f5b1311ec0c404a39c2de4b3295a48d00b6` |
| `Rinov5/Shared/MetricTile` | `8f34b2459baff0ada392c145a240914c8d6b8978` |
| `Rinov5/Shared/PageHeader` | `1b930ea2ed3f6c040663b0d5cbed6976b9eca027` |
| `Rinov5/Shared/BackButton` | `9305e7a3dc190390dee798765b5b10c3ca327667` |
| `Rinov5/Shared/EmptyState` | `5c30546cd850b3312a3583571062e8c3a85e0e52` |
| `Rinov5/Shared/ErrorState` | `1cd0c7bdedb5337e5f9f32f286ccedb8bdecd1b4` |
| `Rinov5/Shared/ModuleLoadingSkeleton` | `b9fa6730904e29ce02e8c584eb1bcefe0050a370` |
| `Rinov5/Shared/FieldLabel` | `1d22d5e9fd2acd18fce19604cc481852c272e19a` |
| `Rinov5/Shared/InfoField` | `6ff0fd5bb2f141334a42d7e33a88d2746fbe7362` |
| `Rinov5/Shared/Panel` | `c40bbbd2f8f06fbc573fc7f4d28079f57cf51312` |
| `Rinov5/Shared/ConfirmDialog` | `27d40546fb0a524085813bd43575916ef253492d` |
| `Rinov5/Shared/EntityCell` | `d0c0a98206633c0ff12850730ee87f90b1b942b6` |
| `Rinov5/Data/DataTableActions` | `6355a3e7ee6a6ab1cefc804e9ccf2ee162a466bd` |
| `Rinov5/Data/DataTablePagination` | `de6fa37f817a0f36f5e86e91944e8b27df6a46b5` |
| `Rinov5/Data/DataTableFrame` | `446fe28c297be108577d6cd7ca328175b8410043` |
| `Rinov5/Controls/SegmentedControl` | `c5c7c87363c40629bffa08486cb2d44c9dfc817a` |
| `Rinov5/Controls/ToolbarSelect` | `4c1fb8c03f451564515325a3bafd33f35affc54d` |
| `Rinov5/Controls/IconActionButton` | `453a5f1f20ad58a8ff38d24bfc70e20236e6aa92` |
| `Rinov5/Controls/ExpandableSearch` | `3b0ee3ec9d9a2f9d9d4c6541bd1cdd48bb5274f7` |
| `Rinov5/Filters/FilterSheetPanel` | `4eb3fc32a3b6c92887b2bec2f2d6013600016e22` |
| `Rinov5/Filters/FilterClearAllButton` | `941d85091510eb23ee9f7806f6ccfe73efbec8d9` |
| `Rinov5/Data/DataTableFrame` *(updated, replaces old key)* | `d3f657cea9bb1303b35932ed431b5454613d5bf2` |

---

## 3. Naming convention

When adding new components in either Figma or code, follow this contract:

**Figma side**
- Component set names: `Rinov5/<Category>/<ComponentName>` where Category ∈
  `Shared | Controls | Data | Filters | Layout`.
- Variant property names: lowercase camelCase (`semantic`, `withDot`, `state`,
  `variant`, `actions`, `segments`, `style`, `icon`, `badge`, `showBackButton`,
  `avatar`, `withAction`, `withRetry`).
- Variant property values: lowercase kebab or single word (`success`, `view-only`,
  `default`, `destructive`).

**Code side**
- React component file name = ComponentName (e.g. `StatusBadge.tsx`).
- Co-located Storybook file: `ComponentName.stories.tsx`.
- All status colors resolved through `getStatusBadgeClass(status)` /
  `getStatusColors(semantic)` — never hard-code Tailwind palette.

---

## 4. What's NOT mapped (yet)

These components exist in code but are not yet primitives in Figma. They are
either (a) shadcn/ui leafs that show up only as part of larger components, or
(b) layout shells that haven't been factored out yet:

- shadcn/ui primitives in `src/components/ui/*` (button, input, select, dialog,
  popover, sheet, tabs, ...) — used inside Rinov5/* sets above, no separate
  Figma component needed.
- Layout shells: `Header`, `Sidebar`, `MainLayout` — Figma versions live on
  `03 App Shell` page (older `Rinov5/HeaderBar/Desktop`, `Rinov5/Sidebar/...`).
- Screen-specific components under `src/components/screens/<menuId>/*` — these
  are compositions of the primitives above, not new primitives.

---

## 5. Update workflow

When a Rinov5/* component changes:

1. **Edit React code first** (it's the source of truth).
2. Open the Figma component set on page `02 Rinov5 Primitives`.
3. Update each variant to match the new code.
4. If a new variant was added, append it to the set with
   `figma.combineAsVariants()` then update the variant axes column in this doc.
5. If a new component was added, build it on the same page following the naming
   convention in §3 and append a new row to §1 + §2.
6. Bump the variant count column in §1 if it changed.
