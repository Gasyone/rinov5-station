# US-BT01: Quản lý danh sách Booking Test

## 1. User Story

**Là một** nhân viên Sale / Quản lý chi nhánh,
**tôi muốn** xem và lọc danh sách booking kiểm tra đầu vào theo môn học và trạng thái,
**để** nắm được toàn bộ tình hình booking hiện tại, nhanh chóng xác định các booking cần xử lý và liên hệ phụ huynh khi cần.

---

## 4. Mô tả chi tiết

Màn hình hiển thị toàn bộ booking test dưới dạng bảng dữ liệu. Phía trên bảng là thanh toolbar với chức năng tìm kiếm, lọc và tạo mới. Ngay bên dưới toolbar là thanh status bar thể hiện tổng quan số lượng booking theo từng trạng thái. Người dùng có thể lọc nhanh bằng cách click vào status tile, hoặc lọc nâng cao qua Filter Drawer.

### 4.1. Toolbar

| Thành phần | Loại control | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Tab môn học | Button group (2 tabs) | Gồm 2 tab: **MATH** và **ENGLISH**. Chuyển tab sẽ lọc toàn bộ danh sách theo field `subject`. | Mặc định chọn tab ENGLISH. Tab đang chọn có style inverse (nền đen chữ trắng). |
| Dropdown Cơ sở | Select dropdown | Lọc nhanh danh sách theo chi nhánh / cơ sở. Danh sách option lấy từ Branch Catalog (chỉ branch `type === 'internal'` AND `status === 'active'`). Option đầu tiên: "Tất cả cơ sở" (không lọc). Khi chọn cơ sở cụ thể, bảng chỉ hiển thị booking có `school` trùng khớp. | Nằm ngay sau tab môn học, cách bởi divider dọc. Sắp xếp alphabet tiếng Việt. Giá trị đã chọn cũng ảnh hưởng đến count trên status bar. |
| Ô tìm kiếm | Text input | Placeholder: "Search child name, phone, booking code...". Tìm kiếm realtime khi gõ. | Tìm trên các field: `childName`, `familyName`, `phone`, `id`, `school`, `classroom`. Không phân biệt hoa/thường. |
| Nút Create booking | Primary button | Mở modal tạo booking mới (xem US-BT02). | Ẩn khi role = `teacher`. |
| Nút Filter | Icon button (icon Filter) | Mở Filter Drawer từ bên phải. Hiển thị badge số lượng filter đang active (nếu > 0). | Badge nền indigo, font 9px. |

### 4.2. Status Bar

| Thành phần | Loại control | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Tile "All" | Button (sticky left) | Hiển thị label "ALL" + tổng số booking. Click để xem tất cả (reset status filter). | Sticky bên trái khi scroll ngang. Min-width 120px. |
| Status tiles | Button row (7 tiles) | Mỗi tile hiển thị tên trạng thái + count. Click để lọc theo trạng thái đó. Click lần nữa để bỏ lọc. | Mỗi tile có màu riêng theo STATUS_CONFIG. Tile đang chọn: nền đậm chữ trắng. Tile không chọn: nền nhạt (alpha 14%) chữ màu. |

**Danh sách 7 status tiles:**

| Status ID | Tên hiển thị | Màu | Cách đếm |
|-----------|-------------|------|----------|
| `booked_assessment` | Assessment booked | #10b981 (emerald) | Đếm record có `status === 'booked_assessment'` |
| `started_assessment` | Assessing | #38bdf8 (sky) | Đếm record có `status === 'started_assessment'` |
| `interviewed` | Interviewed | #8b5cf6 (violet) | Đếm record có `status === 'started_assessment'` AND `isInterviewed === true` **(virtual status)** |
| `tested` | Tested | #fb923c (orange) | Đếm record có `status === 'started_assessment'` AND `isTested === true` **(virtual status)** |
| `completed` | Completed | #0ea5e9 (cyan) | Đếm record có `status === 'completed'` |
| `failed` | Failed | #cbd5e1 (slate) | Đếm record có `status === 'failed'` |
| `cancelled` | Cancelled | #94a3b8 (slate) | Đếm record có `status === 'cancelled'` |

### 4.3. Bảng danh sách

| Thành phần | Loại control | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Checkbox (header) | Checkbox | Chọn tất cả record trong trang hiện tại. | Sticky left, cột đầu tiên, width 48px. |
| Checkbox (row) | Checkbox | Chọn từng record. | Sticky left, đổi màu nền khi hover. |
| Student ID / Child Name | Text + Avatar | Hiển thị avatar (chữ cái đầu, nền indigo), tên học viên (bold), mã booking (font mono, secondary color). | Sticky left (offset 48px). Min-width 320px. Kèm hover actions (xem mục 4.4). |
| Phone | Text + Popover | Hiển thị tên gia đình (uppercase, muted), SĐT masked (vd: `090***294`), nút copy. Nếu gia đình có >1 thành viên: hiển thị nút dropdown mở family popover. | Min-width 150px. |
| Program | Text + Badge | Tên chương trình (primary text). Bên dưới: badge môn học (vd: "ENGLISH") viền indigo, font 10px uppercase. | Min-width 180px. |
| School | Text | Tên trường (bold, truncate max 180px). Bên dưới: tên phòng hoặc "Lobby" nếu trống. | Min-width 200px. |
| Test Time | Text + Icon | Icon Clock + giờ (bold, indigo). Bên dưới: ngày. | Min-width 180px. |
| Level | Select dropdown | Hiển thị level hiện tại hoặc "Chưa chọn". | Chỉ role `teacher` mới chỉnh được (disabled cho role khác). Border dashed. Min-width 120px. |
| Sublevel | Select dropdown | Tương tự Level. | Chỉ role `teacher` mới chỉnh được. Min-width 100px. |
| Speaking | Badge | Hiển thị badge "GV: {score}" nền cam (vd: "GV: 6.5/8"). Nếu trống hiển thị "—". | Min-width 200px. |
| LWR | Text | Hiển thị điểm LWR (vd: "27/40"). Nếu trống hiển thị "—". | Font bold, secondary color. Min-width 200px. |
| Path | Link button | Nếu môn English: nút link mở Assessment modal (xem US-BT04), hiển thị path name hoặc "Link". Nếu môn Math: hiển thị "-". | Min-width 100px. Chỉ clickable cho English. |
| Status | Badge | Badge trạng thái với màu tương ứng (nền alpha 1A, viền alpha 55, chữ màu chính). | Min-width 160px. Border-radius 8px. |
| Kết quả | Link icon | Nếu có `resultLink`: icon ExternalLink (nền indigo nhạt) mở link trong tab mới. Nếu trống: hiển thị "-". | Min-width 120px. |
| Members | Avatar group | Hiển thị tối đa 3 avatar tròn (chữ initials) xếp chồng (-space-x-2). Nếu >3: hiển thị "+N". Nếu trống: hiển thị "?". | Lấy từ: `createdBy`, `ops`, `teacher`, `interviewer` (deduplicate). Min-width 130px. |
| Message | Text + Icon | Icon MessageSquare + nội dung ghi chú (italic, truncate max 120px). | Min-width 150px. |

### 4.4. Hover Actions (trên mỗi dòng)

| Thành phần | Loại control | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Nút Assessment | Icon button (FileText) | Mở English Assessment Path modal (US-BT04) cho booking đó. | Màu fuchsia. Chỉ hoạt động khi `subject === 'english'`. |
| Nút Gọi điện | Icon button (Phone) | Thực hiện desk call đến SĐT của booking. | Màu emerald. Dispatch event `rinov4:desk-call`, fallback `tel:`. |
| Nút Xem chi tiết | Icon button (Eye) | Mở Detail modal (US-BT03) cho booking đó. | Màu indigo. |

### 4.5. Family Popover

| Thành phần | Loại control | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Nút trigger | Icon button (ChevronDown) | Chỉ xuất hiện khi `familyMembers.length > 1`. Toggle popover. Click lần 1 mở, click lần 2 đóng. | Nền indigo nhạt, border-radius 4px. |
| Popover panel | Floating panel | Hiển thị tiêu đề "Liên hệ gia đình" (uppercase, 12px bold) + danh sách thành viên. Mỗi thành viên cách nhau bởi border-bottom (thành viên cuối không có). | Width 256px. Border-radius 12px. Shadow-lg. Tự đóng khi click bên ngoài (document click listener). Vị trí: absolute, top = dưới trigger, left = 0. |
| Tên thành viên | Text | Tên + vai trò (vd: "Vũ Nam (Ba)"). Font 14px bold. | Truncate nếu quá dài. |
| SĐT thành viên | Text (mono) | Hiển thị dạng masked (vd: `090***294`). Font mono 12px, màu indigo. | SĐT gốc (chưa mask) được dùng khi gọi/copy. |
| Nút Gọi điện | Icon button (Phone) | Thực hiện desk call đến SĐT gốc của thành viên. | Màu emerald. Border-radius 8px. Hiển thị luôn (không cần hover). Dispatch event `rinov4:desk-call`, fallback `tel:`. |
| Nút Copy SĐT | Icon button (Copy / CheckCircle) | Copy SĐT gốc (chưa mask) vào clipboard. Sau khi copy thành công: icon đổi từ Copy → CheckCircle, màu đổi sang emerald + nền emerald nhạt. Tự động quay lại icon Copy sau 2 giây. | Ưu tiên `navigator.clipboard.writeText()`. Nếu không khả dụng (HTTP, trình duyệt cũ): fallback tạo `<textarea>` ẩn + `document.execCommand('copy')`. |

### 4.6. Filter Drawer

| Thành phần | Loại control | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Nhóm "Cơ sở" | Checkbox list | Danh sách các trường, tự động tạo từ data hiện có. Mỗi option hiển thị tên + count. | Có thể collapse/expand. Nút clear riêng. |
| Nhóm "Trạng thái" | Checkbox list | 4 status chính: `booked_assessment`, `started_assessment`, `completed`, `cancelled`. | Count tính từ toàn bộ data (không theo filter khác). |
| Nhóm "Điều kiện khác" | Checkbox list | 3 điều kiện: `interviewed`, `tested`, `failed`. | `interviewed` và `tested` là virtual status, `failed` là status thật. |
| Nhóm "Giáo viên" | Checkbox list | Danh sách giáo viên, tự động tạo từ field `teacher` trong data. | Sắp xếp theo alphabet tiếng Việt. |
| Nút Clear All | Text button | Reset tất cả filter về trạng thái mặc định (trống). | Nằm trên header của drawer. |

### 4.7. Table Footer

| Thành phần | Loại control | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Summary text | Label | "Showing {count} records" — count = số record sau khi filter. | Nằm bên trái footer. |
| Rows per page | Select dropdown | Chọn số dòng hiển thị mỗi trang. 3 options: 20/page, 50/page, 100/page. Mặc định 20. Khi đổi, emit `page-size-change` và reset về trang 1. | Nằm bên trái, cách summary text bởi divider dọc. |
| Nút Previous | Icon button (mũi tên trái) | Chuyển về trang trước. Disabled khi đang ở trang 1 (opacity 40%, không click được). | Nằm bên phải footer. |
| Các nút số trang | Button group | Hiển thị danh sách số trang (1, 2, 3...). Trang đang chọn có style active (nền đậm). Click để nhảy đến trang tương ứng. | Kích thước mỗi nút 32x32px, border-radius 8px. |
| Nút Next | Icon button (mũi tên phải) | Chuyển sang trang tiếp theo. Disabled khi đang ở trang cuối (opacity 40%, không click được). | |

---

## 5. Corner Cases

| # | Case | Hành vi mong đợi |
|---|------|-------------------|
| 5.1 | Không có data nào (danh sách rỗng) | Bảng hiển thị trống, status bar tất cả tile count = 0, tile "All" count = 0. |
| 5.2 | Tìm kiếm không có kết quả | Bảng trống, footer hiển thị "Showing 0 records". Status bar vẫn giữ nguyên count tổng. |
| 5.3 | Tìm kiếm với ký tự tiếng Việt có dấu | Hiện tại search **không** normalize dấu (chỉ `.toLowerCase()`). Nghĩa là tìm "Phuc" sẽ không match "Phúc". Cần lưu ý khi cải thiện. |
| 5.4 | Kết hợp dropdown cơ sở + status tile + filter drawer | Tất cả các lớp lọc hoạt động đồng thời (AND logic). Ví dụ: dropdown chọn cơ sở A + click tile "Assessing" + filter drawer chọn GV B → chỉ hiện booking đang assessing tại cơ sở A do GV B phụ trách. |
| 5.4a | Dropdown cơ sở chọn "Tất cả cơ sở" | Không lọc theo branch, hiển thị toàn bộ data. Đây là trạng thái mặc định. |
| 5.4b | Dropdown cơ sở vs filter drawer nhóm "Cơ sở" | Dropdown trên toolbar là lọc nhanh 1 cơ sở duy nhất (single select). Filter drawer nhóm "Cơ sở" cho phép chọn nhiều cơ sở (multi-select). Khi dùng đồng thời: logic AND — record phải thỏa cả 2 điều kiện. |
| 5.4c | Chọn cơ sở trên toolbar, status bar count thay đổi | Count trên status bar tiles phải tính lại theo dữ liệu đã lọc theo cơ sở, để phản ánh đúng số lượng booking tại cơ sở đó. |
| 5.5 | Virtual status `interviewed` bị đếm trùng | Một record có `status = 'started_assessment'` + `isInterviewed = true` + `isTested = true` sẽ được đếm ở CẢ 3 tile: "Assessing", "Interviewed", "Tested". Đây là hành vi đúng theo thiết kế (virtual status không loại trừ nhau). |
| 5.6 | Chọn filter condition "interviewed" + "tested" cùng lúc | Logic OR: hiển thị record thỏa mãn ít nhất 1 trong 2 điều kiện. |
| 5.7 | Family popover đã mở, click vào popover khác | Popover cũ tự đóng, popover mới mở (chỉ 1 popover tại 1 thời điểm). |
| 5.8 | Copy SĐT khi clipboard API không khả dụng (HTTP) | Fallback sang phương thức `document.execCommand('copy')` với textarea ẩn. |
| 5.9 | Desk call trên thiết bị không hỗ trợ `tel:` | Event `rinov4:desk-call` vẫn dispatch. Nếu không có handler nào preventDefault, trình duyệt mở `tel:` protocol — hành vi phụ thuộc OS/browser. |
| 5.10 | Booking không có `testTime` (giá trị trống) | Cột Test Time hiển thị rỗng. `split(' ')` trả về `['']` — không crash nhưng UI hiển thị trống. |
| 5.11 | Booking không có `testResult` | Cột Level hiển thị "Chưa chọn", Speaking hiển thị "—", LWR hiển thị "—". |
| 5.12 | Bảng scroll ngang trên mobile | Bảng min-width 1860px, hỗ trợ scroll ngang. Cột Checkbox và Student sticky khi scroll. |
| 5.13 | Role `teacher` truy cập | Ẩn nút "Create booking". Cột Level/Sublevel enable cho phép chỉnh trực tiếp. Các chức năng khác (xem, lọc, tìm kiếm) vẫn hoạt động bình thường. |
| 5.14 | Đổi rows per page khi đang ở trang 3 | Reset về trang 1, tính lại tổng số trang theo page size mới. |
| 5.15 | Tổng số record ít hơn page size (vd: 4 records, page size 20) | Chỉ hiển thị 1 trang. Nút Previous và Next đều disabled. Không hiển thị nút số trang hoặc chỉ hiển thị nút "1". |
| 5.16 | Filter làm giảm số record, trang hiện tại vượt quá totalPages | Cần reset về trang cuối hợp lệ hoặc trang 1 để tránh bảng trống trong khi vẫn còn data. |

---

## 6. Acceptance Criteria

- [ ] Màn hình hiển thị đúng 2 tab môn học (MATH / ENGLISH), chuyển tab lọc đúng dữ liệu theo `subject`.
- [ ] Dropdown Cơ sở trên toolbar hiển thị danh sách branch (internal + active), mặc định "Tất cả cơ sở". Chọn cơ sở cụ thể lọc đúng booking theo `school`.
- [ ] Khi chọn cơ sở trên dropdown, status bar count cập nhật lại theo dữ liệu đã lọc.
- [ ] Status bar hiển thị đúng 7 status tiles với count chính xác, bao gồm 2 virtual status (interviewed, tested).
- [ ] Click status tile lọc đúng dữ liệu. Click lần 2 bỏ lọc, quay về "All".
- [ ] Bảng hiển thị đủ 15 cột với dữ liệu chính xác, 2 cột đầu sticky khi scroll ngang.
- [ ] Tìm kiếm hoạt động realtime, match trên 6 field (childName, familyName, phone, id, school, classroom).
- [ ] Filter Drawer mở/đóng đúng, hiển thị 4 nhóm filter với checkbox list, mỗi option có count.
- [ ] Dropdown cơ sở + Filter Drawer + status tile + search hoạt động kết hợp chính xác (AND logic giữa các lớp filter).
- [ ] Family popover hiển thị đúng danh sách thành viên, chỉ xuất hiện khi >1 thành viên. Tự đóng khi click outside.
- [ ] Copy SĐT hoạt động, hiển thị feedback icon CheckCircle trong 2 giây, fallback khi clipboard API không khả dụng.
- [ ] Hover actions hiển thị 3 nút (Assessment, Gọi điện, Xem chi tiết), gọi đúng hành động tương ứng.
- [ ] SĐT hiển thị dạng masked (3 ký tự đầu + `*` + 3 ký tự cuối).
- [ ] Role `teacher`: ẩn nút Create booking, enable dropdown Level/Sublevel trên bảng.
- [ ] Role khác: hiển thị nút Create booking, disable dropdown Level/Sublevel trên bảng.
- [ ] Table footer hiển thị đúng tổng số record sau filter, dropdown rows per page có 3 option (20, 50, 100).
- [ ] Pagination hiển thị các nút số trang, trang hiện tại có style active. Nút Previous/Next disabled đúng ở trang đầu/cuối.
- [ ] Đổi rows per page reset về trang 1, tính lại tổng số trang chính xác.
- [ ] Khi filter làm giảm data, pagination tự điều chỉnh (không hiển thị trang rỗng).
