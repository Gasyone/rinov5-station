# ĐẶC TẢ GIAO DIỆN: TIẾN TRÌNH CÁC BUỔI HỌC & CẢNH BÁO NHẬN XÉT
> **Mã tài liệu:** `SPEC-CARE-SESSION-TIMELINE-NEW-DESIGN`  
> **Phân hệ đối ứng:** `CAP-CARE` (Chăm sóc & Duy trì Học viên)  
> **Màn hình áp dụng:** Màn hình Chi tiết Chăm sóc Học viên & Màn hình Chi tiết Tái phí Học viên  
> **Vị trí hiển thị:** Khối *Nhật ký Buổi học* (`CareSessionTimelineList`)

---

## 1. TỔNG QUAN THIẾT KẾ MỚI CỦA CÁC BUỔI HỌC

Khối tiến trình các buổi học mới được tái cấu trúc theo mô hình dòng thời gian thẻ tinh gọn (Compact Session Cards), mang đến góc nhìn đa chiều về toàn bộ hành trình học tập từng buổi của học viên.

- **Thứ tự hiển thị thời gian:** Sắp xếp **giảm dần theo thời gian / số thứ tự buổi học** (buổi học mới nhất hiển thị trên cùng).
- **Phân tách rõ ràng các nhóm buổi học:**
  1. **Buổi học sắp tới (Upcoming Session):** Hiển thị dạng thanh biểu ngữ 1 dòng (Single-line Banner) màu xanh dịu ở trên cùng, thể hiện thời gian, ca học và bài học sắp diễn ra.
  2. **Lịch sử các buổi học chính khóa (Completed Lessons):** Danh sách các thẻ buổi học đã hoàn thành (mặc định hiển thị 7 buổi gần nhất kèm nút xem thêm lịch sử cũ hơn).
  3. **Khối bài kiểm tra định kỳ (Test Sessions):** Được tách thành một khối độc lập riêng biệt ở phía dưới (tương tự như khối Dự án học tập), giúp theo dõi tập trung kết quả khảo sát định kỳ.
- **Tương tác nhanh không cần chuyển trang:** Nhấp chuột hoặc rê chuột vào thời gian và tên buổi học sẽ mở bảng xem nhanh thông tin buổi học (khung chương trình, phòng học, giáo viên, trợ giảng, sĩ số lớp).

---

## 2. BẢNG MÔ TẢ CHI TIẾT THÀNH PHẦN TRÊN THẺ BUỔI HỌC

*(Không sử dụng số thứ tự STT; mỗi thẻ buổi học gồm 2 hàng thông tin logic rõ ràng)*

| Khu vực hiển thị | Thành phần giao diện | Định dạng & Quy cách thể hiện | Tương tác người dùng | Ý nghĩa nghiệp vụ |
|---|---|---|---|---|
| **Hàng 1: Bên trái** | **Thời gian buổi học** | `[Thứ viết tắt], [Ngày/Tháng]` *(VD: `T4, 22/07` in đậm cho buổi đã học; `T2, 27/07` màu xanh cho buổi sắp tới)* | Rê chuột / Nhấp chuột | Đặt thứ và ngày tháng ngắn gọn lên đầu giúp nhận diện nhanh lịch học trong tuần mà không chiếm dụng không gian năm. |
| **Hàng 1: Bên trái** | **Tên buổi học / Chủ đề** | Văn bản in đậm tên bài học theo khung chương trình *(VD: `Bài 18: Phép chia Số có nhiều chữ số`)* | Rê chuột / Nhấp chuột | Hiển thị tên bài học trọng tâm. Nhấp hoặc rê chuột vào cụm [Thời gian + Tên bài học] sẽ mở bảng nổi chi tiết buổi học. |
| **Hàng 1: Bên trái** | **Huy hiệu Kiểm tra** | Huy hiệu tím `Kiểm tra` *(chỉ xuất hiện ở buổi thi)* | Tĩnh | Phân loại trực quan buổi đánh giá năng lực định kỳ với buổi học lý thuyết/thực hành thông thường. |
| **Hàng 1: Bên phải** | **Huy hiệu Điểm danh** | Huy hiệu bo tròn thể hiện 1 trong 4 trạng thái:<br/>• `Đã đến` *(Xanh lá)*<br/>• `Đến muộn` *(Cam)*<br/>• `Vắng` *(Hồng đỏ)*<br/>• `Chưa điểm danh` *(Xám nhạt)* | Tĩnh | Ghi nhận chính xác hiện diện của học viên tại lớp. Tách rời hoàn toàn với trạng thái nghỉ phép. |
| **Hàng 1: Bên phải** | **Huy hiệu Nghỉ phép (V)** | Nút huy hiệu màu cam hổ phách có biểu tượng liên kết: `Nghỉ phép (V)` | Nhấp chuột mở chi tiết đơn | **Chỉ xuất hiện khi học viên có đơn xin nghỉ phép hợp lệ**. Nhấp vào để xem chi tiết lý do và thời gian gửi đơn của phụ huynh. |
| **Hàng 1: Bên phải** | **Mã bài tập về nhà** | Mã bài tập rút gọn `BT-01`, `BT-02` *(loại bỏ chữ BTVN thừa và điểm thô)*:<br/>• Đã nộp: Chữ xanh dương đậm, có gạch chân khi rê chuột.<br/>• Chưa nộp: Chữ xám trung tính. | Nhấp chuột (khi đã làm) | Bấm vào mã bài tập đã nộp để mở thẳng bài làm của học viên trong tab mới phục vụ kiểm tra đối soát nhanh. |
| **Hàng 1: Bên phải** | **Điểm kiểm tra** | Khối điểm `X.X/10` nền tím chữ tím *(chỉ xuất hiện ở buổi thi đã có điểm)* | Tĩnh | Hiển thị kết quả điểm số bài kiểm tra định kỳ của học viên. |
| **Hàng 2: Toàn hàng** | **Nội dung nhận xét đánh giá** | Văn bản nhận xét chi tiết của giáo viên về buổi học.<br/>• Buổi mới nhất: Mặc định mở rộng toàn văn.<br/>• Các buổi cũ hơn: Thu gọn tối đa 3 dòng kèm nút `... xem thêm` / `... Thu gọn`. | Nhấp nút xem thêm / thu gọn | Cung cấp thông tin chi tiết về sự tiến bộ, thái độ học tập và điểm cần rèn luyện của học viên trong từng ca học. |
| **Hàng 2: Toàn hàng** | **Cảnh báo Chưa có nhận xét** | Khung thông báo trực quan màu vàng hổ phách đặt ở giữa khu vực nội dung (thuần cảnh báo tĩnh) | Tĩnh | **Chỉ áp dụng khi học viên KHÔNG có xin nghỉ**. Cảnh báo nhân viên CSKH biết giáo viên chưa cập nhật đánh giá buổi học. |
| **Hàng 2: Toàn hàng** | **Ghi chú Học viên xin nghỉ** | Dòng thông báo ngắn gọn màu xám nhạt: `Học viên nghỉ có phép ([Lý do]).` hoặc `Học viên nghỉ học không phép.` | Tĩnh | **Xuất hiện khi học viên nghỉ/nghỉ phép**. Tuyệt đối không hiển thị cảnh báo chưa nhận xét đối với trường hợp này. |

---

## 3. CƠ CHẾ CẢNH BÁO "CHƯA CÓ NHẬN XÉT"

### 3.1. Điều kiện kích hoạt cảnh báo
Hệ thống chỉ kích hoạt và hiển thị dòng cảnh báo chưa nhận xét khi thỏa mãn **toàn bộ** các điều kiện sau:
1. Buổi học là buổi đã diễn ra (không áp dụng cho buổi học sắp tới).
2. Chưa có nội dung nhận xét hoặc nội dung nhận xét đang để trống từ phía giáo viên.
3. **ĐIỀU KIỆN TIÊN QUYẾT: Học viên KHÔNG CÓ XIN NGHỈ PHÉP** (`hasLeave === false`).  
   *(Nếu học viên có đơn xin nghỉ phép hợp lệ được phê duyệt, học viên không có mặt tại lớp nên giáo viên không phát sinh đánh giá buổi học. Hệ thống chuyển sang hiển thị dòng thông tin nghỉ phép thay vì cảnh báo thiếu nhận xét).*

### 3.2. Quy cách hiển thị Cảnh báo chưa nhận xét (Thuần cảnh báo, không xét giờ)

Khi buổi học đã kết thúc và học viên **không có xin nghỉ**, nếu giáo viên chưa nhập đánh giá, hệ thống hiển thị một khung cảnh báo đồng nhất ở giữa khu vực nhận xét:

| Thành phần | Quy cách thể hiện | Ý nghĩa |
|---|---|---|
| **Màu sắc & Biểu tượng** | Nền vàng hổ phách (`amber-50`), viền hổ phách nhạt, biểu tượng vòng tròn chấm than (`AlertCircle`, màu `amber-600`) | Gây chú ý nhẹ nhàng, không gây hoang mang, báo hiệu buổi học đang thiếu nhận xét. |
| **Tiêu đề cảnh báo** | `Chưa có nhận xét từ giáo viên:` (chữ in đậm) | Nhận diện ngay vấn đề nghiệp vụ cần giải quyết. |
| **Nội dung hướng dẫn** | `Giáo viên chưa cập nhật đánh giá học viên cho ca học này.` | Thông tin trực quan, ngắn gọn, **không chia theo giờ (không xét mốc >24h hay <24h)** và **không gắn nút bấm đôn đốc**. |

### 3.3. Text ngắn gọn đối với trường hợp Học viên Nghỉ / Nghỉ phép
Khi học viên vắng mặt hoặc có đơn nghỉ phép (`isAbsentOrLeave === true`), khu vực nhận xét hiển thị dòng văn bản ngắn gọn (chữ nghiêng màu xám trung tính), hoàn toàn không hiển thị cảnh báo:
- **Học viên nghỉ có phép:** `Học viên nghỉ có phép ([Lý do nghỉ nếu có]).` *(VD: `Học viên nghỉ có phép (Học viên bị ốm sốt nhẹ).`)*
- **Học viên nghỉ không phép:** `Học viên nghỉ học không phép.`

---

## 4. BẢNG QUY TẮC NGHIỆP VỤ & ĐỊNH DẠNG DỮ LIỆU

| Nghiệp vụ | Quy tắc hiển thị & Xử lý giao diện |
|---|---|
| **Tách bạch Điểm danh và Nghỉ phép** | Điểm danh phản ánh sự có mặt thực tế tại lớp (`Đã đến`, `Đến muộn`, `Vắng`). Huy hiệu `Nghỉ phép (V)` phản ánh tính chất có đơn xin phép hay không. Một buổi học có thể ghi nhận vừa là `Vắng` vừa có `Nghỉ phép (V)`. |
| **Liên kết đơn xin nghỉ** | Khi có huy hiệu `Nghỉ phép (V)`, nhân viên chăm sóc nhấp vào để mở xem chi tiết đơn xin nghỉ (thời gian nộp đơn, lý do nghỉ ốm/bận việc, trạng thái duyệt). |
| **Tối giản mã bài tập về nhà** | Không dùng nhãn `BTVN: BT-01` hay điểm số kèm theo trên dòng tổng quan; chỉ hiển thị mã `BT-01`. Màu xanh thể hiện đã nộp và sẵn sàng mở bài; màu xám thể hiện chưa nộp bài. |
| **Tránh quá tải thông tin nhận xét** | Buổi học gần nhất tự động mở trọn vẹn nhận xét để nhân viên nắm bắt tình hình ngay khi vào hồ sơ; các buổi học tiếp theo thu gọn 3 dòng để giữ độ thoáng cho trang. |
| **Điều kiện ẩn/hiện toàn cục** | • Học viên **Học thử** (`trial`), **Chờ xếp lớp**, **Chờ thanh toán**: Ẩn toàn bộ khối Nhật ký buổi học.<br/>• Học viên **Bảo lưu**: Vẫn hiển thị lịch sử các buổi đã hoàn thành trước ngày bảo lưu kèm banner cảnh báo trạng thái bảo lưu.<br/>• Lớp **Chờ khai giảng**: Hiển thị thanh biểu ngữ 1 dòng thông báo lịch khai giảng dự kiến. |
