const fs = require('fs');

const doc1 = `---
id: US-OPS02-03
title: "Quản lý Lịch tổng thể Cơ sở (Global Class Schedule)"
bf: BF-OPS-02
domain: CAP-OPS
status: standardized
tags: [schedule, class, ops, aggregator, calendar]
---

# US-OPS02-03: Quản lý Lịch tổng thể Cơ sở (Global Class Schedule)

> **Tham chiếu:** BF-OPS-02 · \`[POLICY-DS-03]\` · Giao diện Mẫu §4.2 (Danh sách dạng Grid/Calendar)

## 1. Yêu cầu Người dùng (User Story)

**Là một** Quản lý chi nhánh hoặc Nhân viên Giáo vụ (Operations),
**tôi muốn** xem toàn bộ lịch học (Class Sessions) của tất cả các lớp đang diễn ra tại cơ sở trên một giao diện lịch tổng hợp (Lịch tuần/tháng),
**để** nắm bắt tình hình sử dụng phòng học, lịch dạy của giáo viên, phát hiện sớm các phòng học trống để tối ưu hóa nguồn lực, và tra cứu nhanh thông tin vận hành của bất kỳ buổi học nào mà không cần vào từng lớp riêng lẻ.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập với module Quản lý Lớp học gốc. Đóng vai trò là Aggregator (Consumer).
> - [x] **N**egotiable — Chi tiết giao diện bộ lọc và các góc nhìn (tháng/tuần/ngày) có thể linh hoạt.
> - [x] **V**aluable — Cung cấp "bức tranh toàn cảnh" 360 độ về hoạt động đào tạo tại cơ sở.
> - [x] **E**stimable — Ước lượng dựa trên Component Calendar lõi.
> - [x] **S**mall — Hoàn thành cấu trúc Read-only trong 1 Sprint.
> - [x] **T**estable — Có 12+ tiêu chí nghiệm thu chặt chẽ.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-CAL-01] Nguồn dữ liệu (Producer):** 
   - Lịch học cơ sở **CHỈ** hiển thị các sự kiện là Buổi học (Sessions) được sinh ra từ Lớp học (\`BF-OPS-02\`). 
   - Tuyệt đối KHÔNG chứa Booking Test hay Học thử (thuộc Tuyển sinh).
2. **[RULE-CAL-02] Chế độ Chỉ đọc (Strictly Read-only):** 
   - Màn hình Lịch KHÔNG cho phép thao tác kéo thả (Drag & Drop) để đổi ngày, đổi giờ hay đổi phòng trực tiếp trên lưới.
   - Tránh rủi ro thay đổi lịch ngoài ý muốn. Mọi thao tác phải thông qua form chuẩn.
3. **[RULE-CAL-03] Ủy quyền tương tác (Detail Trigger):** 
   - Click chuột trái vào Thẻ sự kiện \`->\` Mở Popup/Dialog Chi tiết Buổi học (\`<SessionDetailDialog>\`) của phân hệ \`BF-OPS-03\`.
4. **[RULE-CAL-04] Đồng bộ tự động (Reactive UI):** 
   - Bất kỳ thay đổi nào từ Popup Chi tiết (VD: Đổi phòng thành công, Hủy buổi) -> Hàm callback \`onSuccess\` phải kích hoạt Refetch dữ liệu của chính màn hình lịch mà không F5.
5. **[RULE-CAL-05] Ràng buộc Không gian / Thời gian:**
   - Dữ liệu lịch luôn được truy vấn với bộ lọc gốc: \`branchId = current_user_branch_id\` và \`date BETWEEN start_of_view AND end_of_view\`.
   - Giờ hiển thị lõi: 07:00 đến 22:00.

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-01] Hiệu năng (SLA):** Thời gian tải dữ liệu lịch của 1 Tháng (khoảng 2000 sessions) phải dưới \`1.5 giây\`. 
- **[METRIC-02] Giới hạn hiển thị:** Ở chế độ xem Tháng, nếu một ngày có quá 5 ca học, hiển thị "Xem thêm +N ca" thay vì làm tràn ô.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục Tổng thể:**
\`\`\`text
[ Header & Breadcrumb ]
[ Toolbar Controls: View Mode | Branch | Room | Teacher | Search | Filters ]
[ ---------------------------------------------------------------------- ]
[                                                                      ]
[                         TIME GRID / CALENDAR VIEWER                    ]
[                                                                      ]
[ ---------------------------------------------------------------------- ]
\`\`\`

### 3.1. Thanh công cụ (Toolbar)

| Thành phần | Loại hiển thị | Logic & Tham số | Ghi chú |
|------------|---------------|-----------------|---------|
| Chế độ xem | Segmented Control | Chuyển đổi Ngà / Tuần / Tháng. Lưu state local. | Mặc định: Tuần. |
| Chọn Trung tâm | \`BranchSelect\` | Lọc theo chi nhánh làm việc (Dành cho Quản lý vùng). | Vô hiệu hóa nếu User chỉ có 1 chi nhánh. |
| Chọn Phòng học | \`ToolbarSelect\` (Multi) | Lọc nhiều phòng học cùng lúc. | Gọi API lấy danh sách phòng của chi nhánh hiện tại. |
| Chọn Giáo viên | \`ToolbarSelect\` (Multi) | Lọc theo Giáo viên phụ trách. | Hỗ trợ gõ text tìm kiếm nội bộ dropdown. |
| Tìm kiếm | \`ExpandableSearch\` | Quét Tên lớp, Mã lớp, Tên Topic. | Tìm kiếm realtime (Debounce 300ms). |
| Bộ lọc trạng thái| \`FilterIconButton\` | Bật tắt hiển thị các trạng thái: Bình thường, Dạy thay, Hủy... | Mở Panel trượt (Slide Panel) từ cạnh phải. |
| Nút "Hôm nay" | \`Button\` (Outline) | Đưa lịch về tuần/ngày hiện tại. | Nhấn mạnh trực quan nếu đang ở xa hiện tại. |

### 3.2. Bảng Lịch (Calendar/Time Grid Core)

| Thành phần | Loại hiển thị | Dữ liệu | Ghi chú |
|------------|---------------|---------|---------|
| Trục dọc (Y) | Cột giờ | 07:00 - 22:00 | Ẩn giờ đêm. Độ phân giải 30 phút/vạch. |
| Trục ngang (X) | Các ngày | Thứ 2 -> Chủ Nhật | Highlight cột ngày hiện tại (màu nền nhạt). |
| Cột báo giờ thực | Red Line Indicator| Đường kẻ ngang màu đỏ | Di chuyển theo thời gian thực (như Google Calendar). |

### 3.3. Thẻ Sự kiện (Event Card)

| Thành phần | Dữ liệu Hiển thị | Logic CSS / Style |
|------------|------------------|-------------------|
| Mã Lớp | Text đậm (Bold) | VD: \`IELTS-A-01\` |
| Khung giờ | Text nhỏ (sm) | VD: \`18:00 - 19:30\` |
| Phòng học | Text kèm Icon MapPin | VD: \`Phòng 101\` |
| Giáo viên | Text kèm Icon User | VD: \`GV. Nguyễn Văn A\` |
| Màu nền (Bg) | \`getStatusBadgeClass()\` | Bình thường: Xanh ngọc. Dạy thay: Vàng. Đã hủy: Đỏ. |
| Cảnh báo | Icon Alert (Đỏ) | Nếu buổi học chưa có phòng hoặc chưa có GV. |

### 3.4. Thao tác trên Thẻ Lịch (Interactions)

| Tương tác | Khu vực | Kết quả mong đợi | Điều kiện / Ràng buộc |
|-----------|---------|------------------|-----------------------|
| Click Trái| Khối Event Card | Mở \`<SessionDetailDialog id={sessionId} />\` | Cấm tương tác nếu User không có quyền READ_SESSION. |
| Hover | Khối Event Card | Mở Tooltip (Delay 300ms) | Tooltip chứa: Sĩ số hiện tại, Tên Bài học, Tiến độ. |
| Kéo thả | Khối Event Card | (Bị Vô hiệu hóa) | \`isDraggable={false}\` tuyệt đối. |

---

## 4. Xử lý Ngoại lệ (Corner Cases)

| # | Tình huống | Cách xử lý | UI/UX Feedback |
|---|-----------|------------|----------------|
| 4.1 | Không có lịch học | Database trả về array rỗng cho dải ngày hiện tại. | Khung lưới trống, hiển thị mờ Watermark "Không có dữ liệu". |
| 4.2 | Lịch chồng chéo (Overlap) | Hệ thống xếp nhầm 2 lớp vào 1 phòng cùng giờ. | Render thẻ chia cột (width 50%), viền đỏ cực đậm. |
| 4.3 | Đổi timezone / Giờ mùa hè | Máy tính user sai giờ so với server. | Hệ thống bắt buộc dùng UTC Offset của máy chủ để map lên Grid. Báo lỗi nếu chênh lệch > 1h. |
| 4.4 | Lỗi mạng khi Refetch | Mạng rớt khi đang chuyển tuần. | Giữ nguyên dữ liệu tuần cũ, hiển thị Toast cảnh báo "Lỗi kết nối". |
| 4.5 | Dữ liệu rác (Thiếu giờ kết thúc) | Lỗi DB thiếu \`endTime\`. | Fallback: Mặc định render thẻ có độ cao 1.5 giờ và đánh cờ màu cam. |
| 4.6 | Chọn quá nhiều phòng học | ToolbarSelect bị dài. | Chuyển hiển thị thành "Đã chọn N phòng" thay vì liệt kê chuỗi dài. |
| 4.7 | Thẻ bị khóa sổ (Locked) | Lớp học đã hoàn tất tài chính. | Render thẻ có màu xám, thêm icon \`Lock\`. Click vào chỉ xem, vô hiệu hóa mọi nút Sửa trong Popup. |
| 4.8 | Sự kiện vượt nửa đêm | Lớp học từ 22:30 đến 00:30 hôm sau. | Chia làm 2 thẻ logic: 1 thẻ dừng ở 23:59, 1 thẻ bắt đầu lúc 00:00 ngày hôm sau. |

---

## 5. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Bước kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Độ chính xác lưới dọc | Tạo test data có lớp từ \`17:15\` đến \`18:45\`. | Thẻ nằm lệch xuống 1/4 block (15p) so với vạch 17:00, chiều cao chuẩn xác 1.5 blocks. |
| V-02 | Chức năng lọc Combo | Chọn Phòng 101 + GV Nguyễn Văn A. | Chỉ hiển thị các buổi do GV A dạy tại Phòng 101. |
| V-03 | Refetch Trigger | Mở popup, bấm "Hủy buổi". Đóng popup. | Thẻ lịch tự động chuyển sang màu Đỏ mà không cần reload trình duyệt. |
| V-04 | Overlap Layout | Tạo 3 lớp học cùng một khung giờ. | 3 thẻ chia đều chiều ngang (width 33.3%), không đè mất chữ. |

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Render Layout Khung | Trực quan UI. | Giao diện gồm Toolbar, Grid chuẩn, Breadcrumb đúng. |
| AC-02 | Map Data đúng chuẩn | Console log mảng \`events\` nhận vào. | Đúng \`type === 'CLASS_SESSION'\`. Không chứa Booking Test. |
| AC-03 | Chiều cao Card chuẩn | CSS check trên DOM. | Lớp 1h cao \`X px\`, lớp 2h cao \`2X px\`. Sai số 0px. |
| AC-04 | Hover Tooltip | Di chuột qua thẻ lịch bất kỳ trong 0.5s. | Bật Tooltip với ít nhất 3 dòng thông tin: Tên bài, Sĩ số, GV. |
| AC-05 | Chuyển View Mode | Bấm "Tháng", sau đó "Ngày". | Lưới chuyển đổi mượt mà, data được load lại đúng khung thời gian tương ứng. |
| AC-06 | Nút "Hôm nay" | Kéo sang tuần sau, bấm "Hôm nay". | Grid giật về tuần hiện tại lập tức. |
| AC-07 | Xử lý Read-only | Thử thao tác kéo thẻ (Drag) sang ngày khác. | Thẻ không di chuyển, không có event nào được kích hoạt. |
| AC-08 | Tích hợp Popup | Click thẻ lịch. | Bật \`<SessionDetailDialog>\` của đúng \`sessionId\` đó. |
| AC-09 | Lọc theo Phòng học | Chọn "Phòng 201". | Chỉ thẻ ở Phòng 201 hiển thị. |
| AC-10 | Phân quyền Data | Đăng nhập bằng Account Giáo viên (Không phải Admin). | Nếu backend chặn, grid báo "Không có quyền xem toàn bộ lịch cơ sở". (Tùy phân quyền HR). |
| AC-11 | Xử lý Loading | Chuyển qua tuần có dữ liệu nặng. | Hiện \`<ModuleLoadingSkeleton>\` (dạng Calendar) trong lúc chờ API. |
| AC-12 | Xử lý Lỗi | Tắt mạng, bấm "Tháng sau". | Bật \`<ErrorState>\` hoặc Toast, không sập toàn bộ UI. |
`;

const doc2 = `---
id: US-ENR03-04
title: "Lịch sự kiện Cơ sở (Global Event Schedule)"
bf: BF-ENR-03
domain: CAP-ADM
status: standardized
tags: [schedule, events, booking, aggregator, polymorphism]
---

# US-ENR03-04: Lịch sự kiện Cơ sở (Global Event Schedule)

> **Tham chiếu:** BF-ENR-03 · \`[POLICY-DS-03]\` · Giao diện Mẫu §4.2 (Danh sách dạng Grid/Calendar)

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
   - 3 Nguồn chính: \`Booking Test\` (từ \`BF-ENR-01\`), \`Học thử\` (từ \`BF-ENR-02\`), \`Sự kiện Nội bộ/Hội thảo\` (từ \`BF-ENR-03\`).
   - Yêu cầu Backend mapping về 1 schema chuẩn: \`IUnifiedEvent\` trước khi giao cho UI.
2. **[RULE-EVT-02] Đa hình Popup (Polymorphic Detail Trigger):** 
   - Lưới lịch ở chế độ **Read-only**.
   - Click vào thẻ sự kiện -> Chạy bộ định tuyến (Router/Switch-Case) dựa vào trường \`eventType\`:
     - Nếu \`BOOKING_TEST\` -> Mở \`<BookingTestDetailDialog>\`
     - Nếu \`TRIAL_CLASS\` -> Mở \`<TrialClassDetailDialog>\`
     - Nếu \`WORKSHOP\` -> Mở \`<EventDetailDialog>\`
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
| Chọn Trung tâm | \`BranchSelect\` | Lọc theo cơ sở | |
| Tình trạng | \`ToolbarSelect\` | Chờ test, Đang test, Đã test, No-show | |
| Tìm kiếm | \`ExpandableSearch\`| Tìm theo Tên KH, Số điện thoại (Partial match) | Quan trọng khi khách đến quầy lễ tân đọc SĐT. |
| Tạo mới | \`Dropdown Button\` | Menu: "Tạo Booking Test", "Tạo Học thử" | Action tắt giúp Sale thao tác nhanh mà không cần chuyển Menu. |

### 3.2. Bảng Lịch (Time Grid Core)

| Thành phần | Loại hiển thị | Dữ liệu | Ghi chú |
|------------|---------------|---------|---------|
| Khay All-Day | Vùng ngang trên cùng | Các sự kiện Hội thảo/Workshop | |
| Trục thời gian | Cột dọc | 07:00 - 22:00 | |
| Thẻ Lịch (Card) | \`PolymorphicEventBlock\` | Tên KH, SĐT ẩn một phần, Loại (Icon), Trạng thái | Yêu cầu chữ rõ ràng. Không co text quá nhỏ. |
| Màu nền (Bg) | Tùy chọn Mode | Theo loại sự kiện hoặc theo Trạng thái Booking | Mặc định: Theo Trạng thái Booking (Chờ test = Vàng, Xong = Xanh). |

### 3.3. Thẻ Sự kiện (Event Card)

| Icon chỉ thị | Loại Sự kiện | Logic Màu Viền |
|--------------|--------------|----------------|
| \`Search\` / \`FileText\` | Booking Test | Bo góc vuông vức. |
| \`GraduationCap\` | Học thử | Bo góc tròn \`rounded-xl\` để phân biệt hình khối. |
| \`Megaphone\` | Hội thảo | Kéo dài All-day. |

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
| AC-02 | Chuyển luồng Component (Dispatcher) | Code review \`onClick\`. | Hàm gọi đúng Component tương ứng với \`eventType\` theo Bảng 2. |
| AC-03 | Tìm kiếm theo SĐT phần mềm | Nhập "098". | Thẻ nào SĐT chứa "098" sẽ được highlight hoặc chỉ hiện thẻ đó. Tốc độ Debounce 300ms. |
| AC-04 | Nút Tạo mới Dropdown | Bấm "Tạo mới" -> Chọn "Booking Test". | Form thêm mới Booking Test gốc được bật lên. |
| AC-05 | Xử lý Thẻ thiếu giờ kết thúc | Kiểm tra với thẻ không có Duration. | Thẻ tự gán chiều cao 30 phút chuẩn mực. |
| AC-06 | Màu sắc Trạng thái Booking | Đối chiếu thẻ "Chờ test" và "Đã test". | Khác màu nền hoàn toàn, theo chuẩn \`statusColors.ts\`. |
| AC-07 | Cập nhật Reactive | Mở chi tiết "Chờ test", chuyển thành "Đã xong", tắt popup. | Thẻ lịch tự động chuyển màu sang "Đã xong". |
| AC-08 | Responsive | Mở trên trình duyệt mobile (Width 375px). | Lịch chuyển thành Agenda (Danh sách cuộn dọc), ẩn lưới ngang. |
| AC-09 | Gom nhóm (Stacking) | Test với 5 booking trùng giờ. | UI kích hoạt Clustering thành công. |
| AC-10 | Phân quyền truy cập | Login bằng tk Giảng viên (Không có quyền Sale). | Chặn truy cập hoặc ẩn các SĐT của khách hàng. |
`;

const doc3 = `---
id: US-HR-02-04
title: "Xem Lịch của tôi (My Schedule / Super Aggregator)"
bf: BF-HR-02
domain: CAP-HR
status: standardized
tags: [schedule, calendar, personal, aggregator, hr]
---

# US-HR-02-04: Xem Lịch của tôi (My Schedule / Super Aggregator)

> **Tham chiếu:** BF-HR-02 · \`[POLICY-HR-01]\` · Giao diện Mẫu §4.2 (Danh sách dạng Grid / Calendar cá nhân)

## 1. Yêu cầu Người dùng (User Story)

**Là một** Nhân sự của tổ chức (Giáo viên, Trợ giảng, Nhân viên Tư vấn, Quản lý),
**tôi muốn** xem toàn bộ lịch làm việc cá nhân của mình được tổng hợp từ tất cả các hệ thống (Lịch dạy Lớp học, Lịch coi thi Booking Test, Lịch Học thử, Lịch họp nội bộ, Lịch nghỉ phép),
**để** biết chính xác các công việc và khung thời gian mình đã được phân bổ trong ngày/tuần, từ đó chủ động sắp xếp công việc cá nhân, đảm bảo đúng giờ và chuẩn bị kỹ lưỡng cho công việc giảng dạy/tư vấn.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai hiển thị hoàn toàn độc lập với các bảng nghiệp vụ.
> - [x] **N**egotiable — Giao diện hỗ trợ linh hoạt 3 dạng: Grid, List Agenda, Timeline.
> - [x] **V**aluable — Cực kỳ giá trị với Giáo viên "chạy show" nhiều nhánh, nhiều lớp.
> - [x] **E**stimable — Rõ ràng về data model (Super Unified Model).
> - [x] **S**mall — Chỉ tập trung vào UI Rendering cho 1 \`current_user\`.
> - [x] **T**estable — Có 12+ tiêu chí nghiệm thu chặt chẽ.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-MYCAL-01] Mô hình "Super Consumer" (Cá nhân hóa tuyệt đối):** 
   - Dữ liệu trả về bắt buộc lấy theo mệnh đề \`WHERE assigned_employee_id = current_user_id\`.
   - Lấy từ TẤT CẢ các module: Xếp lịch lớp, Lịch thi, Họp nội bộ, Nghỉ phép cá nhân.
2. **[RULE-MYCAL-02] Đa Chi nhánh (Cross-Branch Aggregation):**
   - Lịch của tôi MẶC ĐỊNH phải gộp lịch từ TẤT CẢ cơ sở mà nhân sự đó được điều động.
   - BẮT BUỘC hiển thị rõ Tên Chi nhánh / Cơ sở trên từng thẻ lịch để giáo viên biết họ phải di chuyển đến đâu.
3. **[RULE-MYCAL-03] Chế độ Chỉ đọc (Read-only):**
   - Tuyệt đối không cho sửa trực tiếp thời gian, địa điểm trên lưới sự kiện này.
   - Bất kỳ nhu cầu thay đổi nào đều phải gọi Action để hệ thống điều hướng về Form nghiệp vụ gốc.
4. **[RULE-MYCAL-04] Lịch Nghỉ phép (Time-off Blockers):**
   - Nếu nhân sự có đơn xin nghỉ phép đã duyệt trong dải ngày xem, lịch phải bôi xám (Blocked) dải ngày/giờ đó và ghi rõ "Nghỉ phép".

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-01] Thời gian Hợp nhất:** Backend phải thực thi truy vấn hợp nhất đa luồng trong dưới \`1.0 giây\`.
- **[METRIC-02] Mobile-First SLA:** Màn hình này có 80% traffic từ điện thoại, bắt buộc tối ưu hiển thị 100% không gian dọc (Agenda View) trên màn hình dưới 768px.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục Tổng thể:** Dạng Bảng điều khiển cá nhân (Personal Dashboard).

### 3.1. Thanh công cụ (Toolbar)

| Thành phần | Loại hiển thị | Logic & Tham số | Ghi chú |
|------------|---------------|-----------------|---------|
| Chế độ xem | Segmented Control | Chuyển Ngày / Tuần / Agenda | Trên Điện thoại, mặc định ghim chết ở Agenda. |
| Khung Tìm kiếm | \`ExpandableSearch\` | Tìm Tên lớp, Loại sự kiện | Tự động highlight kết quả trên lịch. |
| Nút Báo bận | \`IconActionButton\` | Mở nhanh Form "Xin nghỉ / Báo bận" | HR Module. |
| Nút Bộ lọc | \`FilterIconButton\` | Mở bảng Slide Panel bên phải | |

### 3.2. Bảng lọc nâng cao (Slide Panel)

| Thành phần | Loại hiển thị | Dữ liệu | Ghi chú |
|------------|---------------|---------|---------|
| Nguồn sự kiện | Checkbox Group | Tích chọn: Lớp học, Trực test, Họp, Nghỉ phép | |
| Cơ sở làm việc | Multi-Select | Chọn các cơ sở muốn xem | |

### 3.3. Bảng Lịch (Schedule Time Grid / Agenda)

| Thành phần | Loại hiển thị | Trường Dữ liệu | Ghi chú |
|----------|---------------|----------------|---------|
| Trục thời gian | Cột giờ / Headers ngày | 07:00 -> 23:00 | Khung giờ chung. |
| Thẻ lịch (\`UnifiedPersonalCard\`) | Khối thông tin bo góc | Giờ, Tên Lớp/Sự kiện, Phân loại, **Tên Cơ sở**, Vai trò | Đặc biệt: Cơ sở (Branch) phải in đậm. |
| Khối Nghỉ phép (\`BlockerCard\`) | Dải màu xám gạch chéo | Ghi chú lý do nghỉ | Chặn ngang không cho xếp lịch (Visual only). |

### 3.4. Thao tác trên Thẻ Lịch (Card)

| Thao tác | Hành động | Kết quả mong đợi | Điều kiện |
|----------|----------|------------------|-----------|
| Click Trái| Bấm vào thẻ | Bật popup chi tiết nhỏ (Mini-detail) | Pop-up nhỏ gọn chứa nút Action liên kết ngoài. |
| Right-Click | Bấm chuột phải | Bật Context Menu lối tắt | "Xin dạy thay", "Gửi nhận xét bài học", "Xem giáo án". |

---

## 4. Xử lý Ngoại lệ (Corner Cases)

| # | Tình huống | Cách xử lý | UI/UX Feedback |
|---|-----------|------------|----------------|
| 4.1 | Tuần trống lịch | Không có lớp/sự kiện. | Hiển thị Empty State lớn hình ảnh thư giãn: "Tuần này bạn có thể nghỉ ngơi!". |
| 4.2 | Đụng lịch vật lý | HR xếp nhầm giờ 2 cơ sở cách xa nhau. | Cảnh báo Đỏ rực chớp nháy (Red Alert) trên cả 2 thẻ lịch: "Cảnh báo trùng lịch cá nhân!". |
| 4.3 | Đổi múi giờ | GV đang công tác ở nước ngoài xem lịch. | Ép hiển thị theo Múi giờ gốc của Trung tâm (Việt Nam GMT+7), kèm cảnh báo nhỏ trên header. |
| 4.4 | Mất mạng | | Hiển thị Toast, giữ nguyên cache lịch cũ để GV vẫn xem được offline. |
| 4.5 | Đóng ứng dụng / Mở lại | | Lưu state View (Ngày/Tuần/Agenda) vào \`localStorage\`. |

---

## 5. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Test hợp nhất | Inject mock data từ 3 nguồn: Lớp, Test, Xin nghỉ. | Render trơn tru, hiển thị dải xám cho Xin nghỉ, thẻ xanh cho Lớp. |
| V-02 | Test Mobile | Bật Device Toolbar (Mobile). | Giao diện tự động sụp thành list Agenda cuộn mượt mà. |
| V-03 | Local Storage | Đổi view sang "Ngày", F5 trình duyệt. | Vẫn giữ ở view "Ngày". |

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Trọn vẹn dữ liệu cá nhân | Login bằng GV A, query từ DB các bảng. | Hiển thị chính xác 100% sự kiện có gắn tag ID GV A. |
| AC-02 | Cross-Branch Visibility | Mock data GV dạy tại 2 cơ sở. | Thẻ lịch có Badge "Cơ sở 1", "Cơ sở 2" chữ in đậm, dễ nhìn. |
| AC-03 | Component Isolation | Code review \`MyScheduleScreen\`. | Màn hình sạch bong, KHÔNG có hàm \`POST/PUT\` liên quan tới business gốc. |
| AC-04 | Nghỉ phép (Time-off) | Tạo 1 phiếu xin nghỉ buổi sáng. | Lưới sáng hiển thị 1 block màu xám gạch chéo "Nghỉ phép". |
| AC-05 | Lọc Nguồn Sự Kiện | Tích bỏ "Họp nội bộ". | Các thẻ họp nội bộ biến mất lập tức trên grid. |
| AC-06 | Responsive Agenda | Resize cửa sổ xuống 400px. | Grid biến mất, list Agenda hiện lên. Khác biệt UI hoàn toàn nhưng chung 1 nguồn data. |
| AC-07 | Cảnh báo Trùng lịch | Thêm 2 lịch trùng giờ. | Thẻ đỏ, viền đậm, có icon tam giác cảnh báo. |
| AC-08 | Context Menu Lối tắt | Chuột phải vào thẻ Lớp học. | Hiện menu nhỏ: "Xin dạy thay", "Nhận xét buổi học". |
| AC-09 | Mở Mini-Detail | Click chuột trái. | Hiện Modal tóm tắt thông tin, kèm nút "Xem chi tiết gốc". |
| AC-10 | Đổi múi giờ an toàn | Đổi múi giờ máy tính sang Mỹ. | Grid vẫn bám theo đúng dải giờ của VN, không bị chạy lùi thẻ lịch. |
| AC-11 | Nút Báo bận | Bấm nút IconActionButton "Báo bận". | Chuyển hướng sang Form xin nghỉ của phân hệ HR. |
| AC-12 | Xử lý Offline | Tắt WIFI, F5 trang. | Có cơ chế fallback/cache (PWA) hoặc chí ít không vỡ giao diện. |
`;

fs.writeFileSync('docs/business-functions/US-OPS02-03-quan-ly-lich-tong-the-co-so.md', doc1);
fs.writeFileSync('docs/business-functions/US-ENR03-04-lich-su-kien-co-so.md', doc2);
fs.writeFileSync('docs/business-functions/US-HR-02-04-lich-cua-toi.md', doc3);
console.log('Detailed files updated successfully.');
