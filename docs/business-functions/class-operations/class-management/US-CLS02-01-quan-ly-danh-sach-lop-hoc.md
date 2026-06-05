---
id: US-CLS02-01
title: "Quản lý danh sách Lớp học"
type: "User Story"
domain: "CAP-OPS"
bf: BF-CLS-02
status: "Draft"
tags: [class, list]
---

# US-CLS02-01: Quản lý danh sách Lớp học

> **Tham chiếu:** BF-CLS-02 · Tiêu chuẩn Thiết kế §4.2 (Màn hình danh sách)
> **Đường dẫn màn hình & Trạng thái liên quan:**
> - `/app/classes` (Mặc định) -> Trạng thái: `Tất cả`
> - `/app/classes` (Tab Nháp) -> Trạng thái: `Nháp`
> - `/app/classes` (Tab Chờ khai giảng) -> Trạng thái: `Chờ khai giảng`
> - `/app/classes` (Tab Đang học) -> Trạng thái: `Đang học`
> - `/app/classes` (Tab Tạm nghỉ) -> Trạng thái: `Tạm nghỉ`
> - `/app/classes` (Tab Đã kết thúc) -> Trạng thái: `Đã kết thúc`

## 1. Yêu cầu Người dùng (User Story)
**Là một** Nhân viên Giáo vụ hoặc Quản lý chi nhánh,  
**tôi muốn** xem danh sách tất cả các lớp học trong hệ thống dưới dạng bảng lưới thông tin rộng, lọc theo chi nhánh/trạng thái và mở bảng trượt lọc nâng cao đa tiêu chí,  
**để** quản lý tổng quan sĩ số, giáo viên đứng lớp, lịch học và dễ dàng thực hiện nhanh các tác vụ vận hành lớp.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Thiết kế hiển thị danh sách độc lập với luồng điểm danh và xếp lịch chi tiết.
> - [x] **N**egotiable — Các tiêu chí bộ lọc và cột hiển thị trên bảng có thể điều chỉnh theo phản hồi.
> - [x] **V**aluable — Giúp giáo vụ theo dõi bao quát và truy cập nhanh vào từng lớp học cụ thể.
> - [x] **E**stimable — Đã phân tách rõ cấu trúc bảng và các bộ lọc nghiệp vụ.
> - [x] **S**mall — Hoàn thành trong một vòng phát triển tập trung.
> - [x] **T**estable — Có tiêu chí nghiệm thu rõ ràng tại Mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-CLS-01-01] Quản lý quyền hiển thị danh sách lớp:** 
   - Giáo viên chỉ nhìn thấy danh sách các lớp học mà mình được phân công giảng dạy hoặc làm chủ nhiệm.
   - Quản trị viên, Quản lý chi nhánh và Nhân viên Giáo vụ được phép xem toàn bộ danh sách lớp học thuộc cơ sở mình quản lý hoặc toàn hệ thống.
2. **[RULE-CLS-01-02] Tìm kiếm nhanh đa tiêu chí:** Hệ thống cho phép nhập từ khóa tìm kiếm tự do (không phân biệt chữ hoa chữ thường) quét theo các thông tin: Tên lớp, Mã lớp, Giáo viên phụ trách.
3. **[RULE-CLS-01-03] Lọc nâng cao dạng bảng trượt:** Cung cấp bảng điều khiển trượt từ bên phải chứa 10 nhóm tiêu chí lọc (cơ sở chi nhánh, trình độ học, giáo viên, phòng học, môn học, chương trình đào tạo, thứ trong tuần, ca học sáng/chiều/tối, trạng thái lớp, khoảng thời gian khai giảng) cùng tính năng tìm kiếm lớp theo thông tin học viên (tên, số điện thoại, mã số).
4. **[RULE-CLS-01-04] Cảnh báo sĩ số theo tỷ lệ:** Chỉ số sĩ số lớp được tính toán phần trăm theo sĩ số thực tế trên sĩ số tối đa. Khi lớp đạt từ 70% sĩ số trở lên sẽ đổi màu cam cảnh báo, và đạt từ 90% trở lên sẽ đổi màu đỏ cảnh báo.
5. **[RULE-CLS-01-05] Phân công dạy thay:** Cột giáo viên hiển thị tên giáo viên chủ nhiệm. Nếu buổi học thực tế ghi nhận giáo viên dạy thay, hệ thống hiển thị kèm tên giáo viên dạy thay và ngày dạy tương ứng dưới dạng danh sách xếp chồng.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-CLS-01-01] Định mức phân trang:** Danh sách hiển thị mặc định 20 dòng dữ liệu trên một trang. Giáo vụ có thể chọn thay đổi số lượng dòng hiển thị giữa các mức 20, 50, hoặc 100 dòng trên một trang.
- **[METRIC-CLS-01-02] Thời lượng tải trang:** Đảm bảo nạp dữ liệu danh sách mượt mà với thời gian phản hồi dưới 1 giây.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ phía trên
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Lọc nhanh Chi nhánh | Danh sách chọn thả xuống | Lọc danh sách lớp theo cơ sở đã chọn. | Mặc định hiển thị "Tất cả các chi nhánh". |
| Ô tìm kiếm | Ô nhập chữ | Nhập từ khóa để lọc theo tên lớp, mã lớp, giáo viên. | Gợi ý hiển thị: "Tìm tên lớp, mã lớp, giáo viên...". |
| Nút Lọc nâng cao | Nút biểu tượng | Kích hoạt bảng trượt lọc nâng cao bên phải. | Hiển thị số lượng bộ lọc đang áp dụng. |
| Nút Tạo lớp | Nút màu nổi bật | Mở hộp thoại biểu mẫu tạo mới lớp học. | Chỉ hiển thị với vai trò Giáo vụ và Quản lý. |

### 3.2. Khối đếm Trạng thái (Status Tiles)
Nằm ngay dưới thanh công cụ, hiển thị tổng số đếm lớp cho từng trạng thái:
| Ô trạng thái | Nhóm màu hiển thị | Ý nghĩa nghiệp vụ | Ghi chú |
|--------------|-------------------|-------------------|---------|
| Tất cả | Trung tính | Hiển thị tổng số lớp không phân biệt trạng thái. | Tự động cập nhật số đếm theo chi nhánh chọn. |
| Chờ khai giảng | Xanh dương | Lớp đã cấu hình xong lịch và học viên, đang chờ ngày học đầu tiên. | Có số đếm động. |
| Đang học | Xanh lá | Lớp đang trong quá trình học tập thực tế. | Có số đếm động. |
| Tạm nghỉ | Cam/Hổ phách | Lớp tạm thời dừng dạy vì lý do khách quan. | Có số đếm động. |
| Đã kết thúc | Xám | Lớp đã hoàn thành lộ trình hoặc bị hủy bỏ giữa chừng. | Có số đếm động. |

### 3.3. Bảng danh sách chính (Data Table)
Bảng có tổng cộng 11 cột thông tin, cho phép cuộn ngang trên màn hình nhỏ. Cột Hộp chọn và Cột Lớp học được cố định (sticky) ở lề trái khi cuộn.

| Cột hiển thị | Loại hiển thị | Trường Dữ liệu | Ghi chú |
|--------------|---------------|----------------|---------|
| Hộp chọn | Checkbox | Chọn dòng | Nằm ngoài cùng bên trái, dùng để tích chọn đa dòng. |
| Lớp học | Chữ in đậm kèm liên kết | Tên lớp & Mã lớp | Sticky bên trái. Rê chuột vào hiển thị thanh tác vụ nhanh trên dòng. |
| Chương trình | Văn bản | Tên chương trình học | Hiển thị lộ trình học tập tóm tắt ở dưới. |
| Khung chương trình | Văn bản | Tên giáo trình đã gán | Hiển thị "Chưa gán" chữ nghiêng nếu trống. |
| Trình độ | Văn bản | Cấp độ lớp | Hiển thị trình độ chính và trình độ phụ. |
| Giáo viên | Ô danh sách xếp chồng | Giáo viên phụ trách | Hiển thị giáo viên chủ nhiệm và danh sách giáo viên dạy thay. |
| Sĩ số | Số / Số (Phần trăm) | Sĩ số thực tế/tối đa | Chữ màu đen bình thường, màu vàng/cam (nếu >=70%), màu đỏ (nếu >=90%). |
| Lịch học | Văn bản tóm tắt | Các ca học tuần | Tổng hợp các ngày học và khung giờ cố định trong tuần. |
| Buổi học tiếp theo | Văn bản | Chi tiết buổi kế tiếp | Hiển thị ngày, giờ, chủ đề và nhãn trạng thái buổi học (sắp tới, đang học). |
| Cơ sở / Phòng | Văn bản | Tên chi nhánh & Phòng | Hiển thị cơ sở quản lý và phòng học cố định. |
| Trạng thái | Nhãn màu | Trạng thái hiện tại | Badge màu chuẩn tương ứng với trạng thái lớp. |
| Thời gian | Ngày tháng | Ngày bắt đầu & kết thúc | Định dạng ngày/tháng/năm của thời gian khóa học. |

### 3.4. Thanh tác vụ nhanh trên dòng (Hiển thị khi rê chuột)
Khi giáo vụ di chuột vào khu vực cột Lớp học, một thanh nút hành động nhỏ xuất hiện phía bên phải tên lớp học để thao tác nhanh:
| Nút tác vụ | Biểu tượng | Logic xử lý |
|------------|------------|-------------|
| Xem chi tiết | Con mắt | Mở hộp thoại chi tiết lớp học (chế độ xem). |
| Chỉnh sửa | Bút chì | Mở hộp thoại chi tiết lớp học chuyển thẳng sang tab Tổng quan ở chế độ chỉnh sửa. |
| Đổi lộ trình | Ngôi sao lấp lánh | Mở hộp thoại chi tiết lớp chuyển thẳng sang tab Lộ trình ở chế độ cấu hình. |
| Thêm học viên | Người kèm dấu cộng | Mở hộp thoại chi tiết lớp chuyển thẳng sang tab Học viên ở chế độ thêm học viên. |

### 3.5. Bảng lọc nâng cao (Bảng trượt bên phải)
| Nhóm tiêu chí | Loại điều khiển | Diễn giải lọc | Ghi chú |
|---------------|----------------|---------------|---------|
| Tìm theo học viên | Ô nhập chữ | Tìm theo họ tên, số điện thoại, hoặc mã học viên. | Tìm các lớp học mà học viên đó có trong danh sách. |
| Chi nhánh | Danh sách tích chọn | Lọc các lớp thuộc các chi nhánh được chọn. | Cho phép đa chọn. |
| Trình độ | Danh sách tích chọn | Lọc theo cấp độ lớp học. | |
| Giáo viên | Danh sách tích chọn | Lọc lớp do giáo viên phụ trách. | |
| Phòng học | Danh sách tích chọn | Lọc lớp học tại các phòng được chỉ định. | |
| Thứ trong tuần | Danh sách tích chọn | Lọc lớp có ngày học rơi vào các thứ được tích chọn. | |
| Ca học | Danh sách tích chọn | Lọc theo Ca Sáng, Ca Chiều, Ca Tối. | |
| Trạng thái | Danh sách tích chọn | Lọc theo trạng thái lớp học. | |
| Khai giảng | Danh sách tích chọn | Khai giảng tháng này, tháng sau, đã khai giảng. | |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
- Tiêu đề trang in đậm ở góc trái, bên phải là ô tìm kiếm co giãn thông minh, nút lọc nâng cao dạng phễu và nút "Tạo lớp" màu nhấn nổi bật.
- Ngay dưới thanh công cụ là hàng ô trạng thái (Status Tiles) hiển thị tổng số lượng lớp và phân nhóm theo màu nghiệp vụ.
- Bảng danh sách chính chiếm trọn diện tích bên dưới. Bảng có chiều rộng lớn nên hệ thống hỗ trợ cuộn ngang mượt mà, riêng hai cột đầu (Hộp chọn và thông tin Lớp học) được thiết kế cố định sát lề trái, đảm bảo giáo vụ luôn nhìn thấy lớp học nào đang được thao tác dù cuộn đến tận cột cuối cùng.
- Khi rê chuột vào dòng lớp học, các nút chức năng nhanh (Xem chi tiết, Sửa, Lộ trình, Thêm học viên) xuất hiện tinh gọn bên cạnh tên lớp.

### 4.2. Luồng Hoạt động (Workflow)
1. Giáo vụ truy cập `/app/classes`. Hệ thống tải danh sách lớp thuộc chi nhánh hiện tại của giáo vụ.
2. Để tìm lớp của giáo viên "Nguyễn Văn A" đang dạy phòng "101", giáo vụ bấm phễu Lọc nâng cao. Bảng trượt mở ra từ bên phải. Giáo vụ tích chọn giáo viên "Nguyễn Văn A" ở nhóm Giáo viên và tích chọn phòng "101" ở nhóm Phòng học. 
3. Giáo vụ có thể nhập thêm tên phụ huynh hoặc học sinh vào ô "Tìm theo học viên" trong bảng trượt để kiểm tra xem con em họ học lớp nào. Danh sách bảng chính lập tức lọc động hiển thị kết quả khớp.
4. Giáo vụ muốn cập nhật nhanh học sinh mới cho lớp "IELTS 1", thay vì phải click vào xem chi tiết rồi chuyển tab, giáo vụ chỉ cần rê chuột vào tên lớp trên bảng và bấm nút **Thêm học viên** (biểu tượng người kèm dấu cộng) trên thanh hành động nhanh xuất hiện. Hệ thống sẽ mở thẳng hộp thoại chi tiết lớp tại tab Học viên và tự động mở luôn hộp thoại gán học viên.

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|---|----------------------------------|---------------------|----------------------|
| 5.1 | Hệ thống chưa có dữ liệu lớp học nào | Hiển thị màn hình trống với thông điệp hướng dẫn rõ ràng kèm theo nút bấm kích hoạt tạo lớp học mới ngay giữa trang. | Áp dụng thiết kế màn hình trống chuẩn |
| 5.2 | Tìm kiếm hoặc lọc không trả về kết quả | Hiển thị bảng trống kèm thông báo không tìm thấy kết quả phù hợp và gợi ý người dùng thử xóa các bộ lọc hiện tại. | Trạng thái tìm kiếm trống |
| 5.3 | Lỗi tải dữ liệu hoặc mất kết nối mạng | Chặn hiển thị bảng và xuất hiện thông báo cảnh báo lỗi kết nối kèm nút bấm để người dùng thử tải lại trang. | Áp dụng thiết kế lỗi kết nối chuẩn |
| 5.4 | Quyền truy cập của Giáo viên | Tài khoản giáo viên đăng nhập sẽ không thấy nút "Tạo lớp", không thấy nút "Xóa lớp" và danh sách lớp tự động lọc chỉ hiển thị các lớp giáo viên đó đang dạy hoặc chủ nhiệm. | Phân quyền vai trò |
| 5.5 | Cuộn ngang trên màn hình nhỏ/máy tính bảng | Cột Hộp chọn và cột Lớp học bắt buộc phải giữ nguyên vị trí cố định (sticky) bên trái để không bị che khuất tên lớp khi giáo vụ cuộn sang xem phòng học hoặc thời gian ở các cột bên phải. | Thiết kế đáp ứng |
| 5.6 | Sĩ số đạt ngưỡng quá tải | Sĩ số hiển thị tỷ lệ (Ví dụ: 19/20). Khi tỷ lệ đạt từ 70% chữ sẽ chuyển sang màu cam, và đạt từ 90% chữ và số phần trăm sẽ chuyển sang màu đỏ đậm để cảnh báo giáo vụ ngưng xếp học sinh. | Cảnh báo trực quan |
| 5.7 | Lớp chưa được gán Khung chương trình | Cột Khung chương trình sẽ hiển thị dòng chữ *"Chưa gán"* in nghiêng màu xám để nhắc nhở giáo vụ cần gán chương trình học để sinh ca học thực tế. | Trạng thái thiếu thông tin |
| 5.8 | Lớp có giáo viên dạy thay đột xuất | Cột giáo viên hiển thị tên giáo viên chủ nhiệm, bên dưới hiển thị tên giáo viên dạy thay được gạch chân kèm nhãn đỏ để giáo vụ nhận biết nhanh buổi học hôm đó ai dạy. | Điều phối nhân sự |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Bố cục danh sách và ô trạng thái):** Giao diện hiển thị đúng cấu trúc: Thanh công cụ → Ô trạng thái đếm số lượng lớp theo chi nhánh → Bảng lưới rộng 11 cột → Thanh phân trang.
- **AC-2 (Cố định cột bên trái):** Khi cuộn ngang bảng danh sách lớp học, cột Checkbox chọn dòng và cột tên Lớp học phải đứng yên tại lề trái, các cột còn lại cuộn bình thường.
- **AC-3 (Thanh tác vụ nhanh xuất hiện trên dòng):** Rê chuột vào tên lớp học bất kỳ trên bảng phải hiển thị đúng thanh nút tác vụ nhanh (Xem chi tiết, Sửa, Lộ trình, Thêm học viên) và click hoạt động chính xác.
- **AC-4 (Phân quyền vai trò Giáo viên):** Kiểm thử với tài khoản Giáo viên phải đảm bảo ẩn nút Tạo lớp, không hiển thị tác vụ xóa và danh sách lớp chỉ nạp dữ liệu lớp giáo viên đó phụ trách.
- **AC-5 (Màu sắc sĩ số cảnh báo):** Kiểm tra hiển thị sĩ số: lớp dưới 70% hiển thị màu đen thông thường; lớp từ 70% đến 89% hiển thị màu vàng/cam; lớp từ 90% trở lên hiển thị màu đỏ.
- **AC-6 (Bảng lọc trượt nâng cao 10 nhóm):** Bấm phễu lọc phải mở ra bảng trượt từ bên phải chứa đầy đủ 10 nhóm bộ lọc, và nhập tên học viên vào ô tìm kiếm học viên phải lọc ra đúng lớp học viên đó tham gia.
- **AC-7 (Phân trang và giới hạn dòng):** Thanh phân trang hoạt động ổn định, thay đổi số lượng dòng hiển thị (20, 50, 100) phải cập nhật lại số dòng hiển thị trên bảng chính xác.
