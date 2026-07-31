# LỘ TRÌNH TRIỂN KHAI PHÂN KỲ PHÂN HỆ CHĂM SÓC HỌC VIÊN (CARE ROADMAP)

**Mã tài liệu:** RM-CARE-01  
**Thuộc phân hệ:** Chăm sóc học viên (CARE)  
**Tài liệu tham chiếu:** Quy trình quản lý chăm sóc học viên và phụ huynh (`QT-CSKH-01`)  
**Phiên bản:** 1.0  
**Trạng thái:** Dự thảo  

---

## 1. Mục đích và Bối cảnh

Tài liệu này xác định **Lộ trình triển khai phân kỳ 3 giai đoạn** cho Phân hệ Chăm sóc học viên (CARE). 

Bộ tài liệu nghiệp vụ hoàn chỉnh của CARE được thiết kế theo **tiêu chuẩn doanh nghiệp quy mô lớn (Enterprise Standard)** với 7 nhóm sự kiện, hơn 30 điều kiện chăm sóc, 6 trạng thái cảnh báo và các biểu mẫu phân công đa cấp. Tuy nhiên, việc áp dụng toàn bộ mô hình này ngay ở thời điểm ban đầu có thể gây ra áp lực vận hành lớn, làm tăng thời gian đào tạo nhân sự và dẫn đến nguy cơ nhân sự thực hiện đối phó hoặc bỏ sót quy trình.

Mục đích của lộ trình phân kỳ là:
1. **Rút ngắn thời gian đưa sản phẩm vào sử dụng thực tế:** Giúp hệ thống đi vào vận hành ngay trong thời gian ngắn nhất.
2. **Đơn giản hóa thao tác cho nhân sự:** Tập trung vào 20% nguyên nhân cốt lõi gây ra 80% rủi ro học viên dừng học.
3. **Hình thành thói quen vận hành:** Giúp Giáo viên và Nhân sự chăm sóc khách hàng quen thuộc với việc ghi nhận và theo dõi học viên trước khi nâng cấp lên các quy định nâng cao.
4. **Bảo đảm định hướng kiến trúc mở rộng:** Các giai đoạn sau nâng cấp dựa trên cùng một khung cấu trúc dữ liệu, không phải làm lại từ đầu.

---

## 2. Nguyên tắc Đơn giản hóa Giai đoạn Khởi đầu

Để bảo đảm tính tinh gọn trong giai đoạn đầu, các nguyên tắc điều chỉnh nghiệp vụ được áp dụng bao gồm:

* **Tập trung vào 5 rủi ro lớn nhất (Nguyên tắc Pareto):** Chỉ tự động hoặc thủ công theo dõi 5 trường hợp có nguy cơ ảnh hưởng trực tiếp đến kết quả học tập và việc tiếp tục sử dụng dịch vụ của học viên.
* **Gộp thành một danh sách công việc thống nhất:** Tạm thời gộp khái niệm *Cảnh báo* và *Yêu cầu chăm sóc* thành một danh sách công việc duy nhất để nhân sự dễ dàng theo dõi.
* **Tối giản hóa giao diện thao tác:** Thay vì sử dụng hai biểu mẫu phân công và ghi nhận riêng biệt, giai đoạn đầu sử dụng một bảng thông tin nổi (hộp thoại) tinh gọn để nhập kết quả nhanh chóng.
* **Cơ chế phân công trực tiếp:** Giao việc thẳng cho Giáo viên hoặc Nhân sự chăm sóc khách hàng phụ trách trực tiếp. Các vai trò quản lý chỉ tham gia khi có yêu cầu chuyển cấp khẩn cấp.

---

## 3. Chi tiết 3 Giai đoạn Triển khai

### 3.1. Giai đoạn 1 – Vận hành Tinh gọn (MVP: Tháng 1 đến Tháng 3)

#### 3.1.1. Phạm vi Danh mục Điều kiện Chăm sóc
Trong giai đoạn này, hệ thống và nhân sự chỉ áp dụng **5 điều kiện chăm sóc cốt lõi**:

| STT | Mã điều kiện | Nội dung điều kiện phát sinh | Vai trò thực hiện chính | Vai trò phối hợp | Hạn mục tiêu (SLA) | Mức độ ưu tiên |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: |
| **1** | **CC-01** | Học viên nghỉ học 2 buổi liên tiếp không rõ lý do | Nhân sự CSKH | Giáo viên | 24 giờ | Cao |
| **2** | **HT-01** | Kết quả bài kiểm tra/đánh giá dưới mức chuẩn quy định | Giáo viên | Quản lý chuyên môn | 48 giờ | Cao |
| **3** | **HT-02** | Không hoàn thành bài tập 2 buổi liên tiếp | Giáo viên | Nhân sự CSKH | 48 giờ | Trung bình |
| **4** | **DV-01** | Phụ huynh gửi phản ánh, khiếu nại hoặc yêu cầu hỗ trợ | Nhân sự CSKH | Các bộ phận liên quan | 24 giờ | Cao |
| **5** | **RR-01** | Phụ huynh trao đổi ý định bảo lưu, chuyển lớp hoặc dừng học | Nhân sự CSKH | Quản lý CSKH | 12 giờ | Khẩn cấp |

#### 3.1.2. Luồng xử lý và Trạng thái
Danh sách công việc được quản lý theo **3 trạng thái đơn giản**:
1. 🔴 **Mới (Cần chăm sóc):** Việc chăm sóc mới phát sinh, chưa thực hiện liên hệ.
2. 🟡 **Đang xử lý (Đang theo dõi / Hẹn lại):** Đã liên hệ nhưng phụ huynh bận, hẹn thời điểm khác hoặc đang chờ thông tin phối hợp.
3. 🟢 **Hoàn thành:** Đã trao đổi xong với phụ huynh, đạt được thống nhất và thông tin đã được ghi nhận.

#### 3.1.3. Thao tác trên Giao diện
* Người dùng thao tác trên **Bảng danh sách công việc chăm sóc**.
* Khi bấm thực hiện chăm sóc, hệ thống hiển thị một **Bảng thông tin nổi (Hộp thoại)** duy nhất gồm 4 trường dữ liệu chính:
  - *Kết quả liên hệ:* Chọn [Liên hệ thành công / Chưa nghe máy / Hẹn gọi lại].
  - *Tóm tắt nội dung trao đổi:* Nhập văn bản ngắn ghi nhận thông tin đã cung cấp.
  - *Ý kiến của phụ huynh:* Nhập văn bản ngắn ghi nhận nhu cầu/phản hồi của gia đình.
  - *Hành động tiếp theo:* Chọn [Hoàn thành / Hẹn lại / Chuyển quản lý xử lý].

---

### 3.2. Giai đoạn 2 – Chuẩn hóa & Tự động hóa (Tháng 4 đến Tháng 6)

#### 3.2.1. Tự động hóa Phát sinh Công việc
* Kích hoạt cơ chế tự động quét dữ liệu từ phân hệ **Điểm danh** và **Kết quả học tập**:
  - Tự động tạo công việc chăm sóc ngay khi hệ thống ghi nhận điểm danh báo nghỉ đủ 2 buổi.
  - Tự động tạo công việc chăm sóc cho Giáo viên ngay khi kết quả bài kiểm tra được nhập lên hệ thống dưới mức chuẩn.

#### 3.2.2. Mở rộng Danh mục Nghiệp vụ
* Đưa vào vận hành thêm **10 đến 15 điều kiện chăm sóc mở rộng**, bao gồm:
  - Học viên nộp bài tập trễ thường xuyên.
  - Học viên có tiến bộ rõ rệt (chăm sóc tích cực).
  - Chăm sóc định kỳ theo cột mốc khóa học (đầu khóa, giữa khóa, chuẩn bị kết thúc khóa).
  - Học viên đi học muộn nhiều lần trong tháng.

#### 3.2.3. Áp dụng Cơ chế Cộng dồn Nội dung
* Kích hoạt logic cộng dồn: Khi một học viên phát sinh điều kiện chăm sóc mới trong lúc đang có hồ sơ công việc mở, hệ thống tự động gộp nội dung mới vào hồ sơ hiện tại thay vì sinh công việc trùng lặp.
* Phân tách nhẹ giữa **Tình trạng theo dõi rủi ro của học viên** và **Nhật ký từng lần liên hệ**.

---

### 3.3. Giai đoạn 3 – Chuẩn hóa Enterprise Toàn diện (Từ Tháng 7 trở đi)

#### 3.3.1. Áp dụng Toàn bộ Bộ Quy trình Chuẩn
* Đưa vào vận hành đầy đủ **7 nhóm sự kiện** và **hơn 30 điều kiện chăm sóc** chi tiết theo đúng bộ tài liệu quy trình `QT-CSKH-01` và phụ lục `PL-CSKH-01`.
* Áp dụng đầy đủ **6 trạng thái vòng đời cảnh báo**: `Mới`, `Đang theo dõi`, `Đang can thiệp`, `Đã kiểm soát`, `Đã đóng`, `Không hợp lệ`.

#### 3.3.2. Vận hành Phân quyền và Chuyển cấp Đa tầng
* Áp dụng ma trận trách nhiệm đầy đủ giữa Giáo viên, Nhân sự CSKH, Quản lý chuyên môn, Quản lý CSKH và Bộ phận Vận hành lớp.
* Kích hoạt luồng chuyển cấp tự động khi công việc bị quá hạn SLA hoặc tình trạng cảnh báo chuyển sang mức độ nghiêm trọng.

#### 3.3.3. Báo cáo & Phân tích Nâng cao
* Triển khai hệ thống báo cáo đánh giá chất lượng chăm sóc:
  - *Chỉ số tỷ lệ tuân thủ hạn xử lý (SLA Compliance Rate).*
  - *Chỉ số tỷ lệ chuyển đổi cảnh báo từ rủi ro sang đã kiểm soát (Resolution Rate).*
  - *Báo cáo tỷ lệ giữ chân học viên và giảm tỷ lệ dừng học (Retention Rate).*
  - *Khảo sát mức độ hài lòng của phụ huynh sau chăm sóc (CSAT).*

---

## 4. Bảng So sánh Chi tiết Giữa Các Giai đoạn

| Tiêu chí so sánh | Giai đoạn 1 (MVP Tinh gọn) | Giai đoạn 2 (Chuẩn hóa) | Giai đoạn 3 (Enterprise chuẩn) |
| :--- | :--- | :--- | :--- |
| **Phạm vi điều kiện** | 5 điều kiện cốt lõi | 15 - 20 điều kiện mở rộng | 30+ điều kiện đầy đủ |
| **Cách phát sinh công việc** | Nhập thủ công + Điểm danh | 80% Tự động từ hệ thống | 100% Tự động theo quy tắc cấu hình |
| **Quản lý trạng thái** | 3 trạng thái cơ bản | 3 trạng thái + Phân loại rủi ro | 6 trạng thái vòng đời cảnh báo |
| **Giao diện thực hiện** | 1 Hộp thoại thông tin nổi tinh gọn | Hộp thoại nổi + Nhật ký lịch sử | Màn hình Quản lý Hồ sơ chuyên sâu |
| **Cơ chế gộp công việc** | Xử lý thủ công theo danh sách | Tự động cộng dồn theo học viên | Tự động cộng dồn + Phân luồng ưu tiên |
| **Thời hạn mục tiêu (SLA)** | 2 mức (24 giờ / 48 giờ) | 3 mức (12 giờ / 24 giờ / 48 giờ) | Đa dạng theo từng điều kiện chi tiết |
| **Báo cáo & Đo lường** | Báo cáo số lượng công việc đã xong | Báo cáo tỷ lệ hoàn thành đúng hạn | Báo cáo tổng thể CSAT, Retention, SLA |
| **Thời gian đào tạo nhân sự** | **Khoảng 30 phút** | **Khoảng 2 giờ** | **Đào tạo quy trình đầy đủ** |

---

## 5. Tiêu chí Chuyển giao Giữa các Giai đoạn

Việc chuyển từ giai đoạn này sang giai đoạn tiếp theo phải đáp ứng các điều kiện đầu vào sau:

### 5.1. Tiêu chí chuyển từ Giai đoạn 1 sang Giai đoạn 2
1. **Tỷ lệ tuân thủ ghi nhận:** Tối thiểu 90% các sự kiện nghỉ học 2 buổi và bài kiểm tra dưới chuẩn được tạo công việc và xử lý trên hệ thống.
2. **Tỷ lệ hoàn thành đúng hạn:** Đạt tối thiểu 85% công việc chăm sóc được xử lý trong thời hạn quy định.
3. **Độ thành thạo của nhân sự:** Giáo viên và Nhân sự CSKH sử dụng thành thạo giao diện thao tác mà không phát sinh lỗi dữ liệu.

### 5.2. Tiêu chí chuyển từ Giai đoạn 2 sang Giai đoạn 3
1. **Hệ thống tự động hóa vận hành ổn định:** Các quy tắc tự động quét dữ liệu chuyên cần và điểm số hoạt động chính xác 100%.
2. **Dữ liệu lịch sử đủ lớn:** Đã lưu trữ dữ liệu chăm sóc liên tục trong tối thiểu 3 tháng làm căn cứ phân tích xu hướng.
3. **Quy mô trung tâm mở rộng:** Số lượng học viên hoặc số lượng cơ sở tăng lên đòi hỏi phải áp dụng cơ chế phân quyền và chuyển cấp đa tầng.

---

## 6. Kết luận

Lộ trình triển khai phân kỳ 3 giai đoạn giúp phân hệ Chăm sóc học viên (CARE) đạt được sự hài hòa giữa **tính khả thi trong vận hành thực tế ban đầu** và **định hướng phát triển dài hạn**. 

Bằng cách bắt đầu từ mô hình MVP tinh gọn với 5 điều kiện cốt lõi và 3 trạng thái đơn giản, đơn vị có thể đưa hệ thống vào sử dụng ngay lập tức, giảm thiểu tối đa áp lực cho nhân sự, đồng thời tạo tiền đề vững chắc để nâng cấp lên chuẩn Enterprise toàn diện trong các giai đoạn tiếp theo.
