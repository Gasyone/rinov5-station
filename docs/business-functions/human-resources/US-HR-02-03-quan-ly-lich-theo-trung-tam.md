---
id: US-HR-02-03
title: "Quản lý lịch đã đăng ký theo trung tâm"
bf: BF-HR-02
domain: CAP-HR
status: ready
tags: [hr, schedule, availability, branch]
---

# US-HR-02-03: Quản lý lịch đã đăng ký theo trung tâm

> **Tham chiếu:** BF-HR-02 · `[POLICY-ORG-01]` · `[POLICY-DS-03]` · Giao diện Mẫu §4.2 (Danh sách)

## 1. Yêu cầu Người dùng (User Story)

**Là một** Quản lý trung tâm hoặc Quản trị viên, **tôi muốn** xem tổng quan lịch đã đăng ký của từng trung tâm và từng trạm/điểm trường theo ngày, **để** đánh giá mức độ sẵn sàng nhân sự trước khi xếp lớp.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Có thể triển khai như khu vực tổng quan trong màn Đăng ký lịch.
> - [x] **N**egotiable — Có thể hiển thị dạng bảng hoặc lịch tháng tùy thiết kế.
> - [x] **V**aluable — Giúp phát hiện trung tâm/trạm thiếu nhân sự theo khung giờ.
> - [x] **E**stimable — Phạm vi gồm lọc trung tâm, xem ngày, xem chi tiết và cảnh báo.
> - [x] **S**mall — Chỉ tổng hợp dữ liệu đăng ký rảnh mẫu, không xếp lịch lớp.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-HR-02-03-01] Tổng quan theo trung tâm:** Mỗi trung tâm phải có số nhân viên đã đăng ký, tổng giờ đăng ký và số khung giờ thiếu người dựa trên trung tâm làm việc của nhân viên; quỹ thời gian vẫn là lịch rảnh chung để vận hành điều phối.
2. **[RULE-HR-02-03-02] Phạm vi dữ liệu:** Người dùng chỉ thấy trung tâm và trạm thuộc phạm vi được phân quyền theo `[POLICY-ORG-01]`.
3. **[RULE-HR-02-03-03] Khung giờ ưu tiên thiếu phủ:** Một khung giờ ưu tiên được xem là thiếu phủ khi chưa có nhân sự nào đăng ký (hoặc chưa đạt yêu cầu vận hành hệ thống). Chỉ những khung giờ thuộc danh sách ưu tiên mới được tính vào chỉ số này.
4. **[RULE-HR-02-03-04] Chi tiết ngày:** Bấm vào một ngày hoặc một trung tâm/trạm phải mở được chi tiết các khung giờ và danh sách nhân viên liên quan.
5. **[RULE-HR-02-03-05] Không thay lịch lớp:** Chức năng này chỉ tổng hợp quỹ thời gian mẫu, không tạo hoặc sửa buổi học.
6. **[RULE-HR-02-03-06] Thiết lập khung giờ ưu tiên:** Thiết lập danh sách ngày và khung giờ phải nằm trong hộp thoại thiết lập riêng, mở bằng nút biểu tượng thiết lập. Thay đổi cấu hình chỉ làm thay đổi cảnh báo tổng hợp, không làm thay đổi lịch đã đăng ký.
7. **[RULE-HR-02-03-07] Bản đồ nhiệt chi tiết theo Trạm:** Lưới tổng hợp bản đồ nhiệt tự động phân mảnh và hiển thị dữ liệu phủ quỹ thời gian chi tiết đến từng Trạm/Điểm trường thuộc trung tâm, thay vì chỉ gộp chung ở cấp chi nhánh lớn.
8. **[RULE-HR-02-03-08] Chỉ số lỗ hổng ca trực Trạm học:** Tính toán lỗ hổng dựa trên lịch rảnh mẫu của các giáo viên được gán trực tiếp tại Trạm đó đối chiếu với các ca học thực tế tại Trạm để đưa ra cảnh báo thiếu phủ nhân sự chính xác.
9. **[RULE-HR-02-03-09] Đồng bộ khung giờ bản đồ nhiệt:** Để đảm bảo tính đồng bộ dữ liệu và tính toán chính xác chỉ số lỗ hổng ca trực, lưới thời gian trên bản đồ nhiệt trung tâm/trạm sẽ hiển thị theo danh sách các khung giờ (ca học) được thiết lập từ ERP cũ, thay vì sử dụng danh sách khung giờ cố định.

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-HR-02-03-01] SLA tải dữ liệu:** Thời gian tổng hợp và phản hồi biểu đồ nhiệt phủ toàn bộ trung tâm dưới 2.0 giây.
- **[METRIC-HR-02-03-02] Ngưỡng cảnh báo thiếu phủ:** Mặc định cảnh báo đỏ khi số lượng giáo viên rảnh vào ca học dưới 1 giáo viên đối với các trạm có trên 3 lớp hoạt động cùng giờ.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chọn trung tâm | Danh sách thả xuống | Xem tất cả hoặc một trung tâm | Lọc phạm vi so sánh hoặc tập trung vào một trung tâm. |
| Thiết lập ca ưu tiên | Nút biểu tượng | Mở hộp thoại thiết lập ngày áp dụng, ca áp dụng và khung giờ mẫu | Chỉ hiển thị khi có quyền quản trị. |
| Hướng dẫn | Nút phụ | Mở hộp thoại cảnh báo và quy tắc thao tác | |

### 3.2. Khối lọc Trạng thái (Thẻ chỉ số tổng hợp)
| Thành phần | Nhóm màu | Điều kiện | Ghi chú |
|------------|----------|-----------|---------|
| Trung tâm có đăng ký | Mặc định | Đếm số trung tâm có dữ liệu | |
| Tổng giờ đăng ký | Tích cực | Cộng dồn thời lượng lịch rảnh mẫu | |
| Khung giờ ưu tiên thiếu phủ | Cảnh báo (Nguy hiểm) | Đếm ca ưu tiên có số người đăng ký dưới ngưỡng | |
| Nhân viên chưa đăng ký | Trung tính | Đếm nhân viên có tổng giờ = 0 | |

### 3.3. Bảng danh sách chính (Bảng tổng hợp trung tâm)
| Cột | Loại hiển thị | Trường Dữ liệu | Ghi chú |
|-----|---------------|----------------|---------|
| Trung tâm / Trạm | Văn bản | Tên cơ sở/trạm | Bấm để xem Heatmap chi tiết. |
| Nhân viên đã đăng ký | Số liệu | Số giáo viên có ca rảnh | |
| Tổng giờ tuần | Số liệu | Tổng thời lượng rảnh | Định dạng giờ:phút. |
| Khung giờ ưu tiên thiếu phủ | Số liệu | Số ca học ưu tiên thiếu phủ | Hiển thị cảnh báo đỏ nếu > 0. |
| Các ngày trong tuần | Số liệu theo ngày | Lịch rảnh Thứ 2 - Chủ nhật | Tích hợp tổng tuần và chi tiết ngày. |
| Trạng thái | Nhãn màu | Sẵn sàng, Cần bổ sung, Chưa đủ dữ liệu | Theo bộ màu chuẩn. |

### 3.4. Thao tác khi rê chuột vào dòng (Hoặc click dòng trung tâm)
| Nút / Thao tác | Loại | Logic | Điều kiện |
|-----|------|-------|-----------|
| Bấm vào dòng trung tâm | Hành động Click | Mở màn hình hoặc hộp thoại chi tiết Heatmap của trung tâm đó | |

### 3.5. Bảng lọc nâng cao
Không áp dụng.

### 3.6. Phân trang (Thanh công cụ phân trang dưới Bảng tổng hợp)
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chọn kích thước trang | Hộp thả xuống (Dropdown) | Chọn số lượng dòng hiển thị trên một trang: `20`, `50`, `100` | Mặc định là 20 bản ghi/trang. |
| Hiển thị vị trí | Văn bản | Hiển thị dạng: `Hiển thị dòng X - Y trong Z dòng` | Cập nhật động theo vị trí trang hiện tại. |
| Điều hệ trang | Nhóm nút bấm biểu tượng | Gồm các nút: Về trang đầu (`<<`), Trang trước (`<`), Trang sau (`>`), Đến trang cuối (`>>`) | Nút trước bị vô hiệu hóa khi ở trang đầu, nút sau bị vô hiệu hóa khi ở trang cuối. |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
- Màn hình chứa khối chỉ số tổng hợp ở trên cùng.
- Bên dưới là bảng tổng hợp danh sách các trung tâm/trạm liên kết kèm Thanh công cụ phân trang (Pagination Toolbar) ghim cố định ở sát mép dưới bảng. Mỗi dòng thể hiện hiệu suất đăng ký lịch mẫu của trung tâm, bao gồm cả tổng tuần và chi tiết đếm rảnh theo từng ngày từ Thứ 2 đến Chủ nhật.
- Khi bấm vào một trung tâm/trạm học, một màn hình phụ hoặc vùng chi tiết mở rộng ra hiển thị biểu đồ nhiệt (Heatmap Grid): các dòng là ca học ERP cũ, các cột là Thứ 2 đến Chủ nhật. Mật độ giáo viên rảnh hiển thị rõ nét qua các sắc độ màu được gán.

### 4.2. Luồng Hoạt động (Workflow)
1. **Truy cập:** Quản lý trung tâm mở `/app/work_registration` và chọn tab "Tổng quan".
2. **Phát hiện thiếu hụt:** Quản lý quan sát chỉ số "Khung giờ ưu tiên thiếu phủ". Nhấp vào dòng của Trạm A để xem chi tiết Heatmap bên dưới.
3. **Xem chi tiết ca học:** Quản lý click vào một ô ca học bị cảnh báo thiếu phủ (hiển thị màu đỏ), hệ thống mở popover liệt kê chi tiết danh sách giáo viên của trạm đã đăng ký ca này (hoặc chưa đăng ký) để quản lý có kế hoạch nhắc nhở hoặc điều phối.
4. **Cấu hình ca ưu tiên:** Quản lý bấm nút "Thiết lập ca ưu tiên", hệ thống mở hộp thoại để điều chỉnh thời điểm giờ vàng. Thay đổi cấu hình lập tức tính toán lại toàn bộ chỉ số thiếu phủ trên biểu đồ.

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|---|----------------------------------|---------------------|----------------------|
| 5.1 | Trạm học chưa được cấu hình bất kỳ ca vàng/ca ưu tiên nào | Chỉ số "Khung giờ ưu tiên thiếu phủ" của trạm đó hiển thị bằng `0`. Heatmap chi tiết của trạm vẫn hiển thị mật độ rảnh bình thường nhưng không có dấu sao vàng đánh dấu ca vàng và không tính toán chỉ số cảnh báo thiếu phủ ở đầu trang. | Không báo lỗi hệ thống |
| 5.2 | Một lớp học thực tế có thời lượng kéo dài vắt qua 2 ca học ERP cũ (ví dụ: lớp học từ 17h00 đến 21h00, vắt qua Ca 1: 17h-19h và Ca 2: 19h-21h) | Thuật toán đối chiếu tự động tính toán lớp học này đang hoạt động và chiếm dụng tài nguyên ở **cả 2 ca**. Từ đó yêu cầu trạm phải có giáo viên rảnh tương ứng ở cả Ca 1 và Ca 2 để tránh lỗ hổng nhân sự, đảm bảo tính toán cung-cầu chuẩn xác. | Tính toán vắt ca học |
| 5.3 | Số lượng giáo viên rảnh tại một ca quá lớn (ví dụ: > 10 giáo viên rảnh cùng 1 ca) | Ô ca học trên Heatmap hiển thị màu xanh đậm nhất. Khi rê chuột (hover) vào ô, hệ thống chỉ hiển thị danh sách avatar stack của tối đa 3 giáo viên đầu tiên kèm con số đếm thêm (ví dụ: "+7"), ngăn chặn việc tràn viền hoặc vỡ bố cục hiển thị của ô Grid. | Xử lý tràn danh sách hiển thị |
| 5.4 | Giáo viên đã đăng ký rảnh mẫu nhưng Trạm gặp sự cố (thiên tai, mất điện) và hủy toàn bộ lớp thực tế trong ngày | Hệ thống ERP cũ cập nhật số lớp học thực tế của trạm hôm đó = 0. Thuật toán của Rinov5 lập tức tính toán lại lỗ hổng ca trực = 0 (Xanh an toàn) do nhu cầu thực tế bằng 0, phản ánh trung thực thực tế vận hành và tránh tạo cảnh báo ảo. | Phản ứng theo sự cố hủy lớp |
| 5.5 | Thay đổi ngày áp dụng của Quy tắc ca ưu tiên trong quá khứ hoặc tương lai | Hệ thống tự động tính toán lại mức độ sẵn sàng và lỗ hổng ca trực cho khoảng thời gian áp dụng tương thích của quy tắc mới, giữ nguyên lịch sử hoạt động cũ trước thời điểm hiệu lực để phục vụ báo cáo đối soát. | Quản lý hiệu lực quy tắc |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Độ chính xác của thẻ chỉ số):** Các thẻ chỉ số ở đầu màn hình tổng quan (Tổng giờ đăng ký, Số trạm có đăng ký, Ca ưu tiên thiếu phủ, Giáo viên chưa đăng ký) phải hiển thị chính xác các số liệu tổng hợp theo thời gian thực dựa trên các bộ lọc trung tâm và trạm đang chọn.
- **AC-2 (Click dòng TableRow mở Heatmap Trạm):** Khi người dùng nhấp chuột chọn trực tiếp vào một dòng trạm trên bảng tổng hợp, dòng đó được tô sáng (Selected Highlight) và Grid biểu đồ nhiệt (Heatmap) chi tiết của trạm đó lập tức mở ra ngay bên dưới bảng. Ô ca học của Heatmap hiển thị rõ tỷ lệ: `Số giáo viên rảnh / Số lớp đang chạy`.
- **AC-3 (Tính toán lỗ hổng ca trực chính xác theo màu sắc):** Sắc độ màu sắc của từng ô ca học trên Heatmap phải tự động biến đổi theo quy tắc đối chiếu cung - cầu:
  * **Màu Đỏ hoặc Cam (Warning):** Khi số lượng giáo viên rảnh tại trạm nhỏ hơn số lớp học thực tế đang chạy trong ca đó.
  * **Màu Xanh Lá (Positive):** Khi số lượng giáo viên rảnh tại trạm lớn hơn hoặc bằng số lớp học thực tế đang chạy.
- **AC-4 (Popover chi tiết ca học đầy đủ):** Khi nhấp chuột vào một ô ca học bất kỳ trên lưới Heatmap, hệ thống phải hiển thị một bảng tóm tắt Popover liệt kê đầy đủ: Danh sách họ tên các giáo viên của trạm đang rảnh ca đó, và danh sách tên các lớp học thực tế đang chạy tương ứng tại trạm.
- **AC-5 (Cấu hình ca ưu tiên độc lập):** Hộp thoại thiết lập ca ưu tiên (ca vàng) cho phép chọn ngày áp dụng và các ca. Khi nhấn lưu thành công, hệ thống cập nhật tức thời các chỉ số cảnh báo thiếu phủ ở đầu trang, tuyệt đối không được phép làm thay đổi hay xóa dữ liệu lịch mẫu đã đăng ký của giáo viên.
- **AC-6 (Phân trang ổn định):** Bảng danh sách tổng hợp trung tâm phân trang đúng chuẩn `[20, 50, 100]`, hiển thị đầy đủ thông tin số giáo viên đã đăng ký, tổng giờ tuần, và trạng thái sẵn sàng theo bộ màu chuẩn. Nút chuyển trang trước/sau hoạt động chính xác và tự động khóa (disabled) ở trang biên.

---

## 7. Làm rõ Nghiệp vụ tích hợp cho Product Owner (PO & BA)

Để hỗ trợ PO kiểm tra tính đúng đắn và hiệu quả vận hành của màn hình tổng quan trung tâm, phần này làm rõ các logic nghiệp vụ lõi:

### 7.1. Thuật toán nghiệp vụ xác định Lỗ hổng ca trực (Capacity Gap Logic)
Bản đồ nhiệt (Heatmap) không chỉ hiển thị số lượng giáo viên rảnh đơn thuần, mà nó thực hiện **đối chiếu cung - cầu thực tế** của từng Trạm học để cảnh báo lỗ hổng vận hành. Quy trình tính toán tại mỗi ô ca học của một Trạm diễn ra như sau:
1. **Xác định Nguồn cung (Giáo viên sẵn sàng):** Hệ thống lọc ra danh sách các giáo viên được gán làm việc trực tiếp tại Trạm học này, sau đó đếm xem có bao nhiêu giáo viên đã đăng ký lịch rảnh (Lịch mẫu) trùng khớp với ca học đó.
2. **Xác định Nhu cầu (Lớp học thực tế):** Hệ thống kết nối với module quản lý lớp học của ERP cũ để đếm xem trong ca học đó của ngày đó, Trạm học đang có bao nhiêu lớp học thực tế đang hoạt động cần giáo viên giảng dạy.
3. **Tính toán Lỗ hổng:** 
   * `Lỗ hổng ca trực = Số lớp học thực tế cần dạy - Số giáo viên đang rảnh`.
   * **Trường hợp đủ người (Lỗ hổng <= 0):** Ô ca học hiển thị màu xanh lá (Positive). Thể hiện trạm đã đủ nguồn lực để vận hành.
   * **Trường hợp thiếu người (Lỗ hổng > 0):** Ô ca học lập tức đổi sang màu đỏ hoặc cam (Warning), kèm theo con số hiển thị số lượng giáo viên đang bị thiếu hụt (ví dụ: Thiếu 2 giáo viên).

### 7.2. Tích hợp đồng bộ Lịch học từ ERP cũ (Real-time Class Schedule Sync)
* Trực quan hóa bản đồ nhiệt đòi hỏi dữ liệu luôn luôn khớp với thực tế xếp lớp ở hệ thống ERP cũ.
* Bất cứ khi nào một lớp học mới được xếp ca trực tại Trạm, hoặc một lớp học bị hủy/đổi ca trực ở ERP cũ, bản đồ nhiệt của Rinov5 sẽ tự động cập nhật lại nhu cầu giáo viên tương ứng mà không tạo độ trễ dữ liệu.
* Điều này giúp quản lý trạm luôn nhìn thấy bức tranh chính xác nhất về tình hình nhân sự tại thời điểm kiểm tra để đưa ra quyết định điều phối kịp thời.

### 7.3. Ý nghĩa vận hành của Thiết lập Ca ưu tiên (Golden Shifts Setup)
* Khái niệm "Khung giờ ưu tiên" (hay ca vàng) đại diện cho các khung giờ cao điểm của Trạm (thường là tối thứ 2-4-6 hoặc cả ngày Thứ 7, Chủ nhật).
* Quản lý trung tâm có thể chủ động định nghĩa các "ca vàng" này thông qua nút thiết lập riêng. Cấu hình này giúp hệ thống:
  * Tập trung quét và đếm số lượng ca vàng bị thiếu người để đưa lên Thẻ chỉ số cảnh báo ở đầu trang, giúp quản lý không phải dò tìm thủ công trên lưới Heatmap khổng lồ.
  * Việc thay đổi cấu hình ca vàng chỉ làm thay đổi cách tính toán chỉ số cảnh báo thiếu phủ ở trên đầu màn hình tổng quan, tuyệt đối không làm thay đổi hay can thiệp vào dữ liệu đăng ký giờ rảnh mẫu của từng giáo viên.
