# TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA)
## PHÂN VÙNG NHẬT KÝ BUỔI HỌC, THẺ SMARTCARD & TIẾN TRÌNH HỌC TẬP

> **Mã tài liệu:** `AC-CARE-SESSION-TIMELINE`  
> **Phân hệ đối ứng:** `CAP-CARE` (Chăm sóc & Duy trì Học viên)  
> **Màn hình áp dụng:** Màn hình Chi tiết Chăm sóc Học viên & Màn hình Chi tiết Tái phí Học viên  
> **Phạm vi nghiệm thu:** 
> 1. Khối tổng quan Nhật ký Buổi học (`CareSessionTimelineList`)
> 2. Cụm thẻ chỉ số thông minh SmartCards (`CareReportSmartCards`)
> 3. Thanh biểu ngữ Buổi học tiếp theo (Upcoming Session Banner)
> 4. Danh sách các buổi học đã qua (Cơ chế luôn mở rộng buổi gần nhất & Cảnh báo chưa nhận xét)

---

## 1. TIÊU CHÍ NGHIỆM THU CHI TIẾT (ACCEPTANCE CRITERIA)

### AC-01: Tiêu chí nghiệm thu Khối tổng thể Nhật ký buổi học & Điều kiện hiển thị
* **Giả sử:** Nhân viên Chăm sóc khách hàng hoặc Quản lý truy cập vào Màn hình Chi tiết Hồ sơ Học viên.
* **Khi:** Hệ thống tải dữ liệu học tập của học viên theo từng trạng thái học tập cụ thể.
* **Thì:**
  1. **Với học viên đang học chính khóa:** Khối *Nhật ký Buổi học* hiển thị đầy đủ tiêu đề "Nhật ký Buổi học", nhãn phạm vi "30 ngày gần nhất", cụm SmartCards, thanh buổi học tiếp theo và danh sách lịch sử buổi học.
  2. **Với học viên diện Học thử, Chờ xếp lớp, Chờ thanh toán:** Hệ thống tự động ẩn hoàn toàn khối *Nhật ký Buổi học*, không hiển thị bất kỳ thẻ buổi học hay thẻ chỉ số nào.
  3. **Với học viên diện Bảo lưu:** Khối vẫn hiển thị lịch sử các buổi học đã hoàn thành trước ngày bảo lưu, đồng thời xuất hiện khung thông báo: *"Khóa học đang bảo lưu. Danh sách dưới đây lưu lại tiến trình các buổi học đã hoàn thành trước ngày bảo lưu"*, đồng thời ẩn thanh buổi học tiếp theo.
  4. **Với lớp Chờ khai giảng:** Hiển thị khung Nhật ký buổi học với tiêu đề "Dự kiến khai giảng: [Ngày khai giảng]" và duy nhất 1 thanh biểu ngữ buổi định hướng khai giảng dự kiến.

---

### AC-02: Tiêu chí nghiệm thu Cụm thẻ chỉ số thông minh SmartCards
* **Giả sử:** Học viên đang có lớp học chính khóa đang diễn ra hoặc đã hoàn thành.
* **Khi:** Người dùng quan sát cụm 3 thẻ SmartCard đặt ở phần trên cùng của khối Nhật ký buổi học.
* **Thì:**
  1. **Thẻ Chuyên cần:**
     - Hiển thị phân số số buổi có mặt trên tổng số buổi đã học dạng **`x/x`** (hoặc `x/y`, ví dụ: `6/7`, `46/48`, `0/0`). **Tuyệt đối không hiển thị tỷ lệ phần trăm `%`**.
     - Góc trên bên phải hiển thị số lần đi học muộn: `Muộn: X` (hoặc để trống nếu không đi muộn).
     - Hàng dưới cùng hiển thị nhãn in hoa `CHUYÊN CẦN` kèm biểu tượng tích điểm màu xanh lá.
  2. **Thẻ Bài tập về nhà (BTVN):**
     - Hiển thị phân số bài tập đã nộp đạt trên tổng số bài được giao dạng **`x/x`** (ví dụ: `6/7`, `0/4`).
     - Góc trên bên phải hiển thị điểm chất lượng làm bài: `Trung bình: Y.Y` (ví dụ: `Trung bình: 7.5`).
     - Hàng dưới cùng hiển thị nhãn in hoa `BTVN` kèm biểu tượng cuốn sách màu xanh dương.
  3. **Thẻ Kiểm tra:**
     - Hiển thị điểm số bài kiểm tra định kỳ gần nhất dạng số thập phân thang điểm 10 (ví dụ: `8.5`) hoặc dấu gạch ngang `—` nếu chưa có bài thi.
     - Góc trên bên phải hiển thị điểm thi của kỳ liền trước: `Trước: Z.Z` (ví dụ: `Trước: 8.0`) hoặc `Trước: —`.
     - Hàng dưới cùng hiển thị nhãn in hoa `KIỂM TRA` kèm biểu tượng huy hiệu màu cam hổ phách.
  4. **Quy chuẩn tương tác chỉ đọc (Read-only):**
     - Toàn bộ 3 thẻ SmartCard là thẻ hiển thị tĩnh chỉ đọc.
     - Khi rê chuột vào các thẻ: con trỏ chuột giữ nguyên hình mũi tên mặc định (không biến thành bàn tay bấm), không có hiệu ứng đổi màu nền.
     - Khi nhấp chuột vào bất kỳ vị trí nào trên thẻ: không có phản hồi nhấp và không mở bất kỳ hộp thoại nổi nào.

---

### AC-03: Tiêu chí nghiệm thu Thanh biểu ngữ Buổi học tiếp theo (Upcoming Session)
* **Giả sử:** Lớp học đang diễn ra bình thường, chưa bảo lưu và chưa kết thúc khóa học.
* **Khi:** Người dùng xem khu vực ngay dưới cụm thẻ SmartCards.
* **Thì:**
  1. Hiển thị duy nhất một thanh biểu ngữ nằm ngang 1 dòng nổi bật trên nền xanh dịu, viền xanh dương nhạt.
  2. Nội dung trên thanh biểu ngữ thể hiện chuẩn xác:
     - `[Thứ viết tắt], [Ngày/Tháng] ([Khung giờ học])` (ví dụ: `Thứ 2, 27/07 (17:30 - 19:00)`).
     - Dấu chấm phân cách `•`.
     - Tên bài học / chủ đề của ca học sắp tới theo khung chương trình đào tạo.
  3. **Tương tác xem nhanh:** Khi người dùng rê chuột hoặc nhấp chuột vào thanh buổi học tiếp theo, hệ thống mở ngay bảng nổi xem nhanh tóm tắt ca học (giáo viên, trợ giảng, phòng học, sĩ số, kế hoạch bài giảng).

---

### AC-04: Tiêu chí nghiệm thu Danh sách các buổi học & Cơ chế luôn mở rộng buổi gần nhất
* **Giả sử:** Học viên đã hoàn thành từ 1 buổi học chính khóa trở lên.
* **Khi:** Người dùng cuộn xem danh sách lịch sử buổi học.
* **Thì:**
  1. **Thứ tự sắp xếp:** Danh sách sắp xếp giảm dần theo thời gian (buổi học mới diễn ra gần nhất được xếp trên cùng).
  2. **Cơ chế luôn mở rộng buổi gần nhất (Always Expand Most Recent):**
     - Buổi học đầu tiên trên cùng luôn luôn tự động mở rộng trọn vẹn 100% nội dung nhận xét chi tiết của giáo viên mà không bị cắt dòng.
     - Người dùng không cần thực hiện thao tác bấm nút vẫn đọc được toàn bộ nhận xét của buổi học mới nhất.
  3. **Cấu trúc hàng thông tin trên thẻ buổi học:**
     - Góc trái: Hiển thị `[Thứ viết tắt], [Ngày/Tháng]` in đậm cùng Tên bài học. Rê chuột hoặc bấm vào cụm này sẽ mở bảng nổi xem nhanh chi tiết buổi học. Nếu là buổi thi, hiển thị kèm huy hiệu tím `Kiểm tra`.
     - Góc phải: Hiển thị huy hiệu điểm danh (`Đã đến`, `Đến muộn`, `Vắng`, `Chưa điểm danh`), huy hiệu `Nghỉ phép (V)` (nếu có đơn xin nghỉ), mã bài tập về nhà ngắn gọn (`BT-01`, `BT-02`), và điểm kiểm tra (`X.X/10` nếu là buổi thi).

---

### AC-05: Tiêu chí nghiệm thu Thu gọn - Mở rộng nhận xét các buổi học cũ hơn
* **Giả sử:** Danh sách hiển thị các buổi học cũ hơn (từ buổi thứ 2 trở đi trong danh sách).
* **Khi:** Nội dung nhận xét của buổi học cũ dài hơn 3 dòng hoặc vượt quá 60 ký tự.
* **Thì:**
  1. Mặc định hệ thống tự động thu gọn nội dung nhận xét tối đa trong 3 dòng, các dòng thừa bị ẩn đi.
  2. Ở góc phải dòng thứ 3 xuất hiện nút bấm chữ nghiêng: `... xem thêm`.
  3. Khi nhấp vào nút `... xem thêm`: Nội dung nhận xét của riêng buổi đó được mở rộng toàn bộ, nút bấm đổi tên thành `... Thu gọn`.
  4. Khi nhấp vào `... Thu gọn`: Nội dung nhận xét xếp gọn trở lại 3 dòng.
  5. Thao tác mở rộng/thu gọn của từng buổi diễn ra độc lập, không làm ảnh hưởng đến trạng thái hiển thị của các buổi học khác.

---

### AC-06: Tiêu chí nghiệm thu Cơ chế Cảnh báo chưa nhận xét (Điều kiện không có xin nghỉ)
* **Giả sử:** Buổi học đã diễn ra nhưng giáo viên chưa nhập nhận xét hoặc nội dung nhận xét đang để trống.
* **Khi:** Hệ thống kiểm tra điều kiện dữ liệu của ca học.
* **Thì:**
  1. **TRƯỜNG HỢP HỌC VIÊN NGHỈ / NGHỈ PHÉP:**
     - **Tuyệt đối KHÔNG hiển thị khung cảnh báo thiếu nhận xét.**
     - Khu vực nội dung hiển thị dòng văn bản ngắn gọn (chữ nghiêng màu xám):
       + Nếu nghỉ có phép: *"Học viên nghỉ có phép ([Lý do nếu có])."*
       + Nếu nghỉ không phép: *"Học viên nghỉ học không phép."*
     - Hệ thống không tính các ca học này vào danh sách cần đôn đốc nhận xét của giáo viên.
  2. **TRƯỜNG HỢP HỌC VIÊN KHÔNG CÓ XIN NGHỈ (Kích hoạt cảnh báo thuần túy chỉ đọc, không xét giờ):**
     - Hiển thị khung cảnh báo màu vàng hổ phách, icon vòng tròn chấm than (`AlertCircle`), thông báo trực quan: *"Chưa có nhận xét từ giáo viên: Giáo viên chưa cập nhật đánh giá học viên cho ca học này."*
     - **Không phân chia mốc thời gian giờ (>24h hay <24h)**.
     - **Không có nút bấm đôn đốc giáo viên**, đảm bảo giao diện dòng thời gian thuần hiển thị trạng thái tinh gọn.

---

### AC-07: Tiêu chí nghiệm thu Điều hướng Đơn nghỉ phép & Bài tập về nhà
* **Giả sử:** Người dùng đang xem danh sách các thẻ buổi học.
* **Khi:** Người dùng nhấp vào các thành phần tương tác ở góc phải của thẻ buổi học:
* **Thì:**
  1. **Khi nhấp vào huy hiệu `Nghỉ phép (V)`:** Hệ thống kích hoạt mở hộp thoại xem chi tiết đơn xin nghỉ phép (thời gian gửi đơn, lý do nghỉ, trạng thái phê duyệt) của buổi học tương ứng.
  2. **Khi nhấp vào mã bài tập về nhà (đã làm, chữ màu xanh):** Hệ thống tự động mở một tab trình duyệt mới điều hướng thẳng tới chi tiết bài tập đó để nhân viên kiểm tra đối soát bài làm của học viên.
  3. **Với mã bài tập chưa làm (chữ màu xám):** Không có hiệu ứng bấm, rê chuột hiển thị thông tin bài tập chưa làm.

---

### AC-08: Tiêu chí nghiệm thu Nút Xem thêm / Thu gọn toàn bộ lịch sử buổi học
* **Giả sử:** Học viên có tổng số buổi học đã diễn ra nhiều hơn 7 buổi.
* **Khi:** Người dùng cuộn xuống dưới cùng của danh sách lịch sử buổi học.
* **Thì:**
  1. Mặc định hệ thống chỉ hiển thị 7 buổi học gần nhất.
  2. Phía dưới cùng xuất hiện nút bấm: `Xem thêm lịch sử ([Số buổi còn lại] buổi cũ hơn)` kèm mũi tên trỏ xuống.
  3. Khi nhấp vào nút Xem thêm: Toàn bộ các buổi học cũ hơn được nạp tiếp ngay phía dưới theo đúng thứ tự thời gian giảm dần, nút bấm chuyển thành `Thu gọn lịch sử` kèm mũi tên trỏ lên.
  4. Khi nhấp vào `Thu gọn lịch sử`: Danh sách lập tức thu gọn trở lại chỉ hiển thị 7 buổi gần nhất.

---

## 2. CÁC TRƯỜNG HỢP GÓC CẠNH & LUỒNG NGOẠI LỆ (CORNER CASES)

- **[CASE-01] Học viên vừa vắng mặt vừa có đơn xin nghỉ phép:** Huy hiệu điểm danh hiển thị `Vắng` (màu đỏ) đồng thời bên cạnh hiển thị huy hiệu `Nghỉ phép (V)` (màu cam). Dòng nhận xét không hiển thị cảnh báo thiếu nhận xét mà ghi rõ lý do xin nghỉ.
- **[CASE-02] Học viên vắng mặt KHÔNG phép:** Huy hiệu điểm danh hiển thị `Vắng` (màu đỏ), không có huy hiệu nghỉ phép. Phần nhận xét nếu giáo viên chưa nhập sẽ hiển thị cảnh báo thiếu nhận xét theo đúng hạn 24h hoặc quá 24h.
- **[CASE-03] Ca học chưa hoàn tất chốt điểm danh:** Huy hiệu điểm danh hiển thị `Chưa điểm danh` màu xám nhạt để nhắc nhở giáo viên/trợ giảng hoàn tất điểm danh ca học.
- **[CASE-04] Lớp học mới chỉ học duy nhất 1 buổi đầu tiên:** Danh sách hiển thị duy nhất 1 thẻ buổi học, buổi này tự động mở rộng trọn vẹn nhận xét, không xuất hiện nút xem thêm lịch sử vì số lượng chưa vượt quá 7 buổi.
- **[CASE-05] Buổi học là bài kiểm tra định kỳ:** Thẻ buổi học mang huy hiệu tím `Kiểm tra`, hiển thị điểm thi `X.X/10` ở góc phải. Đồng thời buổi kiểm tra này được thống kê đồng bộ vào Thẻ SmartCard Kiểm tra và khối danh mục Kiểm tra phía dưới.
- **[CASE-06] Học viên chưa từng làm bài kiểm tra nào trong khóa:** Thẻ SmartCard Kiểm tra hiển thị chỉ số chính là dấu gạch ngang `—` và chỉ số đối sánh là `Trước: —`, không làm lỗi giao diện.
- **[CASE-07] Mất kết nối khi gửi thông báo đôn đốc giáo viên:** Khi người dùng bấm nút `[Đôn đốc GV]` nhưng hệ thống mạng gián đoạn, hệ thống hiển thị thông báo lỗi cục bộ yêu cầu thử lại, không làm treo màn hình.
- **[CASE-08] Học viên chuyển lớp giữa chừng:** Nhật ký buổi học hiển thị liên tục toàn bộ tiến trình học tập của học viên theo dòng thời gian thực tế đã hoàn thành của gói học.
