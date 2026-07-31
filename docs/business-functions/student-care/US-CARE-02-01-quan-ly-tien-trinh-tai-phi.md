---
id: US-CARE-02-01
title: "Quản lý Tiến trình Tái phí Học viên"
bf: BF-CARE-02
domain: CAP-CARE
status: draft
tags: [care, renewal, list]
---

# US-CARE-02-01: Quản lý Tiến trình Tái phí Học viên

> **Tham chiếu:** BF-CARE-02 · `[POLICY-CARE-02]` · Giao diện Mẫu §4.2 (Danh sách)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Chuyên viên Chăm sóc Học viên (CSM) hoặc Quản lý Chi nhánh, **tôi muốn** theo dõi danh sách học viên có hạn hết phí cận kề (thuộc tháng hiện tại, tháng đã qua hoặc các tháng tương lai), **để** kịp thời liên hệ tư vấn, ghi nhận các phản hồi, cọc phí hoặc gia hạn hoàn tất của phụ huynh, giúp tối ưu tỷ lệ học viên học tiếp tại trung tâm.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập trong phân hệ Chăm sóc.
> - [x] **N**egotiable — Chi tiết giao diện và dữ liệu mẫu có thể điều chỉnh linh hoạt.
> - [x] **V**aluable — Cực kỳ quan trọng để duy trì doanh thu và giảm tỷ lệ nghỉ học.
> - [x] **E**stimable — Dễ dàng ước lượng dựa trên khung màn hình Theo dõi vận hành.
> - [x] **S**mall — Hoàn thành gọn gàng trong 1 chu kỳ phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu rõ ràng tại mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-RENEWAL-01] Phạm vi thời gian phễu tái phí:**
   Danh sách tập trung quản lý học viên có hạn hết phí nằm trong 3 phân vùng thời gian chính:
   *   **Tháng đã qua (Tháng T-1):** Nhằm rà soát, vợt lại các học viên chưa tái phí thành công.
   *   **Tháng hiện tại (Tháng T):** Trọng tâm chăm sóc tái phí chính khóa.
   *   **Tháng tương lai (Tháng T+1 và T+2):** Đón đầu xu hướng, gọi điện tư vấn đóng phí sớm (chồng phí).

2. **[RULE-RENEWAL-02] Logic chuyển trạng thái tự động:**
   Trạng thái tái phí tổng quát chỉ có 3 dạng: **Đang chăm sóc**, **Thành công**, và **Thất bại**.
   Mỗi hồ sơ sẽ có một hình thức cập nhật nghiệp vụ (gọi là loại giao dịch tái phí): **Khách cọc (Đặt cọc)**, **Hoàn tất (Gia hạn trọn gói)**, **Đóng full (Thanh toán đủ)**.
   Logic chuyển đổi tự động được định nghĩa chặt chẽ theo các phân vùng thời gian:

   *   **Trong quá khứ (Tháng T-1):**
       *   Học viên có thể có lịch sử 1 lần thành công, 1 lần thất bại trước đó nhưng vẫn được ghi nhận thêm đợt chăm sóc tái phí mới.
       *   Nếu phụ huynh chọn **Khách cọc**: Trạng thái chuyển sang **Thành công**, hệ thống tự động gia hạn thời gian hết phí dự kiến trên học vụ.
       *   Nếu phụ huynh chọn **Hoàn tất** hoặc **Đóng full**: Trạng thái chuyển sang **Thành công**, ghi nhận kết quả là **Vợt fail thành công** (giữ chân khách hàng đã suýt mất).

   *   **Trong hiện tại (Tháng T):**
       *   Mặc định khi bắt đầu chu kỳ hết phí, trạng thái là **Đang chăm sóc**.
       *   Khi hết tháng T (ngày cuối cùng của tháng qua đi) mà không phát sinh đóng phí, hệ thống tự động chuyển trạng thái sang **Thất bại**.
       *   Nếu phụ huynh chọn **Khách cọc**: Trạng thái chuyển sang **Thành công**, hệ thống tự động gia hạn thời gian hết phí.
       *   Nếu phụ huynh chọn **Hoàn tất** hoặc **Đóng full**: Trạng thái chuyển sang **Thành công**, ghi nhận kết quả là **Tái phí thành công**.

   *   **Trong tương lai (Tháng T+1 & T+2):**
       *   Mặc định trạng thái là **Đang chăm sóc**.
       *   Khi kết thúc tháng hiện tại (hết tháng T), trạng thái của học viên thuộc tháng tương lai **vẫn tiếp tục được giữ nguyên** là **Đang chăm sóc** để tư vấn tiếp, chưa chuyển sang thất bại.
       *   Nếu phụ huynh chọn **Khách cọc**: Trạng thái chuyển sang **Thành công**, hệ thống tự động gia hạn thời gian hết phí.
       *   Nếu phụ huynh chọn **Hoàn tất** hoặc **Đóng full**: Trạng thái chuyển sang **Thành công**, ghi nhận kết quả là **Chồng phí thành công** (ghi nhận doanh thu sớm).

3. **[RULE-RENEWAL-03] Đồng bộ thông tin vận hành:**
   Để nhân viên CSKH tái phí có cái nhìn toàn diện (360 độ), màn hình phải tích hợp đầy đủ các chỉ số vận hành giống như màn hình Theo dõi vận hành của học viên đó (Điểm chuyên cần trung bình, mức độ hoàn thành bài tập về nhà, điểm kiểm tra gần nhất, điểm trung bình thực tế, và thông tin giáo viên, lớp học đi kèm).

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ & Bộ lọc
| Thành phần | Loại hiển thị | Logic nghiệp vụ | Ghi chú |
|------------|---------------|-----------------|---------|
| Chọn Tháng đối tượng | Nhóm nút bấm tab (T-1, T, T+1, T+2) | Lọc học viên theo tháng hết phí | Giúp nhân viên phân loại nhóm đối tượng để gọi điện. |
| Chọn Chi nhánh | Hộp thả xuống | Giới hạn theo cơ sở học tập | Mặc định: tất cả chi nhánh. |
| Chọn Kết quả tái phí | Hộp thả xuống | Lọc theo Đang chăm sóc, Thành công, Thất bại | Theo dõi tiến độ phễu. |
| Tìm kiếm | Ô nhập văn bản | Tìm kiếm theo tên học viên, mã học viên, mã lớp | Icon tìm kiếm nằm bên phải, cạnh nút thao tác. |
| Nút Cập nhật dữ liệu | Nút bấm màu sắc | Giả lập đồng bộ thông tin đóng phí mới | Tự động kích hoạt logic chuyển đổi trạng thái. |

### 3.2. Bảng Tiến trình Tái phí
Bảng sử dụng mô hình dòng cha-con tương tự màn hình vận hành:
*   **Dòng cha (Học viên):** Chỉ hiển thị thông tin học viên kèm theo thống kê chỉ số trung bình (Chuyên cần, Bài tập, Điểm thi trung bình, trạng thái tái phí tổng quát và hành động cập nhật). Các cột dữ liệu lớp học chi tiết sẽ hiển thị dấu `-`.
*   **Dòng con (Lớp học chi tiết):** Hiển thị chi tiết từng lớp học (Station offline hoặc Tutor online) kèm theo mã lớp chồng dưới tên lớp học, giáo viên phụ trách (avatar), ngày bắt đầu học, ngày hết hạn gói học cụ thể, và trạng thái vận hành lớp học.

Các cột hiển thị chính của bảng:
1.  **Hộp kiểm:** Cho phép chọn hàng loạt học viên.
2.  **Học viên:** Thông tin học viên, đi kèm mã ID, mã khách hàng, và thông tin môn học - trình độ (không có tiêu đề "Trình độ") bên dưới.
3.  **Phụ trách:** Cột hiển thị danh sách dòng gồm ảnh đại diện và tên nhân sự phụ trách (CS hiển thị dòng trên với nhãn CS, GV hiển thị dòng dưới với nhãn GV, hỗ trợ nhiều GV).
4.  **Lớp học:** Tên lớp học xếp trên mã lớp.
5.  **Hạn hết phí:** Ngày hết hạn học phí của lớp (Rất quan trọng cho chiến dịch).
6.  **Trạng thái Tái phí:** Nhãn màu chuẩn thể hiện tiến độ (Đang chăm sóc, Thành công, Thất bại).
7.  **Kết quả hành động:** Mô tả chi tiết kết quả (Ví dụ: `Vợt fail thành công`, `Tái phí thành công`, `Chồng phí thành công`, `Gia hạn thời gian hết phí`).
8.  **Thống kê học tập:** Kết quả học vụ (Đi học, Bài tập về nhà, Điểm kiểm tra gần nhất). Hỗ trợ hiển thị biểu tượng cảnh báo màu đỏ dạng bong bóng bật lên chứa chi tiết vi phạm nếu học viên vi phạm ít nhất một trong các điều kiện cảnh báo chủ động (CSCĐ).
9.  **Tác nghiệp CSKH:** Tên nhân viên phụ trách và ghi chép trao đổi tái phí (sử dụng nhãn GV cho giáo viên và nhãn CS cho chăm sóc viên).
10. **Thao tác:** Nút ghi nhận tác vụ tái phí nhanh.

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
Giao diện được tổ chức thoáng đãng, loại bỏ các viền kẻ ngang thừa thãi và tiêu đề rườm rà.
*   **Phần trên cùng:** Bộ chọn phân vùng thời gian dạng tab nổi bật (Tháng T-1, Tháng T, Tháng T+1, Tháng T+2) kèm theo tổng số lượng học viên cần tái phí trong mỗi nhóm thời gian để nhân viên phân bổ lực lượng.
*   **Phần bộ lọc nâng cao:** Dàn hàng ngang một dòng gồm bộ lọc Chi nhánh, Trạng thái tái phí, Lớp học. Bên phải là ô tìm kiếm thu gọn và nút "Cập nhật dữ liệu".
*   **Khu vực bảng trung tâm:** Sử dụng bảng dạng bẻ nhánh (Accordion). Dòng cha có màu nền tươi sáng, dòng con có màu xám nhẹ có đường viền trái dày màu nhấn để dễ dàng phân biệt.

### 4.2. Luồng Hoạt động (Workflow)
1.  **Bước 1: Tiếp nhận danh sách.** Nhân viên CSM truy cập `/app/renewal`. Hệ thống tự động chọn tab "Tháng hiện tại (Tháng T)".
2.  **Bước 2: Phân tích thông tin.** Nhân viên bấm mở rộng thông tin học viên để xem tất cả các lớp học song song, đánh giá mức độ chuyên cần và điểm số kiểm tra để có phương án tư vấn phù hợp với phụ huynh.
3.  **Bước 3: Thực hiện cuộc gọi & Ghi nhận.** Nhân viên bấm nút "Tác nghiệp" trên dòng học viên. Hộp thoại nổi lên cho phép lựa chọn:
    *   Cập nhật trạng thái cuộc gọi.
    *   Chọn hành động tài chính: **Khách cọc**, **Hoàn tất**, **Đóng full**.
    *   Nhập nội dung trao đổi chi tiết (Ví dụ: "Mẹ hứa cuối tuần qua chi nhánh đóng phí").
4.  **Bước 4: Hệ thống tự động tính toán.** Ngay sau khi nhân viên lưu thông tin, hệ thống sẽ căn cứ vào thời gian hết phí của học viên (Quá khứ, Hiện tại hay Tương lai) kết hợp với hành động tài chính để tự động áp trạng thái (Thành công/Đang chăm sóc/Thất bại) và hiển thị chính xác kết quả đầu ra tương ứng trên bảng dữ liệu.

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú |
|---|----------------------------------|---------------------|---------|
| 5.1 | Học viên học nhiều lớp, hết phí rải rác ở cả tháng T và tháng T+1 | Hệ thống sẽ tạo 2 dòng theo dõi tái phí độc lập tương ứng với từng hạn hết phí của từng lớp, hoặc gộp chung dưới học viên nhưng phân tách rõ ràng dòng con để CSM xử lý cuốn chiếu. | Ưu tiên hiển thị lớp nào hết phí trước lên đầu |
| 5.2 | Phụ huynh đặt cọc nhiều lần | Mỗi lần ghi nhận cọc sẽ gia hạn thời gian hết phí tương ứng. Trạng thái tái phí luôn giữ là **Thành công** với kết quả **Gia hạn thời gian hết phí**. | |
| 5.3 | Quá hạn chăm sóc ở tháng T | Ngay khi bước sang ngày 1 của tháng T+1, toàn bộ các hồ sơ có hạn hết phí trong tháng T mà vẫn ở trạng thái **Đang chăm sóc** sẽ được công cụ tự động quét và chuyển sang **Thất bại** (Thất bại tự động). | |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

*   **AC-1 (Bố cục & Định dạng):** Giao diện hiển thị đúng chuẩn, không có tiêu đề thừa. Bộ lọc tab phân vùng thời gian (T-1, T, T+1, T+2) hoạt động chính xác, hiển thị số lượng hồ sơ cụ thể.
*   **AC-2 (Gộp cột Lớp học):** Tên lớp học và mã lớp học được gộp hiển thị trên cùng một cột ở dòng con bẻ nhánh (Tên lớp ở trên, mã lớp font mono ở dưới). Dòng cha hiển thị dấu `-`.
*   **AC-3 (Thống kê dòng cha):** Dòng cha chỉ hiển thị các thông tin tổng hợp tích lũy (Tổng số buổi còn lại, Điểm thi cao nhất, Điểm trung bình tổng, các thanh tiến trình chuyên cần và bài tập về nhà trung bình). Không liệt kê thông tin lớp học riêng lẻ trên dòng cha.
*   **AC-4 (Xử lý logic tự động):** Các quy tắc chuyển đổi trạng thái tự động tại mục 2 được lập trình chính xác trong lớp dữ liệu giả lập. Khi cập nhật trạng thái qua hộp thoại tác nghiệp, bảng cập nhật tức thì trạng thái và kết quả tương ứng.
*   **AC-5 (Độ sạch mã nguồn):** Không có lỗi biên dịch TypeScript, không có lỗi hay cảnh báo ESLint, và kích thước các tệp tin tuân thủ luật tối đa 800 dòng.
