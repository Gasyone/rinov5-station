# US-BT03: Xem & Cập nhật chi tiết Booking Test

## 1. User Story

**Là một** nhân viên Sale / Quản lý chi nhánh / Giáo viên,
**tôi muốn** xem chi tiết lịch kiểm tra, chỉnh sửa thông tin nhân sự và ghi chú, đồng thời chuyển trạng thái của lịch hẹn qua các bước trong quy trình đánh giá,
**để** theo dõi tiến trình kiểm tra đầu vào của học viên và cập nhật kết quả kịp thời.

## 2. Business Value

- **Theo dõi tiến trình xuyên suốt:** Giúp Sale và Quản lý nắm bắt chính xác lịch hẹn đang ở bước nào (đã phân giáo viên chưa, đã kiểm tra chưa, hay đã có kết quả).
- **Lưu vết thông tin (Audit):** Việc lưu trữ lịch sử ghi chú theo thời gian (chỉ thêm mới, không xóa) giúp các phòng ban (Sale, Vận hành, Giáo viên) có thể đọc và hiểu ngữ cảnh của học viên mà không bị mất thông tin cũ.
- **Tăng hiệu suất luồng công việc:** Cho phép thay đổi giáo viên linh hoạt nếu có phát sinh (nghỉ ốm, kẹt ca) mà không cần phải xóa lịch hẹn và tạo lại từ đầu.

## 3. Phạm vi (Scope) & Điều kiện tiên quyết

### Điều kiện tiên quyết (Preconditions)
- Hệ thống đã tồn tại ít nhất một Booking Test được tạo thành công từ `US-BT02: Tạo mới Booking Test`.

### Trong phạm vi (In Scope)
- Hiển thị toàn bộ thông tin chi tiết của 1 lịch kiểm tra (thông tin cá nhân, gia đình, nhân sự, lịch sử ghi chú).
- Xem và thêm mới lịch sử ghi chú (chỉ thêm mới, không xóa hay ghi đè nội dung cũ).
- Chỉnh sửa thông tin nhân sự (Đổi giáo viên phụ trách đánh giá).
- Chuyển đổi qua lại các trạng thái của lịch hẹn (từ "Chờ đánh giá" -> "Đang đánh giá" -> "Hoàn thành" / "Đã hủy").
- Hiển thị (chỉ xem) các kết quả đã được đánh giá (điểm làm bài trực tuyến, điểm Nói, Lộ trình học tập).

### Ngoài phạm vi (Out of Scope)
- Chức năng Giáo viên nhập điểm bài Nói và chọn Lộ trình trực tiếp (Nằm trong `US-BT04: Đánh giá Năng lực Tiếng Anh`).
- Quá trình làm bài kiểm tra trên thiết bị (iPad) và đồng bộ điểm về hệ thống (Nằm trong `US-BT05: Đồng bộ kết quả đánh giá`).

---

## 4. Mô tả chi tiết (Giao diện & Logic)

Cửa sổ chi tiết lịch hẹn mở ra khi nhấn vào biểu tượng "Xem chi tiết" (hình con mắt) trên danh sách tổng quan. Cửa sổ hiển thị bố cục 2 cột trên màn hình máy tính (1 cột trên điện thoại), giới hạn chiều rộng và chiều cao tối đa phù hợp với màn hình.

### 4.1. Bố cục tổng quan

| Vùng | Kích thước | Mô tả |
|------|-----------|-------|
| **Tiêu đề (Header)** | Toàn bộ chiều rộng | Hiển thị "Chi tiết Sự kiện" và mã lịch hẹn. Góc phải chứa các nút thao tác (thay đổi tùy theo trạng thái và chế độ chỉnh sửa). |
| **Cột trái** | Chiều rộng cố định | Thông tin tóm tắt: Ảnh đại diện, tên học viên, môn học, nhãn trạng thái, thông tin lịch hẹn. Có thanh cuộn độc lập. |
| **Cột phải** | Co giãn linh hoạt | Thông tin chi tiết: Thông tin gia đình, nhân sự phụ trách, kết quả đánh giá, lịch sử ghi chú. Có thanh cuộn độc lập. |

### 4.2. Tiêu đề — Nút thao tác

Các nút hiển thị tùy theo **trạng thái hiện tại** của lịch hẹn và hệ thống có đang ở **chế độ chỉnh sửa** hay không:

**Khi hệ thống KHÔNG ở chế độ chỉnh sửa:**

| Nút thao tác | Kiểu hiển thị | Điều kiện xuất hiện | Tác dụng | Ghi chú |
|------------|-------------|-------------------|-------|---------|
| Chuyển "Đang đánh giá" | Nút bấm nổi bật (màu xanh dương) | Lịch hẹn đang ở nhóm trạng thái: "Chờ đánh giá", "Đã đặt lịch phỏng vấn", v.v. | Cập nhật trạng thái thành "Đang đánh giá". | Hệ thống lưu lại thay đổi ngay lập tức. |
| Đánh giá Thất bại | Nút bấm cảnh báo (màu đỏ) | Lịch hẹn đang ở nhóm trạng thái: "Đang đánh giá", "Đã phỏng vấn", "Đang làm bài" | Cập nhật trạng thái thành "Đánh giá thất bại". | |
| Hoàn thành | Nút bấm thành công (màu xanh lá) | Cùng điều kiện với nút "Đánh giá Thất bại" | Cập nhật trạng thái thành "Hoàn thành". | |
| Hủy lịch | Nút bấm viền cảnh báo (màu đỏ) | Lịch hẹn chưa kết thúc (KHÔNG thuộc các trạng thái: "Hoàn thành", "Đã hủy", "Đánh giá thất bại", "Đã có kết quả") | Cập nhật trạng thái thành "Đã hủy". | |
| Chỉnh sửa | Nút bấm phụ (kèm biểu tượng cây bút) | Luôn hiển thị | Bật chế độ chỉnh sửa để thay đổi thông tin. | |
| Đóng (X) | Biểu tượng nút chéo | Luôn hiển thị | Đóng cửa sổ chi tiết. | |

**Khi hệ thống Ở chế độ chỉnh sửa:**

| Nút thao tác | Kiểu hiển thị | Tác dụng | Ghi chú |
|------------|-------------|-------|---------|
| Hủy bỏ | Nút bấm phụ | Thoát khỏi chế độ chỉnh sửa, khôi phục thông tin về trạng thái ban đầu chưa chỉnh sửa. | |
| Lưu thay đổi | Nút bấm nổi bật (màu tím) | Lưu các thông tin vừa thay đổi vào hệ thống và thoát khỏi chế độ chỉnh sửa. | |

### 4.3. Cột trái — Thông tin tóm tắt

| Thành phần | Kiểu hiển thị | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Ảnh đại diện | Hình tròn lớn | Chữ cái đầu tiên trong tên học viên. | Nền màu nổi bật, có viền trắng. |
| Tên học viên | Tiêu đề lớn, in đậm | Họ và tên đầy đủ của học viên. | |
| Môn học | Nhãn thông tin | Ví dụ: "Môn: Tiếng Anh" hoặc "Môn: Toán". | |
| Nhãn trạng thái | Nhãn bo góc | Trạng thái hiện tại của lịch hẹn, có màu sắc phân loại riêng biệt cho từng trạng thái. | Bao gồm 8 trạng thái và màu sắc tiêu chuẩn (xanh lá, xanh dương, tím, cam, đỏ...). |
| Thẻ Lịch hẹn | Khối thông tin có viền | Gồm 3 dòng: **Thời gian** (ngày tháng giờ), **Chương trình học**, **Cơ sở / Phòng kiểm tra**. | |

### 4.4. Cột phải — Thông tin Gia đình

| Thành phần | Kiểu hiển thị | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Tiêu đề khu vực | Nhãn + Biểu tượng Nhóm | Hiển thị "GIA ĐÌNH". | |
| Danh sách thành viên | Các khối thông tin ngang | Mỗi thành viên gồm: Biểu tượng ảnh đại diện, Tên, Số điện thoại (bị che một phần). Khi đưa chuột vào: hiện nút Gọi điện và nút Sao chép số điện thoại. | Nếu học viên chưa có hồ sơ gia đình chi tiết: Hiển thị tên phụ huynh và số điện thoại được nhập lúc đặt lịch. |

### 4.5. Cột phải — Nhân sự phụ trách

| Thành phần | Kiểu hiển thị | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Tiêu đề khu vực | Nhãn + Biểu tượng Cặp xách | Hiển thị "NHÂN SỰ". | |
| Người tạo lịch | Khối thông tin | Ảnh đại diện, nhãn "Người tạo lịch", tên nhân viên thao tác. | Lấy từ thông tin tài khoản tạo lịch hẹn, mặc định là "Quản trị viên" nếu không xác định được. |
| Giáo viên Đánh giá | Khối thông tin + Chỉnh sửa nhanh | Ảnh đại diện, nhãn "Giáo viên Đánh giá". **Nếu đã có Giáo viên**: hiển thị tên và nút "Đổi". **Nếu chưa có Giáo viên**: hiển thị Hộp chọn giáo viên và nút "Chọn". | Khi bấm "Đổi", hệ thống tự động bật chế độ chỉnh sửa. Danh sách chọn hiển thị tên tất cả giáo viên khả dụng. |

### 4.6. Cột phải — Kết quả đánh giá

| Thành phần | Kiểu hiển thị | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Tiêu đề khu vực | Nhãn + Biểu tượng Bảng điểm | Hiển thị "KẾT QUẢ ĐÁNH GIÁ". | |
| Trình độ đầu vào | Hộp chọn thả xuống | Hộp chọn phân loại trình độ. Danh sách từ thấp đến cao (Pre-Kindie, Kindie 1, Pre-Level 0, Level 1A...). Mặc định là: Chưa chọn. | Giáo viên chọn sau khi đánh giá xong để xếp lớp. Giá trị này được lưu vào Kết quả bài kiểm tra. |
| Mức độ chi tiết (Level) | Hộp chọn thả xuống | Hộp chọn phân loại chi tiết hơn cho từng Trình độ (A1, A, B, C). Danh sách này thay đổi tùy thuộc vào Trình độ đã chọn ở trên. | Bị vô hiệu hóa không cho bấm nếu chưa chọn "Trình độ đầu vào" ở trên. |
| Thẻ Lộ trình | Khối thống kê nhỏ | Nhãn "Lộ trình", hiển thị kết quả Lộ trình học tập đề xuất. Hiển thị "—" nếu chưa có. | Chỉ được xem, không cho chỉnh sửa trực tiếp tại đây. Kết quả này lấy từ màn hình Đánh giá của Giáo viên. |
| Thẻ Điểm Nói | Khối thống kê nhỏ | Nhãn "Điểm Nói", hiển thị điểm số (ví dụ: "6.5/8"). Hiển thị "—" nếu chưa có. | Chỉ được xem. Kết quả lấy từ màn hình Đánh giá của Giáo viên. |
| Thẻ Điểm Trắc nghiệm | Khối thống kê nhỏ | Nhãn "Điểm Trắc nghiệm", hiển thị điểm số (ví dụ: "27/40"). Hiển thị "-" nếu chưa có. | Chỉ được xem. Kết quả đồng bộ từ hệ thống làm bài trực tuyến. |
| Đường dẫn Bài Test | Nút bấm liên kết | Chứa liên kết chuyển hướng đến bài làm của học sinh. Bấm vào sẽ mở thẻ trình duyệt mới. | Chỉ hiển thị khi đã có đường dẫn hoặc khi bật chế độ chỉnh sửa. |
| Đánh giá Năng lực | Nút bấm thao tác | Nút bấm nổi bật giúp Giáo viên mở bảng chấm điểm chi tiết. | Luôn hiển thị. Mở ra màn hình "Đánh giá Năng lực Tiếng Anh" tương ứng. |
| Cổng kết quả (Portal) | Nút bấm liên kết | Nút bấm mở trang xem điểm dành cho phụ huynh/học sinh. | Luôn hiển thị. |

**Mối quan hệ giữa Trình độ đầu vào và Mức độ chi tiết:**

| Trình độ (ví dụ) | Lựa chọn Mức độ chi tiết |
|------------------|--------------|
| Chưa chọn | (Khóa lựa chọn) |
| Pre-Kindie, Kindie 1-3 | A1, A, B, C |
| Pre-Level 0 | A1, A, B, C |
| Level 1A — Level 3B | A1, A, B, C |

> Giáo viên chọn **Trình độ đầu vào** trước, sau đó chọn **Mức độ chi tiết** để xác định chính xác vị trí xếp lớp. Cả 2 hộp chọn này luôn có thể thao tác (không cần bật chế độ chỉnh sửa toàn màn hình), cho phép giáo viên cập nhật bất cứ lúc nào.

### 4.7. Cột phải — Lịch sử ghi chú

| Thành phần | Kiểu hiển thị | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Tiêu đề khu vực | Nhãn + Biểu tượng Tin nhắn | Hiển thị "LỊCH SỬ GHI CHÚ". | Đây không phải là một ô văn bản đơn thuần, mà là một danh sách các luồng ghi chú theo thời gian. |
| Danh sách ghi chú | Danh sách dòng thời gian | Hiển thị tất cả ghi chú đã tạo, sắp xếp mới nhất lên đầu. Mỗi dòng bao gồm: Nội dung, người tạo, thời gian ghi nhận. | Nếu chưa có, hiển thị văn bản mờ "Không có ghi chú nào." |
| Ô nhập ghi chú mới | Ô nhập văn bản nhiều dòng | Ô nhập "Thêm ghi chú mới...". Luôn hiển thị dưới cùng danh sách, không cần bật chế độ chỉnh sửa. | Ghi chú mới sẽ được nối vào đầu danh sách lịch sử. Tên người tạo tự động lấy từ tài khoản đang đăng nhập. |

> **Khác biệt so với thiết kế cũ:** Ghi chú không còn là một ô nhập liệu đơn thuần bị xóa đi khi sửa lại, mà là **danh sách tích lũy** — mỗi lần thêm ghi chú mới hệ thống sẽ giữ lại toàn bộ lịch sử trao đổi cũ.

### 4.8. Các trường thông tin có thể chỉnh sửa

Khi bật chế độ chỉnh sửa, giao diện thay đổi các khu vực nhập liệu như sau:

| Trường thông tin | Giao diện trong chế độ chỉnh sửa |
|-------|----------------------|
| Trạng thái lịch hẹn | Không thay đổi trong chế độ này (sử dụng các nút thao tác riêng ở góc trên). |
| Trạng thái Xác nhận tham gia | Bật giao diện hộp chọn thay đổi xác nhận (Đã xác nhận, Từ chối, ...). |
| Trình độ đầu vào | Hộp chọn thả xuống (Luôn thao tác được, không phụ thuộc chế độ chỉnh sửa). |
| Mức độ chi tiết | Hộp chọn thả xuống (Luôn thao tác được, không phụ thuộc chế độ chỉnh sửa). |
| Ghi chú | Ô nhập văn bản liên tục (Luôn thao tác được, không phụ thuộc chế độ chỉnh sửa). |
| Đường dẫn Bài Test | Khung nhập văn bản. |
| Giáo viên Đánh giá | Hộp chọn có hỗ trợ tìm kiếm tên. |
| Người phỏng vấn | Khung nhập văn bản (nếu chưa áp dụng hộp chọn). |
| Nhân viên vận hành | Khung nhập văn bản (nếu chưa áp dụng hộp chọn). |

### 4.9. Sơ đồ luồng chuyển đổi trạng thái

```
                    ┌─────────────────────┐
                    │    Đã đặt lịch       │
                    │ (Chờ kiểm tra)       │
                    └─────────┬───────────┘
                              │
               ┌──────────────┼──────────────┐
               │              │              │
               ▼              │              ▼
    ┌──────────────────┐      │     ┌─────────────┐
    │  Đang đánh giá   │      │     │   Đã hủy     │
    │  (Đang làm bài)  │      │     └─────────────┘
    └────────┬─────────┘      │
             │                │
      ┌──────┼──────┐        │
      │      │      │        │
      ▼      ▼      ▼        │
 Hoàn thành  Không   Đã hủy   │
             đạt              │
                              │
  Trạng thái phụ (Phân biệt):  │
  ┌───────────────────────┐   │
  │ Đã phỏng vấn xong     │───┘
  │ Đã làm bài test xong  │
  └───────────────────────┘
```

---

## 5. Góc khuất hệ thống (Corner Cases)

| # | Trường hợp | Hành vi mong đợi của hệ thống |
|---|------|-------------------|
| 5.1 | Lịch hẹn không có thông tin chi tiết gia đình | Khu vực gia đình hiển thị 1 thẻ duy nhất chứa thông tin phụ huynh và số điện thoại được lấy từ thông tin đặt lịch gốc. Nút gọi/sao chép số điện thoại vẫn hoạt động. |
| 5.2 | Lịch hẹn chưa có kết quả đánh giá nào | Khu vực kết quả: Trình độ đầu vào hiển thị "Chưa chọn", Mức độ chi tiết bị vô hiệu hóa, Lộ trình/Điểm Nói/Điểm Trắc nghiệm hiển thị "—". Nút "Đường dẫn bài test" bị ẩn (trừ khi đang bật chế độ chỉnh sửa). |
| 5.3 | Lịch hẹn mất thông tin người tạo hoặc vận hành | Thẻ "Người tạo lịch" hiển thị tên mặc định "Quản trị viên hệ thống". |
| 5.4 | Lịch hẹn chưa được phân công giáo viên | Thẻ "Giáo viên Đánh giá" hiển thị Hộp chọn tìm kiếm giáo viên và Nút "Chọn" thay vì "Đổi". Hình đại diện hiển thị dấu "?". |
| 5.5 | Nhấn nút "Đổi" giáo viên khi chưa bật chế độ chỉnh sửa | Hệ thống tự động kích hoạt chế độ chỉnh sửa toàn cửa sổ. Sau khi thay giáo viên xong, người dùng bắt buộc phải bấm "Lưu thay đổi" để hệ thống ghi nhận. |
| 5.6 | Nhấn nút "Hủy bỏ" khi đang chỉnh sửa | Khôi phục toàn bộ giao diện về dữ liệu ban đầu trước khi chỉnh sửa. Thoát chế độ chỉnh sửa. Không lưu vào hệ thống. |
| 5.7 | Chuyển đổi trạng thái khi đang ở chế độ chỉnh sửa | Không thể xảy ra — các nút bấm thay đổi trạng thái sẽ bị ẩn đi khi đang chỉnh sửa (nhường chỗ cho nút Lưu thay đổi/Hủy bỏ). |
| 5.8 | Lịch hẹn đã ở trạng thái "Hoàn thành" | Ẩn các nút thay đổi trạng thái: "Chuyển Đang đánh giá", "Đánh giá Thất bại", "Hoàn thành", "Hủy lịch". Chỉ hiện duy nhất nút "Chỉnh sửa" và nút "Đóng". |
| 5.9 | Lịch hẹn đã ở trạng thái "Đã hủy" hoặc "Không đạt" | Tương tự trường hợp 5.8 — chỉ hiện nút "Chỉnh sửa" và nút "Đóng". |
| 5.10 | Cập nhật Trạng thái tham gia thành "Đã xác nhận" | Hệ thống tự động: Lưu thông tin -> Đóng cửa sổ chi tiết hiện tại -> Mở ngay màn hình "Đánh giá Năng lực" của Giáo viên với thông tin mới nhất. |
| 5.11 | Cập nhật Trạng thái tham gia thành "Chờ xác nhận" hoặc "Từ chối" | Hệ thống chỉ lưu thay đổi bình thường. Không tự động chuyển sang màn hình Đánh giá. |
| 5.12 | Không có dữ liệu thời gian kiểm tra | Hệ thống hiển thị "—" thay vì báo lỗi. Nếu chỉ có ngày mà không có giờ: hiển thị dạng "Ngày/Tháng/Năm" bỏ trống khung giờ. |
| 5.13 | Nhấn "Đánh giá Năng lực" trong cửa sổ chi tiết | Hệ thống mở bảng chấm điểm chi tiết. Chức năng này hoạt động nhận diện đúng môn Tiếng Anh hay môn Toán để tải bảng điểm phù hợp. |
| 5.14 | Đang chỉnh sửa thông tin rồi nhấn nút Đóng (X) cửa sổ | Toàn bộ thay đổi chưa lưu sẽ bị mất đi. Không có hộp thoại xác nhận "Bạn có muốn lưu?". Lần mở cửa sổ sau sẽ lấy lại dữ liệu gốc. |
| 5.15 | Đã chọn Trình độ, sau đó đổi sang Trình độ khác | Hộp chọn Mức độ chi tiết tự động làm mới về "Chưa chọn", để tránh việc các lựa chọn của trình độ cũ không khớp với trình độ mới. |
| 5.16 | Đổi Trình độ về lại "Chưa chọn" | Hộp chọn Mức độ chi tiết lập tức bị vô hiệu hóa và xóa dữ liệu hiện có. |
| 5.17 | Cố gắng lưu Ghi chú mới khi để trống nội dung | Hệ thống không cho phép lưu (Nút lưu bị vô hiệu hóa hoặc bị chặn ngầm). |
| 5.18 | Lịch sử ghi chú quá dài (Nhiều lần trao đổi) | Khu vực ghi chú xuất hiện thanh cuộn riêng, nội dung mới nhất luôn xuất hiện trên cùng. Ô nhập ghi chú mới luôn ghim cố định ở phần dưới cùng để tiện thao tác. |
| 5.19 | Nhiều nhân viên cùng thêm ghi chú cho 1 lịch hẹn | Hệ thống ghi nhận chính xác tên từng nhân viên và thời gian theo từng mốc. Dữ liệu sẽ lưu trữ nối tiếp nhau, không ghi đè xóa mất thông tin của người khác. |
| 5.20 | Chỉnh sửa nhanh Kết quả đánh giá | Hai chức năng Chọn Trình độ và Thêm ghi chú luôn luôn có thể chỉnh sửa trực tiếp mà không cần bấm nút bật chế độ chỉnh sửa. Hệ thống lưu lại thông tin ngay lập tức khi người dùng thay đổi. |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- [ ] Cửa sổ chi tiết mở đúng khi nhấn biểu tượng "Xem", hiển thị đầy đủ thông tin lịch hẹn theo bố cục 2 cột.
- [ ] Cột trái hiển thị chính xác: ảnh đại diện, tên, môn học, nhãn trạng thái (đúng màu quy định), và thẻ lịch hẹn (thời gian, chương trình, cơ sở).
- [ ] Khu vực Gia đình hiển thị đúng danh sách thành viên. Nút gọi điện và sao chép số hoạt động, số điện thoại bị che một phần bảo mật.
- [ ] Khu vực Nhân sự hiển thị tên người tạo lịch và giáo viên đánh giá. Cho phép đổi Giáo viên thông qua hộp tìm kiếm.
- [ ] Khu vực Kết quả: Hộp chọn Trình độ đầu vào hiển thị đúng cấp độ (Pre-Kindie → Level 3B...), thao tác chọn lưu ngay mà không cần bật chỉnh sửa.
- [ ] Khu vực Kết quả: Hộp chọn Mức độ chi tiết liên kết chặt chẽ với Trình độ, bị vô hiệu hóa nếu chưa chọn Trình độ. Chuyển đổi Trình độ thì Mức độ chi tiết tự làm trống.
- [ ] Khu vực Kết quả: 3 khối thông tin chỉ xem (Lộ trình, Điểm Nói, Điểm Trắc nghiệm) hiển thị chính xác số điểm hoặc "—" khi trống.
- [ ] Khu vực Kết quả: Các nút liên kết (Đường dẫn bài Test, Đánh giá Năng lực, Cổng kết quả) mở đúng trang/chức năng tương ứng.
- [ ] Khu vực Lịch sử ghi chú: Hiển thị danh sách ghi chú phân theo thời gian thực (mới nhất lên đầu), hoặc chữ mờ "Không có ghi chú nào" khi chưa có ai nhập.
- [ ] Khu vực Lịch sử ghi chú: Ô "Thêm ghi chú mới..." ghim cuối danh sách. Ghi chú mới gửi lên được lưu nối tiếp vào lịch sử, không xóa ghi chú cũ.
- [ ] Chế độ chỉnh sửa: Bật/tắt mượt mà. Khi bật, các vùng thông tin đổi sang khung nhập liệu, nút bấm đổi thành "Lưu thay đổi" / "Hủy bỏ".
- [ ] Nút "Chuyển Đang đánh giá": Chỉ hiện khi lịch hẹn ở nhóm trạng thái Chờ. Bấm vào tự động cập nhật hệ thống thành trạng thái "Đang đánh giá".
- [ ] Nút "Hoàn thành" và "Đánh giá thất bại": Chỉ hiện khi lịch hẹn ở nhóm trạng thái Đang thực hiện. Bấm vào chuyển chính xác trạng thái kết thúc.
- [ ] Nút "Hủy lịch": Biến mất khi lịch hẹn đã kết thúc (Hoàn thành, Thất bại, Đã hủy). Bấm vào chuyển trạng thái thành "Đã hủy".
- [ ] Tính tức thời: Sau khi cập nhật trạng thái hoặc lưu chỉnh sửa trong cửa sổ này, danh sách lịch hẹn bên ngoài bảng tổng quan lập tức cập nhật dữ liệu mới nhất (không cần F5).
- [ ] Luồng đi tắt: Khi đổi Trạng thái tham gia thành "Đã xác nhận", hệ thống tự động lưu, tự động tắt cửa sổ chi tiết và mở luôn màn hình "Đánh giá Năng lực".
