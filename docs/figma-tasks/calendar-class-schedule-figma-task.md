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
| CS01 | Week Board | Default weekly class schedule with cards per day | Pending | Pending |
| CS02 | Day View | Day mode showing session cards in grid layout | Pending | Pending |
| CS03 | Search Active | Expanded class search with filtered visual state | Pending | Pending |
| CS04 | Empty Search | Search/filter has no matching sessions | Pending | Pending |
| CS05 | Filter Drawer Open | Advanced subject filter sheet open | Pending | Pending |
| CS06 | Branch Dropdown Open | Branch combobox menu open | Pending | Pending |
| CS07 | Session Detail Dialog | Clicked class session detail modal | Pending | Pending |

## Current Session Log

- Confirmed the old dev server on port 3000 can return 500 for authenticated app routes, which prevents reliable interaction capture.
- Started a clean Next dev server on port 3001 and captured the default weekly app shell successfully.
- Identified that the screen set needs seven states: week, day, search active, empty search, filter drawer, branch dropdown, and session detail dialog.
