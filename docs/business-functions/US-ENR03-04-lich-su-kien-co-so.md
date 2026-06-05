---
id: US-ENR03-04
title: "Lịch sự kiện Cơ sở (Global Event Schedule)"
bf: BF-ENR-03
domain: CAP-ADM
status: standardized
tags: [schedule, events, booking, aggregator, polymorphism]
---

# US-ENR03-04: Lịch sự kiện Cơ sở (Global Event Schedule)

> **Tham chiếu:** BF-ENR-03 · `[POLICY-DS-03]` · Giao diện Mẫu §4.2 (Danh sách dạng Grid/Calendar)

## 1. Yêu cầu Người dùng (User Story)

**Là một** Quản lý chi nhánh hoặc Tư vấn viên (Sales/Admissions),
**tôi muốn** xem toàn bộ lịch sự kiện tuyển sinh (Booking Test, Học thử, Hội thảo) diễn ra tại cơ sở trên một giao diện lịch tổng hợp chung (Unified View),
**để** nắm bắt lịch trình tiếp đón khách, kiểm tra trực quan xem phòng test hoặc giáo viên test có bị trùng lịch hay không, và quản lý các lượt khách đến cơ sở một cách chuyên nghiệp, tránh quá tải sảnh chờ.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Không phụ thuộc vào Form tạo Booking. Hoạt động như một Super Consumer đa nguồn.
> - [x] **N**egotiable — Có thể tùy chỉnh màu sắc thẻ theo loại sự kiện hoặc theo trạng thái.
> - [x] **V**aluable — Cung cấp "Một nguồn sự thật" về lưu lượng khách vãng lai, sinh tử với nghiệp vụ Sale.
> - [x] **E**stimable — Rõ ràng logic mapping Đa hình (Polymorphism).
> - [x] **S**mall — Hoàn thành trong 1 Sprint.
> - [x] **T**estable — Có 12+ tiêu chí nghiệm thu chặt chẽ.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-EVT-01] Đa nguồn dữ liệu (Multi-Producers & Unified Data):** 
   - Lịch này **CHỈ** hiển thị sự kiện Tuyển sinh / Marketing. Tuyệt đối không chứa lịch Lớp học chính khóa.
   - 3 Nguồn chính: `Booking Test` (từ `BF-ENR-01`), `Học thử` (từ `BF-ENR-02`), `Sự kiện Nội bộ/Hội thảo` (từ `BF-ENR-03`).
   - Yêu cầu Backend mapping về 1 schema chuẩn: `IUnifiedEvent` trước khi giao cho UI.
2. **[RULE-EVT-02] Đa hình Popup (Polymorphic Detail Trigger):** 
   - Lưới lịch ở chế độ **Read-only**.
   - Click vào thẻ sự kiện -> Chạy bộ định tuyến (Router/Switch-Case) dựa vào trường `eventType`:
     - Nếu `BOOKING_TEST` -> Mở `<BookingTestDetailDialog>`
     - Nếu `TRIAL_CLASS` -> Mở `<TrialClassDetailDialog>`
     - Nếu `WORKSHOP` -> Mở `<EventDetailDialog>`
3. **[RULE-EVT-03] Đồng bộ tự động (Reactive UI):** 
   - Thay đổi trạng thái (Ví dụ: Khách "No-show" hoặc "Đã xong") từ Popup phải Refetch lại grid lập tức.
4. **[RULE-EVT-04] Gom nhóm sự kiện lớn (Clustering):**
   - Sự kiện Hội thảo (Workshop) thường chiếm cả ngày và có rất nhiều người tham gia. Phải hiển thị thẻ đặc biệt kéo dài cả ngày (All-day event ở trên cùng).

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-01] Sức chịu tải UI (Extreme Overlap):** Hỗ trợ hiển thị tối đa 20 booking cùng 1 khung giờ 18:00 (do kỳ thi xếp lớp tập trung). Yêu cầu tự động chuyển sang chế độ gom nhóm "+N sự kiện".
- **[METRIC-02] Tốc độ xử lý:** Dưới 1.5 giây cho 3 nguồn data hợp nhất.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục Tổng thể:** Giống US-OPS02-03 nhưng Toolbar có nhiều Checkbox lọc loại sự kiện hơn.

### 3.1. Thanh công cụ (Toolbar)

| Thành phần | Loại hiển thị | Logic & Tham số | Ghi chú |
|------------|---------------|-----------------|---------|
| Loại sự kiện | Checkbox Group | Bật/tắt các lớp layer: Booking Test, Học thử, Hội thảo | Core Feature: Cho phép Sale chỉ tập trung nhìn lịch Test. |
| Chọn Trung tâm | `BranchSelect` | Lọc theo cơ sở | |
| Tình trạng | `ToolbarSelect` | Chờ test, Đang test, Đã test, No-show | |
| Tìm kiếm | `ExpandableSearch`| Tìm theo Tên KH, Số điện thoại (Partial match) | Quan trọng khi khách đến quầy lễ tân đọc SĐT. |
| Tạo mới | `Dropdown Button` | Menu: "Tạo Booking Test", "Tạo Học thử" | Action tắt giúp Sale thao tác nhanh mà không cần chuyển Menu. |

### 3.2. Bảng Lịch (Time Grid Core)

| Thành phần | Loại hiển thị | Dữ liệu | Ghi chú |
|------------|---------------|---------|---------|
| Khay All-Day | Vùng ngang trên cùng | Các sự kiện Hội thảo/Workshop | |
| Trục thời gian | Cột dọc | 07:00 - 22:00 | |
| Thẻ Lịch (Card) | `PolymorphicEventBlock` | Tên KH, SĐT ẩn một phần, Loại (Icon), Trạng thái | Yêu cầu chữ rõ ràng. Không co text quá nhỏ. |
| Màu nền (Bg) | Tùy chọn Mode | Theo loại sự kiện hoặc theo Trạng thái Booking | Mặc định: Theo Trạng thái Booking (Chờ test = Vàng, Xong = Xanh). |

### 3.3. Thẻ Sự kiện (Event Card)

| Icon chỉ thị | Loại Sự kiện | Logic Màu Viền |
|--------------|--------------|----------------|
| `Search` / `FileText` | Booking Test | Bo góc vuông vức. |
| `GraduationCap` | Học thử | Bo góc tròn `rounded-xl` để phân biệt hình khối. |
| `Megaphone` | Hội thảo | Kéo dài All-day. |

---

## 4. Xử lý Ngoại lệ (Corner Cases)

| # | Tình huống | Cách xử lý | UI/UX Feedback |
|---|-----------|------------|----------------|
| 4.1 | Extreme Overlap (>5 thẻ/block) | Cuối tuần thi xếp lớp diện rộng. | Gom nhóm thành khối: "18:00 - Có 15 Test & 5 Học thử". Bấm vào bung Modal danh sách nhỏ (Popover List). |
| 4.2 | Lịch hẹn không có thời lượng (Duration) | Sale chỉ nhập giờ bắt đầu. | Mặc định gán độ cao thẻ bằng 30 phút trên giao diện. |
| 4.3 | Khách bị trùng SĐT (Anh em sinh đôi test cùng giờ) | Thẻ hiển thị cùng Tên, cùng SĐT. | Cảnh báo Tooltip: "Trùng số điện thoại với [Tên]". |
| 4.4 | Mất mạng khi click "Tạo mới" | Form bật lên bị lỗi. | Xử lý lỗi tại Component con (Dialog), lưới lịch không bị ảnh hưởng. |
| 4.5 | Đổi bộ lọc liên tục | Click Spam check/uncheck các Loại sự kiện. | Dùng State local lọc data trực tiếp trên RAM, không gọi API nếu đã fetch đủ. Phản hồi mượt < 100ms. |

---

## 5. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Bước kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Test tính Đa hình | Click thẻ Booking Test -> Bật Popup. Click thẻ Học thử -> Bật Popup. | 2 Popup khác nhau hoàn toàn, đúng giao diện của phân hệ gốc. |
| V-02 | Test Clustering | Mock data 10 sự kiện vào lúc 08:00 sáng. | Khối 08:00 hiển thị gọn gàng chữ "+10 sự kiện", không tràn cột. |
| V-03 | Local Filter | Bỏ tick "Học thử". | Các thẻ Học thử biến mất ngay lập tức không có độ trễ tải mạng. |

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Render Khay All-Day | Tạo sự kiện Hội thảo kéo dài cả ngày. | Nằm gọn ở khay trên cùng, không chạy dọc xuống các mốc giờ. |
| AC-02 | Chuyển luồng Component (Dispatcher) | Code review `onClick`. | Hàm gọi đúng Component tương ứng với `eventType` theo Bảng 2. |
| AC-03 | Tìm kiếm theo SĐT phần mềm | Nhập "098". | Thẻ nào SĐT chứa "098" sẽ được highlight hoặc chỉ hiện thẻ đó. Tốc độ Debounce 300ms. |
| AC-04 | Nút Tạo mới Dropdown | Bấm "Tạo mới" -> Chọn "Booking Test". | Form thêm mới Booking Test gốc được bật lên. |
| AC-05 | Xử lý Thẻ thiếu giờ kết thúc | Kiểm tra với thẻ không có Duration. | Thẻ tự gán chiều cao 30 phút chuẩn mực. |
| AC-06 | Màu sắc Trạng thái Booking | Đối chiếu thẻ "Chờ test" và "Đã test". | Khác màu nền hoàn toàn, theo chuẩn `statusColors.ts`. |
| AC-07 | Cập nhật Reactive | Mở chi tiết "Chờ test", chuyển thành "Đã xong", tắt popup. | Thẻ lịch tự động chuyển màu sang "Đã xong". |
| AC-08 | Responsive | Mở trên trình duyệt mobile (Width 375px). | Lịch chuyển thành Agenda (Danh sách cuộn dọc), ẩn lưới ngang. |
| AC-09 | Gom nhóm (Stacking) | Test với 5 booking trùng giờ. | UI kích hoạt Clustering thành công. |
| AC-10 | Phân quyền truy cập | Login bằng tk Giảng viên (Không có quyền Sale). | Chặn truy cập hoặc ẩn các SĐT của khách hàng. |
