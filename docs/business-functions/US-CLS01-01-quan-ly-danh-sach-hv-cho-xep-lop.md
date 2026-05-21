---
id: US-CLS01-01
title: "Quản lý danh sách Học viên chờ xếp lớp"
type: "User Story"
domain: "CAP-CLS"
bf: BF-CLS-01
status: "Draft"
tags: [user-story]
---

# US-CLS01-01: Quản lý danh sách Học viên chờ xếp lớp

> **Tham chiếu:** BF-CLS-01 · `[POLICY-DS-03]` · Design System §4.2 List Page Pattern

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
| **Màn hình:** | Quản lý Xếp lớp |
| **Nhóm menu:** | Vận hành |
| **Vai trò được phép:** | Quản trị viên, Quản lý chi nhánh |
| **Mức ưu tiên:** | Cao |

---

## 3. Điều kiện tiền quyết

1. Học viên phải đã hoàn thành thanh toán (từ CAP-FIN) hoặc đã được xác nhận ghi danh.
2. Học viên có trạng thái thuộc 1 trong 4 nhóm: Chờ xếp lớp, Xếp lớp sau, Chờ chuyển lớp, Chờ khai giảng.
3. Người dùng đã đăng nhập với vai trò Quản trị viên hoặc Quản lý chi nhánh.

---

## 4. Mô tả chi tiết

Màn hình hiển thị danh sách học viên đang ở các trạng thái **tiền lớp học** (Pre-class) — tức là học viên đã đăng ký nhưng chưa chính thức vào lớp hoặc đang chờ chuyển lớp. Mục tiêu chính: giúp Quản lý chi nhánh thấy nhanh ai cần xếp lớp, lớp nào còn chỗ, và thực hiện thao tác xếp lớp.

### 4.1. Bố cục tổng thể

Màn hình chia thành 2 vùng chính theo chiều ngang:

```
┌──────────────────────────────────────────────────────────────────┐
│ Thanh công cụ: [Tab trạng thái]  |  [Tìm kiếm] [Lọc] [Thao tác]│
├──────────────────────────────────┬───────────────────────────────┤
│                                  │                               │
│   Vùng trái (60%)                │   Vùng phải (40%)             │
│   BẢNG DANH SÁCH HỌC VIÊN       │   DANH SÁCH LỚP CÒN CHỖ     │
│                                  │                               │
│   - Bảng dạng danh sách          │   - Danh sách thẻ theo        │
│   - Ô chọn nhiều                 │     Chương trình              │
│   - Bấm dòng → đánh dấu         │   - Hiển thị tên lớp, GV,    │
│                                  │     sĩ số, lịch học           │
│                                  │   - Nút "Xếp vào lớp này"    │
│                                  │                               │
├──────────────────────────────────┴───────────────────────────────┤
│ Chân bảng: [Hiển thị X bản ghi]  [Số dòng/trang]  [Phân trang] │
└──────────────────────────────────────────────────────────────────┘
```

> **Tại sao bố cục 2 vùng?**
> Bài toán Xếp lớp là bài toán **ghép cặp** (Học viên ↔ Lớp). Người dùng cần nhìn đồng thời 2 nguồn: danh sách HV chờ (bên trái) và danh sách lớp còn chỗ (bên phải) để ra quyết định. Thiết kế này phổ biến trong hệ thống quản lý học viên (SIS).

### 4.2. Tab trạng thái

Hiển thị 5 tab lọc nhanh:

| Tab | Tên hiển thị | Nhóm màu | Mô tả | Đếm |
|-----|-------------|----------|-------|-----|
| Tất cả | Tất cả | Trung tính | Tổng số HV ở 4 trạng thái dưới | Tổng 4 nhóm |
| Chờ xếp lớp | Chờ xếp lớp | Đang xử lý (xanh) | HV đã thanh toán, chờ ghép vào lớp | Đếm theo trạng thái |
| Xếp lớp sau | Xếp lớp sau | Hoãn (tím) | HV được hoãn xếp lớp theo yêu cầu | Đếm theo trạng thái |
| Chờ chuyển lớp | Chờ chuyển lớp | Cảnh báo (cam) | HV đang chờ duyệt chuyển sang lớp khác | Đếm theo trạng thái |
| Chờ khai giảng | Chờ khai giảng | Đã xếp (xanh ngọc) | HV đã được xếp lớp, chờ lớp bắt đầu | Đếm theo trạng thái |

### 4.3. Thanh công cụ

| Thành phần | Loại | Mô tả |
|------------|------|-------|
| Tab trạng thái | 5 tab lọc nhanh | Lọc nhanh theo trạng thái. Mặc định chọn "Tất cả". |
| Chọn Chi nhánh | Danh sách thả xuống | Lọc theo chi nhánh. Mặc định "Tất cả chi nhánh". Chỉ hiển thị cơ sở nội bộ đang hoạt động. |
| Ô tìm kiếm | Ô nhập liệu | Gợi ý: "Tìm theo tên, mã HV, SĐT, chương trình...". Tìm tự động. |
| Nút Bộ lọc | Nút biểu tượng | Mở bảng lọc bên phải. Hiển thị số bộ lọc đang áp dụng. |

### 4.4. Vùng trái — Bảng danh sách Học viên chờ

| Cột | Loại | Mô tả |
|-----|------|-------|
| Ô chọn | Ô chọn | Chọn 1 hoặc nhiều HV để xếp lớp hàng loạt. |
| Học viên | Văn bản + Mã | Tên HV (in đậm) + Mã HV (kiểu chữ mã, màu phụ). Ảnh đại diện chữ cái đầu. |
| Tuổi | Văn bản | Tính từ ngày sinh. Hiển thị "X tuổi". |
| Chương trình | Nhãn + Văn bản | Tên môn học/chương trình đã đăng ký (VD: "IELTS Junior"). Nhãn màu theo môn. |
| Gói học | Văn bản | Tên gói (VD: "Gói 36 buổi"). |
| Chi nhánh | Văn bản | Tên chi nhánh đăng ký. |
| Trạng thái | Nhãn trạng thái | Nhãn màu theo quy tắc màu trạng thái (§3.2). |
| Ngày chờ | Văn bản + Mức độ khẩn | Số ngày kể từ khi HV vào trạng thái hiện tại. Hiển thị mức độ khẩn theo ngưỡng thời gian. |
| Hành động | Nhóm nút | Nút "Xếp lớp" (nút chính), nút "⋯" (menu: Hoãn, Xem hồ sơ, Hủy — Hủy cần xác nhận theo §6.4 `[DS-P4]`). |

**Mức độ khẩn cột "Ngày chờ":**
- ≤ 3 ngày: Bình thường (màu tích cực)
- 4-7 ngày: Nhắc nhở (màu cảnh báo nhẹ)
- 8-14 ngày: Cảnh báo (màu cảnh báo) + biểu tượng cảnh báo
- > 14 ngày: Khẩn cấp (màu nguy hiểm, in đậm) + nhãn "Quá hạn"

> **Tại sao cần cột Ngày chờ?**
> Trong SIS chuẩn, KPI quan trọng nhất của Xếp lớp là "Time to Enroll" — thời gian trung bình từ lúc HV đăng ký đến lúc được xếp lớp. Cột này giúp Quản lý chi nhánh ưu tiên xử lý HV chờ lâu.

### 4.5. Vùng phải — Danh sách Lớp còn chỗ

Hiển thị các lớp đang mở và còn chỗ trống (sĩ số hiện tại < sức chứa).

Mỗi lớp hiển thị dạng **Thẻ nhỏ gọn**:

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
| Tên lớp | In đậm |
| Chi nhánh | Màu phụ |
| GV chủ nhiệm | Tên + vai trò |
| Sĩ số | Thanh tiến trình nhỏ + văn bản "X/Y (còn Z chỗ)". Nếu gần đầy (≥80%): thanh cảnh báo. Nếu đầy: thanh nguy hiểm + vô hiệu. |
| Lịch học | Tóm tắt (Thứ + Khung giờ) |
| Level/Chương trình | Level của lớp (để ghép cặp với HV) |
| Nút xếp lớp | "Xếp HV đã chọn vào đây". Vô hiệu nếu chưa chọn HV nào, hoặc lớp đã đầy. |

**Bộ lọc vùng phải:**
- Chọn Chi nhánh (đồng bộ với thanh công cụ)
- Chọn Chương trình/Môn học
- Chuyển đổi "Chỉ hiện lớp còn chỗ" (mặc định bật)

**Gợi ý thông minh (Smart Matching):**
Khi chọn 1 HV ở vùng trái, vùng phải tự động:
- Đánh dấu nổi bật các lớp **phù hợp** (cùng Môn, cùng Level, cùng Chi nhánh)
- Đẩy lớp phù hợp lên đầu danh sách
- Mờ đi các lớp không phù hợp (khác Môn hoặc đã đầy)

### 4.6. Bảng lọc nâng cao

| Nhóm lọc | Loại | Tùy chọn |
|----------|------|----------|
| Chi nhánh | Danh sách ô chọn (nhiều) | Danh sách chi nhánh đang hoạt động. Mỗi mục có số đếm. |
| Chương trình | Danh sách ô chọn (nhiều) | IELTS Junior, Movers, Flyers, KET Prep, PET Prep... |
| Gói học | Danh sách ô chọn (nhiều) | Gói 24/36/48/60 buổi |
| Mức độ chờ | Nhóm chọn đơn | Tất cả / Chờ > 7 ngày / Chờ > 14 ngày (Quá hạn) |

### 4.7. Thao tác hàng loạt

Khi chọn nhiều HV bằng ô chọn, hiển thị **Thanh thao tác hàng loạt** phía trên bảng:

| Thành phần | Mô tả |
|------------|-------|
| Nhãn | "Đã chọn X học viên" |
| Nút "Xếp lớp" | Mở hộp thoại chọn lớp đích. Chỉ hiển thị lớp phù hợp (cùng Môn). Kiểm tra sĩ số trước khi xác nhận. |
| Nút "Hoãn xếp lớp" | Chuyển tất cả HV đã chọn sang trạng thái "Xếp lớp sau". |
| Nút "Bỏ chọn" | Xóa lựa chọn |

### 4.8. Hộp thoại Xếp lớp (Xác nhận ghép cặp)

Khi bấm "Xếp lớp" (từ nút trên dòng hoặc từ thẻ Lớp bên phải):

| Bước | Nội dung |
|------|----------|
| 1. Xác nhận thông tin | Hiển thị: Tên HV, Chương trình đăng ký, Lớp đích, Sĩ số hiện tại → mới |
| 2. Kiểm tra tự động | Hệ thống kiểm tra: (a) Lớp còn chỗ? (b) Level HV có khớp Level lớp? (c) Lịch HV có trùng lớp khác? |
| 3. Cảnh báo (nếu có) | Nếu Level không khớp: Cảnh báo "Level HV (Movers) khác Level lớp (Flyers). Bạn có chắc?" |
| 4. Xác nhận | Nút "Xác nhận xếp lớp" (nút chính) + "Hủy" (nút phụ) |

Sau khi xác nhận:
- Trạng thái HV chuyển thành "Chờ khai giảng"
- HV xuất hiện trong Danh sách lớp đích
- Số đếm trên Tab trạng thái cập nhật tự động
- Thông báo: "Đã xếp {Tên HV} vào lớp {Tên lớp}"

---

## 5. Trường hợp đặc biệt

| # | Trường hợp | Hành vi mong đợi |
|---|-----------|-----------------|
| 5.1 | Không có HV nào chờ xếp lớp | Bảng hiển thị trạng thái trống (§6.5 EmptyState): "Không có học viên nào đang chờ xếp lớp". Vùng phải vẫn hiển thị lớp còn chỗ. |
| 5.2 | Không có lớp nào còn chỗ | Vùng phải hiển thị trạng thái trống: "Tất cả các lớp đã đủ sĩ số. Vui lòng mở lớp mới." Kèm nút "Tạo lớp mới". |
| 5.3 | Xếp HV vào lớp làm vượt sĩ số tối đa | Cảnh báo nguy hiểm: "Lớp đã đạt sĩ số tối đa. Xếp thêm sẽ vượt quy định." Quản trị viên có thể ghi đè bằng xác nhận lần 2 (`[DS-P4]`). Quản lý chi nhánh không có quyền ghi đè. |
| 5.4 | Xếp HV có Level khác với Level lớp | Cảnh báo nhẹ (không chặn). Cho phép tiếp tục nhưng ghi nhận lịch sử. |
| 5.5 | HV đã có lớp cũ (trạng thái "Chờ chuyển lớp") | Hộp thoại hiển thị thêm: "Chuyển từ lớp {Lớp cũ} sang lớp {Lớp mới}". Hệ thống tự động gỡ HV khỏi Danh sách lớp cũ. |
| 5.6 | Chọn nhiều HV khác Môn để xếp lớp hàng loạt | Vô hiệu nút "Xếp lớp" + gợi ý: "Chỉ xếp lớp hàng loạt cho HV cùng chương trình". |
| 5.7 | HV chờ > 14 ngày | Dòng được đánh dấu nhẹ (nền cảnh báo). Cột "Ngày chờ" hiển thị nhãn "Quá hạn". |
| 5.8 | Quản lý chi nhánh chỉ thấy HV chi nhánh mình | Dữ liệu tự động lọc theo chi nhánh của người dùng đang đăng nhập. Quản trị viên thấy tất cả. |
| 5.9 | HV được xếp lớp thành công, danh sách cập nhật | HV biến mất khỏi tab "Chờ xếp lớp", xuất hiện ở tab "Chờ khai giảng". Số đếm cập nhật tự động. |
| 5.10 | Trên máy tính bảng | Vùng phải thu gọn thành bảng trượt (mở bằng nút), vùng trái chiếm toàn bộ chiều rộng. |

---

## 6. Tiêu chí chấp nhận

- [ ] Màn hình hiển thị đúng 5 tab trạng thái với số đếm chính xác.
- [ ] Bảng HV hiển thị đủ 9 cột: Ô chọn, Học viên, Tuổi, Chương trình, Gói học, Chi nhánh, Trạng thái, Ngày chờ, Hành động.
- [ ] Cột "Ngày chờ" tính đúng số ngày, hiển thị 4 mức khẩn cấp.
- [ ] Vùng phải hiển thị danh sách lớp còn chỗ, mỗi thẻ có đủ thông tin.
- [ ] Khi chọn 1 HV ở vùng trái, vùng phải đánh dấu nổi bật lớp phù hợp và đẩy lên đầu.
- [ ] Nút "Xếp HV đã chọn vào đây" hoạt động đúng: mở hộp thoại xác nhận, kiểm tra sĩ số và level.
- [ ] Chọn nhiều HV → hiện thanh thao tác hàng loạt với nút "Xếp lớp" và "Hoãn".
- [ ] Hộp thoại xếp lớp hiển thị thông tin HV + Lớp đích + kết quả kiểm tra tự động.
- [ ] Cảnh báo khi Level không khớp. Cảnh báo nguy hiểm khi vượt sĩ số. Quản trị viên có quyền ghi đè (`[DS-P4]`).
- [ ] Sau xếp lớp thành công: HV chuyển trạng thái, biến mất khỏi tab cũ, số đếm cập nhật tự động, thông báo hiển thị.
- [ ] Tìm kiếm hoạt động tự động trên 5 trường (tên, mã, SĐT, gói, chương trình).
- [ ] Bảng lọc hiển thị 4 nhóm (Chi nhánh, Chương trình, Gói học, Mức độ chờ).
- [ ] Quản lý chi nhánh chỉ thấy HV thuộc chi nhánh mình. Quản trị viên thấy tất cả.
- [ ] Trên máy tính bảng: vùng phải thu gọn thành bảng trượt.
- [ ] Chọn Chi nhánh trên thanh công cụ đồng bộ với bộ lọc chi nhánh vùng phải.

---

## 7. Nghiệp vụ liên quan

| Hướng | BF | Tương tác |
|-------|-----|-----------|
| **Đầu vào** | BF-SAL-01 (Đơn hàng) | HV hoàn thành thanh toán → tự động vào danh sách chờ (Chờ xếp lớp) |
| **Đầu vào** | BF-CLS-06 (Chuyển lớp) | HV yêu cầu chuyển lớp → vào trạng thái "Chờ chuyển lớp" |
| **Đầu ra** | BF-CLS-02 (Quản lý lớp) | Lấy danh sách lớp đang mở + sức chứa |
| **Đầu ra** | BF-CLS-03 (Quản lý HV) | Sau xếp lớp, HV xuất hiện trong Danh sách lớp |
| **Đầu ra** | BF-OPS-02 (Xếp lịch) | Kiểm tra trùng lịch HV khi xếp lớp |

---

## Đề xuất Giao diện

- **Màn hình:** Quản lý Xếp lớp (Waitlist Enrollment).
- **Đề xuất:** Màn hình 2 vùng (Split View). Vùng trái là danh sách học viên đang chờ; Vùng phải là chi tiết các lớp đang mở để thao tác chọn hoặc kéo thả.
