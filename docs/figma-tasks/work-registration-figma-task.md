# Work Registration Figma Sync Task

Date: 2026-05-22
Route: `/app/work_registration`
Figma file: `frct7JUaJQBN2uOSyfMqcL`
Target page: `11 Calendar`

## Source Baseline

Real app screenshots captured at `1912x914`:

- `tmp/work-registration-baseline/01-mine-default.png`
- `tmp/work-registration-baseline/02-staff-split.png`
- `tmp/work-registration-baseline/03-staff-list.png`
- `tmp/work-registration-baseline/04-staff-grid.png`
- `tmp/work-registration-baseline/05-staff-filter-open.png`
- `tmp/work-registration-baseline/06-center-overview.png`
- `tmp/work-registration-baseline/07-center-branch-detail-modal.png`
- `tmp/work-registration-baseline/08-warning-modal.png`
- `tmp/work-registration-baseline/09-priority-setup-view.png`
- `tmp/work-registration-baseline/10-priority-setup-edit.png`
- `tmp/work-registration-baseline/11-clear-confirm.png`
- `tmp/work-registration-baseline/12-mine-draft-selection.png`
- `tmp/work-registration-baseline/13-staff-delegate-week.png`
- `tmp/work-registration-baseline/14-staff-slot-detail-modal.png`

## Current Figma Nodes Checked

- `711:2` - `01 Mine - Week`
- `875:1384` - `13 Mine - Week Draft Sweep Selection`
- `729:968` - `12 Clear Week Confirm`
- `713:60` - `03 Staff - Week`
- `719:246` - `09 Staff - Delegate Week`
- `716:122` - `06 Staff - Filter Open`
- `729:277` - `10 Slot Detail Dialog`
- `715:91` - `05 Center - Overview`
- `732:988` - `11 Branch Detail Dialog`
- Related existing modals found on page:
  - `717:153` - `07 Warning Dialog`
  - `760:1067` - `08 Golden Hour Setup Dialog`
  - `901:1345` - `19 Warning Dialog` duplicate/legacy candidate

## Drift Findings

- Toolbar is stale in existing Figma: it still includes week navigation, today button, search/filter icons, and global center selector in states where the current app no longer shows them.
- Sidebar state is inconsistent: current app uses expanded sidebar on `Mine`, but collapsed sidebar on `Staff` and `Center`; some Figma center/detail states still use expanded sidebar or old offsets.
- `Mine` grid cell visual state has changed: current app uses purple assigned-class cells and sparse star priority markers; Figma still shows green registered labels.
- Staff tab has three visible layouts in the app: split, list-only, and grid-only. Figma currently has split/delegate/filter/detail, but no current list-only and grid-only review frames.
- Center overview metric/table layout and footer have changed from the Figma versions.
- Warning dialog and priority setup dialog copy/layout differ from current app.
- Clear confirm dialog differs in position, width, copy, and background state.

## Required Screen/State List

- [x] WR01 Mine default week - update existing `711:2`
- [x] WR02 Mine draft/sweep selection - update existing `875:1384`
- [x] WR03 Clear week confirm - update existing `729:968`
- [x] WR04 Staff split - update existing `713:60`
- [x] WR05 Staff list-only - create new frame `1513:9334`
- [x] WR06 Staff grid-only - create new frame `1513:9385`
- [x] WR07 Staff filter open - update existing `716:122`
- [x] WR08 Staff delegate week - update existing `719:246`
- [x] WR09 Staff slot detail dialog - update existing `729:277`
- [x] WR10 Center overview - update existing `715:91`
- [x] WR11 Center branch detail dialog - update existing `732:988`
- [x] WR12 Warning dialog - update existing `717:153`; marked `901:1345` as legacy duplicate
- [x] WR13 Golden hour setup view - update existing `760:1067`
- [x] WR14 Golden hour setup edit - create new frame `1513:9450`

## Execution Rule

Each final review frame must be replaced by an instance of a source component generated from the current app baseline. Do not keep locally hand-edited shell/toolbars inside the review frame.

## Progress Log

- [x] Read current code for tab, modal, and state inventory.
- [x] Captured real app baseline screenshots.
- [x] Rendered/inspected existing Figma nodes and identified drift.
- [x] Captured missing draft/delegate/slot-detail baselines after comparing existing Figma states.
- [x] Created source components in `03 Rinov5 App Shell` from current app baselines.
- [x] Replaced each final review frame with a source component instance.
- [x] Rendered updated frames to `tmp/work-registration-figma-updated`.
