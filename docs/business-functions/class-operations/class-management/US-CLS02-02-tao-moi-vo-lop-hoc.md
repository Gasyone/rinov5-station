---
id: US-CLS02-02
title: "Khởi tạo lớp học mới và Xếp lịch tuần"
bf: BF-CLS-02
domain: CAP-OPS
status: standardized
tags: [class, creation, form]
---

# US-CLS02-02: Khởi tạo lớp học mới và Xếp lịch tuần

> **Tham chiếu:** BF-CLS-02 · Design System §4.4 (Hộp thoại Biểu mẫu)
> **Đường dẫn màn hình & Trạng thái liên quan:**
> - Hộp thoại biểu mẫu mở ra từ màn danh sách `/app/classes` (bằng cách nhấn nút **Tạo lớp**) -> Trạng thái sau khi hoàn thành tạo mới: `Nháp` hoặc `Chờ khai giảng`



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

1. **[RULE-CLS-02-02-01] Gợi ý Khung chương trình:** Khi người dùng chọn Khung chương trình đào tạo, hệ thống tự động điền gợi ý thông tin *Môn học* và *Trình độ chính/phụ* tương ứng. Người dùng vẫn được phép tự do chỉnh sửa lại các thông tin Trình độ này sau đó.
2. **[RULE-CLS-02-02-02] Tự sinh mã lớp:** Mã lớp học có thể nhập thủ công. Nếu bỏ trống, khi lưu hệ thống sẽ tự sinh theo định dạng: `CLS-[MÃ MÔN]-[SỐ THỰ CỰ]` hoặc mã định danh ngẫu nhiên nếu không xác định được số thứ tự.
3. **[RULE-CLS-02-02-03] Ràng buộc địa điểm phòng học và nhân sự:** Phòng học được phân công ở các ngày trong tuần bắt buộc phải thuộc Cơ sở đang chọn của lớp. Giáo vụ được phép phân công đồng thời cả **Giáo viên chính** và **Trợ giảng** cho mỗi ngày học được kích hoạt trong lịch tuần.
4. **[RULE-CLS-02-02-04] Ràng buộc nhân sự giáo viên:** Danh sách giáo viên chính và trợ giảng giảng dạy ở các ngày trong tuần không bị giới hạn bởi chi nhánh của lớp học (cho phép phân công giáo viên liên cơ sở hoặc trợ giảng thỉnh giảng tự do).
5. **[RULE-CLS-02-02-05] Ca học:** Hệ thống hiển thị danh mục các ca học đã được thiết lập sẵn (ví dụ: Ca 1: 08:00, Ca 2: 09:45, Ca 3: 14:00, Ca 4: 15:45, Ca 5: 17:30, Ca 6: 19:15). Khi xếp lịch, giáo vụ chọn ca học từ danh sách này. Thời gian bắt đầu và kết thúc của ca học được tự động điền và khóa cứng, không cho phép nhập giờ thủ công.
6. **[RULE-CLS-02-02-06] Quy trình 2 bước và cơ chế Khai giảng/Tạo lớp nháp:**
   - *Bước 1 (Thông tin lớp):* Giáo vụ thiết lập thông tin cơ bản và lịch học tuần. Có thể bấm **Tạo lớp nháp** để lưu vỏ lớp ở trạng thái **Nháp** ngay tại đây (chỉ yêu cầu Tên lớp và Trường/Cơ sở). Bấm **Tiếp theo** để sang Bước 2.
   - *Bước 2 (Thêm học viên):* Giáo vụ có thể:
     - Bấm **Tạo lớp nháp**: Lưu lớp ở trạng thái **Nháp** (học viên không bắt buộc).
     - Bấm **Khai giảng**: Hệ thống tự động kiểm tra điều kiện khai giảng.
   - *Quy tắc kiểm tra điều kiện khai giảng:*
     - Nếu thiếu các thông tin bắt buộc tại Bước 1 (Tên lớp, Trường/Cơ sở, Môn học, Ngày bắt đầu, Ngày kết thúc, hoặc chưa kích hoạt ít nhất 1 ngày học trong tuần), hoặc các ngày học được kích hoạt chưa chọn phòng học hay chưa phân công phụ trách, hệ thống hiển thị thông báo lỗi màu đỏ dưới các trường tương ứng và hiển thị biểu ngữ báo lỗi: "Không đủ điều kiện chờ khai giảng. Vui lòng bổ sung thông tin đỏ."
     - Nếu thiếu học viên tại Bước 2, hệ thống hiển thị biểu ngữ cảnh báo màu đỏ phía trên danh sách học viên: "Lớp học cần có ít nhất 1 học viên xếp lớp."
     - Tất cả các lỗi trên sẽ chặn hoàn toàn hành động lưu lớp ở trạng thái Chờ khai giảng.
7. **[RULE-CLS-02-02-07] Ủy thác sinh buổi học thực tế:** Biểu mẫu này chỉ ghi nhận các thông số thiết lập tĩnh (thông tin vỏ) và lịch học lặp cố định hàng tuần. Quy trình tự sinh lịch học chi tiết toàn thời gian và sinh các buổi học thực tế sẽ được hệ thống xếp lịch tự động vận hành.
8. **[RULE-CLS-02-02-08] Cơ chế cảnh báo và gán trùng lịch giáo viên:** Hệ thống hiển thị trùng ca và cho phép gán trùng lịch giáo viên/trợ giảng:
   - *Quy tắc gối đầu ca liền kề:* Hệ thống chấp nhận thời gian kết thúc của ca trước trùng với thời gian bắt đầu của ca sau (ví dụ: ca trước kết thúc lúc 19:30, ca sau bắt đầu lúc 19:30) cho cả phòng học và nhân sự.
   - *Ràng buộc phòng học:* Hệ thống kiểm tra xung đột phòng học vật lý với lịch học lớp khác hoặc ca kiểm tra đầu vào đã được xếp trước đó tại cơ sở. Nếu có trùng lặp, hệ thống bôi đỏ trường tương ứng và chặn lưu tuyệt đối.
   - *Cơ chế hiển thị và gán trùng giáo viên:* Khi gán giáo viên chính hoặc trợ giảng bị trùng lịch, danh sách lựa chọn sẽ hiển thị thông tin trùng lịch chi tiết bằng chữ màu đỏ dưới tên nhân sự (ví dụ: "Trùng lịch: 09:15 - 10:45"). Hệ thống không chặn gán và lưu lớp học, cho phép người dùng tự quyết định gán giáo viên gối ca nếu phù hợp với thực tế vận hành.
9. **[RULE-CLS-02-02-09] Hộp thoại điều phối giáo viên hệ thống:** Nút có biểu tượng hình quả địa cầu được bố trí cạnh các trường chọn giáo viên chính và trợ giảng của từng ngày học. Khi giáo vụ nhấp vào nút này, hệ thống sẽ mở ra một hộp thoại phụ hiển thị danh sách giáo viên toàn hệ thống kèm trạng thái Trống/Trùng lịch và các ca trùng chi tiết để hỗ trợ việc tra cứu và phân công nhân sự tối ưu nhất.


### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-CLS-02-02-01] Số ca học tối đa trong tuần:** Không quá 7 ca học cố định hàng tuần được gán cho một lớp học.
- **[METRIC-CLS-02-02-02] Thời lượng ca học chuẩn:** Lựa chọn từ danh mục thời lượng 60 phút, 90 phút, 100 phút hoặc 120 phút.

---

## 3. Cấu trúc Các trường nhập liệu (Bước 1)

### 3.1. Thông tin vỏ lớp học
| Tên trường | Loại hiển thị | Bắt buộc | Nguồn dữ liệu / Quy tắc |
|------------|---------------|----------|-------------------|
| Tên lớp | Ô nhập chữ | Có | Người dùng gõ. Ví dụ: "IELTS Junior 1A" |
| Mã lớp | Ô nhập chữ | Không | Tự sinh nếu để trống. Định dạng chữ in hoa không dấu. |
| Trường | Danh sách chọn | Có | Danh sách chi nhánh/cơ sở kế thừa từ hệ thống. |
| Khung chương trình | Danh sách chọn | Không | Danh sách Khung đào tạo đang hoạt động. |
| Môn học | Danh sách chọn | Có | Điền sẵn theo Khung chương trình (nếu có chọn) nhưng cho phép sửa đổi. |
| Trình độ chính | Danh sách chọn | Có | Điền sẵn theo Khung chương trình (nếu có chọn) nhưng cho phép sửa đổi. |
| Trình độ phụ | Danh sách chọn | Không | Điền sẵn theo Khung chương trình (nếu có chọn) nhưng cho phép sửa đổi. |
| Loại lớp | Gán sẵn | Có | Gán mặc định là "Chính thức" trên giao diện thử nghiệm. |
| Sĩ số | Danh sách chọn | Có | Các tỷ lệ tiêu chuẩn: 1:1, 1:6, 1:10, 1:15, 1:20. Xác định sĩ số tối đa của lớp học. |
| Loại giáo viên | Danh sách chọn | Có | Lựa chọn: "Nước ngoài", "Việt Nam", hoặc "MIX". |
| Phụ trách (Global) | Nhóm hiển thị hình ảnh + Nút | Không | Gồm Giáo viên chủ nhiệm và Trợ giảng chỉ định. Chọn nhanh bằng bong bóng tìm kiếm (Popover). Di chuột vào avatar hiển thị thẻ thông tin nhân sự. |
| Thời lượng | Danh sách chọn | Có | Lựa chọn số phút: 60, 90, 100, 120 phút. Nằm ở phần cấu hình lịch. |
| Ngày bắt đầu | Ô chọn ngày | Có | Định dạng ngày khai giảng dự kiến. |
| Ngày kết thúc | Ô chọn ngày | Có | Ngày bế giảng dự kiến (Bắt buộc khi khai giảng). |
| Phòng học cố định | Danh sách chọn | Không | Chọn phòng học mặc định của lớp tại Trường đã chọn. |

### 3.2. Cấu hình lịch học trong tuần
Đối với mỗi ngày trong tuần (Thứ 2 đến Chủ nhật) khi được kích hoạt học:
| Tên trường | Loại hiển thị | Bắt buộc | Quy tắc |
|------------|---------------|----------|---------|
| Kích hoạt ngày | Hộp tích chọn | Không | Tích chọn để đăng ký ngày học đó. |
| Ca học | Danh sách chọn | Có | Lựa chọn ca học cố định (Ca 1 đến Ca 6). Thời gian bắt đầu và kết thúc tự động điền và khóa cứng. |
| Phòng học | Danh sách chọn | Có | Lọc danh sách phòng thuộc Trường đã chọn từ dữ liệu hệ thống. |
| Phụ trách | Nhóm hiển thị tên + Nút | Có | Gồm Giáo viên chính (bắt buộc) và Trợ giảng (không bắt buộc). Chọn qua tìm kiếm nhanh bằng bong bóng (Popover) hoặc bấm nút hình quả địa cầu để mở hộp thoại Điều phối giáo viên hệ thống. |

### 3.3. Danh sách học viên xếp lớp (Bước 2)
Bảng thông tin học viên được gán vào lớp:
| Tên cột | Loại hiển thị | Bắt buộc | Quy tắc / Mô tả |
|---------|---------------|----------|-----------------|
| Học viên | Nhóm ảnh + Tên + Mã | Có | Hiển thị ảnh đại diện viết tắt, họ tên và mã số học viên. Chứa nút biểu tượng Thùng rác để xóa học viên khỏi lớp. |
| Trình độ | Nhãn hiển thị | Có | Thể hiện cấp độ học lực của học viên. |
| Gói đăng ký | Ô chữ | Có | Tên gói chương trình học viên đã đăng ký mua. |
| Số buổi còn lại | Số | Có | Số lượng buổi học còn lại được quyền tham gia giảng dạy. |
| Ghi chú | Nút biểu tượng | Không | Bong bóng bấm mở hiển thị chi tiết ghi chú từ Sale/Tư vấn tuyển sinh. |

### 3.4. Các thông báo lỗi kiểm tra điều kiện (Validation)
Các lỗi kiểm tra điều kiện sẽ xuất hiện khi người dùng bấm nút **Khai giảng** hoặc **Tạo nháp** mà thiếu thông tin bắt buộc:
| Tình huống lỗi | Vị trí hiển thị | Nội dung thông báo lỗi |
|----------------|-----------------|------------------------|
| Thiếu Tên lớp | Dưới ô Tên lớp (chữ đỏ) | "Vui lòng nhập tên lớp" |
| Thiếu Trường/Cơ sở | Dưới ô Trường (chữ đỏ) | "Vui lòng chọn chi nhánh/trường" |
| Thiếu Môn học | Dưới ô Môn học (chữ đỏ) | "Vui lòng chọn môn học" |
| Thiếu Ngày bắt đầu | Dưới ô Ngày bắt đầu (chữ đỏ) | "Vui lòng chọn ngày bắt đầu" |
| Thiếu Ngày kết thúc | Dưới ô Ngày kết thúc (chữ đỏ) | "Vui lòng chọn ngày kết thúc" |
| Kích hoạt ngày học mà chưa chọn phòng | Dưới ô Phòng học của ngày đó | "Vui lòng chọn phòng học cho ngày này" |
| Kích hoạt ngày học mà chưa gán giáo viên | Dưới ô Phụ trách của ngày đó | "Vui lòng phân công phụ trách cho ngày này" |
| Chưa kích hoạt ngày học nào trong tuần | Dưới danh mục Lịch học tuần | "Vui lòng kích hoạt ít nhất 1 ngày học trong tuần" |
| Chưa gán học viên ở Bước 2 | Biểu ngữ đỏ phía trên bảng học viên | "Lớp học cần có ít nhất 1 học viên xếp lớp" |
| Vi phạm bất kỳ điều kiện Khai giảng nào | Hộp thoại thông báo góc trên bên phải | "Không đủ điều kiện chờ khai giảng. Vui lòng bổ sung thông tin đỏ." |
| Thiếu Tên lớp khi bấm Tạo nháp | Hộp thoại thông báo góc trên bên phải | "Vui lòng nhập tên lớp!" |
| Thiếu Trường khi bấm Tạo nháp | Hộp thoại thông báo góc trên bên phải | "Vui lòng chọn trường!" |

### 3.5. Cấu trúc trường Hộp thoại Điều phối giáo viên hệ thống
Bảng danh sách giáo viên toàn hệ thống để gán vào ca học:
| Tên trường / Cột | Loại hiển thị | Bắt buộc | Quy tắc / Mô tả |
|------------------|---------------|----------|-----------------|
| Tìm kiếm nhân sự | Ô nhập chữ | Không | Nhập từ khóa tìm nhanh theo Tên, Mã số, Email hoặc SĐT. |
| Chi nhánh lọc | Danh sách chọn | Không | Chọn cơ sở làm việc để lọc nhanh danh sách. |
| Họ và tên / Mã GV | Cột bảng (Chữ) | Có | Hiển thị tên đầy đủ, mã số nhân sự và số điện thoại. |
| Chi nhánh chính | Cột bảng (Chữ) | Có | Cơ sở đăng ký làm việc chính của giáo viên. |
| Môn giảng dạy | Cột bảng (Badge) | Có | Các nhãn môn học giáo viên được phân quyền đứng lớp. |
| Lịch dạy | Cột bảng (Badge) | Có | Hiển thị nhãn xanh "Trống lịch" hoặc nhãn đỏ "Trùng lịch" kèm giờ trùng chi tiết tại ca học đang gán. |
| Thao tác | Cột bảng (Nút) | Có | Nút "Gán" để phân công giáo viên đó vào ngày học hiện tại. |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Bố cục Giao diện
- Hộp thoại biểu mẫu mở ra dạng cửa sổ lớn phủ màn hình để chứa lượng thông tin xếp lịch lớn.
- **Bước 1**: Chia làm 2 cột:
  - Cột bên trái: Điền các thông tin cơ bản của lớp học (Tên, mã, cơ sở, loại hình, khung chương trình, phụ trách chung).
  - Cột bên phải: Cấu hình lịch học và phân bổ phòng, giáo viên cho các ngày trong tuần. Có các thẻ chuyển tab hiển thị dạng danh sách (List) hoặc lịch biểu (Calendar).
- **Bước 2**: Hiển thị bảng danh sách các học viên được xếp lớp (đang chờ gán vào lớp).
  - Phía trên bảng là thanh tiêu đề hiển thị tổng số học viên hiện tại (ví dụ: "Học viên (12/15)") kèm nút màu nhấn để mở cửa sổ chọn học viên.
  - Phía dưới là danh sách học viên dạng bảng với các cột thông tin học lực, gói học tập, số buổi khả dụng và ghi chú. Mỗi học viên có một nút biểu tượng thùng rác màu tiêu cực để xóa học viên khỏi danh sách gán nhanh.

### 4.2. Luồng Hoạt động (Workflow)
1. **Khởi tạo và Mở biểu mẫu**: Người dùng nhấp nút **Tạo lớp** từ màn hình danh sách lớp học. Hệ thống mở cửa sổ nổi ở trạng thái mặc định: Tên lớp trống, Trường tự động chọn theo Chi nhánh hiện tại của người dùng, Lịch học tuần chưa kích hoạt ngày nào.
2. **Thiết lập Bước 1**:
   - Người dùng nhập Tên lớp, chọn Khung chương trình (nếu có). Hệ thống tự điền gợi ý Môn học và Trình độ học lực phù hợp.
   - Người dùng cấu hình lịch học bằng cách tích chọn các ngày học trong tuần ở cột bên phải. Với mỗi ngày học được bật, người dùng bắt buộc chọn ca học, chọn phòng học trống tại Trường hiện tại, và chọn Giáo viên phụ trách (thông qua bong bóng chọn nhanh hoặc qua cửa sổ phụ điều phối giáo viên hệ thống).
   - Tại Bước 1, người dùng có thể nhấp **Tạo lớp nháp** để lưu ngay lớp học ở trạng thái **Nháp** (chỉ cần nhập Tên lớp và Trường).
3. **Chuyển tiếp sang Bước 2**:
   - Người dùng nhấp nút **Tiếp theo** để chuyển sang màn hình danh sách học viên.
   - Người dùng nhấp nút **Chọn học viên xếp lớp** để mở cửa sổ phụ từ [US-CLS02-05](file:///c:/Users/Jacky%20Tran/Documents/Rinov5/docs/business-functions/class-operations/class-management/US-CLS02-05-them-hoc-vien-vao-lop.md). Sau khi chọn học viên và xác nhận, danh sách học viên được đưa vào bảng ở Bước 2.
4. **Lưu dữ liệu và Hoàn tất**:
   - Nhấp **Quay lại** để trở về Bước 1 điều chỉnh thông tin (dữ liệu học viên ở Bước 2 vẫn được lưu giữ tạm thời).
   - Nhấp **Tạo lớp nháp** tại Bước 2: Lưu lớp học ở trạng thái **Nháp** thành công (cho phép gán 0 học viên).
   - Nhấp **Khai giảng** tại Bước 2: Hệ thống chạy quy trình kiểm tra toàn bộ điều kiện khai giảng. Nếu hợp lệ, lưu lớp học với trạng thái **Chờ khai giảng**, đóng cửa sổ nổi và làm mới danh sách lớp học. Nếu không hợp lệ (ví dụ: thiếu thông tin bắt buộc hoặc chưa có học viên), hệ thống hiển thị cảnh báo đỏ và ngăn chặn lưu.

---

## 5. Corner Cases (Trường hợp góc cảnh & Đặc biệt)

*(Bắt buộc phải liệt kê đầy đủ các trường hợp đặc biệt, ngoại lệ hoặc lỗi có thể xảy ra trong thực tế. Trong quá trình xây dựng, nếu phát sinh thêm bất kỳ trường hợp đặc biệt nào, người viết và lập trình viên phải lập tức cập nhật bổ sung vào bảng này.)*

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|---|----------------------------------|---------------------|----------------------|
| 5.1 | Giáo vụ thay đổi Chi nhánh của lớp học khi đã xếp lịch phòng học | Hệ thống hiển thị cảnh báo đỏ và tự động xóa lựa chọn phòng học cố định global. (Xử lý xóa tự động phòng học của từng ngày trong lịch tuần được xếp lịch cải tiến ở các phiên bản tiếp theo). | Kiểm tra thời gian thực |
| 5.2 | Phòng học hoặc Giáo viên/Trợ giảng được chọn trùng lịch học khác nhưng liền kề ca | Hệ thống chấp nhận cho phép lưu bình thường nếu thời gian kết thúc của ca trước trùng với thời gian bắt đầu của ca sau (ca gối đầu). | Chấp nhận gối đầu |
| 5.3 | Phòng học hoặc Giáo viên/Trợ giảng được chọn bị trùng lịch ca kiểm tra đầu vào (Booking Test) | - Đối với phòng học: Hệ thống chặn lưu tuyệt đối khi phát hiện trùng lặp phòng vật lý đang bận.<br>- Đối với Giáo viên/Trợ giảng: Hệ thống hiển thị cảnh báo "Trùng lịch: 18:00 - 19:30" bằng chữ màu đỏ trong danh sách chọn nhưng không chặn lưu (cho phép gán gối ca). | Phòng học: Chặn lưu. Giáo viên: Cảnh báo và cho phép lưu |
| 5.4 | Nhập mã lớp thủ công trùng lặp | Hệ thống hiển thị thông báo lỗi tại trường Mã lớp học và chặn hành động lưu lớp học. | Chặn trùng lặp |
| 5.5 | Giáo vụ chọn ngày kết thúc nhỏ hơn hoặc bằng ngày bắt đầu | Hệ thống bôi đỏ trường tương ứng, hiển thị thông báo lỗi "Ngày kết thúc phải sau ngày bắt đầu" dưới ô ngày kết thúc và chặn lưu Khai giảng. | Khai giảng: Chặn lưu |
| 5.6 | Giáo vụ thay đổi Trường/Cơ sở của lớp khi đã tích chọn học viên ở Bước 2 | Hệ thống tự động loại bỏ các học viên thuộc chi nhánh cũ ra khỏi danh sách Bước 2, hiển thị thông báo yêu cầu chọn lại học viên thuộc cơ sở mới. | Đồng bộ chi nhánh |
| 5.7 | Xếp lịch tuần chỉ gán Trợ giảng và bỏ trống Giáo viên chính | Hệ thống bôi đỏ trường Phụ trách của ngày học đó, hiển thị thông báo lỗi "Ngày học bắt buộc phải có ít nhất Giáo viên chính" và chặn lưu Khai giảng. | Khai giảng: Chặn lưu |
| 5.8 | Trùng lặp ca học và phòng học vật lý giữa các ngày trong lịch tuần của cùng lớp đang tạo | Hệ thống phát hiện xung đột thời gian, hiển thị lỗi "Phòng học trùng lịch trong ca học" tại các ngày bị trùng và chặn lưu Khai giảng. | Chặn lưu tuyệt đối |
| 5.9 | Học viên được gán ở Bước 2 bị trùng lịch học lớp khác | Hệ thống hiển thị biểu tượng cảnh báo màu vàng cạnh tên học viên trong bảng kèm ghi chú "Trùng lịch: [Tên lớp] - Thứ X Ca Y" để giáo vụ lưu ý, nhưng không chặn gán và lưu lớp. | Cảnh báo trùng lịch |
| 5.10 | Phòng học được chọn có sức chứa tối đa nhỏ hơn Sĩ số lớp | Khi chọn phòng học cho ngày trong tuần, hệ thống kiểm tra sức chứa tối đa của phòng. Nếu nhỏ hơn sĩ số tối đa được thiết lập của lớp, hiển thị dòng cảnh báo màu vàng: "Phòng [Tên phòng] có sức chứa [X người] nhỏ hơn sĩ số lớp [Y người]" nhưng không chặn lưu. | Cảnh báo sức chứa |
| 5.11 | Ngày bắt đầu trùng ngày nghỉ lễ toàn hệ thống | Hệ thống đối chiếu ngày bắt đầu và lịch tuần với danh mục ngày nghỉ lễ đã được thiết lập. Hiển thị dòng cảnh báo: "Ngày bắt đầu trùng lịch nghỉ lễ [Tên ngày nghỉ]. Buổi học đầu tiên của lớp sẽ tự động chuyển sang buổi học tiếp theo không bị nghỉ lễ" dưới ô ngày bắt đầu, không chặn lưu. | Cảnh báo ngày nghỉ lễ |
| 5.12 | Khoảng cách Ngày bắt đầu và Ngày kết thúc không đủ số buổi học của môn học | Hệ thống tính toán số buổi học dự kiến sinh ra. Nếu ít hơn số buổi chuẩn quy định của Môn học, hệ thống hiển thị dòng cảnh báo: "Thời gian đã chọn chỉ xếp được [A buổi học], thiếu [B buổi] so với chuẩn môn học [C buổi]". Hệ thống gợi ý nút "Tự điều chỉnh ngày kết thúc" để kéo dài Ngày kết thúc đến ngày đủ số buổi học. | Cảnh báo thiếu buổi học |
| 5.13 | Gán học viên có loại đăng ký đặc biệt (Học thử, Học bù) | Hệ thống cho phép gán học viên học thử/bù bình thường, hiển thị nhãn phân loại (Học thử - X buổi / Học bù - Y buổi) bên cạnh tên học viên. Học viên này không tính vào sĩ số tối đa chính thức của lớp nhưng cộng dồn vào sĩ số thực tế để kiểm tra sức chứa phòng. | Hỗ trợ học thử/bù |
| 5.14 | Giáo viên được phân công bị trùng ca học do khoảng cách di chuyển giữa hai cơ sở quá ngắn | Hệ thống hiển thị cảnh báo màu vàng dưới tên giáo viên: "Di chuyển liên cơ sở gấp (Thời gian trống [X phút] giữa cơ sở A và cơ sở B)" nhưng không chặn lưu. | Cảnh báo di chuyển liên cơ sở |
| 5.15 | Người dùng bấm nút Hủy khi đang điền dở thông tin lớp học | Hệ thống mở cửa sổ xác nhận cảnh báo: "Các thông tin đã nhập sẽ bị mất, bạn có chắc chắn muốn thoát?". Nếu đồng ý, đóng cửa sổ biểu mẫu tạo mới và giữ nguyên màn hình danh sách lớp học. | Xác nhận thoát |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Gợi ý Khung chương trình):** Lựa chọn Khung chương trình đào tạo thành công phải điền chính xác gợi ý Môn học/Trình độ, và người dùng vẫn có thể thay đổi các ô này bình thường.
- **AC-2 (Ràng buộc phòng học):** Danh sách phòng học hiển thị cho từng ngày trong lịch tuần chỉ bao gồm các phòng thuộc cơ sở trường đã chọn của lớp học.
- **AC-3 (Tạo lớp nháp):** Bấm nút "Tạo lớp nháp" tại bất kỳ bước nào sẽ lưu lớp học ở trạng thái "Nháp" thành công chỉ cần nhập Tên lớp và chọn Trường/Cơ sở, hiển thị huy hiệu màu xám trên danh sách lớp.
- **AC-4 (Kiểm tra trùng phòng và nhân sự):** Chặn lưu và báo lỗi bôi đỏ nếu trùng phòng học vật lý. Đối với giáo viên chính và trợ giảng trùng ca, phải hiển thị cảnh báo trùng chi tiết bằng chữ màu đỏ trong danh sách chọn nhưng vẫn cho phép gán và lưu thành công (hỗ trợ cơ chế gối ca).
- **AC-5 (Khai giảng thành công):** Bấm nút "Khai giảng" khi lớp học đã điền đầy đủ các thông tin bắt buộc và gán ít nhất 1 học viên sẽ lưu lớp và chuyển sang trạng thái "Chờ khai giảng" với huy hiệu màu xanh lục nhạt.
- **AC-6 (Mã lớp tự sinh):** Khi người dùng để trống Mã lớp học và lưu, hệ thống tự động điền mã lớp theo cấu trúc `CLS-[MÃ MÔN]-[SỐ THỨ TỰ]` hoặc mã định danh kèm đuôi số ngẫu nhiên.
- **AC-7 (Trùng lịch thi đầu vào):** Trùng lịch ca kiểm tra đầu vào đối với phòng học phải xuất hiện cảnh báo bôi đỏ và chặn lưu. Trùng lịch đối với giáo viên chính hoặc trợ giảng phải hiển thị cảnh báo trùng lịch chữ màu đỏ và cho phép gán gối ca, lưu bình thường.
- **AC-8 (Điều phối giáo viên hệ thống):** Bấm vào nút hình quả địa cầu bên cạnh trường chọn giáo viên/trợ giảng phải mở ra đúng hộp thoại phụ "Điều phối giáo viên hệ thống" hiển thị danh sách dạng bảng trực quan kèm cột trạng thái Trống/Trùng lịch của từng giáo viên.
- **AC-9 (Báo lỗi điều kiện khai giảng):** Bấm nút "Khai giảng" khi thiếu thông tin bắt buộc phải hiển thị đúng các thông báo lỗi:
  - Lỗi biểu ngữ góc trên bên phải: "Không đủ điều kiện chờ khai giảng. Vui lòng bổ sung thông tin đỏ" (khi thiếu các trường bắt buộc Bước 1 hoặc lịch học).
  - Lỗi bôi đỏ dưới các trường: "Vui lòng nhập tên lớp", "Vui lòng chọn môn học", "Vui lòng chọn chi nhánh/trường", "Vui lòng chọn ngày bắt đầu", "Vui lòng chọn ngày kết thúc", "Vui lòng kích hoạt ít nhất 1 ngày học trong tuần", "Vui lòng chọn phòng học cho ngày này", "Vui lòng phân công phụ trách cho ngày này".
  - Lỗi biểu ngữ ở Bước 2: "Lớp học cần có ít nhất 1 học viên xếp lớp" (khi chưa gán học viên nào).
  - Hệ thống chặn hoàn toàn hành động lưu ở trạng thái Chờ khai giảng.
- **AC-10 (Kiểm tra logic ngày bắt đầu/kết thúc):** Chặn lưu Khai giảng và hiển thị thông báo bôi đỏ nếu Ngày kết thúc nhỏ hơn hoặc bằng Ngày bắt đầu.
- **AC-11 (Xử lý đồng bộ Chi nhánh - Học viên):** Khi thay đổi Trường/Cơ sở ở Bước 1, hệ thống tự động xóa sạch các học viên ở Bước 2 không thuộc chi nhánh mới để đảm bảo tính đồng bộ dữ liệu cơ sở.
- **AC-12 (Ràng buộc nhân sự tối thiểu buổi học):** Hệ thống chỉ cho phép Khai giảng khi từng ngày học tuần được bật có ít nhất Giáo viên chính (chỉ chọn trợ giảng hoặc bỏ trống cả hai sẽ bị chặn lưu và bôi đỏ).
- **AC-13 (Cảnh báo vượt sĩ số tối đa):** Nếu số lượng học viên được gán ở Bước 2 vượt quá Sĩ số dự kiến (định mức tối đa), hiển thị màu cảnh báo đỏ cho sĩ số nhưng vẫn cho phép Khai giảng hoặc Tạo nháp thành công để đáp ứng sự linh hoạt trong thực tế.
- **AC-14 (Cảnh báo trùng lịch học viên):** Khi gán học viên bị trùng lịch tại Bước 2, hệ thống phải hiển thị biểu tượng cảnh báo màu vàng cùng ghi chú chi tiết lịch trùng, đồng thời không chặn hành động gán và lưu Khai giảng.
- **AC-15 (Cảnh báo sức chứa phòng học):** Khi chọn phòng học có sức chứa tối đa nhỏ hơn sĩ số tối đa của lớp học, hệ thống phải hiển thị dòng cảnh báo màu vàng trực quan tại ô chọn phòng học, cho phép lưu bình thường.
- **AC-16 (Cảnh báo trùng lịch nghỉ lễ):** Khi Ngày bắt đầu rơi vào ngày nghỉ lễ đã được cấu hình trong hệ thống, hệ thống hiển thị dòng chữ cảnh báo ghi rõ tên ngày nghỉ lễ và thông tin buổi học thực tế đầu tiên lùi sang buổi học tiếp theo dưới ô Ngày bắt đầu, cho phép lưu bình thường.
- **AC-17 (Cảnh báo thiếu số buổi học):** Khi số buổi học thực tế được tính toán dự kiến nhỏ hơn số lượng buổi học tiêu chuẩn của Môn học, hệ thống phải hiển thị dòng cảnh báo thiếu số buổi kèm nút chức năng "Tự động điều chỉnh ngày kết thúc" để kéo dài ngày kết thúc phù hợp.
- **AC-18 (Xác nhận thoát an toàn):** Khi nhấp nút "Hủy" hoặc nút đóng ở góc biểu mẫu tạo mới có chứa dữ liệu đã chỉnh sửa, hệ thống phải hiển thị hộp thoại xác nhận hủy bỏ để ngăn mất dữ liệu ngoài ý muốn.
