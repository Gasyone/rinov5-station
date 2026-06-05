---
id: US-OPS02-03
title: "Quản lý Lịch tổng thể Cơ sở (Global Class Schedule)"
bf: BF-OPS-02
domain: CAP-OPS
status: standardized
tags: [schedule, class, ops, aggregator, calendar]
---

# US-OPS02-03: Quản lý Lịch tổng thể Cơ sở (Global Class Schedule)

> **Tham chiếu:** BF-OPS-02 · `[POLICY-DS-03]` · Giao diện Mẫu §4.2 (Danh sách dạng Grid/Calendar)

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
   - Lịch học cơ sở **CHỈ** hiển thị các sự kiện là Buổi học (Sessions) được sinh ra từ Lớp học (`BF-OPS-02`). 
   - Tuyệt đối KHÔNG chứa Booking Test hay Học thử (thuộc Tuyển sinh).
2. **[RULE-CAL-02] Chế độ Chỉ đọc (Strictly Read-only):** 
   - Màn hình Lịch KHÔNG cho phép thao tác kéo thả (Drag & Drop) để đổi ngày, đổi giờ hay đổi phòng trực tiếp trên lưới.
   - Tránh rủi ro thay đổi lịch ngoài ý muốn. Mọi thao tác phải thông qua form chuẩn.
3. **[RULE-CAL-03] Ủy quyền tương tác (Detail Trigger):** 
   - Click chuột trái vào Thẻ sự kiện `->` Mở Popup/Dialog Chi tiết Buổi học (`<SessionDetailDialog>`) của phân hệ `BF-OPS-03`.
4. **[RULE-CAL-04] Đồng bộ tự động (Reactive UI):** 
   - Bất kỳ thay đổi nào từ Popup Chi tiết (VD: Đổi phòng thành công, Hủy buổi) -> Hàm callback `onSuccess` phải kích hoạt Refetch dữ liệu của chính màn hình lịch mà không F5.
5. **[RULE-CAL-05] Ràng buộc Không gian / Thời gian:**
   - Dữ liệu lịch luôn được truy vấn với bộ lọc gốc: `branchId = current_user_branch_id` và `date BETWEEN start_of_view AND end_of_view`.
   - Giờ hiển thị lõi: 07:00 đến 22:00.

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-01] Hiệu năng (SLA):** Thời gian tải dữ liệu lịch của 1 Tháng (khoảng 2000 sessions) phải dưới `1.5 giây`. 
- **[METRIC-02] Giới hạn hiển thị:** Ở chế độ xem Tháng, nếu một ngày có quá 5 ca học, hiển thị "Xem thêm +N ca" thay vì làm tràn ô.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục Tổng thể:**
```text
[ Header & Breadcrumb ]
[ Toolbar Controls: View Mode | Branch | Room | Teacher | Search | Filters ]
[ ---------------------------------------------------------------------- ]
[                                                                      ]
[                         TIME GRID / CALENDAR VIEWER                    ]
[                                                                      ]
[ ---------------------------------------------------------------------- ]
```

### 3.1. Thanh công cụ (Toolbar)

| Thành phần | Loại hiển thị | Logic & Tham số | Ghi chú |
|------------|---------------|-----------------|---------|
| Chế độ xem | Segmented Control | Chuyển đổi Ngà / Tuần / Tháng. Lưu state local. | Mặc định: Tuần. |
| Chọn Trung tâm | `BranchSelect` | Lọc theo chi nhánh làm việc (Dành cho Quản lý vùng). | Vô hiệu hóa nếu User chỉ có 1 chi nhánh. |
| Chọn Phòng học | `ToolbarSelect` (Multi) | Lọc nhiều phòng học cùng lúc. | Gọi API lấy danh sách phòng của chi nhánh hiện tại. |
| Chọn Giáo viên | `ToolbarSelect` (Multi) | Lọc theo Giáo viên phụ trách. | Hỗ trợ gõ text tìm kiếm nội bộ dropdown. |
| Tìm kiếm | `ExpandableSearch` | Quét Tên lớp, Mã lớp, Tên Topic. | Tìm kiếm realtime (Debounce 300ms). |
| Bộ lọc trạng thái| `FilterIconButton` | Bật tắt hiển thị các trạng thái: Bình thường, Dạy thay, Hủy... | Mở Panel trượt (Slide Panel) từ cạnh phải. |
| Nút "Hôm nay" | `Button` (Outline) | Đưa lịch về tuần/ngày hiện tại. | Nhấn mạnh trực quan nếu đang ở xa hiện tại. |

### 3.2. Bảng Lịch (Calendar/Time Grid Core)

| Thành phần | Loại hiển thị | Dữ liệu | Ghi chú |
|------------|---------------|---------|---------|
| Trục dọc (Y) | Cột giờ | 07:00 - 22:00 | Ẩn giờ đêm. Độ phân giải 30 phút/vạch. |
| Trục ngang (X) | Các ngày | Thứ 2 -> Chủ Nhật | Highlight cột ngày hiện tại (màu nền nhạt). |
| Cột báo giờ thực | Red Line Indicator| Đường kẻ ngang màu đỏ | Di chuyển theo thời gian thực (như Google Calendar). |

### 3.3. Thẻ Sự kiện (Event Card)

| Thành phần | Dữ liệu Hiển thị | Logic CSS / Style |
|------------|------------------|-------------------|
| Mã Lớp | Text đậm (Bold) | VD: `IELTS-A-01` |
| Khung giờ | Text nhỏ (sm) | VD: `18:00 - 19:30` |
| Phòng học | Text kèm Icon MapPin | VD: `Phòng 101` |
| Giáo viên | Text kèm Icon User | VD: `GV. Nguyễn Văn A` |
| Màu nền (Bg) | `getStatusBadgeClass()` | Bình thường: Xanh ngọc. Dạy thay: Vàng. Đã hủy: Đỏ. |
| Cảnh báo | Icon Alert (Đỏ) | Nếu buổi học chưa có phòng hoặc chưa có GV. |

### 3.4. Thao tác trên Thẻ Lịch (Interactions)

| Tương tác | Khu vực | Kết quả mong đợi | Điều kiện / Ràng buộc |
|-----------|---------|------------------|-----------------------|
| Click Trái| Khối Event Card | Mở `<SessionDetailDialog id={sessionId} />` | Cấm tương tác nếu User không có quyền READ_SESSION. |
| Hover | Khối Event Card | Mở Tooltip (Delay 300ms) | Tooltip chứa: Sĩ số hiện tại, Tên Bài học, Tiến độ. |
| Kéo thả | Khối Event Card | (Bị Vô hiệu hóa) | `isDraggable={false}` tuyệt đối. |

---

## 4. Xử lý Ngoại lệ (Corner Cases)

| # | Tình huống | Cách xử lý | UI/UX Feedback |
|---|-----------|------------|----------------|
| 4.1 | Không có lịch học | Database trả về array rỗng cho dải ngày hiện tại. | Khung lưới trống, hiển thị mờ Watermark "Không có dữ liệu". |
| 4.2 | Lịch chồng chéo (Overlap) | Hệ thống xếp nhầm 2 lớp vào 1 phòng cùng giờ. | Render thẻ chia cột (width 50%), viền đỏ cực đậm. |
| 4.3 | Đổi timezone / Giờ mùa hè | Máy tính user sai giờ so với server. | Hệ thống bắt buộc dùng UTC Offset của máy chủ để map lên Grid. Báo lỗi nếu chênh lệch > 1h. |
| 4.4 | Lỗi mạng khi Refetch | Mạng rớt khi đang chuyển tuần. | Giữ nguyên dữ liệu tuần cũ, hiển thị Toast cảnh báo "Lỗi kết nối". |
| 4.5 | Dữ liệu rác (Thiếu giờ kết thúc) | Lỗi DB thiếu `endTime`. | Fallback: Mặc định render thẻ có độ cao 1.5 giờ và đánh cờ màu cam. |
| 4.6 | Chọn quá nhiều phòng học | ToolbarSelect bị dài. | Chuyển hiển thị thành "Đã chọn N phòng" thay vì liệt kê chuỗi dài. |
| 4.7 | Thẻ bị khóa sổ (Locked) | Lớp học đã hoàn tất tài chính. | Render thẻ có màu xám, thêm icon `Lock`. Click vào chỉ xem, vô hiệu hóa mọi nút Sửa trong Popup. |
| 4.8 | Sự kiện vượt nửa đêm | Lớp học từ 22:30 đến 00:30 hôm sau. | Chia làm 2 thẻ logic: 1 thẻ dừng ở 23:59, 1 thẻ bắt đầu lúc 00:00 ngày hôm sau. |

---

## 5. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Bước kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Độ chính xác lưới dọc | Tạo test data có lớp từ `17:15` đến `18:45`. | Thẻ nằm lệch xuống 1/4 block (15p) so với vạch 17:00, chiều cao chuẩn xác 1.5 blocks. |
| V-02 | Chức năng lọc Combo | Chọn Phòng 101 + GV Nguyễn Văn A. | Chỉ hiển thị các buổi do GV A dạy tại Phòng 101. |
| V-03 | Refetch Trigger | Mở popup, bấm "Hủy buổi". Đóng popup. | Thẻ lịch tự động chuyển sang màu Đỏ mà không cần reload trình duyệt. |
| V-04 | Overlap Layout | Tạo 3 lớp học cùng một khung giờ. | 3 thẻ chia đều chiều ngang (width 33.3%), không đè mất chữ. |

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Render Layout Khung | Trực quan UI. | Giao diện gồm Toolbar, Grid chuẩn, Breadcrumb đúng. |
| AC-02 | Map Data đúng chuẩn | Console log mảng `events` nhận vào. | Đúng `type === 'CLASS_SESSION'`. Không chứa Booking Test. |
| AC-03 | Chiều cao Card chuẩn | CSS check trên DOM. | Lớp 1h cao `X px`, lớp 2h cao `2X px`. Sai số 0px. |
| AC-04 | Hover Tooltip | Di chuột qua thẻ lịch bất kỳ trong 0.5s. | Bật Tooltip với ít nhất 3 dòng thông tin: Tên bài, Sĩ số, GV. |
| AC-05 | Chuyển View Mode | Bấm "Tháng", sau đó "Ngày". | Lưới chuyển đổi mượt mà, data được load lại đúng khung thời gian tương ứng. |
| AC-06 | Nút "Hôm nay" | Kéo sang tuần sau, bấm "Hôm nay". | Grid giật về tuần hiện tại lập tức. |
| AC-07 | Xử lý Read-only | Thử thao tác kéo thẻ (Drag) sang ngày khác. | Thẻ không di chuyển, không có event nào được kích hoạt. |
| AC-08 | Tích hợp Popup | Click thẻ lịch. | Bật `<SessionDetailDialog>` của đúng `sessionId` đó. |
| AC-09 | Lọc theo Phòng học | Chọn "Phòng 201". | Chỉ thẻ ở Phòng 201 hiển thị. |
| AC-10 | Phân quyền Data | Đăng nhập bằng Account Giáo viên (Không phải Admin). | Nếu backend chặn, grid báo "Không có quyền xem toàn bộ lịch cơ sở". (Tùy phân quyền HR). |
| AC-11 | Xử lý Loading | Chuyển qua tuần có dữ liệu nặng. | Hiện `<ModuleLoadingSkeleton>` (dạng Calendar) trong lúc chờ API. |
| AC-12 | Xử lý Lỗi | Tắt mạng, bấm "Tháng sau". | Bật `<ErrorState>` hoặc Toast, không sập toàn bộ UI. |
