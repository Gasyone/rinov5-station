const fs = require('fs');
const doc1 = `---
id: US-OPS02-03
title: "Lịch học Cơ sở (Global Class Schedule)"
bf: BF-OPS-02
domain: CAP-OPS
status: standardized
tags: [schedule, class, ops, aggregator]
---

# US-OPS02-03: Lịch học Cơ sở (Global Class Schedule)

> **Tham chiếu:** BF-OPS-02 · Giao diện Mẫu §4.2 (Danh sách dạng Grid/Calendar)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Quản lý chi nhánh hoặc Nhân viên Giáo vụ, **tôi muốn** xem toàn bộ lịch học (Class Sessions) của tất cả các lớp đang diễn ra tại cơ sở trên một giao diện lịch tổng hợp (Lịch tuần/tháng), **để** nắm bắt tình hình sử dụng phòng học, lịch dạy của giáo viên, phát hiện sớm các phòng học trống để tối ưu hóa nguồn lực, và nhanh chóng tra cứu thông tin vận hành của bất kỳ buổi học nào.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập với các US quản lý Lớp học. Đóng vai trò là Aggregator (Consumer).
> - [x] **N**egotiable — Chi tiết giao diện (bộ lọc, góc nhìn tháng/tuần/ngày) có thể linh hoạt điều chỉnh theo component UI library.
> - [x] **V**aluable — Cung cấp "bức tranh toàn cảnh" về hoạt động đào tạo tại cơ sở, giảm thời gian check phòng trống từ 5 phút xuống 5 giây.
> - [x] **E**stimable — Ước lượng rõ ràng dựa trên Component Calendar có sẵn.
> - [x] **S**mall — Có thể hoàn thành nhanh trong 1 Sprint.
> - [x] **T**estable — Có tiêu chí nghiệm thu rõ ràng ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-CAL-01] Nguồn dữ liệu (Producer):** 
   - Lịch học cơ sở **chỉ** hiển thị các sự kiện là Buổi học (Sessions) được sinh ra từ Lớp học (\`BF-OPS-02\` / \`BF-OPS-03\`). 
   - KHÔNG chứa Booking Test, Học thử hay Sự kiện Hội thảo (những đối tượng này có màn hình Lịch sự kiện riêng).
2. **[RULE-CAL-02] Read-only & Detail Trigger:** 
   - Trên màn hình Lịch, người dùng KHÔNG thể kéo thả (drag & drop) để đổi lịch hay thay đổi thời lượng buổi học trực tiếp trên lưới. Lịch hoạt động ở chế độ **Read-only**.
   - Bất kỳ tương tác nào đều thông qua việc click vào thẻ sự kiện (Event Card) để mở Popup/Dialog Chi tiết Buổi học (\`<SessionDetailDialog>\`). Mọi logic đổi giờ, dạy thay, hủy buổi nằm hoàn toàn trong phân hệ \`BF-OPS-03\`.
3. **[RULE-CAL-03] Đồng bộ tự động (Reactive):** 
   - Khi có thay đổi trạng thái buổi học (VD: đổi phòng, hủy) từ Popup chi tiết, sau khi Popup báo \`onSuccess\`, màn hình Lịch phải tự động tải lại (Refetch) để phản ánh trạng thái mới nhất ngay lập tức mà không cần tải lại toàn bộ trang.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-01] Hiệu năng (SLA):** Thời gian tải dữ liệu lịch của 1 Tuần (hoặc 1 Tháng) cho 1 Chi nhánh lớn (khoảng 1000 sessions/tháng) phải dưới \`1.5 giây\`. Bắt buộc phải áp dụng pagination hoặc lazy load theo view-port.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ (Toolbar)
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chế độ xem | Segmented Control | Chuyển đổi Ngày / Tuần / Tháng | Mặc định: Tuần. |
| Chọn Trung tâm | \`BranchSelect\` | Lọc theo cơ sở làm việc | Mặc định: Chi nhánh hiện tại của User đăng nhập. |
| Chọn Phòng học | \`ToolbarSelect\` (Multiple) | Lọc lịch theo danh sách phòng học cụ thể | Rất quan trọng để check trống phòng. |
| Chọn Giáo viên | \`ToolbarSelect\` (Multiple) | Lọc lịch theo Giáo viên đang giảng dạy | Hỗ trợ gõ tìm kiếm nhanh. |
| Tìm kiếm | \`ExpandableSearch\` | Quét Tên lớp, Mã lớp, Tên bài học (Topic) | Tìm kiếm realtime (Debounce 300ms). |
| Bộ lọc trạng thái| \`FilterIconButton\` | Lọc theo: Bình thường, Dạy thay, Đổi phòng, Đã hủy | Mở Panel trượt (Slide Panel) từ bên phải. |

### 3.2. Bảng Lịch (Calendar/Time Grid)
| Thành phần | Loại hiển thị | Dữ liệu | Ghi chú |
|------------|---------------|---------|---------|
| Trục thời gian | Cột giờ / Ngày | Dựa theo chế độ xem (TimeGrid) | Khung giờ chuẩn: 07:00 - 22:00. Ẩn các khung giờ ban đêm để tiết kiệm không gian. |
| Thẻ Lịch (Card) | \`UnifiedEventBlock\` | Giờ bắt đầu-kết thúc, Mã Lớp, Tên GV, Phòng học | Chiều cao tự động co giãn theo thời lượng buổi học (VD: 1.5h, 2h). |
| Màu sắc thẻ | Background Color | Áp dụng \`getStatusBadgeClass(status)\` từ \`statusColors.ts\` | VD: Buổi học bị hủy (Đỏ), Buổi học dạy thay (Vàng), Bình thường (Xanh ngọc). |

### 3.3. Thao tác trên Thẻ Lịch (Card)
| Nút / Hành động | Loại | Logic | Điều kiện |
|-----------------|------|-------|-----------|
| Click Thẻ lịch | Click Event | Mở \`<SessionDetailDialog id={sessionId} />\` của phân hệ Lớp học | Chặn click hoặc vô hiệu hóa các nút sửa nếu thẻ có trạng thái \`Locked\` (Khóa kỳ sổ). |
| Hover Thẻ lịch | Tooltip | Hiển thị Tooltip tóm tắt: Sĩ số, Tên Topic, Trạng thái điểm danh | Delay hiển thị 300ms để tránh nhiễu loạn UI. |

---

## 4. Xử lý Ngoại lệ

| # | Tình huống | Cách xử lý | UI/UX Feedback |
|---|-----------|-----------|----------------|
| 4.1 | Không có lịch học (Ngày nghỉ) | Hiển thị lưới lịch trống. | Khung lưới vẫn giữ nguyên, không hiển thị thẻ nào, có thông báo watermark mờ "Không có lịch trình". |
| 4.2 | Lịch chồng chéo (Overlap) | Xảy ra khi có lỗi xếp lịch trùng phòng/trùng GV. | Render thẻ dạng chia đôi cột (Split width) và viền cảnh báo Đỏ đậm (\`border-destructive\`). Cảnh báo rõ trong tooltip. |
| 4.3 | Lỗi mạng khi fetch data | Gọi API thất bại do mất kết nối hoặc timeout. | Hiển thị \`<ErrorState />\` ở giữa Calendar, kèm nút "Thử lại". Không sập trắng toàn trang. |

---

## 5. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Bước kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Phân tách dữ liệu | Inspect API response trong Network Tab. | Đảm bảo data trả về có \`type === 'CLASS_SESSION'\`, tuyệt đối không lẫn Booking Test hay Sự kiện. |
| V-02 | Chức năng lọc phức hợp | Chọn "Phòng 101" + Trạng thái "Dạy thay". | Lưới lịch chỉ hiển thị các buổi học dạy thay tại Phòng 101. Các thẻ khác bị làm mờ hoặc ẩn hoàn toàn. |
| V-03 | Component Isolation | Click vào 1 Buổi học, thực hiện Hủy buổi trong Popup. | Sau khi Popup đóng, gọi đúng hàm \`refetch()\`, thẻ lịch chuyển sang màu Đỏ (Đã hủy) ngay lập tức mà không refresh toàn bộ trang web. |

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Độ chính xác không gian | Đối chiếu giờ bắt đầu/kết thúc trên thẻ so với lưới giờ dọc (TimeGrid). | Thẻ lịch bám đúng vị trí block thời gian tới từng phút (VD: 18:00 - 19:30 chiếm đúng 1.5 ô). |
| AC-02 | Tính đóng gói (Decoupling) | Rà soát source code của component Màn hình Lịch. | Component Lịch chỉ nhận \`data\` và truyền \`sessionId\` vào \`<SessionDetailDialog>\`. Zero logic thay đổi dữ liệu bên trong file Lịch. |
| AC-03 | Xử lý Overlap an toàn | Cố tình tạo 2 bản ghi trùng khung giờ bằng Database Tool. | UI tự động chia cột (width 50%), không bị vỡ bố cục tổng thể, không đè lấp chữ làm mất thông tin. |
`;

const doc2 = `---
id: US-ENR03-04
title: "Lịch sự kiện Cơ sở (Global Event Schedule)"
bf: BF-ENR-03
domain: CAP-ADM
status: standardized
tags: [schedule, events, booking, aggregator]
---

# US-ENR03-04: Lịch sự kiện Cơ sở (Global Event Schedule)

> **Tham chiếu:** BF-ENR-03 · Giao diện Mẫu §4.2 (Danh sách dạng Grid/Calendar)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Quản lý chi nhánh hoặc Tư vấn viên (Sales/Admissions), **tôi muốn** xem toàn bộ lịch sự kiện tuyển sinh (Booking Test, Học thử, Hội thảo) diễn ra tại cơ sở trên một giao diện lịch tổng hợp chung, **để** nắm bắt lịch trình tiếp đón khách, kiểm tra trực quan xem phòng test hoặc giáo viên test có bị trùng lịch hay không, và quản lý các lượt khách đến cơ sở một cách chuyên nghiệp.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập với các form tạo Booking. Đóng vai trò là Aggregator (Consumer).
> - [x] **N**egotiable — Giao diện lịch có thể linh hoạt điều chỉnh để gộp hoặc tách các loại Booking khác nhau vào hiển thị chung/riêng.
> - [x] **V**aluable — Tạo ra "Một nguồn sự thật" (Single Source of Truth) về lưu lượng khách hàng đến test và học thử, chống quá tải sảnh đón khách.
> - [x] **E**stimable — Dễ dàng ước lượng do chỉ là màn hiển thị UI mapping data.
> - [x] **S**mall — Hoàn thành gọn gàng trong 1 Sprint.
> - [x] **T**estable — Có tiêu chí nghiệm thu khắt khe ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-EVT-01] Đa nguồn dữ liệu (Multi-Producers):** 
   - Lịch sự kiện cơ sở **chỉ** hiển thị các sự kiện ngoài Lớp học chính khóa. 
   - Dữ liệu được tổng hợp từ 3 nguồn: \`Booking Test\` (từ \`BF-ENR-01\`), \`Học thử\` (từ \`BF-ENR-02\`), và các \`Sự kiện nội bộ/Hội thảo\` (từ \`BF-ENR-03\`).
   - Yêu cầu backend phải mapping 3 nguồn này về 1 cấu trúc \`UnifiedEvent\` chuẩn trước khi trả về cho UI.
2. **[RULE-EVT-02] Read-only & Polymorphic Detail Trigger:** 
   - Lưới lịch hoạt động ở chế độ **Read-only**.
   - Bất kỳ tương tác nào đều thông qua việc click vào thẻ sự kiện (Event Card). Hệ thống sẽ sử dụng cơ chế đa hình (Polymorphism) căn cứ vào thuộc tính \`eventType\` để gọi đúng Popup/Dialog chi tiết của phân hệ gốc.
   - Ví dụ: \`type === 'BOOKING_TEST'\` -> Gọi \`<BookingTestDetailDialog>\`. \`type === 'TRIAL'\` -> Gọi \`<TrialBookingDetailDialog>\`.
3. **[RULE-EVT-03] Đồng bộ tự động (Reactive):** 
   - Khi có thay đổi trạng thái (VD: Khách hủy Booking, Đổi giờ test, Cập nhật kết quả test) từ Popup chi tiết, màn hình Lịch tự động re-fetch toàn bộ dữ liệu hoặc update cục bộ state.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-01] Hiệu năng đa luồng (SLA):** Thời gian tải dữ liệu lịch của 1 Tuần từ 3 bảng dữ liệu khác nhau phải dưới \`2.0 giây\`. 
- **[METRIC-02] Sức chịu tải UI:** Hỗ trợ hiển thị tối đa lên đến 200 booking trong một ngày cuối tuần căng thẳng mà không làm giật lag trình duyệt (Sử dụng Virtualization nếu cần).

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ (Toolbar)
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chế độ xem | Segmented Control | Ngày / Tuần / Tháng | Mặc định: Tuần. Chế độ Tháng thường dùng để xem Hội thảo lớn. |
| Chọn Trung tâm | \`BranchSelect\` | Lọc theo cơ sở | Mặc định: Chi nhánh hiện tại của User. |
| Loại sự kiện | Checkbox Group / Multi-Select | Tích chọn: Booking Test, Học thử, Sự kiện khác | Cực kỳ quan trọng để ẩn bớt các loại không cần xem khi lịch quá dày. |
| Tìm kiếm | \`ExpandableSearch\` | Tìm Tên khách hàng, SĐT, Tên Sự kiện | Hỗ trợ tìm số điện thoại dạng một phần (partial match). |
| Nút Tạo mới | Dropdown Button (\`IconActionButton\`) | Menu con: "Tạo Booking Test", "Tạo Học thử" | Action này sẽ mở trực tiếp Form tạo của các BF gốc. |

### 3.2. Bảng Lịch (Calendar/Time Grid)
| Thành phần | Loại hiển thị | Dữ liệu | Ghi chú |
|------------|---------------|---------|---------|
| Trục thời gian | Cột giờ / Ngày | Dựa theo chế độ xem | Khung giờ chuẩn: 07:00 - 22:00. |
| Thẻ Lịch (Card) | \`PolymorphicEventBlock\` | Giờ, Tên KH/Sự kiện, Loại (Test/Học thử), Trạng thái, SĐT | Chiều cao tự động co giãn. Bắt buộc hiển thị Icon nhỏ để phân biệt nhanh (VD: Icon Kính lúp cho Test, Icon Học sinh cho Học thử). |
| Màu sắc thẻ | Background Color | Lấy từ \`statusColors.ts\` (ENTITY_STATUS_MAP) | Phân loại theo Trạng thái Booking (Chờ test, Đang test, Đã xong, Đã hủy, No-show). |

### 3.3. Thao tác trên Thẻ Lịch (Card)
| Nút / Hành động | Loại | Logic | Điều kiện |
|-----------------|------|-------|-----------|
| Click Thẻ lịch | Nhấp chuột (Click) | Mở Component chi tiết tương ứng với \`eventType\` | Bắt buộc phải Switch-Case đúng Component. |
| Hover Thẻ lịch | Tooltip | Hiển thị thêm thông tin ghi chú nội bộ (nếu có) | Hỗ trợ Sales đọc nhanh tình trạng khách. |

---

## 4. Xử lý Ngoại lệ

| # | Tình huống | Cách xử lý | UI/UX Feedback |
|---|-----------|-----------|----------------|
| 4.1 | Ngày trống sự kiện | Hiển thị lưới lịch bình thường. | Dấu watermark mờ. |
| 4.2 | Lịch chồng chéo khổng lồ (Extreme Overlap) | Booking Test cuối tuần thường có 10-20 học viên cùng một block 18:00. | Tuyệt đối KHÔNG chia 20 cột (sẽ không thể đọc chữ). UI phải đổi sang chế độ tóm tắt: "18:00 - Có 20 Booking Test". Khi Click vào khối tóm tắt, bật List Popup hiển thị danh sách 20 booking đó. |

---

## 5. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Bước kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Phân tách dữ liệu đa miền | Kiểm tra API / Mock Data từ 3 nguồn | Tuyệt đối không bị lẫn dữ liệu "Lớp học" vào màn Lịch sự kiện. |
| V-02 | Lọc loại sự kiện tức thời | Bỏ tick ô "Booking Test" | Các thẻ Booking Test biến mất ngay lập tức (Xử lý mượt ở state local, không cần gọi API lại nếu không đổi tuần). |
| V-03 | Đa hình Component | Click thẻ Booking Test vs Click thẻ Học thử | Pop-up hiện lên phải khớp hoàn toàn với luồng nghiệp vụ đặc thù của từng loại (gọi đúng Component). |

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Render chính xác độ cao | Mở chế độ Tuần, tạo sự kiện 30 phút và 2 tiếng. | Thẻ 2 tiếng phải có độ cao gấp 4 lần thẻ 30 phút. Text bên trong tự động ẩn bớt nếu tràn. |
| AC-02 | Dynamic Navigation Framework | Rà soát code luồng \`onClick\` thẻ lịch. | Áp dụng đúng Switch-Case để chọn Component hiển thị dựa trên \`eventType\`. Không nhồi nhét If-Else chằng chịt. |
| AC-03 | Xử lý Extreme Overlap | Thử tạo 15 Booking cùng 1 khung giờ. | UI tự động chuyển thành khối gom nhóm (Stacked/Summary Block), không bị lỗi vỡ layout hoặc tràn màn hình ngang. |
`;

const doc3 = `---
id: US-HR-02-04
title: "Xem Lịch của tôi (My Schedule / Aggregator)"
bf: BF-HR-02
domain: CAP-HR
status: standardized
tags: [schedule, calendar, personal, aggregator, hr]
---

# US-HR-02-04: Xem Lịch của tôi (My Schedule / Aggregator)

> **Tham chiếu:** BF-HR-02 · Giao diện Mẫu §4.2 (Danh sách dạng Grid / Calendar cá nhân)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Nhân sự của tổ chức (Giáo viên, Trợ giảng, Nhân viên Tư vấn, Quản lý), **tôi muốn** xem toàn bộ lịch làm việc cá nhân của mình được tổng hợp từ tất cả các hệ thống (Lịch dạy Lớp học, Lịch coi thi Booking Test, Lịch Học thử, Lịch họp nội bộ), **để** biết chính xác các công việc và khung thời gian mình đã được phân bổ trong ngày/tuần, từ đó chủ động sắp xếp công việc cá nhân và đảm bảo chất lượng công việc cao nhất.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai hiển thị hoàn toàn độc lập, đóng vai trò là "Super Consumer".
> - [x] **N**egotiable — Giao diện có thể điều chỉnh linh hoạt dạng Danh sách (Agenda) hoặc Lưới (Grid) tùy thiết bị.
> - [x] **V**aluable — Tạo ra "Một nguồn sự thật" (Single source of truth) về toàn bộ thời gian làm việc cho một cá nhân nhân viên.
> - [x] **E**stimable — Dễ dàng ước lượng do chỉ là màn hiển thị tổng hợp dữ liệu.
> - [x] **S**mall — Gói gọn trong một màn hình Dashboard/Lịch cá nhân duy nhất.
> - [x] **T**estable — Có thể tạo dữ liệu giả từ đa hệ thống để kiểm thử sự hợp nhất hoàn hảo (Aggregation Testing).

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-AGGR-01] Mô hình "Super Consumer":** 
   - Màn hình này đóng vai trò là **Consumer tối cao**. 
   - Các phân hệ khác như \`BF-OPS-02\` (Xếp lịch lớp), \`BF-ENR-01\` (Booking Test), \`BF-ENR-02\` (Học thử), \`BF-OPS-03\` (Sự kiện), \`BF-HR-03\` (Họp nội bộ) đều đóng vai trò là **Producer** (Sản xuất dữ liệu).
   - Dữ liệu trả về bắt buộc phải lấy theo mệnh đề \`WHERE assigned_employee_id = current_user_id\`.
2. **[RULE-AGGR-02] Ràng buộc hiển thị (Strictly Read-Only):**
   - Lịch của tôi là màn hình **Chỉ đọc**. Nhân sự không được phép sửa giờ, sửa trung tâm hay xóa sự kiện trực tiếp trên các thẻ lịch ở đây.
   - Bắt buộc phải bấm vào thẻ lịch để bật Form/Dialog ở chức năng gốc.
3. **[RULE-AGGR-03] Đa Chi nhánh (Cross-Branch Aggregation):**
   - Rất nhiều giáo viên chạy sô dạy ở nhiều chi nhánh khác nhau. Lịch của tôi MẶC ĐỊNH phải gộp lịch từ tất cả cơ sở mà họ được gắn vào.
   - Bắt buộc hiển thị rõ Tên Cơ sở/Chi nhánh trên từng thẻ lịch để giáo viên biết họ phải di chuyển đến đâu.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-01] SLA Hợp nhất dữ liệu:** Thời gian tổng hợp và tải lịch theo tuần/ngày cần \`< 2.0 giây\`. 
- **[METRIC-02] Tính Responsive (Mobile-first):** Do giáo viên thường xuyên xem lịch trên điện thoại, giao diện màn hình này bắt buộc phải tối ưu hiển thị ở dạng List Agenda trên màn hình nhỏ.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ (Toolbar)
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chế độ xem | Segmented Control | Chuyển đổi Ngày / Tuần / Agenda | Mặc định: Tuần (trên PC) hoặc Agenda (trên Mobile). |
| Chọn Trung tâm | Danh sách thả xuống (\`BranchSelect\`) | Lọc lịch theo trung tâm cụ thể | Mặc định: "Tất cả trung tâm của tôi". |
| Khung Tìm kiếm | Ô nhập chữ (\`ExpandableSearch\`) | Quét trường Tên, Lớp học, Loại | Cập nhật kết quả tự động realtime. |
| Nút Bộ lọc | Nút (\`FilterIconButton\`) | Mở bảng lọc nâng cao (Slide Panel) | Hiển thị số lượng bộ lọc đang bật (badge number). |
| Điều hướng thời gian | Icon Action Button | Lùi/Tiến 1 ngày hoặc 1 tuần | Trở về Hôm nay bằng nút Text. |

### 3.2. Bảng lọc nâng cao (Slide Panel)
| Thành phần | Loại hiển thị | Dữ liệu | Ghi chú |
|------------|---------------|---------|---------|
| Khoảng thời gian | Date Range Picker | Từ ngày - Đến ngày | Tùy chỉnh linh hoạt. |
| Nguồn sự kiện | Checkbox Group | Tích chọn: Lớp học, Học thử, Test, Họp | Lọc nguồn Producer cực kỳ hữu ích cho việc focus. |

### 3.3. Bảng Lịch (Schedule Time Grid / Agenda)
| Thành phần | Loại hiển thị | Trường Dữ liệu | Ghi chú |
|----------|---------------|----------------|---------|
| Trục thời gian | Cột giờ (Time Column) | 07:00 -> 23:00 | Khung giờ hoạt động chuẩn chung toàn hệ thống. |
| Thẻ lịch (\`UnifiedCard\`) | Khối thông tin bo góc | Giờ, Tên sự kiện, Phân loại, **Tên Cơ sở**, Vai trò | Tự động co giãn theo khoảng thời gian thực tế. Icon chỉ thị rõ Loại sự kiện. |
| Phân tách ngày | Header Grouping | Hiển thị Ngày, Tháng, Năm | Đặc biệt dùng cho chế độ xem Agenda. |

### 3.4. Thao tác trên Thẻ Lịch (Card)
| Nút / Thao tác | Loại | Logic | Điều kiện |
|----------------|------|-------|-----------|
| Thẻ lịch | Nhấp chuột (Click) | Mở trang chi tiết gốc của sự kiện/lớp học đó (Polymorphism Pattern) | Đảm bảo truyền đúng ID và loại sự kiện. |
| Quick Action | Context Menu (Right Click) | Cung cấp lối tắt: "Xin dạy thay", "Nhận xét" | Nằm ở phiên bản v2. |

---

## 4. Xử lý Ngoại lệ

| # | Tình huống | Cách xử lý | UI/UX Feedback |
|---|-----------|-----------|----------------|
| 4.1 | Không có lịch trình | Lưới thời gian hoặc danh sách hiển thị trống. | Hiện hình ảnh minh họa (Empty State) với nội dung "Tuần này bạn có thể nghỉ ngơi!". |
| 4.2 | Tìm kiếm không có kết quả | Ẩn toàn bộ thẻ lịch, lưới thời gian trống. | Hiển thị Empty State "Không tìm thấy kết quả phù hợp". |

---

## 5. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Hợp nhất đa nguồn | Dùng dữ liệu mock từ ít nhất 3 nguồn. | Tất cả render trơn tru trên cùng một lưới thời gian. |
| V-02 | Chuyển đổi khung nhìn | Bấm chuyển đổi "Ngày", "Tuần", "Agenda". | Trục thời gian hiển thị đúng định dạng, không vỡ layout. |

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Tính trọn vẹn dữ liệu | Login bằng tài khoản Giáo viên A, so sánh với dữ liệu SQL gốc. | Hiển thị 100% các lớp và ca test mà Giáo viên A được phân công, không thừa, không thiếu. |
| AC-02 | Cross-Branch Visibility | Xem lịch của Giáo viên dạy ở cả Cơ sở 1 và Cơ sở 2. | Thẻ lịch xuất hiện đủ, trên mỗi thẻ có Badge nổi bật ghi "Cơ sở 1" hoặc "Cơ sở 2" để tránh nhầm lẫn địa điểm. |
| AC-03 | Component Isolation | Code review màn hình \`MyScheduleScreen\`. | Màn hình không chứa logic \`updateSession\` hay \`cancelBooking\`. Chỉ thực hiện routing / popup opening. |
`;

fs.writeFileSync('docs/business-functions/US-OPS02-03-quan-ly-lich-tong-the-co-so.md', doc1);
fs.writeFileSync('docs/business-functions/US-ENR03-04-lich-su-kien-co-so.md', doc2);
fs.writeFileSync('docs/business-functions/US-HR-02-04-lich-cua-toi.md', doc3);
console.log('Files updated successfully.');
