---
id: US-HR-02-04
title: "Xem Lịch của tôi (My Schedule / Super Aggregator)"
bf: BF-HR-02
domain: CAP-HR
status: standardized
tags: [schedule, calendar, personal, aggregator, hr]
---

# US-HR-02-04: Xem Lịch của tôi (My Schedule / Super Aggregator)

> **Tham chiếu:** BF-HR-02 · `[POLICY-HR-01]` · Giao diện Mẫu §4.2 (Danh sách dạng Grid / Calendar cá nhân)

## 1. Yêu cầu Người dùng (User Story)

**Là một** Nhân sự của tổ chức (Giáo viên, Trợ giảng, Nhân viên Tư vấn, Quản lý),
**tôi muốn** xem toàn bộ lịch làm việc cá nhân của mình được tổng hợp từ tất cả các hệ thống (Lịch dạy Lớp học, Lịch coi thi Booking Test, Lịch Học thử, Lịch họp nội bộ, Lịch nghỉ phép),
**để** biết chính xác các công việc và khung thời gian mình đã được phân bổ trong ngày/tuần, từ đó chủ động sắp xếp công việc cá nhân, đảm bảo đúng giờ và chuẩn bị kỹ lưỡng cho công việc giảng dạy/tư vấn.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai hiển thị hoàn toàn độc lập với các bảng nghiệp vụ.
> - [x] **N**egotiable — Giao diện hỗ trợ linh hoạt 3 dạng: Grid, List Agenda, Timeline.
> - [x] **V**aluable — Cực kỳ giá trị với Giáo viên "chạy show" nhiều nhánh, nhiều lớp.
> - [x] **E**stimable — Rõ ràng về data model (Super Unified Model).
> - [x] **S**mall — Chỉ tập trung vào UI Rendering cho 1 `current_user`.
> - [x] **T**estable — Có 12+ tiêu chí nghiệm thu chặt chẽ.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-MYCAL-01] Mô hình "Super Consumer" (Cá nhân hóa tuyệt đối):** 
   - Dữ liệu trả về bắt buộc lấy theo mệnh đề `WHERE assigned_employee_id = current_user_id`.
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

- **[METRIC-01] Thời gian Hợp nhất:** Backend phải thực thi truy vấn hợp nhất đa luồng trong dưới `1.0 giây`.
- **[METRIC-02] Mobile-First SLA:** Màn hình này có 80% traffic từ điện thoại, bắt buộc tối ưu hiển thị 100% không gian dọc (Agenda View) trên màn hình dưới 768px.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục Tổng thể:** Dạng Bảng điều khiển cá nhân (Personal Dashboard).

### 3.1. Thanh công cụ (Toolbar)

| Thành phần | Loại hiển thị | Logic & Tham số | Ghi chú |
|------------|---------------|-----------------|---------|
| Chế độ xem | Segmented Control | Chuyển Ngày / Tuần / Agenda | Trên Điện thoại, mặc định ghim chết ở Agenda. |
| Khung Tìm kiếm | `ExpandableSearch` | Tìm Tên lớp, Loại sự kiện | Tự động highlight kết quả trên lịch. |
| Nút Báo bận | `IconActionButton` | Mở nhanh Form "Xin nghỉ / Báo bận" | HR Module. |
| Nút Bộ lọc | `FilterIconButton` | Mở bảng Slide Panel bên phải | |

### 3.2. Bảng lọc nâng cao (Slide Panel)

| Thành phần | Loại hiển thị | Dữ liệu | Ghi chú |
|------------|---------------|---------|---------|
| Nguồn sự kiện | Checkbox Group | Tích chọn: Lớp học, Trực test, Họp, Nghỉ phép | |
| Cơ sở làm việc | Multi-Select | Chọn các cơ sở muốn xem | |

### 3.3. Bảng Lịch (Schedule Time Grid / Agenda)

| Thành phần | Loại hiển thị | Trường Dữ liệu | Ghi chú |
|----------|---------------|----------------|---------|
| Trục thời gian | Cột giờ / Headers ngày | 07:00 -> 23:00 | Khung giờ chung. |
| Thẻ lịch (`UnifiedPersonalCard`) | Khối thông tin bo góc | Giờ, Tên Lớp/Sự kiện, Phân loại, **Tên Cơ sở**, Vai trò | Đặc biệt: Cơ sở (Branch) phải in đậm. |
| Khối Nghỉ phép (`BlockerCard`) | Dải màu xám gạch chéo | Ghi chú lý do nghỉ | Chặn ngang không cho xếp lịch (Visual only). |

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
| 4.5 | Đóng ứng dụng / Mở lại | | Lưu state View (Ngày/Tuần/Agenda) vào `localStorage`. |

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
| AC-03 | Component Isolation | Code review `MyScheduleScreen`. | Màn hình sạch bong, KHÔNG có hàm `POST/PUT` liên quan tới business gốc. |
| AC-04 | Nghỉ phép (Time-off) | Tạo 1 phiếu xin nghỉ buổi sáng. | Lưới sáng hiển thị 1 block màu xám gạch chéo "Nghỉ phép". |
| AC-05 | Lọc Nguồn Sự Kiện | Tích bỏ "Họp nội bộ". | Các thẻ họp nội bộ biến mất lập tức trên grid. |
| AC-06 | Responsive Agenda | Resize cửa sổ xuống 400px. | Grid biến mất, list Agenda hiện lên. Khác biệt UI hoàn toàn nhưng chung 1 nguồn data. |
| AC-07 | Cảnh báo Trùng lịch | Thêm 2 lịch trùng giờ. | Thẻ đỏ, viền đậm, có icon tam giác cảnh báo. |
| AC-08 | Context Menu Lối tắt | Chuột phải vào thẻ Lớp học. | Hiện menu nhỏ: "Xin dạy thay", "Nhận xét buổi học". |
| AC-09 | Mở Mini-Detail | Click chuột trái. | Hiện Modal tóm tắt thông tin, kèm nút "Xem chi tiết gốc". |
| AC-10 | Đổi múi giờ an toàn | Đổi múi giờ máy tính sang Mỹ. | Grid vẫn bám theo đúng dải giờ của VN, không bị chạy lùi thẻ lịch. |
| AC-11 | Nút Báo bận | Bấm nút IconActionButton "Báo bận". | Chuyển hướng sang Form xin nghỉ của phân hệ HR. |
| AC-12 | Xử lý Offline | Tắt WIFI, F5 trang. | Có cơ chế fallback/cache (PWA) hoặc chí ít không vỡ giao diện. |
