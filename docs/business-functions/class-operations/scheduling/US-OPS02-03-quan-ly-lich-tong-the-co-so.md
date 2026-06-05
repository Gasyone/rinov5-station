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
> - [x] **I**ndependent — Triển khai độc lập với module Quản lý Lớp học gốc. Đóng vai trò là Màn hình tổng hợp chỉ đọc.
> - [x] **N**egotiable — Chi tiết giao diện bộ lọc và các góc nhìn (tháng/tuần/ngày) có thể linh hoạt.
> - [x] **V**aluable — Cung cấp "bức tranh toàn cảnh" 360 độ về hoạt động đào tạo tại cơ sở.
> - [x] **E**stimable — Ước lượng dựa trên bộ khung lịch chuẩn của hệ thống.
> - [x] **S**mall — Hoàn thành cấu trúc chỉ đọc trong 1 chu kỳ phát triển.
> - [x] **T**estable — Có hơn 10 tiêu chí nghiệm thu chặt chẽ.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-CAL-01] Nguồn dữ liệu (Producer):** 
   - Lịch học cơ sở **CHỈ** hiển thị các sự kiện là Buổi học được sinh ra từ hệ thống Lớp học. 
   - Tuyệt đối KHÔNG chứa lịch Kiểm tra đầu vào hay Học thử (thuộc Tuyển sinh).
2. **[RULE-CAL-02] Chế độ Chỉ đọc (Strictly Read-only):** 
   - Màn hình Lịch KHÔNG cho phép thao tác kéo thả biểu tượng để đổi ngày, đổi giờ hay đổi phòng trực tiếp trên lưới.
   - Tránh rủi ro thay đổi lịch ngoài ý muốn. Mọi thao tác chỉnh sửa phải được thực hiện thông qua biểu mẫu chuẩn.
3. **[RULE-CAL-03] Ủy quyền tương tác (Detail Trigger):** 
   - Nhấn chuột trái vào Thẻ sự kiện `->` Mở Hộp thoại Chi tiết Buổi học của phân hệ quản lý tương ứng.
4. **[RULE-CAL-04] Đồng bộ tự động (Reactive UI):** 
   - Bất kỳ thay đổi nào từ Hộp thoại Chi tiết (Ví dụ: Đổi phòng thành công, Hủy buổi) -> Hệ thống phải tự động tải lại dữ liệu của chính màn hình lịch mà không cần làm mới lại toàn bộ trang.
5. **[RULE-CAL-05] Ràng buộc Không gian / Thời gian:**
   - Dữ liệu lịch luôn được lấy theo tiêu chí gốc: Chỉ thuộc Cơ sở của người dùng hiện tại và nằm trong khoảng thời gian đang xem trên màn hình.
   - Giờ hiển thị chính: 07:00 đến 22:00.

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-01] Hiệu năng (SLA):** Thời gian tải dữ liệu lịch của 1 Tháng (khoảng 2000 buổi học) phải dưới `1.5 giây`. 
- **[METRIC-02] Giới hạn hiển thị:** Ở chế độ xem Tháng, nếu một ngày có quá 5 ca học, hiển thị dạng rút gọn "Xem thêm +N ca" thay vì làm tràn ô lưới.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục Tổng thể:** Bao gồm Thanh công cụ (Chọn chế độ xem, Tìm kiếm, Lọc chi tiết) ở trên và Bảng lưới thời gian ở dưới.

### 3.1. Thanh công cụ (Toolbar)

| Thành phần | Loại hiển thị | Logic & Tham số | Ghi chú |
|------------|---------------|-----------------|---------|
| Chế độ xem | Nút chuyển đổi | Chuyển đổi Ngày / Tuần. Lưu trạng thái ghi nhớ cá nhân. | Mặc định: Tuần. |
| Chọn Trung tâm | Danh sách thả xuống | Lọc theo chi nhánh làm việc (Dành cho Quản lý vùng). | Vô hiệu hóa nếu người dùng chỉ thuộc 1 chi nhánh. |
| Bộ lọc trạng thái| Bảng trượt (Filter Panel) | Lọc theo Môn học, Trạng thái, Loại buổi học, Giáo viên. | Hỗ trợ chọn nhiều mục cùng lúc. |
| Tìm kiếm | Ô nhập văn bản | Quét Tên lớp, Tên giáo viên, Chủ đề học, Mã lớp. | Tìm kiếm ngay khi gõ (Độ trễ 300ms). |
| Nút "Hôm nay" | Nút viền | Đưa lịch về tuần/ngày hiện tại. | Nhấn mạnh trực quan nếu đang ở khoảng thời gian xa hiện tại. |

### 3.2. Bảng Lịch (Vertical List Grid)

| Thành phần | Loại hiển thị | Dữ liệu | Ghi chú |
|------------|---------------|---------|---------|
| Trục ngang (X) | Các cột ngày | Thứ 2 -> Chủ Nhật | Hiển thị tiêu đề cột gồm tên thứ và ngày. |
| Danh sách (Y) | Khối theo chiều dọc | Danh sách các sự kiện trong ngày | Tự động xếp chồng theo thứ tự thời gian. Không sử dụng lưới chia giờ dọc để tiết kiệm không gian. |

### 3.3. Thẻ Sự kiện (Event Card)

| Thành phần | Dữ liệu Hiển thị | Ghi chú Hiển thị |
|------------|------------------|-------------------|
| Mã Lớp | Chữ đậm | Ví dụ: `IELTS-A-01` |
| Khung giờ | Chữ nhỏ | Ví dụ: `18:00 - 19:30` |
| Phòng học | Chữ kèm biểu tượng Tọa độ | Ví dụ: `Phòng 101` |
| Giáo viên | Chữ kèm biểu tượng Người | Ví dụ: `GV. Nguyễn Văn A` |
| Màu nền | Màu sắc theo hệ thống | Bình thường: Xanh nhạt. Sắp tới: Xanh dương nhạt. Đã qua: Cam nhạt. Đã hủy: Xám. |

### 3.4. Thao tác trên Thẻ Lịch (Interactions)

| Tương tác | Khu vực | Kết quả mong đợi | Điều kiện / Ràng buộc |
|-----------|---------|------------------|-----------------------|
| Nhấn chuột trái| Thẻ sự kiện | Mở Hộp thoại Chi tiết Buổi học | Cấm tương tác nếu không có quyền xem thông tin. |
| Rê chuột qua | Thẻ sự kiện | Mở khối thông tin nhanh (Tooltip) | Chứa: Sĩ số hiện tại, Tên Bài học, Tiến độ. |

---

## 4. Xử lý Ngoại lệ (Corner Cases)

| # | Tình huống | Cách xử lý | Thông báo giao diện |
|---|-----------|------------|----------------|
| 4.1 | Không có lịch học | Hệ thống trả về rỗng cho khoảng thời gian đó. | Khung lưới giữ nguyên, hiển thị chữ mờ "Không có dữ liệu". |
| 4.2 | Lịch chồng chéo | Khâu vận hành xếp nhầm 2 lớp vào cùng 1 phòng cùng giờ. | Hiển thị thẻ dạng chia đôi cột dọc (mỗi thẻ 50% chiều rộng), viền thẻ màu đỏ đậm. |
| 4.3 | Lệch múi giờ máy tính | Máy tính người dùng sai giờ so với hệ thống. | Ép buộc hiển thị theo Múi giờ gốc của hệ thống, cảnh báo lỗi nếu lệch quá 1 giờ. |
| 4.4 | Lỗi kết nối mạng | Mất mạng khi đang chuyển sang tuần khác. | Giữ nguyên dữ liệu tuần cũ, hiển thị thông báo "Lỗi kết nối". |
| 4.5 | Dữ liệu bị khuyết | Lỗi hệ thống thiếu thông tin giờ kết thúc. | Dự phòng: Mặc định hiển thị thẻ có chiều cao tương đương 1.5 giờ và đánh dấu cảnh báo. |
| 4.6 | Chọn quá nhiều phòng lọc | Danh sách trên thanh công cụ quá dài. | Chuyển sang hiển thị "Đã chọn N phòng" thay vì liệt kê từng tên. |
| 4.7 | Thẻ bị khóa chốt | Lớp học đã hoàn tất tính lương/tài chính. | Thẻ màu xám, có biểu tượng Ổ khóa. Chỉ xem được, ẩn tất cả các nút sửa đổi bên trong hộp thoại. |
| 4.8 | Sự kiện vắt qua ngày mới | Lớp học kéo dài từ 22:30 đến 00:30. | Hiển thị thành 2 phần: 1 khối dừng ở 23:59 hôm nay, 1 khối bắt đầu lúc 00:00 ngày mai. |

---

## 5. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Bước kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Độ chính xác lưới dọc | Tạo thử sự kiện từ `17:15` đến `18:45`. | Khối màu nằm lệch xuống vừa đúng 1/4 vạch lưới so với gốc 17:00. |
| V-02 | Chức năng lọc Combo | Cùng lúc chọn Phòng 101 và Giáo viên A. | Chỉ những lớp thỏa mãn cả hai điều kiện mới xuất hiện. |
| V-03 | Phản hồi tự động | Bật hộp thoại, bấm "Hủy buổi", đóng hộp thoại. | Lưới tự động cập nhật thẻ đó thành màu đỏ, không cần tải lại trình duyệt. |
| V-04 | Chia tỷ lệ hiển thị | Xếp 3 lớp trùng một khoảng giờ. | 3 thẻ tự động chia làm 3 cột bằng nhau, không bị mất chữ. |

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Bố cục tổng thể | Đánh giá trực quan. | Đầy đủ thanh công cụ, bảng lưới thời gian và thanh điều hướng. |
| AC-02 | Lọc nguồn dữ liệu | Phân tích nguồn đổ vào lịch. | Hoàn toàn chỉ chứa các dữ kiện phân loại "Buổi học", tuyệt đối không lẫn tạp các sự kiện khác. |
| AC-03 | Tỷ lệ khung lưới | Đo chiều cao giao diện thực tế. | Chiều cao của khối sự kiện 1 tiếng phải đúng bằng một nửa chiều cao của sự kiện 2 tiếng. |
| AC-04 | Khối thông tin nhanh | Rê chuột qua thẻ sự kiện. | Hiển thị mượt mà bảng tóm tắt gồm Tên bài, Sĩ số, Giáo viên. |
| AC-05 | Chuyển đổi khung thời gian | Chuyển từ Tháng về Ngày. | Dữ liệu làm mới tương ứng nhanh chóng. |
| AC-06 | Đưa về thời điểm hiện tại | Từ một thời điểm tương lai bấm "Hôm nay". | Khung xem giật về đúng tuần hiện tại. |
| AC-07 | Ràng buộc bảo mật | Kéo thẻ sự kiện thả sang cột ngày khác. | Thẻ trượt về vị trí cũ, không lưu thông tin thay đổi nào. |
| AC-08 | Điều hướng chi tiết | Nhấn vào thẻ sự kiện bất kỳ. | Khởi chạy đúng hộp thoại quản lý tương ứng của hệ thống. |
| AC-09 | Phân quyền truy cập | Dùng tài khoản hạn chế quyền. | Hệ thống chặn thông báo hoặc ẩn hoàn toàn khung hiển thị. |
| AC-10 | Phản hồi tải mạng | Chuyển lịch sang thời điểm chứa dữ liệu lớn. | Có hiển thị các khung xám (Skeleton) để tạo cảm giác hệ thống đang xử lý. |
| AC-11 | Thông báo ngoại lệ | Tắt kết nối internet và thao tác. | Giao diện cảnh báo lỗi trực quan hiện lên, không gây sập trắng toàn bộ trang web. |
