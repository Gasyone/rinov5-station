---
id: US-ENR03-02
title: "Tạo và Cập nhật Sự kiện"
bf: BF-ENR-03
domain: CAP-ADM
status: draft
tags: [enrollment, event, form, modal]
---

# US-ENR03-02: Tạo và Cập nhật Sự kiện

> **Tham chiếu:** BF-ENR-03 · Giao diện Mẫu §4.4 (Biểu mẫu)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Nhân viên Tiếp thị hoặc Người quản lý, **tôi muốn** tạo mới hoặc chỉnh sửa thông tin chi tiết của một sự kiện tuyển sinh thông qua hộp thoại nhập liệu, **để** công bố thông tin sự kiện một cách chính xác tới toàn chi nhánh và các khách mời tiềm năng.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập dưới dạng một hộp thoại điều khiển (Modal/Drawer) có thể gọi từ màn hình danh sách hoặc màn hình chi tiết.
> - [x] **N**egotiable — Cấu trúc các trường thông tin có thể co giãn hoặc ẩn bớt tùy thuộc vào loại sự kiện.
> - [x] **V**aluable — Giúp chuẩn hóa việc nhập liệu sự kiện, hạn chế tối đa sai sót về thời gian và sức chứa.
> - [x] **E**stimable — Dễ dàng ước lượng dựa trên các biểu mẫu nhập liệu chuẩn của hệ thống.
> - [x] **S**mall — Hoàn thành gọn gàng trong 1 đợt phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu rõ ràng ở mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-FORM-01] Ràng buộc thời gian:** Thời gian kết thúc sự kiện **bắt buộc** phải diễn ra sau thời gian bắt đầu tối thiểu 30 phút. Hệ thống tự động kiểm tra và báo lỗi nếu vi phạm.
2. **[RULE-FORM-02] Giới hạn sức chứa:** Trường sức chứa tối đa bắt buộc phải nhập số nguyên dương lớn hơn 0.
3. **[RULE-FORM-03] Chặn sửa đổi khi đang diễn ra:** Khi sự kiện đã chuyển sang trạng thái "Đang diễn ra" hoặc "Đã kết thúc", toàn bộ thông tin cốt lõi (Thời gian, Sức chứa, Chi nhánh) sẽ bị khóa không cho phép sửa đổi để đảm bảo tính toàn vẹn dữ liệu.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-01] Độ dài tiêu đề:** Tên sự kiện tối đa 150 ký tự để tránh vỡ giao diện hiển thị.
- **[METRIC-02] Giới hạn ký tự mô tả:** Trường mô tả sự kiện cho phép nhập tối đa 1000 ký tự.

---

## 3. Cấu trúc Các trường nhập liệu

**Bố cục biểu mẫu:** Thiết lập hộp thoại trượt từ cạnh phải màn hình (Drawer), chia làm 2 cột thông tin trên máy tính và co lại thành 1 cột trên điện thoại di động.

### 3.1. Thông tin đầu vào

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
|------------|---------------|----------|----------------|-------------------|
| Tên Sự kiện | Ô nhập chữ | Có | Tên | Tối đa 150 ký tự. Hiển thị cảnh báo đỏ nếu bỏ trống. |
| Loại Sự kiện | Hộp chọn thả xuống | Có | Phân loại | Các tùy chọn: Hội thảo, Ngày hội mở, Trải nghiệm học thử, Khác. |
| Chi nhánh | Hộp chọn thả xuống | Có | Địa điểm cơ sở | Mặc định là chi nhánh hiện tại của người dùng. |
| Thời gian bắt đầu | Ô chọn ngày và giờ | Có | Bắt đầu | Định dạng: Ngày/Tháng/Năm Giờ:Phút. |
| Thời gian kết thúc | Ô chọn ngày và giờ | Có | Kết thúc | Định dạng tương tự. Phải sau thời gian bắt đầu tối thiểu 30 phút. |
| Sức chứa tối đa | Ô nhập số | Có | Sức chứa | Chỉ nhận số nguyên dương lớn hơn 0. |
| Địa điểm cụ thể | Ô nhập chữ | Không | Địa điểm chi tiết | Tên phòng hoặc khu vực tổ chức. VD: Phòng Hội thảo Tầng 1. |
| Người phụ trách | Hộp chọn thả xuống | Có | Nhân sự chịu trách nhiệm | Danh sách nhân viên thuộc chi nhánh hiện tại. |
| Mô tả sự kiện | Ô nhập văn bản dài | Không | Mô tả ngắn | Tối đa 1000 ký tự. Tóm tắt nội dung chính sự kiện. |

### 3.2. Ví dụ Dữ liệu mẫu

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
|------------|-----------------|-------------------|
| Tạo thành công | Tên: "Hội thảo tuyển sinh Hè 2026", Sức chứa: 50 | Hệ thống lưu thành công ở trạng thái Nháp, tải lại danh sách. |
| Sai ràng buộc thời gian | Bắt đầu: 10:00 15/06/2026, Kết thúc: 09:30 15/06/2026 | Viền đỏ ô Thời gian kết thúc, báo lỗi "Thời gian kết thúc phải sau thời gian bắt đầu". |
| Thiếu trường bắt buộc | Tên sự kiện bỏ trống | Viền đỏ ô Tên sự kiện, nút Lưu bị vô hiệu hóa hoặc chặn hành động lưu. |

### 3.3. Nút hành động
| Nút | Loại hiển thị | Logic xử lý |
|-----|---------------|-------------|
| Hủy bỏ | Nút viền nhạt | Đóng hộp thoại trượt, hiển thị cảnh báo nếu có dữ liệu đã thay đổi mà chưa lưu. |
| Lưu nháp | Nút viền trung tính | Lưu thông tin sự kiện ở trạng thái Nháp. Chưa công bố rộng rãi. |
| Công bố | Nút màu nhấn nổi bật | Lưu thông tin sự kiện và chuyển trạng thái sang "Mở đăng ký" ngay lập tức. |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
Biểu mẫu được hiển thị dưới dạng một bảng trượt từ cạnh phải màn hình (Drawer) để người dùng không bị mất bối cảnh của trang danh sách phía dưới. Cấu trúc giao diện gồm:
- **Tiêu đề bảng trượt:** Hiển thị rõ "Tạo Sự kiện mới" hoặc "Chỉnh sửa Sự kiện [Mã sự kiện]".
- **Phần thân:** Các trường thông tin được nhóm lại một cách trực quan bằng các nhãn rõ ràng. Phần mô tả chi tiết được xếp dưới cùng để có không gian nhập liệu thoải mái.
- **Phần chân:** Cố định ở cuối bảng trượt chứa các nút hành động (Hủy bỏ, Lưu nháp, Công bố) giúp người dùng dễ dàng thao tác bất kỳ lúc nào mà không cần cuộn trang.

### 4.2. Luồng Hoạt động (Workflow)
1. **Mở biểu mẫu:** Người dùng bấm nút "Tạo mới" trên thanh công cụ hoặc bấm nút "Chỉnh sửa" trên một dòng sự kiện. Bảng trượt mở ra mượt mà từ bên phải.
2. **Nhập liệu:** Người dùng nhập các thông tin cần thiết. Hệ thống tự động kiểm tra tính hợp lệ của dữ liệu theo thời gian thực (ví dụ: kiểm tra khoảng thời gian bắt đầu và kết thúc khi người dùng chọn xong).
3. **Lưu dữ liệu:**
   - Nếu bấm **Lưu nháp**: Hệ thống ghi nhận thông tin ở trạng thái Nháp. Sự kiện chưa hiển thị trên lịch tuyển sinh công khai.
   - Nếu bấm **Công bố**: Hệ thống xác nhận lưu thông tin và chuyển trạng thái sự kiện sang "Mở đăng ký". Khách mời có thể bắt đầu đăng ký tham gia.
   - Hộp thoại đóng lại mượt mà, danh sách phía sau được tự động làm mới để cập nhật thông tin sự kiện mới.

---

## 5. Corner Cases (Trường hợp đặc biệt)

| # | Tình huống đặc biệt | Cách xử lý chi tiết | Ghi chú |
|---|---------------------|---------------------|---------|
| 5.1 | Đóng hộp thoại khi đang nhập dở | Nếu người dùng bấm ra ngoài hoặc bấm nút Hủy bỏ khi đã có dữ liệu thay đổi, hệ thống bắt buộc hiển thị hộp thoại xác nhận hỏi người dùng có muốn hủy bỏ các thay đổi không để tránh mất thông tin vô ý. | Áp dụng cảnh báo xác nhận an toàn |
| 5.2 | Thay đổi sức chứa xuống dưới lượng khách đã đăng ký | Khi chỉnh sửa sự kiện, nếu người dùng nhập sức chứa mới nhỏ hơn số lượng khách đã thực tế đăng ký thành công trước đó, hệ thống sẽ chặn hành động lưu và hiển thị thông báo lỗi yêu cầu điều chỉnh sức chứa lớn hơn hoặc bằng lượng khách hiện tại. | Chặn lưu từ hệ thống |
| 5.3 | Lỗi lưu trữ do trùng mã sự kiện tự sinh | Hệ thống tự động xử lý tạo mã mới bằng cách tăng số thứ tự và kiểm tra chống trùng lặp trước khi ghi nhận thành công. | Xử lý ngầm tự động |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Độ trượt mượt mà):** Bảng trượt hoạt động mượt mà từ bên phải màn hình, co giãn linh hoạt và hiển thị đầy đủ trên cả máy tính lẫn điện thoại.
- **AC-2 (Ràng buộc thời gian chính xác):** Hệ thống chặn lưu và hiển thị thông báo lỗi rõ ràng bên dưới trường thời gian nếu thời gian kết thúc trước hoặc trùng thời gian bắt đầu sự kiện.
- **AC-3 (Xác nhận đóng thông minh):** Tránh mất dữ liệu vô ý của người dùng bằng cách luôn hiển thị hộp thoại cảnh báo trước khi đóng biểu mẫu nếu phát hiện có sự thay đổi dữ liệu chưa lưu.
- **AC-4 (Lưu đúng trạng thái):** Nút Lưu nháp và nút Công bố chuyển sự kiện sang đúng trạng thái nghiệp vụ tương ứng và làm mới bảng danh sách phía sau lập tức.