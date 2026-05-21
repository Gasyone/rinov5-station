---
id: US-HR-02-03
title: "Quản lý lịch đã đăng ký theo trung tâm"
bf: BF-HR-02
domain: CAP-HR
status: ready
tags: [hr, schedule, availability, branch]
---

# US-HR-02-03: Quản lý lịch đã đăng ký theo trung tâm

> **Tham chiếu:** BF-HR-02 · `[POLICY-ORG-01]` · `[POLICY-DS-03]` · Giao diện Mẫu §4.2 (Danh sách) · Giao diện Mẫu §4.4 (Biểu mẫu)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Quản lý trung tâm hoặc Quản trị viên, **tôi muốn** xem tổng quan lịch đã đăng ký của từng trung tâm theo ngày và theo tuần, **để** đánh giá mức độ sẵn sàng nhân sự trước khi xếp lớp.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Có thể triển khai như khu vực tổng quan trong màn Đăng ký lịch.
> - [x] **N**egotiable — Có thể hiển thị dạng bảng hoặc lịch tháng tùy thiết kế.
> - [x] **V**aluable — Giúp phát hiện trung tâm thiếu nhân sự theo khung giờ.
> - [x] **E**stimable — Phạm vi gồm lọc trung tâm, xem ngày, xem chi tiết và cảnh báo.
> - [x] **S**mall — Chỉ tổng hợp dữ liệu đăng ký, không xếp lịch lớp.
> - [x] **T**estable — Có tiêu chí kiểm thử tại mục 6 và 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-HR-02-03-01] Tổng quan theo trung tâm:** Mỗi trung tâm phải có số nhân viên đã đăng ký, tổng giờ đăng ký và số khung giờ thiếu người dựa trên trung tâm làm việc của nhân viên; quỹ thời gian vẫn là lịch rảnh chung để vận hành điều phối.
2. **[RULE-HR-02-03-02] Phạm vi dữ liệu:** Người dùng chỉ thấy trung tâm thuộc phạm vi được phân quyền theo `[POLICY-ORG-01]`.
3. **[RULE-HR-02-03-03] Khung giờ ưu tiên thiếu phủ:** Một khung giờ ưu tiên được xem là thiếu phủ khi chưa có nhân sự nào đăng ký (hoặc chưa đạt yêu cầu vận hành hệ thống). Chỉ những khung giờ thuộc danh sách ưu tiên mới được tính vào chỉ số này.
4. **[RULE-HR-02-03-04] Chi tiết ngày:** Bấm vào một ngày hoặc một trung tâm phải mở được chi tiết các khung giờ và danh sách nhân viên liên quan.
5. **[RULE-HR-02-03-05] Không thay lịch lớp:** Chức năng này chỉ tổng hợp quỹ thời gian, không tạo hoặc sửa buổi học.
6. **[RULE-HR-02-03-06] Thiết lập khung giờ ưu tiên:** Thiết lập danh sách ngày và khung giờ phải nằm trong hộp thoại thiết lập riêng, mở bằng nút biểu tượng thiết lập. Thay đổi cấu hình chỉ làm thay đổi cảnh báo tổng hợp, không làm thay đổi lịch đã đăng ký.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chọn tuần | Nhóm nút điều hướng | Về hôm nay, tuần trước, tuần sau | Đồng bộ với các thẻ còn lại. |
| Chọn trung tâm | Danh sách thả xuống | Xem tất cả hoặc một trung tâm | Bắt buộc để quản lý so sánh toàn bộ phạm vi hoặc tập trung vào một trung tâm; không làm lịch rảnh bị gắn cố định với trung tâm đó. |
| Thiết lập khung giờ ưu tiên | Nút biểu tượng | Mở hộp thoại thiết lập ngày áp dụng, ca áp dụng và khung giờ | Tách riêng khỏi nút hướng dẫn để tránh nhầm với cảnh báo. |
| Hướng dẫn | Nút phụ | Mở hộp thoại cảnh báo và quy tắc thao tác | Không hiển thị danh sách khung giờ cấu hình. |

### 3.2. Khối chỉ số
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Trung tâm có đăng ký | Thẻ chỉ số | Đếm trung tâm có dữ liệu | So sánh nhanh mức phủ. |
| Tổng giờ đăng ký | Thẻ chỉ số | Cộng thời lượng toàn bộ nhân viên | Theo tuần đang xem. |
| Khung giờ ưu tiên thiếu phủ | Thẻ chỉ số | Đếm khung giờ ưu tiên có số người đăng ký thấp hơn ngưỡng | Dùng nhóm màu cảnh báo chuẩn. |
| Nhân viên chưa đăng ký | Thẻ chỉ số | Đếm người chưa có lịch tuần | Giúp quản lý theo dõi. |

### 3.3. Bảng tổng hợp trung tâm
| Cột | Loại hiển thị | Nội dung | Ghi chú |
|-----|---------------|----------|---------|
| Trung tâm | Văn bản | Tên trung tâm | Bấm để xem chi tiết. |
| Nhân viên đã đăng ký | Số liệu | Số người có ít nhất một khung giờ | Theo tuần đang xem. |
| Tổng giờ tuần | Số liệu | Tổng thời lượng đã đăng ký trong tuần đang xem | Dùng định dạng giờ. |
| Khung giờ ưu tiên thiếu phủ | Số liệu | Số khung giờ ưu tiên thiếu nhân sự | Hiển thị rõ để xử lý. |
| Các ngày trong tuần | Số liệu theo ngày | Mỗi ngày hiển thị tổng giờ, số nhân viên đã đăng ký và số khung giờ ưu tiên thiếu phủ | Giúp đọc được cả tổng tuần và từng ngày trong cùng một bảng. |
| Trạng thái | Nhãn màu | Sẵn sàng, Cần bổ sung, Chưa đủ dữ liệu | Theo bộ màu chuẩn. |
| Phần chân danh sách | Phân trang | Hiển thị số dòng, kích thước trang và điều hướng trang | Tuân thủ Giao diện Mẫu §4.2. |

### 3.4. Chi tiết trung tâm
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Lưới ngày và khung giờ | Bảng lịch | Hiển thị mật độ nhân sự theo khung giờ | Dùng cùng khung giờ từ 07:00 đến 23:00, mỗi ô cách nhau 30 phút; bấm khung giờ để xem danh sách. |
| Danh sách nhân viên | Danh sách | Tên, chức danh, tổng giờ | Không chỉnh sửa trực tiếp. |
| Cảnh báo | Nhãn chú ý | Khung giờ dưới ngưỡng hoặc chưa có người | Theo nguyên tắc phản hồi rõ ràng. |

---

### 3.5. Hộp thoại Thiết lập Khung giờ ưu tiên
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chế độ xem / sửa | Trạng thái hộp thoại | Có 2 chế độ: Chỉ xem (Readonly) và Đang chỉnh sửa (Edit Mode). Ở chế độ Xem, các ô chọn bị vô hiệu hóa. | Nút chỉnh sửa nằm ở góc dưới hộp thoại. |
| Ngày áp dụng từ | Ô chọn ngày | Chọn ngày bắt đầu hiệu lực của quy tắc, áp dụng chung. | |
| Ca áp dụng | Nhóm nút / Danh sách | Chọn Ca sáng, Ca chiều hoặc Ca tối để thiết lập giờ vàng. Quy tắc sẽ tự động áp dụng cho tất cả các ngày trong tuần. | Hiển thị dạng danh sách bên cột trái. |
| Khung giờ ưu tiên | Nhóm ô chọn | Các khung giờ 30 phút tương ứng với Ca đang được chọn. | Hiển thị ở cột phải. |


---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Trung tâm chưa có nhân viên đăng ký | Hiển thị trạng thái cần bổ sung và gợi ý chuyển sang thẻ quản lý. |
| 4.2 | Không có trung tâm trong phạm vi | Hiển thị trạng thái trống phù hợp với quyền truy cập. |
| 4.3 | Một ngày không có dữ liệu | Ô ngày vẫn hiển thị, nội dung là chưa có đăng ký. |
| 4.4 | Dữ liệu quá nhiều | Ưu tiên số lượng và mở chi tiết khi người dùng cần xem danh sách. |
| 4.5 | Chưa cấu hình khung giờ ưu tiên | Chỉ số thiếu phủ hiển thị bằng không và nút thiết lập riêng cho phép bổ sung cấu hình. |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Phải kiểm tra phân quyền trước khi cho phép xem dữ liệu và thực hiện thao tác.
- Nhãn trạng thái bắt buộc lấy màu từ bộ quy tắc trạng thái chuẩn của doanh nghiệp.
- Bố cục danh sách phải đáp ứng đúng chuẩn trải nghiệm người dùng.
- Màn hình Trung tâm sử dụng bảng tổng hợp theo tuần với các cột là các ngày. Không sử dụng lại chế độ xem theo tháng trừ khi tài liệu yêu cầu này được cập nhật.
- Số liệu khung giờ thiếu phủ phải được tính toán từ các quy tắc cấu hình khung giờ ưu tiên, không được gắn cứng hiển thị trên giao diện.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** thêm cột, trường lọc, hoặc nút bấm ngoài danh sách đã được định nghĩa ở mục 3.
- **KHÔNG** bỏ qua các trạng thái Trống / Đang tải / Lỗi khi thiết kế luồng hiển thị.

---

## 6. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Tổng hợp trung tâm theo tuần | Chọn tuần có dữ liệu | Số trung tâm, tổng giờ tuần, từng ngày trong tuần và cảnh báo hiển thị đúng. |
| V-02 | Lọc trung tâm | Chọn một trung tâm | Bảng và chi tiết chỉ còn trung tâm đó. |
| V-03 | Chi tiết ngày | Bấm vào một dòng trung tâm | Hộp thoại hoặc vùng chi tiết hiển thị nhân viên liên quan. |
| V-04 | Trạng thái màu | Kiểm tra trạng thái tổng hợp | Không có màu hardcode cho nhãn trạng thái. |
| V-05 | Phần chân danh sách | Quan sát cuối bảng trung tâm | Có phân trang và kích thước trang mặc định theo chuẩn. |
| V-06 | Cấu hình khung giờ ưu tiên | Mở hộp thoại thiết lập riêng, chỉnh ngày hoặc các khung giờ ưu tiên rồi lưu | Chỉ số thiếu phủ thay đổi theo cấu hình mới. |

---

## 7. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Có tổng quan theo trung tâm | Mở thẻ Trung tâm | Hiển thị chỉ số và bảng tổng hợp. |
| AC-02 | Bộ lọc trung tâm hoạt động | Chọn một trung tâm | Toàn bộ số liệu đổi theo trung tâm đã chọn. |
| AC-03 | Cảnh báo thiếu phủ rõ ràng | Mở tuần có khung giờ ưu tiên dưới ngưỡng | Chỉ số thiếu phủ của trung tâm và từng ngày phản ánh đúng ngưỡng vận hành. |
| AC-04 | Xem chi tiết được | Bấm dòng trung tâm | Hiển thị danh sách nhân viên và khung giờ liên quan. |
| AC-05 | Không có thao tác ngoài phạm vi | Quan sát thẻ trung tâm | Không có nút tạo hoặc sửa buổi học. |
| AC-06 | Bảng trung tâm đúng chuẩn danh sách | Mở thẻ Trung tâm | Bảng có thanh điều hướng phân trang, trạng thái trống chuẩn và nhãn trạng thái lấy từ bộ màu chuẩn. |
| AC-07 | Cập nhật cấu hình khung giờ ưu tiên | Mở hộp thoại thiết lập riêng và lưu thay đổi cấu hình | Hệ thống giữ nguyên lịch đã đăng ký và chỉ cập nhật cách tính cảnh báo. |
