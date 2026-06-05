---
id: US-CLS04-01
title: "Phân công giáo viên chủ nhiệm và giảng dạy (Biểu mẫu phụ)"
bf: BF-CLS-02
domain: CAP-OPS
status: draft
tags: [class, teacher, schedule, form]
---

# US-CLS04-01: Phân công giáo viên chủ nhiệm và giảng dạy (Biểu mẫu phụ)

> **Tham chiếu:** BF-CLS-02 (Quản lý Lớp học) · Tiêu chuẩn Thiết kế §4.4 (Hộp thoại Biểu mẫu)
> **Đường dẫn màn hình & Trạng thái liên quan:**
> - Hộp thoại điều phối giáo viên mở từ nút chọn hoặc biểu tượng **Địa cầu** trong biểu mẫu Thiết lập lịch tuần (mở từ hộp thoại chi tiết lớp `/app/classes`) -> Trạng thái áp dụng: `Nháp`, `Chờ khai giảng`, `Đang học`



## 1. Yêu cầu Người dùng (User Story)

**Là một** Nhân viên Giáo vụ hoặc Quản lý chi nhánh,  
**tôi muốn** mở hộp thoại tìm kiếm và gán giáo viên từ toàn bộ hệ thống cho lớp học hoặc ca học cụ thể,  
**để** đảm bảo lớp học có đủ giảng viên đứng lớp, kiểm soát lịch dạy trống và tránh tình trạng trùng giờ giảng dạy.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Thiết kế độc lập với luồng xếp phòng học hoặc xếp lớp học viên.
> - [x] **N**egotiable — Cơ chế hiển thị trạng thái trùng lịch có thể được tùy biến theo các quy định riêng của từng chi nhánh.
> - [x] **V**aluable — Giúp phân công giảng dạy nhanh chóng, tối ưu hóa nguồn lực giáo viên toàn hệ thống.
> - [x] **E**stimable — Đã liệt kê chi tiết các bộ lọc và thông tin hiển thị của giáo viên.
> - [x] **S**mall — Hoàn thành trong một vòng phát triển tập trung.
> - [x] **T**estable — Có tiêu chí nghiệm thu rõ ràng tại Mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-CLS-04-01-01] Bộ lọc trạng thái giáo viên:** Hệ thống chỉ hiển thị các giáo viên đang ở trạng thái hoạt động giảng dạy bình thường. Không hiển thị các giáo viên đã nghỉ việc hoặc đang tạm dừng công tác.
2. **[RULE-CLS-04-01-02] Tự động kiểm tra trùng lịch:** Khi mở hộp thoại phân công cho một ca học cụ thể (đã có thứ và khung giờ), hệ thống tự động kiểm tra lịch dạy của giáo viên trong toàn hệ thống. Nếu giáo viên đã được phân công đứng lớp khác trong cùng khoảng thời gian đó, trạng thái lịch dạy của giáo viên sẽ hiển thị cảnh báo trùng lịch.
3. **[RULE-CLS-04-01-03] Hỗ trợ tìm kiếm đa năng:** Hệ thống cho phép tìm kiếm giáo viên theo họ tên, mã số giáo viên, số điện thoại hoặc email. Kết quả tìm kiếm sẽ lọc tức thì ngay khi nhập từ khóa.
4. **[RULE-CLS-04-01-04] Lọc theo chi nhánh:** Giáo vụ có thể lọc giáo viên theo chi nhánh quản lý chính để ưu tiên phân công giáo viên thuộc cơ sở của mình, hoặc mở rộng tìm kiếm giáo viên từ các chi nhánh khác để điều phối dạy thay.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-CLS-04-01-01] Số lượng giáo viên phân công:** Mỗi ca học tuần chỉ gán tối đa 1 giáo viên giảng dạy chính.

---

## 3. Cấu trúc Các trường nhập liệu

**Bố cục:** Hộp thoại nổi rộng, danh sách dạng bảng.

### 3.1. Thông tin đầu vào

| Tên trường | Loại hiển thị | Bắt buộc | Diễn giải dữ liệu | Ghi chú & Quy tắc |
|------------|---------------|----------|-------------------|-------------------|
| Từ khóa tìm kiếm | Ô nhập chữ kèm biểu tượng kính lúp | Không | Tìm theo tên, mã giáo viên, SĐT, email | Lọc kết quả tự động trong bảng dưới. |
| Chi nhánh | Danh sách chọn một | Không | Lọc giáo viên theo chi nhánh quản lý | Mặc định hiển thị "Tất cả chi nhánh". |
| Bảng danh sách giáo viên | Bảng hiển thị thông tin | Có | Danh sách giáo viên phù hợp bộ lọc | Hiển thị thông tin: Họ tên & Mã GV, Chi nhánh chính, Môn giảng dạy, Trạng thái lịch dạy cho ca học đang chọn. |

### 3.2. Ví dụ Dữ liệu mẫu

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
|------------|-----------------|-------------------|
| Gán giáo viên trống lịch | Tìm giáo viên "Nguyễn Văn A" (Trạng thái: Trống lịch) -> Bấm nút Gán | Giáo viên được chọn làm người giảng dạy, hộp thoại đóng và cập nhật thông tin hiển thị tại biểu mẫu chính. |
| Phân công giáo viên trùng lịch | Tìm giáo viên "Trần Thị B" (Trạng thái: Trùng lịch) -> Bấm nút Gán | Hệ thống ghi nhận việc gán lịch, hiển thị nhãn cảnh báo đỏ trùng lịch ở màn hình lịch dạy nhưng vẫn cho phép lưu nếu giáo vụ xác nhận. |
| Không tìm thấy giáo viên | Nhập từ khóa "XYZ123" không khớp với bất kỳ thông tin nào | Hiển thị màn hình trống với thông báo không tìm thấy kết quả và gợi ý điều chỉnh bộ lọc. |

### 3.3. Nút hành động

| Nút | Loại hiển thị | Logic xử lý |
|-----|---------------|-------------|
| Đóng (X) | Nút biểu tượng góc trên | Đóng hộp thoại điều phối, không thay đổi thông tin giáo viên đang chọn. |
| Gán | Nút viền nhạt ở mỗi dòng | Xác nhận chọn giáo viên này cho ca học -> Đóng hộp thoại -> Truyền thông tin giáo viên được chọn về biểu mẫu xếp lịch. |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
- Biểu mẫu hiển thị dưới dạng hộp thoại nổi lớn nằm chính giữa màn hình nhằm tối ưu không gian hiển thị bảng thông tin giáo viên.
- Tiêu đề hộp thoại: "Điều phối giáo viên hệ thống".
- Bên dưới tiêu đề là dòng mô tả ngắn: "Tìm kiếm và gán giáo viên từ toàn bộ hệ thống cho ngày học đang chọn."
- Thanh công cụ phía trên bảng chứa ô tìm kiếm nhanh chiếm 2/3 chiều rộng và ô chọn chi nhánh chiếm 1/3 chiều rộng.
- Khu vực chính hiển thị bảng danh sách giáo viên với các cột rõ ràng: Họ và tên / Mã GV (kèm SĐT dưới tên), Chi nhánh chính, Môn giảng dạy (các nhãn môn học), Lịch dạy (trạng thái Trống lịch hoặc Trùng lịch).
- Cột cuối cùng chứa nút tác vụ "Gán" cho từng giáo viên.

### 4.2. Luồng Hoạt động (Workflow)
1. Tại biểu mẫu thiết lập ca học của lớp, giáo vụ bấm vào nút tìm kiếm giáo viên (biểu tượng toàn cầu hoặc nút chọn giáo viên).
2. Hộp thoại nổi lên. Hệ thống tự động truyền các thông tin về thứ trong tuần và giờ học của ca đang chọn (nếu có) để tính toán trạng thái trùng lịch.
3. Giáo vụ nhập tên giáo viên hoặc lọc theo chi nhánh để tìm kiếm giảng viên phù hợp.
4. Hệ thống hiển thị danh sách giáo viên tương ứng kèm trạng thái "Trống lịch" (màu xanh lá) hoặc "Trùng lịch" (màu đỏ) dựa trên dữ liệu lịch dạy thực tế của hệ thống.
5. Giáo vụ bấm nút "Gán" tại dòng giáo viên được chọn. Hệ thống đóng hộp thoại và điền tên giáo viên vào ô giảng viên của ca học tương ứng trên biểu mẫu chính.

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|---|----------------------------------|---------------------|----------------------|
| 5.1 | Phân công giáo viên dạy môn không thuộc chương trình học | Hệ thống vẫn hiển thị nút Gán nhưng hiển thị nhãn cảnh báo nhỏ bên cạnh môn học của giáo viên để giáo vụ lưu ý xem giáo viên có đủ chuyên môn dạy lớp này hay không. | Cảnh báo chuyên môn |
| 5.2 | Giáo viên trùng lịch dạy nhưng trùng với lớp học của chính mình | Trường hợp giáo viên đã được gán trước đó cho ca này, trạng thái hiển thị sẽ là "Đang gán" thay vì "Trùng lịch" để tránh nhầm lẫn cho giáo vụ. | Tối ưu hóa hiển thị |
| 5.3 | Không truyền thông tin khung giờ ca học khi mở hộp thoại | Cột trạng thái lịch dạy sẽ hiển thị ký tự gạch ngang "—" báo hiệu không đủ dữ liệu để tính toán trùng lịch. | Thiếu thông tin đầu vào |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Bố cục chuẩn):** Giao diện hiển thị đúng cấu trúc bảng thông tin giáo viên, ô tìm kiếm nhanh hoạt động mượt mà và ô chọn chi nhánh hiển thị danh sách chi nhánh đầy đủ.
- **AC-2 (Tính toán trùng lịch):** Trạng thái "Trống lịch" và "Trùng lịch" hiển thị chính xác theo thời gian thực dựa trên thứ và khung giờ ca học được truyền vào.
- **AC-3 (Tìm kiếm nhanh):** Kết quả tìm kiếm tự động lọc ngay lập tức khi giáo vụ gõ từ khóa vào ô tìm kiếm mà không cần bấm nút tìm.
- **AC-4 (Gán và đóng hộp thoại):** Bấm nút "Gán" ghi nhận chính xác giáo viên được chọn, cập nhật thông tin về màn hình xếp ca học và đóng hộp thoại ngay lập tức.
