# Booking Test Figma Rebuild Task

## Goal

Rebuild the `app/booking_test` Figma screens from the live demo UI without drifting from the approved Booking Test list screens.

## Source Of Truth

- Figma file: `frct7JUaJQBN2uOSyfMqcL`
- Figma page: `12 Booking`
- Approved baseline screens:
  - `1060:3177` - `Booking Test / BT01 List - 1912 Viewport / Original Columns`
  - `1093:3335` - `Booking Test / BT01 List - Full Width All Columns / Original Columns`
  - `1160:1296` - `Booking Test / BT02 Create Dialog - Student Dropdown Open / Component Rebuild`
- Live app route: `/app/booking_test`

## Execution Rules

- Do not copy old wrong frames.
- Do not hand-build final screen content directly inside screen frames.
- Screen frames must be composed from reusable Figma component instances.
- Add missing reusable pieces to foundation pages before using them in screens.
- Render and visually verify each screen before moving to the next one.
- Preserve table column widths. Use viewport clipping or a wider frame instead of squeezing columns.

## Foundation Components

| Component | Status | Notes |
| --- | --- | --- |
| `Rinov5/BookingTest/ListShell/1912Viewport` | Done | Approved list shell instance source |
| `Rinov5/BookingTest/TableFrame/1912Viewport` | Done | Extracted from approved `1060:3177` |
| `Rinov5/BookingTest/ListShell/01 FilterDrawerOpen` | Done | Component `1362:1868`; cloned from approved list shell and adds reusable filter sheet open state |
| `Rinov5/BookingTest/ListShell/02 SearchActiveFiltered` | Done | Component `1362:1945`; cloned from approved list shell and shows active search with one matching row |
| `Rinov5/BookingTest/ListShell/03 HorizontalScrollRight` | Done | Component `1362:1966`; cloned from approved list shell and swaps in scroll-right table state |
| `Rinov5/BookingTest/ListShell/04 RowHoverActions` | Done | Component `1362:2423`; cloned from approved list shell and swaps in hover/action table state |
| `Rinov5/BookingTest/ListShell/05 EmptyFilterResult` | Done | Component `1362:3255`; cloned from approved list shell and swaps in empty-result table state |
| `Rinov5/BookingTest/TableFrame/03 HorizontalScrollRight` | Done | Component `1362:974`; preserves original column widths and shows the right scroll position without squeezing columns |
| `Rinov5/BookingTest/TableFrame/04 RowHoverActions` | Done | Component `1362:1287`; shows first-row hover background and FileText/Phone row actions |
| `Rinov5/BookingTest/TableFrame/05 EmptyFilterResult` | Done | Component `1362:1543`; keeps table header/footer and shows the app empty state |
| `Rinov5/BookingTest/TableRow/DefaultCompleted` | Done | Extracted from approved table first row |
| `Rinov5/BookingTest/StatusStrip/Default` | Done | Extracted from approved `1060:3177` |
| `Rinov5/Shared/ModalBackdrop/Desktop1912` | Done | Reusable modal scrim |
| `Rinov5/BookingTest/CreateDialog/DateTabStudentOpen` | Done | Component `1160:1182`; corrected to live student-dropdown-open state |
| `Rinov5/BookingTest/CreateDialog/EmptyInitial` | Done | Component `1293:1680`; initial create modal before selecting student/program/branch |
| `Rinov5/BookingTest/CreateDialog/DateTabNoTeacherSlots` | Done | Component `1346:1688`; completed left form, date tab active, expanded no-teacher slot list with scrollbar |
| `Rinov5/BookingTest/CreateDialog/TeacherTab` | Done | Component `1171:2282`; schedule overlap fixed in component source |
| `Rinov5/BookingTest/CreateDialog/ValidationMissingRequired` | Done | Component `1171:2392` |
| `Rinov5/BookingTest/DetailDialog/BookedView` | Done | Component `1171:2492` |
| `Rinov5/BookingTest/DetailDialog/EditMode` | Done | Component `1171:2596` |
| `Rinov5/BookingTest/DetailDialog/CancelConfirm` | Done | Uses reusable `ConfirmDialog` instance in screen frame |
| `Rinov5/BookingTest/DetailDialog/EmployeePicker` | Done | Component `1171:2706` |
| `Rinov5/BookingTest/DetailDialog/State/01 BookedAssessment` | Done | Component `1385:1698`; item detail state for a booked assessment |
| `Rinov5/BookingTest/DetailDialog/State/02 StartedAssessment` | Done | Component `1385:1814`; item detail state for an assessment in progress |
| `Rinov5/BookingTest/DetailDialog/State/03 Completed` | Done | Component `1385:1953`; item detail state with visible result links |
| `Rinov5/BookingTest/DetailDialog/State/04 Cancelled` | Done | Component `1385:2080`; item detail state with disabled assessment fields |
| `Rinov5/BookingTest/DetailDialog/State/05 HistoryTabActive` | Done | Component `1396:1849`; item detail state with `Lịch sử` tab active and audit item visible |
| `Rinov5/BookingTest/DetailDialog/State/06 TeacherUnassigned` | Done | Component `1396:1975`; item detail state with unassigned teacher and `Chọn giáo viên` text link |
| `Rinov5/BookingTest/EmployeePicker/01 ChooseTeacherNoSelection` | Done | Component `1396:2097`; picker state with no selected teacher |
| `Rinov5/BookingTest/EmployeePicker/02 ChangeTeacherSelected` | Done | Component `1396:2156`; picker state with current teacher highlighted |
| `Rinov5/Shared/ModalBackdrop/NestedDesktop1912` | Done | Component `1396:1848`; reusable secondary backdrop for picker-over-detail states |
| `Rinov5/BookingTest/AssessmentDialog/Form2025` | Done | Component `1171:2769` |
| `Rinov5/BookingTest/AssessmentDialog/OldForm` | Done | Component `1171:2876` |
| `Rinov5/BookingTest/AssessmentDialog/EditConfirm` | Done | Component `1171:2938`; uses reusable `ConfirmDialog` instance in screen frame |
| `Rinov5/BookingTest/ResultPage/Default` | Done | Component `1171:3047` |
| `Rinov5/BookingTest/ResultPage/NotFound` | Done | Component `1171:3184` |

## Screens To Create

| Order | Figma screen | Status | Verification |
| --- | --- | --- | --- |
| 0 | `BT02 Create Dialog - Empty Initial` (`1294:7182`) | Done | Rendered; screen direct children are component instances only |
| 0.5 | `BT02 Create Dialog - Student Dropdown Open` (`1160:1296`) | Done | Rendered; corrected component source `1160:1182`; no schedule tabs/grid in this state |
| 0.75 | `BT02 Create Dialog - Date Slots No Teacher` (`1347:7070`) | Done | Rendered; screen direct children are component instances only; includes `Không chọn giáo viên`, `Thu gọn`, scrollbar, 27 slot buttons, selected `10:00` |
| BT01-1 | `BT01 List - 01 Filter Drawer Open` (`1363:7649`) | Done | Rendered; screen direct child is state component instance `1362:1868` |
| BT01-2 | `BT01 List - 02 Search Active Filtered Result` (`1363:8627`) | Done | Rendered; screen direct child is state component instance `1362:1945` |
| BT01-3 | `BT01 List - 03 Horizontal Scroll Right` (`1363:9547`) | Done | Rendered; screen direct child is state component instance `1362:1966`; fixed sticky-column overlap |
| BT01-4 | `BT01 List - 04 Row Hover Actions` (`1363:10525`) | Done | Rendered; screen direct child is state component instance `1362:2423` |
| BT01-5 | `BT01 List - 05 Empty Filter Result` (`1363:11521`) | Done | Rendered; screen direct child is state component instance `1362:3255`; fixed empty-state icon rendering |
| 1 | `BT02 Create Dialog - Teacher Tab` (`1171:3277`) | Done | Rendered; fixed teacher schedule overlap |
| 2 | `BT02 Create Dialog - Validation Missing Required` (`1171:3846`) | Done | Rendered |
| 3 | `BT03 Detail Dialog - Booked View` (`1171:4405`) | Done | Rendered |
| 4 | `BT03 Detail Dialog - Edit Mode` (`1171:4968`) | Done | Rendered |
| 5 | `BT03 Detail Dialog - Cancel Confirm` (`1171:5537`) | Done | Rendered |
| 6 | `BT03 Detail Dialog - Employee Picker` (`1171:6108`) | Done | Rendered |
| BT03-S1 | `BT03 Detail Item - 01 Booked Assessment` (`1386:8184`) | Done | Rendered; screen direct children are list-shell, backdrop, and detail-state component instances |
| BT03-S2 | `BT03 Detail Item - 02 Started Assessment` (`1386:8788`) | Done | Rendered; screen direct children are list-shell, backdrop, and detail-state component instances |
| BT03-S3 | `BT03 Detail Item - 03 Completed` (`1386:9427`) | Done | Rendered; screen direct children are list-shell, backdrop, and detail-state component instances |
| BT03-S4 | `BT03 Detail Item - 04 Cancelled` (`1386:10049`) | Done | Rendered; screen direct children are list-shell, backdrop, and detail-state component instances |
| BT03-S5 | `BT03 Detail Item - 05 History Tab Active` (`1397:10037`) | Done | Rendered; screen direct children are component instances only |
| BT03-S6 | `BT03 Detail Item - 06 Teacher Unassigned` (`1397:10626`) | Done | Rendered; screen direct children are component instances only |
| BT03-S7 | `BT03 Detail Item - 07 Choose Teacher Picker` (`1397:11231`) | Done | Rendered; screen direct children are component instances only |
| BT03-S8 | `BT03 Detail Item - 08 Change Teacher Picker` (`1397:11865`) | Done | Rendered; screen direct children are component instances only |
| 7 | `BT04 Assessment - Form 2025` (`1171:6734`) | Done | Rendered |
| 8 | `BT04 Assessment - Old Form` (`1171:7300`) | Done | Rendered |
| 9 | `BT04 Assessment - Edit Confirm` (`1171:7821`) | Done | Rendered |
| 10 | `BT05 Result Page` (`1171:8397`) | Done | Rendered |
| 11 | `BT05 Result Page - Not Found` (`1171:8535`) | Done | Rendered |

## Current Session Log

- Created this task file so progress survives context compaction.
- Created the remaining Booking Test modal/detail/assessment/result screens as full-page frames from reusable component instances.
- Repaired the modal frames that initially missed their direct modal instances, then verified the direct children for each screen.
- Rendered all 12 component-rebuild screens. The first Teacher Tab render exposed an overlap in `Rinov5/BookingTest/CreateDialog/TeacherTab`; fixed the component source and re-rendered `1171:3277`.
- Current valid screens are component-instance based. Do not rebuild these screens by editing old hand-built frames.
- Added the missing initial create-dialog state from the live screenshot: component `1293:1680` in `02 Rinov5 Primitives`, screen `1294:7182` in `12 Booking`. The screen uses only list-shell, backdrop, and modal component instances.
- Repaired `1160:1296` to match the live create-dialog student dropdown state. Updated component `1160:1182` in `02 Rinov5 Primitives`; screen `1160:1296` still contains only list-shell, backdrop, and modal component instances.
- Added completed-information date-tab state with no-teacher slot selection visible: component `1346:1688` in `02 Rinov5 Primitives`, screen `1347:7070` in `12 Booking`. The screen uses only list-shell, backdrop, and modal component instances.
- Repaired `1347:7070` after review: added the missing `Không chọn giáo viên` title, `Thu gọn` action, visible vertical scrollbar, 27 visible slot buttons starting at `09:00`, and selected `10:00`.
- Added five BT01 list states as full-page screens in `12 Booking`: filter drawer open (`1363:7649`), active search/filtered result (`1363:8627`), horizontal scroll right (`1363:9547`), row hover/actions (`1363:10525`), and empty filter result (`1363:11521`).
- Added reusable list-shell state components in `03 Rinov5 App Shell` and table state components for scroll-right, row-hover, and empty-result. Final screen frames contain only one direct list-shell state instance each.
- Rendered all five new list states. Fixed the scroll-right sticky-column overlap and the empty-result icon rendering issue before marking the screens done.
- Repaired `BT01 List - 03 Horizontal Scroll Right` after review: removed the unintended sticky vertical divider plus header/body row dividers from component `1362:974`; re-rendered screen `1363:9547`.
- Repaired table row-line drift after review: removed `Header divider` and `Row divider *` from base table component `1160:614`, hover table component `1362:1287`, and legacy list frames `1060:3177`, `1093:3335`, `1259:18238`. Verified target screens `1363:8627`, `1363:10525`, `1060:3177`, `1093:3335`, and `1259:18238` now have zero header/body row divider nodes.
- Added four reusable Booking Test item-detail state components in `02 Rinov5 Primitives`: booked assessment (`1385:1698`), started assessment (`1385:1814`), completed (`1385:1953`), and cancelled (`1385:2080`).
- Created four full-page item-detail state screens in `12 Booking`: `1386:8184`, `1386:8788`, `1386:9427`, and `1386:10049`. Each screen is composed only from `ListShell`, `ModalBackdrop`, and one detail-state component instance.
- Rendered all four new item-detail screens. Fixed the booked assessment action button wrapping and moved completed/started result links upward in the component sources so links remain visible inside the modal.
- Added detail history and teacher assignment states: history tab active (`1396:1849`), teacher unassigned with `Chọn giáo viên` link (`1396:1975`), employee picker no-selection (`1396:2097`), employee picker change-teacher selected state (`1396:2156`), and nested picker backdrop (`1396:1848`).
- Created four full-page detail interaction screens in `12 Booking`: history active (`1397:10037`), teacher unassigned (`1397:10626`), choose-teacher picker (`1397:11231`), and change-teacher picker (`1397:11865`). Each screen was verified to contain only reusable component instances as direct children.
- Rendered all four new screens. Fixed the `Đã hủy` status badge width in `1396:1849` after render review.
