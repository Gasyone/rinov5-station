# US-CLS01-01: Quản lý danh sách Học viên chờ xếp lớp

## 1. User Story

**Là một** Quản lý chi nhánh / Điều phối viên học vụ,
**tôi muốn** xem danh sách tất cả học viên đang chờ được xếp vào lớp, lọc nhanh theo trạng thái và chi nhánh,
**để** chủ động nắm số lượng học viên cần xử lý, ưu tiên xếp lớp kịp thời và không để học viên chờ quá lâu.

---

## 2. Thông tin cơ bản

| Thuộc tính | Giá trị |
|------------|---------|
| **BF:** | BF-CLS-01 (Xếp lớp — Enrollment to Class) |
| **CAP:** | CAP-OPS (SIS & Class Operations) |
| **Menu ID:** | `class_assignment` |
| **Sidebar group:** | `group_operations` (Vận hành) |
| **Allowed Roles:** | `admin`, `branch_manager` |
| **Priority:** | High |

---

## 3. Điều kiện tiền quyết (Preconditions)

1. Học viên phải đã hoàn thành thanh toán (từ `CAP-FIN`) hoặc đã được xác nhận ghi danh.
2. Học viên có trạng thái thuộc 1 trong 4 nhóm: `cho_xep_lop`, `xep_lop_sau`, `cho_chuyen_lop`, `cho_khai_giang`.
3. Người dùng đã đăng nhập với role `admin` hoặc `branch_manager`.

---

## 4. Mô tả chi tiết

Màn hình hiển thị danh sách học viên đang ở các trạng thái **tiền lớp học** (Pre-class) — tức là học viên đã đăng ký nhưng chưa chính thức vào lớp hoặc đang chờ chuyển lớp. Mục tiêu chính: giúp Branch Manager thấy nhanh ai cần xếp lớp, lớp nào còn chỗ, và thực hiện thao tác xếp lớp.

### 4.1. Layout tổng thể

Màn hình chia thành 2 panel chính theo chiều ngang:

```
┌──────────────────────────────────────────────────────────────────┐
│ Toolbar: [Status Tabs]  |  [Search] [Filter] [Actions]          │
├──────────────────────────────────┬───────────────────────────────┤
│                                  │                               │
│   Panel trái (60%)               │   Panel phải (40%)            │
│   BẢNG DANH SÁCH HỌC VIÊN       │   DANH SÁCH LỚP CÒN CHỖ     │
│                                  │   (Class Slots Preview)       │
│   - Table dạng list              │                               │
│   - Checkbox chọn nhiều          │   - Card list theo Program    │
│   - Click row → highlight        │   - Hiển thị tên lớp, GV,    │
│   - Drag support (tương lai)     │     sĩ số, lịch học           │
│                                  │   - Nút "Xếp vào lớp này"    │
│                                  │                               │
├──────────────────────────────────┴───────────────────────────────┤
│ Footer: [Showing X records]  [Rows per page]  [Pagination]      │
└──────────────────────────────────────────────────────────────────┘
```

> **Tại sao layout 2 panel?**
> Bài toán Xếp lớp là bài toán **matching** (Ghép HV ↔ Lớp). Người dùng cần nhìn đồng thời 2 nguồn: danh sách HV chờ (bên trái) và danh sách lớp còn chỗ (bên phải) để ra quyết định. Thiết kế này phổ biến trong SIS (VD: PowerSchool, Infinite Campus).

### 4.2. Status Tabs (FilterTabs)

Sử dụng component `FilterTabs` hiện có, hiển thị 5 tabs:

| Tab ID | Tên hiển thị | Màu dot | Mô tả | Đếm |
|--------|-------------|---------|-------|-----|
| `all` | Tất cả | gray | Tổng số HV ở 4 trạng thái dưới | Tổng 4 nhóm |
| `cho_xep_lop` | Chờ xếp lớp | blue | HV đã thanh toán, chờ ghép vào Class | Count theo status |
| `xep_lop_sau` | Xếp lớp sau | indigo | HV được hoãn xếp lớp theo yêu cầu | Count theo status |
| `cho_chuyen_lop` | Chờ chuyển lớp | orange | HV đang chờ duyệt chuyển sang Class khác | Count theo status |
| `cho_khai_giang` | Chờ khai giảng | cyan | HV đã được xếp lớp, chờ lớp bắt đầu | Count theo status |

### 4.3. Toolbar

| Thành phần | Loại control | Mô tả |
|------------|-------------|-------|
| Status Tabs | FilterTabs (5 tabs) | Lọc nhanh theo trạng thái. Mặc định chọn tab "Tất cả". |
| Dropdown Chi nhánh | Select dropdown | Lọc theo chi nhánh. Option đầu: "Tất cả chi nhánh". Chỉ hiển thị branch `type === 'internal'` AND `status === 'active'`. |
| Ô tìm kiếm | Text input | Placeholder: "Tìm theo tên, mã HV, SĐT, chương trình...". Tìm realtime trên: `fullName`, `code`, `phone`, `packageName`, `subject`. |
| Nút Bộ lọc | Icon button | Mở Filter Drawer bên phải. Badge hiển thị số filter đang active. |

### 4.4. Panel trái — Bảng danh sách Học viên chờ

| Cột | Kiểu | Mô tả | Min-width |
|-----|------|-------|-----------|
| ☐ Checkbox | Checkbox | Chọn 1 hoặc nhiều HV để xếp lớp hàng loạt | 48px |
| Học viên | Text + Code | Tên HV (bold) + Mã HV (mono, muted). Avatar chữ cái đầu. | 220px |
| Tuổi | Text | Tính từ ngày sinh. Hiển thị "X tuổi". | 60px |
| Chương trình | Badge + Text | Tên môn học/chương trình đã đăng ký (VD: "IELTS Junior"). Badge màu theo subject. | 150px |
| Gói học | Text | Tên gói (VD: "Gói 36 buổi"). | 120px |
| Chi nhánh | Text | Tên chi nhánh đăng ký. | 140px |
| Trạng thái | Badge | Badge màu theo STATUS_META. | 130px |
| Ngày chờ | Text + Urgency | Số ngày kể từ khi HV vào trạng thái hiện tại. Nếu > 7 ngày: text đỏ + icon cảnh báo. Nếu > 14 ngày: text đỏ bold + badge "Quá hạn". | 100px |
| Hành động | Button group | Nút "Xếp lớp" (primary), nút "⋯" (menu: Hoãn, Xem hồ sơ, Hủy). | 120px |

**Logic cột "Ngày chờ" (Urgency indicator):**
- ≤ 3 ngày: Text xanh, bình thường
- 4-7 ngày: Text cam, nhắc nhở
- 8-14 ngày: Text đỏ, icon ⚠️
- \> 14 ngày: Text đỏ bold, badge "Quá hạn"

> **Tại sao cần cột Ngày chờ?**
> Trong SIS chuẩn, KPI quan trọng nhất của Placement là "Time to Enroll" — thời gian trung bình từ lúc HV đăng ký đến lúc được xếp lớp. Cột này giúp Branch Manager ưu tiên xử lý HV chờ lâu.

### 4.5. Panel phải — Danh sách Lớp còn chỗ (Class Slots)

Hiển thị các Class đang mở (status = `Open`) và còn chỗ trống (`currentRoster < capacity`).

Mỗi Class hiển thị dạng **Card nhỏ gọn**:

```
┌─────────────────────────────────┐
│ 📚 IELTS Junior 1A             │
│ 🏫 RinoEdu Linh Đàm            │
│ 👨‍🏫 Cô Lan (Chủ nhiệm)          │
│ 👥 Sĩ số: 8/12 (còn 4 chỗ)     │
│ 📅 T3 & T5, 18:00–19:30        │
│ 📖 Level: Movers                │
│ ┌─────────────────────────────┐ │
│ │   [Xếp HV đã chọn vào đây] │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

| Thành phần | Mô tả |
|------------|-------|
| Tên lớp | Bold, primary text |
| Chi nhánh | Muted text |
| GV chủ nhiệm | Tên + vai trò |
| Sĩ số | Thanh progress nhỏ + text "X/Y (còn Z chỗ)". Nếu gần đầy (≥80%): thanh cam. Nếu đầy: thanh đỏ + disabled. |
| Lịch học | Tóm tắt Schedule (Thứ + Khung giờ) |
| Level/Program | Level của lớp (để matching với HV) |
| Nút xếp lớp | "Xếp HV đã chọn vào đây". Disabled nếu chưa chọn HV nào ở panel trái, hoặc lớp đã đầy. |

**Bộ lọc panel phải:**
- Dropdown lọc theo Chi nhánh (đồng bộ với dropdown toolbar)
- Dropdown lọc theo Program/Subject
- Toggle "Chỉ hiện lớp còn chỗ" (mặc định bật)

**Gợi ý thông minh (Smart Matching):**
Khi chọn 1 HV ở panel trái, panel phải tự động:
- Highlight các lớp **phù hợp** (cùng Subject, cùng Level range, cùng Branch) bằng viền xanh
- Đẩy lớp phù hợp lên đầu danh sách
- Mờ đi các lớp không phù hợp (khác Subject hoặc đã đầy)

### 4.6. Filter Drawer

| Nhóm filter | Loại | Options |
|-------------|------|---------|
| Chi nhánh | Checkbox list (multi) | Danh sách branch active. Mỗi option có count. |
| Chương trình | Checkbox list (multi) | IELTS Junior, Movers, Flyers, KET Prep, PET Prep... |
| Gói học | Checkbox list (multi) | Gói 24/36/48/60 buổi |
| Mức độ chờ | Radio group | Tất cả / Chờ > 7 ngày / Chờ > 14 ngày (Quá hạn) |

### 4.7. Batch Actions (Xếp lớp hàng loạt)

Khi chọn nhiều HV bằng checkbox, hiển thị **Batch Action Bar** phía trên bảng:

| Thành phần | Mô tả |
|------------|-------|
| Label | "Đã chọn X học viên" |
| Nút "Xếp lớp" | Mở modal chọn lớp đích. Chỉ hiển thị lớp phù hợp (cùng Subject). Kiểm tra sĩ số trước khi xác nhận. |
| Nút "Hoãn xếp lớp" | Chuyển tất cả HV đã chọn sang trạng thái `xep_lop_sau`. |
| Nút "Bỏ chọn" | Clear selection |

### 4.8. Modal Xếp lớp (Placement Confirmation)

Khi click "Xếp lớp" (từ nút trên row hoặc từ card Class bên phải):

| Bước | Nội dung |
|------|----------|
| 1. Xác nhận thông tin | Hiển thị: Tên HV, Chương trình đăng ký, Lớp đích, Sĩ số hiện tại → mới |
| 2. Kiểm tra tự động | Hệ thống check: (a) Lớp còn chỗ? (b) Level HV có khớp Level lớp? (c) Lịch HV có trùng lớp khác? |
| 3. Cảnh báo (nếu có) | Nếu Level không khớp: Cảnh báo vàng "Level HV (Movers) khác Level lớp (Flyers). Bạn có chắc?" |
| 4. Xác nhận | Nút "Xác nhận xếp lớp" (primary) + "Hủy" (secondary) |

Sau khi xác nhận:
- Trạng thái HV chuyển thành `cho_khai_giang` (Chờ khai giảng)
- HV xuất hiện trong Roster của Class đích
- Số đếm trên Status Tabs cập nhật realtime
- Toast notification: "Đã xếp {Tên HV} vào lớp {Tên lớp}"

---

## 5. Corner Cases

| # | Case | Hành vi mong đợi |
|---|------|-------------------|
| 5.1 | Không có HV nào chờ xếp lớp | Bảng trống, hiển thị empty state: icon + "Không có học viên nào đang chờ xếp lớp". Panel phải vẫn hiển thị lớp còn chỗ. |
| 5.2 | Không có lớp nào còn chỗ | Panel phải hiển thị empty state: "Tất cả các lớp đã đủ sĩ số. Vui lòng mở lớp mới." Kèm nút "Tạo lớp mới" (link tới `app/classes`). |
| 5.3 | Xếp HV vào lớp làm vượt sĩ số tối đa | Modal cảnh báo đỏ: "Lớp đã đạt sĩ số tối đa (12/12). Xếp thêm sẽ vượt quy định." Cho phép Admin override bằng nút "Xếp lớp (Override)" với xác nhận lần 2. Branch Manager không có quyền override. |
| 5.4 | Xếp HV có Level khác với Level lớp | Cảnh báo vàng (warning, không block). Cho phép tiếp tục nhưng ghi log audit. |
| 5.5 | HV đã có lớp cũ (trạng thái `cho_chuyen_lop`) | Modal hiển thị thêm thông tin: "Chuyển từ lớp {Lớp cũ} sang lớp {Lớp mới}". Hệ thống tự động gỡ HV khỏi Roster lớp cũ. |
| 5.6 | Chọn nhiều HV khác Subject để xếp lớp hàng loạt | Disabled nút "Xếp lớp" + tooltip: "Chỉ xếp lớp hàng loạt cho HV cùng chương trình". |
| 5.7 | HV chờ > 14 ngày | Row highlight nhẹ (nền hồng nhạt). Cột "Ngày chờ" hiển thị badge đỏ "Quá hạn". |
| 5.8 | Branch Manager chỉ thấy HV chi nhánh mình | Dữ liệu tự động lọc theo `branchId` của user đang đăng nhập. Admin thấy tất cả chi nhánh. |
| 5.9 | HV được xếp lớp thành công, danh sách cập nhật | HV biến mất khỏi tab `cho_xep_lop`, xuất hiện ở tab `cho_khai_giang`. Count trên tabs cập nhật realtime (không cần reload). |
| 5.10 | Responsive trên tablet | Panel phải thu gọn thành drawer (mở bằng nút), panel trái chiếm full width. |

---

## 6. Acceptance Criteria

- [ ] Màn hình hiển thị đúng 5 status tabs (Tất cả, Chờ xếp lớp, Xếp lớp sau, Chờ chuyển lớp, Chờ khai giảng) với count chính xác.
- [ ] Bảng HV hiển thị đủ 9 cột: Checkbox, Học viên, Tuổi, Chương trình, Gói học, Chi nhánh, Trạng thái, Ngày chờ, Hành động.
- [ ] Cột "Ngày chờ" tính đúng số ngày từ ngày vào trạng thái hiện tại, hiển thị 4 mức urgency (xanh/cam/đỏ/quá hạn).
- [ ] Panel phải hiển thị danh sách lớp còn chỗ, mỗi card có đủ thông tin: Tên, Chi nhánh, GV, Sĩ số, Lịch học, Level.
- [ ] Khi chọn 1 HV ở panel trái, panel phải highlight lớp phù hợp (cùng Subject + Level + Branch) và đẩy lên đầu.
- [ ] Nút "Xếp HV đã chọn vào đây" trên card lớp hoạt động đúng: mở modal xác nhận, check sĩ số, check level.
- [ ] Batch selection: chọn nhiều HV → hiện Batch Action Bar với nút "Xếp lớp" và "Hoãn".
- [ ] Modal xếp lớp hiển thị thông tin HV + Lớp đích + kết quả kiểm tra tự động (sĩ số, level, lịch trùng).
- [ ] Cảnh báo vàng khi Level không khớp, cảnh báo đỏ khi vượt sĩ số. Admin có quyền override sĩ số.
- [ ] Sau xếp lớp thành công: HV chuyển sang `cho_khai_giang`, biến mất khỏi tab cũ, count cập nhật realtime, toast notification hiển thị.
- [ ] Tìm kiếm hoạt động realtime trên 5 field (fullName, code, phone, packageName, subject).
- [ ] Filter Drawer hiển thị 4 nhóm filter (Chi nhánh, Chương trình, Gói học, Mức độ chờ).
- [ ] Branch Manager chỉ thấy HV thuộc chi nhánh mình. Admin thấy tất cả.
- [ ] Responsive: Tablet thu gọn panel phải thành drawer.
- [ ] Dropdown chi nhánh trên toolbar đồng bộ với filter chi nhánh panel phải.

---

## 7. Nghiệp vụ liên quan

| Hướng | BF | Tương tác |
|-------|-----|-----------|
| **Upstream** | BF-SAL-01 (Đơn hàng) | HV hoàn thành thanh toán → tự động vào Waitlist (`cho_xep_lop`) |
| **Upstream** | BF-CLS-06 (Chuyển lớp) | HV yêu cầu chuyển lớp → vào trạng thái `cho_chuyen_lop` |
| **Downstream** | BF-CLS-02 (Quản lý lớp) | Lấy danh sách Class đang Open + Capacity |
| **Downstream** | BF-CLS-03 (Quản lý HV) | Sau xếp lớp, HV xuất hiện trong Roster của Class |
| **Downstream** | BF-OPS-02 (Xếp lịch) | Check trùng lịch HV khi xếp lớp |


## Đề xuất Giao diện (Expected UI/UX)
- **Màn hình:** Quản lý Xếp lớp (Waitlist Enrollment).
- **Đề xuất UI:** Màn hình 2-Panel (Split View). Panel trái là danh sách học viên đang chờ; Panel phải là chi tiết các lớp đang mở để thao tác kéo thả hoặc chọn.
