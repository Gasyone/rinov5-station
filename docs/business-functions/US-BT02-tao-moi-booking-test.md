# US-BT02: Tạo mới Booking Test

## 1. User Story

**Là một** nhân viên Sale / Quản lý chi nhánh,
**tôi muốn** tạo booking kiểm tra đầu vào cho học viên bằng cách chọn thông tin học viên, chương trình, trường và khung giờ trống của giáo viên,
**để** xếp lịch test hoặc demo cho học viên mới và phân công giáo viên phụ trách.

---

## 4. Mô tả chi tiết

Modal tạo booking gồm 2 phần chính hiển thị dạng 2 cột trên desktop (1 cột trên mobile):
- **Cột trái**: Thông tin booking (chọn học viên, chương trình, level, trường, giáo viên, ghi chú).
- **Cột phải**: Chọn lịch (ngày + khung giờ).

Modal tạo booking có thể được kích hoạt từ 2 vị trí khác nhau:
1. **Từ màn hình Vận hành chung (Booking Management - US-BT01):** Mở khi click nút "Create booking" trên toolbar. Người dùng tự chọn học viên từ dropdown.
2. **Từ màn hình Chi tiết học viên (Student/Contact Detail - CRM):** Mở từ tab "Booking" của một học viên cụ thể. Hệ thống sẽ **tự động khóa (lock) và điền sẵn** thông tin học viên vào form.

Sau khi tạo thành công, booking mới sẽ xuất hiện ở đầu danh sách của cả 2 màn hình.

### 4.1. Thông tin Booking (cột trái)

| Thành phần | Loại control | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Học viên (Student) | SearchableSingleSelect | Dropdown tìm kiếm, hiển thị danh sách học viên từ Profile Catalog. Mỗi option hiển thị: tên + mã profile (nếu có). Khi chọn, tự động điền 3 field: `childName`, `familyName`, `phone`. | Chỉ hiển thị profile có `type === 'PERSON'` và role chứa `student`, `học viên`, `hoc vien`, hoặc mã `4`. Nếu backend không trả data, fallback sang danh sách học viên từ booking hiện có. |
| Chương trình (Program) | Select dropdown | Danh sách chương trình từ Program Management Catalog. Hiển thị: tên chương trình + tên môn (nếu có), vd: "Station Program - English". | Chỉ program có `status === 'active'`. Sắp xếp alphabet tiếng Việt. Khi đổi program, tự động cập nhật danh sách Level. |
| Level | Select dropdown | Danh sách level phụ thuộc vào program đã chọn. Lấy từ Learning Paths liên kết với program. | Disable khi chưa chọn program hoặc program không có level nào. Khi đổi program: nếu level cũ không còn trong danh sách mới → auto chọn level đầu tiên. |
| Trường (School) | SearchableSingleSelect | Dropdown tìm kiếm, danh sách chi nhánh từ Branch Catalog. | Chỉ hiển thị branch có `type === 'internal'` AND `status === 'active'`. Sắp xếp alphabet tiếng Việt. |
| Giáo viên (Teacher) | SearchableSingleSelect | Dropdown tìm kiếm, danh sách giáo viên từ Employee list. Hiển thị: tên + chức danh, vd: "Sarah J. - Giáo viên Tiếng Anh". | Chỉ hiển thị employee có job title chứa keyword `giáo viên`, `teacher`, hoặc `gv` (không phân biệt hoa/thường, không phân biệt dấu). |
| Ghi chú (Message note) | Textarea (4 rows) | Nhập ghi chú tự do cho booking. | Không bắt buộc. Nếu trống, lưu thành "-". |

### 4.2. Chọn lịch (cột phải)

| Thành phần | Loại control | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Header "Schedule" | Section header | Tiêu đề khu vực chọn lịch. Bên phải hiển thị ngày đang chọn và slot đã chọn (nếu có). | |
| Ngày bắt đầu (Start date) | Date input + nút +/- | Input type date, mặc định = ngày hôm nay. Kèm 2 nút mũi tên trái/phải để chuyển ngày ±1. | Khi đổi ngày: nếu ngày mới khác ngày cũ → reset slot đã chọn (`testDate`, `testClock` về rỗng). |
| Lưới khung giờ (Time slots) | Button grid (3 cột trên mobile, 3 cột trên desktop) | Hiển thị 27 slot: từ 09:00 đến 22:00, bước 30 phút. Mỗi slot là 1 button hiển thị giờ (vd: "09:00", "09:30", ..., "22:00"). | Slot đang chọn: nền primary, chữ trắng. Slot trống: nền base, viền default. Slot đã book: disabled, opacity 40%. |
| Label ngày | Text | Hiển thị ngày dạng localized: weekday viết tắt + dd/MM (vd: "Thu 17/04"). | Dùng `formatDateWithOptions` theo locale hiện tại. |
| Label slot đã chọn | Text | Hiển thị "Selected: {day} {time}" khi đã chọn slot. | Chỉ hiện khi cả `testDate` và `testClock` đều có giá trị. |

### 4.3. Footer modal

| Thành phần | Loại control | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Nút Cancel | Secondary button | Đóng modal, không lưu. | |
| Nút Create | Primary button | Validate và tạo booking mới. | Xem validation rules bên dưới. |

### 4.4. Validation Rules khi Submit

| Field | Bắt buộc | Rule |
|-------|----------|------|
| `childName` | Bắt buộc | Phải có giá trị (trim, không rỗng). |
| `program` | Bắt buộc | Phải chọn chương trình. |
| `school` | Bắt buộc | Phải chọn trường. |
| `teacher` | Bắt buộc | Phải chọn giáo viên. |
| `testTime` | Bắt buộc | Phải chọn cả ngày (`testDate`) và giờ (`testClock`). Giá trị lưu dạng `"{date} {time}"`. |

> Hiện tại khi validation fail: form **không submit, không hiện error message** (silent block). Booking không được tạo.

### 4.5. Dữ liệu Booking sau khi tạo

| Field | Giá trị |
|-------|---------|
| `id` | Auto-increment: `E{XXXX}` (vd: E0005). Tính bằng max ID hiện tại + 1. |
| `status` | `booked_assessment` (mặc định). |
| `subject` | Lấy từ tab môn đang active (`activeSubject`). |
| `eventType` | `test` (mặc định) hoặc `demo`. |
| `room` | Mặc định "Sảnh" nếu không chọn. |
| `msg` | Ghi chú hoặc "-" nếu trống. |
| `testResult` | Nếu chọn Online Test: `{ level: 'Pending', speaking: '-', lwr: '-', path: '{tên test}' }`. Nếu không: không có field này. |

---

## 5. Corner Cases

| # | Case | Hành vi mong đợi |
|---|------|-------------------|
| 5.1 | Profile Catalog rỗng (backend lỗi hoặc chưa có data) | Dropdown học viên hiển thị danh sách fallback: lấy tên học viên từ các booking hiện có (deduplicate). Vẫn cho phép tạo booking. |
| 5.2 | Chọn program không có learning path nào | Dropdown Level hiển thị placeholder "Select a level", disabled. Không block submit (level không bắt buộc). |
| 5.3 | Đổi program khi đã chọn level | Nếu level cũ vẫn tồn tại trong program mới → giữ nguyên. Nếu không → auto chọn level đầu tiên của program mới. Nếu program mới không có level → clear level. |
| 5.4 | Đổi giáo viên khi đã chọn slot | Slot đã chọn bị reset (clear `testDate` và `testClock`). Người dùng phải chọn lại slot. Lý do: slot availability phụ thuộc vào giáo viên. |
| 5.5 | Đổi ngày khi đã chọn slot | Nếu ngày mới khác ngày trong slot đã chọn → reset slot. Nếu cùng ngày → giữ nguyên. |
| 5.6 | Giáo viên đã có booking trên slot | Slot đó hiển thị disabled (opacity 40%, không click được). Kiểm tra bằng: `teacher === form.teacher AND testTime === "{date} {time}"`. |
| 5.7 | Chưa chọn giáo viên khi xem time slots | Tất cả slot đều enable (không có dữ liệu để kiểm tra trùng). Chọn giáo viên sau sẽ reset slot. |
| 5.8 | Không có branch nào active hoặc internal | Dropdown trường hiển thị rỗng. Không block UI nhưng không thể submit (school bắt buộc). |
| 5.9 | Không có employee nào có job title teacher | Dropdown giáo viên hiển thị rỗng. Không block UI nhưng không thể submit (teacher bắt buộc). |
| 5.10 | Submit khi thiếu field bắt buộc | Form không submit, modal không đóng, không hiện error message. Người dùng cần tự kiểm tra lại các field. |
| 5.11 | Tạo booking liên tục (mở modal lần 2) | Form reset hoàn toàn về trạng thái mặc định. `subject` lấy lại từ tab đang active. `scheduleStartDate` reset về ngày hôm nay. |
| 5.12 | Timezone: ngày hôm nay tính thế nào | Dùng local timezone offset để tính ngày: `new Date(now - timezoneOffsetMs).toISOString().slice(0, 10)`. Tránh sai ngày ở timezone dương/âm. |
| 5.13 | ID bị trùng hoặc không parse được | Hàm `nextBookingId` scan tất cả booking, parse phần số sau prefix, lấy max + 1. Nếu tất cả ID không parse được (NaN) → max = 0 → ID mới = E0001. |

---

## 6. Acceptance Criteria

- [ ] Modal mở khi click "Create booking", layout 2 cột trên desktop (>= 768px), 1 cột trên mobile.
- [ ] Dropdown học viên hiển thị đúng danh sách student profiles (filter theo type + role). Khi chọn, tự điền childName, familyName, phone.
- [ ] Dropdown chương trình chỉ hiển thị program active, kèm tên môn. Sắp xếp tiếng Việt.
- [ ] Dropdown level phụ thuộc chính xác vào program đã chọn. Disable khi không có level.
- [ ] Dropdown trường chỉ hiển thị branch internal + active. Searchable.
- [ ] Dropdown giáo viên chỉ hiển thị employee có job title teacher/giáo viên/gv. Searchable, hiển thị kèm chức danh.
- [ ] Lưới time slots hiển thị 27 slot (09:00 - 22:00, bước 30 phút). Slot của cùng giáo viên đã book bị disabled.
- [ ] Đổi giáo viên hoặc đổi ngày → reset slot đã chọn.
- [ ] Submit thành công: booking mới xuất hiện đầu danh sách, ID tự tăng đúng format, status = `booked_assessment`, modal tự đóng.
- [ ] Submit thất bại (thiếu field): modal không đóng, không tạo booking (silent block).
- [ ] Mở modal lần 2: form reset hoàn toàn, subject lấy từ tab đang active.
- [ ] Nút "Create booking" ẩn khi role = `teacher`.
