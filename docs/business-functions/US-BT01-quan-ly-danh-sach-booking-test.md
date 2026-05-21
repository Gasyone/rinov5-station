---
id: US-BT01
title: "Quản lý danh sách Booking Test"
bf: BF-ENR-01
domain: CAP-ADM
status: draft
tags: [enrollment, booking-test, list]
---

# US-BT01: Quản lý danh sách Booking Test

> **Tham chiếu:** BF-ENR-01 · `[POLICY-DS-03]` · Giao diện Mẫu §4.2 (Danh sách)

## 1. Yêu cầu Người dùng (User Story)

**Là một** nhân viên Tư vấn / Quản lý chi nhánh,
**tôi muốn** xem và lọc danh sách booking kiểm tra đầu vào theo môn học và trạng thái,
**để** nắm được toàn bộ tình hình booking hiện tại, nhanh chóng xác định các booking cần xử lý và liên hệ phụ huynh khi cần.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập, không phụ thuộc US-BT02..05.
> - [x] **N**egotiable — Thứ tự cột, bộ lọc có thể thương lượng.
> - [x] **V**aluable — Cung cấp tầm nhìn tổng thể về booking cho Sale và Quản lý.
> - [x] **E**stimable — Đủ rõ để ước lượng công sức.
> - [x] **S**mall — Hoàn thành trong 1 vòng phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-LIST-01]:** Mặc định hiển thị tab môn ENGLISH. Chuyển tab sẽ lọc toàn bộ danh sách theo môn học.
2. **[RULE-LIST-02]:** Tìm kiếm tự động khi gõ, quét trên 6 trường (tên học viên, tên gia đình, số điện thoại, mã booking, tên cơ sở, phòng học), không phân biệt chữ hoa chữ thường.
3. **[RULE-LIST-03]:** Nút "Tạo booking" ẩn khi vai trò là giáo viên. Cột Level/Sublevel chỉ giáo viên được chỉnh trực tiếp trên bảng.
4. **[RULE-LIST-04]:** Trạng thái ảo ("Đã phỏng vấn", "Đã kiểm tra") không loại trừ trạng thái chính. Một booking "Đang đánh giá" có thể được đếm đồng thời ở cả ô "Đang đánh giá", "Đã phỏng vấn", và "Đã kiểm tra".
5. **[RULE-LIST-05]:** Tất cả các lớp lọc (cơ sở, ô trạng thái, bảng lọc nâng cao, tìm kiếm) hoạt động đồng thời theo logic VÀ. Riêng nhóm "Điều kiện khác" trong bảng lọc áp dụng logic HOẶC nội bộ.
6. **[RULE-LIST-06]:** Khi chọn cơ sở, số đếm trên thanh trạng thái phải cập nhật lại theo dữ liệu đã lọc.
7. **[RULE-LIST-07]:** Số điện thoại hiển thị dạng ẩn một phần (3 ký tự đầu + *** + 3 ký tự cuối). Số điện thoại gốc chỉ được dùng khi gọi hoặc sao chép.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ

| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Tab môn học | Nhóm nút phân đoạn (2 tab: MATH / ENGLISH) | Chuyển tab lọc toàn bộ danh sách theo môn học | Mặc định chọn ENGLISH. Tab đang chọn hiển thị nổi bật. |
| Chọn Cơ sở | Danh sách thả xuống | Lọc nhanh theo chi nhánh nội bộ đang hoạt động | Mặc định: "Tất cả cơ sở". Sắp xếp theo alphabet. Ảnh hưởng số đếm thanh trạng thái. |
| Ô tìm kiếm | Ô nhập chữ | Quét trường: tên học viên, tên gia đình, SĐT, mã booking, cơ sở, phòng học | Gợi ý: "Tìm tên, SĐT, mã booking...". Tìm tự động khi gõ. |
| Nút Tạo booking | Nút màu nhấn | Mở hộp thoại tạo booking mới (US-BT02) | Ẩn khi vai trò giáo viên. |
| Nút Lọc | Nút biểu tượng | Mở bảng lọc nâng cao từ bên phải | Hiển thị số bộ lọc đang áp dụng (nếu > 0). |

### 3.2. Khối lọc Trạng thái

| Thành phần | Nhóm màu | Điều kiện | Ghi chú |
|------------|----------|-----------|---------|
| Tất cả (ALL) | Mặc định | Bỏ lọc trạng thái | Cố định bên trái khi cuộn ngang. |
| Đã đặt lịch (Assessment booked) | Tích cực (xanh lá) | Booking ở trạng thái "đã đặt lịch" | |
| Đang đánh giá (Assessing) | Đang xử lý (xanh dương) | Booking ở trạng thái "đang đánh giá" | |
| Đã phỏng vấn (Interviewed) | Đặc biệt (tím) | Booking đang đánh giá VÀ đã phỏng vấn | Trạng thái ảo, không loại trừ. |
| Đã kiểm tra (Tested) | Cảnh báo (cam) | Booking đang đánh giá VÀ đã kiểm tra | Trạng thái ảo, không loại trừ. |
| Hoàn tất (Completed) | Hoàn tất (xanh ngọc) | Booking ở trạng thái "hoàn tất" | |
| Không đạt (Failed) | Tiêu cực (đỏ) | Booking ở trạng thái "không đạt" | |
| Đã hủy (Cancelled) | Trung tính (xám) | Booking ở trạng thái "đã hủy" | |

Bấm vào ô trạng thái để lọc. Bấm lần 2 để bỏ lọc, quay về "Tất cả". Ô đang chọn: nền đậm chữ sáng. Ô không chọn: nền nhạt.

### 3.3. Bảng danh sách chính

*Bấm vào dòng → Chuyển đến trang chi tiết*

| Cột | Loại hiển thị | Trường Dữ liệu | Ghi chú |
|-----|---------------|----------------|---------|
| Ô chọn | Ô chọn (tiêu đề + dòng) | Chọn tất cả / từng bản ghi | Cố định bên trái. |
| Học viên | Ảnh đại diện + Văn bản | Ảnh chữ cái đầu, tên học viên (in đậm), mã booking (màu phụ) | Cố định bên trái. Kèm nút thao tác khi di chuột (§3.4). |
| Điện thoại | Văn bản + Bảng nổi | Tên gia đình (in hoa, màu phụ), SĐT ẩn một phần, nút sao chép. Nếu >1 thành viên: nút mở bảng nổi gia đình (§3.5). | |
| Chương trình | Văn bản + Nhãn | Tên chương trình. Bên dưới: nhãn môn học theo màu nhấn. | |
| Cơ sở | Văn bản | Tên trường (in đậm, cắt ngắn nếu dài). Bên dưới: phòng hoặc "Lobby" nếu trống. | |
| Giờ thi | Văn bản + Biểu tượng | Biểu tượng đồng hồ + giờ (in đậm, màu nhấn). Bên dưới: ngày. | |
| Level | Danh sách thả xuống | Level hiện tại hoặc "Chưa chọn" | Chỉ giáo viên mới chỉnh được. Viền nét đứt. |
| Sublevel | Danh sách thả xuống | Tương tự Level | Chỉ giáo viên mới chỉnh được. |
| Speaking | Nhãn | "GV: {điểm}" nền cam (vd: "GV: 6.5/8"). Trống: "—". | |
| LWR | Văn bản | Điểm LWR (vd: "27/40"). Trống: "—". | In đậm, màu phụ. |
| Path | Nút liên kết | Môn English: mở hộp thoại đánh giá (US-BT04). Môn Math: "—". | Chỉ bấm được cho English. |
| Trạng thái | Nhãn trạng thái | Theo bộ màu chuẩn trạng thái | |
| Kết quả | Biểu tượng liên kết | Có kết quả: mở liên kết ngoài. Trống: "—". | |
| Thành viên | Nhóm ảnh đại diện | Tối đa 3 ảnh tròn xếp chồng. >3: "+N". Trống: "?". | Lấy từ: người tạo, vận hành, giáo viên, người phỏng vấn (loại trùng). |
| Ghi chú | Văn bản + Biểu tượng | Biểu tượng tin nhắn + nội dung (nghiêng, cắt ngắn nếu dài). | |

### 3.4. Thao tác khi di chuột vào dòng

| Nút | Loại | Logic | Điều kiện |
|-----|------|-------|-----------|
| Đánh giá | Nút biểu tượng | Mở hộp thoại English Assessment Path (US-BT04) | `NẾU môn = English` |
| Gọi điện | Nút biểu tượng | Thực hiện cuộc gọi đến SĐT của booking | Màu tích cực. |
| Xem chi tiết | Nút biểu tượng | Mở hộp thoại chi tiết (US-BT03) | Màu nhấn. |

### 3.5. Bảng nổi thông tin gia đình

Chỉ xuất hiện khi gia đình có hơn 1 thành viên. Bấm nút mở bảng nổi → hiển thị tiêu đề "Liên hệ gia đình" + danh sách thành viên. Tự đóng khi bấm bên ngoài. Chỉ 1 bảng nổi mở tại 1 thời điểm.

| Thành phần | Loại | Ghi chú |
|------------|------|---------|
| Tên thành viên | Văn bản in đậm | Tên + vai trò (vd: "Vũ Nam (Ba)"). Cắt ngắn nếu dài. |
| SĐT thành viên | Văn bản ẩn một phần | Kiểu chữ mã, màu nhấn. SĐT gốc dùng khi gọi/sao chép. |
| Nút Gọi điện | Nút biểu tượng | Màu tích cực. Hiển thị luôn (không cần di chuột). |
| Nút Sao chép SĐT | Nút biểu tượng | Sau khi sao chép: biểu tượng đổi thành dấu tích, tự quay lại sau 2 giây. |

### 3.6. Bảng lọc nâng cao

| Thành phần | Loại | Dữ liệu | Ghi chú |
|------------|------|---------|---------|
| Nhóm "Cơ sở" | Danh sách ô chọn | Danh sách trường, tự động tạo từ dữ liệu. Mỗi mục: tên + số lượng. | Thu gọn/mở rộng. Có nút xóa riêng. |
| Nhóm "Trạng thái" | Danh sách ô chọn | 4 trạng thái chính: Đã đặt lịch, Đang đánh giá, Hoàn tất, Đã hủy. | Số lượng tính từ toàn bộ dữ liệu. |
| Nhóm "Điều kiện khác" | Danh sách ô chọn | 3 điều kiện: Đã phỏng vấn, Đã kiểm tra, Không đạt. | "Đã phỏng vấn" và "Đã kiểm tra" là trạng thái ảo. |
| Nhóm "Giáo viên" | Danh sách ô chọn | Danh sách giáo viên, tự động tạo từ dữ liệu. | Sắp xếp theo alphabet. |
| Nút Xóa tất cả | Nút văn bản | Đặt lại tất cả bộ lọc về trống. | Nằm trên tiêu đề bảng lọc. |

### 3.7. Phân trang

Chuẩn `[20, 50, 100]` bản ghi/trang.

| Thành phần | Loại | Ghi chú |
|------------|------|---------|
| Tổng kết | Nhãn | "Hiển thị {số} bản ghi" — số = tổng sau khi lọc. Nằm bên trái. |
| Số dòng/trang | Danh sách thả xuống | 20, 50, 100. Mặc định 20. Khi đổi: quay về trang 1. |
| Nút Trang trước / sau | Nút biểu tượng | Vô hiệu ở trang đầu / cuối. |
| Các nút số trang | Nhóm nút | Trang đang chọn nổi bật. |

---

## 4. Xử lý Ngoại lệ

| # | Tình huống | Cách xử lý |
|---|-----------|------------|
| 4.1 | Không có dữ liệu nào (danh sách rỗng) | Hiện thông báo "Chưa có dữ liệu". Thanh trạng thái tất cả ô = 0. |
| 4.2 | Tìm kiếm không có kết quả | Bảng trống. Chân bảng hiển thị "Hiển thị 0 bản ghi". Thanh trạng thái giữ nguyên số đếm tổng. |
| 4.3 | Tìm kiếm tiếng Việt có dấu | Tìm "Phuc" không khớp "Phúc" (chưa chuẩn hóa dấu). |
| 4.4 | Kết hợp nhiều bộ lọc đồng thời | Tất cả lọc hoạt động logic VÀ. VD: cơ sở A + "Đang đánh giá" + GV B → chỉ hiện booking thỏa cả 3. |
| 4.5 | Chọn cơ sở trên thanh công cụ vs bảng lọc nhóm "Cơ sở" | Thanh công cụ: chọn đơn. Bảng lọc: chọn nhiều. Dùng đồng thời: logic VÀ. |
| 4.6 | Trạng thái ảo đếm trùng | Booking đang đánh giá + đã phỏng vấn + đã kiểm tra được đếm ở CẢ 3 ô. Đây là hành vi đúng. |
| 4.7 | Chọn "Đã phỏng vấn" + "Đã kiểm tra" cùng lúc | Logic HOẶC: hiện bản ghi thỏa ít nhất 1 điều kiện. |
| 4.8 | Sao chép SĐT không thành công | Hệ thống tự xử lý phương thức dự phòng. |
| 4.9 | Gọi điện trên thiết bị không hỗ trợ | Mở giao thức gọi điện — hành vi phụ thuộc thiết bị. |
| 4.10 | Booking không có giờ thi / kết quả | Cột tương ứng hiển thị trống hoặc "—". |
| 4.11 | Bảng cuộn ngang trên điện thoại | Hỗ trợ cuộn ngang. Cột Ô chọn và Học viên cố định. |
| 4.12 | Vai trò giáo viên truy cập | Ẩn nút "Tạo booking". Cột Level/Sublevel cho phép chỉnh. Xem, lọc, tìm kiếm bình thường. |
| 4.13 | Đổi số dòng/trang khi đang ở trang 3 | Quay về trang 1, tính lại tổng số trang. |
| 4.14 | Bộ lọc làm trang hiện tại vượt tổng trang | Tự động quay về trang cuối hợp lệ hoặc trang 1. |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Phải kiểm tra phân quyền trước khi cho phép xem dữ liệu và thực hiện thao tác (Tạo mới, Chỉnh sửa Level).
- Nhãn trạng thái bắt buộc lấy màu từ bộ quy tắc trạng thái chuẩn (`statusColors.ts`).
- Bố cục danh sách phải đáp ứng đúng chuẩn: Thanh công cụ → Khối trạng thái → Bảng dữ liệu → Phân trang.
- Trạng thái ảo ("Đã phỏng vấn", "Đã kiểm tra") phải được xử lý bằng cờ riêng, không phải trạng thái chính của booking.

### ⛔ Hàng rào An toàn (Guardrails)

- **KHÔNG** thêm cột, trường lọc, hoặc nút bấm ngoài danh sách đã được định nghĩa ở mục 3.
- **KHÔNG** bỏ qua các trạng thái Trống / Đang tải / Lỗi trong thiết kế luồng.
- **KHÔNG** lưu các trạng thái ảo ("Đã phỏng vấn", "Đã kiểm tra") vào trường trạng thái gốc (`status`) của Booking trong Database. Các trạng thái này bắt buộc phải được tính toán động (derived state) dựa trên dữ liệu đánh giá thực tế để đếm số lượng trên thanh trạng thái.

---

## 6. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Tìm kiếm | Nhập từ khóa vào ô tìm kiếm | Bảng lọc đúng trên 6 trường, không phân biệt hoa/thường. |
| V-02 | Trạng thái trống | Xóa hết dữ liệu | Hiện "Chưa có dữ liệu", thanh trạng thái = 0, không lỗi. |
| V-03 | Nhãn trạng thái | Kiểm tra bằng mắt | Tất cả nhãn lấy màu từ hệ thống tập trung, không gán cố định. |
| V-04 | Phân trang | Chuyển trang, đổi số dòng/trang | Dữ liệu hiển thị đúng, quay trang 1 khi đổi kích thước. |
| V-05 | Thanh trạng thái | Chọn cơ sở rồi kiểm tra số đếm | Số đếm cập nhật theo dữ liệu đã lọc, trạng thái ảo đếm đúng. |
| V-06 | Lọc kết hợp | Chọn cơ sở + ô trạng thái + bảng lọc + tìm kiếm | Chỉ hiện bản ghi thỏa tất cả điều kiện (logic VÀ). |
| V-07 | Phân quyền | Đăng nhập vai trò giáo viên | Ẩn nút Tạo booking, Level/Sublevel chỉnh được. |
| V-08 | Bảng nổi gia đình | Bấm mở, bấm ngoài | Hiện đúng thành viên, tự đóng khi bấm ngoài, chỉ 1 bảng mở. |

---

## 7. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|---------------------|----------------------|-------------------|
| AC-01 | Bố cục chuẩn danh sách | So với mẫu thiết kế §4.2 | Thanh công cụ → Khối trạng thái → Bảng → Phân trang. |
| AC-02 | Tab môn học hoạt động | Chuyển tab MATH / ENGLISH | Danh sách lọc đúng theo môn. Mặc định ENGLISH. |
| AC-03 | Thanh trạng thái đúng | Kiểm tra 8 ô (Tất cả + 7 trạng thái) | Số đếm chính xác, bao gồm 2 trạng thái ảo. Bấm lọc/bỏ lọc đúng. |
| AC-04 | Tìm kiếm tự động | Nhập từ khóa | Khớp trên 6 trường, không phân biệt hoa/thường. |
| AC-05 | Bảng đủ 15 cột | Kiểm tra bằng mắt | 2 cột đầu cố định khi cuộn ngang. Dữ liệu chính xác. |
| AC-06 | Bảng lọc nâng cao | Mở/đóng bảng lọc | 4 nhóm lọc, mỗi mục có số lượng. Kết hợp đúng logic VÀ. |
| AC-07 | Bảng nổi gia đình | Bấm mở khi >1 thành viên | Đúng danh sách, sao chép SĐT hoạt động, tự đóng khi bấm ngoài. |
| AC-08 | Thao tác di chuột | Di chuột vào dòng | 3 nút (Đánh giá, Gọi, Chi tiết) hiển thị và thực hiện đúng. |
| AC-09 | Phân quyền vai trò | Đăng nhập giáo viên vs Sale | Giáo viên: ẩn Tạo, chỉnh Level. Sale: hiện Tạo, khóa Level. |
| AC-10 | Phân trang chuẩn | Thao tác chuyển trang, đổi kích thước | Mặc định 20, tùy chọn [20, 50, 100]. Trang tự điều chỉnh khi lọc. |
| AC-11 | Nhãn trạng thái đúng màu | Kiểm tra bằng mắt | Tất cả lấy màu từ hệ thống tập trung, không gán cố định. |
