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
- Current shell geometry is header `64px`, collapsed sidebar `72px`, content starts at `x=72`.
- Verify every updated Figma screen by rendering a screenshot.

## Current App Changes Captured On 2026-05-22

- Sidebar changed from expanded navigation to collapsed icon-only rail.
- Toolbar positions changed to match the `72px` sidebar layout.
- Session cards now reflect date/status:
  - Past sessions use warm orange surfaces.
  - Today/upcoming sessions use neutral surfaces.
  - Cancelled sessions use muted grey surfaces and strikethrough title.
- Session cards now include recurring/rescheduled icon support, attended student counts, and substitute teacher avatar overlap.
- Filter drawer now includes Subject, Status, Session Type, and Teacher sections.
- Search states show per-day empty states instead of a single global empty screen.
- Branch dropdown remains a full-page state with the popover open over the board.

## Screens

| Order | Screen | Purpose | 2026-05-22 Status | Verification |
| --- | --- | --- | --- | --- |
| CS01 | Week Board (`1406:6951`) | Default weekly class schedule | Refreshed | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/01 Week Board` instance |
| CS02 | Day View (`1406:7282`) | Day mode showing session cards | Refreshed | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/02 Day View` instance |
| CS03 | Search Active (`1406:7446`) | Expanded search with filtered cards | Refreshed | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/03 Search Active` instance |
| CS04 | Empty Search (`1406:7658`) | Search has no matching sessions | Refreshed | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/04 Empty Search` instance |
| CS05 | Filter Drawer Open (`1406:7791`) | Advanced filter sheet open | Refreshed | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/05 Filter Drawer Open` instance |
| CS06 | Branch Dropdown Open (`1406:8139`) | Branch combobox menu open | Refreshed | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/06 Branch Dropdown Open` instance |
| CS07 | Session Detail Dialog (`1406:8476`) | Existing previous detail modal state | Not refreshed in this pass | Needs a separate refresh if the live detail dialog changed |

## Foundation Components

| Component | Status | Notes |
| --- | --- | --- |
| `Icon / Repeat / 24` (`1440:2`) | Added | Added to `04 Rinov5 Asset Library` from Lucide-style SVG; wrapper stroke fixed after screenshot review. |
| `Icon / CalendarClock / 24` (`1440:8`) | Added | Added to `04 Rinov5 Asset Library` for rescheduled sessions. |
| `Rinov5/CalendarClass/AppShell/SidebarCollapsed` (`1442:4496`) | Added | Collapsed 72px calendar-active sidebar used by Calendar Class Schedule source components. |
| `Rinov5/CalendarClass/SessionCard/Default` (`1406:5032`) | Updated | Current card primitive includes recurring icon, badge, attended count, and substitute avatar pattern. |
| `Rinov5/CalendarClass/ListShell/01 Week Board` (`1406:5052`) | Updated | Full 1912 shell using header and collapsed sidebar instances. |
| `Rinov5/CalendarClass/ListShell/02 Day View` (`1406:5382`) | Updated | Day-mode shell aligned to the current app. |
| `Rinov5/CalendarClass/ListShell/03 Search Active` (`1406:5545`) | Updated | Search-expanded filtered state. |
| `Rinov5/CalendarClass/ListShell/04 Empty Search` (`1406:5756`) | Updated | Per-day empty state. |
| `Rinov5/CalendarClass/ListShell/05 Filter Drawer Open` (`1406:5888`) | Updated | Filter sheet with all current filter groups. |
| `Rinov5/CalendarClass/ListShell/06 Branch Dropdown Open` (`1406:6235`) | Updated | Branch dropdown state. |

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
