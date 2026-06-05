---
id: US-BT04
title: "Đánh giá English Assessment Path"
bf: BF-ENR-01
domain: CAP-ADM
status: draft
tags: [enrollment, booking-test, assessment, form]
---

# US-BT04: Đánh giá Năng lực Tiếng Anh (English Assessment Path)

> **Tham chiếu:** BF-ENR-01 · `[POLICY-DS-03]` · Giao diện Mẫu §4.4 (Biểu mẫu)

## 1. Yêu cầu Người dùng (User Story)

**Là một** Giáo viên hoặc Nhân viên Tư vấn,
**tôi muốn** nhập kết quả đánh giá phỏng vấn Nói trực tiếp của học sinh và gửi thông tin chấm điểm phỏng vấn để hệ thống tính toán kết quả cấp độ Nói,
**để** hệ thống cập nhật kết quả đánh giá Nói chính xác và đồng bộ hóa tức thì với hồ sơ học sinh trên hệ thống quản lý khách hàng.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập với tiến trình của các tài liệu khác.
> - [x] **N**egotiable — Chi tiết giao diện biểu mẫu và câu hỏi có thể thay đổi linh hoạt.
> - [x] **V**aluable — Cung cấp kết quả đánh giá thực tế và đề xuất lộ trình học phù hợp cho học sinh.
> - [x] **E**stimable — Nghiệp vụ rõ ràng, đủ thông tin để ước lượng thời gian triển khai.
> - [x] **S**mall — Hoàn thành trong một vòng phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu rõ ràng ở mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-ASSESS-01] Chỉ áp dụng cho Tiếng Anh:** Chức năng đánh giá chi tiết chỉ hiển thị và kích hoạt đối với các ca kiểm tra thuộc môn Tiếng Anh. Môn Toán hoàn toàn không áp dụng chức năng này.
2. **[RULE-ASSESS-02] Hai kênh đánh giá hoạt động độc lập:** Đánh giá Nghe-Đọc-Viết tự động từ thiết bị và đánh giá phỏng vấn Nói từ giáo viên hoạt động hoàn toàn độc lập với nhau, không bắt buộc phải thực hiện cùng lúc hay song song. Điểm số từ thiết bị khi hoàn thành sẽ tự động đồng bộ về hệ thống, không ảnh hưởng đến phần giáo viên đang nhập liệu và ngược lại.
3. **[RULE-ASSESS-03] Kế thừa công cụ tính toán từ máy chủ cũ:** Giao diện biểu mẫu không tự ý quyết định thuật toán tính điểm tổng hợp và Cấp độ Nói. Khi người dùng bấm lưu điểm, hệ thống sẽ chuyển toàn bộ điểm số phỏng vấn Nói, nhận xét định tính và danh sách điểm yếu xuống máy chủ để thực hiện tính toán. Máy chủ sẽ phản hồi kết quả (Tổng điểm số, Cấp độ Nói đề xuất) để hệ thống cập nhật hiển thị lên biểu mẫu đánh giá và chi tiết ca kiểm tra.
4. **[RULE-ASSESS-04] Giới hạn số lượng điểm yếu cần cải thiện:** Giáo viên chỉ được phép chọn tối đa 3 điểm yếu cần cải thiện cho học sinh từ danh sách quy định. Khi đã chọn đủ 3 điểm yếu, các lựa chọn khác chưa được tích sẽ tự động bị khóa (vô hiệu hóa) để ngăn chọn thêm. Khi bỏ tích chọn, các lựa chọn khác sẽ hoạt động bình thường.
5. **[RULE-ASSESS-05] Bảo toàn dữ liệu đã chấm:** Trường hợp giáo viên mở biểu mẫu đánh giá ra nhưng không tích chọn bất kỳ câu trả lời nào (tất cả để trống), khi bấm lưu, hệ thống sẽ giữ nguyên điểm phỏng vấn cũ của học sinh (nếu có) thay vì ghi đè bằng điểm rỗng hoặc điểm 0.
6. **[RULE-ASSESS-06] Khôi phục dữ liệu đã lưu:** Khi mở lại biểu mẫu đánh giá của một ca phỏng vấn đã được chấm điểm trước đó, giao diện phải hiển thị lại chính xác tất cả các điểm số, nhận xét và điểm yếu đã được lưu trên hệ thống để giáo viên có thể chỉnh sửa nếu cần.
7. **[RULE-ASSESS-07] Khóa cứng Cấp độ Nói đề xuất:** Cấp độ Nói đề xuất hiển thị trên biểu mẫu là thông tin tĩnh chỉ xem, được tính toán tự động dựa trên tổng điểm của 8 câu phỏng vấn Nói. Giáo viên không thể tự ý điều chỉnh cấp độ này trực tiếp trên biểu mẫu đánh giá.
8. **[RULE-ASSESS-08] Đồng bộ tức thì về hệ thống quản lý khách hàng:** Ngay sau khi giáo viên hoàn tất đánh giá và bấm lưu thành công, hệ thống sẽ tự động đồng bộ kết quả đánh giá Nói (điểm Nói, cấp độ Nói, nhận xét định tính và danh sách điểm yếu) về hồ sơ khách hàng trên hệ thống quản lý khách hàng để nhân viên tư vấn có thông tin chăm sóc phụ huynh.
9. **[RULE-ASSESS-09] Cho phép bỏ qua chấm điểm phỏng vấn Nói:** Trong trường hợp không thể phỏng vấn Nói trực tiếp (ví dụ học sinh quá rụt rè hoặc không hợp tác), giáo viên được phép nhấn nút **Bỏ qua** trên biểu mẫu. Khi đó, hệ thống sẽ đánh dấu ca phỏng vấn ở trạng thái bỏ qua, hiển thị dấu X xám cho các tiêu chí chưa chấm điểm, và cho phép bấm cập nhật mà không chặn lỗi thiếu tiêu chí.

### 2.1. Thông số & Định mức (Metrics & Thresholds)

- **[METRIC-01] Thời gian tối đa hoàn thành đánh giá:** Giáo viên cần hoàn thành việc chấm điểm phỏng vấn Nói trên hệ thống trong vòng 4 giờ kể từ thời điểm kết thúc ca phỏng vấn để đảm bảo tiến độ trả kết quả cho phụ huynh.
- **[METRIC-02] Giới hạn số lượng điểm yếu:** Chọn tối đa 3 điểm yếu cần cải thiện từ danh sách 8 điểm yếu chuẩn hóa.

---

## 3. Cấu trúc Các trường nhập liệu

**Bố cục:** Hộp thoại nổi ở giữa màn hình (Dialog). Header hộp thoại hiển thị thông tin học sinh và thông tin ca kiểm tra (chỉ xem). Thân hộp thoại bao gồm dòng thông báo trạng thái, khối tóm tắt kết quả (Điểm, Cấp độ Nói, nút Liên kết kết quả), bảng lưới chấm điểm Nói, khu vực nhận xét định tính, và khu vực tích chọn điểm yếu. Giao diện V1 loại bỏ hoàn toàn các tab phân chia và không hỗ trợ xem lại biểu mẫu lịch sử cũ.

### 3.1. Thông tin học viên và ca kiểm tra (Dialog Header - Chỉ xem)

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
| :--- | :--- | :--- | :--- | :--- |
| Ảnh đại diện | Hình ảnh dạng tròn | — | Ảnh học viên | Hiển thị chữ cái đầu của tên học viên bên trái header nếu không có ảnh. |
| Họ và tên | Chữ in đậm | — | Tên học viên | Hiển thị cỡ chữ trung bình nổi bật bên trái header. |
| Ngày sinh | Chữ thường | — | Ngày sinh | Định dạng YYYY-MM-DD hiển thị cạnh tên học viên. |
| Người đánh giá | Nhãn văn bản | — | Giáo viên chấm | Hiển thị tên giáo viên phụ trách ở góc trên bên phải header. |
| Thời gian test | Nhãn văn bản | — | Giờ test | Hiển thị thời gian diễn ra ca kiểm tra ở góc trên bên phải header. |

### 3.2. Khối tóm tắt kết quả (Thân hộp thoại - Phía trên bảng điểm)

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
| :--- | :--- | :--- | :--- | :--- |
| Dòng thông báo trạng thái | Khối văn bản cảnh báo | — | Thông báo | Hiển thị nhãn nền nhạt để báo trạng thái "chỉ xem" hoặc "đang chỉnh sửa". |
| Điểm | Văn bản cỡ lớn | — | Tổng điểm Nói | Định dạng `X.X / 8` hiển thị tích lũy điểm khi chấm. |
| Cấp độ nói | Chữ in đậm | — | Cấp độ nói đề xuất | Hiển thị xếp hạng Cấp độ Nói đề xuất (chỉ xem). |
| Mở kết quả / Bỏ qua | Nút hành động | — | Liên kết kết quả | Chế độ chỉ xem: hiển thị nút "Mở kết quả" mở link bài LWR trên iPad. Chế độ chỉnh sửa: hiển thị nút "Bỏ qua" / thông báo yêu cầu chấm đủ 8 tiêu chí. |

### 3.3. Bảng chấm điểm phỏng vấn Nói (Bảng lưới 9 cột x 4 hàng)

*Bảng lưới bao gồm cột nhãn Tiêu chí bên trái và 8 cột tiêu chí chấm điểm tương ứng được đánh số từ "1" đến "8".*

| Tên hàng | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
| :--- | :--- | :--- | :--- | :--- |
| Đã chọn | Dòng dấu kiểm chỉ đọc | — | Trạng thái tích chọn | Hiển thị dấu kiểm xanh dương cho các tiêu chí đã chấm điểm. |
| 0 điểm | 8 Nút tròn (Radio button) | Có | Điểm số bằng 0 | Click chọn để gán 0 điểm. Tích chọn sẽ tự động hủy chọn mức điểm khác. |
| 0.5 điểm | 8 Nút tròn (Radio button) | Có | Điểm số bằng 0.5 | Click chọn để gán 0.5 điểm (hiển thị chấm tròn màu cam khi được chọn). Tích chọn sẽ tự động hủy chọn mức điểm khác. |
| 1 điểm | 8 Nút tròn (Radio button) | Có | Điểm số bằng 1 | Click chọn để gán 1 điểm (hiển thị chấm tròn màu xanh lá khi được chọn). Tích chọn sẽ tự động hủy chọn mức điểm khác. |

### 3.4. Nhận xét định tính của Giáo viên (7 tiêu chí hành vi)

| Câu hỏi hành vi | Loại hiển thị | Bắt buộc | Lựa chọn tích cực | Lựa chọn tiêu cực |
| :--- | :--- | :--- | :--- | :--- |
| 1. Học sinh trả lời câu hỏi của giáo viên theo cách: | Nhóm 2 nút bấm lựa chọn nằm ngang | Không | Tự tin trong giao tiếp | Thiếu tự tin, ngại nói |
| 2. Sử dụng từ vựng: | Nhóm 2 nút bấm lựa chọn nằm ngang | Không | Sử dụng từ vựng chính xác, phù hợp | Bỏ sót từ khóa quan trọng |
| 3. Cấu trúc câu: | Nhóm 2 nút bấm lựa chọn nằm ngang | Không | Nói thành câu đầy đủ, rõ ràng, mạch lạc | Chỉ nói từ đơn lẻ |
| 4. Ngữ âm và trọng âm: | Nhóm 2 nút bấm lựa chọn nằm ngang | Không | Ngữ điệu tự nhiên, trọng âm đúng | Ngữ điệu và trọng âm sai |
| 5. Độ lưu loát: | Nhóm 2 nút bấm lựa chọn nằm ngang | Không | Nói lưu loát, phản xạ nhanh | Ngập ngừng, phản xạ chậm |
| 6. Diễn đạt ý tưởng: | Nhóm 2 nút bấm lựa chọn nằm ngang | Không | Có khả năng diễn đạt ý tưởng bằng tiếng Anh | Pha lẫn tiếng Anh và tiếng Việt |
| 7. Nhận diện từ: | Nhóm 2 nút bấm lựa chọn nằm ngang | Không | Đánh vần và nhận diện từ tốt | Nhận diện từ kém |

### 3.5. Điểm yếu cần cải thiện (Highlight weaknesses)

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
| :--- | :--- | :--- | :--- | :--- |
| Bộ đếm số lượng | Khối văn bản chỉ đọc | — | Số lượng đã chọn | Hiển thị thông số dạng `Đã chọn {Số}/3`. |
| Danh sách điểm yếu | 8 Hộp kiểm tích chọn (Checkbox) | Không | Danh sách điểm yếu | Chọn tối đa 3 điểm yếu từ danh sách: *Thiếu tự tin, ngại nói*, *Bỏ sót từ khóa quan trọng*, *Chỉ nói từ đơn lẻ*, *Phát âm sai, thiếu âm cuối*, *Ngữ điệu và trọng âm sai*, *Ngập ngừng, phản xạ chậm*, *Pha lẫn tiếng Anh và tiếng Việt*, *Nhận diện từ kém*. |

### 3.6. Ví dụ Dữ liệu mẫu

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
| :--- | :--- | :--- |
| Chấm điểm và lưu kết quả | Giáo viên: "Nguyễn Văn B", 8 tiêu chí phỏng vấn Nói: `[1, 0.5, 1, 0.5, 0.5, 1, 0, 0]`, Nhận xét 1: `Tự tin trong giao tiếp`, Điểm yếu: `[Thiếu tự tin, ngại nói]` | Hệ thống chuyển dữ liệu xuống máy chủ xử lý thành công. Máy chủ phản hồi cấp độ Nói là "Tự tin giao tiếp" và tổng điểm "4.5/8". Giáo viên bấm Cập nhật để lưu kết quả. |
| Giới hạn điểm yếu | Chọn các điểm yếu số 1, số 2, số 3 | Bộ đếm hiển thị `Đã chọn 3/3`, các hộp kiểm còn lại (4 đến 8) hiển thị ở trạng thái mờ và chặn không cho tích chọn. |
| Bỏ trống biểu mẫu | Mở biểu mẫu mới, không chọn bất kỳ trường thông tin nào và bấm cập nhật | Áp dụng [RULE-ASSESS-05], hệ thống không cập nhật dữ liệu trống lên máy chủ và giữ nguyên điểm phỏng vấn cũ của học sinh. |
| Giáo viên nhấn Bỏ qua đánh giá Nói | Biểu mẫu chưa được chấm điểm. Giáo viên bấm nút "Bỏ qua" trên summary card. | Các ô chấm điểm Nói chưa chọn hiển thị dấu X xám, cho phép bấm Cập nhật để lưu mà không báo lỗi. |

### 3.7. Nút hành động

- **Đóng / Hủy:** Nút viền nhạt (Đóng ở chế độ chỉ xem, Hủy ở chế độ sửa). Đóng hộp thoại nổi và không lưu trữ thông tin.
- **Chỉnh sửa đánh giá / Lưu cập nhật:** Nút màu nhấn nổi bật (màu xanh dương kèm bút chì khi ở chế độ xem, Lưu cập nhật khi ở chế độ sửa). Bấm Chỉnh sửa đánh giá để mở khóa sửa; bấm Lưu cập nhật để gửi thông tin và đóng hộp thoại.

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình

- **Giao diện Hộp thoại Đánh giá:** Hiển thị dưới dạng một hộp thoại nổi lớn ở trung tâm màn hình.
- **Header Hộp thoại:** Phía bên trái hiển thị tên học sinh, ngày sinh và ảnh đại diện tròn. Phía bên phải hiển thị "Người đánh giá" (ví dụ: `Sarah J.`) và "Thời gian test" (ví dụ: `2026-05-21 10:00`) dạng chữ nhỏ chỉ xem, bên cạnh nút đóng `X`.
- **Dòng thông báo trạng thái:** Dưới header, hiển thị dải thông báo nền xám nhạt/viền mờ cho biết trạng thái "Kết quả hiện ở chế độ chỉ xem. Bấm Chỉnh sửa đánh giá để cập nhật lại." hoặc thông báo chỉnh sửa.
- **Khối tóm tắt kết quả (Summary Card):** Hiển thị Điểm số dạng chữ đậm lớn (ví dụ: `7.5 / 8`), Cấp độ nói (ví dụ: `Nâng cao`). Phía bên phải là nút "Mở kết quả" màu xanh dương có biểu tượng liên kết ngoài (nếu đang ở chế độ xem) hoặc nút "Bỏ qua" (nếu đang ở chế độ sửa).
- **Bảng lưới chấm điểm Nói:**
  - Cột tiêu đề hiển thị nhãn "Tiêu chí" và 8 tiêu chí đánh giá dạng cột từ 1 đến 8.
  - Dòng thứ nhất "Đã chọn" hiển thị các dấu tích check màu xanh dương chỉ đọc.
  - Ba dòng tiếp theo tương ứng với các nút tròn (Radio button) cho các mức điểm sắp xếp theo thứ tự từ trên xuống dưới: `0 điểm`, `0.5 điểm`, và `1 điểm`. Nút được chọn sẽ hiển thị chấm tròn màu xanh lá (cho mức 1 điểm) hoặc màu cam (cho mức 0.5 điểm).
- **Khu vực nhận xét định tính:**
  - Hiển thị tiêu đề "Nhận xét của giáo viên". Bên dưới gồm 7 dòng câu hỏi hành vi.
  - Mỗi dòng hiển thị câu hỏi hành vi bên trái và nhóm 2 nút bấm chữ nhật bên phải đại diện cho lựa chọn tích cực và lựa chọn tiêu cực đối lập. Nút được chọn hiển thị nền màu primary nhạt và chữ màu primary đậm.
- **Khu vực điểm yếu:**
  - Hiển thị tiêu đề "Điểm yếu cần lưu ý" kèm bộ đếm số lượng.
  - Bên dưới hiển thị danh sách 8 hộp kiểm xếp dọc để giáo viên click chọn nhanh điểm yếu.
- **Thanh nút hành động:** Nằm ở góc dưới cùng bên phải của hộp thoại, gồm nút "Đóng" (hoặc "Hủy") viền nhạt và nút "Chỉnh sửa đánh giá" (hoặc "Lưu cập nhật") màu xanh dương nổi bật.

### 4.2. Luồng Hoạt động (Workflow)

#### Luồng 1: Chấm điểm phỏng vấn Nói và lưu kết quả
1. Giáo vụ hoặc Giáo viên bấm nút **Mở đánh giá** trên dòng ca kiểm tra (hoặc tại màn hình chi tiết ca kiểm tra) của môn Tiếng Anh có trạng thái **Đang đánh giá**.
2. Hộp thoại Đánh giá năng lực mở ra, tự động hiển thị thông tin học viên và Đề kiểm tra đã được CRM liên kết từ trước ở chế độ sửa. Giao diện hiển thị trực tiếp biểu mẫu đánh giá V1 mà không có tab phân chia.
3. Giáo viên thực hiện phỏng vấn học sinh và chấm điểm bằng cách chọn mức điểm (`0`, `0.5` hoặc `1`) tương ứng cho 8 cột tiêu chí trên bảng lưới. Khi click chọn, dấu check xanh dương sẽ hiển thị ở dòng "Đã chọn", đồng thời Tổng điểm Nói và Cấp độ Nói trên khối kết quả tổng hợp tự động cập nhật giá trị tạm thời. (Hoặc giáo viên có thể chọn nhấn nút **Bỏ qua** để chế độ chấm điểm chuyển sang dạng dấu X xám tự động).
4. Giáo viên chọn các nhận xét định tính (đối lập) bằng cách click vào các nút chữ nhật tương ứng, và tích chọn tối đa 3 điểm yếu cần cải thiện cho học sinh.
5. Giáo viên bấm nút **Cập nhật** để gửi dữ liệu chấm điểm phỏng vấn xuống máy chủ xử lý.
6. Hệ thống hiển thị hiệu ứng tải dữ liệu (quay vòng), máy chủ thực hiện đồng bộ và phản hồi kết quả đánh giá Nói (Cấp độ Nói và Tổng điểm Nói).
7. Hệ thống lưu kết quả đánh giá Nói cuối cùng vào hồ sơ ca kiểm tra, đồng bộ kết quả này về hệ thống quản lý khách hàng, hiển thị thông báo thành công màu xanh lá, đóng hộp thoại và tải lại danh sách ca kiểm tra trên màn hình chính.

#### Luồng 2: Xem kết quả và Chỉnh sửa lại kết quả phỏng vấn đã lưu
1. Giáo viên bấm nút **Mở đánh giá** của một ca kiểm tra đã được chấm điểm trước đó.
2. Hộp thoại Đánh giá mở ra ở chế độ **chỉ xem**. Hệ thống tự động tải và hiển thị chính xác toàn bộ điểm số phỏng vấn Nói (với các nút chọn điểm hiển thị chấm màu xanh lá/cam tĩnh), các nhận xét định tính, danh sách điểm yếu và Cấp độ Nói đã lưu. Dòng thông báo hiển thị "Kết quả hiện ở chế độ chỉ xem...".
3. Giáo viên bấm nút **Chỉnh sửa đánh giá** ở góc dưới cùng bên phải.
4. Hệ thống mở khóa chế độ sửa. Giáo viên thực hiện chỉnh sửa thông tin cần thiết trên biểu mẫu bằng cách tích chọn lại các nút tròn điểm số, nhận xét hoặc điểm yếu, hoặc bấm Bỏ qua, sau đó bấm nút **Lưu cập nhật**.
5. Hệ thống thực hiện gửi dữ liệu chỉnh sửa xuống máy chủ tính toán, nhận kết quả và đồng bộ lại với hệ thống quản lý khách hàng tương tự Luồng 1.

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
| :--- | :--- | :--- | :--- |
| 5.1 | Người dùng bấm mở đánh giá cho ca kiểm tra môn Toán | Giao diện ngăn chặn hành động này, hiển thị thông báo lỗi "Không hỗ trợ đánh giá Nói cho môn học này". | Chặn hiển thị |
| 5.2 | Lỗi kết nối hoặc hệ thống tính toán của máy chủ gặp sự cố | Giao diện hiển thị thông báo cảnh báo "Không thể kết nối máy chủ để tính toán điểm. Vui lòng thử lại sau". Biểu mẫu chấm điểm giữ nguyên thông tin hiện tại, không tự đóng để tránh mất công nhập liệu của giáo viên. | Giữ nguyên dữ liệu |
| 5.3 | Giáo viên lưu biểu mẫu khi chỉ chấm điểm một số câu hỏi Nói | Hệ thống gửi các câu đã chấm xuống máy chủ, các câu còn lại máy chủ tự động tính 0 điểm. | Chấp nhận chấm thiếu |
| 5.4 | Giáo viên lưu biểu mẫu hoàn toàn trống khi chưa chấm điểm | Áp dụng [RULE-ASSESS-05], hệ thống không cập nhật dữ liệu trống lên máy chủ và giữ nguyên kết quả phỏng vấn cũ của học sinh. | Chống ghi đè trống |
| 5.5 | Kết quả Nghe-Đọc-Viết (LWR) từ thiết bị tự động gửi về hệ thống trễ sau khi giáo viên đã hoàn thành phỏng vấn Nói | Điểm số Nghe-Đọc-Viết tự động đồng bộ bổ sung vào hồ sơ ca kiểm tra trên hệ thống và đồng bộ về hệ thống quản lý khách hàng. Hệ thống tự động gọi tính toán lại cấp độ mà không ảnh hưởng đến đánh giá của giáo viên. | Đồng bộ bất tuần tự |
| 5.6 | Đổi thời gian ca phỏng vấn đột xuất | Hệ thống cho phép cập nhật lại giờ phỏng vấn mà không làm mất điểm đánh giá cũ đã lưu trong hồ sơ ca kiểm tra. | |
| 5.7 | Bấm ra ngoài biểu mẫu khi đang nhập dở dữ liệu đánh giá | Ngăn chặn việc tự động đóng hộp thoại để tránh mất dữ liệu đang nhập dở. Người dùng bắt buộc phải bấm nút Hủy bỏ để xác nhận tắt. | Bảo vệ dữ liệu |
| 5.8 | Giáo viên click chọn chế độ Bỏ qua đánh giá Nói khi biểu mẫu đã có điểm trước đó | Hệ thống hỏi xác nhận việc xóa điểm phỏng vấn cũ, tích chọn các ô điểm về trống và hiển thị dấu X xám, cho phép cập nhật để lưu trạng thái bỏ qua. | Thay đổi chế độ đánh giá |
| 5.9 | Thiết bị ghi âm bị lỗi hoặc không được cấp quyền micro khi thực hiện phỏng vấn AI | Hệ thống hiển thị cảnh báo trên biểu mẫu: "Thiết bị ghi âm không hoạt động. Điểm số AI Speaking sẽ không khả dụng." và tự động ẩn phần điểm AI Speaking, chỉ giữ lại phần chấm điểm thủ công của Giáo viên. | Lỗi ghi âm AI |
| 5.10 | Thay đổi giáo viên chấm phỏng vấn ngay trong lúc giáo viên cũ đang mở biểu mẫu | Giáo viên cũ đang mở biểu mẫu đánh giá nhưng quản lý đã đổi giáo viên phụ trách trên hệ thống. Khi giáo viên cũ bấm Lưu, hệ thống hiển thị thông báo: "Ca phỏng vấn đã được gán cho giáo viên khác. Dữ liệu của bạn không được lưu." | Tranh chấp chấm điểm |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

- **AC-1 (Bố cục chuẩn biểu mẫu V1):** Biểu mẫu đánh giá hiển thị đúng bố cục thiết kế gồm 3 khu vực chính: Thông tin học viên (chỉ đọc) -> Cấu hình đánh giá -> Biểu mẫu chấm điểm & nhận xét (giao diện hiển thị trực tiếp biểu mẫu duy nhất, loại bỏ hoàn toàn cấu trúc phân chia tab hoặc xem lịch sử biểu mẫu cũ).
- **AC-2 (Tính toán tạm thời trên giao diện):** Khi giáo viên click chọn các mức điểm cho 8 tiêu chí phỏng vấn Nói, Tổng điểm và Cấp độ Nói tương ứng hiển thị trên khối tóm tắt kết quả phải tự động cập nhật giá trị tương ứng ngay lập tức.
- **AC-3 (Giới hạn điểm yếu):** Không cho phép giáo viên tích chọn quá 3 điểm yếu cần cải thiện. Bộ đếm số lượng điểm yếu phải hiển thị chính xác số mục đã chọn. Khi đã chọn đủ 3 mục, các mục còn lại phải bị vô hiệu hóa (khóa mờ).
- **AC-4 (Khóa Cấp độ Nói đề xuất):** Trường Cấp độ Nói trên biểu mẫu phải hiển thị ở trạng thái chỉ đọc (hoặc nhãn hiển thị tĩnh), không cho phép giáo viên chỉnh sửa trực tiếp trên biểu mẫu phỏng vấn Nói.
- **AC-5 (Kế thừa tính toán máy chủ):** Khi bấm nút Cập nhật/Lưu cập nhật, hệ thống gửi dữ liệu chấm điểm phỏng vấn Nói xuống máy chủ xử lý, nhận kết quả và lưu lại cấp độ đánh giá Nói cuối cùng.
- **AC-6 (Bảo toàn dữ liệu cũ):** Khi bấm lưu biểu mẫu trống hoàn toàn, hệ thống chặn gửi dữ liệu trống và giữ nguyên điểm phỏng vấn cũ của học sinh trong hồ sơ ca kiểm tra.
- **AC-7 (Chặn môn học không thuộc phạm vi):** Khi bấm nút đánh giá đối với các ca kiểm tra thuộc môn học không phải Tiếng Anh (ví dụ môn Toán), hệ thống chặn không cho mở biểu mẫu và báo lỗi không hỗ trợ.
- **AC-8 (Xử lý lỗi kết nối máy chủ):** Khi gửi dữ liệu gặp sự cố mạng hoặc máy chủ không phản hồi, hệ thống hiển thị thông báo lỗi, không đóng hộp thoại chấm điểm và giữ nguyên các thông tin đã điền để người dùng có thể gửi lại.
- **AC-9 (Thông tin đề kiểm tra từ CRM):** Biểu mẫu hiển thị thông tin đề kiểm tra/đường dẫn thiết bị đã được gán sẵn từ CRM dưới dạng tĩnh chỉ đọc (Mở kết quả), không hiển thị chức năng chọn đề kiểm tra cho giáo viên trên biểu mẫu ERP.
- **AC-10 (Chức năng Bỏ qua đánh giá Nói):** Khi giáo viên click chọn nút Bỏ qua, các tiêu chí chưa chấm điểm phải hiển thị dấu X màu xám chỉ đọc, và nút cập nhật không hiển thị cảnh báo yêu cầu chấm đủ 8 tiêu chí.