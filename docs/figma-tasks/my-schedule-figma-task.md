# My Schedule Figma Task

## Scope

- App route: `/app/my_schedule`
- Target Figma file: `Rinoedu` (`frct7JUaJQBN2uOSyfMqcL`)
- Target page: `11 Calendar` (`57:79`)
- Baseline screenshots: `tmp/my-schedule-baseline-current/`
- Desktop viewport: `1912 x 914`

## Execution Rule

- Do not create final review frames by hand.
- Use the current app implementation as the visual baseline for each state.
- Create/update editable source components in `03 Rinov5 App Shell` first.
- Each final frame in `11 Calendar` must contain a source component instance.
- Render/check each final frame before moving to the next frame.

## App Baseline Notes

- `app/my_schedule` uses the shared calendar toolbar and schedule grid.
- Same-day same-time items are displayed as side-by-side columns.
- My Schedule cards hide the top time line; the schedule grid time axis provides time context.
- Regular class cards still open the current development toast.
- Trial-class cards open the trial-class detail dialog.
- Placement-test event cards open the booking-test detail dialog.
- 2026-05-28 update: source components were rebuilt as editable Figma layers instead of screenshot image fills.

## Required Screen / State List

- [x] MS01 Week Board - default current week.
- [x] MS02 Week Board - scrolled to overlapping class cards.
- [x] MS03 Day View - day segmented control selected.
- [x] MS04 Search Active - search input expanded with `Robot`.
- [x] MS05 Empty Search - search has no matching schedule cards.
- [x] MS06 Filter Sheet Open - personal schedule filter sheet.
- [x] MS07 Branch Dropdown Open - center dropdown open.
- [x] MS08 Class Card Click Toast - regular class click development toast.
- [x] MS09 Trial Class Detail Modal - trial-class detail dialog.
- [x] MS10 Booking Test Detail Modal - booking-test detail dialog.

## Foundation Intake

- [x] `01 Rinov5 Foundations` inspected.
- [x] `02 Rinov5 Primitives` inspected.
- [x] `03 Rinov5 App Shell` inspected.
- [x] `04 Rinov5 Asset Library` inspected.
- [x] No missing external asset blocker found for the editable source-component workflow.

## Figma Frame IDs

- MS01: `1539:8309`
- MS02: `1540:8310`
- MS03: `1541:8311`
- MS04: `1542:8312`
- MS05: `1543:8313`
- MS06: `1544:8314`
- MS07: `1545:8315`
- MS08: `1546:8316`
- MS09: `1547:8317`
- MS10: `1548:8318`

## Verification

- [x] Source image fills removed/verified: 10/10 sources now have `0` image fills.
- [x] Source components rebuilt as editable shell, toolbar, time-grid, schedule cards, empty state, dropdown, filter sheet, toast, and modal layers.
- [x] My Schedule editable component assets added to `04 Rinov5 Asset Library`: app shell blocks, vector icons, toolbar states, schedule-card states, grid states, dropdown, filter sheet, toast, and detail dialogs.
- [x] MS01-MS10 source components now compose those asset-library components as instances instead of direct freehand layer groups.
- [x] Final frames structurally verified: 10/10 frames are `1912 x 914`, each with exactly one source component instance.
- [x] Representative renders verified after rebuild: MS01 Week Board, MS06 Filter Sheet Open, MS10 Booking Test Detail Modal.
- [x] Historical screenshot-backed baselines are superseded by editable source layers.
- [x] Historical 2026-05-22 `npx tsc --noEmit` passed for the previous screenshot-backed sync.
- [x] Historical 2026-05-22 `npx eslint "src/**/*.{ts,tsx}"` passed with existing warnings only.
- [ ] 2026-05-28 code verification not rerun; this update is Figma-only and the local app is currently affected by unrelated in-progress migration/build work.

## Progress Log

- 2026-05-22: Rechecked `app/my_schedule` code and live app.
- 2026-05-22: Fixed My Schedule card usage so cards hide the top time line.
- 2026-05-22: Recaptured MS01-MS10 live app baselines.
- 2026-05-22: Created My Schedule source components in `03 Rinov5 App Shell`.
- 2026-05-22: Created and checked MS01-MS10 final review frames in `11 Calendar`.
- 2026-05-22: Re-captured clean baselines without dev overlay and re-uploaded all source images.
- 2026-05-28: Rechecked updated `app/my_schedule` code. The screen now uses the shared `ScheduleTimeGrid`, `MyScheduleToolbar`, and compact `MyScheduleCard` with hidden card time labels.
- 2026-05-28: Rebuilt MS01-MS10 source components in `03 Rinov5 App Shell` as editable Figma elements; removed screenshot fills from all My Schedule sources.
- 2026-05-28: Reverified final frames MS01-MS10 remain instance-only review frames and rendered MS01/MS06/MS10 for visual QA.
- 2026-05-28: Added reusable My Schedule asset components in `04 Rinov5 Asset Library`, rebuilt source components from those instances, removed duplicate assets from a timed-out retry, and verified all source instances remain linked.
