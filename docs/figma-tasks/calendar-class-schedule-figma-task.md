# Calendar Class Schedule Figma Task

## Goal

Keep the `app/calendar_class_schedule` Figma screens aligned with the live Rinov5 demo UI, using reusable component sources and final screen frames that contain component instances only.

## Source Of Truth

- Figma file: `frct7JUaJQBN2uOSyfMqcL`
- Figma page: `11 Calendar` (`57:79`)
- Live app route: `/app/calendar_class_schedule`
- Current verification server used in this refresh: `http://127.0.0.1:3000/app/calendar_class_schedule`
- Current live-app capture files: `tmp/calendar-class-current-*.png`
- Current Figma verification renders: `tmp/figma-calendar-current/*.png`

## Execution Rules

- Final review frames must be composed from one reusable component instance.
- Recurring UI belongs in foundation/component pages first:
  - Icons: `04 Rinov5 Asset Library`
  - Primitive cards/controls: `02 Rinov5 Primitives`
  - Shell and screen source components: `03 Rinov5 App Shell`
- Do not draw directly inside final screen frames.
- Current shell geometry is header `64px`, expanded sidebar `288px`, content starts at `x=288`.
- Verify every updated Figma screen by rendering a screenshot.

## Current App Changes Captured On 2026-05-28

- Sidebar is currently expanded in the verified app state.
- Toolbar positions match the current `288px` expanded sidebar layout from the live app.
- Current verified default week is `25 thg 5 - 31 thg 5` because the app runtime date is 2026-05-28.
- Session cards now reflect date/status:
  - Past sessions use warm orange surfaces.
  - Today sessions use neutral surfaces.
  - Upcoming sessions use light blue surfaces.
  - Cancelled sessions use muted grey surfaces and strikethrough title.
- Session cards no longer show badge or recurring icons in the current live app state.
- Session cards include attended student counts and substitute teacher avatar overlap.
- Filter drawer now includes Subject, Status, Session Type, and Teacher sections.
- Search states show per-day empty states instead of a single global empty screen.
- Branch dropdown remains a full-page state with the popover open over the board.

## Screens

| Order | Screen | Purpose | Status | Verification |
| --- | --- | --- | --- | --- |
| CS01 | Week Board (`1406:6951`) | Default weekly class schedule | Refreshed 2026-05-28 | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/01 Week Board` instance |
| CS02 | Day View (`1406:7282`) | Day mode showing session cards | Refreshed 2026-05-28 | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/02 Day View` instance |
| CS03 | Search Active (`1406:7446`) | Expanded search with filtered cards | Refreshed 2026-05-28 | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/03 Search Active` instance |
| CS04 | Empty Search (`1406:7658`) | Search has no matching sessions | Refreshed 2026-05-28 | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/04 Empty Search` instance |
| CS05 | Filter Drawer Open (`1406:7791`) | Advanced filter sheet open | Refreshed 2026-05-28 | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/05 Filter Drawer Open` instance |
| CS06 | Branch Dropdown Open (`1406:8139`) | Branch combobox menu open | Refreshed 2026-05-28 | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/06 Branch Dropdown Open` instance |
| CS07 | Session Detail Dialog (`1406:8476`) | Existing previous detail modal state | Not refreshed in this pass | Needs a separate refresh if the live detail dialog changed |
| CS08 | Current Week Board (`1457:5437`) | Week `25 thg 5 - 31 thg 5` aligned to the live app current week | Refreshed 2026-05-28 | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/08 Current Week Board` instance |

## Foundation Components

| Component | Status | Notes |
| --- | --- | --- |
| `Icon / Repeat / 24` (`1440:2`) | Added | Added to `04 Rinov5 Asset Library` from Lucide-style SVG; wrapper stroke fixed after screenshot review. |
| `Icon / CalendarClock / 24` (`1440:8`) | Added | Added to `04 Rinov5 Asset Library` for rescheduled sessions. |
| `Rinov5 / Sidebar / CalendarClass / Expanded` (`1406:4975`) | Updated | Expanded 288px calendar-active sidebar used by Calendar Class Schedule source components. |
| `Rinov5/CalendarClass/AppShell/SidebarCollapsed` (`1442:4496`) | Superseded | Kept in file, but current verified screens use the expanded sidebar. |
| `Rinov5/CalendarClass/SessionCard/Default` (`1406:5032`) | Updated | Current card primitive matches the live app card without badge or recurring icon, with attended count and substitute avatar pattern. |
| `Rinov5/CalendarClass/SessionCard/Rescheduled` (`1449:5995`) | Updated | Kept as a reusable primitive, but aligned visually to the current card anatomy because the live screen no longer renders a rescheduled-specific icon state. |
| `Rinov5/CalendarClass/ListShell/01 Week Board` (`1406:5052`) | Updated | Full 1912 shell using header and expanded sidebar instances, current week `25 thg 5 - 31 thg 5`. |
| `Rinov5/CalendarClass/ListShell/02 Day View` (`1406:5382`) | Updated | Day-mode shell aligned to the current app. |
| `Rinov5/CalendarClass/ListShell/03 Search Active` (`1406:5545`) | Updated | Search-expanded filtered state. |
| `Rinov5/CalendarClass/ListShell/04 Empty Search` (`1406:5756`) | Updated | Per-day empty state. |
| `Rinov5/CalendarClass/ListShell/05 Filter Drawer Open` (`1406:5888`) | Updated | Filter sheet with all current filter groups. |
| `Rinov5/CalendarClass/ListShell/06 Branch Dropdown Open` (`1406:6235`) | Updated | Branch dropdown state. |
| `Rinov5/CalendarClass/ListShell/08 Current Week Board` (`1456:4843`) | Updated | Week `25 thg 5 - 31 thg 5`, current live-app card anatomy, current-day highlight on 28, Sunday empty state. |

## Current Session Log

- Inspected the current `CalendarClassScheduleScreen.tsx` and `calendarSchedule.ts` changes.
- Captured current live app states on port `3000`: week, day, search active, empty search, filter drawer, and branch dropdown.
- Confirmed the target frames still have one direct source-component instance child each.
- Added missing icon assets `Repeat` and `CalendarClock` to the Figma icon library.
- Updated the reusable Calendar Class session card primitive.
- Rebuilt the six requested Calendar Class Schedule source components on `03 Rinov5 App Shell`.
- Rendered all six requested target frames from Figma and downloaded verification PNGs.
- Fixed the `Repeat` icon asset after the first render exposed an SVG wrapper stroke.
- Re-verified the six final frames remain instance-based, not manually drawn final frames.
- Rechecked the live app DOM after user feedback on 2026-05-22 and corrected the source components back to the expanded-sidebar toolbar geometry.
- Corrected the horizontal toolbar positions for `Hôm nay`, arrows, range title, `Ngày/Tuần`, branch select, search, and filter.
- Corrected session card icon order: clock or `CalendarClock` before time, repeat icon after time.
- Added and rendered a `Rescheduled` card primitive so `Đổi ngày` has the correct amber `CalendarClock` icon.
- Fixed custom icon constraints and colors so `Repeat` scales to `12px` muted grey and `CalendarClock` scales to `12px` amber.
- Rendered `CS01` again after the toolbar/icon corrections and verified target frames still contain one source-component instance each.
- Added `CS08 Future Week Rescheduled` for week `25 thg 5 - 31 thg 5`.
- Created source component `Rinov5/CalendarClass/ListShell/08 Future Week Rescheduled` in `03 Rinov5 App Shell`.
- Created review frame `11 Calendar / Class Schedule / CS08 Future Week Rescheduled` (`1457:5437`) on page `11 Calendar`, containing only the source component instance.
- Rendered `CS08` and checked: horizontal toolbar, focused next arrow, future-week dates, one rescheduled item, cancelled item, light-blue future cards, and Sunday empty state.
- Refreshed on 2026-05-28 after live app comparison: `CS01` now shows week `25 thg 5 - 31 thg 5`, cards no longer include badge/recurring icons, and source card primitives were updated in `02 Rinov5 Primitives`.
- Refreshed `CS02` through `CS06` source shell states so Day View, Search Active, Empty Search, Filter Drawer Open, and Branch Dropdown Open use the same current card anatomy and week context.
- Renamed `CS08` to `11 Calendar / Class Schedule / CS08 Current Week Board` and renamed its source to `Rinov5/CalendarClass/ListShell/08 Current Week Board` because the same week is now the current app week.
- Re-rendered `CS01` and `CS08` after the refresh and verified both final frames still contain exactly one source component instance.
