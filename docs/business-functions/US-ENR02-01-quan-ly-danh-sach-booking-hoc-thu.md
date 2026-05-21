---
id: US-ENR02-01
title: "Quản lý danh sách Booking Học thử"
bf: BF-ENR-02
domain: CAP-ADM
status: draft
tags: [enrollment, trial, list]
---

# US-ENR02-01: Quản lý danh sách Booking Học thử

> **Tham chiếu:** BF-ENR-02 · `[POLICY-DS-03]` · Giao diện Mẫu §4.2 (Danh sách)

## 1. Yêu cầu Người dùng (User Story)

**Là một** nhân viên Tư vấn / Giáo vụ / Quản lý chi nhánh,
**tôi muốn** xem và lọc danh sách vé học thử theo trạng thái, cơ sở và chương trình,
**để** quản lý phễu khách hàng học thử, dễ dàng theo dõi ai đang chờ ghép lớp, ai đã hoàn thành để liên hệ tư vấn chốt.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập, không phụ thuộc US-ENR02-02..05.
> - [x] **N**egotiable — Thứ tự cột, bộ lọc có thể thương lượng.
> - [x] **V**aluable — Cung cấp tầm nhìn tổng thể về trạng thái phễu học thử.
> - [x] **E**stimable — Đủ rõ để ước lượng công sức.
> - [x] **S**mall — Hoàn thành trong 1 vòng phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-LIST-01]:** Mặc định hiển thị tất cả trạng thái. Bấm ô trạng thái để lọc, bấm lần 2 để bỏ lọc.
2. **[RULE-LIST-02]:** Tìm kiếm tự động khi gõ, quét 6 trường (mã booking, tên booking, tên học viên, mã khách hàng, SĐT gia đình, chương trình), không phân biệt hoa/thường.
3. **[RULE-LIST-03]:** Tất cả lớp lọc (cơ sở, ô trạng thái, bảng lọc nâng cao, tìm kiếm) hoạt động đồng thời theo logic VÀ.
4. **[RULE-LIST-04]:** Khi chọn cơ sở, số đếm trên thanh trạng thái cập nhật lại theo dữ liệu đã lọc.
5. **[RULE-LIST-05]:** Ô "Chưa gán lớp" là trạng thái ảo — lọc booking chưa có lớp ghép, không phụ thuộc trạng thái chính.
6. **[RULE-LIST-06]:** SĐT hiển thị ẩn một phần (4 ký tự đầu + **** + 2 ký tự cuối). Số gốc chỉ dùng khi sao chép.
7. **[RULE-LIST-07]:** Bấm vào dòng mở hộp thoại chi tiết (cửa sổ nổi), không chuyển trang.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ

| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chọn Cơ sở | Danh sách thả xuống | Lọc nhanh theo chi nhánh | Mặc định: "Tất cả cơ sở". |
| Ô tìm kiếm | Ô nhập chữ mở rộng | Quét 6 trường | Gợi ý: "Tìm mã, tên HV, SĐT...". |
| Nút Lọc | Nút biểu tượng | Mở bảng lọc nâng cao | Hiển thị số bộ lọc đang áp dụng. |
| Nút Tạo Booking | Nút màu nhấn | Mở hộp thoại tạo (US-ENR02-02) | Kiểm tra quyền trước. |

### 3.2. Khối lọc Trạng thái

| Thành phần | Nhóm màu | Điều kiện | Ghi chú |
|------------|----------|-----------|---------|
| Tất cả | Mặc định | Bỏ lọc | |
| Đã đặt lịch | Cảnh báo | Trạng thái "chờ ghép lớp" | Mặc định khi mới tạo. |
| Chưa gán lớp | Cảnh báo | Chưa có lớp ghép | Trạng thái ảo. |
| Đã ghép lớp | Tích cực | Đã gán lớp và buổi học | |
| Cần đổi lịch | Tiêu cực | Cần đổi lớp/buổi | |
| Không đến | Trung tính | Vắng mặt không lý do | |
| Hoàn thành | Hoàn tất | GV đã nộp nhận xét | |
| Đã hủy | Trung tính | Booking đã hủy | |

### 3.3. Bảng danh sách chính

*Bấm vào dòng → Mở hộp thoại chi tiết*

| Cột | Loại hiển thị | Trường Dữ liệu | Ghi chú |
|-----|---------------|----------------|---------|
| Ô chọn | Ô chọn | Chọn tất cả / từng bản ghi | Cố định bên trái. |
| Booking / Tên | Văn bản | Tên booking, mã, nhãn môn | Cố định. Kèm nút gọi khi di chuột. |
| Học viên | Ảnh + Văn bản | Ảnh chữ cái, tên HV, mã KH | |
| Phụ huynh | Văn bản + Bảng nổi | Tên gia đình, SĐT ẩn, nút sao chép | Bảng nổi nếu >1 thành viên. |
| Lần | Văn bản | Số lần học thử | |
| Chương trình | Văn bản | Tên chương trình | |
| Lớp ghép | Văn bản | Tên lớp + mã. "Chưa ghép" nếu trống. | |
| Buổi học | Văn bản + Popover | Tên buổi đầu tiên kèm Tag đếm số lượng. Biểu tượng Lịch mở danh sách toàn bộ các buổi học (Multi-session). "—" nếu trống. | Giao diện tối giản (Dense UI). |
| Ngày giờ | Văn bản | Giờ và ngày trên cùng dòng với nhãn `TỪ:` và `ĐẾN:`. | Tiết kiệm không gian chiều dọc. |
| Người phụ trách | Nhóm ảnh | 2 ảnh tròn xếp chồng | |
| Trạng thái | Nhãn trạng thái | Theo bộ màu chuẩn | |

### 3.4. Thao tác khi di chuột vào dòng

| Nút | Loại | Logic | Điều kiện |
|-----|------|-------|-----------|
| Gọi điện | Nút biểu tượng | Sao chép SĐT | Cột Booking/Tên. |

### 3.5. Bảng lọc nâng cao

| Thành phần | Loại | Dữ liệu | Ghi chú |
|------------|------|---------|---------|
| Nhóm "Chương trình" | Ô chọn | Tự động từ dữ liệu, kèm số lượng | |
| Nhóm "Người tạo" | Ô chọn | Tự động từ dữ liệu | |
| Nút Xóa tất cả | Nút văn bản | Đặt lại bộ lọc | |

### 3.6. Phân trang

Chuẩn `[20, 50, 100]` bản ghi/trang.

---

## 4. Xử lý Ngoại lệ

| # | Tình huống | Cách xử lý |
|---|-----------|------------|
| 4.1 | Danh sách rỗng | Hiện "Không có booking học thử phù hợp" kèm gợi ý. Thanh trạng thái = 0. |
| 4.2 | Tìm kiếm không kết quả | Bảng trống, hiện thông báo. Thanh trạng thái giữ số đếm tổng. |
| 4.3 | Dữ liệu đã cũ | Báo lỗi "Dữ liệu đã cũ" hoặc nút làm mới. |
| 4.4 | Lọc kết hợp | Tất cả logic VÀ. |
| 4.5 | Đổi số dòng/trang | Quay về trang 1, tính lại tổng trang. |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Nhãn trạng thái bắt buộc lấy màu từ `statusColors.ts`.
- Bố cục: Thanh công cụ → Khối trạng thái → Bảng dữ liệu → Phân trang.
- Trạng thái ảo "Chưa gán lớp" kiểm tra dữ liệu (className rỗng), không phải trạng thái chính.

### ⛔ Hàng rào An toàn (Guardrails)

- **KHÔNG** thêm cột, trường lọc ngoài mục 3.
- **KHÔNG** bỏ qua trạng thái Trống / Đang tải / Lỗi.

---

## 6. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Tìm kiếm | Nhập từ khóa | Lọc đúng 6 trường, không phân biệt hoa/thường. |
| V-02 | Trạng thái trống | Xóa dữ liệu | Hiện thông báo, không lỗi giao diện. |
| V-03 | Nhãn trạng thái | Kiểm tra mắt | Màu từ hệ thống, không gán cố định. |
| V-04 | Phân trang | Chuyển trang | Dữ liệu đúng, quay trang 1 khi đổi kích thước. |
| V-05 | Thanh trạng thái | Chọn cơ sở | Số đếm cập nhật theo lọc. |
| V-06 | Lọc kết hợp | Chọn nhiều lọc | Chỉ hiện bản ghi thỏa tất cả (logic VÀ). |
| V-07 | Bảng nổi gia đình | Bấm mở/đóng | Đúng thành viên, tự đóng khi bấm ngoài. |

---

## 7. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|---------------------|----------------------|-------------------|
| AC-01 | Bố cục chuẩn | So mẫu §4.2 | Thanh công cụ → Khối trạng thái → Bảng → Phân trang. |
| AC-02 | Thanh trạng thái | Kiểm tra 8 ô | Số đếm chính xác, lọc/bỏ lọc đúng. |
| AC-03 | Tìm kiếm | Nhập từ khóa | Khớp 6 trường, không phân biệt hoa/thường. |
| AC-04 | Bảng đủ cột | Kiểm tra mắt | 2 cột cố định khi cuộn ngang. |
| AC-05 | Bảng lọc nâng cao | Mở/đóng | 2 nhóm, kết hợp logic VÀ. |
| AC-06 | Hộp thoại chi tiết | Bấm dòng | Đầy đủ thông tin, audit log, nút hành động. |
| AC-07 | Phân trang | Thao tác | Mặc định 20, [20, 50, 100]. |
| AC-08 | Nhãn đúng màu | Kiểm tra mắt | Từ hệ thống tập trung. |
