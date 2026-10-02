# TIÊU CHÍ NGHIỆM THU & TRƯỜNG HỢP BIÊN (BÁM SÁT PHẠM VI TÀI LIỆU CẬP NHẬT)
## CẬP NHẬT SECTION CHĂM SÓC - ĐANG XỬ LÝ & LỊCH SỬ CHĂM SÓC, MỐC CHĂM SÓC

> **Mã tài liệu:** `SPEC-CARE-INTERACTION-LOGS-AND-MILESTONES-AC`  
> **Tham chiếu nguồn:** [Tài liệu Confluence DoBTCQ](https://rinoeduai.atlassian.net/wiki/x/DoBTCQ)  
> **Phân hệ đối ứng:** `CAP-CARE` (Chăm sóc & Duy trì Học viên)  
> **Màn hình áp dụng:** Chi tiết học viên màn Chi tiết chăm sóc và Chăm sóc tái phí  
> **Bản chất tài liệu:** Đặc tả tiêu chí nghiệm thu cho các nội dung **cập nhật/điều chỉnh bổ sung (Delta Update)**, tập trung đúng phạm vi mô tả, không mở rộng sang các chức năng khác.

---

## 1. TẬP TRUNG ĐỐI CHIẾU CÁC ĐIỂM CẬP NHẬT (SCOPE DELTA)

Tài liệu gốc chỉ mô tả đúng 5 điểm thay đổi cụ thể trên giao diện:

1. **Section Liên hệ & Ghi nhận chăm sóc (Tab Chăm sóc):**
   - Tự động đổi Kênh sang `Gọi điện` và Kết quả cuộc gọi sang `Nghe máy`.
   - Nút `Lưu`: Giữ nguyên trạng thái `Đang xử lý`, bổ sung: ẩn biểu tượng cuộc gọi (badger) sau khi ấn.
   - Nút `Lưu & Hoàn thành`: Chuyển sang `Hoàn thành`, bổ sung: ẩn biểu tượng cuộc gọi sau khi ấn.
2. **Khối mở rộng lịch sử cũ (Áp dụng cho cả Section A, B, C):**
   - Đổi giao diện nút bấm thu gọn thành: Thanh màu xanh dương nhạt với biểu tượng đồng hồ lịch sử và dòng chữ: `Lịch sử (X) lần ghi nhận chăm sóc trước đó` kèm mũi tên xổ xuống `▼`.
   - Điều kiện hiển thị mới: **Chỉ hiển thị khi có từ 2 lần chăm sóc trở lên** (thay thế cho hiển thị gọi nhỡ trước đó).
3. **Cấu trúc hiển thị lịch sử chăm sóc trước đó:**
   - Cấu trúc 3 hàng cho chăm sóc thông thường:
     + Hàng 1 (Đầu mục): `[CS/GV]: [Tên nhân sự]` · `[Kênh: Cuộc gọi / Zalo / Trực tiếp]` · `Người nhận: [Phụ huynh / Học viên]` --- `[dd/mm/yyyy]`.
     + Hàng 2 (Trình phát ghi âm - nếu là cuộc gọi): Nút Play/Pause kèm thời lượng (ví dụ: `▶ 01:45`), nghe lại trực tiếp ngay trong bảng nổi.
     + Hàng 3 (Nội dung & Ý kiến): Ghi chú đầy đủ, ý kiến phụ huynh tách riêng chữ nghiêng xanh ngọc: `• Phụ huynh phản hồi: "..."`.
4. **Đơn hàng liên kết dành riêng cho Tái phí (Section B & C):**
   - Thêm Hàng thứ 4: Biểu tượng túi hàng + `[Mã đơn]` *(liên kết xanh mở thẳng trang báo giá `/quote/[mã_đơn]`)* · Tên gói sản phẩm · Trạng thái thanh toán (chữ màu đen, có nền).
5. **Section Mốc chăm sóc (Section C):**
   - Bổ sung nhãn tên viết tắt (Mã mốc) vào trước tên mỗi mốc chăm sóc.
   - Thẻ Loại chăm sóc (Mã mốc liên quan): Nhãn bo góc chữ tím/hồng nhạt ở góc trên bên phải, bổ sung khung nổi (popover) khi rê chuột.
   - Bổ sung Trạng thái Tái phí `Thất bại` (màu đỏ, viền đỏ, nền trắng) đi kèm trạng thái chăm sóc nếu tái phí thất bại.

---

## 2. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA - AC)

### AC-01: Tự động gán mặc định Kênh và Kết quả cuộc gọi ở Tab Chăm sóc
* **Giả sử:** Người dùng đang ở màn hình Chi tiết chăm sóc hoặc Chi tiết tái phí và mở Tab Chăm sóc.
* **Khi:** Biểu mẫu Ghi nhận chăm sóc hiển thị.
* **Thì:**
  1. Trường Kênh liên hệ tự động nhận giá trị là `Gọi điện`.
  2. Trường Kết quả cuộc gọi tự động nhận giá trị là `Nghe máy`.
  3. Người dùng có thể chọn lại giá trị khác trong ô thả xuống nếu kết quả thực tế khác `Nghe máy`.

---

### AC-02: Hành vi ẩn biểu tượng cuộc gọi khi bấm Lưu hoặc Lưu & Hoàn thành
* **Giả sử:** Người dùng đang thực hiện ghi nhận tương tác chăm sóc học viên.
* **Khi:** Người dùng nhấn nút lưu:
* **Thì:**
  1. **Khi bấm `Lưu`:** Hệ thống ghi nhận dữ liệu, giữ nguyên trạng thái `Đang xử lý` của học viên và **ẩn biểu tượng cuộc gọi (badger)** trên hồ sơ.
  2. **Khi bấm `Lưu & Hoàn thành`:** Hệ thống ghi nhận dữ liệu, chuyển toàn bộ thẻ phát sinh sang `Hoàn thành` và **ẩn biểu tượng cuộc gọi (badger)** trên hồ sơ.

---

### AC-03: Điều kiện hiển thị Khối mở rộng lịch sử cũ (Ngưỡng từ 2 lần trở lên)
* **Giả sử:** Học viên có dữ liệu lịch sử các lần chăm sóc trước đó.
* **Khi:** Hệ thống kết xuất khối lịch sử chăm sóc cũ.
* **Thì:**
  1. **Nếu có từ 2 lần chăm sóc trở lên ($X \ge 2$):** Hiển thị thanh màu xanh dương nhạt với biểu tượng đồng hồ và nội dung `Lịch sử (X) lần ghi nhận chăm sóc trước đó` kèm mũi tên xổ xuống `▼`.
  2. **Nếu có ít hơn 2 lần chăm sóc (0 lần hoặc 1 lần):** Ẩn hoàn toàn thanh nút bấm thu gọn này.

---

### AC-04: Cấu trúc hiển thị chi tiết từng lần chăm sóc cũ & Trình phát ghi âm
* **Giả sử:** Danh sách lịch sử chăm sóc cũ đang mở rộng.
* **Khi:** Người dùng quan sát thông tin của từng lần chăm sóc.
* **Thì:**
  1. **Dòng đầu mục:** Hiển thị `[CS/GV]: [Tên nhân sự]` · `[Kênh]` · `Người nhận: [Phụ huynh / Học viên]` --- `[dd/mm/yyyy]`.
  2. **Trình phát ghi âm:** Chỉ hiển thị khi Kênh là `Cuộc gọi`, có biểu tượng Play/Pause kèm thời lượng (ví dụ: `▶ 01:45`). Nhấp vào có thể nghe lại trực tiếp âm thanh ngay trong bảng nổi.
  3. **Nội dung & Ý kiến:** Hiển thị trọn vẹn ghi chú, đoạn ý kiến phụ huynh tách riêng bằng chữ in nghiêng màu xanh ngọc: `• Phụ huynh phản hồi: "..."`.

---

### AC-05: Hiển thị Đơn hàng liên kết (Dành riêng cho Chăm sóc Tái phí)
* **Giả sử:** Đang xem chi tiết lịch sử chăm sóc trên màn hình Chăm sóc Tái phí.
* **Khi:** Lần chăm sóc cũ có gắn với đơn hàng tái phí.
* **Thì:**
  1. Hiển thị thêm dòng: Biểu tượng túi hàng + `[Mã đơn]` · Tên gói sản phẩm · Trạng thái thanh toán (văn bản chữ đen, có nền).
  2. Khi nhấp vào `[Mã đơn]`: Hệ thống mở liên kết dẫn đến trang báo giá `/quote/[mã_đơn]`.
  3. Với màn hình chăm sóc thông thường không phải tái phí: Không hiển thị dòng này.

---

### AC-06: Mã mốc viết tắt, Popover loại chăm sóc & Trạng thái Tái phí Thất bại
* **Giả sử:** Người dùng xem Section Lịch sử chăm sóc và Mốc chăm sóc.
* **Khi:** Hệ thống hiển thị các thẻ chăm sóc và danh mục mốc.
* **Thì:**
  1. Trước tên mỗi mốc chăm sóc hiển thị nhãn tên viết tắt (Mã mốc).
  2. Góc trên bên phải thẻ hiển thị nhãn bo góc chữ tím/hồng nhạt là Mã mốc chăm sóc liên quan; khi rê chuột vào nhãn này sẽ hiển thị khung nổi (popover) thông tin loại chăm sóc.
  3. Nếu trạng thái tái phí của mốc là Thất bại: Hiển thị thêm nhãn `Thất bại` với chữ màu đỏ, viền đỏ, nền trắng bên cạnh trạng thái chăm sóc.

---

## 3. CÁC TRƯỜNG HỢP BIÊN TRỰC TIẾP TỪ THAY ĐỔI (CORNER CASES)

Tập trung duy nhất vào các tình huống biên trực tiếp sinh ra từ 5 nội dung điều chỉnh trên:

* **[CASE-01] Số lần chăm sóc cũ đúng bằng 1 ($X = 1$):**
  * *Tình huống:* Học viên chỉ mới có đúng 1 lần chăm sóc trong lịch sử.
  * *Xử lý:* Do quy tắc chỉ hiển thị thanh thu gọn khi có từ 2 lần trở lên, thanh `Lịch sử (X) lần...` bị ẩn hoàn toàn, tránh hiển thị nút thu gọn/mở rộng thừa thãi cho 1 bản ghi duy nhất.

* **[CASE-02] Số lần chăm sóc cũ bằng 0 ($X = 0$):**
  * *Tình huống:* Học viên mới tạo hoặc chưa từng phát sinh lượt chăm sóc nào.
  * *Xử lý:* Thanh `Lịch sử (X) lần...` bị ẩn hoàn toàn.

* **[CASE-03] Thao tác Lưu thất bại:**
  * *Tình huống:* Người dùng bấm nút Lưu hoặc Lưu & Hoàn thành nhưng biểu mẫu thiếu thông tin hoặc gặp lỗi kết nối máy chủ.
  * *Xử lý:* Biểu tượng cuộc gọi (badger) **không được ẩn**. Biểu tượng chỉ ẩn khi hệ thống xác nhận lưu dữ liệu thành công.

* **[CASE-04] Kênh là Cuộc gọi nhưng không có tệp ghi âm:**
  * *Tình huống:* Cuộc gọi nhỡ, không nghe máy, hoặc cuộc gọi thoại không phát sinh tệp ghi âm.
  * *Xử lý:* Hàng trình phát ghi âm `▶ 01:45` không hiển thị, giao diện dồn nội dung ghi chú lên liền kề dòng đầu mục.

* **[CASE-05] Kênh là Zalo hoặc Trực tiếp:**
  * *Tình huống:* Lần chăm sóc được thực hiện qua Zalo hoặc gặp mặt trực tiếp.
  * *Xử lý:* Hàng trình phát ghi âm tự động không xuất hiện (chỉ hiển thị dòng đầu mục và nội dung ghi chú).

* **[CASE-06] Ghi chú không có ý kiến phản hồi của phụ huynh:**
  * *Tình huống:* Nhân viên chỉ nhập tóm tắt công việc mà phụ huynh không có phản hồi đặc biệt.
  * *Xử lý:* Không hiển thị dòng in nghiêng xanh ngọc `• Phụ huynh phản hồi: "..."` rỗng, chỉ hiển thị nội dung ghi chú chăm sóc.

* **[CASE-07] Mốc chăm sóc tái phí chưa gắn đơn hàng:**
  * *Tình huống:* Lần chăm sóc tái phí diễn ra ở giai đoạn đầu, chưa tạo đơn hàng báo giá.
  * *Xử lý:* Hàng thứ 4 về đơn hàng liên kết tự động ẩn, chỉ hiển thị 3 hàng như chăm sóc thông thường.

* **[CASE-08] Trạng thái chăm sóc Hoàn thành nhưng Tái phí Thất bại:**
  * *Tình huống:* Nhân viên đã hoàn tất chăm sóc mốc nhưng phụ huynh từ chối tái phí.
  * *Xử lý:* Khối mốc hiển thị song song cả 2 nhãn: Nhãn trạng thái chăm sóc và nhãn `Thất bại` (chữ đỏ, viền đỏ, nền trắng) mà không bị xung đột hay ghi đè lên nhau.
