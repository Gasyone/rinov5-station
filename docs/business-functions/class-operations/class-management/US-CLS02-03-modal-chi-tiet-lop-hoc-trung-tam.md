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

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** Hộp thoại lớn chiếm 90% diện tích màn hình để tối ưu hóa không gian hiển thị, chia thành 2 vùng chính: vùng chính bên trái chiếm 70% bề ngang hiển thị các phân mục thông tin; vùng phụ bên phải chiếm 30% bề ngang hiển thị ghi chú tương tác và nhật ký hoạt động.

### 3.1. Tiêu đề & Các thẻ thông tin nhanh (Header Banner)

- **Tên lớp học & Mã lớp:** Chữ đậm lớn.
- **Trạng thái lớp:** Nhãn màu chuẩn theo bảng mã màu thương hiệu (Đang học, Chờ khai giảng, Tạm nghỉ, Nháp...).
- **Nhóm thông tin nhanh (Bên trái):**
  - *Thông tin phòng học & chi nhánh*: Tên cơ sở và phòng học cố định.
  - *Chương trình học*: Cấp độ khung chương trình học và trình độ học thuật.
- **Nhóm nút hành động chính (Bên trái dưới tiêu đề):**
  - Nút **Chỉnh sửa / Lưu thay đổi / Hủy**: Bật/tắt chế độ chỉnh sửa thông tin hành chính của lớp học ở phân mục Tổng quan.
  - Nút **Kích hoạt / Quay về nháp / Tạm nghỉ / Mở lại / Đóng**: Điều phối trạng thái vận hành của lớp học.
  - **Nhãn buổi học tiếp theo:** Đặt liền kề các nút hành động, hiển thị ở dạng nhãn nhỏ nổi bật (ngày, giờ, phòng học).
- **Khối thông số nhanh (Bên phải):**
  - *Giáo viên chủ nhiệm*: Nhấp hoặc rê chuột vào để xem thông tin liên hệ chi tiết (ảnh đại diện, số điện thoại, chức vụ).
  - *Sĩ số lớp*: Hiển thị dạng phân số kết hợp (Ví dụ: `15/20 [+2]`) kèm thanh tiến độ đo sĩ số thay đổi màu theo ngưỡng cảnh báo.
  - *Lịch học cố định*: Hiển thị các thứ và ca học cố định hàng tuần.
  - *Khai giảng – Bế giảng*: Khoảng thời gian diễn ra khóa học.

### 3.2. Vùng chính bên trái (Hệ thống phân mục)

Gồm 5 phân mục thông tin chính có thể chuyển đổi linh hoạt:

#### Phân mục 1: Học viên

Quản lý danh sách học viên hiện tại của lớp:
- **Thanh lọc trạng thái con (Roster Tabs):** Hàng nút tab lọc ngay trên đầu danh sách hiển thị kèm số lượng học sinh thực tế trong ngoặc, cho phép lọc nhanh theo các bộ lọc:
  - *Tất cả (Tổng sĩ số danh sách)*
  - *Đang học*
  - *Mới ghi danh*
  - *Học thử*
  - *Bảo lưu/Chuyển*
  - *Đã nghỉ*
- **Thanh công cụ:** Nút **+ Thêm học viên** (chỉ hiển thị khi lớp chưa đóng).
- **Mạng lưới thẻ học viên (Roster Grid):** Danh sách học viên hiển thị dưới dạng các thẻ ô thông tin (card) xếp song song, mỗi thẻ bao gồm:
  - *Ảnh đại diện/Chữ viết tắt:* Đặt trong vòng tròn. Khi di chuột vào vòng tròn này, hệ thống hiển thị bảng thông tin nổi (HoverCard) chứa đầy đủ thông tin liên hệ gia đình (Họ tên phụ huynh, mối quan hệ, số điện thoại bị ẩn một phần kèm nút gọi điện nhanh và nút sao chép).
  - *Thông tin cơ bản:* Họ tên học sinh (nhấp chọn để mở hộp thoại xem thông tin học sinh chi tiết), mã số học viên, ngày học viên nhập học vào lớp.
  - *Nhãn trạng thái 2 tầng:* Nhãn trạng thái chính thức (Ghi danh, Đang học, Đã nghỉ) và nhãn hình thức tham gia (Học thử, Bảo lưu, Đã chuyển, Hết buổi, Mới) hiển thị đồng thời bên góc phải thẻ.
  - *Dòng ghi chú học viên:* Văn bản ghi chú ngắn in nghiêng hiển thị ở góc dưới thẻ (nếu có ghi chú). Nhấp vào dòng ghi chú để hiển thị bong bóng thoại (Popover) chứa đầy đủ nội dung ghi chú dài.
  - *Nút hành động nhanh:* Nút **Xóa khỏi lớp** (màu đỏ) nằm ở góc dưới bên phải thẻ, mở hộp thoại xác nhận trước khi thực hiện xóa học viên khỏi danh sách lớp.

#### Phân mục 2: Lộ trình học tập

Tra cứu cấu trúc lộ trình khóa học:
- **Thông tin giáo trình**: Hiển thị tên giáo trình hiện tại của lớp học và thông tin người cập nhật lộ trình gần nhất.
- **Nút thiết lập lộ trình**: Mở màn hình giao diện hướng dẫn thiết lập lộ trình giảng dạy mới.
- **Danh sách buổi học tuyến tính**: Hiển thị danh sách các buổi học được gom theo từng giai đoạn, mỗi buổi gồm tiêu đề bài học, mô tả nội dung, danh mục tài liệu slide bài giảng và bài tập về nhà đính kèm.

#### Phân mục 3: Buổi học thực tế

Quản lý thông tin chi tiết từng buổi học cụ thể:
- **Bộ lọc nhanh**: Lọc buổi học theo trạng thái (Tất cả, Đang học/Tiếp theo, Sắp tới, Đã học, Đổi lịch, Đã hủy).
- **Danh sách thẻ buổi học**:
  - Tiêu đề buổi học, thời gian thực tế, trạng thái buổi học.
  - Cấu hình phòng học thực tế và giáo viên giảng dạy thực tế (hiển thị rõ tên giáo viên dạy thay lẻ và phòng học thay thế lẻ nếu có).
  - Tài liệu đính kèm: slide bài giảng trực tuyến và liên kết tải tài liệu học tập.
  - Nút thay đổi nhanh: Giáo vụ có thể đổi giáo viên dạy thay, đổi phòng học lẻ hoặc tải lên slide bài giảng mới cho từng buổi học cụ thể.
  - Nút **Xem chi tiết buổi học**: Mở hộp thoại chi tiết để điểm danh và nhận xét học viên.

#### Phân mục 4: Lịch học cố định

Hiển thị và cập nhật lịch học tuần của lớp:
- Hiển thị danh sách các ca học cố định hàng tuần (thứ trong tuần, giờ bắt đầu, giờ kết thúc, phòng học cố định và nhân sự giảng dạy mặc định).
- Hỗ trợ giáo vụ cập nhật lại lịch học tuần cố định của toàn bộ lớp học.

#### Phân mục 5: Tổng quan

Chứa thông tin hành chính tĩnh và động của lớp:
- **Thông tin xem chi tiết**: hiển thị chi nhánh, giáo viên chủ nhiệm, trợ giảng chỉ định, phòng học cố định, ngày khai giảng, ngày bế giảng dự kiến, môn học, trình độ học thuật.
- **Chế độ chỉnh sửa**: Hỗ trợ thay đổi tên lớp, mã lớp, lựa chọn khung chương trình học, sĩ số tối đa, loại giáo viên chủ nhiệm, trợ giảng chỉ định, phòng học cố định, ngày bắt đầu và kết thúc của lớp.

### 3.3. Vùng phụ bên phải (Tương tác & Nhật ký)

Chia làm 2 tab con có hiển thị tổng số đếm ở tiêu đề tab:
- **Tab Tương tác (X):**
  - Danh sách các ghi chú tương tác nội bộ của giáo vụ được xếp dọc (nội dung ghi chú, họ tên người viết, thời gian).
  - Mỗi ghi chú có ảnh đại diện người viết. Khi di chuột vào tên người viết sẽ hiển thị bảng thông tin nổi (HoverCard) chứa thông tin nhân sự và số điện thoại liên hệ nhanh.
  - Định dạng thời gian hiển thị là thời gian tương đối so với hiện tại (Ví dụ: "Hôm qua", "3 ngày trước", "1 tuần trước").
  - Khung nhập văn bản ghi chú nhanh ở dưới cùng với nút gửi hình máy bay giấy nằm gọn gàng góc dưới bên phải khung nhập.
- **Tab Nhật ký (Y):**
  - Dòng thời gian hiển thị lịch sử hoạt động chi tiết của lớp học (thời gian tuyệt đối, tên hành động hành vi, người thực hiện thao tác).

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
