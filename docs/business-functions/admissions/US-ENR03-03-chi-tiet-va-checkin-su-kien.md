---
id: US-ENR03-03
title: "Quản lý Khách mời, Điểm danh và Lịch trình Sự kiện"
bf: BF-ENR-03
domain: CAP-ADM
status: draft
tags: [enrollment, event, detail, checkin, agenda]
---

# US-ENR03-03: Quản lý Khách mời, Điểm danh và Lịch trình Sự kiện

> **Tham chiếu:** BF-ENR-03 · Giao diện Mẫu §4.3 (Trang chi tiết)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Nhân viên Tư vấn tuyển sinh hoặc Người tổ chức sự kiện, **tôi muốn** xem thông tin chi tiết sự kiện, quản lý danh sách khách mời, thực hiện điểm danh (Check-in) nhanh chóng và xem lịch trình sự kiện (Agenda), **để** kiểm soát lưu lượng khách tham gia thực tế, ghi nhận kết quả và cập nhật tương tác của khách hàng vào hệ thống chăm sóc khách hàng tập trung.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai trang chi tiết độc lập, liên kết từ trang danh sách sự kiện thông qua mã sự kiện.
> - [x] **N**egotiable — Cấu trúc các tab hiển thị có thể thay đổi số lượng hoặc gộp tab tùy thuộc độ phức tạp của sự kiện.
> - [x] **V**aluable — Giúp điểm danh khách mời nhanh chóng tại quầy đón tiếp sự kiện và đồng bộ tức thì nhật ký tương tác của khách hàng.
> - [x] **E**stimable — Dễ dàng ước lượng dựa trên thiết kế trang chi tiết chuẩn phân chia theo các thẻ nội dung.
> - [x] **S**mall — Hoàn thành gọn gàng trong 1 đợt phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu rõ ràng ở mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-EVT-DET-01] Quy tắc điểm danh kép (Phụ huynh & Học sinh):**
   - Khi gia đình đến check-in, hệ thống cho phép điểm danh độc lập cho **Phụ huynh** (người tham gia hội thảo/tư vấn tuyển sinh) và **Học sinh đi kèm** (con trẻ tham gia các trạm học thử, trải nghiệm công nghệ).
   - Điểm danh Phụ huynh hoặc Học sinh sẽ tự động đánh dấu trạng thái gia đình là "Đã tham dự". Nếu cả hai chưa được tích chọn điểm danh, trạng thái sẽ là "Chờ check-in".
2. **[RULE-EVT-DET-02] Tự động cập nhật chỉ số:** Khi nhân viên tiếp đón tích chọn điểm danh cho phụ huynh hoặc con trẻ, các chỉ số tóm tắt phía trên bao gồm *Số phụ huynh tham dự*, *Số con tham gia học thử*, và *Tỷ lệ tham dự* sẽ tự động cập nhật số liệu hiển thị tức thì.
3. **[RULE-EVT-DET-03] Đồng bộ Nhật ký CRM:** Khi khách hàng được điểm danh, hệ thống tự động lưu trữ nhật ký tham gia sự kiện tương ứng trong thông tin hồ sơ của khách hàng để phục vụ việc chăm sóc và giới thiệu khóa học sau này của các chuyên viên tư vấn.
4. **[RULE-EVT-DET-04] Xếp lớp Trạm trải nghiệm học thử:** Khi thêm mới khách mời tại quầy (khách vãng lai), lễ tân có thể đính kèm thông tin của học sinh (Tên con, Tuổi con) và chỉ định cụ thể **Trạm trải nghiệm học thử** (như Lắp ráp Robotics, Toán tư duy Archimedes, Tiếng Anh công nghệ) để chuẩn bị học cụ và giáo viên hỗ trợ kịp thời.
5. **[RULE-EVT-DET-05] Xử lý quá tải (Waitlist):** Nếu khách đăng ký vượt quá sức chứa tối đa của sự kiện, hệ thống tự động chuyển khách mới vào "Danh sách chờ" để bộ phận quản trị xem xét duyệt vé hoặc chuyển sang sự kiện sau.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-01] Tải danh sách khách mời:** Hệ thống phải hỗ trợ tìm kiếm nhanh tại chỗ và lọc danh sách hàng trăm khách đăng ký trong thời gian dưới 1 giây để tránh ùn tắc ở quầy tiếp đón.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục trang:** Thiết kế chia làm hai cột (Cột bên trái chiếm 30% chiều rộng hiển thị tóm tắt thông tin sự kiện; Cột bên phải chiếm 70% chứa các tab nội dung chi tiết: Danh sách khách mời & Điểm danh, Lịch trình sự kiện - Agenda). Trên thiết bị di động, hai cột này sẽ tự động xếp chồng dọc mượt mà.

### 3.1. Tiêu đề trang & Nút thao tác nhanh (Page Header)
| Nút thao tác | Loại hiển thị | Logic chuyển đổi | Điều kiện hiển thị |
|--------------|---------------|------------------|-------------------|
| Quay lại | Nút viền nhạt con chữ | Quay trở lại danh sách sự kiện | Luôn hiển thị |
| Bắt đầu Sự kiện | Nút màu xanh dương | Đổi trạng thái sự kiện sang "Đang diễn ra" | Khi sự kiện ở trạng thái Mở đăng ký và đến giờ tổ chức |
| Kết thúc Sự kiện | Nút màu xanh ngọc | Đổi trạng thái sự kiện sang "Đã kết thúc" | Khi sự kiện ở trạng thái Đang diễn ra |
| Hủy sự kiện | Nút màu đỏ cảnh báo | Mở hộp thoại xác nhận hủy bỏ sự kiện | Khi sự kiện chưa kết thúc |

### 3.2. Cột bên trái — Tóm tắt Sự kiện (Chỉ xem)
Hiển thị một khối thông tin dọc (Panel) bao gồm:
- **Tên sự kiện:** Chữ đậm lớn nổi bật.
- **Trạng thái sự kiện:** Nhãn màu chuẩn (Nháp, Mở đăng ký, Đang diễn ra, Đã kết thúc, Đã hủy).
- **Mã sự kiện:** Chữ nhỏ dạng mã ngắn.
- **Các thông tin cơ bản:** Chi nhánh, thời gian tổ chức, thời gian kết thúc, địa điểm cụ thể, người phụ trách, mô tả ngắn.

### 3.3. Cột bên phải — Các tab nội dung chi tiết

#### Tab 1: Danh sách Khách mời & Điểm danh (Guest List & Check-in)
Chứa các phần thông tin và công cụ thao tác sau:
- **Khối chỉ số đón tiếp (Metric Tiles):** Ba thẻ nhỏ hiển thị các số liệu:
  - *Phụ huynh tham dự*: Số phụ huynh đã được điểm danh vào nghe hội thảo.
  - *Con trải nghiệm học thử*: Số lượng trẻ đi cùng đã được điểm danh vào phòng trải nghiệm.
  - *Tỷ lệ tham dự*: Phần trăm gia đình tham dự trên tổng số đăng ký thành công.
- **Thanh công cụ danh sách:**
  - *Ô tìm kiếm*: Tìm kiếm khách mời theo tên phụ huynh hoặc số điện thoại đăng ký.
  - *Lọc nhanh trạng thái vé*: Tất cả trạng thái, Chờ check-in, Đã tham dự, Danh sách chờ, Đã hủy.
  - *Nút "Thêm khách mời"*: Mở hộp thoại để tìm phụ huynh trên CRM hoặc thêm trực tiếp phụ huynh vãng lai kèm học sinh đi cùng và trạm học thử đăng ký.
- **Bảng danh sách khách mời chính:**
  - *Cột Phụ huynh*: Tên phụ huynh, địa chỉ thư điện tử nếu có.
  - *Cột Học sinh đi kèm*: Tên con, tuổi con và Trạm học thử đăng ký (như Robotics, Toán, Tiếng Anh). Nếu không có con đi cùng, hiển thị trống.
  - *Cột Số điện thoại*: Số điện thoại đăng ký của phụ huynh.
  - *Cột Điểm danh Phụ huynh*: Nút tích chọn điểm danh Bố/Mẹ tham gia hội thảo (hiển thị giờ đến cụ thể sau khi tích chọn).
  - *Cột Điểm danh Học sinh*: Nút tích chọn điểm danh Con vào phòng trải nghiệm (hiển thị giờ đến cụ thể sau khi tích chọn).
  - *Cột Thao tác nhanh (Rê chuột vào dòng)*:
    - Nút **"Hủy vé"**: Mở hộp thoại xác nhận hủy bỏ đăng ký tham gia sự kiện của gia đình.

#### Tab 2: Lịch trình Sự kiện (Agenda)
Hiển thị dòng thời gian (Timeline) các hoạt động diễn ra trong sự kiện:
- **Mỗi hoạt động gồm:** Khung giờ diễn ra (VD: 09:00 - 09:30), Tên hoạt động (VD: Đón khách & Teabreak), Diễn giả/Người phụ trách hoạt động, Nội dung tóm tắt.
- **Tính năng chỉnh sửa lịch trình:** Hỗ trợ hiển thị danh sách hoạt động rõ ràng giúp ban tổ chức bám sát thời gian thực tế.

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
Trang chi tiết được bố trí khoa học giúp người dùng dễ dàng bao quát toàn bộ thông tin sự kiện trong nháy mắt. 
Cột trái đóng vai trò là "nguồn thông tin tĩnh" giúp xác định sự kiện nào đang được xử lý. 
Cột phải là "vùng tương tác động" với cấu trúc tab rõ ràng. Tab điểm danh được ưu tiên mặc định mở khi truy cập trang, giúp nhân viên trực tại bàn tiếp đón thực hiện thao tác check-in cho khách mời nhanh nhất có thể.

### 4.2. Luồng Hoạt động (Workflow)
1. **Truy cập trang chi tiết:** Từ trang danh sách, người dùng bấm vào dòng sự kiện hoặc bấm biểu tượng Chi tiết. Giao diện trang chi tiết tải dữ liệu của sự kiện đó.
2. **Điểm danh khách mời:** Khách hàng đến quầy tiếp đón đọc tên hoặc số điện thoại. Nhân viên nhập thông tin vào ô tìm kiếm nhanh trong Tab Điểm danh. Dòng thông tin của khách hàng hiện ra. Nhân viên bấm nút "Điểm danh".
   - Hệ thống chuyển trạng thái vé của khách sang "Đã tham dự" kèm chấm xanh lục.
   - Ghi nhận thời gian check-in là giờ hiện tại của hệ thống.
   - Các thẻ chỉ số đón tiếp ở đầu tab tự động cập nhật số lượng và tỷ lệ % tham gia tức thì mà không cần tải lại toàn trang.
   - Hệ thống tự động kích hoạt tạo một lịch sử tương tác ghi nhận khách hàng đã tham gia sự kiện trong hồ sơ khách hàng.

---

## 5. Corner Cases (Trường hợp đặc biệt)

| # | Tình huống đặc biệt | Cách xử lý chi tiết | Ghi chú |
|---|---------------------|---------------------|---------|
| 5.1 | Khách hàng vãng lai chưa có trong danh sách đăng ký | Nhân viên bấm nút "Thêm khách mời", hệ thống mở hộp thoại tìm kiếm nhanh khách hàng có sẵn trên hệ thống. Nếu khách hàng đã tồn tại, bấm chọn để thêm vào danh sách và thực hiện điểm danh ngay lập tức. Nếu khách hàng mới hoàn toàn, hệ thống liên kết nhanh sang biểu mẫu thêm mới khách hàng. | Hỗ trợ đăng ký trực tiếp tại chỗ |
| 5.2 | Khách muốn hủy điểm danh do nhầm lẫn | Nếu nhân viên điểm danh nhầm, di chuột vào dòng khách mời, bấm nút "Hủy điểm danh". Hệ thống hiển thị hộp thoại xác nhận. Sau khi đồng ý, trạng thái vé chuyển lại thành "Chờ check-in", xóa giờ điểm danh và cập nhật lại các chỉ số tóm tắt tương ứng. | Hoàn tác điểm danh |
| 5.3 | Sự kiện đã bị hủy từ trước | Toàn bộ các tương tác điểm danh, thêm khách mời hay chỉnh sửa lịch trình đều bị vô hiệu hóa (khóa hoàn toàn), hiển thị thông điệp thông báo sự kiện đã bị hủy bỏ. | Khóa tương tác an toàn |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Bố cục hai cột linh hoạt):** Trang chi tiết phân tách rõ ràng hai cột nội dung trên màn hình lớn và tự động chuyển đổi thành một cột trên màn hình điện thoại di động mượt mà.
- **AC-2 (Điểm danh phản hồi tức thì):** Thao tác điểm danh khách mời diễn ra trơn tru, thay đổi trạng thái nhãn hiển thị và tính toán lại các chỉ số đón tiếp tức thì tại giao diện mà không cần làm mới trang.
- **AC-3 (Thêm khách mời nhanh gọn):** Hộp thoại thêm khách mời hỗ trợ tìm kiếm theo tên/số điện thoại từ cơ sở dữ liệu khách hàng có sẵn và gán chính xác vào sự kiện hiện tại.
- **AC-4 (Xác nhận an toàn):** Mọi thao tác hủy vé, hủy điểm danh hoặc kết thúc sự kiện bắt buộc phải hiển thị hộp thoại xác nhận an toàn trước khi thay đổi dữ liệu.