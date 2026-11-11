---
id: US-CAL-02-08
title: "Nâng cấp Hộp thoại Đánh giá cuối kỳ - Chuyển đổi ngôn ngữ Song ngữ Anh Việt"
bf: BF-CAL-02
domain: CAP-ADM
persona: "PERSONA-TEACHER, PERSONA-BRANCH-MANAGER, PERSONA-CSM"
sr: "SR-TEA-002"
status: ready
tags: [semester-evaluation, bilingual, english-switch, language-toggle, teacher-assessment]
---

# US-CAL-02-08: Nâng cấp Hộp thoại Đánh giá cuối kỳ - Chuyển đổi ngôn ngữ Song ngữ Anh Việt (Semester Evaluation - Bilingual Language Switcher)

> **Tham chiếu:** `BF-CAL-02` (Quản lý Lịch học trung tâm) · `BF-CLS-05` (Quản lý Lớp học & Chi tiết buổi học) · `US-CAL-02-06` (Chi tiết buổi học) · Tiêu chuẩn Thiết kế Giao diện §4.4 (Biểu mẫu & Hộp thoại tiêu chuẩn)  
> **Đường dẫn màn hình & Trạng thái liên quan:**  
> - `Lịch học trung tâm (/app/calendar_class_schedule)` -> Mở Hộp thoại Chi tiết buổi học -> Bấm nút `Đánh giá cuối kỳ` -> Mở Hộp thoại Đánh giá cuối kỳ  
> - `Danh sách lớp học (/app/classes)` -> Chi tiết lớp học -> Tab `Lịch trình` -> Mở Chi tiết buổi học -> Bấm nút `Đánh giá cuối kỳ`  
> - Chế độ hiển thị: `Dạng biểu mẫu (Form)` | `Dạng bảng tổng hợp (Table)`  
> - Tùy chọn ngôn ngữ: `Tiếng Việt (VN)` | `Tiếng Anh (EN)`  

---

## 1. NHẬT KÝ THAY ĐỔI & BỐI CẢNH (CHANGELOG & CONTEXT)

### Lịch sử cập nhật tài liệu (Changelog)

| Ngày cập nhật | Nội dung cập nhật | Lý do cập nhật |
|---|---|---|
| 11/11/2026 | Khởi tạo đặc tả yêu cầu nâng cấp Hộp thoại Đánh giá cuối kỳ học viên (Semester Evaluation): bổ sung khả năng song ngữ Tiếng Việt / Tiếng Anh cho toàn bộ 4 nhóm tiêu chí (Ý thức học tập, Kiến thức, Kỹ năng, Tương tác) phục vụ giáo viên nước ngoài và giáo viên bộ môn Tiếng Anh thao tác trực tiếp. | Phục vụ đội ngũ giáo viên bản ngữ và giáo viên nước ngoài chấm điểm, nhận xét và gửi phiếu đánh giá cuối khóa chính xác, tiện lợi mà không gặp rào cản ngôn ngữ. |
| 11/11/2026 | Chuẩn hóa cơ chế kế thừa ngôn ngữ 100% từ mục Cài đặt trên thanh điều hướng chính (Header) của hệ thống; không đặt nút chuyển đổi ngôn ngữ riêng lẻ trên thanh tiêu đề hộp thoại để giữ giao diện tinh gọn, đúng thiết kế mẫu. | Tối ưu hóa trải nghiệm người dùng, thống nhất một nguồn cấu hình ngôn ngữ duy nhất và giữ trọn vẹn bố cục thanh tiêu đề hộp thoại. |

### Ràng buộc nghiệp vụ toàn cục (Global Rules):

* **[RULE-SEVAL-01] Bảo toàn dữ liệu đánh giá độc lập với ngôn ngữ hiển thị:** Việc chuyển đổi giữa Tiếng Việt và Tiếng Anh chỉ thay đổi nhãn hiển thị, tiêu đề nhóm, gợi ý và nội dung lựa chọn trên giao diện; toàn bộ điểm số đánh giá (1-5 sao) và mã trạng thái lựa chọn được lưu trữ đồng nhất trong hệ thống.
* **[RULE-SEVAL-02] Giữ nguyên dữ liệu văn bản đã nhập khi đổi ngôn ngữ:** Khi giáo viên đang nhập dở nội dung tự luận vào các ô văn bản (Từ vựng, Ngữ pháp) mà thực hiện chuyển đổi ngôn ngữ hiển thị, nội dung văn bản đã nhập không bị xóa hoặc làm mới.
* **[RULE-SEVAL-03] Đồng bộ ngôn ngữ giữa hai chế độ xem Biểu mẫu và Bảng:** Khi hệ thống áp dụng Tiếng Anh, cả hai chế độ Biểu mẫu và Bảng tổng hợp đều hiển thị đồng nhất các tiêu đề, cột thông tin và nhãn theo Tiếng Anh.
* **[RULE-SEVAL-04] Kế thừa tập trung ngôn ngữ từ thanh điều hướng chính:** Giao diện hộp thoại không bố trí nút chuyển đổi ngôn ngữ riêng lẻ. Toàn bộ ngôn ngữ hiển thị của hộp thoại tự động kế thừa và phản hồi theo tùy chọn ngôn ngữ tại mục Cài đặt trên thanh điều hướng chính của hệ thống.
* **[RULE-SEVAL-05] Duy trì cấu trúc dữ liệu nguyên bản:** Nghiệp vụ chỉ chuyển đổi hiển thị lớp vỏ ngôn ngữ theo từ điển chuẩn; không thay đổi cấu trúc lưu trữ và không yêu cầu tạo thêm trường riêng biệt trong hệ thống dữ liệu.

### Bối cảnh & Vấn đề nghiệp vụ (Context & Problem Statement)

Tại các trung tâm đào tạo của hệ thống, các lớp Tiếng Anh thường xuyên có sự tham gia giảng dạy và đánh giá của giáo viên nước ngoài (Foreign Teachers). Trong các buổi kiểm tra và tổng kết cuối kỳ (Semester Evaluation), giáo viên trực tiếp chấm điểm 4 kỹ năng (Nghe, Nói, Đọc, Viết), đánh giá ý thức học tập và tương tác của học sinh. Trước đây, giao diện đánh giá chỉ hiển thị hoàn toàn bằng Tiếng Việt, gây khó khăn lớn cho giáo viên nước ngoài trong việc đọc hiểu các tiêu chí chi tiết và chọn đúng đánh giá, dẫn đến việc quản lý cơ sở phải tốn nhân sự hỗ trợ dịch thuật thủ công. Do đó, việc trang bị bộ chuyển đổi song ngữ linh hoạt (VN/EN) ngay trên giao diện hộp thoại đánh giá là yêu cầu cấp thiết.

---

## 2. MÔ TẢ GIAO DIỆN

### Giao diện tham chiếu: [Màn hình Lịch học trung tâm - Hộp thoại Đánh giá cuối kỳ](http://localhost:3001/app/calendar_class_schedule)

### 2.1 Thanh tiêu đề Hộp thoại Đánh giá cuối kỳ - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Tiêu đề hộp thoại** | Dòng văn bản chính | Tiếng Việt: `Semester Evaluation / Đánh giá cuối kỳ` · Tiếng Anh: `Semester Evaluation` | Hiển thị tên nghiệp vụ đánh giá cuối kỳ tương ứng theo cấu hình ngôn ngữ lựa chọn từ mục Cài đặt trên thanh điều hướng chính. | **Điều chỉnh:** Chuyển đổi linh hoạt tên tiêu đề theo ngôn ngữ hệ thống đang chọn. |
| **Nhãn buổi kiểm tra liên kết** | Dòng văn bản phụ | Tiếng Việt: `Buổi kiểm tra: [Tên buổi]` · Tiếng Anh: `Assessment Session: [Tên buổi]` | Hiển thị chủ đề buổi học kiểm tra đi kèm. | **Điều chỉnh:** Chuyển đổi nhãn tiền tố theo ngôn ngữ đã chọn. |
| **Hộp kiểm xem tất cả học viên** | Hộp kiểm kèm nhãn văn bản | Tiếng Việt: `Xem tất cả học viên đã đến` · Tiếng Anh: `View all attended` | Cho phép lọc mở rộng toàn bộ học viên có mặt trong danh sách lớp. | **Điều chỉnh:** Hỗ trợ nhãn song ngữ tương ứng. |
| **Nút chuyển đổi chế độ xem** | Cặp nút bấm biểu tượng | Tiếng Việt: `Bảng` / `Biểu mẫu` · Tiếng Anh: `Table` / `Form` | Chuyển đổi qua lại giữa bảng tổng hợp điểm số cả lớp và biểu mẫu chi tiết từng học sinh. Giữ thanh tiêu đề tinh gọn theo đúng thiết kế mẫu. | **Điều chỉnh:** Hiển thị nhãn nút theo ngôn ngữ đang chọn. |

### 2.2 Danh sách học viên và Khung biểu mẫu đánh giá - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Tiêu đề cột danh sách học sinh** | Nhãn văn bản in hoa kèm số lượng | Tiếng Việt: `HỌC SINH (Sĩ số)` · Tiếng Anh: `STUDENTS (Sĩ số)` | Cột bên trái liệt kê danh sách học viên trong ca học kèm trạng thái hoàn thành đánh giá. | **Điều chỉnh:** Hiển thị nhãn danh sách theo ngôn ngữ đang chọn. |
| **Khung tiêu đề nhận xét học viên** | Dòng văn bản tiêu đề | Tiếng Việt: `Nhận xét cho học viên: [Tên]` · Tiếng Anh: `Evaluation for student: [Tên]` | Hiển thị họ tên học viên đang được chọn và mã số học viên. | **Điều chỉnh:** Bản dịch tiếng Anh chuẩn cho tiêu đề khung đánh giá. |
| **Huy hiệu hoàn thành đánh giá** | Huy hiệu trạng thái màu xanh lá | Tiếng Việt: `Đã hoàn thành đánh giá` · Tiếng Anh: `Evaluation completed` | Xuất hiện khi học viên đã được lưu kết quả đánh giá cuối kỳ. | **Điều chỉnh:** Bản dịch tiếng Anh chuẩn cho huy hiệu trạng thái. |
| **Nút lưu cập nhật** | Nút bấm thao tác chính | Tiếng Việt: `Cập Nhật` · Tiếng Anh: `Update` | Lưu lại toàn bộ điểm số và nội dung nhận xét của học viên đang chọn vào hệ thống. | **Điều chỉnh:** Nhãn nút bấm thao tác song ngữ. |
| **Thông báo kết quả thành công** | Dòng thông báo nổi góc màn hình | Tiếng Việt: `Đã cập nhật đánh giá cuối kỳ cho [Tên]` · Tiếng Anh: `Evaluation updated for [Tên]` | Hiển thị thông báo sau khi hệ thống lưu dữ liệu thành công. | **Điều chỉnh:** Thông báo phản hồi song ngữ chuẩn xác. |

### 2.3 Từ điển chuẩn hóa nội dung tiêu chí đánh giá song ngữ

| Nhóm tiêu chí | Tiếng Việt | Tiếng Anh chuẩn sư phạm | Quy cách hiển thị | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Nhóm 1: Ý thức học tập** | `Ý thức học tập` | `Attitude & Discipline` | Thanh tiêu đề nhóm kèm điểm đánh giá 1 đến 5 | **Bổ sung:** Bản dịch tiếng Anh chuẩn sư phạm cho toàn bộ nhóm tiêu chí. |
| Chuyên cần | Đi học đầy đủ / Chưa đi học đầy đủ | Regular attendance / Irregular attendance | Hai nút chọn hình tròn một lựa chọn | **Bổ sung:** Bản dịch song ngữ cho tiêu chí chuyên cần. |
| Đúng giờ | Đi học đúng giờ / Vẫn còn đi học muộn | Punctual & on time / Frequently late to class | Hai nút chọn hình tròn một lựa chọn | **Bổ sung:** Bản dịch song ngữ cho tiêu chí đúng giờ. |
| Bài tập về nhà | Hoàn thành đầy đủ BTVN / Chưa hoàn thành đầy đủ BTVN | Homework fully completed / Incomplete homework | Hai nút chọn hình tròn một lựa chọn | **Bổ sung:** Bản dịch song ngữ cho tiêu chí bài tập. |
| Mức độ tập trung | Tập trung trong lớp học / Có lúc chưa tập trung trong lớp học | Focused & attentive in class / Occasionally distracted | Hai nút chọn hình tròn một lựa chọn | **Bổ sung:** Bản dịch song ngữ cho tiêu chí tập trung. |
| Tinh thần học tập | Sôi nổi, hào hứng trong buổi học / Cần được động viên, khích lệ thường xuyên | Enthusiastic & proactive / Needs regular encouragement | Hai nút chọn hình tròn một lựa chọn | **Bổ sung:** Bản dịch song ngữ cho tiêu chí tinh thần học tập. |
| **Nhóm 2: Kiến thức** | `Kiến thức` | `Knowledge & Comprehension` | Thanh tiêu đề nhóm kèm điểm đánh giá 1 đến 5 | **Bổ sung:** Bản dịch tiếng Anh chuẩn sư phạm cho nhóm kiến thức. |
| Đánh giá vốn từ vựng | Vốn từ vựng: Phong phú / Cơ bản / Cần trau dồi | Vocabulary Range: Rich & varied / Basic range / Needs improvement | Ba nút chọn phân loại mức độ | **Bổ sung:** Bản dịch song ngữ cho mức độ từ vựng. |
| Ô nhập từ vựng | Từ vựng con nhớ & dùng linh hoạt / Từ vựng con chưa ghi nhớ | Mastered & flexible vocabulary / Words needing revision | Hai ô nhập văn bản nhiều dòng kèm dòng gợi ý | **Bổ sung:** Bản dịch nhãn và dòng gợi ý ô nhập từ vựng. |
| Đánh giá ngữ pháp | Vốn ngữ pháp: Thành thạo / Cơ bản / Cần trau dồi | Grammar Mastery: Proficient usage / Basic grasp / Needs reinforcement | Ba nút chọn phân loại mức độ | **Bổ sung:** Bản dịch song ngữ cho mức độ ngữ pháp. |
| Ô nhập ngữ pháp | Ngữ pháp đã thành thạo / Ngữ pháp chưa thành thạo | Mastered grammatical structures / Grammar needing practice | Hai ô nhập văn bản nhiều dòng kèm dòng gợi ý | **Bổ sung:** Bản dịch nhãn và dòng gợi ý ô nhập ngữ pháp. |
| **Nhóm 3: Kỹ năng ngôn ngữ** | `Kỹ năng` | `Language Skills` | Thanh tiêu đề nhóm kèm điểm đánh giá 1 đến 5 | **Bổ sung:** Bản dịch tiếng Anh chuẩn sư phạm cho nhóm 4 kỹ năng. |
| Kỹ năng nghe | Kỹ năng nghe (Phản xạ nghe hiểu & Luyện tập các dạng bài) | Listening Comprehension (Comprehension reflexes & Task practice) | Bốn lựa chọn phân theo cặp tiêu chí | **Bổ sung:** Bản dịch song ngữ cho kỹ năng nghe. |
| Kỹ năng nói | Kỹ năng nói (Âm lượng giọng, Phát âm âm cuối, Độ trôi chảy) | Speaking & Pronunciation (Voice volume, Ending sounds, Fluency) | Sáu lựa chọn phân theo cặp tiêu chí | **Bổ sung:** Bản dịch song ngữ cho kỹ năng nói. |
| Kỹ năng đọc | Kỹ năng đọc (Đọc hiểu yêu cầu đề bài, Nắm bắt ý chính & chi tiết) | Reading Comprehension (Task comprehension, Main ideas & details) | Bốn lựa chọn phân theo cặp tiêu chí | **Bổ sung:** Bản dịch song ngữ cho kỹ năng đọc. |
| Kỹ năng viết | Kỹ năng viết (Chính tả, Vốn từ, Mạch lạc diễn đạt, Cấu trúc câu) | Writing Skills (Spelling, Word choice, Coherence, Grammar & syntax) | Tám lựa chọn phân theo cặp tiêu chí | **Bổ sung:** Bản dịch song ngữ cho kỹ năng viết. |
| **Nhóm 4: Tương tác lớp học** | `Tương tác` | `Classroom Interaction` | Thanh tiêu đề nhóm kèm điểm đánh giá 1 đến 5 | **Bổ sung:** Bản dịch tiếng Anh chuẩn sư phạm cho nhóm tương tác. |
| Hoạt động lớp | Tích cực tham gia các hoạt động / Ít tham gia các hoạt động | Actively participates in activities / Rarely joins class activities | Hai nút chọn hình tròn một lựa chọn | **Bổ sung:** Bản dịch song ngữ cho hoạt động lớp. |
| Nghe giảng | Chăm chú nghe giảng / Chưa chăm chú nghe giảng | Attentive and respectful listener / Lacks focus during explanation | Hai nút chọn hình tròn một lựa chọn | **Bổ sung:** Bản dịch song ngữ cho mức độ nghe giảng. |
| Phát biểu xây dựng bài | Hăng hái giơ tay phát biểu / Ít tương tác, chưa chủ động phát biểu | Eagerly volunteers to answer / Passive, rarely speaks | Hai nút chọn hình tròn một lựa chọn | **Bổ sung:** Bản dịch song ngữ cho tiêu chí phát biểu. |

---

## 3. KHỐI CHỨC NĂNG CHI TIẾT: ACTION & LUỒNG KÍCH HOẠT (ACTIONS & EVENTS)

### Khối chức năng 1: Kế thừa và hiển thị ngôn ngữ theo cài đặt trên thanh điều hướng chính

#### Action 1.1: Kế thừa giao diện Tiếng Anh từ thanh điều hướng chính (Inherit English Interface)
* **Luồng kích hoạt:** Người dùng đã thiết lập ngôn ngữ Tiếng Anh tại biểu tượng Cài đặt trên thanh điều hướng chính và mở Hộp thoại Đánh giá cuối kỳ.
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC-1 (Happy Path - Hiển thị giao diện Tiếng Anh):**
    - **Giả sử:** Cấu hình ngôn ngữ tại mục Cài đặt trên thanh điều hướng chính đang là English.
    - **Khi:** Giáo viên nhấn mở Hộp thoại Đánh giá cuối kỳ từ màn hình Lịch học hoặc Chi tiết lớp học.
    - **Thì:** Hộp thoại tự động hiển thị hoàn toàn bằng Tiếng Anh (tiêu đề hộp thoại, tiêu đề các nhóm tiêu chí, các nhãn lựa chọn, văn bản gợi ý trong ô nhập và nút bấm); không hiển thị nút chọn ngôn ngữ dư thừa trên thanh tiêu đề hộp thoại; dữ liệu điểm số và đánh giá của học viên được hiển thị chính xác.
  - **AC-2 (Happy Path - Cập nhật tức thì khi đổi ngôn ngữ trên thanh điều hướng chính):**
    - **Giả sử:** Hộp thoại Đánh giá cuối kỳ đang mở trên màn hình.
    - **Khi:** Người dùng nhấn vào biểu tượng Cài đặt trên thanh điều hướng chính và chuyển đổi giữa Tiếng Việt và Tiếng Anh.
    - **Thì:** Giao diện hộp thoại tự động cập nhật ngôn ngữ hiển thị tương ứng ngay lập tức; toàn bộ các lựa chọn đã đánh dấu và dữ liệu đang nhập dở trong các ô văn bản được bảo toàn nguyên vẹn.

---

### Khối chức năng 2: Chuyển đổi chế độ hiển thị Bảng và Biểu mẫu khi đang áp dụng Tiếng Anh

#### Action 2.1: Xem Bảng tổng hợp đánh giá theo Tiếng Anh
* **Luồng kích hoạt:** Hệ thống đang ở ngôn ngữ Tiếng Anh và giáo viên nhấp nút chuyển chế độ xem `Table`.
* **Tiêu chí nghiệm thu:**
  - **AC-3 (Happy Path - Bảng tổng hợp hiển thị tiêu đề cột Tiếng Anh):**
    - **Giả sử:** Cấu hình ngôn ngữ trên hệ thống đang là Tiếng Anh (`EN`).
    - **Khi:** Giáo viên nhấp vào nút `Table` trên thanh tiêu đề hộp thoại.
    - **Thì:** Giao diện chuyển sang màn hình Bảng tổng hợp với các tiêu đề cột hiển thị bằng Tiếng Anh (`Student Name`, `Attitude / Conduct`, `Knowledge / Vocab & Grammar`, `4 Skills`, `Interaction`, `Action`); điểm số các cột hiển thị chính xác theo dữ liệu đã đánh giá.

---

### Khối chức năng 3: Lưu kết quả đánh giá ở chế độ Tiếng Anh

#### Action 3.1: Nhấp nút Update để lưu kết quả đánh giá
* **Luồng kích hoạt:** Giáo viên hoàn thành chọn các tiêu chí bằng giao diện Tiếng Anh và nhấp nút `Update`.
* **Tiêu chí nghiệm thu:**
  - **AC-4 (Happy Path - Lưu đánh giá thành công với thông báo Tiếng Anh):**
    - **Giả sử:** Giáo viên đã điền các tiêu chí cho học viên đang chọn ở giao diện Tiếng Anh.
    - **Khi:** Giáo viên nhấp vào nút `Update`.
    - **Thì:** Hệ thống ghi nhận kết quả đánh giá cho học viên vào cơ sở dữ liệu học tập; biểu tượng dấu tích xanh xuất hiện cạnh tên học viên ở danh sách bên trái; hiển thị thông báo thành công bằng Tiếng Anh: `Evaluation updated for [Tên học viên]`.

---

## 4. CÁC TRƯỜNG HỢP GÓC CẠNH (CORNER CASES)

- **Trường hợp 1 - Chuyển đổi ngôn ngữ khi đang gõ dở văn bản nhận xét:** Khi giáo viên đang nhập dở văn bản vào ô từ vựng hoặc ngữ pháp và chuyển đổi ngôn ngữ hiển thị trên thanh điều hướng chính, hệ thống bảo toàn 100% chuỗi ký tự giáo viên đã gõ trong ô nhập, chỉ thay đổi nhãn tiêu đề và dòng gợi ý mờ của ô nhập.
- **Trường hợp 2 - Tên học viên có cả tên Tiếng Anh và tên Tiếng Việt:** Bất kể đang ở chế độ ngôn ngữ Tiếng Việt hay Tiếng Anh, danh sách học viên luôn ưu tiên hiển thị song song Tên Tiếng Anh nổi bật phía trên (in đậm) và Tên Tiếng Việt phụ phía dưới (chữ nhỏ) để cả giáo viên nước ngoài và giáo viên Việt Nam đều dễ dàng đối chiếu.
- **Trường hợp 3 - Học viên vắng mặt hoặc chưa được đánh giá trong bảng tổng hợp:** Khi xem ở chế độ Bảng với ngôn ngữ Tiếng Anh, các học viên chưa được chấm điểm sẽ hiển thị dấu gạch ngang mờ `—` thay vì để trống hoặc báo lỗi, đảm bảo giao diện luôn liền mạch và thẩm mỹ.
- **Trường hợp 4 - Hạn chế quyền sửa đổi khi buổi học đã khóa hoặc hủy:** Nếu buổi học ở trạng thái đã hủy hoặc giáo viên không có thẩm quyền chỉnh sửa đánh giá, nút `Update` ở cả hai chế độ ngôn ngữ sẽ tự động chuyển sang trạng thái vô hiệu hóa (mờ đi) và không cho phép gửi dữ liệu lên hệ thống.
- **Trường hợp 5 - Duy trì ngôn ngữ khi chuyển đổi giữa các học viên:** Khi giáo viên chọn Tiếng Anh và chuyển từ học viên A sang học viên B trong danh sách bên trái, biểu mẫu của học viên B tiếp tục hiển thị bằng Tiếng Anh mà không bị nhảy ngược lại Tiếng Việt.
- **Trường hợp 6 - Đổi ngôn ngữ trên thanh điều hướng chính khi đang mở hộp thoại:** Nếu người dùng chuyển đổi ngôn ngữ tại biểu tượng Cài đặt trên thanh điều hướng chính của hệ thống, hộp thoại đánh giá cuối kỳ đang mở sẽ cập nhật ngay lập tức sang ngôn ngữ mới mà không làm mất dữ liệu học viên đang được chọn hay dữ liệu vừa nhập.
