---
id: US-CLS02-06
title: "Hộp thoại Chi tiết Lớp học Trung tâm (Bản Lớn)"
bf: BF-CLS-02
domain: CAP-OPS
status: draft
tags: [class, detail-modal, roster, learning-path, logs]
---

# US-CLS02-06: Hộp thoại Chi tiết Lớp học Trung tâm (Bản Lớn)

> **Tham chiếu:** BF-CLS-02 (Quản lý Lớp học) · Tiêu chuẩn Thiết kế §4.3 (Hộp thoại chi tiết)
> **Đường dẫn màn hình & Trạng thái liên quan:**
> - Hộp thoại chi tiết lớn mở ra khi bấm vào tên lớp ở bất kỳ dòng nào tại bảng `/app/classes` -> Trạng thái áp dụng: `Nháp`, `Chờ khai giảng`, `Đang học`, `Tạm dừng`, `Đã kết thúc`



## 1. Yêu cầu Người dùng (User Story)

**Là một** Nhân viên Giáo vụ hoặc Quản lý chi nhánh,  
**tôi muốn** mở một hộp thoại chi tiết lớp học bản lớn dạng một cột toàn màn hình, sử dụng thanh tiêu đề thông minh chứa các thông số nhanh và hệ thống phân tab rộng rãi,  
**để** tập trung tối đa vào việc tra cứu lộ trình học tập, quản lý danh sách học viên và ghi nhận tương tác một cách trực quan, tối ưu không gian hiển thị trên máy tính.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Thiết kế độc lập dưới dạng hộp thoại tích hợp gọn gàng.
> - [x] **N**egotiable — Chi tiết cấu trúc tab và các thẻ thông tin nhanh ở tiêu đề có thể tinh chỉnh thêm.
> - [x] **V**aluable — Giúp giáo vụ vận hành nhanh, tối ưu không gian hiển thị rộng rãi thay vì bị chia nhỏ diện tích.
> - [x] **E**stimable — Đã phân định rõ ranh giới các tab và thanh tiêu đề thông minh.
> - [x] **S**mall — Hoàn thành trong một vòng phát triển tập trung.
> - [x] **T**estable — Có các tiêu chí nghiệm thu rõ ràng tại Mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-CLS-06-01] Trực quan hóa trạng thái học viên 2 tầng:** Nhằm phân biệt rõ ràng giữa trạng thái hệ thống cốt lõi và mối quan hệ tạm thời của học viên đối với lớp học, thẻ học viên trong danh sách bắt buộc phải biểu diễn 2 nhóm huy hiệu độc lập:
   - **Trạng thái chính thức trên hệ thống (Huy hiệu chính):** 
     - *Ghi danh*: Học viên mới ghi danh học phí, dùng huy hiệu màu xanh lam.
     - *Đang học*: Học viên đang học tập bình thường trên hệ thống, dùng huy hiệu màu xanh lá.
     - *Đã nghỉ*: Học viên đã nghỉ học hoàn toàn, dùng huy hiệu màu đỏ.
   - **Hình thức tham gia lớp học (Nhãn phụ):** 
     - *Học thử*: Nhãn phụ màu tím báo hiệu học viên đang trải nghiệm.
     - *Bảo lưu*: Nhãn phụ màu hổ phách/cam báo hiệu học viên đang tạm hoãn lớp này.
     - *Đã chuyển*: Nhãn phụ màu xám báo hiệu đã chuyển sang lớp học khác.
     - *Hết buổi*: Nhãn phụ màu xám báo hiệu đã học hết buổi đăng ký.
     - *Mới*: Nhãn phụ màu xanh lam báo hiệu mới được xếp vào danh sách lớp.
2. **[RULE-CLS-06-02] Thông tin Lịch học & Giáo viên theo buổi:** Mỗi buổi học thực tế phải ghi nhận riêng biệt thông tin giảng dạy thực tế bao gồm phòng học, giáo viên phụ trách chính và giáo viên dạy thay (nếu có). Tránh trường hợp mặc định dùng giáo viên chủ nhiệm nếu có sự thay đổi giáo viên hoặc phòng học đột xuất tại buổi đó.
3. **[RULE-CLS-06-03] Lộ trình học tập tuyến tính:** Lộ trình bài học phải được phân chia thành từng buổi học kế tiếp nhau:
   - Mỗi buổi hiển thị thông tin bài học dự kiến, đề mục nội dung chi tiết.
   - Trạng thái các buổi phải phân loại trực quan: Đã học, Đang diễn ra, Buổi học tiếp theo, Chưa bắt đầu.
4. **[RULE-CLS-06-04] Nhật ký hoạt động tương tác:** Bất kỳ hành động vận hành nào liên quan đến lớp (như: đổi trạng thái lớp, thêm/xóa học viên, phân công giáo viên dạy thay, đổi phòng học, hoặc ghi chú nội bộ) đều phải được hệ thống ghi nhận thành một dòng nhật ký tự động thời gian thực có gắn tên người thực hiện.
5. **[RULE-CLS-06-05] Thẻ thông tin nhanh tại Tiêu đề:** Nhằm tối ưu hóa diện tích hiển thị, phần tiêu đề hộp thoại phải tích hợp các thẻ thông tin tóm tắt để người dùng nhận diện nhanh mà không cần chuyển sang tab khác:
   - Sĩ số lớp (Ví dụ: "15/20 học viên")
   - Lịch học cố định (Ví dụ: "T2/4/6 (18:00 - 19:30)")
   - Lịch buổi học tiếp theo (Ví dụ: "Buổi tiếp theo: 02/06 (Phòng A101 - Giáo viên Lan)")

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-CLS-06-01] Sĩ số cảnh báo:** Khi sĩ số học viên đạt từ 90% định mức tối đa của lớp trở lên, chỉ số sĩ số phải chuyển sang màu nhấn mạnh cảnh báo quá tải để Giáo vụ hạn chế thêm học viên mới.
- **[METRIC-CLS-06-02] Tải danh sách:** Danh sách học viên và nhật ký hoạt động hiển thị tối đa 50 bản ghi. Đối với nhật ký tương tác, sắp xếp bản ghi mới nhất hiển thị trên cùng.

---

## 3. Cấu trúc Giao diện & Dữ liệu

Hộp thoại chi tiết sử dụng bố cục **Một cột toàn diện** chiếm trọn bề ngang hộp thoại, giúp các bảng danh sách học viên và dòng thời gian lộ trình học có không gian hiển thị rộng rãi nhất.

### 3.1. Tiêu đề & Các thẻ thông tin nhanh (Header Banner)
Phần đầu của hộp thoại chứa thông tin nhận diện cốt lõi của lớp học:
- **Tên lớp học & Mã lớp:** In đậm lớn.
- **Badge Trạng thái lớp:** Nhãn màu chuẩn (Đang học, Chờ khai giảng, Tạm dừng, Nháp...).
- **Nhóm Thẻ thông tin nhanh:**
   - *Thẻ Sĩ số:* hiển thị dạng số kèm thanh đo tiến độ siêu mỏng.
   - *Thẻ Khung chương trình:* hiển thị tên đề cương áp dụng.
   - *Thẻ Buổi kế tiếp:* tóm tắt ngày, giờ, phòng học, giáo viên phụ trách của buổi học sắp tới.
- **Nhóm Nút hành động:**
   - Nút "Chỉnh sửa": Khi nhấp vào nút này, tab **Tổng quan** sẽ chuyển sang chế độ chỉnh sửa trực tiếp. Tiêu đề sẽ hiển thị nút "Lưu thay đổi" và nút "Hủy".
   - Nút "Tốt nghiệp / Đóng lớp" (chỉ khả dụng khi lớp đang hoạt động).

### 3.2. Cấu trúc Phân tab Vùng chính (Full-width Tabs)
Bên dưới thanh tiêu đề là hệ thống 5 tab nội dung toàn chiều rộng:

#### Tab 1: Học viên & Phân loại Nhãn (Roster)
*Không gian rộng rãi giúp hiển thị bảng danh sách học viên cực kỳ rõ ràng:*
- **Thẻ học viên:**
  - Ảnh đại diện học viên (chữ cái đầu), Họ tên đầy đủ, và Mã số học viên.
  - **Trực quan hóa trạng thái 2 tầng:**
    - Huy hiệu chính (Trạng thái chính thức trên hệ thống): Đang học, Ghi danh, Đã nghỉ.
    - Nhãn phụ (Hình thức tham gia lớp): Mới, Học thử, Bảo lưu, Đã chuyển, Hết buổi.
  - **Ngày nhập học:** Được hiển thị ở góc bên phải của thẻ học viên.
  - **Thông tin Phụ huynh (Liên hệ gia đình):** Hiển thị dưới dạng một ô thông tin nổi khi rê chuột vào phần thông tin học viên. Ô thông tin này liệt kê danh sách tất cả các phụ huynh liên hệ của học viên với đầy đủ Tên, Số điện thoại (đã che bớt chữ số) cùng hai nút tác vụ nhanh bên cạnh: nút kết nối cuộc gọi và nút sao chép nhanh số điện thoại.
- **Bộ lọc nhanh:** Thanh lọc nhanh theo nhãn trạng thái (Tất cả, Đang học, Mới ghi danh, Học thử, Bảo lưu/Chuyển, Đã nghỉ).
- **Hành động ở chân thẻ học viên:** 
  - **Ghi chú học viên (ở góc trái bên dưới):** Nếu học viên có ghi chú, hiển thị một biểu tượng ghi chú nhỏ màu hổ phách kèm đoạn văn bản tóm tắt được rút gọn. Khi click vào, hệ thống sẽ mở ra một bong bóng thoại nổi hiển thị đầy đủ nội dung ghi chú chi tiết.
  - **Nút "Xóa khỏi lớp" (ở góc phải bên dưới, khi không ở chế độ chỉ đọc):** Mở ra hộp thoại xác nhận trước khi thực hiện xóa học viên khỏi danh sách lớp.

#### Tab 2: Lộ trình & Giáo trình (Learning Path)
*Giao diện dòng thời gian buổi học được kéo rộng, hiển thị trực quan thông tin chi tiết từng buổi:*
- **Dòng thời gian buổi học:**
  - Thứ tự buổi học (Buổi 1, Buổi 2, Buổi 3...).
  - Tiêu đề bài học và Mô tả ngắn nội dung bài học.
  - Giáo viên đứng lớp thực tế (bao gồm cả ảnh đại diện nhỏ và tên) cùng số phòng học.
  - Nhãn phân biệt trạng thái buổi học (Đã dạy, Đang diễn ra, Buổi kế tiếp, Chưa học).
  - **Trường hợp dạy thay:** Nếu có giáo viên dạy thay, tên giáo viên chính sẽ được gạch ngang mờ đi, và hiển thị nổi bật tên giáo viên dạy thay kèm theo nhãn nhỏ "Dạy thay".
- **Tài liệu đính kèm:** Liên kết tải giáo án, tài liệu học tập và bài tập về nhà của buổi đó.

#### Tab 3: Buổi học thực tế
- Hiển thị danh sách chi tiết các buổi học thực tế đã và sắp diễn ra.
- Hỗ trợ đổi lịch học, đổi phòng học hoặc gán giáo viên dạy thay cho từng buổi học cụ thể khi có sự cố phát sinh đột xuất.

#### Tab 4: Lịch học cố định (Weekly Schedule)
Cấu hình khung thời gian cố định hàng tuần của lớp học:
- **Danh sách ngày học:** Hiển thị các ngày trong tuần lớp có lịch (Ví dụ: Thứ Hai & Thứ Năm).
- **Chi tiết khung giờ:** Giờ bắt đầu - Giờ kết thúc của ca học.
- **Tài nguyên mặc định:** Phòng học cố định và Giáo viên phụ trách chính cùng Trợ giảng được chỉ định mặc định cho ca học đó.

#### Tab 5: Tổng quan & Thông tin chung (Overview)
Tab này hiển thị các thông tin tổng hợp của lớp học:
- **Thông tin cơ bản (ở chế độ Chỉ Xem):** Chi nhánh quản lý, Giáo viên chủ nhiệm, Trợ giảng chỉ định, Phòng học cố định, Ngày khai giảng, Ngày bế giảng dự kiến, Sĩ số, và Loại hình giáo viên.
- **Thông tin cơ bản (ở chế độ Chỉnh Sửa):**
  - Tên lớp học, Mã lớp học.
  - Khung chương trình (Danh sách chọn - Khi chọn, tự động điền Môn học, Trình độ chính & phụ và khóa các trường này lại).
  - Loại hình lớp, Môn học, Trình độ chính & phụ.
  - Sĩ số tối đa, Loại hình giáo viên, Cơ sở đào tạo.
  - Ngày bắt đầu & Ngày kết thúc.
  - Giáo viên chủ nhiệm, Trợ giảng chỉ định.
  - Phòng học cố định ca học (Chỉ hiển thị danh sách phòng thuộc Cơ sở đào tạo đã chọn).

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Giao diện trực quan
Hộp thoại chi tiết lớp học sẽ chiếm khoảng 85% - 90% diện tích màn hình máy tính nhưng được thiết kế thoáng đãng, tận dụng cấu trúc lưới rộng rãi.
- Không có cột trái cố định giúp cho phần bảng học viên và dòng thời gian lộ trình học được hiển thị trọn vẹn, không bị cuộn ngang trên màn hình laptop nhỏ.
- Phần biểu ngữ tiêu đề trang sử dụng các thẻ thông tin nhỏ với màu nền nhạt sang trọng, biểu tượng tinh tế để không làm rối mắt người dùng.
- Tích hợp một thanh bên thu gọn bên phải để ghi nhận tương tác nhanh và nhật ký hoạt động vận hành mà không ảnh hưởng đến khu vực phân tab chính.

### 4.2. Luồng hoạt động chính
1. **Mở hộp thoại:** Từ màn hình danh sách lớp học chính, người dùng bấm vào Tên lớp học bất kỳ hoặc bấm nút hành động "Xem chi tiết". Hộp thoại chi tiết lớn sẽ mở ra ngay trung tâm màn hình, mặc định hiển thị Tab đầu tiên là **Học viên** để người dùng kiểm tra nhanh sĩ số và danh sách.
2. **Kiểm tra thông số nhanh:** Khi có phụ huynh đến hỏi thông tin, giáo vụ mở hộp thoại lên và chỉ cần nhìn lướt qua phần tiêu đề là có thể trả lời ngay: *Lớp đang có bao nhiêu học sinh, lịch học cố định vào thứ mấy, và buổi học tiếp theo diễn ra lúc nào, phòng nào, ai dạy* mà không cần bấm vào bất kỳ tab nào.
3. **Tra cứu chi tiết hành chính:** Khi cần biết sâu hơn về ngày khai giảng, chương trình đào tạo hay các ghi chú cũ của cơ sở, giáo vụ chỉ cần bấm sang tab **Tổng quan** để đọc.
4. **Ghi nhật ký tương tác:** Tại thanh ghi chú tương tác bên phải, người dùng có thể gõ nội dung phản hồi nội bộ (ví dụ: "Phụ huynh phản ánh phòng học hơi lạnh") và bấm nút gửi. Dòng ghi chú này sẽ ngay lập tức được chèn vào đầu danh sách lịch sử hoạt động cùng tên của người thực hiện hiện tại.

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|---|----------------------------------|----------------------|----------------------|
| 5.1 | Lớp học chưa được gán Khung chương trình | Tab "Lộ trình" sẽ hiển thị trạng thái trống hướng dẫn giáo vụ nhấn nút "Gán khung chương trình" để tự động sinh lộ trình buổi học. | Trạng thái trống |
| 5.2 | Buổi học có giáo viên dạy thay | Trên dòng thời gian lộ trình, tên giáo viên chính sẽ bị gạch ngang mờ đi, và hiển thị nổi bật tên giáo viên dạy thay kèm theo nhãn nhỏ "Dạy thay". | Hiển thị đặc biệt |
| 5.3 | Học viên đã bảo lưu hoặc chuyển lớp | Trong danh sách học viên, dòng của học viên này sẽ được làm mờ nhẹ đi, nhãn hiển thị rõ trạng thái "Bảo lưu" hoặc "Đã chuyển", đồng thời loại trừ khỏi sĩ số thực tế đang học của lớp để tránh nhầm lẫn. | Loại trừ sĩ số |
| 5.4 | Nhật ký hoạt động quá dài | Mặc định tải 20 dòng hoạt động mới nhất, phía dưới cùng hiển thị nút "Xem thêm nhật ký" để người dùng tải tiếp dữ liệu lịch sử cũ hơn. | Phân trang nhật ký |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Thiết kế một cột tối ưu diện tích):** Hộp thoại hiển thị đúng kích cỡ lớn nằm giữa màn hình, không sử dụng cột trái cố định, tối ưu toàn bộ bề ngang cho khu vực nội dung chính.
- **AC-2 (Thanh tiêu đề thông minh):** Thanh tiêu đề hiển thị chính xác Tên lớp, Mã lớp, Badge trạng thái lớp và đầy đủ 3 thẻ thông tin nhanh (Sĩ số, Lịch cố định, Thông tin buổi học kế tiếp).
- **AC-3 (Tab Tổng quan chuyên sâu):** Tab Tổng quan chứa đầy đủ thông tin hành chính, mức học phí, ngày khai giảng/kết thúc và các chỉ số hoạt động trực quan.
- **AC-4 (Nhãn học viên rõ ràng):** Tab học viên hiển thị đầy đủ thông tin học viên kèm nhãn trạng thái Đang học, Học thử, Bảo lưu, Chuyển lớp có màu sắc chính xác theo quy chuẩn.
- **AC-5 (Lộ trình chi tiết theo buổi):** Tab Lộ trình biểu diễn dòng thời gian các buổi học từ đầu đến cuối khóa học, hiển thị rõ ràng thông tin Ngày học, Tiêu đề bài học, Giáo viên đứng lớp thực tế (gồm cả dạy thay nếu có), Phòng học và Trạng thái buổi học.
