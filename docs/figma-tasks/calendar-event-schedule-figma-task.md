# Calendar Event Schedule Figma Task

## Scope

- App route: `/app/calendar_event_schedule`
- Target Figma file: `Rinoedu` (`frct7JUaJQBN2uOSyfMqcL`)
- Target page: `11 Calendar` (`57:79`)
- Baseline screenshots: `tmp/calendar-event-schedule-recapture-realclick/`
- 2026-05-28 baseline note: direct local route capture was blocked by an unrelated Next.js build error in `src/components/screens/qc-check/QcCheckCreateDialog.tsx`; this refresh uses the current `CalendarEventScheduleScreen.tsx` and `calendarSchedule.ts` source as the behavioral baseline.

## Execution Rule

- Do not create final review frames by hand.
- Create or update missing reusable assets/components in the foundation pages first.
- Each final screen frame must be composed from a source component instance.
- Render/check one screen before creating the next screen.

## Screen / State List

- [x] ES01 Week Board - default week view, initial page load.
- [x] ES02 Day View - day segmented control selected, empty day.
- [x] ES03 Search Active - search input expanded with `Open Day`, one matching event.
- [x] ES04 Empty Search - search input expanded with no matching result.
- [x] ES05 Filter Sheet Open - event filter sheet with dimmed calendar background.
- [x] ES06 Branch Dropdown Open - center dropdown open.
- [x] ES07 Event Detail Modal - legacy standard event detail dialog; current screen no longer reaches this state because the screen filters to `placement_test`.
- [x] ES08 Placement Test Detail Modal - placement test detail dialog aligned to the current placement-test-only screen flow.

## Foundation Checklist

- [x] App shell header/sidebar component available and reused.
- [x] Calendar event toolbar source available.
- [x] Calendar event card source available.
- [x] Calendar empty day state source available.
- [x] Filter sheet source available.
- [x] Event detail modal source available.
- [x] Placement test detail modal source available or referenced from booking-test source.
- [x] Required icons available in `04 Icon Library`: calendar, chevron, search, filter, clock, map pin, users, x/close.

## Progress Log

- 2026-05-22: Captured current app states from `/app/calendar_event_schedule`.
- 2026-05-22: Added `Rinov5/CalendarEvent/AppShell/SidebarExpanded` and `Rinov5/CalendarEvent/AppShell/SidebarCollapsed` in `03 Rinov5 App Shell`.
- 2026-05-22: Created and rendered `ES01 Week Board`; fixed placement badge width after screenshot QA.
- 2026-05-22: Created and rendered `ES02 Day View` with collapsed sidebar matching real click behavior.
- 2026-05-22: Created and rendered `ES03 Search Active` with one matching `Open Day` event.
- 2026-05-22: Created and rendered `ES04 Empty Search`; removed cloned badge residue after screenshot QA.
- 2026-05-22: Created and rendered `ES05 Filter Sheet Open` with collapsed-sidebar background and right filter sheet.
- 2026-05-22: Created and rendered `ES06 Branch Dropdown Open` with center dropdown state.
- 2026-05-22: Created and rendered `ES07 Event Detail Modal`; fixed type pill width after screenshot QA.
- 2026-05-22: Created and rendered `ES08 Placement Test Detail Modal`; replaced the initial booked-state dialog with the completed booking-test detail instance to match the live app baseline.
- 2026-05-22: Validated all eight final review frames are `1912x914` and each contains exactly one source component instance.
- 2026-05-28: Refreshed `ES01` through `ES06` source shells in `03 Rinov5 App Shell` to match the current placement-test-only screen: week `25 thg 5 - 31 thg 5`, expanded sidebar, `Trải nghiệm` cards, current-day highlight on 28, period/status filter sheet, and branch dropdown.
- 2026-05-28: Rebuilt `Rinov5/CalendarEvent/ListShell/08 Placement Test Detail Modal` from current placement-test detail content and created missing final review frame `11 Calendar / Event Schedule / ES08 Placement Test Detail Modal` (`1809:7255`) with exactly one source component instance.
- 2026-05-28: Renamed `ES07 Event Detail Modal` to `ES07 Event Detail Modal (Legacy)` because `CalendarEventScheduleScreen` now opens the booking-test detail flow for rendered cards.
- 2026-05-28: Rendered `ES01` through `ES06` and `ES08`; verified final review frames are component-instance based, not manually drawn screen frames.
- 2026-05-28: Updated `ES02 Day View` after review feedback: added reusable primitive `Rinov5/CalendarEvent/EventCard/PlacementTest` (`1817:1934`) in `02 Rinov5 Primitives`, then placed four placement-test card instances into the `Rinov5/CalendarEvent/ListShell/02 Day View` source component. Final frame `1469:9785` still contains exactly one source component instance.
