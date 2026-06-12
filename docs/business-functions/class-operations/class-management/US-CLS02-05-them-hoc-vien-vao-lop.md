---
id: US-CLS02-05
title: "Chọn học viên xếp lớp"
bf: BF-CLS-02
domain: CAP-OPS
status: standardized
tags: [class, student, roster, form]
---

# US-CLS02-05: Chọn học viên xếp lớp

> **Tham chiếu:** BF-CLS-02 (Quản lý Lớp học) · Tiêu chuẩn Thiết kế §4.4 (Hộp thoại Biểu mẫu)
> **Đường dẫn màn hình & Trạng thái liên quan:**
> - Hộp thoại xếp lớp được kích hoạt từ hai vị trí:
>   1. Bấm nút **Chọn học viên xếp lớp** tại Bước 2 (Danh sách học viên) của biểu mẫu Tạo mới lớp học ([US-CLS02-02](file:///c:/Users/Jacky%20Tran/Documents/Rinov5/docs/business-functions/class-operations/class-management/US-CLS02-02-tao-moi-vo-lop-hoc.md)).
>   2. Bấm nút **Thêm học viên** tại phân mục **Học viên** của trang Chi tiết lớp học ([US-CLS02-03](file:///c:/Users/Jacky%20Tran/Documents/Rinov5/docs/business-functions/class-operations/class-management/US-CLS02-03-modal-chi-tiet-lop-hoc-trung-tam.md)).
> - Trạng thái áp dụng của lớp học: Nháp, Chờ khai giảng, Đang học, Tạm dừng.

---

## Lịch sử cập nhật tài liệu (Changelog)

| Ngày cập nhật | Nội dung cập nhật | Lý do cập nhật |
|:---|:---|:---|
| 12/06/2026 | - Cấu trúc lại tài liệu theo chuẩn di trú Rinov5.<br>- Bổ sung đầy đủ luồng thêm và bớt học viên.<br>- Tích hợp hộp thoại xác nhận khi xóa học viên.<br>- Cập nhật 11 Trường hợp góc cạnh (Corner Cases) nghiệp vụ.<br>- Bổ sung Tiêu chí Nghiệm thu đo lường được (SMART). | Yêu cầu nghiệp vụ làm rõ luồng quản lý học viên xếp lớp và chuẩn hóa giao diện vận hành. |

---

## 1. Yêu cầu Người dùng (User Story)

**Là một** Nhân viên Giáo vụ hoặc Quản lý chi nhánh,  
**tôi muốn** có khả năng thêm học viên mới hoặc bớt học viên cũ ra khỏi danh sách lớp học thông qua biểu mẫu tạo mới lớp học hoặc bảng phân mục Học viên tại trang chi tiết lớp học,  
**để** hoàn thành sĩ số học viên, tổ chức dạy học đúng tiến độ, và quản lý sĩ số lớp học một cách linh hoạt, chính xác.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Thiết kế độc lập với luồng gán chương trình đào tạo của lớp.
> - [x] **N**egotiable — Số lượng các tab lọc học viên và thông tin ghi chú bán hàng có thể tùy biến linh hoạt.
> - [x] **V**aluable — Là nghiệp vụ cốt lõi để đưa học sinh vào học thực tế và ghi nhận doanh thu.
> - [x] **E**stimable — Đã phân tách rõ ràng cấu trúc danh sách chọn và tiêu chí lọc.
> - [x] **S**mall — Hoàn thành trong một vòng phát triển tập trung.
> - [x] **T**estable — Có tiêu chí nghiệm thu rõ ràng tại Mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-CLS-05-01] Đa chọn học viên:** Cho phép giáo vụ tích chọn một hoặc nhiều học viên cùng lúc từ danh sách hiển thị để thêm vào lớp.

2. **[RULE-CLS-05-02] Cảnh báo sĩ số lớp học:** Khi xếp thêm học viên, hệ thống sẽ tính toán lại sĩ số. Nếu sĩ số lớp đạt từ 90% định mức tối đa của lớp trở lên, chỉ số sĩ số và thanh đo tiến độ của lớp học tại màn hình chi tiết sẽ chuyển sang màu đỏ (cảnh báo quá tải). Hệ thống không chặn lưu cứng để tạo sự linh hoạt trong vận hành đối với các trường hợp gộp lớp đặc biệt.

3. **[RULE-CLS-05-03] Lọc học viên khả dụng xếp lớp:** Hộp thoại chỉ hiển thị các học viên có trạng thái hồ sơ phù hợp để xếp lớp (như: chờ xếp lớp, bảo lưu, học thử, chờ chuyển lớp, tạm dừng học) hoặc các học viên đã có sẵn trong lớp (dù ở trạng thái đang học/active) để giáo vụ có thể xem và thực hiện bỏ chọn nếu cần thiết. Không hiển thị học viên đã có lớp chính thức khác đang học.

4. **[RULE-CLS-05-04] Lọc học viên phù hợp môn học:** Khi giáo vụ bấm chọn tab lọc phù hợp môn học, hệ thống tự động lọc danh sách học viên có trình độ hoặc môn học đăng ký trùng khớp với trình độ/môn học của lớp hiện tại.

5. **[RULE-CLS-05-05] Bảo mật thông tin liên hệ:** Số điện thoại của học viên hiển thị trong bảng danh sách phải được che bớt các ký tự số ở giữa (ví dụ: 0901***567) để bảo vệ thông tin cá nhân của học sinh và gia đình.

6. **[RULE-CLS-05-06] Xác nhận khi bớt học viên:** Mọi hành động bớt/xóa học viên khỏi danh sách roster lớp học (bằng cách nhấp vào biểu tượng xóa tại bảng danh sách hoặc bỏ chọn trực tiếp trong hộp thoại) đều yêu cầu xuất hiện bảng thông tin xác nhận nổi (Confirm Dialog) trước khi chính thức áp dụng thay đổi để tránh thao tác nhầm lẫn.

---

## 3. Cấu trúc Các trường nhập liệu

**Bố cục:** Hộp thoại nổi lớn hiển thị danh sách dạng bảng.

### 3.1. Thông tin đầu vào

| Tên trường | Loại hiển thị | Bắt buộc | Diễn giải dữ liệu | Ghi chú & Quy tắc |
|:---|:---|:---|:---|:---|
| Lọc theo nhóm trạng thái | Nhóm nút bấm | Có | Phân loại trạng thái học viên | Gồm 8 tab lọc nhanh: "Tất cả", "Phù hợp môn học", "Học viên Trial", "Chờ xếp lớp", "Bảo lưu", "Xếp lớp sau", "Chờ chuyển lớp", "Tạm dừng". |
| Ô tìm kiếm | Ô nhập chữ | Không | Tìm theo từ khóa | Tìm nhanh theo họ tên, mã số học viên, số điện thoại hoặc thư điện tử. |
| Bảng chọn học viên | Bảng chọn (Đa chọn) | Có | Danh sách học viên khả dụng | Bảng danh sách gồm ô tích chọn đầu dòng, ảnh đại diện, họ tên, mã số, số điện thoại (che số), trình độ, gói đăng ký, số buổi học còn lại, ghi chú từ bộ phận bán hàng, và trạng thái hiện tại. |

### 3.2. Ví dụ Dữ liệu mẫu

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
|:---|:---|:---|
| Chọn học viên hợp lệ | Tích chọn 2 học viên từ tab "Phù hợp môn học" -> Bấm Đồng ý | Hệ thống cập nhật số lượng chọn ở nút lưu. Lưu thành công, 2 học viên hiển thị tại tab học viên của lớp, sĩ số lớp tăng thêm 2. |
| Tìm kiếm học viên | Nhập "STU-001" vào ô tìm kiếm | Danh sách lọc tức thì chỉ hiển thị học viên có mã số STU-001. |
| Bớt học viên hiện tại | Bỏ tích chọn 1 học viên đã có sẵn trong lớp -> Bấm Đồng ý | Hệ thống cập nhật số lượng chọn mới là 0 (vì không thêm ai), nhưng thực hiện xóa học viên bị bỏ chọn khỏi danh sách lớp khi xác nhận lưu. |

### 3.3. Nút hành động

| Nút | Loại hiển thị | Logic xử lý |
|:---|:---|:---|
| Hủy | Nút viền nhạt | Đóng hộp thoại chọn học viên, giữ nguyên danh sách roster cũ của lớp học. |
| Đồng ý | Nút màu nhấn | Lưu danh sách học viên chọn -> Cập nhật danh sách lớp -> Cập nhật sĩ số lớp -> Ghi nhận nhật ký hoạt động -> Đóng hộp thoại. |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
- Biểu mẫu mở ra dưới dạng hộp thoại nổi lớn nằm giữa màn hình. Phía trên cùng hiển thị tiêu đề "Chọn học viên xếp lớp" và dòng mô tả ngắn.
- Bên dưới tiêu đề là ô nhập tìm kiếm có biểu tượng kính lúp và dãy 8 nút tab lọc nhanh trạng thái. Mỗi tab hiển thị tên và số lượng học viên tương ứng trong ngoặc tròn.
- Khu vực chính hiển thị danh sách dạng bảng gồm các cột: Học viên (ảnh đại diện, họ tên, mã số, số điện thoại đã che), Trình độ, Gói đăng ký, Số buổi còn lại, Ghi chú từ Sale (dạng biểu tượng ghi chú nhỏ, rê chuột vào hiển thị nội dung), và Trạng thái.
- Dưới cùng là chân hộp thoại chứa nút **Hủy** và nút **Đồng ý** (nút đồng ý có kèm số lượng học viên mới được tích chọn bổ sung).

### 4.2. Luồng Hoạt động (Workflow)

#### Nhánh A: Gọi từ biểu mẫu Tạo mới lớp học (Step 2)
1. Tại Bước 2 của biểu mẫu Tạo mới lớp học, giáo vụ bấm nút **Chọn học viên xếp lớp**.
2. Hộp thoại mở ra, mặc định hiển thị tab **Tất cả** nạp toàn bộ học viên có trạng thái khả dụng để xếp lớp của cơ sở, cùng với các học viên đã tích chọn từ trước (được tích sẵn đầu dòng).
3. Giáo vụ thực hiện chọn thêm học viên mới bằng cách tích chọn, hoặc bỏ tích chọn học viên đã chọn từ trước để bớt đi. Số lượng chọn mới (học viên mới được thêm) được cập nhật thời gian thực vào nút **Đồng ý** (Ví dụ: "Đồng ý (2)").
4. Giáo vụ bấm **Đồng ý**. Hệ thống chuyển danh sách học viên đã chọn về bảng danh sách Bước 2 của biểu mẫu Tạo mới lớp học và đóng hộp thoại. Sĩ số lớp được cập nhật tương ứng trên biểu mẫu.
5. Nếu giáo vụ bấm nút xóa trực tiếp (biểu tượng Thùng rác) bên cạnh học viên trên danh sách bảng Bước 2, một hộp thoại xác nhận nhỏ xuất hiện. Giáo vụ bấm "Xóa" để xác nhận bỏ học viên khỏi lớp.

#### Nhánh B: Gọi từ phân mục Học viên tại trang Chi tiết lớp học
1. Giáo vụ mở phân mục **Học viên** tại chi tiết lớp học và bấm nút **Thêm học viên** (hoặc nhấp trực tiếp vào biểu tượng xóa trên thẻ học viên để bớt học viên).
2. Khi bấm nút **Thêm học viên**, hộp thoại mở ra tương tự Nhánh A, hiển thị các học viên hiện tại của lớp ở đầu danh sách (được tích chọn sẵn) và danh sách học viên chờ xếp lớp bên dưới.
3. Giáo vụ thực hiện tích thêm học viên hoặc bỏ tích học viên hiện tại, sau đó bấm **Đồng ý**.
4. Hệ thống ghi nhận các thay đổi học viên mới vào lớp học, đóng hộp thoại, tự động cập nhật lại sĩ số lớp và hiển thị danh sách học sinh mới tức thì trong bảng phân mục Học viên. Đồng thời, hệ thống tự động chèn một bản ghi nhật ký vận hành ghi nhận hành động thêm/bớt xếp lớp này vào phân mục Nhật ký hoạt động của lớp.
5. Nếu giáo vụ bấm xóa trực tiếp trên thẻ học viên tại tab Học viên của trang chi tiết lớp học, hộp thoại xác nhận nổi lớn xuất hiện: *"Bạn có chắc chắn muốn xóa học viên khỏi lớp học này?"*. Sau khi giáo vụ xác nhận, học viên được xóa khỏi danh sách, hệ thống cập nhật lại sĩ số và ghi nhận nhật ký vận hành.

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|:---|:---|:---|:---|
| 5.1 | Không tìm thấy học sinh phù hợp | Hiển thị hình ảnh trống kèm thông báo "Không tìm thấy học viên khả dụng. Thử tìm kiếm với từ khóa khác hoặc chuyển bộ lọc tab." | Trạng thái danh sách trống |
| 5.2 | Hủy bỏ hành động xếp lớp giữa chừng | Người dùng tắt hộp thoại nổi bằng nút Hủy hoặc dấu X, hệ thống không lưu bất kỳ thay đổi nào về danh sách chọn và giữ nguyên dữ liệu roster cũ. | Hủy thao tác |
| 5.3 | Lỗi hệ thống hoặc kết nối chậm | Vô hiệu hóa nút nhấn Đồng ý khi đang gửi yêu cầu lưu dữ liệu để tránh gửi trùng lặp, đồng thời hiển thị hiệu ứng chờ dữ liệu. | Kiểm soát tải dữ liệu |
| 5.4 | Xếp lớp học viên có trình độ lệch so với lớp | Hệ thống vẫn cho phép chọn và xếp lớp. Cảnh báo lệch trình độ được quản lý bằng mắt thông qua cột Trình độ hiển thị trực quan trong danh sách. | Chấp nhận ngoại lệ |
| 5.5 | Trạng thái bảo lưu được gán vào lớp | Khi giáo vụ tích chọn học viên đang bảo lưu để xếp lớp, sau khi bấm lưu thành công, trạng thái học viên tự động cập nhật hoạt động trở lại. | Tự động mở trạng thái |
| 5.6 | Sĩ số lớp đạt định mức tối đa | Khi số lượng học viên vượt quá 90% sĩ số lớp, hệ thống hiển thị cảnh báo quá tải màu đỏ trên thanh đo tiến độ nhưng không chặn lưu cứng để tạo sự linh hoạt. | Cảnh báo sĩ số |
| 5.7 | Xóa học viên cuối cùng khỏi lớp đang hoạt động | Nếu lớp học đang ở trạng thái "Đang học" và giáo vụ thực hiện xóa học viên cuối cùng khỏi lớp, hệ thống tự động chuyển trạng thái lớp sang "Đã kết thúc" (Hủy lớp) và giải phóng roster. | Tự động cập nhật trạng thái lớp |
| 5.8 | Tìm kiếm học viên với ký tự đặc biệt hoặc khoảng trắng | Hệ thống tự động làm sạch ký tự lạ và khoảng trắng thừa trước khi thực hiện tìm kiếm lọc để đảm bảo tìm đúng kết quả. | Làm sạch đầu vào |
| 5.9 | Tránh trùng lặp học viên khi mở lại hộp thoại xếp lớp | Học viên đã có sẵn trong roster sẽ hiển thị ở trạng thái đã tích chọn sẵn và không xuất hiện như một bản ghi mới để tránh thêm trùng lặp. | Tránh trùng dữ liệu |
| 5.10 | Che giấu thông tin liên hệ của phụ huynh | Số điện thoại của phụ huynh và học viên hiển thị trong bảng danh sách phải được che bớt các số ở giữa (ví dụ: 0901***567) để bảo mật thông tin. | Bảo mật thông tin |
| 5.11 | Học viên chuyển phí hoặc đang chờ xử lý | Cho phép gán học viên thuộc trạng thái này vào lớp học; sau khi gán thành công, hệ thống tự động chuyển trạng thái học viên tương ứng sang trạng thái học tập của lớp. | Cập nhật luồng tài chính |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Bố cục chuẩn):** Giao diện hiển thị đúng hộp thoại nổi lớn, co giãn tốt, có đầy đủ ô tìm kiếm, 8 tab lọc nhanh trạng thái và bảng danh sách học viên đa chọn.
- **AC-2 (Che giấu thông tin SĐT):** Số điện thoại học viên hiển thị trong danh sách phải được che bớt 3 chữ số ở giữa (ví dụ: 0901***567) để bảo mật thông tin.
- **AC-3 (Số lượng chọn chính xác):** Nút Đồng ý ở chân trang hiển thị chính xác số lượng học viên được chọn mới (không tính số học viên đã có sẵn trong roster từ trước).
- **AC-4 (Xác nhận khi xóa học viên):** Bất kể tại màn hình tạo mới hay chi tiết lớp học, việc bấm nút xóa/bớt học viên bắt buộc phải kích hoạt một hộp thoại xác nhận nổi với tiêu đề "Xóa học viên khỏi lớp" và chỉ thực hiện xóa sau khi người dùng đồng ý.
- **AC-5 (Cập nhật và ghi nhật ký):** Sau khi lưu thành công, danh sách học viên của lớp tải lại tức thì, sĩ số lớp cập nhật chính xác và có một dòng log ghi nhận hành động thêm/bớt xếp lớp xuất hiện tại tab Nhật ký hoạt động.
- **AC-6 (Lọc phù hợp môn học):** Tab Phù hợp môn học hoạt động chính xác, chỉ lọc các học viên có trình độ hoặc môn đăng ký tương thích với lớp hiện tại.
- **AC-7 (Chuyển trạng thái lớp tự động):** Khi xóa học viên cuối cùng khỏi lớp đang hoạt động ("Đang học"), trạng thái lớp tự động chuyển sang "Đã kết thúc" và ghi nhận log tương ứng.
