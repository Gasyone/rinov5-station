# ĐẶC TẢ GIAO DIỆN: CỤM THẺ CHỈ SỐ HỌC TẬP THÔNG MINH (LEARNING SMARTCARDS)
> **Mã tài liệu:** `SPEC-CARE-SMARTCARDS-METRICS`  
> **Phân hệ đối ứng:** `CAP-CARE` (Chăm sóc & Duy trì Học viên)  
> **Vị trí màn hình:** Màn hình Chi tiết Chăm sóc Học viên & Màn hình Chi tiết Tái phí Học viên  
> **Phân vùng áp dụng:** 
> 1. Lớp học hiện tại: Nằm trong khối *Nhật ký Buổi học* (`CareSessionTimelineList`), đặt ngay trên danh sách các ca học.
> 2. Lớp học lịch sử: Nằm trong mục *Kết quả học tập tổng kết* (`HistoricalClassesList`) của từng lớp học cũ.

---

## 1. TỔNG QUAN THIẾT KẾ MỚI

Cụm thẻ chỉ số học tập mới được thiết kế theo mô hình **SmartCards tinh gọn 3 thẻ** nằm ngang (Lưới 3 cột), tập trung trọn vẹn vào "Tam giác chất lượng học thuật" bao gồm **Chuyên cần - Bài tập về nhà - Điểm kiểm tra**.

- **Vai trò:** Bảng điều khiển tóm tắt nhanh (Quick Metric Summary) giúp nhân viên Chăm sóc Khách hàng (CSKH) và Giáo viên nắm bắt toàn diện tình hình học tập của học viên trong 3 giây đầu tiên quan sát hồ sơ.
- **Tính chất tương tác:** **Thuần hiển thị trực quan chỉ đọc (Read-only)**, không gắn sự kiện nhấp chuột mở hộp thoại (modal), đảm bảo giao diện gọn gàng và không gây phân tán thao tác.
- **Quy chuẩn định dạng:**
  - Chuyên cần và BTVN hiển thị dạng phân số số lượng **`x/x`** (hoặc `x/y`). Tuyệt đối không dùng đơn vị phần trăm `%` cho chuyên cần.
  - Điểm kiểm tra và điểm trung bình BTVN hiển thị thang điểm 10 với 1 chữ số thập phân.
  - Tích hợp biểu tượng nhận diện riêng biệt cho từng phân hệ: Xanh lá (Chuyên cần), Xanh dương (BTVN), Cam hổ phách (Kiểm tra).

---

## 2. BẢNG MÔ TẢ CHI TIẾT THIẾT KẾ MỚI

| Tên Thẻ / Phân hệ | Biểu tượng trực quan | Chỉ số chính (Góc trên, bên trái) | Chỉ số ngữ cảnh (Góc trên, bên phải) | Nhãn định danh (Hàng dưới cùng) | Ý nghĩa nghiệp vụ & Quy tắc hiển thị |
|---|---|---|---|---|---|
| **Chuyên cần** | Biểu tượng người học tích điểm (`UserCheck`, màu xanh lá `emerald-600`) | Phân số số buổi có mặt **`x/x`** (VD: `6/7`, `3/4`, `0/0` - font to, in đậm, màu xanh lá) | Text cảnh báo: `Muộn: 1` (hoặc số ca đi muộn, màu cam hổ phách `amber-600`) | Chữ in hoa `CHUYÊN CẦN` (màu xám trung tính `muted-foreground`) | - Thể hiện tỷ lệ buổi có mặt trên tổng số buổi học đã diễn ra (`x/x`), **bắt buộc dùng dạng phân số, không dùng tỷ lệ `%`**.<br/>- Góc phải cảnh báo số lần đi học muộn (`Muộn: X`) giúp CSKH phát hiện ngay các bất thường nền nếp để kịp thời nhắc nhở phụ huynh.<br/>- Thẻ hiển thị chỉ đọc, không mở hộp thoại khi nhấp. |
| **Bài tập về nhà (BTVN)** | Biểu tượng cuốn sách mở (`BookOpen`, màu xanh dương tri thức `sky-600`) | Phân số bài hoàn thành **`x/x`** (VD: `6/7`, `0/4` - font to, in đậm, màu xanh dương) | Điểm chất lượng: `Trung bình: 7.5` (màu xám trung tính) | Chữ in hoa `BTVN` (màu xám trung tính `muted-foreground`) | - Phản ánh đồng thời 2 chiều thông tin: số lượng bài đã nộp trên tổng số bài được giao (`x/x`) và chất lượng làm bài thực tế (`Trung bình: Y.Y`).<br/>- Giúp CSKH và giáo viên đánh giá đúng độ hiểu bài và ý thức tự học ở nhà của học viên.<br/>- Thẻ hiển thị chỉ đọc, không mở hộp thoại khi nhấp. |
| **Kiểm tra** | Biểu tượng huy hiệu khen thưởng (`Award`, màu cam hổ phách `amber-600`) | Điểm thi gần nhất **`8.5`** (font to, in đậm, màu cam thành tích; hoặc `—` nếu chưa có bài thi) | Đối sánh kỳ trước: `Trước: 8.0` (màu xám trung tính; hoặc `Trước: —`) | Chữ in hoa `KIỂM TRA` (màu xám trung tính `muted-foreground`) | - Thể hiện kết quả bài kiểm tra gần nhất kèm điểm thi của kỳ liền kề trước đó (`Trước: Z.Z`) để thấy ngay xu hướng tiến bộ hay sụt giảm điểm số.<br/>- Cung cấp bằng chứng học thuật thuyết phục giúp CSKH tư vấn lộ trình và thúc đẩy tái phí với phụ huynh.<br/>- Thẻ hiển thị chỉ đọc, không mở hộp thoại khi nhấp. |

---

## 3. BẢNG QUY TẮC DỮ LIỆU & ĐỊNH DẠNG HIỂN THỊ

| Trường Dữ liệu | Vị trí trên Thẻ | Định dạng chuẩn | Quy tắc tính toán & Trích xuất dữ liệu |
|---|---|---|---|
| **Số buổi chuyên cần** | Thẻ Chuyên cần (Góc trên, trái) | Phân số `x/x` (VD: `6/7`, `0/0`) | `Số buổi có mặt / Tổng số buổi đã học`. Nếu chưa học buổi nào hiển thị `0/0`. Tuyệt đối không dùng `%`. |
| **Số lần đi muộn** | Thẻ Chuyên cần (Góc trên, phải) | Text: `Muộn: [Số lần]` | Đếm tổng số ca học có trạng thái điểm danh là `late`. Khi chưa đi muộn lần nào thì hiển thị `Muộn: 0` hoặc để trống. |
| **Số bài BTVN hoàn thành** | Thẻ BTVN (Góc trên, trái) | Phân số `x/x` (VD: `6/7`) | `Số bài nộp đạt / Tổng số bài được giao`. |
| **Điểm trung bình BTVN** | Thẻ BTVN (Góc trên, phải) | Text: `Trung bình: [Điểm]` | Trung bình cộng điểm số các bài tập đã chấm, định dạng 1 số thập phân (VD: `7.5`). |
| **Điểm kiểm tra hiện tại** | Thẻ Kiểm tra (Góc trên, trái) | Số thập phân hoặc `—` | Điểm bài thi định kỳ gần nhất (VD: `8.5`). Nếu chưa phát sinh bài thi hiển thị dấu gạch ngang `—`. |
| **Điểm kiểm tra kỳ trước** | Thẻ Kiểm tra (Góc trên, phải) | Text: `Trước: [Điểm]` | Điểm bài thi định kỳ liền trước (VD: `Trước: 8.0`). Nếu là kỳ đầu tiên hiển thị `Trước: —`. |

---

## 4. QUY TẮC HIỂN THỊ & VẬN HÀNH TOÀN CỤC

1. **Đồng bộ hiển thị Lớp hiện tại và Lớp cũ:** Cụm 3 SmartCard được áp dụng đồng nhất cả ở khối Nhật ký buổi học (lớp đang học) và khối Kết quả học tập tổng kết (lớp cũ trong lịch sử).
2. **Ẩn hiển thị theo trạng thái học viên:** 
   - Với học viên diện **Học thử** (`placementStatus === 'trial'`), học viên **Chờ xếp lớp**, **Chờ thanh toán**: Ẩn toàn bộ khối Nhật ký buổi học và cụm SmartCards này.
   - Với lớp **Chờ khai giảng** (`placementStatus === 'awaiting_opening'`): Không hiển thị cụm SmartCards.
3. **Thuần hiển thị chỉ đọc (Static Display):** Toàn bộ các thẻ trong cụm không gắn sự kiện nhấp mở hộp thoại, không có con trỏ chuột dạng bàn tay (`pointer`), không có hiệu ứng hover đổi màu.
