---
id: US-CLS02-02
title: "Khởi tạo lớp học mới và Xếp lịch tuần"
bf: BF-CLS-02
domain: CAP-OPS
status: draft
tags: [class, creation, form]
---

# US-CLS02-02: Khởi tạo lớp học mới và Xếp lịch tuần

> **Tham chiếu:** BF-CLS-02 · Design System §4.4 (Hộp thoại Biểu mẫu)
> **Đường dẫn màn hình & Trạng thái liên quan:**
> - Hộp thoại biểu mẫu mở ra từ màn danh sách `/app/classes` (bằng cách nhấn nút **Tạo lớp**) -> Trạng thái sau khi hoàn thành tạo mới: `Nháp`



## 1. Yêu cầu Người dùng (User Story)
**Là một** Giáo vụ hoặc Quản lý chi nhánh,  
**tôi muốn** khởi tạo một lớp học mới, cấu hình thông tin cơ bản và thiết lập lịch học tuần cùng phòng học/giáo viên cho từng buổi học,  
**để** làm cơ sở chuẩn bị tuyển sinh học viên và tổ chức giảng dạy.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập với quy trình quản lý học viên nâng cao.
> - [x] **N**egotiable — Cấu trúc các bước có thể điều chỉnh để tối ưu hóa trải nghiệm người dùng.
> - [x] **V**aluable — Tạo vỏ lớp là điều kiện bắt buộc để có thể mở lớp và dạy học.
> - [x] **E**stimable — Đã xác định rõ các trường dữ liệu và ràng buộc.
> - [x] **S**mall — Hoàn thành trong một phân đoạn phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu chi tiết ở mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-CLS-02-02-01] Ràng buộc Khung chương trình:** Khi người dùng chọn Khung chương trình đào tạo, hệ thống tự động điền thông tin *Môn học* và *Trình độ chính/phụ* tương ứng và khóa các ô này ở dạng chỉ xem. Người dùng không được chỉnh sửa độc lập các trường này.
2. **[RULE-CLS-02-02-02] Tự sinh mã lớp:** Mã lớp học có thể nhập thủ công. Nếu bỏ trống, khi lưu hệ thống sẽ tự sinh theo định dạng: `CLS-[MÃ MÔN]-[SỐ THỨ TỰ]` (Ví dụ: `CLS-IELTS-011`).
3. **[RULE-CLS-02-02-03] Ràng buộc địa điểm phòng học:** Phòng học được phân công ở các ngày trong tuần bắt buộc phải thuộc Chi nhánh (cơ sở) đang chọn của lớp học.
4. **[RULE-CLS-02-02-04] Ràng buộc nhân sự giáo viên:** Danh sách giáo viên giảng dạy ở các ngày trong tuần không bị giới hạn bởi chi nhánh của lớp học (cho phép phân công giáo viên liên cơ sở hoặc giáo viên thỉnh giảng tự do).
5. **[RULE-CLS-02-02-05] Ràng buộc ca học:** Giờ bắt đầu và giờ kết thúc phải lấy theo danh mục ca học đã đăng ký trước trên hệ thống. Nếu thay đổi ca học, giờ học tương ứng sẽ tự động cập nhật lại.
6. **[RULE-CLS-02-02-06] Quy trình 2 bước linh hoạt:** 
   - Bước 1: Thiết lập thông tin và xếp lịch học tuần. Người dùng có thể bấm "Tạo nháp" để kết thúc và lưu lớp ở trạng thái **Nháp** ngay tại đây.
   - Bước 2: Thêm học viên vào lớp (Roster). Bấm "Tạo lớp" để hoàn thành và lưu ở trạng thái **Nháp**.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-CLS-02-02-01] Số ca học tối đa trong tuần:** Không quá 7 ca học cố định hàng tuần được gán cho một lớp học.
- **[METRIC-CLS-02-02-02] Thời lượng ca học chuẩn:** Lựa chọn từ danh mục thời lượng 60 phút, 90 phút, 100 phút hoặc 120 phút.

---

## 3. Cấu trúc Các trường nhập liệu (Bước 1)

### 3.1. Thông tin vỏ lớp học
| Tên trường | Loại hiển thị | Bắt buộc | Nguồn dữ liệu / Quy tắc |
|------------|---------------|----------|-------------------|
| Tên lớp học | Ô nhập chữ | Có | Người dùng gõ. Ví dụ: "IELTS Junior 1A" |
| Mã lớp học | Ô nhập chữ | Không | Tự sinh nếu để trống. Định dạng chữ in hoa không dấu. |
| Cơ sở / Chi nhánh | Danh sách chọn | Có | Danh sách chi nhánh của trung tâm. |
| Khung chương trình | Danh sách chọn | Có | Danh sách Syllabus đang hoạt động. |
| Môn học | Ô hiển thị | Không | Chỉ xem, tự động điền theo Khung chương trình. |
| Trình độ | Ô hiển thị | Không | Chỉ xem, tự động điền theo Khung chương trình. |
| Loại lớp | Ô chọn nhóm | Có | Giá trị: "Chính thức" hoặc "Workshop". |
| Sĩ số dự kiến | Danh sách chọn | Có | Các tỉ lệ tiêu chuẩn: 1:1, 1:6, 1:10, 1:15, 1:20. |
| Giáo viên chủ nhiệm | Ô chọn tìm kiếm | Không | Tìm kiếm theo tên hoặc mã giáo viên hệ thống. |
| Thời lượng buổi học | Danh sách chọn | Có | Lựa chọn số phút: 60, 90, 100, 120 phút. |
| Ngày bắt đầu | Ô chọn ngày | Có | Định dạng ngày khai giảng dự kiến. |
| Ngày kết thúc | Ô chọn ngày | Không | Ngày bế giảng dự kiến. |

### 3.2. Cấu hình lịch học trong tuần
Đối với mỗi ngày trong tuần (Thứ 2 đến Chủ nhật) khi được kích hoạt học:
| Tên trường | Loại hiển thị | Bắt buộc | Quy tắc |
|------------|---------------|----------|---------|
| Kích hoạt ngày | Hộp chọn (Checkbox) | Không | Tích chọn để đăng ký ngày học đó. |
| Ca học / Giờ học | Ô chọn thời gian | Có | Giờ bắt đầu. Giờ kết thúc tự động tính dựa trên thời lượng. |
| Phòng học | Danh sách chọn | Có | Lọc danh sách phòng thuộc Chi nhánh đã chọn ở trên. |
| Giáo viên giảng dạy | Ô chọn tìm kiếm | Có | Danh sách giáo viên toàn hệ thống. |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Bố cục Giao diện
- Hộp thoại biểu mẫu mở ra dạng cửa sổ lớn phủ màn hình để chứa lượng thông tin xếp lịch lớn.
- **Bước 1**: Chia làm 2 cột:
  - Cột bên trái: Điền các thông tin cơ bản của lớp học (Tên, mã, cơ sở, loại hình, khung chương trình).
  - Cột bên phải: Cấu hình lịch học và phân bổ phòng, giáo viên cho các ngày trong tuần.
- **Bước 2**: Giao diện roster học viên, hiển thị danh sách các học viên được gán vào lớp và nút mở hộp thoại chọn học viên nâng cao.

### 4.2. Luồng Hoạt động (Workflow)
1. Người dùng bấm nút "Tạo lớp" trên thanh công cụ danh sách lớp.
2. Hộp thoại mở ra tại Bước 1. Người dùng nhập các thông tin cơ bản. Khi chọn Chi nhánh, hệ thống tự động kích hoạt bộ lọc phòng học bên cột xếp lịch tuần. Khi chọn Khung chương trình, các trường Môn học và Trình độ hiển thị giá trị điền sẵn và khóa lại.
3. Người dùng tích chọn ngày học (ví dụ: Thứ 2 và Thứ 4), chọn giờ học và phân phòng, giáo viên cho từng ngày.
4. Người dùng có thể:
   - Bấm **Tạo nháp**: Hệ thống lưu thông tin lớp học ở trạng thái "Nháp" và đóng hộp thoại.
   - Bấm **Tiếp theo**: Hệ thống kiểm tra hợp lệ dữ liệu Bước 1, nếu thành công sẽ chuyển sang giao diện Bước 2.
5. Tại Bước 2: Người dùng gán thêm học viên vào lớp (tùy chọn). Sau đó bấm **Tạo lớp** để hoàn tất lưu thông tin ở trạng thái "Nháp".

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|---|----------------------------------|---------------------|----------------------|
| 5.1 | Giáo vụ thay đổi Chi nhánh của lớp học khi đã xếp lịch phòng học | Hệ thống hiển thị cảnh báo đỏ và tự động xóa sạch các lựa chọn phòng học của các ngày trong tuần cũ, yêu cầu chọn lại phòng học thuộc chi nhánh mới. | Kiểm tra thời gian thực |
| 5.2 | Phòng học được chọn bị trùng lịch học khác | Khi bấm lưu hoặc chuyển bước, hệ thống đối chiếu lịch phòng học của chi nhánh, hiển thị cảnh báo trùng phòng cụ thể và chặn lưu. | Chặn lưu từ hệ thống |
| 5.3 | Giáo viên được chọn bị trùng lịch dạy khác | Hiển thị cảnh báo trùng lịch giáo viên cụ thể nhưng cho phép giáo vụ bỏ qua cảnh báo nếu là trường hợp ngoại lệ chấp nhận trùng. | Cảnh báo tương tác |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Ràng buộc Khung chương trình):** Lựa chọn Khung chương trình thành công phải điền chính xác Môn học/Trình độ và khóa các ô này ở chế độ chỉ xem.
- **AC-2 (Ràng buộc phòng học):** Danh sách phòng học hiển thị cho từng ngày trong lịch tuần chỉ bao gồm các phòng thuộc cơ sở chi nhánh đã chọn của lớp học.
- **AC-3 (Lưu nháp thành công):** Bấm "Tạo nháp" lưu lớp học ở trạng thái Nháp với các thông tin đã điền, danh sách chính hiển thị lớp mới với badge màu xám.
- **AC-4 (Kiểm tra trùng phòng):** Chặn lưu và báo lỗi rõ ràng nếu có phòng học bị trùng lịch hoạt động vào ngày giờ tương ứng.
