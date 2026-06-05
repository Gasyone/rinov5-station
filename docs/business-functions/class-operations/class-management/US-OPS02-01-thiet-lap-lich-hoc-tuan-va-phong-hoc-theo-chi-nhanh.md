---
id: US-OPS02-01
title: "Thiết lập lịch học tuần và phòng học theo chi nhánh (Biểu mẫu phụ)"
bf: BF-CLS-02
domain: CAP-OPS
status: draft
tags: [class, schedule, room, form]
---

# US-OPS02-01: Thiết lập lịch học tuần và phòng học theo chi nhánh (Biểu mẫu phụ)

> **Tham chiếu:** BF-CLS-02 (Quản lý Lớp học) · Tiêu chuẩn Thiết kế §4.4 (Hộp thoại Biểu mẫu)
> **Đường dẫn màn hình & Trạng thái liên quan:**
> - Hộp thoại Thiết lập lịch tuần mở từ tab **Lịch học cố định** tại hộp thoại chi tiết lớp học (mở từ màn `/app/classes`) -> Trạng thái áp dụng: `Nháp`, `Chờ khai giảng`, `Đang học`



## 1. Yêu cầu Người dùng (User Story)

**Là một** Nhân viên Giáo vụ hoặc Quản lý chi nhánh,  
**tôi muốn** thiết lập thời lượng học và lên lịch học cố định hàng tuần (gồm thứ trong tuần, giờ học, phòng học, giáo viên) cho một lớp học cụ thể,  
**để** hoàn tất việc lên lịch vận hành lớp học, tự động sinh các buổi học thực tế và tối ưu hóa việc sử dụng phòng học tại chi nhánh.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Thiết kế độc lập với luồng điểm danh hay nhận xét học viên theo buổi học.
> - [x] **N**egotiable — Số lượng phòng học và cách hiển thị danh sách giáo viên khả dụng có thể điều chỉnh linh hoạt.
> - [x] **V**aluable — Là bước cốt lõi để lớp học có lịch vận hành cố định, giúp phụ huynh và học sinh nắm được lịch học tuần.
> - [x] **E**stimable — Đã phân tách rõ ràng cấu trúc biểu mẫu thiết lập lịch học tuần theo từng ngày.
> - [x] **S**mall — Hoàn thành trong một vòng phát triển tập trung.
> - [x] **T**estable — Có tiêu chí nghiệm thu rõ ràng tại Mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-OPS-02-01-01] Tự động tính toán giờ kết thúc:** Khi giáo vụ chọn giờ bắt đầu của ca học, hệ thống tự động cộng thêm thời lượng tiêu chuẩn của lớp học để tính ra giờ kết thúc ca học. Trường giờ kết thúc ở trạng thái chỉ đọc, không cho phép nhập tay.
2. **[RULE-OPS-02-01-02] Gợi ý tự động dựa trên lịch mẫu:** Khi mở biểu mẫu cho một lớp học mới có cấu trúc lịch dự kiến (ví dụ lớp học Thứ Hai/Tư/Sáu), hệ thống tự động tích chọn sẵn các ngày Thứ Hai, Thứ Tư, Thứ Sáu làm gợi ý ban đầu để giáo vụ tiết kiệm thời gian thiết lập.
3. **[RULE-OPS-02-01-03] Hiển thị độ khả dụng của phòng và giáo viên:** Tại mỗi ngày học được bật, hệ thống hiển thị số lượng phòng học trống và số lượng giáo viên khả dụng tương ứng với khung giờ học đã chọn để hỗ trợ giáo vụ đưa ra lựa chọn phù hợp nhất.
4. **[RULE-OPS-02-01-04] Ràng buộc chi nhánh phòng học:** Danh sách phòng học hiển thị chỉ bao gồm các phòng thuộc chi nhánh quản lý của lớp học đó nhằm tránh xếp nhầm sang phòng học của chi nhánh khác.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-OPS-02-01-01] Thời lượng học tiêu chuẩn:** Mặc định thời lượng học của mỗi ca học là 90 phút (nếu không có cấu hình đặc biệt khác từ chương trình đào tạo).

---

## 3. Cấu trúc Các trường nhập liệu

**Bố cục:** Hộp thoại nổi 1 cột, chia thành các khối thẻ tương ứng với từng ngày trong tuần (Thứ 2 đến Chủ nhật).

### 3.1. Thông tin đầu vào

| Tên trường | Loại hiển thị | Bắt buộc | Diễn giải dữ liệu | Ghi chú & Quy tắc |
|------------|---------------|----------|-------------------|-------------------|
| Bật/tắt ngày học | Ô tích chọn (Checkbox) | Không | Kích hoạt ngày học trong tuần | Nhấp chọn để mở rộng khung điền giờ học, phòng học, giáo viên của ngày đó. |
| Giờ bắt đầu | Ô chọn giờ | Có (nếu ngày học được bật) | Giờ học bắt đầu | Nhập dưới dạng giờ:phút. |
| Giờ kết thúc | Ô nhập chữ | Chỉ đọc | Giờ học kết thúc | Tự động tính bằng cách cộng 90 phút (hoặc thời lượng lớp) vào Giờ bắt đầu. |
| Phòng học | Danh sách thả xuống | Có (nếu ngày học được bật) | Phòng học tại cơ sở | Chỉ hiển thị phòng thuộc chi nhánh của lớp học. |
| Giáo viên giảng dạy | Hộp tìm kiếm kết hợp danh sách | Có (nếu ngày học được bật) | Giáo viên đứng lớp ca học này | Cho phép tìm kiếm nhanh giáo viên và gán cho ca học. |
| Điều phối giáo viên hệ thống | Nút biểu tượng | Không | Mở hộp thoại tìm kiếm giáo viên toàn hệ thống | Nhấp để mở hộp thoại tìm chọn giáo viên nâng cao ở phạm vi toàn hệ thống. |

### 3.2. Ví dụ Dữ liệu mẫu

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
|------------|-----------------|-------------------|
| Thiết lập lịch học hợp lệ | Bật Thứ 2, Giờ bắt đầu: 18:00, Chọn Phòng A101, Giáo viên: "Nguyễn Văn A" -> Bấm Lưu | Giờ kết thúc tự động hiển thị 19:30. Lưu thành công, hệ thống cập nhật lịch cố định tuần và đóng hộp thoại. |
| Thiếu thông tin ngày học được bật | Bật Thứ 3, bỏ trống ô chọn Phòng học và Giáo viên -> Bấm Lưu | Hệ thống báo lỗi thiếu thông tin bắt buộc tại khối Thứ 3 và chặn lưu. |
| Thay đổi giờ học tự động tính lại giờ kết thúc | Thay đổi Giờ bắt đầu Thứ 2 từ 18:00 thành 17:30 | Giờ kết thúc tự động cập nhật từ 19:30 thành 19:00. |

### 3.3. Nút hành động

| Nút | Loại hiển thị | Logic xử lý |
|-----|---------------|-------------|
| Hủy | Nút viền nhạt ở chân trang | Đóng hộp thoại thiết lập lịch học tuần, giữ nguyên cấu hình lịch cũ của lớp. |
| Lưu áp dụng | Nút màu nhấn ở chân trang | Kiểm tra tính hợp lệ -> Lưu thông tin lịch học cố định -> Đóng hộp thoại -> Tải lại danh sách lịch học ở màn hình chi tiết lớp. |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
- Hộp thoại nổi hiển thị ở trung tâm màn hình, có chiều rộng vừa phải và hỗ trợ thanh cuộn dọc nếu danh sách các ngày học kéo dài.
- Tiêu đề hộp thoại: "Thiết lập thời lượng & Lịch học cố định".
- Phần mô tả bên dưới hướng dẫn giáo vụ các bước chọn buổi học, thiết lập giờ học, phòng học và điều phối giảng viên đứng lớp.
- Thân hộp thoại gồm 7 khối thông tin xếp dọc tương ứng với các thứ từ Thứ 2 đến Chủ nhật. Mỗi khối có đường viền bo tròn nhẹ, khi được tích chọn kích hoạt sẽ chuyển sang tông nền xám nhẹ để nổi bật hơn.
- Tại mỗi ngày học được bật, giao diện mở rộng hiển thị dòng chọn giờ (Giờ bắt đầu - Giờ kết thúc tự động), hàng chọn Phòng học (kèm số lượng phòng trống hiển thị dạng chữ nhỏ màu xanh bên trên) và hàng chọn Giáo viên (kèm ô tìm kiếm kết hợp nút biểu tượng tìm kiếm toàn hệ thống).

### 4.2. Luồng Hoạt động (Workflow)
1. Tại tab **Lịch học** của màn hình chi tiết lớp học, giáo vụ bấm nút *"Thiết lập lịch cố định"*.
2. Hộp thoại nổi mở ra, hiển thị trạng thái lịch hiện tại của lớp học (nếu có).
3. Giáo vụ thực hiện tích chọn thêm ngày học hoặc tắt các ngày học không còn áp dụng.
4. Đối với mỗi ngày học hoạt động, giáo vụ chọn giờ học bắt đầu. Giờ học kết thúc sẽ lập tức được điền tự động. Giáo vụ tiếp tục chọn Phòng học và Giáo viên giảng dạy chính.
5. Nếu giáo viên tại cơ sở bị trùng lịch, giáo vụ bấm vào nút biểu tượng tìm kiếm toàn hệ thống bên cạnh ô giáo viên để mở hộp thoại điều phối giáo viên nâng cao và chọn giáo viên từ chi nhánh khác sang dạy.
6. Sau khi hoàn thành thiết lập cho tất cả các ngày học mong muốn, giáo vụ bấm *"Lưu áp dụng"*. Hệ thống ghi nhận lịch học cố định, đóng hộp thoại và cập nhật danh sách lịch học tuần hiển thị trên giao diện chi tiết lớp học.

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|---|----------------------------------|---------------------|----------------------|
| 5.1 | Giáo vụ không tích chọn bất kỳ ngày học nào và bấm Lưu | Hệ thống hiển thị cảnh báo đỏ yêu cầu phải thiết lập ít nhất một ngày học trong tuần cho lớp trước khi bấm lưu áp dụng. | Khóa điều kiện tối thiểu |
| 5.2 | Phòng học bị trùng lịch với lớp học khác cùng giờ | Khi giáo vụ chọn phòng học đã bị lớp khác đăng ký cùng giờ, hệ thống hiển thị cảnh báo đỏ trùng phòng. Giáo vụ vẫn có thể cố tình lưu nếu muốn học chung phòng (trường hợp gộp lớp đặc biệt). | Cảnh báo trùng phòng học |
| 5.3 | Đã có các buổi học thực tế được tạo ra trước khi sửa lịch cố định | Khi lưu lịch cố định mới, hệ thống hiển thị thông báo hỏi giáo vụ có muốn áp dụng lịch mới cho toàn bộ các buổi học chưa diễn ra trong tương lai hay không. | Đồng bộ hóa lịch học |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Bố cục chuẩn):** Hộp thoại hiển thị đầy đủ danh sách 7 ngày trong tuần dưới dạng các khối thông tin độc lập có thể bật/tắt dễ dàng.
- **AC-2 (Tự động tính giờ):** Ô giờ kết thúc phải tự động cộng chính xác thời lượng của lớp học ngay khi thay đổi ô giờ bắt đầu và hiển thị ở dạng chỉ đọc.
- **AC-3 (Lọc phòng học chi nhánh):** Danh sách phòng học hiển thị chính xác các phòng thuộc chi nhánh quản lý của lớp học hiện tại.
- **AC-4 (Lưu và đồng bộ):** Bấm "Lưu áp dụng" cập nhật thành công lịch tuần của lớp, đóng hộp thoại và cập nhật thông tin hiển thị tại tab lịch học lớp.
