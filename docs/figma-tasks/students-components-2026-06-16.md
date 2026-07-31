# Students Components Figma Report - 2026-06-16

## Scope

- Route checked: `/app/students`
- Source screen: `src/components/screens/students/StudentsScreen.tsx`
- Target Figma file: Rinoedu (`frct7JUaJQBN2uOSyfMqcL`)
- User constraints: no pasted images, no component set, avoid duplicates.

## Live App Baseline

Captured from the running Next.js app at `http://localhost:3000/app/students`.

- Table width: 2640px
- Visible parent rows: 20
- Full column headers: checkbox, Hoc vien/Goi hoc, Lien he / GV phu trach, Lop hoc, Ngay sinh / Lich hoc, Trang thai, Trinh do & Sub level, Thoi gian hoc, Truong & Phong hoc, Chuong trinh & lo trinh, Chuong trinh, Bai hoc tiep theo.
- Expanded row behavior: parent row plus one class detail sub-row.
- Filter sheet width: 448px.

Evidence files:

- `docs/figma-tasks/evidence/2026-06-16-students-components/students-page-collapsed.png`
- `docs/figma-tasks/evidence/2026-06-16-students-components/students-page-row-hover.png`
- `docs/figma-tasks/evidence/2026-06-16-students-components/students-page-expanded.png`
- `docs/figma-tasks/evidence/2026-06-16-students-components/students-filter-expanded.png`
- `docs/figma-tasks/evidence/2026-06-16-students-components/students-filter-collapsed.png`

## Figma Placement

### 02 Rinov5 Primitives

Placed at `x=1420`, `y=3920`, near the existing Data Table and Filters primitive area.

Created standalone primitive components:

- `Rinov5/Students/TableHeader/FullColumns` - `3285:2383`
- `Rinov5/Students/TableRow/ParentCollapsed` - `3285:2409`
- `Rinov5/Students/TableRow/ParentHoverActions` - `3285:2448`
- `Rinov5/Students/TableRow/ParentExpanded` - `3285:2494`
- `Rinov5/Students/TableRow/ClassSubRow` - `3285:2533`
- `Rinov5/Students/Filters/SectionExpanded` - `3285:2568`
- `Rinov5/Students/Filters/SectionCollapsed` - `3285:2585`

### 04 Rinov5 Asset Library

Placed at `x=34200`, `y=5400`, below the Classes roster/component cluster so Students module assets sit with comparable module-specific assets.

Created standalone module components:

- `Rinov5/Students/ListTable/FullColumnsCollapsed` - `3286:3841`
- `Rinov5/Students/ListTable/FullColumnsHover` - `3286:4030`
- `Rinov5/Students/ListTable/FullColumnsExpanded` - `3286:4226`
- `Rinov5/Students/FilterModal/FullExpanded` - `3286:4411`
- `Rinov5/Students/FilterModal/CompactCollapsed` - `3286:4650`
- `Rinov5/Students/FilterModal/SetupCollapsedAll` - `3318:5876`
- `Rinov5/Students/StatusFilter/SelectedAll` - `3305:5000`
- `Rinov5/Students/StatusFilter/SelectedPendingPayment` - `3305:5062`
- `Rinov5/Students/StatusFilter/SelectedDraftClass` - `3305:5124`
- `Rinov5/Students/StatusFilter/SelectedWaitForAssignment` - `3305:5186`
- `Rinov5/Students/StatusFilter/SelectedEnrollLater` - `3305:5248`
- `Rinov5/Students/StatusFilter/SelectedPendingTransfer` - `3305:5310`
- `Rinov5/Students/StatusFilter/SelectedFeeTransfer` - `3305:5372`
- `Rinov5/Students/StatusFilter/SelectedAwaitingOpening` - `3305:5434`
- `Rinov5/Students/StatusFilter/SelectedTrial` - `3305:5496`
- `Rinov5/Students/StatusFilter/SelectedActive` - `3305:5558`
- `Rinov5/Students/StatusFilter/SelectedReserve` - `3305:5620`
- `Rinov5/Students/StatusFilter/SelectedSessionEnded` - `3305:5682`

Rendered Figma evidence:

- `docs/figma-tasks/evidence/2026-06-16-students-components/figma-students-table-expanded.png`
- `docs/figma-tasks/evidence/2026-06-16-students-components/figma-students-filter-full.png`
- `docs/figma-tasks/evidence/2026-06-16-students-components/figma-students-filter-compact.png`
- `docs/figma-tasks/evidence/2026-06-16-students-components/figma-students-filter-full-with-counts.png`
- `docs/figma-tasks/evidence/2026-06-16-students-components/figma-students-status-filter-selected-active.png`
- `docs/figma-tasks/evidence/2026-06-16-students-components/figma-students-filter-full-rebuilt.png`
- `docs/figma-tasks/evidence/2026-06-16-students-components/figma-students-filter-collapsed-all-rebuilt.png`

## Follow-up Update: Filter Counts

- Added right-aligned `Count` text nodes to `Rinov5/Students/Filters/SectionExpanded` (`3285:2568`).
- Updated `Rinov5/Students/FilterModal/FullExpanded` (`3286:4411`) option labels and counts across 13 expanded filter groups.
- Count examples use the current Students mock data, such as branch counts `9 / 5 / 6 / 20`.
- The compact collapsed modal remains collapsed; option-level counts are not visible in that state.

## Follow-up Update: Filter Rebuild

- Rebuilt `Rinov5/Students/FilterModal/FullExpanded` (`3286:4411`) as a full setup component composed from small group instances.
- Created `Rinov5/Students/FilterModal/SetupCollapsedAll` (`3318:5876`) for the all-collapsed state.
- Created 26 standalone group components: 13 expanded and 13 collapsed, one pair per Students filter group.
- Source data checked from `app/students`: branches, levels, subjects, programs, packages, classes, class types, teachers, sales, remaining sessions, genders, enrollment date ranges, and age ranges.
- Searchable groups include search input and scroll preview; enrollment date group includes custom date range fields.

## Audit

- Existing `Rinov5/Students/*` components before creation: 0.
- Created components: 12.
- Created component sets: 0.
- Image fills in created components: 0.
- Follow-up count update audit: 52 count text nodes in the full filter modal, 0 image fills, 0 component sets.
- Status filter update: 12 standalone selected-state components, 0 image fills, 0 component sets.
- Filter rebuild audit: 26 standalone group components, 2 setup modal components, 26 group instances across setup modals, 0 image fills, 0 component sets.
- Module component instance usage: 41 total nested instances across module-level components.
- Final output is editable Figma nodes, not screenshots.
