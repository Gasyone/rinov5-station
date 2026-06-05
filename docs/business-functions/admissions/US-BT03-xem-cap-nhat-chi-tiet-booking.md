---
id: US-BT03
title: "Xem & Cập nhật chi tiết Booking Test"
bf: BF-ENR-01
domain: CAP-ADM
status: draft
tags: [enrollment, booking-test, detail, modal]
---

# US-BT03: Xem & Cập nhật chi tiết Booking Test

> **Tham chiếu:** BF-ENR-01 · `[POLICY-DS-03]` · Giao diện Mẫu §4.3 (Trang chi tiết / Hộp thoại chi tiết)

## 1. Yêu cầu Người dùng (User Story)

**Là một** nhân viên Tư vấn / Quản lý chi nhánh / Giáo viên,
**tôi muốn** mở hộp thoại xem thông tin chi tiết đầy đủ của một lịch hẹn kiểm tra năng lực đầu vào dưới dạng hai cột (chi tiết chính ở bên trái và thanh ghi chú/lịch sử ở bên phải),
**để** nắm bắt hồ sơ học sinh, thông tin liên hệ gia đình, kết quả kiểm tra Nói từ giáo viên, kết quả làm bài trắc nghiệm từ thiết bị làm bài, lịch sử hoạt động liên quan và thực hiện cập nhật giáo viên phụ trách cũng như trạng thái lịch hẹn kịp thời.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Thực hiện độc lập trên bảng nổi chi tiết lịch đánh giá, không phụ thuộc các câu chuyện người dùng khác.
> - [x] **N**egotiable — Có thể linh hoạt sắp xếp các khối thông tin nhỏ trong chi tiết.
> - [x] **V**aluable — Giúp tập trung thông tin đánh giá đa chiều của học viên tại một nơi để ra quyết định xếp lớp.
> - [x] **E**stimable — Đã rõ các trường thông tin và cơ chế gán giáo viên.
> - [x] **S**mall — Hoàn thành trong một đợt phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu rõ ràng ở mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1.  **[RULE-DETAIL-01] Hiển thị động các nút hành động theo trạng thái:**
    *   **Check-in học viên:** Nút chỉ hiển thị khi học viên chưa điểm danh là "Đã đến" và lịch hẹn không ở trạng thái kết thúc (Hoàn thành, Đã hủy, Không đạt). Thao tác này sẽ cập nhật tình trạng điểm danh thành "Đã đến". Nếu lịch hẹn đang ở trạng thái "Đã đặt lịch test", hệ thống tự động chuyển sang "Đang đánh giá".
    *   **Hủy lịch test:** Hiển thị khi lịch hẹn chưa kết thúc (không nằm trong nhóm trạng thái: Hoàn thành, Đã hủy, Không đạt). Thao tác này yêu cầu xác nhận qua hộp thoại và sẽ chuyển trạng thái lịch hẹn thành "Đã hủy".
    *   **Không đạt & Hoàn tất:** Chỉ hiển thị khi lịch hẹn ở trạng thái "Đang đánh giá". Bấm chọn sẽ đổi trạng thái lịch hẹn tương ứng thành "Không đạt" hoặc "Hoàn thành".
    *   **Mở đánh giá:** Chỉ hiển thị khi môn học là Tiếng Anh, lịch hẹn đang ở trạng thái "Đang đánh giá" và đã có giáo viên phụ trách được gán. Bấm nút sẽ mở màn hình đánh giá chi tiết để giáo viên chấm điểm Nói.
    *   Đối với các trạng thái kết thúc (Hoàn thành, Đã hủy, Không đạt), hệ thống ẩn toàn bộ các nút thao tác trên và chỉ hiển thị nút đóng hộp thoại.
2.  **[RULE-DETAIL-02] Chỉnh sửa trực tiếp tại chỗ (Inline Edit):**
    *   Nhân viên hoặc giáo viên có thể thay đổi Trình độ đầu vào và Nhánh trình độ trực tiếp qua các hộp chọn trên giao diện mà không cần chuyển qua chế độ chỉnh sửa toàn màn hình.
    *   Tính năng chỉnh sửa này chỉ được kích hoạt khi học sinh đã làm bài kiểm tra, phỏng vấn xong hoặc khi lịch hẹn đã ở trạng thái kết thúc (Hoàn thành, Không đạt).
    *   Hộp chọn Nhánh trình độ sẽ bị vô hiệu hóa nếu chưa chọn Trình độ đầu vào. Khi thay đổi Trình độ đầu vào, Nhánh trình độ sẽ tự động trả về giá trị trống.
3.  **[RULE-DETAIL-03] Chọn giáo viên và kiểm tra trùng lịch (Chống trùng ca):**
    *   Nhấp vào phần Giáo viên phụ trách sẽ mở hộp thoại phụ "Chọn giáo viên".
    *   Danh sách nhân sự hiển thị trong hộp thoại này phải tự động lọc theo đúng Cơ sở (Chi nhánh) của lịch hẹn hiện tại.
    *   Hệ thống tự động kiểm tra chéo thời gian của ca test này với các lịch hẹn hoạt động khác của giáo viên. Nếu giáo viên đã bị gán cho một ca test khác cùng khung giờ đó, hệ thống sẽ hiển thị cảnh báo chữ đỏ ghi rõ tên học viên bị trùng và vô hiệu hóa dòng chọn giáo viên đó.
4.  **[RULE-DETAIL-04] Ghi chú tích lũy nội bộ:**
    *   Ghi chú nội bộ hiển thị dưới dạng dòng thời gian cuộn dọc theo thứ tự thời gian mới nhất ở trên cùng.
    *   Thông tin ghi chú bao gồm nội dung, tên nhân viên viết và thời gian thực hiện. Hệ thống chỉ cho phép thêm ghi chú mới, không cho phép chỉnh sửa hoặc xóa ghi chú đã lưu để đảm bảo tính lưu vết lịch sử.
5.  **[RULE-DETAIL-05] Nhật ký hoạt động tự động:**
    *   Hệ thống tự động ghi nhận mọi thao tác làm thay đổi dữ liệu hoặc trạng thái của lịch hẹn (như: tạo lịch, gán giáo viên, thay đổi trình độ, check-in, hủy lịch, thêm ghi chú) vào dòng thời gian Nhật ký hoạt động để phục vụ kiểm toán thông tin.
6.  **[RULE-DETAIL-06] Bảo mật số điện thoại gia đình:**
    *   Số điện thoại liên hệ của phụ huynh học sinh hiển thị trên giao diện sẽ được che bớt các chữ số ở giữa (ví dụ: `038****122`) để bảo mật thông tin.
    *   Cung cấp nút gọi điện nhanh (liên kết hệ thống tổng đài) và nút sao chép nhanh số điện thoại gốc vào bộ nhớ tạm.
7.  **[RULE-DETAIL-07] Tự động đồng bộ kết quả đánh giá (iPad / AI / Giáo viên):**
    *   Hệ thống tự động ghi nhận và hiển thị điểm Nói từ giáo viên (sau khi hoàn thành phỏng vấn), kết quả Nói từ AI (nếu có), và kết quả các kỹ năng Nghe-Đọc-Viết (LWR) được trả về từ thiết bị làm bài kiểm tra (iPad).
    *   Khi các kết quả này được cập nhật, khu vực Kết quả đánh giá trong hộp thoại chi tiết sẽ tự động hiển thị dữ liệu mới nhất mà không cần tải lại thủ công.
8.  **[RULE-DETAIL-08] Liên kết đa màn hình (Cross-Screen Integration):** Hộp thoại chi tiết booking test này có thể được gọi hiển thị trực tiếp từ 3 màn hình khác nhau: Danh sách Booking Test (`app/booking_test`), Lịch sự kiện Cơ sở (`app/calendar_event_schedule`), và Lịch của tôi (`app/my_schedule`). Khi có bất kỳ thay đổi nào từ hộp thoại này, hệ thống tự động cập nhật và làm mới (re-fetch) dữ liệu hiển thị trên các giao diện Lịch liên quan mà không cần tải lại trang.

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-01] Giới hạn ký tự ghi chú:** Ghi chú nội bộ giới hạn nhập tối đa 500 ký tự cho mỗi lần thêm mới.
- **[METRIC-02] Hiển thị lịch sử:** Nhật ký lịch sử hoạt động hiển thị toàn bộ các mốc hoạt động được sắp xếp theo thời gian mới nhất lên trên cùng.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** Hộp thoại nổi lớn. Phần đầu chứa Tiêu đề và Nút thao tác; ngay dưới là Khối tóm tắt thông tin nằm ngang; bên dưới cùng chia làm 2 cột: Cột chính bên trái (70% diện tích) và Cột phụ bên phải (30% diện tích). Trên thiết bị di động, bố cục tự động co giãn thành một cột dọc.

### 3.1. Tiêu đề & Nút thao tác

| Thành phần | Loại hiển thị | Logic chuyển trạng thái / Hành động | Điều kiện hiển thị |
| :--- | :--- | :--- | :--- |
| **Check-in học viên** | Nút viền màu xanh lá | Đổi điểm danh sang "Đã đến". Nếu trạng thái đang là "Đã đặt lịch test", tự động chuyển trạng thái lịch hẹn sang "Đang đánh giá". | Chưa check-in (attendance !== 'confirmed') VÀ trạng thái lịch hẹn ∉ {Hoàn thành, Đã hủy, Không đạt} |
| **Hủy lịch test** | Nút màu đỏ | Hiển thị hộp thoại xác nhận hủy → Đổi trạng thái sang "Đã hủy" | Trạng thái lịch hẹn ∉ {Hoàn thành, Đã hủy, Không đạt} |
| **Không đạt** | Nút viền | Đổi trạng thái lịch hẹn sang "Không đạt" | Trạng thái lịch hẹn = "Đang đánh giá" |
| **Hoàn tất** | Nút màu xanh lá đậm | Đổi trạng thái lịch hẹn sang "Hoàn thành" | Trạng thái lịch hẹn = "Đang đánh giá" |
| **Mở đánh giá** | Nút màu nhấn thương hiệu | Mở hộp thoại chấm điểm Nói trực tiếp cho Giáo viên | Môn học = Tiếng Anh VÀ đã gán giáo viên VÀ trạng thái lịch hẹn = "Đang đánh giá" |
| **Đóng (X)** | Nút biểu tượng góc phải | Đóng hộp thoại nổi | Luôn hiển thị |

### 3.2. Khối tóm tắt thông tin nằm ngang (Chỉ xem)

| Thông tin | Loại hiển thị | Nội dung hiển thị | Ghi chú & Quy tắc |
| :--- | :--- | :--- | :--- |
| **Học viên** | Văn bản kèm nhãn | Tên học viên + Mã lịch hẹn | Nằm ở vị trí đầu tiên của khối tóm tắt. |
| **Chương trình** | Văn bản | Tên chương trình đăng ký học | Ví dụ: "Station Program". |
| **Lịch hẹn** | Văn bản kèm trạng thái | Thời gian ca test (Giờ · Ngày) + Nhãn trạng thái "Đã đến" | Nhãn "Đã đến" màu xanh lá nhấp nháy chỉ hiển thị khi đã check-in thành công. |
| **Cơ sở** | Văn bản | Chi nhánh tổ chức test + Tên phòng thi | Ví dụ: "Rino Tô Ký" (Dưới: "Phòng B1" hoặc "Sảnh tư vấn"). |
| **Môn học** | Nhãn màu | Tên môn học | Ví dụ: "Tiếng Anh" hoặc "Toán". |

### 3.3. Cột trái — Chi tiết chính (70% diện tích)

| Khối thông tin | Trường dữ liệu | Cơ chế hiển thị & Thao tác | Ghi chú & Quy tắc |
| :--- | :--- | :--- | :--- |
| **Gia đình** | Tên phụ huynh, mối quan hệ, số điện thoại che | Chỉ xem. Mỗi phụ huynh đi kèm một nút gọi điện và nút sao chép số điện thoại gốc. | Lấy thông tin liên hệ phụ huynh. Nếu trống, lấy tự động từ dữ liệu đặt lịch gốc. |
| **Kết quả đánh giá** | Trình độ đầu vào (Level), Nhánh trình độ (Sublevel) | Hộp chọn thả xuống tại chỗ để cập nhật nhanh. | Chỉ cho phép sửa khi học viên đã hoàn thành thi/phỏng vấn hoặc trạng thái kết thúc. Nhánh trình độ bị khóa nếu chưa chọn Trình độ. |
| | Điểm phỏng vấn (Speaking), Điểm trắc nghiệm (LWR) | Hiển thị nhãn điểm GV và AI chấm (Nói) + Điểm bài làm trên máy tính bảng. | Điểm Nói chỉ hiển thị khi môn học là Tiếng Anh. Điểm trắc nghiệm hiển thị tên bài test kèm điểm số (Ví dụ: "Pre-Starters - 19/40"). |
| **Phụ trách** | Nhân viên Sale (Người tạo), Giáo viên chấm | Hiển thị tên kèm ảnh đại diện tròn của từng nhân sự phụ trách. | Nhấp vào thẻ Giáo viên sẽ mở hộp thoại phụ "Chọn giáo viên" nếu được phép. Giáo viên mặc định hiển thị "Chưa gán giáo viên" và nút chọn nếu trống. |
| **Kết quả** | Liên kết "Kết quả từ iPad", Liên kết "Kết quả đánh giá (Giáo viên)" | Hiển thị liên kết kèm biểu tượng mở trang mới ở tab trình duyệt khác. | Chỉ hiển thị khi ca test đã hoàn thành làm bài hoặc có kết quả phỏng vấn Nói từ giáo viên. |

### 3.4. Cột phải — Ghi chú & Lịch sử (30% diện tích)

| Phân vùng | Loại hiển thị | Trường thông tin | Cơ chế thao tác |
| :--- | :--- | :--- | :--- |
| **Tab Ghi chú** | Danh sách cuộn dọc | Nội dung ghi chú, Tên nhân viên tạo, Thời gian ghi nhận | Mới nhất xếp trên cùng. Hiển thị dòng chữ mờ "Chưa có ghi chú" nếu trống. |
| | Ô nhập văn bản | Nhập nội dung ghi chú mới | Tối đa 500 ký tự. Nút gửi (máy bay giấy) bị vô hiệu hóa nếu ô nhập chỉ có khoảng trắng. |
| **Tab Lịch sử** | Nhật ký dọc (Timeline) | Chi tiết hoạt động thay đổi, Người thực hiện, Ngày giờ ghi nhận | Hệ thống tự động ghi nhật ký các hành động đổi giáo viên, check-in, đổi trình độ, thêm ghi chú... Mới nhất trên cùng. |

### 3.5. Hộp thoại phụ Chọn giáo viên (Popup Chọn giáo viên)

Giao diện hộp thoại nổi xuất hiện ở trung tâm màn hình đè lên hộp thoại chi tiết:

| Thành phần | Loại hiển thị | Mô tả dữ liệu & Thao tác | Ghi chú & Quy tắc nghiệp vụ |
| :--- | :--- | :--- | :--- |
| **Tiêu đề** | Văn bản lớn | Hiển thị chữ "Chọn giáo viên" | Ở góc trên cùng bên trái của hộp thoại. |
| **Phụ đề** | Chữ nhỏ mờ | Hiển thị chữ "Danh sách nhân sự active tại [Tên Chi Nhánh]" | Nằm ngay dưới tiêu đề chính. |
| **Thanh tìm kiếm** | Ô nhập liệu | Nhập từ khóa tìm kiếm (theo tên, chức danh, email, số điện thoại) | Tự động lọc danh sách nhân sự bên dưới ngay khi nhập. |
| **Tab phân loại** | Thanh chuyển tab phân loại | Các lựa chọn "Tất cả", "Giáo viên", "Khác" | Lọc nhanh danh sách nhân sự theo nhóm vai trò tương ứng. |
| **Dòng nhân sự** | Khung chọn | Ảnh đại diện tròn (hoặc tên viết tắt), Tên nhân sự, Chức danh/Phòng ban, Email, Số điện thoại che phần giữa, nhãn trạng thái "Active" | Nhấp chọn giáo viên để gán phụ trách cho ca test và đóng hộp thoại. |
| **Dòng nhân sự hiện tại** | Khung chọn nổi bật | Viền xanh dương nổi bật kèm biểu tượng dấu tích xanh bên cạnh tên | Thể hiện nhân sự đang được gán hiện thời cho ca test. |
| **Cảnh báo trùng lịch** | Dòng chữ đỏ | Dòng chữ cảnh báo: *"Trùng lịch: ca của [Tên học viên trùng] ([Chương trình học])"* | Xuất hiện phía dưới dòng nhân sự bị trùng giờ chấm ca khác. Dòng nhân sự bị mờ đi và vô hiệu hóa không cho bấm chọn. |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
Hộp thoại chi tiết được thiết kế dạng cửa sổ nổi lớn phủ mờ màn hình nền. Bố cục gồm thanh tiêu đề trên cùng chứa các thông tin định danh lớn của học viên kèm nhóm nút hành động thay đổi trạng thái động. Dưới tiêu đề là đường kẻ chia ngăn cách với khối tóm tắt nằm ngang hiển thị 5 trường thông tin cốt lõi (Học viên, Chương trình, Lịch hẹn, Cơ sở, Môn học). Phần thân dưới cùng được chia làm hai cột rõ rệt: Cột trái (70% bề rộng) là nơi hiển thị các khối thông tin nghiệp vụ cốt lõi dưới dạng các thẻ panel bo tròn góc có bóng đổ nhẹ; Cột phải (30% bề rộng) là cột ghi chú và nhật ký hoạt động có thể chuyển đổi qua tab độc lập.

### 4.2. Luồng Hoạt động (Workflow)

*   **Luồng Xem và Điểm danh (Check-in):**
    1.  Người dùng bấm vào một lịch hẹn từ màn hình danh sách, hệ thống mở hộp thoại chi tiết lịch hẹn.
    2.  Hệ thống hiển thị trạng thái điểm danh hiện tại. Nếu học viên chưa đến phòng máy/phòng phỏng vấn, nút **Check-in học viên** hiển thị nổi bật ở góc phải trên.
    3.  Khi học viên có mặt, nhân viên bấm **Check-in học viên**. Điểm danh cập nhật thành "Đã đến" (gắn nhãn xanh lá nhấp nháy cạnh thời gian hẹn), đồng thời trạng thái lịch hẹn chuyển từ "Đã đặt lịch test" sang "Đang đánh giá".
    4.  Nhật ký hoạt động tự động ghi nhận mốc thời gian và tên nhân viên thực hiện check-in.
*   **Luồng Gán/Thay đổi Giáo viên chấm phỏng vấn:**
    1.  Trong khối thông tin "Phụ trách", người dùng bấm vào thẻ giáo viên (hoặc nút **Chọn** / **Đổi**).
    2.  Hộp thoại phụ **Chọn giáo viên** mở ra, mặc định hiển thị danh sách nhân sự tại chi nhánh của ca hẹn đó.
    3.  Người dùng có thể nhập từ khóa để tìm kiếm giáo viên theo tên hoặc lọc theo tab giáo viên giảng dạy.
    4.  Hệ thống tự động vô hiệu hóa và cảnh báo trùng ca đối với các giáo viên có lịch chấm trùng giờ.
    5.  Người dùng bấm chọn một giáo viên hợp lệ. Hệ thống cập nhật thông tin ngay lập tức trên màn hình chi tiết chính, đóng hộp thoại phụ và ghi nhận hoạt động vào nhật ký dòng thời gian.
*   **Luồng Đánh giá và Cập nhật Trình độ:**
    1.  Giáo viên thực hiện phỏng vấn học viên bằng cách bấm nút **Mở đánh giá** (nếu là môn Tiếng Anh). Màn hình chấm điểm Nói (US-BT04) mở ra.
    2.  Sau khi hoàn tất bài chấm Nói của giáo viên và bài trắc nghiệm trên máy tính bảng của học sinh, kết quả điểm Nói và điểm trắc nghiệm tự động hiển thị trong khối "Kết quả đánh giá".
    3.  Hộp chọn Trình độ và Nhánh trình độ được mở khóa cho phép chọn trực tiếp. Giáo viên/tư vấn viên chọn trình độ xếp lớp phù hợp dựa vào kết quả điểm số.
    4.  Hệ thống tự động lưu lựa chọn trình độ đầu vào ngay khi thay đổi và ghi nhận vào lịch sử hoạt động.
*   **Luồng tự động nhận kết quả từ thiết bị (iPad) và trí tuệ nhân tạo (AI):**
    1. Khi học viên hoàn thành bài thi trắc nghiệm trên thiết bị (iPad) hoặc giáo viên hoàn thành chấm phỏng vấn và hệ thống AI hoàn tất phân tích giọng nói.
    2. Các hệ thống này sẽ gửi kết quả điểm số về cho hệ thống quản lý trung tâm.
    3. Hộp thoại chi tiết lịch hẹn (nếu đang mở) sẽ tự động nhận diện và cập nhật hiển thị điểm số Nói (GV/AI) và LWR mà người dùng không cần bấm tải lại trang.
    4. Hệ thống cũng tự động mở khóa các ô chọn Trình độ và Nhánh trình độ để nhân viên tư vấn/giáo viên thực hiện xếp lớp dựa trên kết quả mới nhận được.
*   **Luồng gọi hiển thị từ Lịch biểu & Tự động đồng bộ:**
    1. Khi người dùng nhấp chọn thẻ ca kiểm tra (Booking Test) từ giao diện Lịch sự kiện Cơ sở (`app/calendar_event_schedule`) hoặc Lịch của tôi (`app/my_schedule`), hệ thống sẽ mở trực tiếp hộp thoại chi tiết này.
    2. Nếu người dùng thực hiện các thay đổi (như: đổi giáo viên chấm, check-in học viên, thay đổi trình độ xếp lớp, thêm ghi chú) trong hộp thoại, sau khi đóng hộp thoại, giao diện Lịch bên dưới sẽ tự động nạp lại dữ liệu (re-fetch) để cập nhật hiển thị chính xác mà không cần tải lại toàn bộ trang.

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
| :--- | :--- | :--- | :--- |
| 5.1 | Lịch hẹn không tồn tại hoặc đã bị xóa | Đóng hộp thoại nổi và hiển thị thông báo lỗi "Lịch hẹn không tồn tại hoặc đã bị xóa trên hệ thống". | Lỗi dữ liệu |
| 5.2 | Không có dữ liệu thành viên gia đình trong chi tiết | Hệ thống tự động lấy thông tin người đặt lịch gốc (tên, số điện thoại) hiển thị làm liên hệ chính. Nút gọi và sao chép hoạt động bình thường. | Dữ liệu dự phòng |
| 5.3 | Chưa phân công giáo viên chấm phỏng vấn | Thẻ giáo viên hiển thị nút "Chọn" kèm ảnh đại diện tròn chứa dấu chấm hỏi mờ. | Chưa phân công |
| 5.4 | Người dùng thay đổi Trình độ đầu vào | Hộp chọn Nhánh trình độ tự động đặt lại về trạng thái chưa chọn ("-") và yêu cầu người dùng chọn lại nhánh tương ứng nếu có. | Reset liên kết |
| 5.5 | Giáo viên chưa thực hiện phỏng vấn / Chưa có bài thi | Ẩn khu vực panel "Kết quả" liên kết ngoài, đồng thời các hộp chọn Trình độ và Nhánh trình độ bị khóa (vô hiệu hóa). | Chờ kết quả |
| 5.6 | Bấm nút hủy lịch test | Hệ thống hiển thị hộp thoại xác nhận hủy nguy hiểm. Nếu người dùng đồng ý mới thực hiện đổi trạng thái sang "Đã hủy" và đóng các tác vụ. | Xác nhận hủy |
| 5.7 | Trùng lịch chấm của giáo viên | Giáo viên bị trùng ca test khác cùng khung giờ tại chi nhánh sẽ hiển thị dòng chữ cảnh báo màu đỏ chi tiết và không cho phép bấm chọn trong danh sách. | Chống trùng ca |
| 5.8 | Phát hiện sai sót điểm thi sau khi ca test đã chuyển sang Hoàn thành | Sau khi ca kiểm tra đã chuyển sang trạng thái "Hoàn thành" và được xếp lớp, nếu phát hiện sai sót, chỉ có Quản lý chi nhánh hoặc Admin mới thấy nút "Mở khóa sửa đổi" để đưa trạng thái về "Đang đánh giá" và cập nhật lại điểm. | Thu hồi trạng thái |
| 5.9 | Yêu cầu hủy check-in khi bài thi trắc nghiệm trên iPad đã bắt đầu thực hiện | Học sinh đã làm được một số câu trên iPad thì phát hiện check-in nhầm người. Hệ thống phát hiện bài thi có tiến trình sẽ chặn không cho phép hủy check-in trực tiếp, yêu cầu giám thị phải hủy/xóa bài thi trên thiết bị trước. | Ràng buộc hủy check-in |
| 5.10 | Thay đổi giờ test hoặc thay đổi giáo viên phụ trách ca test ảnh hưởng trực tiếp đến Lịch biểu | Khi dời lịch ca test hoặc gán đổi giáo viên phụ trách, hệ thống tự động cập nhật thời gian mới trên Lịch sự kiện Cơ sở (`app/calendar_event_schedule`), gỡ thẻ sự kiện khỏi Lịch của tôi (`app/my_schedule`) của giáo viên cũ và đẩy lên Lịch của tôi của giáo viên mới ngay khi thay đổi được ghi nhận. | Đồng bộ Lịch biểu |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Bố cục chuẩn hai cột):** Hộp thoại hiển thị đúng tỷ lệ cột chi tiết bên trái chiếm 70% và cột ghi chú/lịch sử bên phải chiếm 30% diện tích trên màn hình máy tính. Co giãn thành 1 cột dọc trên thiết bị di động.
- **AC-2 (Nút hành động động theo trạng thái):**
  - Trạng thái chưa kết thúc và chưa check-in: Hiển thị nút "Check-in học viên" (viền xanh lá) và "Hủy lịch test" (màu đỏ).
  - Trạng thái "Đang đánh giá": Hiển thị nút "Không đạt" (viền), "Hoàn tất" (màu xanh lá đậm) và nút "Mở đánh giá" (màu nhấn) khi thỏa mãn điều kiện môn học và giáo viên.
  - Trạng thái kết thúc ("Hoàn thành", "Đã hủy", "Không đạt"): Ẩn toàn bộ nút thao tác duyệt/hủy trạng thái, chỉ hiển thị nút đóng hộp thoại.
- **AC-3 (Chỉnh sửa trình độ tại chỗ):** Hộp chọn trình độ và nhánh trình độ hoạt động dưới dạng lựa chọn tại chỗ, tự động lưu thay đổi lập tức mà không cần nút Lưu toàn cục. Mở khóa đúng điều kiện nghiệp vụ.
- **AC-4 (Gán giáo viên và kiểm tra trùng ca):** Nhấp vào thẻ giáo viên mở đúng hộp thoại phụ "Chọn giáo viên". Chỉ hiển thị giáo viên thuộc cơ sở của ca hẹn. Giáo viên trùng lịch test khác cùng khung giờ sẽ bị vô hiệu hóa dòng chọn và ghi rõ thông tin trùng ca bằng chữ đỏ.
- **AC-5 (Thêm ghi chú tích lũy):** Nhập nội dung ghi chú hợp lệ và bấm nút gửi sẽ đẩy ghi chú mới lên đầu dòng thời gian, hiển thị rõ tên người viết và ngày giờ thực hiện, đồng thời xóa trống ô nhập liệu. Ghi chú cũ không được phép sửa hay xóa.
- **AC-6 (Nhật ký hoạt động tự động):** Khi có bất kỳ thay đổi nào về thông tin hoặc trạng thái của ca hẹn, tab Lịch sử tự động hiển thị dòng nhật ký hoạt động mới nhất lên trên cùng.
- **AC-7 (Bảo mật số điện thoại liên hệ):** Số điện thoại phụ huynh được che đi phần giữa dạng `038****122`, nút sao chép hoạt động đúng để copy số điện thoại gốc đầy đủ vào bộ nhớ tạm và hiển thị thông báo thành công. Nút gọi điện kích hoạt đúng sự kiện cuộc gọi.
- **AC-8 (Liên kết kết quả ngoài):** Khi ca test đã hoàn thành làm bài trắc nghiệm hoặc có kết quả chấm nói từ giáo viên, panel "Kết quả" hiển thị chính xác các nút liên kết mở trang kết quả tương ứng ở tab mới.
- **AC-9 (Đồng bộ check-in tự động/thủ công):** Thao tác check-in tự động khi bắt đầu làm bài test/phỏng vấn hoặc check-in thủ công hoạt động đúng như mô tả quy tắc, cập nhật trạng thái đồng bộ chính xác.
- **AC-10 (Đồng bộ thời gian thực với Lịch biểu):** Khi gọi hộp thoại chi tiết này từ Lịch sự kiện Cơ sở (`app/calendar_event_schedule`) hoặc Lịch của tôi (`app/my_schedule`), tất cả thông tin liên kết hiển thị chính xác. Khi thực hiện thay đổi giờ test hoặc đổi giáo viên phụ trách trong hộp thoại chi tiết này, sau khi đóng hộp thoại, thẻ sự kiện trên giao diện Lịch bên dưới phải tự động di chuyển sang đúng khung giờ mới hoặc cập nhật đúng giáo viên phụ trách mới mà không cần tải lại toàn bộ trang.

---

## 7. Chỉ dẫn cho Lập trình viên

### 7.1. Ánh xạ Trạng thái Dữ liệu (State Mappings)

- **Trạng thái lịch hẹn (BookingStatus):**
  - Đã đặt lịch test -> `booked_assessment`
  - Đang đánh giá -> `started_assessment`
  - Hoàn tất -> `completed`
  - Không đạt -> `failed`
  - Đã hủy -> `cancelled`
- **Tình trạng điểm danh (BookingAttendance):**
  - Chờ -> `pending`
  - Đã đến -> `confirmed`
- **Môn học (BookingSubject):**
  - Tiếng Anh -> `english`
  - Toán -> `math`

### 7.2. Cấu trúc Component và Tệp tin

- **Thư mục chức năng:** `src/components/screens/booking-test/`
- **Tệp điều phối chính:** `BookingTestDetailDialog.tsx` (Chứa cấu trúc Dialog nổi chính, quản lý hiển thị 2 cột).
- **Các component phụ trợ trong detail:**
  - `BookingTestDetailActions.tsx` (Xử lý logic hiển thị các nút hành động ở Header theo trạng thái).
  - `BookingTestDetailSidePanel.tsx` (Chứa Tabs Ghi chú và dòng thời gian Lịch sử hoạt động).
  - `BookingTestResponsiblePanel.tsx` (Quản lý hiển thị thông tin nhân sự phụ trách và mở hộp thoại chọn giáo viên).
  - `BookingTestEmployeePickerDialog.tsx` (Hộp thoại nổi danh sách chọn giáo viên, xử lý tìm kiếm, lọc phân loại và kiểm tra trùng ca).
  - `BookingTestScoreDisplay.tsx` (Hiển thị điểm số Speaking GV/AI và LWR).
  - `BookingTestStaffCard.tsx` (Thẻ hiển thị thông tin nhân sự phụ trách).

### 7.3. Sử dụng Primitives & Style

- Sử dụng component `<Panel />` và `<InfoField />` từ `@/components/shared` để kết xuất các khối thông tin và các trường dữ liệu tĩnh cột trái/phải theo đúng thiết kế lưới của hệ thống.
- Sử dụng `<FieldLabel />` từ `@/components/shared` để bọc các hộp chọn tại chỗ.
- Sử dụng `<InlineSelect />` từ `@/components/controls` cho các dropdown Trình độ (Level) và Nhánh trình độ (Sublevel).
- Sử dụng `<ConfirmDialog />` từ `@/components/shared` bọc ngoài nút hủy lịch để yêu cầu người dùng xác nhận trước khi thực hiện cập nhật.
- Sử dụng `<StatusBadge />` từ `@/components/shared` cho trạng thái của ca hẹn và trạng thái của nhân sự trong danh sách giáo viên.
- Bố cục flex grid: Dialog chính chia tỉ lệ hai cột bằng CSS Tailwind: `lg:grid-cols-[1fr_320px]`, trong đó cột phải (ghi chú) cố định chiều rộng 320px, cột trái co giãn tự động theo không gian màn hình.