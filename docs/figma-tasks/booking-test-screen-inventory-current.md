# Booking Test Screen Inventory - Current `/app/booking_test`

Generated: 2026-06-01

## Purpose

This file lists the current screens and interaction states that should be rebuilt in Figma for `/app/booking_test`.
It is the working inventory for the Rinoedu Figma file before creating or replacing frames in the `12 Booking v2` page.

The Figma output must be composed from reusable Figma components and component instances. Do not paste screenshots into final screen frames, and do not hand-build shell, toolbar, table, dialog, drawer, popover, or icon objects directly inside screen frames.

## Source Of Truth

| Item | Value |
| --- | --- |
| App route | `/app/booking_test` |
| Result route | `/app/booking_test/results/[bookingId]` |
| Current app screenshot | `artifacts/booking-test-current.png` |
| Figma file | `Rinoedu` (`frct7JUaJQBN2uOSyfMqcL`) |
| Figma page/canvas to update | `12 Booking v2` (`1899:12321`) |
| Primary screen source | `src/components/screens/booking-test/BookingTestScreen.tsx` |
| Result page source | `src/components/screens/booking-test/BookingTestResultPage.tsx` |
| Mock data source | `src/mocks/bookingTests.ts` |

## Current Scope Notes

- `/app/booking_test` currently uses `src/components/screens/booking-test/BookingTestScreen.tsx`.
- `/app/booking_test_v2` uses `src/components/screens/booking-test-v2/BookingTestScreenV2.tsx` and is not the source for this inventory.
- The current `/app/booking_test` screen does not expose a create-booking dialog. Do not create BT02 Create Dialog states for the current page unless product confirms that v2 create flow is being migrated back into `/app/booking_test`.
- The current assessment dialog uses the 2025 form only. Do not create old-form assessment states for the current page unless product confirms the old form is still required.
- The `Toán` subject tab is visible but disabled in the toolbar. It is represented in the default state; there is no separate Math-list screen in current `/app/booking_test`.

## Component Composition Contract

Before creating screen frames, make sure these reusable Figma sources exist or are updated:

| Area | Required reusable Figma source |
| --- | --- |
| App shell | Header, sidebar, active Booking Test navigation, workspace frame |
| Toolbar | Status tiles, segmented subject control, branch select, expandable search, filter icon button |
| Table | Data table shell, sticky checkbox column, sticky booking column, row variants, footer pagination |
| Badges and chips | Status badge, subject badge, score chips, check-in pill |
| Inputs | Inline select, branch select, search input, filter checkboxes |
| Overlays | Modal backdrop, nested modal backdrop, right filter sheet, popover |
| Dialogs | Booking detail dialog, employee picker dialog, assessment dialog, confirm dialog |
| Result page | Detail page header, panels, info fields, score display |
| Icons | Search, Filter, Phone, Copy, Users, Clock, FileText, ExternalLink, MessageSquare, UserCheck, UserPlus, XCircle, CheckCircle, SendHorizontal, ChevronDown |

Screen frames may contain representative text and data, but shell, primitives, icons, table rows, dialogs, popovers, drawers, and footers must come from the reusable component sources.

## Data Samples To Use

Use these mock rows to keep the Figma states stable and traceable:

| Sample | Purpose |
| --- | --- |
| `E0001` - Vu Phuc An | Completed, checked-in, has family popover, result link visible |
| `E0002` - Truc My | Booked assessment with assigned teacher |
| `E0004` - Tuong Vi | Booked assessment with no teacher assigned |
| `E0005` - Bao Chau | Started assessment, checked-in, assessment action visible |
| `E0007` - Gia Bao | Cancelled booking |
| Invalid id, for example `E9999` | Result page not found state |

## Required Full-Page Screens

| ID | Recommended Figma frame name | Trigger / state | Required content |
| --- | --- | --- | --- |
| BT00 | `Booking Test / 00 Current Source Check / Component Coverage` | Documentation frame only | Route, screenshot reference, component coverage checklist, exclusions for create dialog and old form |
| BT01-01 | `Booking Test / BT01 List - 01 Default / Current App` | Open `/app/booking_test` as admin | Full shell, active Booking Test sidebar item, status strip first row, subject and branch controls second row, search/filter controls, table with 5 English rows, footer pagination |
| BT01-02 | `Booking Test / BT01 List - 02 Branch Dropdown Open / Current App` | Open branch selector | Same full page plus open branch menu with available branches |
| BT01-03 | `Booking Test / BT01 List - 03 Search Active Result / Current App` | Search returns at least one row | Search input expanded with query, matching row list, updated footer count |
| BT01-04 | `Booking Test / BT01 List - 04 Empty Search Result / Current App` | Search or filters return no rows | Full page with table header/footer and `EmptyState` inside table body |
| BT01-05 | `Booking Test / BT01 List - 05 Filter Drawer Open / Current App` | Click filter icon with no selected filters | Full page plus right filter sheet, sections for school, status, conditions, teachers, weekdays, programs, subjects, sales, disabled clear button |
| BT01-06 | `Booking Test / BT01 List - 06 Filter Drawer Selected / Current App` | Select one or more filter options | Filter icon count visible, selected section badges, enabled clear button, applied table result |
| BT01-07 | `Booking Test / BT01 List - 07 Row Hover Actions / Current App` | Hover a row | Hover action icons shown in booking column: check-in when pending, open assessment when eligible, assign teacher when unassigned, phone action |
| BT01-08 | `Booking Test / BT01 List - 08 Family Popover Open / Current App` | Click family contacts icon on a row with multiple family members | Full page plus family popover with member names, masked phones, call and copy actions |
| BT01-09 | `Booking Test / BT01 List - 09 Level Select Open / Current App` | Open inline level dropdown on editable row | Full page with opened level select; disabled selects must stay visually disabled on non-editable rows |
| BT01-10 | `Booking Test / BT01 List - 10 Horizontal Scroll Right / Current App` | Table scrolled horizontally to right columns | Sticky checkbox and booking columns still visible, right columns visible: Speaking, LWR, status, result, staff, notes |
| BT01-11 | `Booking Test / BT01 List - 11 Teacher Role Scoped / Current App` | Login as teacher role | Full list filtered to bookings assigned to the current teacher/tester; teacher-only visibility behavior represented |

## Required Detail Dialog Screens

Each detail state must be a full-page frame: list shell behind it, modal backdrop, then the reusable detail dialog component instance.

| ID | Recommended Figma frame name | Sample | Required content |
| --- | --- | --- | --- |
| BT03-01 | `Booking Test / BT03 Detail - 01 Booked Assigned / Current App` | `E0002` | Header with avatar, status, code, check-in button, cancel action, family panel, result panel, responsible panel, notes side tab |
| BT03-02 | `Booking Test / BT03 Detail - 02 Started Assessment / Current App` | `E0005` | Started status, action buttons for fail, complete, open assessment, scores, responsible staff, notes |
| BT03-03 | `Booking Test / BT03 Detail - 03 Completed / Current App` | `E0001` | Completed status, no cancel action, visible result links where applicable, completed scores |
| BT03-04 | `Booking Test / BT03 Detail - 04 Cancelled / Current App` | `E0007` | Cancelled status, no active destructive actions, schedule and notes still readable |
| BT03-05 | `Booking Test / BT03 Detail - 05 Teacher Unassigned / Current App` | `E0004` | Responsible panel shows unassigned teacher placeholder and assignable teacher card |
| BT03-06 | `Booking Test / BT03 Detail - 06 Notes Typing / Current App` | Any detail row | Notes tab active with text entered in note composer and send button enabled |
| BT03-07 | `Booking Test / BT03 Detail - 07 History Tab / Current App` | Row with notes | Side panel history tab active, audit-style items visible |
| BT03-08 | `Booking Test / BT03 Detail - 08 Cancel Confirm / Current App` | `E0002` or `E0005` | Confirm dialog over detail modal for cancel action |

## Required Employee Picker Screens

These are also full-page frames over the list/detail context, not isolated dialog crops.

| ID | Recommended Figma frame name | Trigger / state | Required content |
| --- | --- | --- | --- |
| BT03-09 | `Booking Test / BT03 Detail - 09 Choose Teacher Picker / Current App` | Open picker from unassigned teacher in detail | Detail dialog behind, nested backdrop, employee picker with search, tabs, employee rows |
| BT03-10 | `Booking Test / BT03 Detail - 10 Change Teacher Picker / Current App` | Open picker from assigned teacher in detail | Current teacher highlighted with check icon |
| BT03-11 | `Booking Test / BT03 Detail - 11 Teacher Conflict Search / Current App` | Search exact teacher who is double-booked | Conflicting employee row disabled with conflict reason |
| BT01-12 | `Booking Test / BT01 List - 12 Quick Assign Teacher Picker / Current App` | Click row hover assign-teacher action on `E0004` | Picker opens from table row state; same employee picker component, list shell behind |
| BT03-12 | `Booking Test / BT03 Detail - 12 Picker Empty Result / Current App` | Search no matching employee | Employee picker empty state |

## Required Assessment Dialog Screens

Each assessment state must be a full-page frame with list shell behind it, modal backdrop, and assessment dialog component instance.

| ID | Recommended Figma frame name | Trigger / state | Required content |
| --- | --- | --- | --- |
| BT04-01 | `Booking Test / BT04 Assessment - 01 Editable Form 2025 / Current App` | Open assessment for eligible started English booking | Compact header, evaluator metadata, score summary, skip button, 8-column scoring grid, teacher feedback, weakness list, footer cancel/save actions |
| BT04-02 | `Booking Test / BT04 Assessment - 02 Read Only Result / Current App` | Assessment has stored/result data and is not in edit mode | Read-only banner, open result button, disabled controls, close and edit actions |
| BT04-03 | `Booking Test / BT04 Assessment - 03 Edit Confirm / Current App` | Click edit on completed result | Confirm dialog over assessment modal |
| BT04-04 | `Booking Test / BT04 Assessment - 04 Edit Mode Existing Result / Current App` | Confirm edit | Edit warning banner, editable controls, cancel edit and save update actions |
| BT04-05 | `Booking Test / BT04 Assessment - 05 Skipped / Current App` | Toggle skipped state | Skip button active, unanswered score cells disabled, footer save action still visible |

## Required Result Page Screens

These are routed pages, not modals.

| ID | Recommended Figma frame name | Route / state | Required content |
| --- | --- | --- | --- |
| BT05-01 | `Booking Test / BT05 Result Page - 01 Found / Current App` | `/app/booking_test/results/E0001` | Page header with back button, status, result overview panels, student info, score display, schedule side panel, contacts panel |
| BT05-02 | `Booking Test / BT05 Result Page - 02 Not Found / Current App` | `/app/booking_test/results/E9999` | Full shell and empty state for missing assessment result |

## Optional Or Lower-Priority Screens

| ID | Screen | Reason |
| --- | --- | --- |
| BT01-O1 | Loading skeleton | Route uses suspense loading, but this is short-lived and not central to the Booking Test review |
| BT01-O2 | Phone copy success | Small icon state; can be covered inside row or family popover component spec |
| BT01-O3 | Row selected checkbox state | No bulk action toolbar exists in current screen, so this is component-level unless product asks |
| BT02-O1 | Create booking dialog states | Not present in current `/app/booking_test`; only include if v2 create flow is approved for this route |
| BT04-O1 | Old assessment form states | Not present in current `/app/booking_test`; only include if old form is confirmed required |
| BT01-O4 | Separate Math list | Math tab is disabled in current toolbar; default screen already shows disabled state |

## Known Differences From Existing Figma Frames

- Existing Figma default list still shows create-booking action; current `/app/booking_test` does not.
- Current toolbar puts status tiles above subject/branch/search/filter controls.
- Current status strip includes `Đã check-in`.
- Current sidebar label is `Kiểm tra/Trải nghiệm`; older frames may still show `Đặt lịch test`.
- Current table uses 5 English rows under the default subject because Math is disabled in the subject tabs.
- Current BT04 assessment flow is `Form2025Section`; old-form frames from previous Figma work should not be used for the current inventory.

## Verification Checklist For Figma Build

- Each screen frame is full-page, not a cropped dialog or table.
- Direct children of final screen frames are reusable component instances wherever possible.
- Shell, toolbar, table, filter drawer, modal, popover, employee picker, confirm dialog, and icons are not hand-built inside screen frames.
- The default list visually matches `artifacts/booking-test-current.png`.
- All required screens above have rendered screenshots.
- Any previous frame that conflicts with this inventory is renamed as superseded or replaced clearly.
