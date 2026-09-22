# TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA)
## CỤM THÔNG TIN CHƯƠNG TRÌNH & CƠ CHẾ ẨN HIỆN THEO TRẠNG THÁI GÓI HỌC

> **Mã tài liệu:** `AC-CARE-PROGRAM-PACKAGE-VISIBILITY`  
> **Phân hệ đối ứng:** `CAP-CARE` (Vận hành & Chăm sóc Học viên)  
> **Tài liệu nguồn Confluence:** [Chi tiết chăm sóc học viên - Cập nhật Thông tin Lớp học & Nội dung theo gói (Section A)](https://rinoeduai.atlassian.net/wiki/x/AwBPCQ)  
> **Màn hình áp dụng:** 
> - Màn hình Chăm sóc học viên (`/app/student_operations_alert`)
> - Màn hình Chăm sóc Tái phí (`/app/renewal`)
> 
> **Phạm vi nghiệm thu:**
> 1. Thanh chọn Gói học theo Chương trình & Tab Khác mở Menu nổi danh sách gói cũ (Phần 1)
> 2. Cơ chế ẩn/hiện Biểu ngữ Trạng thái (Status Banner) theo trạng thái vận hành gói (Phần 2)
> 3. Cơ chế ẩn/hiện Cụm 3 cột thông tin lớp cốt lõi (Mã lớp, Lịch học, Giáo viên)
> 4. Cơ chế điều khiển hiển thị khối Nhật ký buổi học tương ứng theo từng trạng thái gói
> 5. Nhóm nút thao tác nghiệp vụ nhanh và cơ chế gán nhân sự (Chuyên viên CS & Giáo viên)

---

## 1. TIÊU CHÍ NGHIỆM THU CHI TIẾT (GHERKIN GIẢ SỬ - KHI - THÌ)

### AC-01: Thanh chọn Gói học & Cơ chế điều hướng gói đang học

#### AC-01.1: Hiển thị các Tab gói học đang còn hạn
* **Giả sử:** Nhân viên Chăm sóc khách hàng mở màn hình Chi tiết chăm sóc của học viên có từ 1 gói học trở lên.
* **Khi:** Hệ thống truy xuất dữ liệu gói học của học viên từ cơ sở dữ liệu học viên.
* **Thì:**
  1. Mỗi gói học đang còn hạn (có trạng thái Đang học và số buổi còn lại > 0) được hiển thị trực tiếp thành một nút tab chọn riêng biệt trên thanh điều hướng.
  2. Bố cục nút tab bao gồm đúng 2 dòng nội dung:
     - **Dòng 1 (trên):** Tên Chương trình đào tạo (ví dụ: *Toán tư duy*, *Tiếng Anh*), định dạng chữ đậm nổi bật.
     - **Dòng 2 (dưới):** Tên gói học cụ thể (ví dụ: `[MATH_TUTOR] Toán Tư Duy Toán 1:6_96 buổi`), được thu nhỏ kích thước chữ và tự động cắt ngắn kèm dấu ba chấm `...` khi vượt quá chiều rộng của nút.
  3. Tất cả các nút gói học có kích thước ngang đồng bộ (chiều rộng tối đa 135 điểm ảnh) để thanh chọn luôn thẳng hàng, gọn gàng và không bị xô lệch giao diện.
  4. Khi rê chuột (hover) vào nút gói học, xuất hiện gợi ý (tooltip) hiển thị đầy đủ Tên chương trình và Tên gói học nguyên bản.

#### AC-01.2: Trạng thái kích hoạt và chuyển đổi gói học
* **Giả sử:** Học viên đang có nhiều gói học còn hạn đang diễn ra song song (ví dụ: cả gói Toán tư duy và gói Tiếng Anh).
* **Khi:** Người dùng nhấp chuột vào một tab gói học bất kỳ.
* **Thì:**
  1. Tab gói được chọn lập tức chuyển sang trạng thái kích hoạt: nền chuyển sang màu xanh dương đậm nhấn, toàn bộ chữ chuyển sang màu trắng sáng, xuất hiện dấu chấm tròn nhỏ màu trắng ở góc phải dòng 1.
  2. Các tab gói còn lại tự động chuyển về trạng thái bình thường (nền sáng/tối mặc định, viền mờ, chữ màu ghi xám).
  3. Hệ thống hiển thị thông báo phản hồi ngắn góc màn hình: *"Đang xem gói: [Tên gói học]"*.
  4. Toàn bộ thông tin hiển thị bên dưới (Mã lớp, Lịch học, Giáo viên, Nhật ký buổi học, SmartCards chỉ số và dòng thời gian tương tác) tự động làm mới và phản ánh chính xác dữ liệu của gói học vừa chọn.

---

### AC-02: Tab "Khác" & Menu nổi chọn Gói học cũ / Hết hạn

#### AC-02.1: Điều kiện xuất hiện và cấu trúc Tab "Khác"
* **Giả sử:** Học viên có ít nhất 1 gói học đã hoàn thành toàn bộ số buổi (còn 0 buổi) hoặc đã hết thời hạn hiệu lực.
* **Khi:** Hệ thống tải dữ liệu phân loại gói học của học viên.
* **Thì:**
  1. Tất cả các gói cũ / hết hạn được ẩn hoàn toàn khỏi danh sách tab chính trên thanh điều hướng.
  2. Xuất hiện duy nhất tab **Khác** nằm liền kề sau các tab gói còn hạn. Nếu học viên không có bất kỳ gói cũ/hết hạn nào, tab Khác bị ẩn hoàn toàn.
  3. Bố cục tab **Khác** đồng bộ kích thước với các tab gói còn hạn, gồm 2 dòng:
     - **Dòng 1 (trên):** Chữ in đậm **Khác**, kèm huy hiệu số đếm màu xám ghi nhận tổng số gói cũ (ví dụ: `1`, `2`) và biểu tượng mũi tên chỉ xuống.
     - **Dòng 2 (dưới):** Hiển thị văn bản rút gọn `...` với nội dung *Gói cũ, hết hạn* (khi chưa chọn gói cũ nào) hoặc hiển thị tên của gói cũ đang xem (khi đã chọn 1 gói cũ trong menu).

#### AC-02.2: Menu nổi (Popover) Danh sách gói cũ
* **Giả sử:** Người dùng quan sát thấy tab **Khác** trên thanh chọn.
* **Khi:** Người dùng nhấp chuột vào tab **Khác**.
* **Thì:**
  1. Hệ thống **tuyệt đối không mở hộp thoại toàn màn hình (Modal)** mà mở ngay một **Menu danh sách nổi (Popover)** gắn liền ngay phía dưới nút bấm.
  2. Biểu tượng mũi tên trên nút Khác tự động xoay ngược 180 độ biểu thị menu đang mở.
  3. Tiêu đề menu nổi hiển thị: `Gói cũ / Hết hạn (X)` (với X là số lượng gói cũ) kèm chú thích *"Chọn để xem dữ liệu"*.
  4. Khu vực danh sách cho phép cuộn dọc mượt mà nếu có nhiều gói cũ. Mỗi dòng gói cũ thể hiện đầy đủ:
     - Tên chương trình (dạng nhãn ngắn).
     - Tên gói học đầy đủ (in đậm).
     - Tiến độ số buổi: `[Số buổi đã học]/[Tổng số buổi] buổi` (ví dụ: `48/48 buổi`).
     - Thời hạn gói: `Hạn: [Ngày/Tháng/Năm]` (ví dụ: `Hạn: 14/08/2024`).
     - Huy hiệu trạng thái: `Hết buổi` (nếu hết số buổi) hoặc `Hết hạn` (nếu quá thời hạn kết thúc).
     - Biểu tượng tích chọn màu xanh dương nếu gói đó đang được xem.

#### AC-02.3: Chọn xem dữ liệu Gói cũ từ Menu nổi
* **Giả sử:** Menu nổi Danh sách gói cũ đang mở.
* **Khi:** Người dùng nhấp chuột vào một dòng gói cũ bất kỳ trong menu.
* **Thì:**
  1. Menu nổi tự động đóng lại ngay lập tức.
  2. Tab **Khác** chuyển sang trạng thái kích hoạt: nền chuyển màu xanh dương đậm nhấn, chữ chuyển sang màu trắng, dòng 2 cập nhật tên của gói cũ vừa chọn (rút gọn kèm dấu `...`).
  3. Tất cả các tab gói còn hạn chuyển về trạng thái không kích hoạt.
  4. Toàn bộ thông tin lớp học cũ (mã lớp cũ, giáo viên cũ, lịch học cũ và lịch sử học tập) được hiển thị ra giao diện chính để phục vụ tra cứu lịch sử.
  5. Hệ thống gửi thông báo phản hồi: *"Đã chọn xem gói cũ: [Tên gói học]"*.
  6. Khi người dùng muốn quay lại gói đang học: chỉ cần nhấp vào bất kỳ tab gói còn hạn nào, tab Khác tự động nhả trạng thái kích hoạt và trả lại nhãn dòng 2 là *Gói cũ, hết hạn*.

---

### AC-03: Cơ chế Ẩn / Hiện Biểu ngữ Trạng thái (Status Banner)

#### AC-03.1: Ẩn biểu ngữ đối với học viên Đang học bình thường
* **Giả sử:** Gói học đang chọn có trạng thái vận hành là **Đang học** (`active`).
* **Khi:** Hệ thống dựng khung thông tin lớp học.
* **Thì:**
  1. Hệ thống **ẩn hoàn toàn Biểu ngữ trạng thái ở giữa**, không hiển thị bất kỳ khung thông báo cảnh báo nào để tối ưu không gian cho thông tin lịch học và giáo viên.

#### AC-03.2: Hiển thị biểu ngữ chuyên biệt cho các trạng thái vận hành đặc thù
* **Giả sử:** Gói học đang chọn rơi vào một trong các trạng thái vận hành phát sinh.
* **Khi:** Người dùng quan sát khu vực trung tâm phía dưới thanh chọn gói.
* **Thì:** Hệ thống hiển thị Biểu ngữ trạng thái (Status Banner) tương ứng với nội dung nghiệp vụ chuẩn xác:
  1. **Trạng thái Chờ khai giảng (`awaiting_opening`):**
     - Tiêu đề biểu ngữ: `✨ LỚP HỌC CHỜ KHAI GIẢNG` kèm huy hiệu *Chờ khai giảng*.
     - Nội dung: Thể hiện rõ Ngày khai giảng dự kiến và ghi chú học viên đã được xếp vào lớp thành công.
  2. **Trạng thái Bảo lưu (`reserve`):**
     - Tiêu đề biểu ngữ: `❄️ KHÓA HỌC ĐANG BẢO LƯU` kèm huy hiệu *Bảo lưu* (hoặc *Bảo lưu Giữ lớp*).
     - Nội dung: Thể hiện Ngày học lại dự kiến, Khoảng thời gian bảo lưu (từ ngày đến ngày), ghi chú bảo toàn sĩ số (đối với diện không giữ lớp).
  3. **Trạng thái Chưa ghép lớp (`wait_for_assignment`):**
     - Tiêu đề biểu ngữ: `👤 HỌC VIÊN CHƯA GHÉP LỚP` kèm huy hiệu *Chờ xếp lớp*.
     - Nội dung: Tên gói học đã mua và tổng số buổi học khả dụng đang chờ xếp lớp.
  4. **Trạng thái Chờ chuyển lớp (`pending_transfer`):**
     - Tiêu đề biểu ngữ: `🔁 TIẾN TRÌNH CHUYỂN LỚP ĐANG DIỄN RA` kèm huy hiệu *Chờ chuyển lớp*.
     - Nội dung: Lộ trình chuyển đổi `[Lớp nguồn] ➔ [Lớp đích]` kèm trạng thái của lớp đích.
  5. **Trạng thái Lớp nháp (`draft_class`):**
     - Tiêu đề biểu ngữ: `📝 HỌC VIÊN ĐANG GHÉP VÀO LỚP NHÁP` kèm huy hiệu *Lớp nháp*.
     - Nội dung: Cảnh báo lớp học đang ở trạng thái nháp, chưa chốt mở lớp chính thức.
  6. **Trạng thái Chờ thanh toán (`pending_payment`):**
     - Tiêu đề biểu ngữ: `💳 HỌC VIÊN CHỜ THANH TOÁN HỌC PHÍ` kèm huy hiệu *Chờ thanh toán*.
     - Nội dung: Cảnh báo cần xác nhận chứng từ thu phí trước khi xếp lớp chính thức.
  7. **Trạng thái Xếp lớp sau / Lùi lịch (`enroll_later`):**
     - Tiêu đề biểu ngữ: `📅 HỌC VIÊN XIN XẾP LỚP SAU (LÙI LỊCH)` kèm huy hiệu *Xếp lớp sau*.
     - Nội dung: Ghi chú phụ huynh hẹn liên hệ lại vào đợt học sau để sắp xếp lịch học.
  8. **Trạng thái Chuyển phí (`fee_transfer`):**
     - Tiêu đề biểu ngữ: `⇄ ĐANG XỬ LÝ THỦ TỤC CHUYỂN PHÍ` kèm huy hiệu *Chuyển phí*.
     - Nội dung: Gói đang thực hiện thủ tục chuyển số buổi / học phí sang môn khác hoặc học viên khác.
  9. **Trạng thái Hết buổi (`session_ended`):**
     - Tiêu đề biểu ngữ: `⚠️ KHÓA HỌC ĐÃ HẾT BUỔI (CẦN TÁI PHÍ)` kèm huy hiệu *Hết buổi*.
     - Nội dung: Thông báo học viên đã hoàn thành toàn bộ số buổi đăng ký, số buổi còn lại bằng 0 buổi.
  10. **Trạng thái Học thử (`trial`):**
      - Tiêu đề biểu ngữ: `🎓 HỌC VIÊN DIỆN HỌC THỬ (TRIAL)` kèm huy hiệu *Học thử*.
      - Nội dung: Thông báo học viên trải nghiệm từ 1 đến 2 buổi học thử; Chuyên viên CS cần theo dõi nhận xét của giáo viên.

---

### AC-04: Cơ chế Ẩn / Hiện Cụm 3 cột thông tin cốt lõi (Mã lớp, Lịch học, Giáo viên)

#### AC-04.1: Các trạng thái bắt buộc HIỆN Cụm 3 cột
* **Giả sử:** Gói học đang chọn ở một trong các trạng thái có liên kết lớp học thực tế: **Đang học**, **Chờ khai giảng**, **Lớp nháp**, **Học thử**, **Bảo lưu (Có giữ lớp)**, **Hết buổi**.
* **Khi:** Hệ thống hiển thị khung thông tin lớp.
* **Thì:**
  1. Hiển thị trọn vẹn 3 cột thông tin:
     - **Cột 1 (Mã lớp):** Biểu tượng cuốn sách, Mã định danh lớp học (rê chuột mở thẻ tóm tắt phòng học, sĩ số), huy hiệu trạng thái của lớp.
     - **Cột 2 (Lịch học):** Biểu tượng cuốn lịch, các thứ trong tuần và khung giờ học cố định của lớp.
     - **Cột 3 (Giáo viên / CS):** Biểu tượng mũ tốt nghiệp, danh sách giáo viên đứng lớp kèm biểu tượng đồng hồ lịch sử đổi giáo viên `🕒 (X)` (hoặc hiển thị Chuyên viên CS nếu là màn hình Tái phí).
  2. Riêng đối với trạng thái **Hết buổi**: Cụm 3 cột vẫn hiện nhưng hiển thị ở dạng lưu trữ làm mờ nhẹ để biểu thị lớp đã kết thúc.

#### AC-04.2: Các trạng thái bắt buộc ẨN Cụm 3 cột
* **Giả sử:** Gói học đang chọn ở một trong các trạng thái chưa có lớp hoặc đã rút khỏi lớp: **Chưa ghép lớp**, **Bảo lưu (Không giữ lớp)**, **Chờ thanh toán**, **Xếp lớp sau**, **Chuyển phí**, **Chờ chuyển lớp**.
* **Khi:** Hệ thống dựng giao diện thông tin lớp.
* **Thì:**
  1. Cụm 3 cột thông tin lớp (Mã lớp, Lịch học, Giáo viên) **bị ẩn hoàn toàn** khỏi màn hình.
  2. Giao diện tập trung toàn bộ vào Biểu ngữ trạng thái và các nút điều hướng thao tác nghiệp vụ giải quyết trạng thái đó (ví dụ: nút *Ghép lớp ngay*, *Xem đơn hàng*, *Đặt lịch hẹn*).

---

### AC-05: Cơ chế Điều khiển hiển thị Khối Nhật ký buổi học & Chỉ số học tập

#### AC-05.1: Hiển thị đầy đủ Nhật ký buổi học
* **Giả sử:** Học viên đang ở trạng thái **Đang học** hoặc **Hết buổi**.
* **Khi:** Người dùng xem nửa dưới màn hình chi tiết học tập.
* **Thì:**
  1. Khối Nhật ký buổi học hiển thị đầy đủ 100%: Cụm 3 thẻ SmartCard chỉ số, Thanh buổi học tiếp theo (với Đang học), Danh sách các buổi học đã qua kèm nhận xét của giáo viên.
  2. Đối với trạng thái **Hết buổi**: Khối đóng vai trò là bảng tổng kết học tập toàn diện làm căn cứ tư vấn gia hạn / tái phí khóa học mới.

#### AC-05.2: Hiển thị dạng Lưu trữ chỉ đọc hoặc Lịch trình dự kiến
* **Giả sử:** Học viên ở trạng thái **Bảo lưu (Có giữ lớp)** hoặc **Chờ khai giảng**.
* **Khi:** Người dùng cuộn xuống phần tiến trình buổi học.
* **Thì:**
  1. **Với Bảo lưu (Có giữ lớp):** Hiển thị danh sách lịch sử các buổi học đã hoàn thành trước ngày bảo lưu ở chế độ chỉ đọc; **ẩn hoàn toàn thanh buổi học tiếp theo**.
  2. **Với Chờ khai giảng:** Hiển thị khối Lịch trình khai giảng với thanh định hướng khai giảng dự kiến; danh sách nhật ký hiển thị thông báo mờ chuẩn bị ghi nhận sau buổi học đầu tiên.

#### AC-05.3: Ẩn hoàn toàn Khối Nhật ký buổi học
* **Giả sử:** Học viên ở các trạng thái chưa phát sinh buổi học thực tế tại lớp: **Chưa ghép lớp**, **Bảo lưu (Không giữ lớp)**, **Chờ chuyển lớp**, **Lớp nháp**, **Chờ thanh toán**, **Xếp lớp sau**, **Chuyển phí**.
* **Khi:** Hệ thống kết xuất giao diện thẻ học tập.
* **Thì:**
  1. Khối Nhật ký buổi học, Cụm SmartCards và Thanh buổi học tiếp theo **bị ẩn hoàn toàn 100%**, không để lại khoảng trống thừa trên giao diện.

---

### AC-06: Nhóm nút Thao tác nghiệp vụ & Cơ chế gán Nhân sự (CS & Giáo viên)

#### AC-06.1: Nút thao tác nhanh theo từng trạng thái vận hành
* **Giả sử:** Người dùng đang kiểm tra gói học ở một trạng thái cụ thể.
* **Khi:** Người dùng quan sát góc phải của thẻ hoặc trong menu thao tác ba chấm `⋮`.
* **Thì:** Hệ thống cung cấp đúng danh mục hành động nghiệp vụ hợp lệ:
  1. **Đang học / Chờ khai giảng:** Menu cung cấp hành động: *Xin nghỉ phép*, *Bảo lưu học phí*, *Chuyển lớp*.
  2. **Bảo lưu:** Cung cấp nút thao tác trực tiếp: *Xem đơn bảo lưu*, *Đi học lại* (mở hộp thoại xác nhận đi học lại trước hạn).
  3. **Chưa ghép lớp / Xếp lớp sau:** Cung cấp nút trực tiếp: *Ghép lớp ngay* (chuyển sang phân hệ Xếp lớp học viên).
  4. **Chờ thanh toán:** Cung cấp nút trực tiếp: *Xem đơn hàng*, *Nhắc thanh toán*.
  5. **Hết buổi:** Cung cấp nút trực tiếp: *Tạo đơn đăng ký mới (Tái phí)*.
  6. **Học thử:** Cung cấp nút trực tiếp: *Nhập nhận xét học thử*, *Chuyển chính thức*.

#### AC-06.2: Cơ chế gán và kế thừa Giáo viên & Chuyên viên CS
* **Giả sử:** Học viên đã được xếp vào một lớp học chính thức.
* **Khi:** Người dùng mở rộng thẻ thông tin lớp học (bằng nút *Mở rộng*).
* **Thì:**
  1. **Phụ trách Giáo viên (Tự động kế thừa 100% từ lớp):** Hệ thống tự động kế thừa toàn bộ danh sách giáo viên, giáo viên bản ngữ và trợ giảng của lớp học đó đưa vào thẻ, không cho phép chỉnh sửa tùy tiện tại hồ sơ học viên. Bất cứ khi nào có sự điều chuyển giáo viên tại lớp học, danh sách này tự động cập nhật đồng bộ.
  2. **Phụ trách Chuyên viên CS (Gán và đổi linh hoạt):** Luôn hiển thị tên nhân sự CS đang phụ trách gói; có nút đổi `⇄` cho phép mở danh sách tìm kiếm để bàn giao học viên cho nhân sự CS khác quản lý khi cần thiết.

---

## 2. MA TRẬN TỔNG HỢP KIỂM THỬ NGHIỆM THU (UAT MATRIX)

| STT | Trạng thái Vận hành Gói | Nhãn trạng thái | Biểu ngữ (Banner) | Cụm 3 cột (Mã lớp, Lịch, GV) | Nhật ký Buổi học | Nút Thao tác chính khả dụng |
|:---:|---|---|:---:|:---:|:---:|---|
| **1** | **Đang học** | `[Đang học]` | **Ẩn** | **Hiện** | **Hiện đầy đủ** | Menu `⋮`: Xin nghỉ, Bảo lưu, Chuyển lớp |
| **2** | **Chờ khai giảng** | `[Chờ khai giảng]` | **Hiện** | **Hiện** | **Lịch trình dự kiến** | Menu `⋮`: Chuyển lớp trước KG, Rút khỏi lớp |
| **3** | **Bảo lưu (Có giữ lớp)** | `[Bảo lưu (Giữ lớp)]` | **Hiện** | **Hiện** | **Lưu trữ (Chỉ đọc)** | Nút: *Xem đơn bảo lưu*, *Đi học lại* |
| **4** | **Bảo lưu (Không giữ lớp)**| `[Bảo lưu]` | **Hiện** | **Ẩn** | **Ẩn hoàn toàn** | Nút: *Xem đơn bảo lưu*, *Đi học lại* |
| **5** | **Chưa ghép lớp** | `[Chờ xếp lớp]` | **Hiện** | **Ẩn** | **Ẩn hoàn toàn** | Nút: *Ghép lớp ngay* |
| **6** | **Chờ chuyển lớp** | `[Chờ chuyển lớp]` | **Hiện** | **Ẩn / Mờ** | **Ẩn hoàn toàn** | Nút: *Ghép lớp đích*, *Hủy chuyển lớp* |
| **7** | **Lớp nháp** | `[Lớp nháp]` | **Hiện** | **Hiện** | **Ẩn hoàn toàn** | Menu `⋮`: Xem lớp nháp, Chuyển chính thức |
| **8** | **Chờ thanh toán** | `[Chờ thanh toán]` | **Hiện** | **Ẩn** | **Ẩn hoàn toàn** | Nút: *Xem đơn hàng*, *Nhắc thanh toán* |
| **9** | **Xếp lớp sau** | `[Xếp lớp sau]` | **Hiện** | **Ẩn** | **Ẩn hoàn toàn** | Nút: *Đặt lịch hẹn*, *Kích hoạt xếp lớp* |
| **10**| **Chuyển phí** | `[Chuyển phí]` | **Hiện** | **Ẩn** | **Ẩn hoàn toàn** | Nút: *Xem đơn chuyển phí*, *Lịch sử GD* |
| **11**| **Hết buổi** | `[Hết buổi]` | **Hiện** | **Hiện (Mờ)** | **Hiện đầy đủ** | Nút: *Tạo đơn đăng ký mới (Tái phí)* |
| **12**| **Học thử (Trial)** | `[Học thử]` | **Hiện** | **Hiện** | **Ẩn hoàn toàn** | Nút: *Nhập nhận xét*, *Chuyển chính thức* |

---

## 3. DANH SÁCH CÁC TRƯỜNG HỢP BIÊN & NGOẠI LỆ CHÍNH (KEY CORNER CASES)

Dưới đây là danh mục các trường hợp biên & ngoại lệ cốt lõi thuộc phạm vi cụm thông tin chương trình và cơ chế ẩn hiện theo trạng thái gói học, được chuẩn hóa theo quy chuẩn đặc tả nghiệp vụ:

* **[CASE-01] Học viên không còn bất kỳ gói học nào khả dụng (100% gói đã hết buổi hoặc quá hạn):**  
  Nếu tất cả các gói học trong hồ sơ học viên đều đã hoàn thành toàn bộ số buổi (còn 0 buổi) hoặc đã quá thời hạn kết thúc khóa học, hệ thống không để trống thanh điều hướng mà tự động chọn gói học kết thúc gần nhất làm gói hiển thị mặc định. Khi đó, tab "Khác" tự động ở trạng thái kích hoạt (nền màu xanh dương đậm nhấn), dòng dưới hiển thị tên gói cũ đó, đồng thời hệ thống kích hoạt Biểu ngữ trạng thái *"Khóa học đã hết buổi (Cần tái phí)"* và làm mờ thông tin lớp học cũ để cảnh báo nhân viên làm thủ tục tái phí.

* **[CASE-02] Học viên mới chỉ có duy nhất 1 gói học đang hoạt động, không có gói cũ:**  
  Nếu học viên mới nhập học và chỉ sở hữu duy nhất 1 gói học đang còn hạn, hệ thống chỉ hiển thị đúng 1 tab gói học tương ứng trên thanh điều hướng, đồng thời tự động ẩn hoàn toàn tab "Khác" khỏi giao diện thay vì hiển thị một nút bấm vô hiệu hóa hoặc để khoảng trống thừa, đảm bảo giao diện luôn gọn gàng và không gây hiểu nhầm cho người dùng.

* **[CASE-03] Gói học còn số buổi khả dụng nhưng đã hết thời hạn hiệu lực:**  
  Nếu gói học của học viên vẫn còn số buổi học chưa dùng (lớn hơn 0 buổi) nhưng mốc thời gian kết thúc đã quá hạn so với ngày thực tế của hệ thống, hệ thống ưu tiên quy tắc kiểm soát thời hạn: tự động đưa gói này vào nhóm Gói cũ / Hết hạn trong menu nổi "Khác" với huy hiệu *"Hết hạn"* (thay vì *"Hết buổi"*), đồng thời hiển thị cảnh báo để chuyên viên chăm sóc làm thủ tục gia hạn thời gian học hoặc giải quyết bảo lưu cho phụ huynh trước khi cho phép tiếp tục điểm danh.

* **[CASE-04] Học viên đang học song song 2 gói ở 2 trạng thái vận hành đối nghịch:**  
  Nếu học viên đăng ký nhiều môn và có 2 gói học diễn ra song song nhưng ở trạng thái hoàn toàn trái ngược nhau (ví dụ: gói Toán đang ở trạng thái Đang học, còn gói Tiếng Anh đang ở trạng thái Bảo lưu hoặc Chưa ghép lớp), hệ thống phân tách độc lập hoàn toàn dữ liệu giữa 2 gói. Khi người dùng nhấp chọn tab Toán, giao diện hiển thị trọn vẹn cụm 3 cột thông tin lớp và ẩn biểu ngữ; khi người dùng nhấp chuyển sang tab Tiếng Anh, giao diện lập tức hoán đổi tức thì: hiển thị biểu ngữ bảo lưu, ẩn các thành phần lớp học tương ứng và đổi cụm nút hành động sang xử lý bảo lưu, tuyệt đối không để rò rỉ hay chồng chéo dữ liệu giữa 2 môn học.

* **[CASE-05] Phân biệt rõ rệt học viên Bảo lưu diện "Có giữ lớp" và "Không giữ lớp":**  
  Nếu học viên phát sinh trạng thái bảo lưu khóa học, hệ thống căn cứ vào tính chất giữ chỗ trong hồ sơ để phân nhánh hiển thị: Đối với diện Có giữ lớp, hệ thống vẫn duy trì hiển thị Cụm 3 cột (kèm nhãn bảo lưu giữ lớp), hiển thị nhật ký các buổi đã qua ở chế độ lưu trữ chỉ đọc và ẩn ca học tiếp theo; đối với diện Không giữ lớp, hệ thống tự động ẩn hoàn toàn cả Cụm 3 cột thông tin lớp lẫn Khối nhật ký buổi học, đồng thời hiển thị biểu ngữ ghi chú học viên đã rút khỏi danh sách lớp để nhường sĩ số cho học viên khác.

* **[CASE-06] Học viên ở trạng thái chưa ghép lớp, lùi lịch hoặc chờ thanh toán:**  
  Nếu gói học đang chọn thuộc các diện chưa được xếp vào lớp học chính thức (Chưa ghép lớp, Xếp lớp sau, Chờ thanh toán học phí), hệ thống tự động ẩn hoàn toàn Cụm 3 cột thông tin lớp (Mã lớp, Lịch học, Giáo viên) và Khối nhật ký buổi học để tránh hiển thị khoảng trắng hoặc dữ liệu rỗng. Thay vào đó, hệ thống tập trung toàn bộ giao diện vào Biểu ngữ trạng thái chuyên biệt và hiển thị các nút hành động điều hướng trực tiếp như *"Ghép lớp ngay"* hoặc *"Xem đơn hàng / Nhắc thanh toán"*.

* **[CASE-07] Học viên ở trạng thái Chờ chuyển lớp (Pending Transfer):**  
  Nếu học viên đã có đơn chuyển lớp được phê duyệt và đang trong giai đoạn bàn giao lớp học, hệ thống tự động làm mờ hoặc ẩn thông tin lớp cũ, đồng thời Biểu ngữ trạng thái hiển thị rõ ràng lộ trình chuyển đổi từ mã lớp nguồn sang mã lớp đích kèm tình trạng tiếp nhận của lớp mới, kèm theo các nút thao tác hỗ trợ nhân viên như *"Ghép lớp đích ngay"* hoặc *"Hủy yêu cầu chuyển lớp"*.

* **[CASE-08] Thao tác Thu gọn hoặc Mở rộng thẻ lớp khi đang xem dữ liệu của một Gói cũ:**  
  Nếu người dùng đang chọn xem dữ liệu của một gói học cũ thông qua menu nổi "Khác", sau đó thực hiện thao tác bấm nút Thu gọn hoặc Mở rộng thẻ chi tiết, hệ thống phải ghi nhớ và duy trì chính xác gói cũ đang hiển thị, tuyệt đối không tự động khôi phục (reset) về gói học còn hạn mặc định ban đầu, đảm bảo tính liên tục của trải nghiệm tra cứu dữ liệu.

* **[CASE-09] Chuyển đổi học viên trong danh sách khi đang xem gói phụ hoặc menu nổi đang mở:**  
  Nếu người dùng đang chọn xem một gói học phụ (hoặc gói cũ) của Học viên A và menu nổi đang mở, sau đó nhấp chuột chọn Học viên B trong danh sách bên trái màn hình, hệ thống lập tức tự động đóng menu nổi, đồng thời tự động khôi phục gói được chọn về gói chính mặc định đầu tiên của Học viên B, tuyệt đối không giữ lại mã gói của học viên trước đó nhằm tránh xung đột dữ liệu học tập.

* **[CASE-10] Chuyển đổi ngữ cảnh làm việc giữa màn hình Chăm sóc thường và Chăm sóc Tái phí:**  
  Nếu thẻ học tập được hiển thị trên phân hệ Chăm sóc Tái phí (`/app/renewal`) thay vì phân hệ Chăm sóc vận hành thường (`/app/student_operations_alert`), Cột 3 của cụm thông tin lớp tự động hoán đổi từ việc hiển thị Giáo viên giảng dạy sang hiển thị thông tin Chuyên viên Chăm sóc khách hàng phụ trách (kèm nút đổi chuyên viên), giúp nhân viên phụ trách doanh thu tái phí đối soát ngay người chịu trách nhiệm hồ sơ mà không cần mở sâu vào trang cá nhân của học viên.

