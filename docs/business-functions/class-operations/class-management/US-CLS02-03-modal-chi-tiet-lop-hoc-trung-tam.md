---
id: US-CLS02-03
title: "Hộp thoại Chi tiết Lớp học Trung tâm"
bf: BF-CLS-02
domain: CAP-OPS
status: standardized
tags: [class, detail-modal, roster, learning-path, logs]
---

# US-CLS02-03: Hộp thoại Chi tiết Lớp học Trung tâm

> **Tham chiếu:** BF-CLS-02 (Quản lý Lớp học) · Tiêu chuẩn Thiết kế §4.3 (Trang chi tiết)
> **Đường dẫn màn hình & Trạng thái liên quan:**
> - Hộp thoại xem chi tiết mở ra khi bấm vào tên lớp học hoặc dòng tương ứng tại màn hình danh sách lớp học.
> - Trạng thái áp dụng của lớp học: Nháp, Chờ khai giảng, Đang học, Tạm nghỉ, Đã kết thúc.

---

## 1. Yêu cầu Người dùng (User Story)

**Là một** Nhân viên Giáo vụ hoặc Quản lý chi nhánh,  
**tôi muốn** xem chi tiết một lớp học dưới dạng hộp thoại lớn, hiển thị đầy đủ thông tin hành chính, danh sách học viên, lộ trình bài giảng và lịch sử hoạt động tương tác,  
**để** nắm bắt chính xác hiện trạng lớp học, hỗ trợ phụ huynh kịp thời và thực hiện các nghiệp vụ thay đổi vận hành nhanh chóng.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập dưới dạng hộp thoại tích hợp gọn gàng trong phân hệ quản lý lớp.
> - [x] **N**egotiable — Chi tiết cấu trúc các phân mục và cách hiển thị ghi chú có thể tinh chỉnh thêm.
> - [x] **V**aluable — Giúp giáo vụ vận hành lớp học nhanh chóng, tối ưu hóa thời gian xử lý sự cố buổi học.
> - [x] **E**stimable — Đã phân định rõ ranh giới các phân mục và hành động trên thanh tiêu đề.
> - [x] **S**mall — Hoàn thành trong một vòng phát triển tập trung.
> - [x] **T**estable — Có các tiêu chí nghiệm thu rõ ràng tại Mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-CLS-03-01] Trực quan hóa trạng thái học viên 2 tầng:** Mỗi học viên trong danh sách lớp được biểu diễn qua hai nhóm nhãn độc lập:
   - **Trạng thái chính thức trên hệ thống:**
     - *Ghi danh*: Học viên mới đăng ký đóng phí, hiển thị nhãn màu xanh dương.
     - *Đang học*: Học viên đang học tập bình thường, hiển thị nhãn màu xanh lá.
     - *Đã nghỉ*: Học viên đã dừng học hoàn toàn tại trung tâm, hiển thị nhãn màu đỏ.
   - **Hình thức tham gia lớp học:**
     - *Học thử*: Nhãn phụ màu tím thể hiện học viên học trải nghiệm.
     - *Bảo lưu*: Nhãn phụ màu tím thể hiện học viên đang tạm dừng lớp học này.
     - *Đã chuyển*: Nhãn phụ màu xám thể hiện học viên đã chuyển sang lớp học khác.
     - *Hết buổi*: Nhãn phụ màu xám thể hiện học viên đã học hết số buổi đăng ký.
     - *Mới*: Nhãn phụ màu xanh dương thể hiện học viên mới được xếp vào danh sách lớp.

2. **[RULE-CLS-03-02] Thông tin lịch học và nhân sự theo buổi:** Mỗi buổi học thực tế ghi nhận riêng biệt thông tin giảng dạy thực tế bao gồm phòng học, giáo viên phụ trách chính, trợ giảng và giáo viên dạy thay (nếu có). Nghiêm cấm việc mặc định dùng cấu hình cố định của lớp khi xảy ra sự cố đổi phòng học lẻ hoặc dạy thay lẻ ở buổi đó.

3. **[RULE-CLS-03-03] Lộ trình học tập tuyến tính:** Lộ trình bài học của lớp được tổ chức tuần tự theo từng buổi học:
   - Mỗi buổi hiển thị tiêu đề bài học, mô tả ngắn nội dung bài học.
   - Trạng thái buổi học được phân loại rõ ràng: Đã học, Đang học, Chờ diễn ra, Đổi lịch, Đã hủy.

4. **[RULE-CLS-03-04] Nhật ký hoạt động tương tác:** Mọi hành động tác động đến lớp (như thay đổi trạng thái lớp, thêm hoặc xóa học viên khỏi danh sách, phân công giáo viên dạy thay lẻ, đổi phòng học lẻ, hoặc ghi chú nội bộ) đều được hệ thống tự động ghi nhận thành nhật ký thời gian thực gắn kèm tên người thực hiện.

5. **[RULE-CLS-03-05] Thẻ thông tin nhanh tại tiêu đề:** Phần đầu hộp thoại tích hợp các thông tin tóm tắt để giáo vụ nhận diện nhanh:
   - Sĩ số lớp: Hiển thị dưới dạng chỉ số kết hợp (Ví dụ: `15/20 [+2]` học viên), trong đó `15` là sĩ số chính thức đang học, `20` là sĩ số tối đa của lớp, và phần `[+2]` thể hiện số lượng học viên đang học thử (nếu có). Đi kèm theo đó là một thanh đo tiến độ để biểu thị trực quan tỷ lệ lấp đầy.
   - Lịch học cố định (Ví dụ: "Thứ Hai & Thứ Năm").
   - Thời gian khai giảng – Bế giảng của cả khóa học.
   - Buổi học tiếp theo: Hiển thị ở dạng nhãn tròn nổi bật (ngày, giờ, phòng học thực tế) đặt kế bên thanh nút hành động.

6. **[RULE-CLS-03-06] Quy tắc chuyển trạng thái lớp học (Vòng đời lớp học):**
   - Lớp ở trạng thái **Nháp**: hỗ trợ nút **Kích hoạt** (chuyển sang Chờ khai giảng) và nút **Đóng** (chuyển sang Đã kết thúc).
   - Lớp ở trạng thái **Chờ khai giảng**: hỗ trợ nút **Quay về nháp** (quay lại Nháp) và nút **Đóng** (chuyển sang Đã kết thúc).
   - Lớp ở trạng thái **Đang học**: hỗ trợ nút **Tạm nghỉ** (chuyển sang Tạm nghỉ) và nút **Đóng** (chuyển sang Đã kết thúc).
   - Lớp ở trạng thái **Tạm nghỉ**: hỗ trợ nút **Mở lại** (chuyển sang Đang học) và nút **Đóng** (chuyển sang Đã kết thúc).
   - *Ràng buộc:* Nút **Đóng** chỉ sáng và cho phép bấm khi sĩ số học viên thực tế của lớp bằng 0 (khi danh sách trống học viên). Nếu lớp đang hoạt động mà giáo vụ xóa học viên cuối cùng, hệ thống tự động chuyển trạng thái lớp sang **Đã kết thúc** (trạng thái lưu trữ: `huy`).
   - *Ánh xạ trạng thái:* Trạng thái "Mở chiêu sinh" tại cơ sở dữ liệu sẽ tự động được hệ thống ánh xạ hiển thị như trạng thái "Chờ khai giảng" trên giao diện để đảm bảo tính đồng bộ với vòng đời chuẩn.

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-CLS-03-01] Sĩ số cảnh báo:**
  - Ngưỡng cảnh báo cao (Màu đỏ): Khi sĩ số học viên thực tế đạt từ 90% định mức tối đa của lớp trở lên, chỉ số sĩ số và thanh tiến độ chuyển sang màu đỏ để giáo vụ hạn chế xếp thêm học viên mới.
  - Ngưỡng cảnh báo trung bình (Màu vàng/cam): Khi sĩ số học viên đạt từ 70% đến 89% định mức tối đa của lớp, chỉ số sĩ số hiển thị màu vàng/cam để cảnh báo lớp sắp đầy.
- **[METRIC-CLS-03-02] Số lượng ghi chú & nhật ký:** Tải mặc định tối đa 20 dòng ghi chú tương tác và nhật ký hoạt động mới nhất, sắp xếp mới nhất hiển thị trên cùng.

### 2.2. Ranh giới Nghiệp vụ & Luồng tương tác (Interactive Scope)

Hộp thoại chi tiết lớp học đóng vai trò là một bảng điều khiển tích hợp trung tâm. Một số luồng tương tác nghiệp vụ được xử lý trực tiếp tại giao diện của hộp thoại, trong khi một số khác sẽ kích hoạt các hộp thoại nổi/phân hệ chuyên biệt ngoài ranh giới:

#### 1. Các luồng tương tác trực tiếp trên Hộp thoại (In Scope):
- **Điều phối trạng thái lớp:** Bấm thay đổi trạng thái (Kích hoạt, Quay về nháp, Tạm nghỉ, Mở lại, Đóng lớp) trực tiếp trên thanh tiêu đề.
- **Chỉnh sửa thông tin hành chính tĩnh:** Bấm nút "Chỉnh sửa" trên thanh tiêu đề để mở chế độ chỉnh sửa thông tin tại phân mục Tổng quan (Tên lớp, Giáo viên chủ nhiệm mặc định, Trợ giảng mặc định, Phòng học cố định, Ngày bắt đầu/ngày kết thúc dự kiến).
- **Quản lý danh sách học viên (Xóa khỏi danh sách):** Nhấp chọn "Xóa khỏi lớp" trực tiếp tại thẻ học sinh (Roster Card), kích hoạt hộp thoại xác nhận và cập nhật sĩ số.
- **Cập nhật lịch học tuần cố định:** Thực hiện cập nhật lịch cố định trực tiếp tại phân mục Lịch học cố định.
- **Điều phối buổi học lẻ (Buổi học thực tế):** Chỉ định giáo viên dạy thay lẻ, đổi phòng lẻ cho từng buổi, và tải lên giáo án/slide bài giảng thực tế cho buổi học đó.
- **Ghi nhận ghi chú phản hồi:** Nhập nội dung và gửi ghi chú tương tác nội bộ tại thanh ghi chép bên phải.

#### 2. Các luồng tương tác chuyển tiếp bên ngoài (Out of Scope):
- **Thêm học viên mới vào lớp:** Bấm "+ Thêm học viên" tại phân mục Học viên sẽ kích hoạt một Hộp thoại nổi chọn học sinh xếp lớp (đặc tả tại US-CLS02-05). Luồng tìm kiếm và chọn học viên nằm ở hộp thoại đó.
- **Thiết lập lộ trình bài giảng gốc:** Bấm "Thiết lập lộ trình" tại phân mục Lộ trình học tập sẽ chuyển đổi giao diện sang Wizard hướng dẫn thiết lập lộ trình giảng dạy mới (đặc tả tại US-CLS02-04).
- **Điểm danh chuyên cần và nhận xét chi tiết buổi học:** Bấm "Xem chi tiết buổi học" tại phân mục Buổi học thực tế sẽ kích hoạt một Hộp thoại chi tiết buổi học độc lập để chấm điểm chuyên cần/nhận xét (thuộc phân hệ ghi nhận kết quả học tập).
- **Các nghiệp vụ đóng học phí, bảo lưu tài chính học phí:** Do phân hệ kế toán và chăm sóc khách hàng quản lý bên ngoài.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** Hộp thoại lớn chiếm 90% diện tích màn hình để tối ưu hóa không gian hiển thị, chia thành 2 vùng chính: vùng chính bên trái chiếm 70% bề ngang hiển thị các phân mục thông tin; vùng phụ bên phải chiếm 30% bề ngang hiển thị ghi chú tương tác và nhật ký hoạt động.

### 3.1. Tiêu đề & Các thẻ thông tin nhanh (Header Banner)

#### Bảng 3.1a: Các nút hành động trên tiêu đề
| Nút | Loại hiển thị | Logic chuyển trạng thái / Xử lý | Điều kiện hiển thị / Ràng buộc |
|---|---|---|---|
| Chỉnh sửa | Nút màu trung tính (kèm biểu tượng bút chì) | Chuyển đổi phân mục Tổng quan sang chế độ chỉnh sửa thông tin. | Chỉ hiển thị khi lớp chưa đóng và không ở chế độ chỉnh sửa. |
| Kích hoạt | Nút màu nhấn (kèm biểu tượng chơi/phát) | Đổi trạng thái lớp học sang 'Chờ khai giảng'. | Chỉ hiển thị khi lớp học ở trạng thái 'Nháp'. |
| Quay về nháp | Nút màu trung tính (kèm biểu tượng quay lại) | Đổi trạng thái lớp học trở lại 'Nháp'. | Chỉ hiển thị khi lớp học ở trạng thái 'Chờ khai giảng' (Yêu cầu xác nhận qua hộp thoại). |
| Tạm nghỉ | Nút màu cảnh báo (kèm biểu tượng tạm dừng) | Đổi trạng thái lớp học sang 'Tạm nghỉ'. | Chỉ hiển thị khi lớp học ở trạng thái 'Đang học' (Yêu cầu xác nhận qua hộp thoại). |
| Mở lại | Nút màu nhấn (kèm biểu tượng chơi/phát) | Đổi trạng thái lớp học trở lại 'Đang học'. | Chỉ hiển thị khi lớp học ở trạng thái 'Tạm nghỉ'. |
| Đóng | Nút màu đỏ (destructive) | Đổi trạng thái lớp học sang 'Đã kết thúc'. | Hiển thị khi lớp chưa đóng. **Bị khóa (disabled)** nếu sĩ số roster thực tế lớn hơn 0. Yêu cầu xác nhận qua hộp thoại. |
| Lưu thay đổi | Nút màu nhấn | Lưu các chỉnh sửa tại phân mục Tổng quan và tắt chế độ chỉnh sửa. | Chỉ hiển thị khi đang ở chế độ chỉnh sửa thông tin. |
| Hủy | Nút màu trung tính | Hủy bỏ các chỉnh sửa tại phân mục Tổng quan và tắt chế độ chỉnh sửa. | Chỉ hiển thị khi đang ở chế độ chỉnh sửa thông tin. |

#### Bảng 3.1b: Thông tin nhanh trên tiêu đề
| Thông tin hiển thị | Loại hiển thị | Trường dữ liệu liên kết | Ghi chú & Logic vận hành |
|---|---|---|---|
| Tên lớp học | Chữ đậm kích thước lớn | Tên lớp | |
| Mã lớp học | Nhãn viền (Badge) chữ đơn cách | Mã lớp | |
| Trạng thái lớp | Nhãn màu chuẩn (Status Badge) | Trạng thái lớp | Hiển thị màu chuẩn: Nháp (Xám), Chờ khai giảng (Tím), Đang học (Xanh lá), Tạm nghỉ (Vàng cam). |
| Thông tin địa điểm | Biểu tượng bản đồ + Văn bản | Chi nhánh & Phòng học cố định | Ví dụ: "RinoEdu Nguyễn Tuân - Phòng: A102" |
| Khung chương trình | Biểu tượng sách + Văn bản | Cấp độ & Trình độ học thuật | Ví dụ: "Chương trình: Beginner - Trình độ: A1" |
| Giáo viên chủ nhiệm | Ảnh đại diện viết tắt + Tên giáo viên | Giáo viên chủ nhiệm | Rê chuột vào ảnh đại diện/tên hiển thị bảng nổi chi tiết nhân sự (Personnel Hover Card) để xem số điện thoại và gọi/sao chép. |
| Sĩ số roster | Số / Số [+Số học thử] kèm thanh đo tiến độ | Sĩ số thực tế / Sĩ số tối đa | Định dạng: `X/Y [+Z]`. Thanh tiến độ tự động đổi màu: Đỏ (>=90%), Vàng/Cam (70% - 89%), Đen/Xanh thông thường (<70%). |
| Lịch học cố định | Danh sách các thứ và ca học | Lịch học cố định | Tổng hợp từ các ca học cố định trong tuần của lớp. |
| Khai giảng - Bế giảng | Khoảng ngày tháng | Ngày bắt đầu - Ngày kết thúc dự kiến | |
| Nhãn buổi học tiếp theo | Nhãn pill badge viền xanh dương | Buổi học kế tiếp | Hiển thị ngày học, ca học và phòng học thực tế của buổi học tiếp theo. |

### 3.2. Vùng chính bên trái (Hệ thống phân mục)

Gồm 5 phân mục thông tin chính có thể chuyển đổi linh hoạt:

#### Bảng 3.2a: Phân mục Học viên
| Thành phần | Loại hiển thị | Trường dữ liệu / Nút | Logic tương tác & Nghiệp vụ |
|---|---|---|---|
| Thanh lọc trạng thái con | Hàng nút tab lọc con (FilterChipGroup) | Trạng thái học viên trong lớp | Cho phép lọc nhanh danh sách học sinh kèm số lượng đếm động trong ngoặc: Tất cả (X), Đang học (Y), Mới ghi danh (Z), Học thử (A), Bảo lưu/Chuyển (B), Đã nghỉ (C). |
| Thêm học viên | Nút màu trung tính (kèm dấu cộng) | Nút "+ Thêm học viên" | Nằm bên phải thanh lọc. Nhấp chọn sẽ kích hoạt hộp thoại nổi chọn học sinh xếp lớp (US-CLS02-05). Ẩn đi khi lớp đã đóng. |
| Mạng lưới thẻ học viên | Lưới thẻ 2 cột (Grid) | Danh sách học viên thuộc bộ lọc | Hiển thị danh sách học viên dạng các thẻ (card) song song. Thẻ của học sinh bảo lưu, chuyển lớp, đã nghỉ sẽ bị mờ đi nhẹ (mờ 30%). |
| Ảnh đại diện học viên | Vòng tròn chữ viết tắt tên học sinh | Chữ cái đầu của tên | Nằm bên trái thẻ. Di chuột vào vòng tròn này sẽ hiển thị bảng nổi (HoverCard) chứa thông tin phụ huynh và số điện thoại phụ huynh (che một phần) kèm nút gọi nhanh và nút sao chép. |
| Tên học sinh | Liên kết chữ đậm | Họ và tên học sinh | Nhấp chuột vào tên học sinh sẽ mở hộp thoại xem chi tiết thông tin học sinh (Student SIS). |
| Mã học sinh | Chữ nhỏ mờ | Mã số học viên | |
| Nhãn trạng thái 2 tầng | Các nhãn màu chuẩn (Badges) | Trạng thái chính thức & Hình thức tham gia | Nhãn chính thức: Ghi danh (Xanh dương), Đang học (Xanh lá), Đã nghỉ (Đỏ). Nhãn hình thức: Học thử (Tím), Bảo lưu (Tím), Đã chuyển (Xám), Hết buổi (Xám), Mới (Xanh dương). |
| Ngày nhập học | Biểu tượng lịch + Văn bản | Ngày nhập học vào lớp | Định dạng: "Nhập học: DD/MM/YYYY" |
| Ghi chú học sinh | Biểu tượng ghi chú + Chữ nghiêng mờ | Nội dung ghi chú học viên | Hiển thị tóm tắt ghi chú ở chân thẻ. Nhấp chọn vào dòng này để mở popover bong bóng thoại chứa đầy đủ nội dung ghi chú dài. |
| Xóa khỏi lớp | Liên kết chữ màu đỏ (destructive) | Nút "Xóa khỏi lớp" | Chỉ hiển thị khi lớp chưa đóng và thẻ không bị mờ. Bấm chọn sẽ kích hoạt hộp thoại xác nhận hủy bỏ. Nếu xóa học viên cuối cùng của lớp Đang học, hệ thống tự động đổi trạng thái lớp sang Đã kết thúc và ghi nhật ký hoạt động. |

#### Bảng 3.2b: Phân mục Lộ trình học tập
| Thành phần | Loại hiển thị | Trường dữ liệu / Nút | Logic tương tác & Nghiệp vụ |
|---|---|---|---|
| Khung giáo trình | Tiêu đề văn bản | Tên giáo trình / Lộ trình | Hiển thị tên giáo trình gán cho lớp học. Hiển thị thông báo hướng dẫn thiết lập lộ trình nếu chưa được gán. |
| Người cập nhật cuối | Văn bản chữ mờ | Lịch sử cập nhật lộ trình | Hiển thị thời gian và người thay đổi lộ trình gần nhất (Ví dụ: "Lộ trình được thay đổi vào..."). |
| Thiết lập/Đổi lộ trình | Nút màu trung tính | Nút "Thiết lập lộ trình" | Nhấp chọn để mở bảng hướng dẫn thiết lập lộ trình giảng dạy mới (Roadmap Wizard) để điều chỉnh giáo trình áp dụng cho lớp. |
| Buổi học lý thuyết tuyến tính | Dòng thời gian bài học | Danh sách bài giảng | Hiển thị danh sách tuyến tính bài giảng theo thứ tự buổi học gồm tiêu đề bài giảng, mô tả ngắn nội dung bài học, liên kết slide bài giảng và bài tập về nhà đính kèm. |

#### Bảng 3.2c: Phân mục Buổi học thực tế
| Thành phần | Loại hiển thị | Trường dữ liệu / Nút | Logic tương tác & Nghiệp vụ |
|---|---|---|---|
| Bộ lọc trạng thái buổi | Hàng nút lọc nhanh | Trạng thái buổi học | Lọc danh sách buổi học thực tế (Tất cả, Đang học/Tiếp theo, Sắp tới, Đã học, Đổi lịch, Đã hủy). |
| Thẻ buổi học thực tế | Khung danh sách dọc | Thông tin buổi học thực tế | Hiển thị 5 buổi học đang vận hành lấy lên từ hệ thống. Mỗi buổi học gồm số thứ tự buổi, thời gian học thực tế, phòng học thực tế, giáo viên giảng dạy thực tế. |
| Chỉ thị thay thế lẻ | Chữ gạch ngang + Nhãn nổi bật | Giáo viên dạy thay, Phòng thay thế lẻ | Khi có thay đổi đột xuất lẻ cho buổi học: phòng học hoặc giáo viên mặc định bị gạch ngang mờ đi, hiển thị thay thế lẻ mới kèm theo ghi chú dạng cover (Ví dụ: "Dạng Cover: COVER 1A"). |
| Tài liệu đính kèm | Các liên kết | Slide bài giảng, file bài tập | Cho phép tải lên giáo án mới hoặc tải về các tài liệu học tập của buổi học lẻ đó. |
| Thay đổi đột xuất | Các nút tác vụ nhanh | Gán dạy thay lẻ, Đổi phòng lẻ, Upload tài liệu | Giáo vụ có thể đổi nhanh giáo viên dạy thay hoặc phòng học lẻ cho buổi đó. Mỗi thay đổi lẻ đều được gửi về hệ thống ngoài đồng bộ và tự động ghi log vào Nhật ký hoạt động. |
| Điểm danh và nhận xét | Nút màu nhấn | Nút "Xem chi tiết buổi học" | Nhấp chọn để mở hộp thoại điểm danh chuyên cần chi tiết và nhận xét học viên cho buổi học thực tế tương ứng. |

#### Bảng 3.2d: Phân mục Lịch học cố định
| Thành phần | Loại hiển thị | Trường dữ liệu / Nút | Logic tương tác & Nghiệp vụ |
|---|---|---|---|
| Danh sách ca học tuần | Danh sách thông tin | Ngày trong tuần, Ca học, Phòng mặc định, Giáo viên | Hiển thị chi tiết ca học cố định lặp lại hàng tuần của lớp, kèm theo phòng mặc định và giáo viên phụ trách mặc định. |
| Cập nhật lịch cố định | Nút màu trung tính | Nút "Cập nhật lịch học cố định" | Nhấp chọn để thực hiện điều chỉnh ca học cố định hàng tuần. Hệ thống kiểm tra trùng lịch phòng học (chặn tuyệt đối nếu trùng lịch lớp khác) và nhân sự (hiển thị thông tin trùng ca màu đỏ nhưng cho phép tự quyết định gán). |

#### Bảng 3.2e: Phân mục Tổng quan
| Thành phần | Loại hiển thị | Trường dữ liệu | Logic tương tác & Nghiệp vụ |
|---|---|---|---|
| Chi nhánh cơ sở | Chỉ xem / Ô chọn | Chi nhánh quản lý lớp | Chỉ xem ở chế độ thông thường. Chế độ chỉnh sửa cho phép chọn chi nhánh thuộc quyền quản lý. |
| Giáo viên chủ nhiệm | Chỉ xem / Ô chọn nhân sự | Giáo viên chủ nhiệm chính | Chế độ chỉnh sửa cho phép chọn và gán lại giáo viên chủ nhiệm. |
| Trợ giảng chỉ định | Chỉ xem / Ô chọn nhân sự | Trợ giảng của lớp | Chế độ chỉnh sửa cho phép gán hoặc đổi trợ giảng. |
| Phòng học cố định | Chỉ xem / Ô chọn phòng học | Phòng học mặc định | Chế độ chỉnh sửa cho phép gán phòng học cố định (bắt buộc thuộc chi nhánh quản lý lớp). |
| Thời gian khóa học | Chỉ xem / Ô chọn ngày | Ngày khai giảng, ngày bế giảng dự kiến | Chế độ chỉnh sửa cho phép cập nhật khoảng thời gian khóa học. |
| Môn học & Trình độ | Chỉ xem / Ô chọn danh mục | Môn học, Trình độ chính, phụ | Kế thừa trực tiếp từ danh mục hệ thống. |
| Sĩ số tối đa | Chỉ xem / Ô chọn tỷ lệ | Sĩ số tối đa | Thay đổi sĩ số tối đa thông qua tỷ lệ Giáo viên:Học viên khi chỉnh sửa thông tin. |

### 3.3. Vùng phụ bên phải (Tương tác & Nhật ký)

#### Bảng 3.3c: Vùng phụ bên phải (Tương tác & Nhật ký)
| Tab con | Thành phần | Loại hiển thị | Trường dữ liệu / Logic tương tác |
|---|---|---|---|
| Tương tác (X) | Danh sách tương tác | Khung dọc cuộn | Hiển thị các ghi chú tương tác nội bộ sắp xếp mới nhất ở trên cùng. |
| | Avatar & Người viết | Ảnh đại diện viết tắt + Tên giáo vụ | Rê chuột vào tên người viết ghi chú sẽ mở ra HoverCard chi tiết thông tin nhân sự giáo vụ để gọi điện nhanh hoặc sao chép thông tin. |
| | Thời gian tương tác | Chữ nhỏ mờ | Hiển thị mốc thời gian đã trôi qua ở dạng tương đối (Ví dụ: "Hôm qua", "2 ngày trước", "1 tuần trước"). |
| | Nội dung tương tác | Văn bản thông thường | Hiển thị nội dung ghi chú nội bộ phản hồi của lớp học. |
| | Khung nhập ghi chú | Ô nhập văn bản (Textarea) | Khung nhập văn bản ở dưới cùng để giáo vụ gõ ghi chú mới nhanh. |
| | Nút gửi ghi chú | Nút biểu tượng (SendHorizontal) | Nằm gọn ở góc dưới bên phải khung nhập văn bản. Nhấp chọn sẽ gửi ghi chú: lập tức tải ghi chú lên đầu danh sách và tự động ghi thêm log lịch sử sang tab Nhật ký hoạt động. |
| Nhật ký (Y) | Dòng thời gian lịch sử | Trục dọc timeline | Trục dọc hiển thị lịch sử biến động tự động ghi nhận theo thời gian thực (Mới nhất trên cùng). |
| | Mốc thời gian | Chữ nhỏ font đơn | Hiển thị thời gian tuyệt đối xảy ra hành động (Giờ:Phút Ngày/Tháng/Năm). |
| | Mô tả hành động | Chữ đậm | Mô tả cụ thể hành động (Ví dụ: "Đã xóa học viên...", "Thay đổi phòng học lẻ...", "Kích hoạt lớp học..."). |
| | Người thực hiện | Chữ nhỏ mờ | Tên người thực hiện hành động (Ví dụ: "Giáo vụ Lan" hoặc "Hệ thống"). |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Giao diện
- Hộp thoại chi tiết lớp học chiếm phần lớn không gian màn hình để tối ưu hóa không gian hiển thị cho danh sách học viên và lộ trình bài học.
- Thanh bên phải chứa phần ghi chú tương tác và nhật ký hoạt động có thể chuyển đổi dễ dàng bằng tab, giúp giáo vụ ghi chép nhanh thông tin phản hồi của lớp học mà không phải đóng màn hình xem.

### 4.2. Luồng Hoạt động (Workflow)
1. **Mở xem chi tiết**: Người dùng bấm vào tên lớp tại danh sách lớp học. Hộp thoại chi tiết lớn mở ra, mặc định hiển thị phân mục **Học viên**.
2. **Kiểm tra thông số nhanh**: Giáo vụ nhìn lướt qua phần tiêu đề hộp thoại để nắm bắt ngay sĩ số hiện tại, lịch học tuần cố định và thông tin buổi học sắp tới mà không cần nhấp chuột chọn tab.
3. **Thay đổi trạng thái lớp**: Trên thanh tiêu đề, giáo vụ bấm các nút hành động (ví dụ: bấm nút **Kích hoạt** để chuyển lớp nháp sang chờ khai giảng). Hệ thống hiển thị hộp thoại xác nhận đối với các thao tác nguy hiểm (Quay về nháp, Đóng lớp). Sau khi xác nhận thành công, trạng thái lớp cập nhật lại trên tiêu đề và hệ thống tự động ghi nhận một bản ghi lịch sử vào tab Nhật ký hoạt động.
4. **Xem thông tin liên hệ nhanh**: Giáo vụ di chuột qua ảnh đại diện của giáo viên chủ nhiệm ở góc phải tiêu đề hoặc avatar của học sinh để hiển thị thông tin số điện thoại của giáo viên/phụ huynh. Giáo vụ có thể gọi nhanh hoặc sao chép số điện thoại mà không cần phải truy cập vào trang chi tiết cá nhân.
5. **Viết ghi chú tương tác**: Giáo vụ chuyển sang tab **Tương tác** ở vùng bên phải, nhập nội dung phản hồi nội bộ và bấm gửi. Ghi chú mới lập tức xuất hiện ở trên cùng danh sách, đồng thời hệ thống tự động ghi nhận một dòng log lịch sử sang tab Nhật ký.
6. **Xóa học sinh khỏi roster**: Giáo vụ bấm nút "Xóa khỏi lớp" tại thẻ học viên, hệ thống yêu cầu xác nhận. Sau khi xác nhận, sĩ số lớp giảm đi. Nếu lớp đang học và đây là học viên cuối cùng bị xóa, hệ thống sẽ tự động đổi trạng thái lớp sang "Đã kết thúc".

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|---|----------------------------------|----------------------|----------------------|
| 5.1 | Lớp học chưa được gán Khung chương trình | Phân mục "Lộ trình học tập" hiển thị thông báo trống hướng dẫn giáo vụ nhấn nút "Thiết lập lộ trình" để chọn chương trình đào tạo áp dụng. | Trạng thái trống |
| 5.2 | Buổi học có giáo viên dạy thay hoặc đổi phòng lẻ | Tại dòng thời gian lộ trình và thẻ buổi học thực tế, tên giáo viên hoặc phòng học mặc định sẽ bị gạch ngang mờ đi, và hiển thị nổi bật tên giáo viên dạy thay lẻ/phòng học mới kèm theo biểu tượng cảnh báo thay đổi. | Hiển thị thay thế lẻ |
| 5.3 | Học viên trong danh sách có trạng thái bảo lưu hoặc chuyển lớp | Thẻ học viên tương ứng bị mờ đi nhẹ, nhãn hiển thị rõ trạng thái "Bảo lưu" hoặc "Đã chuyển", đồng thời loại trừ học viên này khỏi tổng sĩ số đang học thực tế của lớp để tránh tính toán sai lệch sĩ số vận hành. | Loại trừ sĩ số vận hành |
| 5.4 | Xóa học viên cuối cùng khỏi danh sách khi lớp đang ở trạng thái Đang học | Hệ thống thực hiện xóa học viên khỏi danh sách chính thức, đồng thời tự động chuyển trạng thái của lớp học sang "Đã kết thúc" và ghi nhận hành động đóng lớp tự động vào nhật ký hệ thống. | Tự động chuyển trạng thái lớp |
| 5.5 | Thao tác nguy hiểm trên giao diện (Đóng lớp, Xóa học viên khỏi danh sách) | Bắt buộc phải hiển thị một hộp thoại xác nhận (ConfirmDialog) yêu cầu giáo vụ bấm đồng ý trước khi thực thi nhằm tránh thao tác nhầm lẫn. | Kiểm soát thao tác |
| 5.6 | Ánh xạ trạng thái đặc thù (Mở chiêu sinh) | Khi lớp có trạng thái là "Mở chiêu sinh" tại cơ sở dữ liệu, giao diện modal chi tiết tự động ánh xạ hiển thị thành trạng thái "Chờ khai giảng" với các nút hành động tương đương để đơn giản hóa giao diện. | Đồng bộ hóa dữ liệu |
| 5.7 | Thêm học viên mới làm sĩ số vượt quá định mức tối đa | Khi giáo vụ thêm học viên dẫn đến sĩ số thực tế gần đầy hoặc quá định mức (đạt từ 90% trở lên), số đếm sĩ số ở góc phải sẽ chuyển sang màu đỏ và thanh tiến độ cảnh báo đỏ để hạn chế gán thêm học viên mới. | Cảnh báo trực quan |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Bố cục 2 vùng chuẩn):** Hộp thoại hiển thị đúng tỷ lệ thiết kế (phân mục thông tin chính 70% bên trái / ghi chú tương tác và nhật ký 30% bên phải), co giãn linh hoạt và hiển thị đầy đủ thông tin.
- **AC-2 (Thanh tiêu đề thông minh):** Tiêu đề hiển thị chính xác tên lớp, mã lớp, nhãn màu trạng thái chuẩn, hiển thị thông tin buổi học sắp tới dạng pill badge nổi bật cạnh nút hành động, và 3 nhóm thông tin nhanh sĩ số, giáo viên, lịch học.
- **AC-3 (Định dạng sĩ số kết hợp):** Chỉ số sĩ số hiển thị đúng định dạng `X/Y [+Z]` (ví dụ: `15/20 [+2]`), trong đó Z là số lượng học thử. Thanh tiến độ thay đổi màu sắc chuẩn xác theo các ngưỡng sĩ số cảnh báo (đỏ nếu đạt >=90%, vàng/cam nếu đạt >=70% đến 89%).
- **AC-4 (Đồng bộ nút hành động và vòng đời):** Các nút điều phối trạng thái lớp hiển thị và hoạt động đúng theo quy tắc nghiệp vụ quy định tại Mục 2.6. Nút Đóng lớp bị vô hiệu hóa nếu sĩ số roster thực tế lớn hơn 0.
- **AC-5 (Danh sách học viên dạng Grid Thẻ):** Danh sách học viên hiển thị dưới dạng card grid (không phải bảng dòng). Có đầy đủ hàng nút tab lọc trạng thái con hiển thị kèm số lượng đếm động tương ứng cho từng trạng thái.
- **AC-6 (Màn hình Hover liên hệ nhanh):**
  - Rê chuột vào Avatar viết tắt của học viên hiển thị bảng nổi HoverCard chứa thông tin liên hệ gia đình (tên phụ huynh, mối quan hệ, số điện thoại có dấu ẩn, nút gọi và nút sao chép hoạt động tốt).
  - Rê chuột vào tên giáo viên chủ nhiệm ở góc tiêu đề hiển thị HoverCard thông tin giáo viên.
- **AC-7 (Bong bóng ghi chú học viên):** Học viên có ghi chú hiển thị dòng văn bản nghiêng ngắn kèm icon ghi chú màu cam ở cuối thẻ; nhấp chuột vào dòng này phải bật Popover hiển thị đầy đủ nội dung ghi chú.
- **AC-8 (Xác nhận xóa học viên):** Nút "Xóa khỏi lớp" trên thẻ học sinh hiển thị đúng hộp thoại xác nhận hủy bỏ trước khi tiến hành xóa thực tế.
- **AC-9 (Tab Tương tác và Nhật ký hoạt động):**
  - Tiêu đề tab Tương tác và tab Nhật ký hiển thị chính xác số lượng ghi chú/nhật ký hiện có trong ngoặc.
  - Danh sách tương tác hiển thị thời gian ở dạng tương đối (ví dụ: "Hôm qua", "2 ngày trước").
  - Rê chuột vào tên người viết ghi chú phải bật HoverCard thông tin nhân sự.
  - Khung nhập ghi chú tương tác có nút gửi máy bay giấy nằm gọn gàng bên trong góc dưới bên phải; viết ghi chú mới và gửi thành công phải nạp tức thì ghi chú lên đầu danh sách và tự động ghi thêm một dòng log lịch sử sang tab Nhật ký.
