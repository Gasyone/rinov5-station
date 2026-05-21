# Trial Class Figma Screens Task

Target file: `Rinoedu` (`frct7JUaJQBN2uOSyfMqcL`)
Target page: `13 Booking trial` (`1039:3651`)
Baseline approved screen: `TC01 Board - Main` (`1118:323`)

## Execution Rules

- Capture the live app state before creating each Figma state.
- Create or update reusable Figma components first.
- Compose every full-page screen from component instances.
- Do not draw modal, drawer, popover, or shell elements directly inside screen frames.
- Keep existing approved screens unchanged unless explicitly listed.
- Render each final screen and verify visible copy, component usage, and major placement.

## Screen Checklist

- [x] `TC01 Board - Main` - approved baseline.
- [x] `TC01B Board - Main - Row Hover Action` - node `1262:11522`.
- [x] `TC02 Board - Create Booking Modal` - created from component instances.
- [x] `TC02B Board - Create Booking Modal - Student Search` - node `1238:8294`.
- [x] `TC02C Board - Create Booking Modal - Program Selected` - node `1238:8841`.
- [x] `TC02D Board - Create Booking Modal - Sessions Selected` - node `1238:9417`.
- [x] `TC03 Board - Detail Modal` - node `1187:1141`.
- [x] `TC03B Board - Detail Modal - Scrolled Content` - node `1198:4509`.
- [x] `TC03C Board - Detail Modal - Full Height` - node `1209:5047`.
- [x] `TC03D Board - Detail Modal - Notes Sent` - node `1215:5582`.
- [x] `TC03E Board - Detail Modal - History Tab` - node `1215:6190`.
- [x] `TC03F Board - Detail Modal - Reschedule Requested` - node `1221:6718`.
- [x] `TC03G Board - Detail Modal - Cancelled` - node `1221:7273`.
- [x] `TC03H Board - Detail Modal - Unassigned Booking` - node `1221:7790`.
- [x] `TC04 Board - Assign Class Modal` - node `1187:1659`.
- [x] `TC05 Board - Reschedule Modal` - node `1187:2198`.
- [x] `TC05B Board - Reschedule Modal - Reason Dropdown` - node `1253:10720`.
- [x] `TC05C Board - Reschedule Modal - Full Height` - node `1253:10818`.
- [x] `TC06 Board - Cancel Confirm` - node `1187:2723`.
- [x] `TC07 Board - Filter Drawer` - node `1187:3240`.
- [x] `TC08 Board - Family Popover` - node `1187:3683`.
- [x] `TC09 Board - Session Popover` - node `1187:4094`.

## Component Checklist

- [x] `Rinov5/Data/DataTableFrame / state=trial_class_1912`.
- [x] `Rinov5/Data/DataTableFrame / state=trial_class_1912_hover_row_action` - component `1262:11252` on `02 Rinov5 Primitives`.
- [x] `Rinov5/TrialClass/TableRow / status=booked, sessions=multi`.
- [x] `Rinov5/TrialClass/TableRow / status=assigned, sessions=single, state=hover-action` - component `1262:11220` inside `Rinov5/TrialClass/TableRow` on `02 Rinov5 Primitives`.
- [x] `Rinov5/Shared/DialogScrim/Desktop1912`.
- [x] `Rinov5/TrialClass/CreateBookingDialog/Empty`.
- [x] `Rinov5/TrialClass/CreateBooking/StudentSearchOption` - component `1236:2`.
- [x] `Rinov5/TrialClass/CreateBooking/StudentSearchDropdown` - component `1236:8`.
- [x] `Rinov5/TrialClass/CreateBooking/SessionRow/Default/ThinkingM1` - component `1239:2`.
- [x] `Rinov5/TrialClass/CreateBooking/SessionRow/Default/ThinkingM2` - component `1239:14`.
- [x] `Rinov5/TrialClass/CreateBooking/SessionRow/Selected/ThinkingM1` - component `1239:26`.
- [x] `Rinov5/TrialClass/CreateBooking/SessionRow/Selected/ThinkingM2` - component `1239:39`.
- [x] `Rinov5/TrialClass/CreateBooking/SchedulePanel/AvailableSessions` - component `1236:96`.
- [x] `Rinov5/TrialClass/CreateBooking/SchedulePanel/SelectedSessions` - component `1236:151`.
- [x] `Rinov5/TrialClass/CreateBookingDialog/SearchStudent` - component `1236:210`.
- [x] `Rinov5/TrialClass/CreateBookingDialog/ProgramSelectedAvailable` - component `1236:286`.
- [x] `Rinov5/TrialClass/CreateBookingDialog/SessionsSelected` - component `1236:400`.
- [x] `Rinov5/TrialClass/DetailDialog/BookedMultiSession` - component `1182:749`.
- [x] `Rinov5/TrialClass/DetailDialog/BookedMultiSessionScrolled` - component `1197:914`.
- [x] `Rinov5/TrialClass/DetailDialog/BookedMultiSessionFullHeight` - component `1208:2`.
- [x] `Rinov5/TrialClass/DetailSidePanel/NoteCard` - component `1214:2`.
- [x] `Rinov5/TrialClass/DetailSidePanel/AuditLogItem` - component `1214:7`.
- [x] `Rinov5/TrialClass/DetailDialog/NotesWithMessages` - component `1214:12`.
- [x] `Rinov5/TrialClass/DetailDialog/HistoryTab` - component `1214:204`.
- [x] `Rinov5/TrialClass/DetailSchedule/UnassignedBlock` - component `1220:2`.
- [x] `Rinov5/TrialClass/DetailSchedule/PreviousReleasedClassCard` - component `1220:10`.
- [x] `Rinov5/TrialClass/DetailDialog/RescheduleRequestedHistory` - component `1220:15`.
- [x] `Rinov5/TrialClass/DetailDialog/CancelledUnassignedNotes` - component `1220:256`.
- [x] `Rinov5/TrialClass/DetailDialog/UnassignedBookingNotes` - component `1220:522`.
- [x] `Rinov5/TrialClass/AssignClassDialog/Default` - component `1182:854`.
- [x] `Rinov5/TrialClass/RescheduleDialog/Empty` - component `1182:897`.
- [x] `Rinov5/TrialClass/RescheduleClassDialog/ReasonDropdownOpen` - component `1253:10548` on `02 Rinov5 Primitives`.
- [x] `Rinov5/TrialClass/RescheduleClassDialog/FullHeight` - component `1253:10638` on `02 Rinov5 Primitives`.
- [x] `Rinov5/TrialClass/CancelConfirmDialog/Empty` - component `1182:922`.
- [x] `Rinov5/TrialClass/FilterDrawer/Advanced` - component `1184:786`.
- [x] `Rinov5/TrialClass/FamilyPopover/TwoContacts` - component `1184:837`.
- [x] `Rinov5/TrialClass/SessionPopover/ThreeSessions` - component `1184:855`.

## Verification Log

- `TC01`: render verified from Figma after DataTableFrame and multi-session row updates.
- `TC01B`: render verified; STEM Robotics row hover state uses a dedicated table-row source component with muted hover background, visible phone action, and `Gọi điện` tooltip from the app `title` behavior.
- `TC02`: render verified; screen has 6 direct children and all are component instances.
- `TC02B`: render verified; student-search state shows focused combobox and dropdown results from the provided live app screenshot.
- `TC02C`: render verified; program-selected state shows available Math Thinking classes and borderless default session rows.
- `TC02D`: render verified; selected-sessions state shows two selected rows with primary highlight, footer count, clear-student `x` action, visible footer divider, and centered footer button labels.
- `TC03`: render verified; detail modal source component rebuilt to match the live app with fixed 1024x777 dialog, left internal scroll viewport, right notes/history panel, and feedback remaining in the left content column.
- `TC03B`: render verified; additional full-page scrolled state shows the lower left content including teacher feedback without widening the dialog.
- `TC03C`: render verified; full-height review state uses a 1912x1080 frame and a 1024x900 detail modal variant so all left-column content is visible without a visible scrollbar.
- `TC03D`: render verified; notes tab state shows sent-message cards, right-panel scrollbar, and note input based on the provided live app screenshot.
- `TC03E`: render verified; history tab state shows the active history tab and `Tạo booking` audit timeline based on the provided live app screenshot.
- `TC03F`: render verified; reschedule-requested state shows `Cần đổi lịch`, `Hủy lịch`, `Ghép lại lớp`, released old class, and active history entries.
- `TC03G`: render verified; cancelled state shows `Đã hủy`, only the `Ghép lớp` action, empty schedule block, and notes tab.
- `TC03H`: render verified; unassigned booking state shows `Đã đặt lịch`, `Hủy lịch`, `Ghép lớp`, and the schedule block uses `Ghép lớp` instead of `Đổi lịch`.
- `TC04`: render verified; assign-class modal is composed over the detail modal with nested scrim.
- `TC05`: render verified; reschedule dialog matches the captured app state with current session context.
- `TC05B`: render verified; reschedule modal reason dropdown is open, options match the live app state, and dropdown overlay is fixed at the source component level so underlying current-info text no longer bleeds through.
- `TC05C`: render verified; full-height 1912x1080 state uses a 768x900 reschedule modal variant with no internal scrollbar and visible teacher-note field.
- `TC06`: render verified; cancel confirm uses a dedicated component over the detail modal.
- `TC07`: render verified; filter drawer is a right-side full-height component.
- `TC08`: render verified; family popover is a dedicated component positioned from live capture.
- `TC09`: render verified; session popover source component fixed so date/time stays on one line.
- Layer validation: TC01-TC09 plus TC01B, TC02B/TC02C/TC02D, TC03B/TC03C/TC03D/TC03E/TC03F/TC03G/TC03H, and TC05B/TC05C are present on page `13 Booking trial`; every direct child in every screen is a component instance.
- Source organization validation: newly-created TrialClass source components `1262:11220`, `1262:11252`, `1253:10548`, and `1253:10638` were moved out of `13 Booking trial` into `02 Rinov5 Primitives`; review screens still reference the same component IDs.
- Create-booking session row validation: default rows have no stroke/border; selected rows use primary highlight stroke/background.
