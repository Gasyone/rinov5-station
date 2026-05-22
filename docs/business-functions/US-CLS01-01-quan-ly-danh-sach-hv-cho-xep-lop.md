---
id: US-CLS01-01
title: "Bộ lọc Học viên chờ xếp lớp trong Quản lý Học viên"
type: "User Story"
domain: "CAP-OPS"
bf: BF-CLS-03
status: "Draft"
tags: [user-story]
---

# US-CLS01-01: Bộ lọc Học viên chờ xếp lớp (trong Quản lý Học viên)

> **Tham chiếu:** BF-CLS-03 · `[POLICY-DS-03]` · Design System §4.2 List Page Pattern
> **Lưu ý:** Không còn là màn hình riêng. Chức năng xếp lớp được tích hợp vào `/app/students` dưới dạng bộ lọc trạng thái "Chờ xếp lớp".

## 1. User Story

**Là một** Giáo vụ / Quản lý chi nhánh,
**tôi muốn** lọc danh sách học viên theo trạng thái "Chờ xếp lớp" và thao tác xếp lớp ngay trên màn hình Quản lý Học viên,
**để** chủ động nắm số lượng học viên cần xử lý và xếp lớp kịp thời mà không phải chuyển màn hình.

---

## 2. Thông tin cơ bản

| Thuộc tính | Giá trị |
|------------|---------|
| **BF:** | BF-CLS-03 (Quản lý Học viên) |
| **CAP:** | CAP-OPS (Vận hành Lớp) |
| **Màn hình:** | Quản lý Học viên (`/app/students`) |
| **Nhóm menu:** | Quản lý lớp học |
| **Vai trò được phép:** | Quản trị viên, Quản lý chi nhánh, Giáo vụ |
| **Mức ưu tiên:** | Cao |

---

## 3. Điều kiện tiền quyết

1. Học viên đã hoàn thành thanh toán và có trạng thái `Cho_xep_lop`.
2. Người dùng đã đăng nhập với vai trò Quản trị viên hoặc Quản lý chi nhánh hoặc Giáo vụ.

---

## 4. Mô tả chi tiết

Trên màn hình **Quản lý Học viên** (`/app/students`), bộ lọc trạng thái cho phép tách riêng nhóm **Chờ xếp lớp**. Khi chọn bộ lọc này:

### 4.1. Tab trạng thái (Segmented Control)

| Tab | Tên hiển thị | Mô tả |
|-----|-------------|-------|
| Tất cả | Tất cả | Tổng số HV toàn hệ thống |
| Chờ xếp lớp | Chờ xếp lớp | HV đã thanh toán, chờ ghép vào lớp |
| Đang học | Đang học | HV đang theo học trong lớp |
| Bảo lưu | Bảo lưu | HV tạm nghỉ |
| Nghỉ học | Nghỉ học | HV đã rút hồ sơ |

Mặc định chọn "Tất cả".

### 4.2. Bảng danh sách khi lọc "Chờ xếp lớp"

| Cột | Loại | Mô tả |
|-----|------|-------|
| Ô chọn | Ô chọn | Chọn 1 hoặc nhiều HV để xếp lớp hàng loạt |
| Học viên | Văn bản + Mã | Tên HV (in đậm) + Mã HV. Ảnh đại diện chữ cái đầu |
| Tuổi | Văn bản | Tính từ ngày sinh |
| Chương trình | Nhãn + Văn bản | Tên môn/chương trình (VD: "IELTS Junior") |
| Chi nhánh | Văn bản | Chi nhánh đăng ký |
| Ngày chờ | Văn bản + Mức độ khẩn | Số ngày kể từ khi vào trạng thái chờ |
| Hành động | Nhóm nút | Nút "Xếp lớp" (mở hộp thoại chọn lớp) |

**Mức độ khẩn cột "Ngày chờ":**
- ≤ 3 ngày: Bình thường
- 4-7 ngày: Nhắc nhở
- 8-14 ngày: Cảnh báo + biểu tượng
- > 14 ngày: Khẩn cấp + nhãn "Quá hạn"

### 4.3. Hộp thoại Xếp lớp

Khi bấm "Xếp lớp":

| Thành phần | Mô tả |
|-----------|------|
| Thông tin HV | Tên, Chương trình, Chi nhánh |
| Danh sách lớp gợi ý | Lớp cùng Chi nhánh + Chương trình, còn chỗ trống. Lớp phù hợp nhất hiển thị trên đầu |
| Kiểm tra tự động | Sĩ số, Level khớp, Trùng lịch |
| Cảnh báo Level | Nếu Level HV ≠ Level lớp: "Level không khớp. Bạn có chắc?" |
| Cảnh báo sĩ số | Nếu lớp gần đầy (≥80%): cảnh báo. Nếu đầy: chặn (quản trị viên được ghi đè) |
| Xác nhận | "Xác nhận xếp lớp" + "Hủy" |

Sau khi xác nhận:
- HV chuyển trạng thái sang `Dang_hoc`
- HV xuất hiện trong Roster lớp
- Thông báo thành công

### 4.4. Thao tác hàng loạt

Khi chọn nhiều HV:
- Thanh thao tác hiển thị: "Đã chọn X học viên"
- Nút "Xếp lớp hàng loạt" → mở hộp thoại chọn lớp đích
- Nút "Hoãn" → chuyển sang trạng thái "Xếp lớp sau"
- Nút "Bỏ chọn"

### 4.5. Quy tắc Xếp lớp

1. **Sĩ số:** Không cho phép xếp nếu vượt sĩ số tối đa, trừ quản trị viên được ghi đè.
2. **Level Matching:** Cảnh báo nếu HV có Level khác với Level lớp, nhưng vẫn cho phép tiếp tục.
3. **Trùng lịch:** Cảnh báo nếu HV đã có lịch học trùng giờ.

---

## 5. Trường hợp đặc biệt

| # | Trường hợp | Hành vi mong đợi |
|---|-----------|-----------------|
| 5.1 | Không có HV chờ xếp lớp | Bảng hiển thị EmptyState: "Không có học viên chờ xếp lớp" |
| 5.2 | Không có lớp nào còn chỗ | Hộp thoại xếp lớp: "Không có lớp phù hợp còn chỗ. Vui lòng mở lớp mới" |
| 5.3 | Vượt sĩ số tối đa | Chặn lưu, trừ quản trị viên được ghi đè (`[DS-P4]`) |
| 5.4 | Level HV ≠ Level lớp | Cảnh báo nhẹ, cho phép tiếp tục |
| 5.5 | HV chờ > 14 ngày | Dòng được đánh dấu cảnh báo nhẹ |
| 5.6 | Chọn nhiều HV khác Chương trình để xếp hàng loạt | Vô hiệu nút "Xếp lớp hàng loạt" + gợi ý "Chỉ xếp lớp hàng loạt cho HV cùng chương trình" |
| 5.7 | Quản lý chi nhánh chỉ thấy HV chi nhánh mình | Dữ liệu tự động lọc theo chi nhánh người dùng |

---

## 6. Tiêu chí chấp nhận

- [ ] Bộ lọc trạng thái hiển thị 5 tab với số đếm chính xác
- [ ] Tab "Chờ xếp lớp" chỉ hiển thị HV có trạng thái `Cho_xep_lop`
- [ ] Bảng hiển thị đủ 7 cột: Ô chọn, Học viên, Tuổi, Chương trình, Chi nhánh, Ngày chờ, Hành động
- [ ] Cột "Ngày chờ" tính đúng số ngày, 4 mức khẩn
- [ ] Nút "Xếp lớp" mở hộp thoại đúng: hiển thị thông tin HV, danh sách lớp gợi ý, kiểm tra sĩ số + level
- [ ] Cảnh báo khi Level không khớp, chặn khi vượt sĩ số (trừ quản trị viên được ghi đè)
- [ ] Sau xếp lớp thành công: HV cập nhật trạng thái, thông báo hiển thị
- [ ] Thao tác hàng loạt hoạt động đúng với HV cùng chương trình
- [ ] Quản lý chi nhánh chỉ thấy HV thuộc chi nhánh mình
- [ ] EmptyState hiển thị đúng khi không có HV chờ

---

## 7. Nghiệp vụ liên quan

| Hướng | BF | Tương tác |
|-------|-----|-----------|
| **Đầu vào** | BF-SAL-01 (Đơn hàng) | HV hoàn thành thanh toán → tự động vào trạng thái Chờ xếp lớp |
| **Đầu vào** | BF-CLS-06 (Chuyển lớp) | HV yêu cầu chuyển lớp → vào trạng thái Chờ xếp lớp |
| **Đầu ra** | BF-CLS-02 (Quản lý lớp) | Lấy danh sách lớp đang mở + sức chứa |
| **Đầu ra** | BF-OPS-02 (Xếp lịch) | Kiểm tra trùng lịch HV khi xếp lớp |

---

## Chỉ dẫn cho AI Agent & Lập trình viên

- Không tạo màn hình `/app/class_assignment` riêng. Chức năng xếp lớp là một phần của `/app/students`.
- Sử dụng `<SegmentedControl />` cho bộ lọc trạng thái (tuân thủ Design System §11).
- Hộp thoại xếp lớp dùng `<Dialog />` từ shadcn/ui, layout dạng 2 cột (thông tin HV bên trái, danh sách lớp bên phải).
- Tuân thủ `[DS-P4]` cho xác nhận ghi đè sĩ số.
- Mock data: thêm trạng thái `cho_xep_lop` vào `src/mocks/students.ts`.
- URL query `?status=cho_xep_lop` để deep-link trực tiếp vào nhóm chờ xếp lớp.
