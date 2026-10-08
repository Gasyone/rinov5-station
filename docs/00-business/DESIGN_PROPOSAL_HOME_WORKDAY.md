# ĐỀ XUẤT THIẾT KẾ MÀN HÌNH HOME (WORKDAY OPERATIONS COCKPIT)
**Dự án:** Rinov5 Station Frontend  
**Mục tiêu:** Xây dựng màn hình Home trung tâm theo định hướng **"Ngày làm việc" (Workday Cockpit)**, tổng hợp nhịp vận hành cơ sở trong ngày cho Quản lý cơ sở / Giáo vụ / Chăm sóc học viên.

---

## 1. TRIẾT LÝ THIẾT KẾ: BÀN LÀM VIỆC SỐ (WORKDAY COCKPIT)

Màn hình Home của Station không chỉ là bảng dashboard xem số liệu thụ động mà đóng vai trò là **Trung tâm Tác nghiệp Đầu ngày (Daily Operating Hub)**:
1. **Theo dõi dòng chảy thời gian trong ngày:** Nhân sự biết ngay hôm nay có những ca học nào sắp bắt đầu, phòng học nào đang mở, giáo viên nào dạy thay.
2. **Xử lý nhanh các điểm nóng học viên:** Phát hiện ngay các học sinh cần can thiệp chăm sóc khẩn cấp hoặc sắp hết hạn học phí mà không bị ngợp thông tin (sử dụng cụm Avatar tinh gọn).
3. **Mở rộng ngữ cảnh mượt mà (Progressive Disclosure):** Ở bất kỳ khối thông tin nào, người dùng có thể nhấp để mở nhanh Hộp thoại chi tiết (Quick View Drawer/Modal) hoặc bấm "Xem tất cả" để chuyển sang màn hình chuyên sâu.

---

## 2. BỐ CỤC TỔNG THỂ (LAYOUT ARCHITECTURE)

Màn hình áp dụng bố cục lưới linh hoạt **2 Cột (Main Column 8/12 + Side Rail 4/12)** trên Desktop, tối ưu cho luồng mắt quét từ trái sang phải:

```text
+----------------------------------------------------------------------------------------------------+
| [BAR NGÀY LÀM VIỆC] Lời chào + Chọn ngày (Hôm nay, dd/mm) + Chọn cơ sở + Nhịp tim cơ sở hôm nay     |
+----------------------------------------------------------------------------------------------------+
| [SECTION 1: THỐNG KÊ LỚP HỌC TRỌNG ĐIỂM] (Metric Tiles lấy từ danh sách lớp)                        |
| [Tổng lớp đang học: 24]  [Sĩ số hoạt động: 285 HV]  [Tỷ lệ lấp đầy: 84.5%]  [Chuyên cần TB: 94.2%]   |
+------------------------------------------------------------------+---------------------------------+
| CỘT CHÍNH (8/12)                                                 | CỘT PHỤ TÁC NGHIỆP (4/12)       |
+------------------------------------------------------------------+---------------------------------+
| [SECTION 2: LỊCH BUỔI HỌC HÔM NAY]                               | [SECTION 4: HV CẦN CHĂM SÓC]    |
| - Bộ lọc ca học: Tất cả / Ca sáng / Ca chiều / Ca tối            | - Chỉ hiện Avatar (Avatar Rail) |
| - Thẻ ca học: Giờ, Lớp, Phòng, GV chính & GV dạy thay, Sĩ số     | - Badge cảnh báo (Vắng/Điểm...) |
| - Trạng thái: Đang học / Sắp diễn ra / Hoàn thành                | - Hover Card xem nhanh + Call   |
| - Hành động: Điểm danh nhanh, Xem chi tiết ca học                | - Link: Xem tất cả màn CSKH     |
|                                                                  +---------------------------------+
|                                                                  | [SECTION 5: HV CẦN TÁI PHÍ]     |
|                                                                  | - Chỉ hiện Avatar (Avatar Rail) |
|                                                                  | - Badge hạn phí (Còn ≤3 buổi..) |
|                                                                  | - Hover Card gói học & hạn nợ   |
|                                                                  | - Link: Xem tất cả màn Tái phí  |
+------------------------------------------------------------------+---------------------------------+
| [SECTION 3: LỚP HỌC QUẢN LÝ]                                     | [ĐỀ XUẤT THÊM: VIỆC CẦN LÀM]    |
| - Danh sách thẻ/bảng tóm tắt lớp cơ sở đang phụ trách            | - Checklist công việc hôm nay   |
| - Mã lớp, Cấp độ, GV phụ trách, Lịch tuần, Sĩ số/Sức chứa         | - Duyệt nghỉ phép, ca test...   |
| - Tiến độ buổi học, Buổi tiếp theo, Nút Xem chi tiết             |                                 |
+------------------------------------------------------------------+---------------------------------+
| [ĐỀ XUẤT THÊM: SỰ KIỆN & TEST TRẢI NGHIỆM HÔM NAY] (Lịch tiếp đón học viên mới đến cơ sở)         |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. CHI TIẾT CÁC SECTION CHỨC NĂNG

### 3.1. Header: Thanh Ngày Làm Việc (Workday Header & Switcher)
- **Lời chào & Cá nhân hóa:** `"Chào buổi sáng, [Tên nhân sự]! Chúc bạn một ngày làm việc hiệu quả."`
- **Bộ điều hướng ngày:** Nút chọn `[Hôm nay]` kèm mũi tên lùi/tiến ngày và DatePicker, cho phép xem trước ngày mai hoặc xem lại hôm qua.
- **Bộ chọn cơ sở (Branch Selector):** Chọn cơ sở hiện tại (Linh Đàm / Nguyễn Tuân / Smart City).
- **Thanh trạng thái cơ sở (Facility Heartbeat):** `"Hôm nay cơ sở có 14 ca học • 2 ca test đầu vào • 1 ca Digi • 3 giáo viên dạy thay"`.

---

### 3.2. Section 1: Thống Kê Bên Trên (Lấy từ Danh sách lớp)
Sử dụng component `<MetricTile />` chuẩn Design System Rinov5, tính toán thời gian thực từ dữ liệu `classRecords.ts`:
1. **Lớp đang hoạt động:** Tổng số lớp ở trạng thái `dang_hoc` (kèm số lớp `cho_khai_giang`).
2. **Tổng sĩ số học viên:** Tổng học sinh đã đăng ký (`enrolledStudents`) trên các lớp đang mở.
3. **Tỷ lệ lấp đầy (Capacity):** Trung bình tỷ lệ sĩ số thực tế so với sĩ số tối đa (`enrolledStudents / maxStudents`).
4. **Tỷ lệ chuyên cần trung bình:** Tỷ lệ đi học trung bình của toàn cơ sở (ví dụ `94.8%`).
5. **Lớp cần theo dõi:** Số lớp có học viên cần chăm sóc đặc biệt (`specialCareCount > 0`).

*Tương tác:* Nhấp vào từng thẻ Metric Tile sẽ mở nhanh danh sách lớp tương ứng hoặc dẫn tới `/app/classes`.

---

### 3.3. Section 2: Lịch Buổi Học Hôm Nay (Lấy từ Lịch học)
Dữ liệu lấy từ `calendarSchedule.ts` (lọc theo ngày được chọn & chi nhánh):
- **Phân loại theo ca học:** Tab chuyển nhanh: `Tất cả ca` | `Ca sáng (08:00 - 12:00)` | `Ca chiều (14:00 - 18:00)` | `Ca tối (18:00 - 21:30)`.
- **Cấu trúc thẻ ca học:**
  + Khung giờ & Phòng học (`18:00 - 19:30 • Phòng A101`).
  + Mã lớp & Tên lớp (`CLS-IELTS-001 • IELTS Junior 1A`).
  + Nhân sự đứng lớp: Giáo viên chính (`Hoàng Thị Mai`), Trợ giảng (`Phạm Mỹ Linh`). Nếu có giáo viên dạy thay, hiển thị badge màu vàng cam nổi bật.
  + Sĩ số ca: `15/20 HV` (trong đó có `2 HV học thử`, `1 HV học bù`).
  + Trạng thái: `Đang diễn ra` (xanh lục), `Sắp diễn ra` (xanh lam), `Đã hoàn thành` (xám).
- **Hành động & Mở chi tiết:**
  + Nút `Xem chi tiết`: Mở hộp thoại `ClassSessionDetailDialog` hiển thị danh sách học viên điểm danh, giáo trình buổi học hôm nay.
  + Nút `Xem trên lịch`: Dẫn tới `/app/calendar_class_schedule`.

---

### 3.4. Section 3: Lớp Học Quản Lý (Lấy từ Danh sách lớp)
Dữ liệu lấy từ `classRecords.ts`:
- Bảng / Lưới thẻ tóm tắt các lớp học đang hoạt động:
  + Tên lớp & Mã lớp (`CLS-IELTS-002 • IELTS Junior 1B`).
  + Giáo viên phụ trách & SĐT liên hệ.
  + Lịch học tuần (`T3/5 17:00–18:30`).
  + Tiến độ buổi học (`Buổi 14/36`).
  + Thanh tiến độ sĩ số (`12/15 học viên`).
  + Buổi học tiếp theo (Ngày, giờ, chủ đề bài học).
- **Hành động:** Nút `Xem chi tiết lớp` mở Drawer thông tin lớp học; nút `Tất cả lớp học (24) →` chuyển tới `/app/classes`.

---

### 3.5. Section 4: Học Viên Cần Chăm Sóc (Lấy từ Màn chăm sóc)
Dữ liệu lấy từ `careAlerts.ts` (`mockCareAlerts` có cảnh báo vắng mặt, học lực sụt giảm, C90B, chưa gọi...):
- **QUY TẮC BẮT BUỘC:** **Chỉ hiển thị Avatar** của học viên.
- **Thiết kế UI tinh gọn:**
  + Cụm Avatar (Avatar Rail / Avatar Bubble Grid): Mỗi học viên là 1 Avatar tròn (`h-10 w-10`), góc Avatar gắn chấm trạng thái cảnh báo màu:
    * 🔴 Đỏ: Vắng liên tiếp ≥ 2 buổi / Khiếu nại.
    * 🟡 Vàng cam: Học lực sụt giảm / C90B đang xử lý.
    * 🔵 Xanh: Cần gọi định kỳ 2 buổi đầu.
  + Khi số lượng nhiều: Hiển thị tối đa 12-16 Avatar nổi bật + badge `+8 học viên khác`.
- **Tương tác khi rê chuột (Hover) & Nhấp (Click):**
  + Tích hợp `<StudentProfileHoverCard />`: Khi rê chuột vào Avatar, ngay lập tức bung thẻ thông tin: Họ tên bé, Mã HV, Lớp, Nội dung cảnh báo, Tỷ lệ chuyên cần, Nút Gọi điện thoại nhanh (`useCallStore`).
  + Nhấp vào Avatar: Mở Drawer hồ sơ học viên chi tiết.
  + Header của Section có nút: `Xem danh mục chăm sóc (18) →` dẫn tới `/app/student_operations_alert`.

---

### 3.6. Section 5: Học Viên Cần Tái Phí (Lấy từ Màn tái phí)
Dữ liệu lấy từ `careAlerts.ts` / `tuitionDebts.ts` (học viên còn ≤ 4 buổi, sắp đến hạn tái tục):
- **QUY TẮC BẮT BUỘC:** **Chỉ hiển thị Avatar** của học viên.
- **Thiết kế UI tinh gọn:**
  + Cụm Avatar hình tròn kèm badge biểu tượng tài chính hoặc viền màu cảnh báo:
    * 🔴 Đỏ: Còn 0-1 buổi (Khẩn cấp).
    * 🟠 Cam: Còn 2-3 buổi (Cần chốt tái phí trong tuần).
    * 🟡 Vàng: Đang cân nhắc / Đã hẹn ngày nộp.
- **Tương tác khi rê chuột (Hover) & Nhấp (Click):**
  + Tích hợp `<StudentProfileHoverCard />`: Rê chuột hiển thị: Họ tên bé, Số buổi học còn lại, Gói học hiện tại, Ngày dự kiến hết hạn, Người phụ trách CSKH.
  + Nhấp vào Avatar: Mở Drawer lịch sử tư vấn tái phí.
  + Header của Section có nút: `Xem toàn bộ tái phí (12) →` dẫn tới `/app/renewal`.

---

## 4. ĐỀ XUẤT THÊM THÔNG TIN CHO "NGÀY LÀM VIỆC" (WORKDAY VALUE-ADD)

Để màn Home thực sự trở thành công cụ đắc lực mỗi ngày, đề xuất bổ sung thêm 3 tiện ích:

### 🌟 Tiện ích 1: Việc Cần Xử Lý Ngay Hôm Nay (Daily To-Do Action Center)
- Danh sách 4-5 đầu việc trọng yếu tự động tổng hợp:
  + ☑️ *Điểm danh:* Còn 2 ca học tối qua chưa hoàn tất chốt danh sách.
  + ☑️ *Duyệt phép:* Có 1 đơn xin nghỉ phép của GV Hoàng Mai cần giáo viên dạy thay.
  + ☑️ *Học bù:* Có 3 học sinh chờ xếp lịch học bù trong tuần.
  + ☑️ *Học liệu:* Có 2 đơn bàn giao sách cần xuất kho tại quầy.

### 🌟 Tiện ích 2: Lịch Đón Tiếp Test & Học Thử Hôm Nay (Today's Placement & Trial Visits)
- Lấy từ `bookingTests.ts`:
  + Danh sách các phụ huynh & học sinh đã đặt lịch đến làm bài Test năng lực hoặc tham gia học thử tại cơ sở trong ngày hôm nay.
  + Giúp lễ tân, bảo vệ và chuyên viên tuyển sinh nắm bắt giờ đón tiếp, chuẩn bị phòng test và đề thi.

### 🌟 Tiện ích 3: Tình Trạng Phòng Học Trực Tiếp (Room Availability Glance)
- Bảng ma trận nhỏ hiển thị các phòng học của cơ sở (`Phòng 101`, `102`, `103`, `Phòng Digi`):
  + Phòng nào đang có lớp chạy, phòng nào đang trống trong khung giờ tiếp theo để dễ dàng điều phối ca học bù hoặc phòng tự học.

---

## 5. CƠ CHẾ MỞ RA MÀN CHI TIẾT Ở MỖI SECTION

Tuân thủ nguyên tắc không ngắt quãng dòng công việc của người dùng:
1. **Mức độ 1 - Xem nhanh tại chỗ (Quick-View Dialog / Drawer):**
   - Click vào từng thẻ ca học: Mở Popup chi tiết ca học, danh sách học sinh, điểm danh nhanh.
   - Click vào thẻ lớp học: Mở Drawer thông tin chi tiết lớp học.
   - Click vào Avatar học viên (chăm sóc / tái phí): Mở Drawer hồ sơ học viên 360°.
2. **Mức độ 2 - Điều hướng sâu (Deep-link Full Screen):**
   - Nút tiêu đề ở mỗi Section (`Xem tất cả →`) đưa người dùng đến màn hình quản lý chuyên trách tương ứng:
     * Section Lớp học → `/app/classes`
     * Section Lịch học → `/app/calendar_class_schedule`
     * Section Chăm sóc → `/app/student_operations_alert`
     * Section Tái phí → `/app/renewal`
