# Booking Test Figma Component Audit

Generated: 2026-06-01

## Verdict

Current BookingTest Figma sources are **not acceptable for 100% current-app screen composition**.

They cover the requested component names, but several of them were built as approximations from the contract instead of being rebuilt from the live `/app/booking_test` UI state. They should not be used to create final screen frames in `12 Booking v2` until the P0/P1 findings below are fixed.

## Evidence Used

Live app screenshots:

- `artifacts/booking-test-live-review/01-list-default.png`
- `artifacts/booking-test-live-review/04-detail-e0002.png`
- `artifacts/booking-test-live-review/05-detail-e0004.png`
- `artifacts/booking-test-live-review/06-employee-picker.png`
- `artifacts/booking-test-live-review/07-assessment-editable.png`
- `artifacts/booking-test-live-review/08-result-e0001.png`
- `artifacts/booking-test-live-review/09-result-not-found.png`

Figma screenshots:

- `artifacts/booking-test-figma-review/figma-branch-dropdown.png`
- `artifacts/booking-test-figma-review/figma-filter-drawer.png`
- `artifacts/booking-test-figma-review/figma-row-hover.png`
- `artifacts/booking-test-figma-review/figma-employee-picker-conflict.png`
- `artifacts/booking-test-figma-review/figma-assessment-readonly.png`
- `artifacts/booking-test-figma-review/figma-result-found.png`

## Root Cause

The work was handled incorrectly in three ways:

1. Component coverage was mistaken for visual fidelity. Having a named reusable source is not enough if the source does not match the live app.
2. Old App Shell sources were reused even though the current app shell has changed.
3. Some BookingTest components were created from inferred layout/data instead of live screenshots for each state.

## Findings

### P0 - App Shell / ListShell / TableFrame Do Not Match Current App

Affected Figma nodes:

- `Rinov5/BookingTest/ListShell/00 CurrentDefault` (`2046:6400`)
- `Rinov5/BookingTest/TableFrame/00 CurrentDefault` (`2045:6330`)
- related `ListShell/*Current` and `TableFrame/*Current` states

Live app facts:

- Sidebar uses the newer full navigation structure with many groups: `Tuyển sinh`, `Vận hành lớp học`, `Chăm sóc`, `Quản lý chất lượng`, `Học thuật`, `Nhân sự`, `Dữ liệu gốc`, `Hệ thống`, plus v2 sections.
- Status filter row uses compact pills with colored dot and active dark pill.
- Table is horizontally overflowing. The left area shows `Booking Trải nghiệm`, then `Học viên`, `Điện thoại`, `Cơ sở`, `Giờ test`, `Trình độ`, `Nhánh trình độ`, and right-side columns are partly clipped.
- Footer shows `Hiển thị 1-5 / 5`, `Dòng 20`, and first/previous/next/last pagination controls.

Figma mismatch:

- Sidebar/header are from older sources.
- Status row is rendered as larger outlined tiles, not compact status pills.
- Table geometry, columns, row widths, sticky behavior, footer controls, and visible right-side clipping are materially different.

Decision:

- Rebuild, do not patch lightly.

### P0 - DetailDialog Current States Do Not Match Current App

Affected Figma nodes:

- `Rinov5/BookingTest/DetailDialog/01 BookedAssignedCurrent` (`2048:2062`)
- `Rinov5/BookingTest/DetailDialog/02 StartedAssessmentCurrent` (`2048:2131`)
- `Rinov5/BookingTest/DetailDialog/03 CompletedCurrent` (`2048:2208`)
- `Rinov5/BookingTest/DetailDialog/04 CancelledCurrent` (`2048:2285`)
- `Rinov5/BookingTest/DetailDialog/05 TeacherUnassignedCurrent` (`2048:2350`)
- `Rinov5/BookingTest/DetailDialog/06 NotesTypingCurrent` (`2048:2422`)
- `Rinov5/BookingTest/DetailDialog/07 HistoryTabCurrent` (`2048:2487`)
- `Rinov5/BookingTest/DetailDialog/08 CancelConfirmCurrent` (`2048:2549`)

Live app facts:

- Detail opens as a wide modal over the list, with overlay visible.
- Header has avatar, student name, status badge, booking code, and action buttons.
- Content uses flat section layout, not card-heavy panels.
- Right side has `Ghi chú` / `Lịch sử` tabs.
- Responsible staff cards have the current staff-card layout and small change icon.

Figma mismatch:

- Current Figma detail uses a simplified panel grid that does not match the modal structure or spacing.
- It misses the live two-column content balance and right-side notes/history behavior.
- The footer/notes composer and staff cards are only approximate.

Decision:

- Rebuild from live modal screenshots.

### P0 - ResultPage Current States Do Not Match Current App

Affected Figma nodes:

- `Rinov5/BookingTest/ResultPage/01 FoundCurrent` (`2049:9200`)
- `Rinov5/BookingTest/ResultPage/02 NotFoundCurrent` (`2049:9346`)

Live app facts:

- Found page title is `Kết quả đánh giá - Vu Phuc An`.
- Header includes `Back`, status `Hoàn tất`, booking code `E0001`, and action `Danh sách test`.
- Layout is flat with sections: `Tổng quan học viên`, `Kết quả năng lực`, `Nhận xét`, right side `Thông tin lịch test`, `Liên hệ`.
- Not-found state is centered with text: `Không tìm thấy kết quả đánh giá`.

Figma mismatch:

- Found page is card-heavy and uses different title/copy/action placement.
- Not-found source should be checked and rebuilt with the exact empty-state layout.

Decision:

- Rebuild.

### P1 - EmployeePicker Uses Wrong Data And Partial Layout

Affected Figma nodes:

- `Rinov5/BookingTest/EmployeePicker/03 ConflictSearch` (`2039:1954`)
- `Rinov5/BookingTest/EmployeePicker/04 EmptyResult` (`2039:1996`)
- older picker components should not be reused without verification

Live app facts:

- Default picker from `E0004` shows active branch employees:
  - `Trần Thị Sale`
  - `Phạm Văn Giảng Dạy`
  - `Đặng Văn Bắc`
  - `Ngô Thị Accounting`
- Search input is focused with a strong blue ring.
- Rows are large, full-width buttons with active status badge on the far right.

Figma mismatch:

- Uses invented/old names: `Sarah J.`, `Robert L.`, `Emily W.`
- Conflict state may be useful, but it must be rebuilt from the actual employee/mock data and current row styling.

Decision:

- Rebuild with current mock employees and actual branch data.

### P1 - AssessmentDialog Is Closer But Still Not Exact

Affected Figma nodes:

- `Rinov5/BookingTest/AssessmentDialog/01 EditableForm2025Current` (`2043:1962`)
- `Rinov5/BookingTest/AssessmentDialog/02 ReadOnlyResultCurrent` (`2043:2100`)
- `Rinov5/BookingTest/AssessmentDialog/03 EditConfirmCurrent` (`2043:2259`)
- `Rinov5/BookingTest/AssessmentDialog/04 EditModeExistingResultCurrent` (`2043:2426`)
- `Rinov5/BookingTest/AssessmentDialog/05 SkippedCurrent` (`2043:2578`)

Live app facts from captured state:

- The opened `E0005` state is read-only/result mode, not editable mode.
- Header data is `Bao Chau`, date of birth `2014-06-17`, evaluator `Sarah J.`, test time `2026-05-21 10:00`.
- Summary score is `7.5 / 8`, speaking level `Nâng cao`.
- Footer has `Đóng` and `Chỉnh sửa đánh giá`.
- Body scroll is cropped under the footer in the live modal.

Figma mismatch:

- Editable/read-only data and scoring pattern differ.
- Color and control states are approximate.
- Footer and scroll clipping are not fully matched.

Decision:

- Can be repaired, but should still be rebuilt against the live read-only/edit-confirm/edit-mode states.

### P1 - Branch Dropdown And Filter Drawer States Are Not Yet Reliably Verified

The current screenshot automation did not successfully open the branch dropdown or filter drawer in the live app. The Figma states exist, but because they were created from inference, they cannot be considered verified.

Decision:

- Before fixing these, use a reliable Playwright action or DOM-driven interaction to capture the true live open states.

## What Can Be Kept

- Existing canonical icon assets in `04 Asset Library`.
- Brand/logo assets.
- Generic shared primitives that already existed before this work, after visual verification.
- The screen inventory file can stay as the scope checklist.

## What Should Not Be Used For Final Screens Yet

- All `Rinov5/BookingTest/ListShell/*Current`
- All `Rinov5/BookingTest/TableFrame/*Current`
- All `Rinov5/BookingTest/DetailDialog/*Current`
- All `Rinov5/BookingTest/ResultPage/*Current`
- `EmployeePicker/*Current` until rebuilt with real data
- `AssessmentDialog/*Current` until corrected per live states

## Correct Rebuild Order

1. Build `Rinov5 / HeaderBar / DesktopCurrent`.
2. Build `Rinov5 / Sidebar / BookingTest / ExpandedCurrent`.
3. Build BookingTest status pills and toolbar current primitives.
4. Build `BookingTest/TableFrame/*Current` from the live default list screenshot.
5. Build `BookingTest/ListShell/*Current` using only current shell and table instances.
6. Build `BookingTest/DetailDialog/*Current` from live modal screenshots.
7. Build `BookingTest/EmployeePicker/*Current` from live picker screenshots and mock employee data.
8. Build `BookingTest/AssessmentDialog/*Current` from live result/edit states.
9. Build `BookingTest/ResultPage/*Current`.
10. Only then create final screen frames in `12 Booking v2`.

## Required Quality Gate Before Final Screen Frames

For each reusable source:

- Render Figma source screenshot.
- Place it side-by-side with the live app screenshot.
- Check copy, data, dimensions, density, visible columns, actions, overlays, and clipping.
- Mark the source as `ApprovedForScreenComposition=true` only after it matches the live app state closely enough for review.
