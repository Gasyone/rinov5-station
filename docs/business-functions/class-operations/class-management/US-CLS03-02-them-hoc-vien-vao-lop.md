---
id: US-CLS03-02
title: "Thêm học viên vào lớp (Biểu mẫu phụ)"
bf: BF-CLS-02
domain: CAP-OPS
status: draft
tags: [class, student, roster, form]
---

# US-CLS03-02: Thêm học viên vào lớp (Biểu mẫu phụ)

> **Tham chiếu:** BF-CLS-02 (Quản lý Lớp học) · Tiêu chuẩn Thiết kế §4.4 (Hộp thoại Biểu mẫu)
> **Đường dẫn màn hình & Trạng thái liên quan:**
> - Hộp thoại gán học viên mở khi bấm nút **Thêm học viên** tại tab **Học viên** trong hộp thoại chi tiết lớp (mở từ `/app/classes`) -> Trạng thái áp dụng: `Nháp`, `Chờ khai giảng`, `Đang học`



## 1. Yêu cầu Người dùng (User Story)

**Là một** Nhân viên Giáo vụ hoặc Quản lý chi nhánh,  
**tôi muốn** mở hộp thoại chọn học viên để xếp thêm học viên vào danh sách lớp (Roster) của lớp học hiện tại,  
**để** hoàn thành sĩ số học viên và tổ chức dạy học đúng tiến độ.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Thiết kế độc lập với luồng gán chương trình đào tạo của lớp.
> - [x] **N**egotiable — Giao diện các tab lọc học viên có thể tùy biến linh hoạt theo nhu cầu giáo vụ.
> - [x] **V**aluable — Là nghiệp vụ cốt lõi để đưa học sinh từ trạng thái chờ xếp lớp vào học thực tế.
> - [x] **E**stimable — Đã phân tách rõ ràng cấu trúc các trường thông tin chọn và tiêu chí lọc.
> - [x] **S**mall — Hoàn thành trong một vòng phát triển tập trung.
> - [x] **T**estable — Có tiêu chí nghiệm thu rõ ràng tại Mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-CLS-03-02-01] Đa chọn học viên:** Cho phép giáo vụ tích chọn một hoặc nhiều học viên cùng lúc từ danh sách để thêm vào lớp.
2. **[RULE-CLS-03-02-02] Kiểm soát sĩ số tối đa:** Hệ thống chặn lưu và hiển thị thông báo lỗi nếu tổng sĩ số học viên hiện tại của lớp cộng với số lượng học viên được chọn mới vượt quá định mức tối đa của lớp học.
3. **[RULE-CLS-03-02-03] Lọc học viên phù hợp lịch:** Khi mở tab "Phù hợp", hệ thống tự động loại trừ các học viên đã có lịch học chính thức khác trùng giờ với ca học cố định của lớp này, hoặc học viên có đăng ký thời gian rảnh không khớp với lịch tuần của lớp.
4. **[RULE-CLS-03-02-04] Ràng buộc trình độ:** Hệ thống hiển thị cảnh báo nhỏ màu vàng nếu học viên được chọn có trình độ học tập ghi nhận trên hồ sơ khác với trình độ học thuật của lớp học đang chọn, giáo vụ được phép tiếp tục xếp lớp nếu là trường hợp ngoại lệ được duyệt.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-CLS-03-02-01] Định mức sĩ số mặc định:** Sĩ số tối đa quy định của một lớp là 20 học viên (bao gồm cả học viên học thử).

---

## 3. Cấu trúc Các trường nhập liệu

**Bố cục:** Hộp thoại nổi 1 Cột.

### 3.1. Thông tin đầu vào

| Tên trường | Loại hiển thị | Bắt buộc | Diễn giải dữ liệu | Ghi chú & Quy tắc |
|------------|---------------|----------|-------------------|-------------------|
| Lọc nhanh theo Nhóm | Nhóm tab | Có | Phân loại danh sách học viên | Gồm 3 tab: "Tất cả", "Phù hợp lịch", "Học viên học thử". |
| Tìm kiếm học viên | Ô nhập chữ | Không | Tìm theo tên, mã số, SĐT | Lọc tức thì danh sách hiển thị bên dưới. |
| Danh sách học viên | Bảng chọn (Đa chọn) | Có | Các học viên trong danh sách chờ | Hiển thị ảnh đại diện, họ tên, mã số, ngày sinh, trình độ hiện tại, gói học phí đã mua. |

### 3.2. Ví dụ Dữ liệu mẫu

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
|------------|-----------------|-------------------|
| Chọn học viên hợp lệ | Tích chọn 3 học viên phù hợp lịch | Nút xác nhận sáng lên, bấm xác nhận thêm thành công 3 học viên vào roster lớp. |
| Vượt quá sĩ số lớp | Lớp đang có 19/20 học viên, chọn thêm 2 học viên mới | Hệ thống hiển thị cảnh báo đỏ quá sĩ số tối đa và vô hiệu hóa nút xác nhận lưu. |
| Học viên trùng lịch học | Học viên có lịch học lớp khác trùng ca tối Thứ Hai | Học viên không xuất hiện trong tab "Phù hợp lịch", nếu tìm kiếm ở tab "Tất cả" sẽ hiển thị nhãn cảnh báo trùng lịch. |

### 3.3. Nút hành động

| Nút | Loại hiển thị | Logic xử lý |
|-----|---------------|-------------|
| Hủy bỏ | Nút viền nhạt | Đóng hộp thoại, giữ nguyên danh sách roster cũ của lớp học. |
| Xác nhận gán | Nút màu nhấn | Lưu danh sách học viên -> Cập nhật sĩ số lớp -> Ghi nhận nhật ký hoạt động -> Đóng hộp thoại và tải lại tab Roster. |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
- Biểu mẫu mở ra dưới dạng hộp thoại nổi có kích thước trung bình nằm giữa màn hình.
- Tiêu đề hộp thoại in đậm: "Xếp lớp học viên".
- Phía dưới tiêu đề là nhóm tab lọc nhanh ("Tất cả", "Phù hợp lịch", "Học viên học thử") và ô tìm kiếm tự do.
- Khu vực chính hiển thị danh sách học viên dưới dạng bảng thẻ dọc, mỗi học viên là một thẻ thông tin đầy đủ ảnh đại diện, tên, mã số, trình độ hiện tại, gói phí và lịch rảnh. Đầu mỗi dòng có ô tích chọn (Checkbox).
- Dưới cùng là chân hộp thoại chứa tổng số học viên đang chọn và nhóm nút tác vụ.

### 4.2. Luồng Hoạt động (Workflow)
1. Giáo vụ mở màn hình chi tiết lớp học, chuyển đến tab **Học viên** và bấm nút *"Thêm học viên"*.
2. Hộp thoại nổi lên. Hệ thống tự động nạp danh sách học viên ở trạng thái chờ xếp lớp của chi nhánh.
3. Giáo vụ gõ tên học viên vào ô tìm kiếm hoặc bấm sang tab "Phù hợp lịch" để xem danh sách gợi ý.
4. Giáo vụ tích chọn các học viên mong muốn. Hệ thống cập nhật tổng số lượng học viên đang chọn ở chân trang.
5. Giáo vụ bấm *"Xác nhận gán"*. Hệ thống ghi nhận học viên vào lớp học, đóng hộp thoại và tự động hiển thị học viên mới tại tab Học viên của màn chi tiết.

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|---|----------------------------------|---------------------|----------------------|
| 5.1 | Không có học viên nào đang chờ xếp lớp | Hiển thị thông báo trống giữa hộp thoại hướng dẫn giáo vụ kiểm tra lại danh sách học viên hoàn thành học phí. | Trạng thái danh sách trống |
| 5.2 | Xếp lớp học viên đang bảo lưu học tập | Tên học viên hiển thị mờ, khi giáo vụ chọn xếp lớp sẽ xuất hiện cảnh báo: "Học viên này đang bảo lưu. Hành động xếp lớp sẽ tự động mở lại trạng thái hoạt động của học viên." | Cảnh báo trạng thái học viên |
| 5.3 | Học viên bị trùng lịch nhưng vẫn cần xếp lớp | Hệ thống hiển thị cảnh báo đỏ trùng lịch giáo viên/lịch học viên tại dòng của học sinh đó. Giáo vụ được phép tích chọn bỏ qua và lưu nếu được cấp quản lý chi nhánh đồng ý. | Ghi đè lịch xung đột |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Bố cục chuẩn):** Giao diện hiển thị đúng cấu trúc hộp thoại nổi, có đầy đủ các tab lọc phân loại, ô tìm kiếm và ô tích chọn đa tuyển sinh.
- **AC-2 (Ràng buộc sĩ số):** Chặn lưu và báo lỗi rõ ràng nếu sĩ số lớp sau khi cộng số chọn mới vượt quá định mức tối đa.
- **AC-3 (Lọc trùng lịch thông minh):** Tab "Phù hợp lịch" chỉ hiển thị các học viên có lịch rảnh khớp hoàn toàn và không trùng giờ với ca học cố định của lớp.
- **AC-4 (Cập nhật tức thì):** Sau khi bấm Xác nhận gán thành công, sĩ số lớp được cập nhật lại ngay lập tức và danh sách học viên mới hiển thị đầy đủ tại tab Roster màn chi tiết.
