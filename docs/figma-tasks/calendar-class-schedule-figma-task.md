# Calendar Class Schedule Figma Task

## Goal

Create the `app/calendar_class_schedule` screens in Figma from the live demo UI, using reusable Rinov5 app shell/components instead of hand-built final frames.

## Source Of Truth

- Figma file: `frct7JUaJQBN2uOSyfMqcL`
- Figma page: `11 Calendar` (`57:79`)
- Live app route: `/app/calendar_class_schedule`
- Clean capture server used for verification: `http://127.0.0.1:3001/app/calendar_class_schedule`

## Execution Rules

- Final screen frames must be composed from reusable component instances.
- Reuse the existing Rinov5 header/sidebar/icon/control assets where possible.
- Add missing Calendar Class Schedule components to the Rinov5 component pages before placing screens.
- Keep the 1912 desktop app shell geometry consistent with the approved Calendar/Booking screens: header 64px, expanded sidebar 288px, content starts at x=288.
- Verify each created Figma screen with screenshot render before marking it done.

## Screens To Create

| Order | Screen | Purpose | Status | Verification |
| --- | --- | --- | --- | --- |
| CS01 | Week Board (`1406:6951`) | Default weekly class schedule with cards per day | Done | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/01 Week Board` instance |
| CS02 | Day View (`1406:7282`) | Day mode showing session cards in grid layout | Done | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/02 Day View` instance |
| CS03 | Search Active (`1406:7446`) | Expanded class search with filtered visual state | Done | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/03 Search Active` instance |
| CS04 | Empty Search (`1406:7658`) | Search/filter has no matching sessions | Done | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/04 Empty Search` instance |
| CS05 | Filter Drawer Open (`1406:7791`) | Advanced subject filter sheet open | Done | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/05 Filter Drawer Open` instance |
| CS06 | Branch Dropdown Open (`1406:8139`) | Branch combobox menu open | Done | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/06 Branch Dropdown Open` instance |
| CS07 | Session Detail Dialog (`1406:8476`) | Clicked class session detail modal | Done | Rendered; frame direct child is one `Rinov5/CalendarClass/ListShell/07 Session Detail Dialog` instance |

## Foundation Components

| Component | Status | Notes |
| --- | --- | --- |
| `Rinov5 / Sidebar / CalendarClass / Expanded` (`1406:4975`) | Done | Cloned from generic Rinov5 sidebar and corrected active child to `Lịch lớp học`. |
| `Rinov5/CalendarClass/SessionCard/Default` (`1406:5032`) | Done | Reusable class-session card using existing icon assets and status badge colors. |
| `Rinov5/CalendarClass/ListShell/01 Week Board` (`1406:5052`) | Done | Full 1912 shell using header/sidebar instances and weekly grid. |
| `Rinov5/CalendarClass/ListShell/02 Day View` (`1406:5382`) | Done | Day-mode shell. |
| `Rinov5/CalendarClass/ListShell/03 Search Active` (`1406:5545`) | Done | Search-expanded filtered state. |
| `Rinov5/CalendarClass/ListShell/04 Empty Search` (`1406:5756`) | Done | Empty result state. |
| `Rinov5/CalendarClass/ListShell/05 Filter Drawer Open` (`1406:5888`) | Done | Filter sheet open state. |
| `Rinov5/CalendarClass/ListShell/06 Branch Dropdown Open` (`1406:6235`) | Done | Branch dropdown state. |
| `Rinov5/CalendarClass/ListShell/07 Session Detail Dialog` (`1406:6571`) | Done | Detail modal state; footer overflow fixed in source component. |

## Current Session Log

- Confirmed the old dev server on port 3000 can return 500 for authenticated app routes, which prevents reliable interaction capture.
- Started a clean Next dev server on port 3001 and captured the default weekly app shell successfully.
- Identified that the screen set needs seven states: week, day, search active, empty search, filter drawer, branch dropdown, and session detail dialog.
- Created reusable Calendar Class Schedule components and seven screen frames on Figma page `11 Calendar`.
- Verified all seven screen frames have only one direct component instance child.
- Rendered the screens from Figma. Fixed the sidebar active state and the detail modal footer overflow at the component-source level.
