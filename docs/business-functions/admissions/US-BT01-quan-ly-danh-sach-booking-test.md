---
id: US-BT01
title: "Quản lý danh sách Booking Test"
bf: BF-ENR-01
domain: CAP-ADM
status: draft
tags: [enrollment, booking-test, list, modal]
---

# US-BT01: Quản lý danh sách Booking Test

> **Tham chiếu:** BF-ENR-01 · `[POLICY-DS-03]` · Giao diện Mẫu §4.2 (Danh sách)

## 1. Yêu cầu Người dùng (User Story)

**Là một** nhân viên Tư vấn / Quản lý chi nhánh / Giáo viên,
**tôi muốn** xem và lọc danh sách lịch hẹn kiểm tra năng lực đầu vào theo cơ sở, môn học và trạng thái, đồng thời thực hiện các thao tác xử lý nhanh trực tiếp trên dòng danh sách,
**để** theo dõi sát sao tình hình kiểm tra của học viên, phân phối giáo viên chấm điểm kịp thời và quản lý tiến độ hiệu quả.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập trên bảng quản lý danh sách lịch đánh giá, không phụ thuộc các câu chuyện người dùng khác.
> - [x] **N**egotiable — Thứ tự các cột và vị trí các bộ lọc có thể thương lượng dựa trên thói quen vận hành.
> - [x] **V**aluable — Mang lại cái nhìn toàn diện về lịch hẹn cho các bộ phận tư vấn, giáo vụ và giáo viên.
> - [x] **E**stimable — Đã rõ ràng cấu trúc bảng danh sách, thanh công cụ và bộ lọc nâng cao.
> - [x] **S**mall — Hoàn thành trong một đợt phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu rõ ràng ở mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1.  **[RULE-LIST-01] Hiển thị mặc định:** Khi mới truy cập, danh sách tự động chọn môn học là Tiếng Anh và hiển thị tất cả các ca kiểm tra thuộc quyền hạn truy cập của tài khoản.
2.  **[RULE-LIST-02] Tìm kiếm đa trường:** Thanh tìm kiếm tự động lọc kết quả khi người dùng nhập chữ, tìm kiếm không phân biệt chữ hoa thường trên 6 thông tin: tên học viên, tên gia đình, số điện thoại, mã lịch hẹn, tên cơ sở và phòng học.
3.  **[RULE-LIST-03] Trạng thái chính và trạng thái phụ (trạng thái ảo):**
    *   Thanh trạng thái bao gồm các ô lọc hiển thị số đếm cho các trạng thái chính và một số trạng thái phụ (trạng thái ảo) đặc biệt: *Chưa gán Giáo viên*, *Đã check-in*, *Đã phỏng vấn*, *Đã làm bài*.
    *   Các trạng thái ảo không loại trừ lẫn nhau và không loại trừ trạng thái chính. Số đếm của các ô trạng thái này được tính toán đồng thời từ tập dữ liệu thỏa mãn điều kiện lọc.
4.  **[RULE-LIST-04] Lọc kết hợp đồng thời:** Tất cả bộ lọc từ thanh công cụ (chọn cơ sở), ô trạng thái, ô tìm kiếm và bảng lọc nâng cao đều hoạt động đồng thời theo logic VÀ.
5.  **[RULE-LIST-05] Đồng bộ số đếm theo cơ sở:** Khi thay đổi lựa chọn Cơ sở ở thanh công cụ hoặc lọc nhiều cơ sở ở bảng lọc nâng cao, số đếm hiển thị trên tất cả các ô trạng thái phải tự động tính toán lại theo cơ sở đã chọn.
6.  **[RULE-LIST-06] Bảo mật số điện thoại liên hệ:** Số điện thoại của phụ huynh học sinh hiển thị trên danh sách sẽ được che bớt các số ở giữa (ví dụ: `038****122`) để bảo mật thông tin. Nhân viên chỉ sử dụng số điện thoại đầy đủ khi thực hiện cuộc gọi hoặc sao chép nhanh.
7.  **[RULE-LIST-07] Phân quyền hiển thị theo Giáo viên:** Nhân sự đăng nhập với vai trò Giáo viên chỉ nhìn thấy các ca đánh giá được phân công cho chính họ tại các cơ sở phụ trách. Quản lý chi nhánh, tư vấn viên và quản trị viên hệ thống có quyền xem toàn bộ ca đánh giá thuộc phạm vi quản lý.
8.  **[RULE-LIST-08] Tự động khởi tạo bài kiểm tra trên thiết bị (iPad):** Khi một ca kiểm tra được đặt lịch thành công hoặc khi học viên được check-in, hệ thống tự động sinh một liên kết làm bài kiểm tra trắc nghiệm (Nghe-Đọc-Viết) dành riêng cho học sinh trên thiết bị làm bài.
9.  **[RULE-LIST-09] Đồng bộ kết quả tự động về bảng danh sách:**
    *   **Điểm trắc nghiệm (LWR):** Ngay sau khi học sinh nộp bài thi trên thiết bị (iPad), điểm số bài thi sẽ tự động đồng bộ và hiển thị trực tiếp tại cột **LWR** trên bảng danh sách.
    *   **Điểm phỏng vấn (Speaking):** Điểm số đánh giá Nói của Giáo viên (ví dụ: `GV: 5/8`) và kết quả phân tích của trí tuệ nhân tạo (AI) (ví dụ: `AI: 6/8`) tự động cập nhật hiển thị tại cột **Speaking** ngay sau khi Giáo viên hoàn tất chấm bài trên phiếu đánh giá.
    *   **Liên kết kết quả:** Cột **Kết quả** tự động hiển thị nút liên kết mở trang báo cáo kết quả chi tiết ở tab trình duyệt mới ngay khi ghi nhận điểm số của bất kỳ phần thi nào.
10. **[RULE-LIST-10] Chỉnh sửa trình độ qua bảng nổi (popover):** Trình độ (Level) và Nhánh trình độ (Sublevel) được gộp chung hiển thị trên cùng một cột xếp trên/dưới. Di chuột hiển thị biểu tượng cây bút để kích hoạt bảng nổi (popover) cập nhật trình độ mà không cần mở hộp thoại chi tiết. Tính năng này chỉ được mở khóa khi học sinh đã làm bài kiểm tra, phỏng vấn xong hoặc trạng thái lịch hẹn đã kết thúc.

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-01] Số dòng mặc định:** Danh sách hiển thị mặc định 20 dòng trên mỗi trang.
- **[METRIC-02] Tùy chọn phân trang:** Cung cấp các tùy chọn số lượng hiển thị trên trang bao gồm: 20, 50, 100 bản ghi.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ (Toolbar)

| Thành phần | Loại hiển thị | Nội dung / Thao tác | Ghi chú & Quy tắc |
| :--- | :--- | :--- | :--- |
| **Tab môn học** | Thanh chuyển tab phân đoạn | ENGLISH / MATH | Môn Toán (MATH) nằm ngoài phạm vi phiên bản hiện tại nên bị mờ và vô hiệu hóa tương tác. Mặc định chọn ENGLISH. |
| **Chọn Cơ sở** | Hộp chọn thả xuống | Danh sách chi nhánh đang hoạt động | Lọc nhanh theo chi nhánh được chọn. Có nhãn "Tất cả cơ sở" để hiển thị toàn bộ. |
| **Ô tìm kiếm** | Ô nhập chữ mở rộng | Tìm kiếm tự động khi nhập | Gợi ý: "Tìm tên học viên, số điện thoại, mã lịch...". Tìm kiếm không dấu và không biệt hoa thường. |
| **Nút Lọc nâng cao** | Nút biểu tượng | Bấm mở bảng lọc nâng cao từ cạnh phải | Hiển thị chấm đỏ kèm số lượng bộ lọc đang áp dụng bên cạnh biểu tượng nếu lớn hơn 0. |

### 3.2. Khối lọc Trạng thái (Status Tiles)

| Ô trạng thái | Loại nhãn màu | Điều kiện lọc bản ghi | Ý nghĩa & Quy tắc |
| :--- | :--- | :--- | :--- |
| **Tất cả (ALL)** | Trung tính | Bỏ lọc trạng thái, hiển thị toàn bộ | Cố định ở góc trái ngoài cùng khi cuộn ngang. |
| **Đã đặt lịch test** | Xanh lá cây | Trạng thái = `booked_assessment` | Lịch hẹn đã được tạo thành công và chờ đến ngày giờ test. |
| **Chưa gán GV** | Vàng cảnh báo | Trạng thái = `booked_assessment` VÀ chưa có giáo viên phụ trách | Trạng thái ảo hỗ trợ tìm nhanh các ca test thiếu nhân sự. |
| **Đang đánh giá** | Xanh dương | Trạng thái = `started_assessment` | Học viên đang làm bài test hoặc đang phỏng vấn với giáo viên. |
| **Đã phỏng vấn** | Tím đặc biệt | Trạng thái = `started_assessment` VÀ học viên đã hoàn thành phỏng vấn Nói | Trạng thái ảo giúp nhận biết tiến độ phỏng vấn Nói. |
| **Đã làm bài** | Cam cảnh báo | Trạng thái = `started_assessment` VÀ học viên đã hoàn thành bài LWR | Trạng thái ảo giúp nhận biết tiến độ làm trắc nghiệm LWR. |
| **Đã check-in** | Xanh lá viền | Điểm danh = `confirmed` hoặc trạng thái ∈ {started_assessment, completed, failed} | Trạng thái ảo xác nhận học viên đã đến cơ sở làm bài hoặc đã vào thi. |
| **Hoàn tất** | Xanh ngọc hoàn tất | Trạng thái = `completed` | Đã có đầy đủ kết quả đánh giá Nói, LWR và gán trình độ. |
| **Không đạt** | Đỏ rủi ro | Trạng thái = `failed` | Kết quả đánh giá không đạt điều kiện tối thiểu. |
| **Đã hủy** | Xám trung tính | Trạng thái = `cancelled` | Ca hẹn kiểm tra đã bị hủy bỏ bởi nhân viên hoặc phụ huynh. |

### 3.3. Bảng danh sách chính

*Thao tác nhấp chuột vào bất kỳ dòng nào (trừ các hộp chọn tại chỗ và nút hành động) sẽ mở Hộp thoại chi tiết lịch hẹn (US-BT03).*

| Cột | Loại hiển thị | Nội dung dữ liệu | Ghi chú & Quy tắc |
| :--- | :--- | :--- | :--- |
| **Ô chọn** | Hộp đánh dấu | Hộp chọn đầu dòng và trên thanh tiêu đề | Hộp chọn đầu dòng dùng để chọn bản ghi; hộp chọn trên tiêu đề dùng để chọn/bỏ chọn toàn bộ dòng đang hiển thị. Cố định bên trái. |
| **Học viên** | Khung thông tin hai dòng | Dòng 1: Ảnh đại diện + Tên học viên (in đậm) + Dấu tích xanh nếu đã đến cơ sở<br>Dòng 2: Nhãn môn học | Cố định bên trái. Cung cấp các nút thao tác nhanh khi di chuột (§3.4). Không hiển thị mã học viên. |
| **Điện thoại** | Khung thông tin | Tên gia đình phụ huynh (in hoa màu mờ), Số điện thoại che phần giữa, Nút sao chép. | Nếu gia đình có trên 1 thành viên, hiển thị thêm biểu tượng nút mở bảng nổi liên hệ gia đình (§3.5). |
| **Cơ sở** | Văn bản hai dòng | Dòng 1: Chi nhánh tổ chức (in đậm)<br>Dòng 2: Phòng thi cụ thể | Cắt ngắn bớt văn bản nếu tên chi nhánh quá dài. |
| **Nội dung Trải nghiệm** | Văn bản hai dòng | Dòng 1: Tên Khung chương trình (in đậm)<br>Dòng 2: Biểu tượng đồng hồ + Ngày, giờ booking | Hiển thị rõ ràng chương trình học và thời gian hẹn kiểm tra của học viên. |
| **Giáo viên** | Nhóm ảnh đại diện tròn | Tối đa 3 ảnh tròn viết tắt tên xếp chồng của nhóm nhân sự phụ trách | Di chuột hiển thị tên đầy đủ. Xếp trước cột Trình độ. |
| **Trình độ** | Văn bản hai dòng + Nút chỉnh sửa | Dòng 1: Trình độ xếp lớp được gán hoặc "Chưa đặt"<br>Dòng 2: Nhánh trình độ hoặc "-" | Hiển thị xếp trên/dưới. Rê chuột xuất hiện biểu tượng cây bút để mở bảng nổi (popover) cập nhật trình độ và nhánh trình độ. |
| **Speaking** | Nhãn điểm | Điểm Nói do GV chấm và AI chấm (ví dụ: `GV: 5/8 AI: 6/8`) | Chỉ hiển thị khi môn học là Tiếng Anh. Trống hiển thị "-". |
| **LWR** | Văn bản | Điểm trắc nghiệm Nghe-Đọc-Viết (ví dụ: `27/40`) | Lấy tự động từ dữ liệu bài thi trên máy tính bảng. Trống hiển thị "-". |
| **Trạng thái** | Nhãn trạng thái màu | Nhãn màu thể hiện trạng thái chính của ca hẹn | Ánh xạ màu theo quy chuẩn chung của hệ thống. |
| **Kết quả** | Nút liên kết | Nút "Mở" mở liên kết kết quả bài thi ở trang mới | Chỉ hiển thị khi đã có kết quả bài thi/phỏng vấn. |
| **Ghi chú** | Văn bản kèm biểu tượng | Biểu tượng tin nhắn + Nội dung ghi chú mới nhất | Nội dung ghi chú viết nghiêng và tự động cắt ngắn nếu quá dài. |

### 3.4. Thao tác nhanh khi di chuột vào dòng

Khi người dùng rê chuột vào một dòng trên bảng danh sách, các nút thao tác nhanh sẽ xuất hiện phía bên phải bên trong ô cột **Booking Trải nghiệm**:

| Nút thao tác | Loại biểu tượng | Hành động | Điều kiện hiển thị |
| :--- | :--- | :--- | :--- |
| **Check-in** | Người dùng kèm dấu check | Cập nhật điểm danh học viên thành "Đã đến" trực tiếp. | Học viên chưa check-in (attendance !== 'confirmed') |
| **Mở đánh giá** | Tờ tài liệu | Mở màn hình chấm điểm phỏng vấn Nói (US-BT04). | Môn học = Tiếng Anh VÀ đã gán giáo viên phụ trách VÀ ca hẹn ở trạng thái "Đang đánh giá" |
| **Gán giáo viên** | Người dùng kèm dấu cộng | Mở hộp thoại phụ "Chọn giáo viên" (US-BT03 §3.5) để gán nhanh giáo viên phụ trách. | Môn học ≠ Toán VÀ chưa gán giáo viên phụ trách |
| **Gọi điện** | Điện thoại | Thực hiện cuộc gọi nhanh đến số điện thoại liên hệ chính của học viên. | Luôn hiển thị |

### 3.5. Bảng nổi liên hệ phụ gia đình (Family Popover)

*   Chỉ xuất hiện khi học viên có trên 1 thành viên gia đình được khai báo trong hồ sơ.
*   Bấm nút mở bảng nổi sẽ hiển thị danh sách các thành viên liên hệ phụ:
    *   **Tên thành viên:** Tên phụ huynh kèm mối quan hệ (ví dụ: "Lê Hoa (Mẹ)").
    *   **Số điện thoại:** Dạng ẩn một phần, có nút gọi điện nhanh và nút sao chép nhanh số điện thoại gốc.
*   Hộp thoại tự động đóng lại khi nhấp chuột ra ngoài vùng hiển thị.

### 3.6. Bảng lọc nâng cao (Filter Sheet)

Bảng lọc nâng cao trượt ra từ bên phải màn hình khi bấm nút Lọc nâng cao:

| Nhóm bộ lọc | Loại hiển thị | Cơ chế hoạt động |
| :--- | :--- | :--- |
| **Cơ sở** | Danh sách hộp chọn (Checkbox) | Cho phép chọn lọc nhiều cơ sở đồng thời. Hiển thị số lượng ca test bên cạnh mỗi cơ sở. |
| **Trạng thái** | Danh sách hộp chọn (Checkbox) | Lọc nhiều trạng thái chính (Đã đặt lịch, Đang đánh giá, Hoàn tất, Đã hủy). |
| **Điều kiện khác** | Danh sách hộp chọn (Checkbox) | Lọc các trạng thái ảo (Đã phỏng vấn, Đã làm bài, Không đạt, Đã check-in). |
| **Giáo viên** | Danh sách hộp chọn (Checkbox) | Danh sách giáo viên phụ trách tại các cơ sở, sắp xếp theo bảng chữ cái kèm số lượng lịch hẹn tương ứng. |
| **Ngày trong tuần** | Danh sách hộp chọn (Checkbox) | Thứ Hai đến Chủ Nhật (tính toán tự động từ ngày hẹn test). |
| **Khung chương trình** | Danh sách hộp chọn (Checkbox) | Lọc theo danh sách chương trình học của học viên. |
| **Sale / Người booking** | Danh sách hộp chọn (Checkbox) | Lọc theo tên nhân viên tư vấn đã tạo lịch hẹn. |
| **Xóa tất cả** | Nút chữ | Nằm trên tiêu đề bảng lọc, cho phép đưa toàn bộ bộ lọc đang chọn về trạng thái trống ban đầu. |

### 3.7. Bộ phân trang (Pagination)

Bố trí ở góc dưới cùng bên phải của bảng danh sách:
- **Tổng kết:** Hiển thị thông báo bên trái: *"Hiển thị {số lượng dòng đang hiển thị} / {tổng số lượng bản ghi sau lọc} bản ghi"*.
- **Số dòng trên trang:** Hộp chọn thả xuống với các giá trị `20`, `50`, `100`. Mặc định hiển thị 20 dòng. Khi người dùng thay đổi giá trị này, hệ thống sẽ đưa trang hiện tại về trang đầu tiên (Trang 1).
- **Điều hướng trang:** Nút chuyển trang trước / trang sau và các nút số trang. Vô hiệu hóa nút Trang trước khi đang ở Trang 1 và nút Trang sau khi đang ở trang cuối cùng.

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
Màn hình quản lý danh sách booking được chia thành 4 phần chính rõ ràng theo chiều dọc: trên cùng là thanh công cụ điều khiển và lọc cơ bản (chứa phân đoạn môn học Tiếng Anh/Toán, chọn cơ sở và ô tìm kiếm mở rộng); ngay dưới là thanh trạng thái (Status Tiles) nằm ngang cho phép cuộn ngang trên màn hình nhỏ để xem nhanh số lượng ca test ở từng trạng thái; ở giữa là bảng lưới dữ liệu danh sách chính chiếm phần lớn diện tích có khả năng cuộn ngang với hai cột đầu tiên được ghim cố định; dưới cùng là thanh chân trang chứa thông tin tổng kết số lượng dòng hiển thị và bộ điều khiển phân trang.

### 4.2. Luồng Hoạt động (Workflow)

*   **Luồng lọc dữ liệu cơ bản:**
    1. Khi người dùng truy cập màn hình, hệ thống mặc định lọc môn học Tiếng Anh và cơ sở là "Tất cả cơ sở".
    2. Người dùng nhấp chọn một ô trạng thái trên thanh trạng thái (ví dụ: "Đang đánh giá"), bảng danh sách sẽ lọc và chỉ hiển thị các ca kiểm tra thỏa mãn trạng thái đó.
    3. Nhấp chọn lần thứ hai vào ô trạng thái đó sẽ bỏ lọc trạng thái và quay về hiển thị "Tất cả".
*   **Luồng xử lý nhanh khi di chuột (Hover actions):**
    1. Khi di chuột vào một dòng ca test cụ thể, hệ thống sẽ hiển thị các biểu tượng hành động nhanh bên phải cột đầu tiên.
    2. Nếu học viên đã đến cơ sở nhưng chưa được điểm danh, nhân viên bấm nhanh nút biểu tượng **Check-in**. Điểm danh cập nhật thành "Đã đến" và trạng thái chuyển sang "Đang đánh giá" trực tiếp trên dòng mà không cần mở modal.
    3. Nếu ca test môn Tiếng Anh chưa được gán giáo viên chấm, nhân viên bấm biểu tượng **Gán giáo viên** để mở nhanh hộp thoại phụ chọn giáo viên chấm ngay trên bảng.
    4. Giáo viên phụ trách có thể bấm nút biểu tượng **Mở đánh giá** để truy cập nhanh màn hình chấm phỏng vấn Nói.
*   **Luồng lọc nâng cao bằng Filter Sheet:**
    1. Người dùng bấm biểu tượng chiếc phễu lọc nâng cao ở thanh công cụ, bảng lọc sẽ trượt ra từ bên phải màn hình.
    2. Người dùng tích chọn các tiêu chí (ví dụ: chọn ngày Thứ Bảy + Giáo viên A).
    3. Hệ thống áp dụng logic lọc VÀ giữa các nhóm tiêu chí này để cập nhật bảng danh sách học viên tương ứng, đồng thời số đếm trên thanh trạng thái nằm ngang cũng được cập nhật lại theo kết quả đã lọc.
*   **Luồng tự động tạo bài thi và đồng bộ kết quả (iPad / Giáo viên / AI):**
    1. Ngay khi ca kiểm tra được đặt lịch hoặc điểm danh thành công, hệ thống tự động tạo mã bài thi trắc nghiệm trên thiết bị (iPad).
    2. Học viên tiến hành làm bài thi trắc nghiệm trên máy tính bảng. Khi học viên hoàn tất và bấm nộp bài, điểm số trắc nghiệm tự động gửi về hệ thống và cập nhật hiển thị tại cột **LWR** trên bảng danh sách.
    3. Giáo viên thực hiện phỏng vấn Nói và chấm điểm trên phiếu đánh giá. Sau khi lưu phiếu đánh giá, điểm chấm Nói của Giáo viên và điểm phân tích của trí tuệ nhân tạo (AI) tự động gửi về hệ thống, đồng thời cập nhật hiển thị tại cột **Speaking** trên bảng danh sách.
    4. Cột **Kết quả** của ca kiểm tra tương ứng tự động hiển thị nút liên kết mở trang kết quả phỏng vấn/thi chi tiết. Các hộp chọn Trình độ (Level) và Nhánh trình độ (Sublevel) được mở khóa cho phép giáo viên/tư vấn viên chọn trực tiếp ngay trên dòng.

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
| :--- | :--- | :--- | :--- |
| 5.1 | Không có dữ liệu lịch hẹn nào trong hệ thống | Hiển thị hình ảnh minh họa trống (EmptyState) ở giữa bảng danh sách với thông báo "Không có lịch test phù hợp." | Màn hình trống |
| 5.2 | Tìm kiếm không trả về kết quả | Bảng danh sách hiển thị trống, chân trang hiển thị tổng số "0 bản ghi", số lượng đếm trên các ô trạng thái nằm ngang vẫn được giữ nguyên để phản ánh tổng thể dữ liệu. | Tìm kiếm trống |
| 5.3 | Học sinh có nhiều liên hệ phụ huynh | Cột số điện thoại hiển thị nút mở bảng nổi. Nhấp chuột vào nút sẽ mở bảng nổi chứa danh sách tên và số điện thoại che của tất cả phụ huynh đã đăng ký. Chỉ cho phép mở tối đa 1 bảng nổi tại một thời điểm. | Đa liên hệ |
| 5.4 | Chỉnh sửa trình độ trực tiếp bị lỗi do học sinh chưa hoàn thành thi | Hộp chọn Trình độ và Nhánh trình độ sẽ bị khóa (vô hiệu hóa) không cho phép thay đổi nếu học viên chưa có kết quả làm bài trắc nghiệm LWR hoặc chưa có kết quả phỏng vấn Nói từ giáo viên. | Khóa chỉnh sửa |
| 5.5 | Giáo viên đăng nhập hệ thống | Hệ thống tự động ẩn nút gán giáo viên nhanh khi di chuột, đồng thời danh sách dữ liệu hiển thị trên bảng sẽ tự động lọc chỉ hiển thị các ca đánh giá được gán cho chính giáo viên đó tại các cơ sở phân công. | Phân quyền giáo viên |
| 5.6 | Đồng bộ kết quả từ iPad hoặc hệ thống AI bị trễ mạng | Trong lúc chờ kết quả thi trả về từ thiết bị, các cột LWR và Speaking sẽ hiển thị ký hiệu mặc định "—", nút liên kết kết quả được ẩn đi. Hộp chọn trình độ xếp lớp tiếp tục bị khóa cho đến khi kết quả được đồng bộ thành công. | Trễ mạng / Đồng bộ |
| 5.7 | Trùng lịch chấm của giáo viên khi thực hiện gán nhanh trên bảng | Khi bấm nút gán nhanh giáo viên từ bảng danh sách, nếu giáo viên được chọn đã có lịch chấm ca khác trùng giờ tại chi nhánh đó, hệ thống sẽ hiển thị cảnh báo chữ đỏ lý do trùng ca và vô hiệu hóa dòng chọn nhân viên đó. | Tránh trùng lịch |
| 5.8 | Check-in tự động kích hoạt bởi hành động của học viên hoặc giáo viên | Nếu học viên chưa được check-in thủ công trên danh sách ERP, nhưng học sinh đã mở và bắt đầu làm bài thi trên iPad, hoặc giáo viên bấm nút "Bắt đầu đánh giá" để chấm phỏng vấn, hệ thống sẽ tự động cập nhật điểm danh thành "Đã đến" và chuyển trạng thái chính thành "Đang đánh giá". | Check-in tự động |
| 5.9 | Ràng buộc hủy trạng thái check-in của học viên | Thao tác hủy check-in (chuyển điểm danh từ "Đã đến" về "Chờ" và chuyển trạng thái từ "Đang đánh giá" về "Đã đặt lịch") chỉ được phép thực hiện khi ca hẹn chưa ghi nhận bất kỳ điểm số Speaking hay LWR nào. Nếu đã có điểm thi, hệ thống sẽ chặn không cho phép hủy check-in. | Ràng buộc nghiệp vụ |
| 5.10 | Ca kiểm tra thuộc môn Toán học | Vì môn Toán không có phần chấm phỏng vấn Nói trực tiếp với giáo viên, hệ thống tự động ẩn nút "Gán giáo viên" nhanh khi di chuột trên dòng ca test Toán, đồng thời cột điểm Speaking của ca test này hiển thị mặc định dấu "—". | Đặc thù môn học |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Bố cục danh sách chuẩn):** Hiển thị đúng 4 vùng chức năng theo cấu trúc dọc: Thanh công cụ → Thanh trạng thái → Bảng danh sách chính → Bộ phân trang ở dưới cùng.
- **AC-2 (Tab môn học hoạt động đúng):** Mặc định chọn tab Tiếng Anh. Tab Toán học bị mờ và không thể click chọn do nằm ngoài phạm vi hoạt động.
- **AC-3 (Số đếm ô trạng thái đồng bộ):** Các số đếm hiển thị trên các ô trạng thái chính và trạng thái ảo phản ánh chính xác số lượng lịch hẹn tương ứng. Khi chọn cơ sở hoặc áp dụng bộ lọc nâng cao, các số đếm này tự động cập nhật đồng bộ theo kết quả lọc.
- **AC-4 (Tìm kiếm tự động đa trường):** Nhập từ khóa tìm kiếm tự động lọc danh sách trên 6 trường thông tin (tên học viên, phụ huynh, SĐT, mã, cơ sở, phòng học), hỗ trợ tìm kiếm không dấu và không biệt hoa thường.
- **AC-5 (Ghi cố định cột bảng):** Khi cuộn ngang bảng danh sách trên màn hình nhỏ, cột Hộp chọn dòng và cột Chương trình/Lịch hẹn test bắt buộc phải được ghim cố định ở cạnh trái của bảng để dễ theo dõi.
- **AC-6 (Thao tác nhanh di chuột hoạt động):** Khi rê chuột vào một dòng ca test, các biểu tượng thao tác nhanh (Check-in, Gán giáo viên, Mở đánh giá, Gọi điện) hiển thị chính xác và hoạt động đúng logic nghiệp vụ được gán.
- **AC-7 (Bảng nổi liên hệ gia đình phụ):** Đối với học sinh có trên 1 phụ huynh, nhấp biểu tượng liên hệ mở đúng bảng nổi hiển thị đầy đủ tên, số điện thoại che phần giữa, nút gọi điện và nút sao chép SĐT gốc. Bảng nổi tự đóng khi bấm ra ngoài.
- **AC-8 (Lọc kết hợp nâng cao):** Bảng lọc nâng cao trượt ra từ bên phải màn hình hiển thị chính xác các nhóm lọc và số lượng ca test tương ứng cho từng mục. Bộ lọc nâng cao kết hợp hoạt động đồng thời theo đúng logic VÀ với các bộ lọc cơ bản ngoài màn hình.
- **AC-9 (Chỉnh sửa trình độ trực tiếp tại chỗ):** Giáo viên có thể thay đổi trực tiếp Trình độ (Level) và Nhánh trình độ (Sublevel) qua dropdown tại chỗ trên bảng danh sách mà không cần vào trang chi tiết khi ca test đã hoàn thành làm bài/phỏng vấn.

---

## 7. Chỉ dẫn cho Lập trình viên

### 7.1. Ánh xạ Trạng thái Dữ liệu (State Mappings)

- **Trạng thái lịch hẹn chính (BookingStatus):**
  - Đã đặt lịch test -> `booked_assessment`
  - Đang đánh giá -> `started_assessment`
  - Hoàn tất -> `completed`
  - Không đạt -> `failed`
  - Đã hủy -> `cancelled`
- **Tình trạng điểm danh (BookingAttendance):**
  - Chờ -> `pending`
  - Đã đến -> `confirmed`
- **Bộ lọc trạng thái ảo trên giao diện:**
  - *Chưa gán GV* -> Lịch hẹn có trạng thái là `booked_assessment` và thuộc tính `teacher` trống hoặc rỗng.
  - *Đã check-in* -> Lịch hẹn có tình trạng điểm danh là `confirmed` hoặc trạng thái lịch hẹn nằm trong nhóm `{started_assessment, completed, failed}`.
  - *Đã phỏng vấn* -> Lịch hẹn có trạng thái là `started_assessment` và thuộc tính `isInterviewed === true`.
  - *Đã làm bài* -> Lịch hẹn có trạng thái là `started_assessment` và thuộc tính `isTested === true`.

### 7.2. Cấu trúc Component và Tệp tin

- **Thư mục chức năng:** `src/components/screens/booking-test/`
- **Tệp điều phối chính:** `BookingTestScreen.tsx` (Quản lý trạng thái lọc, tìm kiếm, phân trang và đóng/mở các Dialog/Sheet).
- **Các component giao diện liên quan:**
  - `BookingTestToolbar.tsx` (Thanh công cụ trên cùng chứa các bộ lọc cơ bản, ô tìm kiếm và ô trạng thái StatusTiles).
  - `BookingTestTable.tsx` (Bảng lưới danh sách chính, quản lý tiêu đề cột và trạng thái trống).
  - `BookingTestTableRow.tsx` (Dòng dữ liệu trong bảng, quản lý hiển thị các ô cột, sự kiện click dòng, rê chuột hiển thị nút thao tác nhanh).
  - `FamilyPopover.tsx` (Bảng nổi hiển thị thông tin gia đình phụ liên kết từ nút biểu tượng liên hệ gia đình).
  - `bookingTestHelpers.ts` (Các hàm lọc, tìm kiếm, định dạng dữ liệu và tính toán số lượng ca test cho từng trạng thái).
  - `useBookingTestData.ts` (Custom hook tính toán, lọc dữ liệu và chuẩn bị các tùy chọn lọc cho FilterSheetPanel).
  - `useBookingTestActions.ts` (Custom hook xử lý các hành động click nút check-in, gán giáo viên nhanh, mở đánh giá, gọi điện...).

### 7.3. Sử dụng Primitives & Style

- Sử dụng `<DataTableFrame />` làm khung bọc ngoài bảng danh sách chính và chân trang phân trang.
- Sử dụng `<DataTablePagination />` cho bộ phân trang dưới chân bảng, truyền các thuộc tính `page`, `total`, `pageSize`, `onPageChange` và `onPageSizeChange`.
- Sử dụng `<FilterSheetPanel />` cho bảng lọc nâng cao trượt từ bên phải màn hình.
- Sử dụng `<SegmentedControl />` cho thanh chuyển tab môn học Tiếng Anh / Toán học.
- Sử dụng `<BranchSelect />` cho bộ chọn cơ sở.
- Sử dụng `<ExpandableSearch />` cho ô tìm kiếm.
- Sử dụng `<FilterIconButton />` cho biểu tượng phễu lọc nâng cao.
- Sử dụng `<StatusTiles />` hiển thị nhóm trạng thái nằm ngang.
- Ghim cố định cột: Sử dụng CSS class `sticky left-0 z-30` cho cột ô chọn đầu dòng và `sticky left-12 z-20` cho cột Booking Trải nghiệm, kèm theo màu nền của dòng để không bị đè chữ khi cuộn ngang.
