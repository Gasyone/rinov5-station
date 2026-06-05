---
id: US-ENR03-01
title: "Quản lý danh sách Sự kiện tuyển sinh"
bf: BF-ENR-03
domain: CAP-ADM
status: draft
tags: [enrollment, event, list]
---

# US-ENR03-01: Quản lý danh sách Sự kiện tuyển sinh

> **Tham chiếu:** BF-ENR-03 · Giao diện Mẫu §4.2 (Danh sách)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Nhân viên Tiếp thị hoặc Nhân viên Tư vấn tuyển sinh, **tôi muốn** xem danh sách các sự kiện tuyển sinh tại cơ sở, thực hiện tìm kiếm, lọc và phân loại các sự kiện, **để** dễ dàng quản lý và theo dõi quá trình tổ chức sự kiện cũng như các chiến dịch thu hút khách hàng tiềm năng.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập với trang chi tiết hoặc lịch sử kiện tổng.
> - [x] **N**egotiable — Chi tiết các tiêu chí lọc nâng cao có thể thương lượng dựa trên nhu cầu thực tế của chi nhánh.
> - [x] **V**aluable — Giúp đội ngũ vận hành bao quát được các hoạt động sự kiện sắp tới và lịch sử sự kiện đã qua.
> - [x] **E**stimable — Dễ dàng ước lượng dựa trên khung thiết kế danh sách chuẩn của hệ thống.
> - [x] **S**mall — Hoàn thành gọn gàng trong 1 đợt phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu rõ ràng ở mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-EVT-LIST-01] Hiển thị mặc định:** Khi vừa truy cập, hệ thống hiển thị tất cả các sự kiện thuộc chi nhánh hiện tại của người dùng, sắp xếp theo thời gian bắt đầu gần nhất trở đi (sắp tới) và mới nhất lên đầu.
2. **[RULE-EVT-LIST-02] Tìm kiếm đa trường:** Hỗ trợ tìm kiếm theo tên sự kiện, mã sự kiện hoặc địa điểm tổ chức sự kiện. Tìm kiếm không phân biệt chữ hoa, chữ thường và hỗ trợ tìm kiếm không dấu.
3. **[RULE-EVT-LIST-03] Đồng bộ vòng đời sự kiện:** Trạng thái của sự kiện tự động chuyển đổi dựa trên thời gian bắt đầu/kết thúc được thiết lập, hoặc chuyển thủ công bằng hành động của người dùng (Hủy sự kiện).

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-01] Tốc độ phản hồi:** Thời gian tải danh sách sự kiện ban đầu phải nhanh chóng, đảm bảo trải nghiệm mượt mà kể cả khi hệ thống có hàng ngàn sự kiện.
- **[METRIC-02] Số dòng hiển thị:** Mặc định hiển thị 20 dòng trên mỗi trang để đảm bảo giao diện cân đối và gọn gàng.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Ô tìm kiếm | Ô nhập chữ | Nhập từ khóa để quét trường tên, mã, địa điểm | Nhập và tự động tìm kiếm sau một khoảng trễ ngắn |
| Chọn Chi nhánh | Hộp chọn thả xuống | Lọc danh sách sự kiện theo địa điểm cơ sở | Mặc định là chi nhánh làm việc hiện tại của người dùng |
| Lọc nâng cao | Nút biểu tượng | Bấm để mở bảng điều khiển lọc chi tiết bên phải | Hiển thị chấm đỏ nhỏ nếu đang có bộ lọc được kích hoạt |
| Nút Tạo mới | Nút màu nhấn chính | Bấm để mở hộp thoại tạo sự kiện mới | Chỉ hiển thị nếu người dùng có quyền tiếp thị hoặc quản lý |

### 3.2. Khối lọc Trạng thái (Status Tiles)
| Thành phần | Nhóm màu | Điều kiện lọc | Ghi chú |
|------------|----------|---------------|---------|
| Tất cả | Mặc định trung tính | Không lọc theo trạng thái | Hiển thị tổng số lượng tất cả sự kiện |
| Nháp | Màu xám trung tính | Lọc các sự kiện đang ở trạng thái Nháp | Sự kiện đang lên kế hoạch, chưa công bố |
| Mở đăng ký | Màu xanh lục tích cực | Lọc sự kiện đang mở nhận đăng ký | Khách mời có thể đăng ký tham gia |
| Đang diễn ra | Màu xanh dương xử lý | Lọc sự kiện đang thực tế diễn ra | Đang thực hiện điểm danh và tổ chức |
| Đã kết thúc | Màu xanh ngọc hoàn tất | Lọc sự kiện đã tổ chức xong | Đã đóng điểm danh và ghi nhận kết quả |
| Đã hủy | Màu đỏ cảnh báo | Lọc các sự kiện đã bị hủy bỏ | Không tổ chức thực tế |

### 3.3. Bảng danh sách chính
*Bấm vào một dòng bất kỳ trên bảng để chuyển đến trang chi tiết của sự kiện đó.*

| Cột | Loại hiển thị | Chi tiết thông tin | Ghi chú |
|-----|---------------|----------------|---------|
| Hộp chọn | Ô chọn vuông | Lựa chọn dòng (Checkbox) | Cho phép tích chọn một hoặc nhiều sự kiện để xử lý hàng loạt |
| Tên Sự kiện / Mã | Chữ đậm 1 dòng kèm mã & các nhãn bên dưới | Tên sự kiện (giới hạn 1 dòng, hiển thị ba chấm nếu quá dài), mã định danh sự kiện và nhãn loại sự kiện, nhãn đối tượng mục tiêu cùng hàng | Tiết kiệm diện tích hiển thị, vô cùng ngăn nắp |
| Chi nhánh / Địa điểm | Chữ vừa kèm phòng học tinh gọn | Tên cơ sở chi nhánh chính và phòng/khu vực tổ chức cụ thể (loại bỏ lặp lại tên chi nhánh) | Trực quan, dễ đọc |
| Thời gian tổ chức | Văn bản | Ngày và giờ tổ chức sự kiện thực tế | Định dạng: Giờ:Phút - Ngày/Tháng/Năm |
| Đăng ký / Sức chứa | Chữ số kèm thanh tiến trình | Số lượng đăng ký hiện tại trên tổng sức chứa của phòng | Hiển thị tỷ lệ phần trăm lấp đầy trực quan |
| Trạng thái | Nhãn màu | Trạng thái hiện tại của sự kiện | Áp dụng đúng bộ màu chuẩn của hệ thống |

### 3.4. Thao tác khi rê chuột vào dòng
| Nút | Loại | Logic xử lý | Điều kiện hiển thị |
|-----|------|-------------|---------------------|
| Chi tiết | Nút biểu tượng con mắt | Mở cửa sổ thông tin chi tiết sự kiện | Luôn hiển thị |
| Sao chép Link | Nút biểu tượng chuỗi liên kết | Sao chép nhanh đường dẫn biểu mẫu đăng ký của sự kiện đó | Luôn hiển thị |
| Đón tiếp nhanh | Nút biểu tượng tích kiểm khách hàng | Mở nhanh cửa sổ điểm danh đón tiếp ngay tại quầy | Chỉ hiển thị khi sự kiện ở trạng thái Đang diễn ra |
| Chỉnh sửa | Nút biểu tượng bút chì | Mở hộp thoại chỉnh sửa nhanh thông tin sự kiện | Chỉ hiển thị khi sự kiện ở trạng thái Nháp hoặc Mở đăng ký |
| Hủy sự kiện | Nút biểu tượng biển báo cấm | Mở hộp thoại xác nhận hủy bỏ sự kiện | Chỉ hiển thị khi sự kiện chưa kết thúc |
*Toàn bộ cụm nút hành động này được thiết kế hoàn toàn không viền bao quanh (borderless), chỉ hiển thị mượt mà khi di chuột.*

### 3.5. Bảng lọc nâng cao (Bảng trượt từ cạnh phải)
| Thành phần | Loại | Dữ liệu lọc | Ghi chú |
|------------|------|-------------|---------|
| Loại sự kiện | Các ô đánh dấu chọn | Lọc theo loại: Hội thảo, Ngày hội mở, Trải nghiệm học thử... | Cho chọn nhiều loại cùng lúc |
| Đối tượng mục tiêu | Các ô đánh dấu chọn | Lọc theo: Phụ huynh, Học sinh, Cả gia đình | Phù hợp với bối cảnh trung tâm giáo dục |
| Sức chứa sảnh | Các ô đánh dấu chọn | Lọc theo phòng chứa: Dưới 30 người, 30 - 50 người, Trên 50 người | |
| Tình trạng chỗ | Các ô đánh dấu chọn | Lọc theo độ trống: Còn chỗ trống, Đã đầy chỗ | |
| Khu vực tổ chức | Các ô đánh dấu chọn | Lọc theo vị trí cụ thể: Hội trường, Sân chơi ngoài trời, Phòng STEM, Phòng học thường | |
| Thời gian lịch trình | Các ô đánh dấu chọn | Lọc theo khoảng thời gian tổ chức: Trong tuần, Cuối tuần | |

### 3.6. Phân trang
Sử dụng bộ phân trang tiêu chuẩn ở cuối bảng với các lựa chọn `[20, 50, 100]` dòng trên mỗi trang.

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
Giao diện được thiết kế theo cấu trúc ba phần thống nhất của hệ thống:
1. **Phần đầu:** Chứa thanh công cụ tìm kiếm nhanh, nút lọc nâng cao và nút tạo mới sự kiện nổi bật với màu nhấn chính của hệ thống.
2. **Phần thân trên:** Chứa các thẻ tóm tắt trạng thái (Status Tiles) xếp ngang, hiển thị nhanh số lượng sự kiện ở từng giai đoạn (Nháp, Mở đăng ký, Đang diễn ra, Đã kết thúc, Đã hủy). Bấm vào từng thẻ sẽ lọc nhanh bảng dữ liệu phía dưới theo trạng thái tương ứng.
3. **Phần thân dưới:** Bảng danh sách sự kiện chính với các cột thông tin rõ ràng, hỗ trợ co giãn trên các thiết bị khác nhau. Có hiệu ứng đổi màu nền nhẹ khi di chuột qua dòng và hỗ trợ bấm vào dòng để chuyển trang. Dưới cùng là thanh phân trang tiêu chuẩn.

### 4.2. Luồng Hoạt động (Workflow)
1. **Truy cập:** Người dùng chọn menu "Quản lý sự kiện" trên thanh điều hướng bên trái. Hệ thống tải dữ liệu mặc định của chi nhánh hiện tại.
2. **Tìm kiếm & Lọc:** Người dùng gõ tên sự kiện vào ô tìm kiếm. Bảng dữ liệu tự động cập nhật kết quả tương ứng sau khi dừng gõ.
3. **Hủy sự kiện:** Khi di chuột vào dòng sự kiện chưa diễn ra, người dùng bấm nút Hủy. Hệ thống hiển thị hộp thoại xác nhận yêu cầu nhập lý do hủy. Sau khi xác nhận, sự kiện chuyển sang trạng thái "Đã hủy" và danh sách được cập nhật lại.

---

## 5. Corner Cases (Trường hợp đặc biệt)

| # | Tình huống đặc biệt | Cách xử lý chi tiết | Ghi chú |
|---|---------------------|---------------------|---------|
| 5.1 | Chi nhánh chưa có sự kiện nào | Hiển thị hình minh họa trống kèm thông điệp hướng dẫn rõ ràng và nút bấm để tạo sự kiện đầu tiên. | Áp dụng màn hình trống chuẩn |
| 5.2 | Tìm kiếm không khớp kết quả | Hiển thị bảng trống kèm thông báo không tìm thấy kết quả phù hợp để người dùng thử từ khóa khác. | |
| 5.3 | Lỗi tải dữ liệu do mất kết nối | Hiển thị thông điệp báo lỗi hệ thống và nút bấm để người dùng tải lại trang dễ dàng. | Áp dụng màn hình lỗi chuẩn |
| 5.4 | Hủy sự kiện đã có khách đăng ký | Hệ thống hiển thị cảnh báo đỏ nổi bật, thông báo số lượng khách mời đã đăng ký sẽ bị ảnh hưởng, yêu cầu người dùng xác nhận kỹ lưỡng qua hộp thoại an toàn. | Bắt buộc xác nhận an toàn |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Bố cục đồng bộ):** Giao diện hiển thị đầy đủ ba khu vực theo đúng chuẩn thiết kế của hệ thống, không bị vỡ bố cục khi co giãn màn hình trên thiết bị di động.
- **AC-2 (Tìm kiếm mượt mà):** Tìm kiếm tự động kích hoạt sau khi người dùng dừng nhập chữ, phản hồi nhanh chóng mà không gây giật lag.
- **AC-3 (Bộ màu trạng thái chính xác):** Nhãn trạng thái sự kiện phải áp dụng chính xác mã màu quy định tập trung của hệ thống, không được sử dụng màu tự chế.
- **AC-4 (Xác nhận hủy an toàn):** Hành động hủy sự kiện bắt buộc phải hiển thị hộp thoại cảnh báo an toàn và yêu cầu nhập lý do trước khi lưu trạng thái mới.