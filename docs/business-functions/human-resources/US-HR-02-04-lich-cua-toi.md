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
**tôi muốn** xem toàn bộ lịch làm việc cá nhân của mình được tổng hợp từ tất cả các hệ thống (Lịch dạy Lớp học, Lịch coi thi, Lịch Học thử, Lịch họp nội bộ, Lịch nghỉ phép),
**để** biết chính xác các công việc và khung thời gian mình đã được phân bổ trong ngày/tuần, từ đó chủ động sắp xếp công việc cá nhân, đảm bảo đúng giờ và chuẩn bị kỹ lưỡng cho công việc của bản thân.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai hiển thị hoàn toàn độc lập với các bảng nghiệp vụ nhân sự.
> - [x] **N**egotiable — Giao diện hỗ trợ linh hoạt 3 góc nhìn: Lưới thời gian, Danh sách công việc, Tuyến thời gian.
> - [x] **V**aluable — Cực kỳ giá trị với Nhân sự di chuyển qua nhiều chi nhánh.
> - [x] **E**stimable — Rõ ràng về yêu cầu thu thập dữ liệu đa nguồn.
> - [x] **S**mall — Phạm vi gói gọn trong việc hiển thị dữ liệu của một tài khoản hiện tại.
> - [x] **T**estable — Đi kèm đầy đủ tiêu chí xác thực.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-MYCAL-01] Mô hình Tập trung cá nhân (Super Consumer):** 
   - Dữ liệu trả về bắt buộc lấy theo điều kiện truy vấn là mã Nhân sự đăng nhập hiện tại.
   - Bắt buộc phải kết nối tới tất cả nguồn: Xếp lịch lớp, Lịch thi, Họp nội bộ, Phiếu báo nghỉ cá nhân.
2. **[RULE-MYCAL-02] Đa Chi nhánh (Cross-Branch Aggregation):**
   - Lịch cá nhân MẶC ĐỊNH phải gộp công việc từ tất cả cơ sở mà nhân sự đó được điều động.
   - BẮT BUỘC hiển thị rõ Tên Cơ sở vật lý trên từng thẻ lịch để nhân sự không đi nhầm địa điểm.
3. **[RULE-MYCAL-03] Chế độ Chỉ đọc (Read-only):**
   - Tuyệt đối không cho sửa trực tiếp thời gian, địa điểm trên lưới này.
   - Mọi nhu cầu thay đổi (xin nghỉ, đến muộn) phải sử dụng tính năng liên kết để mở Biểu mẫu xử lý chuyên dụng.
4. **[RULE-MYCAL-04] Tương tác:**
   - Các hành động mở chi tiết sự kiện được thực hiện bằng chuột trái (Click).

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-01] Thời gian Hợp nhất:** Hệ thống máy chủ phải tổng hợp dữ liệu từ mọi nguồn phân tán trong vòng dưới `1.0 giây`.
- **[METRIC-02] Tối ưu hóa trên thiết bị nhỏ:** Màn hình này phần lớn xem trên điện thoại, bắt buộc kích hoạt giao diện dạng Danh sách (Agenda) cho thiết bị nhỏ.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục Tổng thể:** Bảng điều khiển công việc cá nhân.

### 3.1. Thanh công cụ (Toolbar)

| Thành phần | Loại hiển thị | Logic & Tham số | Ghi chú |
|------------|---------------|-----------------|---------|
| Chế độ xem | Điều hướng khối | Chuyển Ngày / Tuần / Lịch trình | Trên Điện thoại, mặc định ghim ở dạng Lịch trình. |
| Tìm kiếm nhanh | Ô nhập văn bản | Tìm tên lớp, loại sự kiện | Tự động làm sáng kết quả khớp ngay trên lịch. |
| Báo bận/Xin nghỉ | Nút tiện ích | Mở nhanh quy trình nộp đơn | Liên kết trực tiếp tới phân hệ Nhân sự. |
| Tùy chỉnh hiển thị | Nút bảng trượt | Cấu hình lọc theo nguồn | |

### 3.2. Bảng lọc nâng cao (Slide Panel)

| Thành phần | Loại hiển thị | Dữ liệu | Ghi chú |
|------------|---------------|---------|---------|
| Nguồn sự kiện | Hộp kiểm (Checkbox) | Cho phép ẩn bớt: Họp, Dạy, Trực thi... | |
| Khu vực | Chọn nhiều mục | Lọc công việc theo từng cụm chi nhánh | |

### 3.3. Bảng Lịch (Schedule Time Grid / Agenda)

| Thành phần | Loại hiển thị | Trường Dữ liệu | Ghi chú |
|----------|---------------|----------------|---------|
| Trục thời gian | Cột giờ / Headers ngày | 07:00 -> 22:00 | Khung giờ làm việc chung. |
| Thẻ thông tin cá nhân | Khối vuông bo góc | Giờ, Tên Công việc, Loại, **Tên Cơ sở**, Vai trò | Thông tin cơ sở vật lý phải in đậm rõ ràng. |

### 3.4. Thao tác trên Thẻ Lịch (Card)

| Thao tác | Hành động | Kết quả mong đợi | Điều kiện |
|----------|----------|------------------|-----------|
| Nhấn chuột trái| Bấm vào khối lịch | Bật thẻ chi tiết tóm tắt | Hiện các nút thao tác hỗ trợ nhanh. |

---

## 4. Xử lý Ngoại lệ (Corner Cases)

| # | Tình huống | Cách xử lý | Thông báo giao diện |
|---|-----------|------------|----------------|
| 4.1 | Tuần trống việc | Nhân sự không có giờ phân công. | Hiển thị màn hình đồ họa thân thiện: "Tuần này bạn chưa có lịch làm việc!". |
| 4.2 | Đụng lịch vật lý | Khâu vận hành xếp nhầm giờ 2 cơ sở cách xa nhau. | Bật tín hiệu chớp nháy viền đỏ cực mạnh: "Cảnh báo trùng lịch phân công!". |
| 4.3 | Đổi múi giờ | Nhân sự di chuyển qua múi giờ khác. | Cưỡng ép hiện theo múi giờ trung tâm tại Việt Nam nhằm tránh sự cố nhầm giờ lên lớp. |
| 4.4 | Thiết bị mất kết nối | Đang xem thì đứt cáp mạng. | Cung cấp thông báo lỗi kết nối nhưng vẫn giữ nguyên hình ảnh lịch để nhân sự tra cứu tạm thời. |
| 4.5 | Đóng/Mở lại ứng dụng | Tắt tab trình duyệt. | Lưu lại các tùy chọn lọc của người dùng vào bộ nhớ trình duyệt nhằm tối ưu trải nghiệm. |

---

## 5. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Kiểm tra tích hợp đa luồng | Trộn dữ liệu Lớp, Thi, và Xin nghỉ. | Giao diện xếp đúng thẻ màu xanh cho việc, dải màu xám chặn cho ngày nghỉ. |
| V-02 | Tối ưu hiển thị dọc | Mở tính năng mô phỏng thiết bị di động. | Bảng lưới thời gian sập thành dạng danh sách có thể cuộn ngón tay dễ dàng. |
| V-03 | Lưu trữ cá nhân | Đổi các thiết lập, sau đó làm mới trang. | Thông tin giữ y hệt trạng thái trước đó. |

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Tính toàn vẹn của dữ liệu | So sánh với dữ liệu trích xuất từ tất cả các luồng. | Chứa đúng và đủ toàn bộ lịch có gắn mã của nhân sự đó. |
| AC-02 | Khả năng nhìn xuyên chi nhánh | Đưa vào hai lịch làm ở hai nơi khác nhau. | Hiển thị rõ tên từng cơ sở in đậm ngay trên tiêu đề thẻ. |
| AC-03 | Tính độc lập thành phần | Đánh giá mã nguồn tổng thể. | Màn hình hoàn toàn sạch, không chứa các cơ chế trực tiếp lưu dữ liệu. |
| AC-04 | Rào chắn nghỉ phép | Có đơn xin nghỉ thành công. | Tại vùng giờ đó bị phủ mờ kèm chữ "Nghỉ phép", ngăn việc hiểu nhầm là lịch rảnh. |
| AC-05 | Tùy chỉnh luồng dữ liệu | Tắt chức năng xem lịch họp. | Mọi khung thời gian dùng cho họp tự động rút lui khỏi màn hình. |
| AC-06 | Đổi cấu trúc di động | Co nhỏ cửa sổ làm việc xuống màn hình hẹp. | Cơ chế vẽ lịch thay đổi hoàn toàn sang cấu trúc hiển thị dọc ưu việt. |
| AC-07 | Cảnh báo an toàn | Đưa lịch bị đụng khung giờ vào. | Thẻ màu đỏ gắt kèm biểu tượng tam giác cảnh báo rõ nét. |
| AC-08 | Menu tương tác nhanh | Chuột phải vào bất kỳ phần lịch nào. | Mở các hành động nhanh như Xin dạy thay hay Viết báo cáo. |
| AC-09 | Mở tóm tắt thẻ | Bấm chọn sự kiện bằng chuột trái. | Hiện một bảng tóm gọn cung cấp cái nhìn nhanh không cần tải trang mới. |
| AC-10 | Ràng buộc vật lý | Mô phỏng múi giờ quốc tế. | Màn hình không bị trôi lệch thẻ do đổi múi giờ. |
| AC-11 | Liên kết nghiệp vụ rẽ nhánh | Bấm chọn khai báo bận rộn. | Rời khỏi màn hình này để sang quy trình của phân hệ chuyên biệt. |
| AC-12 | Cơ chế chống lỗi mạng | Ngắt kết nối mạng bất ngờ. | Cơ chế lưu trữ offline giúp giao diện không bị đổ vỡ hoàn toàn. |
