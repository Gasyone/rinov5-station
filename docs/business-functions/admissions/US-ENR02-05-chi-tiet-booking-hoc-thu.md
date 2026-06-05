---
id: US-ENR02-05
title: "Xem và cập nhật Chi tiết Booking Học thử"
bf: BF-ENR-02
domain: CAP-ADM
status: draft
tags: [enrollment, trial, detail, modal]
---

# US-ENR02-05: Xem và cập nhật Chi tiết Booking Học thử

> **Tham chiếu:** BF-ENR-02 · `[POLICY-DS-03]` · Giao diện Mẫu §4.3 (Trang chi tiết / Hộp thoại chi tiết)

## 1. Yêu cầu Người dùng (User Story)

**Là một** nhân viên Tư vấn / Giáo vụ / Quản lý chi nhánh,
**tôi muốn** mở hộp thoại xem thông tin chi tiết đầy đủ của một phiếu đăng ký học thử dạng hai cột (chi tiết chính chiếm phần lớn diện tích và thanh ghi chú phụ bên cạnh),
**để** nắm bắt toàn bộ thông tin học sinh, liên hệ gia đình, ca học đã ghép, kết quả đánh giá năng lực từ giáo viên và lịch sử hoạt động liên quan.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Thực hiện độc lập trên bảng nổi chi tiết học thử.
> - [x] **N**egotiable — Có thể linh hoạt sắp xếp các khối thông tin nhỏ trong chi tiết.
> - [x] **V**aluable — Giúp tập trung thông tin đa chiều về học viên học thử tại một nơi để chốt sale.
> - [x] **E**stimable — Đã rõ các trường thông tin và cơ chế đồng bộ từ quản lý buổi học.
> - [x] **S**mall — Hoàn thành trong một đợt phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu rõ ràng ở mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1.  **[RULE-DETAIL-01] Hiển thị động các nút hành động:**
    *   Các nút duyệt ghép lớp chỉ hiển thị khi phiếu học thử ở trạng thái **Chờ xác nhận**. Gồm: **Chấp thuận ghép** (Màu xanh lá) và **Từ chối ghép** (Màu đỏ).
    *   Nút **Hủy lịch** (Màu đỏ) hiển thị khi phiếu học thử ở trạng thái đang hoạt động khác và không ở trạng thái Chờ xác nhận (ví dụ: Đã ghép lớp).
    *   Đối với các trạng thái kết thúc (Hoàn thành, Đã hủy, Bị từ chối ghép lớp), hệ thống ẩn toàn bộ nút hành động và hiển thị dòng chữ tĩnh thể hiện trạng thái tương ứng ở góc phải trên cùng.
2.  **[RULE-DETAIL-02] Tự động cập nhật Người phụ trách:** Khi ca học được ghép thành công, hệ thống tự động gán Người phụ trách của phiếu học thử thành tên Giáo viên phụ trách lớp học đó.
3.  **[RULE-DETAIL-03] Đồng bộ Lịch sử hoạt động:** Mọi hành động làm thay đổi thông tin hoặc trạng thái của phiếu học thử (Ví dụ: Tạo mới, Ghép lớp, Phê duyệt, Từ chối, Đổi buổi, Hủy lịch...) bắt buộc phải được ghi nhận tự động vào danh sách Lịch sử hoạt động theo thứ tự thời gian mới nhất xếp trên cùng.
4.  **[RULE-DETAIL-04] Ca học ghép duy nhất:** Bảng lịch học ghép trong chi tiết hiển thị duy nhất thông tin của **đúng 1 ca học thử**.
5.  **[RULE-DETAIL-05] Hiển thị Kết quả nhận xét chỉ đọc:** Khung hiển thị kết quả nhận xét của Giáo viên là thông tin hoàn toàn chỉ đọc. Hệ thống tự động đồng bộ kéo dữ liệu số sao đánh giá và đường dẫn xem báo cáo nhận xét từ phân hệ quản lý buổi học về hiển thị tại đây sau khi giáo viên hoàn tất nộp đánh giá. Nhân viên không được phép chỉnh sửa hay nhập điểm danh/nhận xét tại màn hình này.
6.  **[RULE-DETAIL-06] Ghi chú nội bộ:** Nhân viên có thể nhập thêm ghi chú nội bộ để lưu vết các thông tin quan trọng. Khi nhấn gửi, ghi chú mới sẽ được lưu lại kèm tên người dùng và thời gian thực hiện, đồng thời hiển thị ngay trên danh sách ghi chú.

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-01] Giới hạn lịch sử hiển thị:** Nhật ký hoạt động hiển thị mặc định 20 dòng nhật ký mới nhất.
- **[METRIC-02] Ràng buộc ký tự ghi chú:** Ghi chú nội bộ giới hạn nhập tối đa 500 ký tự cho mỗi lần thêm mới.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** 2 cột (Chi tiết 70% / Tác vụ phụ & Lịch sử 30%).

### 3.1. Tiêu đề & Nút thao tác

| Nút / Nhãn | Loại hiển thị | Logic chuyển trạng thái | Điều kiện hiển thị |
| :--- | :--- | :--- | :--- |
| Chấp thuận ghép | Nút màu xanh lá | Đổi trạng thái sang Đã ghép lớp | Phiếu ở trạng thái Chờ xác nhận |
| Từ chối ghép | Nút màu đỏ rủi ro | Đổi trạng thái sang Bị từ chối ghép lớp | Phiếu ở trạng thái Chờ xác nhận |
| Hủy lịch | Nút màu đỏ rủi ro | Hộp thoại xác nhận hủy → Đã hủy | Phiếu ở các trạng thái hoạt động và khác Chờ xác nhận (Ví dụ: Đã ghép lớp) |
| Đã hoàn thành | Văn bản tĩnh màu mờ | Không chuyển đổi | Phiếu ở trạng thái Hoàn thành |
| Đã hủy | Văn bản tĩnh màu mờ | Không chuyển đổi | Phiếu ở trạng thái Đã hủy |
| Bị từ chối ghép lớp | Văn bản tĩnh màu mờ | Không chuyển đổi | Phiếu ở trạng thái Bị từ chối ghép lớp |

### 3.2. Cột trái — Chi tiết (Chỉ xem)

| Thông tin | Loại hiển thị | Trường dữ liệu | Ghi chú & Quy tắc |
| :--- | :--- | :--- | :--- |
| Tiêu đề phụ | Dòng chữ nhỏ | Học viên · Chương trình · Số buổi | Nằm dưới tiêu đề chính. |
| Học viên | Khung thông tin lớn | Tên học viên + Mã khách hàng | Hiển thị ngay dưới đường phân cách tiêu đề. |
| Lần học | Khung thông tin lớn | Số lần đăng ký học thử | Ví dụ: "Lần 2". |
| Cơ sở | Khung thông tin lớn | Chi nhánh tổ chức học thử | Ví dụ: "Rino Linh Đàm". |
| Thông tin liên hệ | Khối thông tin (Panel) | Tên gia đình + Số điện thoại che ở giữa | Số điện thoại che dạng `0909****22`, có nút sao chép bên cạnh. |
| Buổi học đã chọn | Khối thông tin (Panel) | Số buổi học đã gán + Nút Đổi buổi | Nút Đổi buổi hiển thị khi ca đã gán và chưa kết thúc. |
| Ca học cụ thể | Thẻ thông tin chi tiết | Tên lớp (Mã lớp), Ca học, Ngày giờ học thử | Hiển thị chi tiết của duy nhất 1 ca học thử được gán. |
| Môn học | Ô hiển thị (Chỉ đọc) | Môn học | Tự động điền theo chương trình. |
| Phòng học | Ô hiển thị (Chỉ đọc) | Tên phòng học | Mặc định hiển thị "Chưa xếp phòng" khi chưa gán. |
| Lớp cũ đã giải phóng | Khung cảnh báo (Nền vàng) | Tên lớp cũ + ca học cũ đã hủy | Chỉ hiển thị nếu bản ghi có thông tin lớp cũ bị hủy trước đó. |
| Sale | Khung thông tin nhân sự | Tên nhân viên sale tạo phiếu | Hiển thị kèm ảnh đại diện. |
| Người phụ trách | Khung thông tin nhân sự | Tên giáo viên phụ trách dạy thử | Hiển thị kèm ảnh đại diện. Tự động cập nhật theo giáo viên của lớp gán. |
| Kết quả nhận xét | Khối thông tin (Panel) | Số sao đánh giá + Đường dẫn xem chi tiết | Dạng liên kết mở tab mới: "Xem chi tiết kết quả đánh giá (X/5 sao)". Hiển thị "Chờ kết quả..." nếu chưa có nhận xét. |

### 3.3. Cột phải — Ghi chú

| Khu vực | Loại hiển thị | Trường | Ghi chú & Quy tắc |
| :--- | :--- | :--- | :--- |
| Tab Ghi chú | Nút chuyển tab | Ghi chú | Hiển thị danh sách ghi chú nội bộ. |
| Danh sách ghi chú | Khung hiển thị dọc | Nội dung ghi chú, Người viết, Ngày giờ | Ghi chú mới nhất xếp trên cùng. Hiển thị "Chưa có ghi chú." nếu trống. |
| Ô nhập ghi chú | Ô nhập văn bản dài | Nội dung ghi chú mới | Tối đa 500 ký tự. |
| Nút gửi ghi chú | Nút biểu tượng máy bay | Ghi chú mới | Bị vô hiệu hóa (disabled) nếu ô nhập rỗng hoặc chỉ có khoảng trắng. |

### 3.4. Lịch sử hoạt động

| Thành phần | Loại hiển thị | Dữ liệu | Hoạt động |
| :--- | :--- | :--- | :--- |
| Tab Lịch sử | Nút chuyển tab | Lịch sử | Hiển thị dòng thời gian hoạt động của phiếu. |
| Dòng thời gian | Danh sách dọc (Timeline) | Hành động, Chi tiết, Người thực hiện, Ngày giờ | Sắp xếp từ mới nhất xuống cũ nhất. Hiển thị "Chưa có lịch sử hoạt động" nếu trống. |

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
Hộp thoại chi tiết được mở dưới dạng cửa sổ nổi lớn ở giữa màn hình. Giao diện được chia thành hai cột theo tỷ lệ vàng: Cột trái chiếm 70% bề rộng hiển thị toàn bộ hồ sơ chi tiết của học viên, thông tin liên hệ phụ huynh, thẻ thông tin ca học ghép chi tiết và kết quả nhận xét từ giáo viên; Cột phải chiếm 30% bề rộng hiển thị khung tác vụ phụ gồm hai tab chuyển đổi mượt mà giữa Ghi chú nội bộ và dòng thời gian Lịch sử hoạt động.

### 4.2. Luồng Hoạt động (Workflow)
Khi người dùng bấm vào một dòng trên danh sách chính, hộp thoại chi tiết sẽ mở ra. Người dùng có thể nhanh chóng sao chép số điện thoại phụ huynh bằng cách bấm biểu tượng sao chép. Nếu giáo vụ cần dời lịch học, họ bấm nút "Đổi buổi" trong phần Lớp & Buổi học để mở hộp thoại xếp lớp. Để trao đổi thông tin, người dùng gõ nội dung vào ô nhập ghi chú ở cột phải và bấm gửi, hệ thống sẽ lưu lại và hiển thị ngay trên danh sách ghi chú nội bộ.

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
| :--- | :--- | :--- | :--- |
| 5.1 | Mã phiếu học thử không tồn tại | Đóng hộp thoại nổi và hiển thị thông báo lỗi "Bản ghi học thử không tồn tại hoặc đã bị xóa". | Báo lỗi hệ thống |
| 5.2 | Giáo viên chưa nộp nhận xét | Khung kết quả nhận xét hiển thị dòng chữ mờ "Chờ kết quả..." và không hiển thị đường dẫn xem chi tiết. | Chờ nhận xét |
| 5.3 | Nhập ghi chú toàn khoảng trắng | Chặn không cho gửi ghi chú và vô hiệu hóa nút gửi nếu ô nhập văn bản rỗng hoặc chỉ chứa khoảng trắng. | Kiểm tra đầu vào |
| 5.4 | Bản ghi bị thay đổi đồng thời | Nếu người dùng khác vừa cập nhật trạng thái phiếu (ví dụ: đã hủy), khi người dùng hiện tại bấm duyệt, hệ thống sẽ báo lỗi xung đột dữ liệu và yêu cầu đóng hộp thoại để tải lại danh sách chính. | Xung đột đồng thời |
| 5.5 | Ghi chú quá dài | Khung ghi chú nội bộ giới hạn tối đa 500 ký tự và tự động xuống dòng phù hợp để tránh tràn giao diện. | Ràng buộc ký tự |
| 5.6 | Lịch sử hoạt động trống | Nếu phiếu học thử vừa tạo chưa có hoạt động nào khác, tab Lịch sử hiển thị thông báo "Chưa có lịch sử hoạt động". | |
| 5.7 | Đường dẫn nhận xét bị lỗi hoặc không tồn tại | Khi nhấn vào link "Xem chi tiết kết quả đánh giá" nhưng hệ thống không tìm thấy đường dẫn hợp lý, hiển thị thông báo cảnh báo nhẹ và hướng dẫn liên hệ kỹ thuật hỗ trợ. | Lỗi liên kết |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Bố cục chuẩn 70/30):** Hộp thoại hiển thị đúng tỷ lệ cột chi tiết bên trái chiếm 70% và cột ghi chú/lịch sử bên phải chiếm 30% diện tích trên màn hình máy tính. Co giãn thành 1 cột trên thiết bị di động.
- **AC-2 (Thông tin chung đầy đủ):** Hiển thị đúng 3 thông tin lớn: Học viên (kèm mã), Lần học, và Cơ sở ngay dưới tiêu đề phụ của modal.
- **AC-3 (Hành động động theo trạng thái):**
  - Trạng thái *Chờ xác nhận*: Hiển thị nút "Chấp thuận ghép" (màu xanh lá) và "Từ chối ghép" (màu đỏ) ở góc phải trên.
  - Trạng thái hoạt động khác (*Đã ghép lớp*): Hiển thị nút "Hủy lịch" (màu đỏ).
  - Trạng thái kết thúc (*Hoàn thành*, *Đã hủy*, *Từ chối ghép*): Ẩn toàn bộ nút thao tác duyệt/hủy, hiển thị nhãn trạng thái tĩnh tương ứng ở góc phải tiêu đề.
- **AC-4 (Nút Đổi buổi hiển thị đúng):** Nút "Đổi buổi" chỉ xuất hiện trong panel Lớp & Buổi học khi ca học đã được gán và trạng thái chưa kết thúc. Khi bấm sẽ mở đúng Dialog xếp lớp.
- **AC-5 (Xem nhận xét động):** Nếu trạng thái là Hoàn thành, hiển thị liên kết "Xem chi tiết kết quả đánh giá (X/5 sao)" có biểu tượng mở trang mới. Nhấn vào sẽ mở chính xác URL báo cáo nhận xét ở tab mới. Nếu chưa có, hiển thị dòng chữ tĩnh "Chờ kết quả...".
- **AC-6 (Gửi ghi chú hợp lệ):** Tab Ghi chú cho phép gõ ghi chú mới. Nút gửi chỉ được kích hoạt (enabled) khi có nội dung chữ. Gửi thành công sẽ đẩy ghi chú mới lên đầu danh sách và tự động xóa trống ô nhập liệu.
- **AC-7 (Lịch sử Audit Log đồng bộ):** Tab Lịch sử hiển thị danh sách dòng thời gian audit log, sắp xếp thời gian mới nhất trên cùng.
- **AC-8 (Bảo mật thông tin):** Số điện thoại phụ huynh được che đi phần giữa dạng `0909****22`, nút sao chép hoạt động đúng để copy số điện thoại gốc vào clipboard và hiển thị thông báo toast thành công.