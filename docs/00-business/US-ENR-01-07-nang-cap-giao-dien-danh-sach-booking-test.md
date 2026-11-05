---
id: US-ENR-01-07
title: "Nâng cấp Giao diện Danh sách Booking Test - Tinh gọn 8 cột chuẩn hóa, Tách Thẻ trạng thái & Điều kiện, Tích hợp Check-in nhanh và Kiểm tra trùng lịch"
bf: BF-ENR-01
domain: CAP-ADM
persona: "PERSONA-BRANCH-MANAGER, PERSONA-CSM, PERSONA-TEACHER"
sr: "SR-PERSONA-STAFF"
status: draft
tags: [admissions, booking-test, list, table-redesign, upgrade, assessment]
---

# US-ENR-01-07: Nâng cấp Giao diện Danh sách Booking Test - Tinh gọn 8 cột chuẩn hóa, Tách Thẻ trạng thái & Điều kiện, Tích hợp Check-in nhanh và Kiểm tra trùng lịch (Booking Test List Interface Upgrade)

> **Tham chiếu:** `BF-ENR-01` · `SR-PERSONA-STAFF` · Giao diện Mẫu §4.2 (Màn hình Danh sách & Thanh công cụ chuẩn)  
> **Đường dẫn màn hình & Trạng thái liên quan:**  
> - `Quản lý Đặt lịch (/app/booking_test)` -> Trạng thái chính: `Tất cả`, `Đã đặt lịch test`, `Đang đánh giá`, `Hoàn tất` | Điều kiện lọc phụ (Trạng thái ảo): `Chưa gán GV`, `Đã check-in`, `Đã phỏng vấn`, `Đã làm bài`, `Không đạt`

---

## 1. NHẬT KÝ THAY ĐỔI & BỐI CẢNH (CHANGELOG & CONTEXT)

### Lịch sử cập nhật tài liệu (Changelog)

| Ngày cập nhật | Nội dung cập nhật | Lý do cập nhật |
|---|---|---|
| 05/11/2026 | Biên tập tài liệu đặc tả nâng cấp màn hình Danh sách Booking Test (/app/booking_test): Đối chiếu toàn diện giữa hệ thống đang vận hành (Staging sta.rinoedu.ai) và phiên bản nâng cấp Rinov5. Tái cấu trúc thanh công cụ 2 tầng (bộ chọn cơ sở, mở khóa môn Toán, nút Tạo lịch test trực tiếp, phím tắt Lịch của tôi); tinh giản bảng dữ liệu từ 13 cột xuống 8 cột tích hợp; che số điện thoại bảo mật; tích hợp thao tác 1 chạm Check-in và Hủy ca; hỗ trợ kiểm tra trùng lịch giáo viên tức thì | Khắc phục tình trạng dàn trải thông tin, gom lẫn trạng thái tiến trình và điều kiện lọc, thiếu tính năng tạo lịch trên hệ thống trung tâm, lộ số điện thoại khách hàng và thiếu kiểm soát trùng lịch giáo viên |

### Bối cảnh & Vấn đề nghiệp vụ (Context & Problem)

* **Bối cảnh vận hành:** Màn hình Danh sách Đặt lịch Đánh giá Năng lực (Booking Test) tại đường dẫn `/app/booking_test` là đầu mối vận hành quan trọng bậc nhất của bộ phận Tuyển sinh, Quản lý học vụ (CS/CSM), Quản lý giáo viên và Giáo viên khảo thí tại các trung tâm. Đây là nơi tiếp nhận thông tin học sinh đăng ký trải nghiệm/khảo thí từ hệ thống quản lý khách hàng (CRM), phân bổ giáo viên phỏng vấn, thực hiện check-in khi học sinh đến trung tâm, ghi nhận kết quả bài thi trên máy tính bảng (iPad) cùng điểm số phỏng vấn để xếp cấp độ học tập phù hợp.
* **Tồn tại trên giao diện hệ thống hiện tại (sta.rinoedu.ai):**
  1. *Thanh trạng thái dồn ứ và nhầm lẫn khái niệm:* Hệ thống cũ bố trí 10 thẻ trạng thái nằm phẳng trên cùng một hàng ngang, gom lẫn giữa **Trạng thái tiến trình vòng đời** (`Đã đặt lịch test`, `Đang đánh giá`, `Hoàn tất`) và **Điều kiện nghiệp vụ / Trạng thái ảo** (`Chưa gán GV`, `Đã check-in`, `Đã phỏng vấn`, `Đã làm bài`, `Không đạt`). Điều này gây nhầm lẫn nghiêm trọng cho nhân viên khi theo dõi luồng xử lý của ca khảo thí.
  2. *Bảng dữ liệu dàn trải 13 cột gây quá tải thị giác:* Bảng cũ tách rời quá nhiều cột dữ liệu: `Booking Trải nghiệm`, `Học viên`, `Liên hệ`, `Cơ sở`, `Giờ test`, `Trình độ`, `Nhánh TĐ`, `Speaking`, `LWR`, `Kết quả`, `Nhân sự`, `Ghi chú`, `Trạng thái`. Người dùng trên màn hình tiêu chuẩn liên tục phải cuộn ngang để xem hết thông tin.
  3. *Lỗ hổng bảo mật thông tin liên hệ:* Số điện thoại phụ huynh hiển thị công khai hoặc che sơ sài kèm nút gọi trần trụi, tiềm ẩn nguy cơ sao chép hàng loạt dữ liệu khách hàng ra bên ngoài.
  4. *Khóa cứng môn Toán học:* Nút chọn môn Toán trên hệ thống cũ bị vô hiệu hóa hoàn toàn, chưa hỗ trợ quy trình khảo thí môn Toán (chỉ làm bài trên máy tính bảng, không có phỏng vấn).
  5. *Thiếu công cụ tạo mới và lọc ca cá nhân:* Nhân viên vận hành tại trung tâm không thể bấm tạo nhanh lịch khảo thí trực tiếp trên giao diện mà phải chuyển sang hệ thống quản lý khách hàng; giáo viên cũng không có nút lọc nhanh "Lịch của tôi" để xem danh sách ca mình được phân công phụ trách.
  6. *Thiếu kiểm soát trùng lịch giáo viên tại dòng danh sách:* Khi chọn gán nhanh giáo viên trên bảng, hệ thống cũ không hiển thị cảnh báo giáo viên bị trùng ca dạy hoặc ca khảo thí khác, dẫn đến tình trạng xếp trùng giờ.

* **Mục tiêu điều chỉnh & Giá trị mang lại:**
  1. **Quy hoạch thanh công cụ 2 tầng thông minh:**
     - Tầng 1: Đưa Bộ chọn cơ sở và Bộ chọn môn học lên đầu (mở khóa đầy đủ cho cả Tiếng Anh và Toán học); ô tìm kiếm mở rộng đa năng (tìm theo 6 trường: tên con, tên phụ huynh, số điện thoại, mã ca test, trường, phòng); nút mở Bảng điều khiển lọc nâng cao có số đếm; nút "Tạo lịch test" trực tiếp.
     - Tầng 2: Tách biệt rõ ràng thành 2 cụm: Cụm bên trái gồm Phím tắt "Lịch của tôi" (kèm số đếm động) và Dải thẻ trạng thái chính (`Tất cả`, `Đã đặt lịch test`, `Đang đánh giá`, `Hoàn tất`). Cụm bên phải là Dải điều kiện lọc phụ / trạng thái ảo (`Chưa gán GV`, `Đã check-in`, `Đã phỏng vấn`, `Đã làm bài`, `Không đạt`).
  2. **Tối ưu bảng dữ liệu còn 8 cột chuẩn hóa:**
     - Cột 1: Hộp kiểm chọn dòng (cố định bên trái).
     - Cột 2: Cột Học viên (cố định bên trái): Avatar nhận diện màu sắc + Tên in đậm + Biểu tượng trạng thái check-in (tích xanh) / vắng mặt (icon đỏ) + Dòng phụ (Giới tính, tuổi, năm sinh) + Nút Check-in nhanh 1 chạm (màu ngọc lục bảo) và Nút Hủy ca test (khi rê chuột).
     - Cột 3: Cột Liên hệ: Tên phụ huynh kèm quan hệ + Số điện thoại bắt buộc che 4 chữ số ở giữa (`xxxxxxx555`).
     - Cột 4: Lịch test: Ngày giờ thi có Thứ kèm liên kết mở Lịch sự kiện cơ sở + Thẻ nổi xem trước chi tiết buổi test khi rê chuột + Tên chương trình & Cấp độ dự kiến.
     - Cột 5: Điểm số Speaking & LWR: Tích hợp điểm phỏng vấn (Giáo viên / Trí tuệ nhân tạo), nút mở chấm Speaking và điểm Nghe-Đọc-Viết máy tính bảng. Đối với môn Toán: tự động ẩn Speaking, chỉ hiển thị điểm máy tính bảng.
     - Cột 6: Kết quả: Hộp nổi xem & thiết lập cấp độ đề xuất kèm ghi nhận nhận xét.
     - Cột 7: Trạng thái: Huy hiệu trạng thái đơn lẻ đồng bộ màu sắc.
     - Cột 8: Phụ trách: Người phụ trách phỏng vấn (kèm nhãn `(bạn)` nếu trùng tài khoản đăng nhập), thẻ nổi thông tin nhân sự; bấm để mở hộp thoại gán nhân sự có cảnh báo trùng lịch + Cơ sở khảo thí có icon định vị.
  3. **Bảng điều khiển Lọc nâng cao (Aside Panel):** Trượt từ cạnh phải với 8 nhóm tiêu chí lọc chuyên sâu, hỗ trợ chế độ lọc nháp và nút áp dụng đồng bộ.

### Bảng đối chiếu tổng quan Thay đổi (So sánh Hệ thống Hiện tại vs. Giao diện Mới)

| Hạng mục đối chiếu | Hệ thống Hiện tại (sta.rinoedu.ai) | Giao diện Mới (Rinov5) | Giá trị mang lại cho người dùng |
|---|---|---|---|
| **Cấu trúc Thẻ trạng thái & Điều kiện** | Dàn trải 10 thẻ phẳng trên 1 hàng, lẫn lộn giữa trạng thái vòng đời và điều kiện lọc. | Tách rõ 2 cụm: Thẻ trạng thái chính (4 thẻ tiến trình cốt lõi) và Dải điều kiện lọc phụ (5 trạng thái ảo). Tự động ẩn "Đã phỏng vấn" khi chọn môn Toán. | Giúp người dùng phân định rõ tiến trình xử lý hồ sơ và các điều kiện cần can thiệp gấp, không bị rối mắt. |
| **Phím tắt Lịch của tôi** | Không có phím tắt; giáo viên phải tự tìm kiếm tên mình trong ô tìm kiếm. | Phím tắt "Lịch của tôi" độc lập có số đếm động ca phụ trách, nhấp 1 chạm để lọc nhanh. | Giáo viên và chuyên viên khảo thí lọc ngay các ca thuộc trách nhiệm cá nhân chỉ trong 1 giây. |
| **Tạo lịch khảo thí trực tiếp** | Không có nút tạo lịch trên ERP; phải chuyển sang hệ thống quản lý khách hàng CRM. | Bổ sung nút "+ Tạo lịch test" màu xanh nổi bật ngay góc phải thanh công cụ. | Cho phép nhân sự tại cơ sở chủ động tạo nhanh ca khảo thí khi có khách vãng lai hoặc phụ huynh đăng ký trực tiếp. |
| **Số lượng cột bảng dữ liệu** | 13 cột dàn trải rời rạc, chữ nhỏ, phải cuộn ngang liên tục trên màn hình máy tính. | Tinh gọn còn 8 cột chuẩn hóa, nhóm thông tin logic, cố định cột Học viên và Hộp kiểm bên trái. | Tối ưu tầm nhìn, không cần cuộn ngang trên màn hình tiêu chuẩn, dễ theo dõi thông tin từ trái sang phải. |
| **Bảo mật số điện thoại** | Hiển thị số điện thoại đầy đủ hoặc che sơ sài kèm nút gọi trần ra bảng chính. | Bắt buộc che 4 chữ số ở giữa dạng `xxxxxxx555`. Ẩn nút gọi trần, chỉ xem số đầy đủ trong hộp thoại chi tiết. | Chống rò rỉ thông tin khách hàng và ngăn chặn hành vi sao chép dữ liệu liên hệ hàng loạt. |
| **Thao tác Check-in & Hủy ca** | Nằm sâu trong hộp thoại chi tiết hoặc menu ngữ cảnh nhiều bước. | Nút Check-in nhanh 1 chạm (màu ngọc lục bảo) hiển thị trực tiếp ngay cột Học viên; nút Hủy ca hiển thị khi rê chuột. | Rút ngắn thời gian tiếp đón và check-in học sinh tại quầy lễ tân từ 30 giây xuống còn 2 giây. |
| **Gán giáo viên & Kiểm tra trùng lịch** | Hộp thoại gán giáo viên đơn giản, không hiển thị trực quan ca trùng lịch trên dòng danh sách. | Tích hợp hộp thoại chọn nhân viên có cơ chế lọc bỏ giáo viên trùng lịch, hiển thị mờ kèm nhãn ca trùng khi tìm kiếm. | Triệt tiêu 100% rủi ro phân công giáo viên bị trùng ca dạy lớp chính khóa hoặc trùng ca khảo thí khác. |
| **Hỗ trợ môn Toán học** | Nút môn Toán bị khóa cứng (`disabled`), không thể xem hoặc xử lý ca test môn Toán. | Mở khóa toàn diện môn Toán; tự động ẩn các trường phỏng vấn Speaking, hiển thị điểm máy tính bảng và nút hoàn thành thủ công. | Đồng bộ hóa quy trình tuyển sinh cho cả 2 môn học mũi nhọn Tiếng Anh và Toán học trên cùng một giao diện. |

### Ràng buộc nghiệp vụ toàn cục (Global Rules):

* **[RULE-BT-01] Bảo toàn dữ liệu & Đồng nhất thực thể:** Ca đặt lịch khảo thí được liên kết chặt chẽ với hồ sơ học sinh từ hệ thống quản lý khách hàng. Hệ thống sử dụng chung một mã định danh học sinh duy nhất, không tạo bản ghi học sinh trùng lặp.
* **[RULE-BT-02] Che số điện thoại chống sao chép hàng loạt:** Trong mọi bảng danh sách, thẻ xem nhanh và bảng nổi, số điện thoại phụ huynh bắt buộc phải che 4 chữ số ở giữa theo định dạng `xxxxxxx555` hoặc `091****111`. Chỉ người dùng có thẩm quyền khi mở Hộp thoại chi tiết ca test mới được xem số điện thoại đầy đủ.
* **[RULE-BT-03] Thẻ trạng thái và số đếm đi theo toàn bộ bộ lọc:** Số lượng đếm trên thẻ trạng thái chính, dải điều kiện lọc phụ và phím tắt "Lịch của tôi" phải tự động tính toán lại đồng bộ theo tổ hợp bộ lọc đang áp dụng (Cơ sở, Môn học, Từ khóa tìm kiếm và Bảng lọc nâng cao).
* **[RULE-BT-04] Cơ chế Lọc Nháp trên Bảng điều khiển nâng cao:** Các thao tác chọn tiêu chí lọc trong bảng điều khiển trượt cạnh phải được lưu ở trạng thái nháp; chỉ khi người dùng bấm "Áp dụng", hệ thống mới thực hiện lọc lại danh sách.
* **[RULE-BT-05] Quy tắc đặc thù theo môn học:**
  - Ca khảo thí môn Tiếng Anh: Bắt buộc có điểm phỏng vấn (Speaking) từ giáo viên hoặc hệ thống trí tuệ nhân tạo kết hợp điểm Nghe-Đọc-Viết (LWR) trên máy tính bảng để đề xuất cấp độ.
  - Ca khảo thí môn Toán học: Không có phần phỏng vấn Speaking; ẩn toàn bộ các trường liên quan đến Speaking; kết quả dựa trên bài làm máy tính bảng và người phụ trách bấm xác nhận hoàn thành thủ công.
* **[RULE-BT-06] Kiểm tra trùng lịch giáo viên tuyệt đối:** Khi chọn gán hoặc thay đổi người phụ trách, hệ thống tự động kiểm tra chéo lịch dạy lớp và lịch khảo thí khác của nhân sự trong cùng khung giờ. Nhân sự bị trùng lịch sẽ bị ẩn khỏi danh sách đề xuất mặc định và hiển thị mờ kèm cảnh báo khi tìm kiếm đích danh.

---

## 2. MÔ TẢ GIAO DIỆN (UI DESCRIPTION & ADJUSTMENT MATRIX)

### Giao diện tham chiếu: [http://localhost:3001/app/booking_test](http://localhost:3001/app/booking_test)

### 2.1 Thanh công cụ & Bộ lọc (Toolbar & Filter Controls) - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Bộ chọn Cơ sở (Hàng 1 bên trái)** | Hộp chọn thả xuống chuẩn hóa | Danh sách các cơ sở được phân quyền | Cho phép chọn 1 cơ sở hoặc `Tất cả cơ sở`. Mặc định hiển thị cơ sở của người dùng hoặc tất cả. | **Điều chỉnh:** Đồng bộ hóa thành phần chọn cơ sở theo chuẩn giao diện mới, đặt ở vị trí đầu tiên của thanh công cụ. |
| **Bộ chọn Môn học (Hàng 1)** | Hộp chọn thả xuống | `Tất cả các môn`, `Tiếng Anh`, `Toán học` | Cho phép chuyển đổi môn học khảo thí. Mặc định là `Tiếng Anh`. Khi chọn `Toán học`, bảng tự động chuyển sang chế độ hiển thị đặc thù cho môn Toán. | **Bổ sung:** Mở khóa hoàn toàn môn Toán học (hệ thống cũ bị khóa cứng), cho phép lọc và xử lý ca test môn Toán. |
| **Ô tìm kiếm mở rộng (Hàng 1 bên phải)** | Ô nhập văn bản có nút co giãn | Từ khóa tìm kiếm tự do | Tìm kiếm tức thời khi nhập theo 6 trường: Tên học sinh, Tên phụ huynh, Số điện thoại, Mã ca test, Trường, Phòng học. | **Điều chỉnh:** Tích hợp ô tìm kiếm mở rộng có nút xóa nhanh, mở rộng kích thước mượt mà khi nhấp chuột. |
| **Nút Mở bộ lọc nâng cao (Hàng 1)** | Nút biểu tượng kèm huy hiệu số đếm | Số lượng tiêu chí lọc đang chọn | Nhấp để mở Bảng điều khiển lọc nâng cao trượt từ cạnh phải. Huy hiệu hiển thị tổng số tiêu chí đang kích hoạt. | **Điều chỉnh:** Hiển thị rõ số lượng điều kiện đang lọc giúp người dùng kiểm soát trạng thái dữ liệu. |
| **Nút "Tạo lịch test" (Hàng 1 ngoài cùng)** | Nút hành động chính màu xanh nổi bật | Nút bấm mở điều hướng hoặc hộp thoại | Đặt ở góc phải thanh công cụ. Nhấp để mở biểu mẫu tạo mới ca đặt lịch khảo thí. Ẩn đối với vai trò chỉ giảng dạy. | **Bổ sung:** Đưa nút tạo mới ca test trực tiếp lên giao diện trung tâm thay vì bắt buộc phải thao tác từ hệ thống CRM. |
| **Phím tắt "Lịch của tôi" (Hàng 2 bên trái)** | Nút bấm dạng viên thuốc bo tròn | Số lượng ca test cá nhân phụ trách | Nhấp để bật/tắt lọc nhanh các ca do người dùng hiện tại làm giáo viên, người chấm hoặc người tạo. Kèm số đếm động. | **Bổ sung:** Phím tắt 1 chạm giúp giáo viên và nhân viên khảo thí lọc việc cá nhân ngay lập tức. |
| **Dải thẻ trạng thái chính (Hàng 2)** | Khối thẻ tương tác hình chữ nhật bo góc | 4 trạng thái tiến trình cốt lõi | Gồm: `Tất cả`, `Đã đặt lịch test`, `Đang đánh giá`, `Hoàn tất`. Bấm vào thẻ để lọc danh sách; bấm lại để về `Tất cả`. Số đếm tự động cập nhật. | **Điều chỉnh:** Tách riêng 4 trạng thái vòng đời chính ra khỏi các điều kiện lọc phụ, chuẩn hóa màu sắc và số lượng đếm động. |
| **Dải điều kiện lọc phụ (Hàng 2 bên phải)** | Dãy nhãn văn bản có thể nhấp chọn | 5 trạng thái ảo / điều kiện can thiệp | Gồm: `Chưa gán GV`, `Đã check-in`, `Đã phỏng vấn` (ẩn với môn Toán), `Đã làm bài`, `Không đạt`. Nhấp để lọc nhanh các ca cần can thiệp. | **Điều chỉnh:** Tách biệt thành cụm điều kiện lọc phụ bên phải, tự động ẩn điều kiện "Đã phỏng vấn" đối với môn Toán. |

### 2.2 Bảng dữ liệu danh sách (Data Table) - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Cột 1: Hộp kiểm (Sticky Left)** | Ô kiểm chọn dòng cố định | Trạng thái chọn từng dòng hoặc chọn tất cả | Cố định ở mép trái ngoài cùng khi cuộn ngang. Cho phép chọn nhiều dòng để thao tác theo lô. | **Điều chỉnh:** Chuẩn hóa độ rộng 32 điểm ảnh, nền giữ nguyên màu hàng khi rê chuột hoặc chọn. |
| **Cột 2: Học viên & Thao tác nhanh (Sticky Left)** | Cột thông tin cố định bên trái | Avatar + Tên + Năm sinh + Check-in + Hủy ca | Cố định ở vị trí 32 điểm ảnh từ lề trái. Hiển thị avatar đa sắc, tên học sinh, icon tích xanh check-in/icon đỏ từ chối, dòng năm sinh/tuổi/giới tính. Tích hợp nút "Check-in" màu ngọc lục bảo và nút "Hủy ca" đỏ khi rê chuột. | **Điều chỉnh:** Gom thông tin định danh và thao tác tiếp đón 1 chạm vào cùng một cột cố định, giúp thao tác check-in tức thì tại quầy. |
| **Cột 3: Liên hệ phụ huynh** | Khối thông tin 2 dòng | Tên phụ huynh, quan hệ và số điện thoại | Dòng 1: Tên phụ huynh kèm quan hệ trong ngoặc (Bố/Mẹ). Dòng 2: Số điện thoại bị che ẩn ở giữa dạng `xxxxxxx555`. | **Điều chỉnh:** Che số điện thoại bảo mật tuyệt đối, bỏ nút gọi lộ liễu trên bảng, chống sao chép dữ liệu hàng loạt. |
| **Cột 4: Lịch test & Chương trình** | Khối thông tin tương tác kèm thẻ nổi | Thời gian thi, môn học, cấp độ dự kiến | Dòng 1: Thứ, ngày tháng, giờ thi hiển thị màu xanh liên kết (bấm mở sang Lịch sự kiện cơ sở) kèm thẻ nổi xem trước khi rê chuột. Dòng 2: Khung chương trình và cấp độ dự kiến. | **Điều chỉnh:** Tích hợp thẻ nổi xem nhanh chi tiết buổi test khi rê chuột và liên kết trực tiếp sang lịch biểu sự kiện. |
| **Cột 5: Điểm số Speaking & LWR** | Khối hiển thị điểm số tích hợp | Điểm phỏng vấn GV/AI và điểm máy tính bảng | Tiếng Anh: Hiển thị điểm Speaking của giáo viên và trí tuệ nhân tạo, nút mở chấm điểm Speaking, điểm bài thi trên máy tính bảng LWR. Toán học: Hiển thị dấu `-` tối giản cho Speaking, chỉ hiển thị điểm máy tính bảng. | **Điều chỉnh:** Gom 2 cột Speaking và LWR riêng lẻ ở bản cũ thành 1 cột điểm số trực quan, tự động điều chỉnh hiển thị theo môn học. |
| **Cột 6: Kết quả & Cấp độ** | Hộp nổi lựa chọn cấp độ và nhận xét | Cấp độ đề xuất, nhánh cấp độ và ghi chú | Hiển thị cấp độ học sinh đạt được kèm nút mở hộp thoại chọn cấp độ/nhánh cấp độ và nút xem/nhập nhận xét nhanh. | **Điều chỉnh:** Gom cột Trình độ và Nhánh trình độ của hệ thống cũ vào một thành phần tương tác gọn gàng. |
| **Cột 7: Trạng thái ca test** | Huy hiệu trạng thái chuẩn hóa | Trạng thái vòng đời của ca khảo thí | Hiển thị 1 huy hiệu duy nhất với màu sắc tương ứng: Đã đặt lịch (xanh dương), Đang đánh giá (cam), Hoàn tất (xanh lá), Đã hủy (xám/đỏ). | **Điều chỉnh:** Loại bỏ các nhãn văn bản thô sơ, chuẩn hóa thành huy hiệu trạng thái đơn lẻ theo bảng màu trung tâm. |
| **Cột 8: Phụ trách & Cơ sở** | Khối thông tin 2 dòng có liên kết | Tên nhân sự khảo thí và tên cơ sở | Dòng 1: Tên giáo viên phụ trách (kèm nhãn `(bạn)` nếu là tài khoản đang đăng nhập), có thẻ nổi thông tin nhân sự khi rê chuột; bấm vào để mở hộp thoại gán/đổi giáo viên. Dòng 2: Tên cơ sở kèm icon bản đồ. | **Điều chỉnh:** Tích hợp thẻ nổi tra cứu nhân sự và hỗ trợ nhấp để đổi giáo viên nhanh với cơ chế cảnh báo trùng lịch. |

### 2.3 Bảng điều khiển Lọc nâng cao (Filter Drawer Panel) - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Bảng điều khiển lọc trượt cạnh phải** | Bảng điều khiển trượt (Aside Panel) | Toàn bộ 8 nhóm tiêu chí lọc chuyên sâu | Trượt mượt mà từ mép phải màn hình, có nút đóng và tiêu đề kèm tổng số tiêu chí đang chọn. | **Điều chỉnh:** Chuyển đổi từ dạng hộp thả xuống rời rạc sang bảng điều khiển trượt chuyên nghiệp, tối ưu diện tích. |
| **Nhóm lọc Cơ sở & Trạng thái** | Danh sách hộp kiểm đa lựa chọn | Danh mục cơ sở và danh mục trạng thái | Cho phép chọn đồng thời nhiều cơ sở và nhiều trạng thái chính để lọc kết hợp. | **Điều chỉnh:** Hỗ trợ lọc đa lựa chọn linh hoạt thay vì chỉ chọn đơn lẻ từng mục. |
| **Nhóm lọc Giáo viên phụ trách** | Ô tìm kiếm kèm danh sách hộp kiểm | Danh sách giáo viên thuộc các cơ sở | Có ô nhập từ khóa tìm nhanh tên giáo viên; danh sách hiển thị tên kèm số ca đang phụ trách. | **Bổ sung:** Tích hợp ô tìm kiếm nội bộ trong nhóm lọc giáo viên giúp tìm nhanh nhân sự giữa danh sách dài. |
| **Nhóm lọc Ngày trong tuần & Chương trình** | Danh sách hộp kiểm phân loại | Các thứ trong tuần (T2 - CN) và chương trình | Lọc ca test theo các ngày diễn ra trong tuần hoặc theo chương trình học đăng ký. | **Bổ sung:** Bổ sung tiêu chí lọc theo thứ trong tuần phục vụ công tác xếp lịch trực khảo thí định kỳ. |
| **Chân bảng điều khiển: Xóa tất cả & Áp dụng** | Thanh nút hành động cố định chân bảng | Nút Xóa bộ lọc và Nút Áp dụng | Chế độ lọc nháp: người dùng có thể tích chọn nhiều mục, bấm "Áp dụng" để thực thi lọc hoặc bấm "Xóa tất cả" để khôi phục. | **Bổ sung:** Cơ chế lọc nháp giúp hệ thống không phải tải lại dữ liệu liên tục sau mỗi lần tích chọn. |

### 2.4 Hộp thoại & Thao tác nhanh (Dialogs & Quick Actions) - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Hộp thoại Gán / Đổi Giáo viên** | Hộp thoại chọn nhân sự chuyên dụng | Danh sách nhân viên khả dụng tại cơ sở | Hiển thị nhân sự theo ca trực; tự động lọc bỏ giáo viên bị trùng lịch; nếu tìm đích danh giáo viên trùng, hiển thị mờ kèm tên ca trùng. | **Điều chỉnh:** Bổ sung thuật toán kiểm tra trùng lịch dạy và ca test chéo, ngăn ngừa việc gán nhầm nhân sự đang bận. |
| **Hộp thoại Đánh giá Speaking 2025** | Hộp thoại biểu mẫu chấm điểm chi tiết | Tiêu chí chấm điểm kỹ năng nói tiếng Anh | Mở khi bấm vào nút Đánh giá hoặc nút Speaking. Gồm các thang đo phát âm, ngữ điệu, từ vựng, độ lưu loát và nhận xét chi tiết. | **Điều chỉnh:** Đồng bộ biểu mẫu chấm điểm khảo thí 2025 chuẩn hóa, lưu trữ kết quả tức thì vào hồ sơ ca test. |
| **Hộp thoại Chi tiết ca test đầy đủ** | Hộp thoại lớn nhiều ngăn thông tin | Toàn bộ hồ sơ khảo thí của học sinh | Gồm: Thông tin học sinh, thông tin gia đình, kết quả kiểm tra máy tính bảng và phỏng vấn, người phụ trách, tab ghi chú và lịch sử. | **Điều chỉnh:** Tái cấu trúc layout hộp thoại chi tiết gọn gàng, hỗ trợ chuyển đổi trạng thái (Check-in, Đang test, Hoàn tất, Hủy) trực quan. |
| **Hộp thoại Xác nhận Hủy ca test** | Hộp thoại cảnh báo xác nhận | Lý do hủy ca và ghi nhận học viên vắng | Xuất hiện khi bấm nút Hủy ca (icon đỏ) trên bảng; yêu cầu xác nhận để chuyển trạng thái sang Đã hủy và vắng mặt. | **Bổ sung:** Tuân thủ nguyên tắc xác nhận trước các hành động hủy/xóa, tránh thao tác bấm nhầm của nhân viên. |

---

## 3. KHỐI CHỨC NĂNG CHI TIẾT: ACTION & LUỒNG KÍCH HOẠT (ACTIONS & EVENTS)

### Khối chức năng 1: Điều hướng & Bộ lọc nhanh trên thanh công cụ

#### Action 1.1: Lọc nhanh ca khảo thí theo Phím tắt "Lịch của tôi"
* **Luồng kích hoạt:** Người dùng nhấp chuột vào nút phím tắt "Lịch của tôi" trên hàng 2 thanh công cụ.
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC-1 (Happy Path - Kích hoạt lọc ca test cá nhân phụ trách):**
    - **Giả sử:** Người dùng đang đăng nhập với vai trò Giáo viên hoặc Chuyên viên khảo thí tại màn hình `/app/booking_test`.
    - **Khi:** Người dùng nhấp chọn nút "Lịch của tôi".
    - **Thì:** Nút chuyển sang trạng thái kích hoạt với màu nền đậm; bảng danh sách chỉ hiển thị các ca test mà người dùng là giáo viên phỏng vấn, người chấm hoặc người tạo; số lượng đếm trên các Thẻ trạng thái chính được tính toán lại chính xác theo danh sách đã lọc.
  - **AC-2 (Happy Path - Tắt lọc cá nhân để xem toàn bộ cơ sở):**
    - **Giả sử:** Phím tắt "Lịch của tôi" đang ở trạng thái kích hoạt.
    - **Khi:** Người dùng nhấp chuột lại vào nút "Lịch của tôi".
    - **Thì:** Nút trở về trạng thái bình thường; bảng danh sách khôi phục hiển thị toàn bộ các ca test thuộc phạm vi cơ sở được phân quyền.

#### Action 1.2: Chuyển đổi môn học khảo thí
* **Luồng kích hoạt:** Người dùng nhấp chọn môn học tại ô thả xuống Môn học trên hàng 1 thanh công cụ.
* **Tiêu chí nghiệm thu:**
  - **AC-3 (Happy Path - Chuyển sang môn Toán học):**
    - **Giả sử:** Danh sách đang hiển thị ca khảo thí môn Tiếng Anh.
    - **Khi:** Người dùng chọn giá trị `Toán học`.
    - **Thì:** Bảng danh sách làm mới chỉ hiển thị các ca môn Toán; dải điều kiện lọc phụ tự động ẩn mục "Đã phỏng vấn"; cột Điểm số Speaking hiển thị dấu gạch ngang `-`; chỉ hiển thị điểm máy tính bảng LWR.
  - **AC-4 (Happy Path - Chuyển lại môn Tiếng Anh):**
    - **Giả sử:** Danh sách đang ở chế độ xem môn Toán học.
    - **Khi:** Người dùng chọn lại `Tiếng Anh`.
    - **Thì:** Hệ thống khôi phục hiển thị đầy đủ cột Speaking kèm điểm giáo viên, điểm trí tuệ nhân tạo và hiển thị lại mục "Đã phỏng vấn" trên dải điều kiện lọc phụ.

---

### Khối chức năng 2: Thao tác Check-in & Hủy ca nhanh trực tiếp trên dòng bảng

#### Action 2.1: Nhấp nút Check-in 1 chạm tại cột Học viên
* **Luồng kích hoạt:** Người dùng nhấp vào nút "Check-in" màu ngọc lục bảo trên dòng học sinh vừa đến cơ sở.
* **Tiêu chí nghiệm thu:**
  - **AC-5 (Happy Path - Check-in thành công cho học sinh đến cơ sở):**
    - **Giả sử:** Ca khảo thí đang ở trạng thái `Đã đặt lịch test` và học sinh chưa được ghi nhận check-in.
    - **Khi:** Người dùng nhấp nút "Check-in" tại dòng của học sinh đó.
    - **Thì:** Hệ thống ghi nhận trạng thái đến của học sinh; biểu tượng tích xanh xuất hiện ngay cạnh tên học sinh; nút Check-in tự động biến mất khỏi dòng; thông báo xác nhận thành công hiển thị góc màn hình; số lượng đếm trên điều kiện "Đã check-in" tăng thêm 1.

#### Action 2.2: Rê chuột và bấm Hủy ca khảo thí
* **Luồng kích hoạt:** Người dùng rê chuột vào dòng ca test và nhấp vào biểu tượng hủy màu đỏ xuất hiện ở góc phải tên học sinh.
* **Tiêu chí nghiệm thu:**
  - **AC-6 (Happy Path - Xác nhận hủy ca test khi học sinh báo vắng):**
    - **Giả sử:** Ca khảo thí chưa hoàn tất và phụ huynh báo vắng hoặc không đến.
    - **Khi:** Người dùng rê chuột vào dòng và bấm biểu tượng Hủy màu đỏ, sau đó bấm xác nhận "Hủy ca test" trên hộp thoại cảnh báo.
    - **Thì:** Trạng thái ca test chuyển sang `Đã hủy`; trạng thái chuyên cần ghi nhận `Từ chối đến / Vắng mặt`; biểu tượng chữ X màu đỏ hiển thị cạnh tên học sinh; số lượng đếm trên thẻ trạng thái cập nhật tức thì.

---

### Khối chức năng 3: Phân bổ & Đổi Giáo viên phụ trách kèm kiểm tra trùng lịch

#### Action 3.1: Nhấp vào tên giáo viên hoặc nút "Gán phụ trách" tại cột Phụ trách
* **Luồng kích hoạt:** Người dùng nhấp chuột vào ô tên giáo viên hoặc nút "Gán phụ trách" trên dòng dữ liệu.
* **Tiêu chí nghiệm thu:**
  - **AC-7 (Happy Path - Hiển thị danh sách giáo viên khả dụng không trùng lịch):**
    - **Giả sử:** Ca khảo thí diễn ra vào khung giờ cụ thể (ví dụ: Thứ 5, 10:00 - 10:30).
    - **Khi:** Người dùng nhấp vào ô người phụ trách để mở Hộp thoại chọn giáo viên.
    - **Thì:** Hộp thoại hiển thị danh sách nhân sự tại cơ sở; các giáo viên đang có ca dạy lớp hoặc ca khảo thí khác trong khung giờ 10:00 - 10:30 tự động bị ẩn khỏi danh sách gợi ý ưu tiên.
  - **AC-8 (Happy Path - Cảnh báo khi tìm kiếm đích danh giáo viên bị trùng lịch):**
    - **Giả sử:** Giáo viên A đang có lịch dạy lớp chính khóa trùng giờ thi của ca test.
    - **Khi:** Người dùng nhập chính xác tên "Giáo viên A" vào ô tìm kiếm của hộp thoại gán nhân sự.
    - **Thì:** Dòng tên Giáo viên A hiển thị ở trạng thái mờ (vô hiệu hóa) kèm theo nhãn thông tin màu đỏ cảnh báo trùng lịch: `Trùng ca: [Mã lớp / Tên ca test trùng]`; không cho phép người dùng chọn nhân sự này.
  - **AC-9 (Happy Path - Gán nhân sự thành công):**
    - **Giả sử:** Người dùng nhấp chọn một giáo viên rảnh lịch trong danh sách khả dụng.
    - **Khi:** Người dùng xác nhận chọn giáo viên.
    - **Thì:** Tên giáo viên mới được cập nhật ngay tại cột Phụ trách của dòng bảng; ca test tự động thoát khỏi điều kiện lọc "Chưa gán GV"; số đếm "Chưa gán GV" giảm đi 1.

---

### Khối chức năng 4: Xem & Thiết lập Kết quả đánh giá tại cột Kết quả

#### Action 4.1: Nhấp mở Hộp nổi Cấp độ và Ghi chú nhận xét
* **Luồng kích hoạt:** Người dùng nhấp vào ô cấp độ tại cột Kết quả của ca khảo thí đã có điểm.
* **Tiêu chí nghiệm thu:**
  - **AC-10 (Happy Path - Xem và cập nhật cấp độ đề xuất cho học sinh):**
    - **Giả sử:** Học sinh đã hoàn tất bài thi máy tính bảng và bài phỏng vấn, hệ thống đã tự động tính toán cấp độ gợi ý.
    - **Khi:** Người dùng nhấp vào ô cấp độ để mở Hộp nổi kết quả.
    - **Thì:** Hộp nổi hiển thị cấp độ đề xuất chính và nhánh cấp độ chi tiết; người dùng có thẩm quyền có thể chọn cấp độ phù hợp trong danh mục và nhập ghi chú nhận xét nhanh; dữ liệu được lưu tự động và đồng bộ về hệ thống.

---

## 4. CÁC TRƯỜNG HỢP GÓC CẠNH & LUỒNG NGOẠI LỆ (CORNER CASES & EXCEPTION FLOWS)

### Nhóm 1: Khung hiển thị & Điều hướng dữ liệu
* **[CASE-01] Danh sách rỗng sau khi áp dụng tổ hợp bộ lọc:**
  * **Tình huống:** Người dùng chọn kết hợp nhiều điều kiện lọc hoặc nhập từ khóa tìm kiếm không khớp với bất kỳ ca test nào.
  * **Xử lý:** Bảng dữ liệu hiển thị thành phần trạng thái rỗng chuẩn (`EmptyState`) với biểu tượng lịch biểu, tiêu đề `Không tìm thấy dữ liệu` và hướng dẫn điều chỉnh tìm kiếm hoặc xóa bớt bộ lọc.
* **[CASE-02] Số điện thoại phụ huynh bị khuyết hoặc có nhiều thành viên gia đình:**
  * **Tình huống:** Hồ sơ học sinh chưa cập nhật số điện thoại phụ huynh hoặc có nhiều số liên lạc của cả bố và mẹ.
  * **Xử lý:** Nếu không có số, hiển thị dấu gạch ngang `-`; nếu có nhiều người thân, hiển thị tên người liên hệ chính và số điện thoại đã che, đồng thời hỗ trợ xem danh sách các thành viên gia đình khác trong hộp thoại chi tiết.

### Nhóm 2: Ràng buộc Trùng lịch & Dữ liệu bài test
* **[CASE-03] Ca test môn Toán học không có điểm phỏng vấn:**
  * **Tình huống:** Ca khảo thí được tạo cho môn Toán học, quy trình không bao gồm bài phỏng vấn Speaking.
  * **Xử lý:** Giao diện dòng bảng tự động ẩn component điểm Speaking và thay bằng ký tự `-`; dải điều kiện lọc phụ tự động ẩn mục "Đã phỏng vấn"; hộp thoại chi tiết chỉ hiển thị khối điểm máy tính bảng LWR và nút bấm Hoàn thành thủ công dành cho chuyên viên vận hành.
* **[CASE-04] Học sinh bắt đầu làm bài test trên máy tính bảng trước khi được check-in tại quầy:**
  * **Tình huống:** Học sinh vào thẳng phòng khảo thí và mở bài làm trên máy tính bảng trong khi nhân viên lễ tân chưa kịp bấm nút Check-in trên giao diện máy tính.
  * **Xử lý:** Hệ thống tự động ghi nhận check-in và chuyển trạng thái ca test từ `Đã đặt lịch test` sang `Đang đánh giá`; biểu tượng tích xanh tự động hiển thị cạnh tên học sinh trên bảng danh sách mà không cần nhân viên bấm thủ công.
* **[CASE-05] Giáo viên phụ trách được gán chính là tài khoản đang đăng nhập:**
  * **Tình huống:** Ca khảo thí được phân bổ cho chính người dùng hiện tại đang đăng nhập hệ thống.
  * **Xử lý:** Tại cột Phụ trách, bên cạnh tên giáo viên hiển thị thêm nhãn chữ thanh mảnh `(bạn)` màu tím; ca test tự động được tính vào số lượng đếm của phím tắt "Lịch của tôi" trên thanh công cụ.

### Nhóm 3: Bộ lọc nâng cao & Đồng bộ số liệu
* **[CASE-06] Áp dụng lọc nháp và hủy bỏ thay đổi:**
  * **Tình huống:** Người dùng mở bảng điều khiển lọc nâng cao, tích chọn một số tiêu chí nhưng sau đó bấm nút Đóng (dấu X) hoặc bấm ra ngoài màn hình mà không bấm nút "Áp dụng".
  * **Xử lý:** Hệ thống hủy bỏ toàn bộ các lựa chọn tạm thời, giữ nguyên trạng thái danh sách và các bộ lọc đang có trước đó.
* **[CASE-07] Học sinh có ca khảo thí trước đó chưa hoàn thành:**
  * **Tình huống:** Phụ huynh yêu cầu đặt lịch khảo thí mới cho học sinh trong khi học sinh đó đang có một ca test ở trạng thái Đã đặt lịch hoặc Đang đánh giá.
  * **Xử lý:** Biểu mẫu tạo mới ca test kích hoạt quy tắc chặn đặt trùng theo mã học sinh, hiển thị thông báo nhắc nhở nhân viên hoàn tất hoặc hủy ca cũ trước khi tạo lịch mới.
* **[CASE-08] Khung giờ kết thúc ca khảo thí chạm sát ca tiếp theo:**
  * **Tình huống:** Ca test kết thúc lúc 09:30 và có một ca test hoặc lớp học khác bắt đầu lúc 09:30 hoặc 09:40.
  * **Xử lý:** Thuật toán kiểm tra trùng lịch xác định giáo viên hoàn toàn khả dụng cho khung giờ từ 09:30 hoặc 09:40 trở đi, không báo trùng lịch nhầm lẫn.
