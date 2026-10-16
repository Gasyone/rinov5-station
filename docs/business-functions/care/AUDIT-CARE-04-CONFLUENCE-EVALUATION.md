# BÁO CÁO ĐÁNH GIÁ & RÀ SOÁT TÀI LIỆU CONFLUENCE (ĐỢT 2)
## Thư mục: Care - Báo cáo tháng học viên (Folder ID: 158105703, Space: PS)

---

## 1. TỔNG QUAN & GHI NHẬN CẬP NHẬT MỚI

Báo cáo này được thực hiện sau đợt cập nhật của người dùng trên Confluence, theo nguyên tắc nghiệp vụ của dự án và chỉ đạo cụ thể:
> **Chỉ đạo:** "Check lại đi, đã cập nhật 1 số chỗ, Bỏ phi chức năng đi"

### 1.1. Các tài liệu trong phạm vi rà soát:
1. **`BF-CARE-04: Cơ chế Báo cáo Học tập Tháng & Kế hoạch Phát triển Học viên`** (Page ID: `158072955` - Version 18)
2. **`US-CARE-04-01: Chi tiết học tập: Section Báo cáo Tháng học viên`** (Page ID: `158302243` - Version 15)
3. **`US-CARE-04-02: Bảng nổi chi tiết Báo cáo tháng học viên`** (Page ID: `158105707` - Version 18)
4. **`US-CARE-04-03: Landing Page Báo cáo Tháng học viên`** (Page ID: `158105715` - Version 17)

### 1.2. Đánh giá các điểm người dùng đã xử lý rất tốt:
- **Đổi mã định danh toàn bộ sang `CARE-04`**: Tiêu đề trang của cả 4 tài liệu đã đổi từ `CARE-03` sang `CARE-04`, giải quyết triệt để xung đột mã với module `BF-CARE-03: Care Rule Engine` đã có trước đó trên Space `PS`.
- **Thống nhất tên nút Nạp khung chương trình**: Nút `[📖 Nạp bài học mẫu]` đã được đổi đồng nhất thành `[📖 Thêm bài]` trên toàn bộ Luồng nghiệp vụ, Bảng 4 và AC-05 của `US-CARE-04-02`.
- **Loại bỏ chức năng chưa phát triển**: Đã xóa `Nút Sao chép (Tính năng chưa phát triển)` khỏi Bảng 7 của `US-CARE-04-02`.
- **Chuẩn hóa nhãn và bảng biểu trên US-CARE-04-03**: Sửa lỗi gõ phím `goish học` $\rightarrow$ `gói học`, cập nhật control thành `Bộ chọn Gói học`, sửa tiêu đề Bảng 3.2 thành `Bảng mô tả Khung thẻ Hồ sơ chính`, và bổ sung bảng Lịch sử cập nhật (Changelog).
- **Lược bỏ hoàn toàn phần Phi chức năng**: Phần 6 (Yêu cầu phi chức năng) đã được gỡ bỏ khỏi toàn bộ các tài liệu, tập trung 100% vào logic nghiệp vụ và trải nghiệm giao diện người dùng theo phong cách tài liệu tinh gọn (Lean SRS).

---

## 2. BẢNG TỔNG HỢP CÁC XUNG ĐỘT & THIẾU SÓT CẦN HOÀN THIỆN

Dưới đây là chi tiết các điểm **Xung đột liên tài liệu (Cross-document conflicts)** và **Thiếu sót cục bộ (Omissions & Defects)** còn tồn đọng trong nội dung 4 trang Confluence:

```
+--------------------------------------------------------------------------------------------------------------------------+
| PHÂN LOẠI       | VỊ TRÍ PHÁT SINH                   | HIỆN TRẠNG TRÊN CONFLUENCE         | ĐỀ XUẤT CHUẨN HÓA                   |
+=================+====================================+====================================+====================================+
| Xung đột mã     | US-01, US-02, US-03: Mục "Tài liệu | Ghi: "Tài liệu cha: BF-CARE-03:    | Sửa thành: "Tài liệu cha:          |
| liên kết        | cha" (Dòng đầu trang)              | Cơ chế Báo cáo Học tập Tháng..."   | BF-CARE-04: Cơ chế Báo cáo..."     |
+-----------------+------------------------------------+------------------------------------+------------------------------------+
| Xung đột mã     | BF-04: Mục 4 (Phạm vi In Scope)    | Ghi: (US-CARE-03-01),              | Sửa thành: (US-CARE-04-01),        |
| liên kết        | Dòng 68, 69, 71                    | (US-CARE-03-02), (US-CARE-03-03)   | (US-CARE-04-02), (US-CARE-04-03)   |
+-----------------+------------------------------------+------------------------------------+------------------------------------+
| Thiếu sót bảng  | BF-04: Mục 5.2 (Bảng danh mục      | Bảng chỉ có 4 cột: Tên quyền,      | Bổ sung cột "Mã quyền":            |
| phân quyền      | quyền hạn nguyên tử)               | Loại quyền, Phạm vi, Diễn giải     | care.monthly_report.edit           |
+-----------------+------------------------------------+------------------------------------+------------------------------------+
| Câu cụt / Lửng  | BF-04: Mục 5.1 (Dòng 123)          | "Hệ thống lưu nội dung và chuyển   | Bổ sung: "chuyển cờ                |
|                 |                                    | cờ" [cụt]                          | is_auto_generated = false..."      |
+-----------------+------------------------------------+------------------------------------+------------------------------------+
| Câu cụt / Lửng  | US-01: REQ-01 (Bảng 1.2)           | "tổng số kỳ báo cáo thực tế ."     | Sửa thành: "tổng số kỳ báo cáo     |
|                 |                                    | [thiếu dấu > 0]                    | thực tế > 0."                      |
+-----------------+------------------------------------+------------------------------------+------------------------------------+
| Câu cụt / Lửng  | US-01: AC-02 (Dòng cuối)           | "Hiển thị Nút Chỉnh sửa nếu có     | Sửa thành: "Hiển thị Nút Chỉnh     |
|                 |                                    | quyền sửa," [dấu phẩy lửng]        | sửa nếu người dùng có quyền sửa."  |
+-----------------+------------------------------------+------------------------------------+------------------------------------+
| Lỗi tiêu đề     | US-01: AC-05 (Dòng 132)            | "### AC-05 (Navigation Path - ..." | Bổ sung dấu đóng ngoặc đơn: ")"    |
|                 |                                    | [thiếu dấu đóng ngoặc )]           |                                    |
+-----------------+------------------------------------+------------------------------------+------------------------------------+
| Tàn dư AI       | US-01: Mục 3.2 (Ma trận phân       | Ghi: "sử dụng tính năng AI Tổng    | Sửa thành: "nạp bài học từ Khung   |
| (Outdated text) | quyền năng lực)                    | hợp kế hoạch bài học..."           | chương trình và lưu thay đổi..."   |
+-----------------+------------------------------------+------------------------------------+------------------------------------+
| Ký tự thừa      | US-02: REQ-06 (Bảng 1.2)           | "...(tự ẩn nếu không có nội dung).n| Bỏ ký tự thừa ".n" ở cuối câu      |
+-----------------+------------------------------------+------------------------------------+------------------------------------+
| Câu cụt / Lửng  | US-02: AC-03 (Dòng 292)            | "Giả sử: Hộp thoại đang mở ở Chế   | Sửa thành: "...và kỳ báo cáo đã    |
|                 |                                    | độ Xem và kỳ báo cáo ." [cụt]      | được chọn hợp lệ."                 |
+-----------------+------------------------------------+------------------------------------+------------------------------------+
| Câu cụt / Lửng  | US-02: AC-10 (Dòng 401)            | "...trong suốt chu kỳ tháng:"      | Bỏ dấu hai chấm hoặc nối tiếp nội  |
|                 |                                    | [kết thúc bằng dấu : và bỏ trống]  | dung: "được tính trên cả 2 lớp."   |
+-----------------+------------------------------------+------------------------------------+------------------------------------+
| Lỗi chính tả    | US-02: Bảng 4 (Dòng 162)           | "mặc đinh: Chọn bài"               | Sửa thành: "mặc định: Chọn bài"    |
+-----------------+------------------------------------+------------------------------------+------------------------------------+
| Từ vựng kỹ thuật| US-02: Bảng 1 (Dòng 118)           | Dùng "Button", "mode/chế độ",      | Chuyển sang ngôn ngữ tự nhiên:     |
| & lỗi chính tả  |                                    | "chính sửa", "chuyển sáng chế độ"  | "Nút", "chế độ", "chuyển sang"     |
+-----------------+------------------------------------+------------------------------------+------------------------------------+
| Ô bảng bị trống | US-02: Bảng Edit Mode (Dòng 152)   | Mục A2.1 Chuyên môn: Cột "Nhãn     | Điền nhãn: "• Đánh giá chuyên môn  |
|                 |                                    | chỉ dẫn & Bullet màu sắc" bị trống | (theo môn học)"                    |
+-----------------+------------------------------------+------------------------------------+------------------------------------+
| Lỗi chính tả    | US-03: AC-05 (Dòng 210)            | "### AC-05: Mở tab Nhận xết..."    | Sửa thành: "### AC-05: Mở tab      |
|                 |                                    | [sai chính tả Nhận xết]            | Nhận xét..."                       |
+-----------------+------------------------------------+------------------------------------+------------------------------------+
| Thiếu số 0      | US-03: AC-09 (Dòng 260)            | "### AC-9: Bảo mật..."             | Sửa thành: "### AC-09: Bảo mật..." |
| định dạng chuẩn |                                    |                                    | (đồng bộ 2 chữ số AC-01..AC-10)    |
+-----------------+------------------------------------+------------------------------------+------------------------------------+
| Câu cụt / Lửng  | US-03: Bảng 3.5 (Mục A2)           | "...Tự động thích ứng linh hoạt    | Bổ sung: "Toán tư duy (tư duy logic|
|                 |                                    | theo môn học:" [cụt sau dấu :]     | / hình học) hoặc Tiếng Anh..."     |
+-----------------+------------------------------------+------------------------------------+------------------------------------+
| Thiếu khoảng    | US-03: CASE-10 (Dòng 295)          | "[CASE-10]Trình duyệt chặn tải..." | Sửa thành: "[CASE-10] Trình duyệt  |
| trắng & ký tự   |                                    | Kèm ký tự gạch đầu dòng lẻ ở cuối  | chặn tải..." và xóa dấu "-" lẻ     |
+--------------------------------------------------------------------------------------------------------------------------+
```

---

## 3. ĐÁNH GIÁ CHI TIẾT TỪNG TÀI LIỆU

### 3.1. `BF-CARE-04`: Cơ chế Báo cáo Học tập Tháng & Kế hoạch Phát triển Học viên (Page: `158072955`)
- **Điểm mạnh:**
  - Mô hình hóa rõ ràng Vòng đời trạng thái với Mermaid: từ `Bao_Cao_Tu_Dong` $\rightarrow$ `Da_Cap_Nhat` $\rightarrow$ Lưu đè, có giải thích rõ về cơ chế "Mất nhãn xanh tự động".
  - Phạm vi nghiệp vụ chặt chẽ: Độc lập theo Gói học, tự động cộng dồn số liệu khi chuyển lớp hoặc học bù.
- **Xung đột & Thiếu sót:**
  1. **Xung đột mã US tại Mục 4 (In Scope):**
     - Dòng 68: `...tại hồ sơ chăm sóc học viên (US-CARE-03-01).` $\rightarrow$ Cần đổi thành `(US-CARE-04-01)`.
     - Dòng 69: `...và thư viện khoảnh khắc (US-CARE-03-02).` $\rightarrow$ Cần đổi thành `(US-CARE-04-02)`.
     - Dòng 71: `...bộ chuyển đổi giữa các Gói học của học viên (US-CARE-03-03).` $\rightarrow$ Cần đổi thành `(US-CARE-04-03)`.
  2. **Thiếu cột Mã quyền tại Bảng 5.2:**
     - Bảng Danh mục Quyền hạn hiện có 4 cột: `| Tên Quyền Hạn (Tiếng Việt) | Loại Quyền | Phạm Vi Áp Dụng (Scope) | Diễn Giải Nghiệp Vụ |`.
     - Cần thêm cột `Mã Quyền (Capability Key)` để ánh xạ trực tiếp `care.monthly_report.edit` (đã dùng tại Mục 7).
  3. **Câu cụt tại Mục 5.1 (Dòng 123):**
     - Hiện tại: `Hệ thống lưu nội dung và chuyển cờ` (cắt ngang).
     - Cần sửa thành: `Hệ thống lưu nội dung và chuyển cờ ghi nhận đã chỉnh sửa (is_auto_generated = false).`

---

### 3.2. `US-CARE-04-01`: Chi tiết học tập: Section Báo cáo Tháng học viên (Page: `158302243`)
- **Điểm mạnh:**
  - Định nghĩa rõ vị trí hiển thị (Panel trái Tab Học tập, chiếm 50% độ rộng).
  - Quy tắc [RULE-MR-02] "Zero-footprint" (ẩn hoàn toàn khi không có dữ liệu) rất chuẩn xác cho UI hiện đại.
- **Xung đột & Thiếu sót:**
  1. **Xung đột mã tài liệu cha:**
     - Dòng 5 ghi: `Tài liệu cha: BF-CARE-03: Cơ chế Báo cáo Học tập Tháng...` $\rightarrow$ Cần sửa thành `BF-CARE-04`.
  2. **Lỗi logic biểu thức tại REQ-01 (Bảng 1.2):**
     - Hiện tại: `...Section Nhật ký học tập hiển thị và tổng số kỳ báo cáo thực tế . Nếu tổng số kỳ báo cáo =0, ẩn hoàn toàn khối`.
     - Thiếu điều kiện toán tử: Cần sửa thành `...tổng số kỳ báo cáo thực tế > 0. Nếu tổng số kỳ báo cáo = 0...`.
  3. **Tàn dư tính năng AI tại Bảng 3.2:**
     - Dòng 104 ghi: `sử dụng tính năng AI Tổng hợp kế hoạch bài học và lưu thay đổi vào hệ thống Tính năng AI chưa áp dụng tại thời điểm hiện tại`.
     - Hệ thống thực tế dùng quy trình chọn Khung chương trình (Syllabus) 2 bước của lớp ghép, không dùng AI. Cần lược bỏ câu chữ AI để tránh gây nhầm lẫn cho đội ngũ phát triển.
  4. **Câu cụt tại AC-02:**
     - Dòng 118: `...nhận xét A1, A2 và kế hoạch bài học B1, B2). Hiển thị Nút Chỉnh sửa nếu có quyền sửa, ` (kết thúc bằng dấu phẩy).
     - Cần sửa thành: `...Hiển thị Nút Chỉnh sửa nếu người dùng có quyền chỉnh sửa.`
  5. **Lỗi chính tả / Cú pháp:**
     - Dòng 132: Tiêu đề `### AC-05 (Navigation Path - Mở trực tiếp trang đích trên thẻ trình duyệt mới` bị thiếu dấu đóng ngoặc `)`.
     - Dòng 124: Sử dụng từ ngữ kỹ thuật `Landing Page` trong chuỗi thông báo nổi, nên thay bằng `Trang đích`.

---

### 3.3. `US-CARE-04-02`: Bảng nổi chi tiết Báo cáo tháng học viên (Page: `158105707`)
- **Điểm mạnh:**
  - Quy trình 2 bước sư phạm (Chọn buổi bắt đầu $\rightarrow$ kết thúc $\rightarrow$ nhấp [📖 Thêm bài]) rất trực quan, loại bỏ hoàn toàn việc gõ thủ công giáo trình.
  - Phân tách rõ ràng cơ chế giữa Môn Toán (chọn 6 danh hiệu có sẵn, xem popover tiêu chí) và Môn Tiếng Anh (nhập tự do).
  - Nghiệp vụ chuyển lớp (AC-10) giải quyết bài toán thực tế xuất sắc: gom toàn bộ chỉ số của lớp cũ và mới vào duy nhất 1 bản báo cáo dưới tên giáo viên lớp mới.
- **Xung đột & Thiếu sót:**
  1. **Xung đột mã tài liệu cha:**
     - Dòng 5 ghi: `Tài liệu cha: BF-CARE-03...` $\rightarrow$ Cần sửa thành `BF-CARE-04`.
  2. **Ký tự thừa tại REQ-06:**
     - Dòng 43: `...liên kết tài liệu trực tuyến (tự ẩn nếu không có nội dung).n` (chữ `.n` thừa ở cuối câu).
  3. **Từ vựng kỹ thuật & lỗi chính tả tại Bảng 1 (Header Bar):**
     - Dòng 118: `Button Chỉnh sửa`, `button chỉnh sửa`, `mode/chế độ`, `chính sửa`, `chuyển sáng chế độ xem`.
     - Cần đổi sang tiếng Việt tự nhiên: `Nút Chỉnh sửa`, `chế độ chỉnh sửa`, `chuyển sang chế độ xem`.
  4. **Ô bảng trống tại Bảng Edit Mode (Dòng 152):**
     - Dòng `A2.1 - Chuyên môn` có cột `Nhãn chỉ dẫn & Bullet màu sắc` bị bỏ trống hoàn toàn. Cần bổ sung nhãn chỉ dẫn màu xanh dương: `• Đánh giá chuyên môn (theo môn học)`.
  5. **Lỗi chính tả tại Bảng 4 (Dòng 162):**
     - `mặc đinh: Chọn bài` $\rightarrow$ Sửa thành `mặc định: Chọn bài`.
  6. **Câu cụt tại AC-03 (Dòng 292):**
     - `Giả sử: Hộp thoại đang mở ở Chế độ Xem và kỳ báo cáo .` $\rightarrow$ Cần sửa thành: `Giả sử: Hộp thoại đang mở ở Chế độ Xem và kỳ báo cáo đã được chọn hợp lệ.`
  7. **Câu lửng tại AC-10 (Dòng 401):**
     - `**Chuyên cần:** Tự động cộng dồn tổng số buổi có mặt và số ca muộn của học viên ở cả lớp cũ và lớp mới trong suốt chu kỳ tháng: ` $\rightarrow$ Câu dừng lại ở dấu hai chấm. Cần sửa thành: `được cộng dồn tự động trên toàn bộ các buổi học phát sinh trong tháng.`

---

### 3.4. `US-CARE-04-03`: Landing Page Báo cáo Tháng học viên (Page: `158105715`)
- **Điểm mạnh:**
  - Thiết kế trải nghiệm phụ huynh rất mượt mà: Bố cục 2 cột, Sticky Sidebar vinh danh, chuyển đổi gói học tức thì qua bộ chọn trên Header mà không reload trang.
  - Cơ chế xem ảnh Lightbox và tải toàn bộ gói media giải quyết triệt để nhu cầu lưu giữ kỷ niệm học tập của phụ huynh.
  - Tính năng tải ảnh áp phích Infographic (AC-10) hoàn chỉnh với cơ chế giãn cách chống bấm đúp liên tục.
- **Xung đột & Thiếu sót:**
  1. **Xung đột mã tài liệu cha:**
     - Dòng 5 ghi: `Tài liệu cha: BF-CARE-03...` $\rightarrow$ Cần sửa thành `BF-CARE-04`.
  2. **Câu cụt tại Bảng 3.5 (Mục A2, Dòng 149):**
     - Hiện tại: `- Tự động thích ứng linh hoạt theo môn học:` (cắt ngang sau dấu hai chấm).
     - Cần hoàn thiện: `- Tự động thích ứng linh hoạt theo môn học: Toán tư duy (nhận xét tư duy hình học/số học) hoặc Tiếng Anh (nhận xét từ vựng/ngữ pháp/phát âm).`
  3. **Lỗi chính tả tại tiêu đề AC-05 (Dòng 210):**
     - `### AC-05: Mở tab Nhận xết kiểm tra...` $\rightarrow$ Sửa thành: `### AC-05: Mở tab Nhận xét kiểm tra...`.
  4. **Định dạng không nhất quán tại AC-09 (Dòng 260):**
     - Hiện tại là `### AC-9: ` trong khi các mục khác đều dùng 2 chữ số (`AC-01` $\rightarrow$ `AC-10`). Cần đổi thành `### AC-09: `.
  5. **Định dạng tại CASE-10 (Dòng 295, 296):**
     - Dòng 295 thiếu dấu cách sau mã: `**[CASE-10]Trình duyệt...**` $\rightarrow$ Sửa thành `**[CASE-10] Trình duyệt...**`.
     - Dòng 296 có một dấu gạch đầu dòng `-` đơn độc ở cuối trang cần xóa bỏ.

---

## 4. LÀM RÕ NGHIỆP VỤ (BUSINESS CLARIFICATIONS)

### 4.1. Giới hạn số lượng ảnh (Photo Limit) giữa BF và US:
- **Hiện tượng:** Tại `BF-CARE-04` mục 6.3 ghi "tối đa 6 khoảnh khắc tiêu biểu", trong khi `US-CARE-04-03` mô tả ô thứ 6 có nhãn `+X khoảnh khắc` nếu số ảnh $> 6$, và `US-CARE-04-02` cho phép chọn tất cả ảnh trong tháng.
- **Làm rõ chuẩn xác:** 
  - Thư viện ảnh không giới hạn số lượng ảnh được tích chọn (giáo viên có thể chọn 7, 8 hoặc 10 ảnh).
  - Lưới hiển thị (Grid Preview) trên giao diện Web và Trang đích được thiết kế tối ưu 6 ô để đảm bảo tỷ lệ thẩm mỹ. Khi có trên 6 ảnh, ô thứ 6 tự động phủ lớp mờ `+X khoảnh khắc` để người xem nhấp vào xem toàn bộ trong cửa sổ trình chiếu phóng to (Lightbox).

### 4.2. Hiển thị Gói học trên Hộp thoại (Modal Context):
- Trên Trang đích phụ huynh (`US-CARE-04-03`), người dùng có bộ chọn Gói học trên thanh Header để chuyển qua lại giữa Toán và Tiếng Anh.
- Trên Hộp thoại Báo cáo Tháng (`US-CARE-04-02`), hộp thoại được kích hoạt từ Section Báo cáo Tháng của học viên (nơi đã được lọc sẵn theo Tab Gói học) hoặc từ Danh sách lớp (đã xác định môn/lớp). Do đó, ngữ cảnh Gói học được kế thừa trực tiếp từ nguồn mở. Tuy nhiên, thanh tiêu đề hoặc banner của Hộp thoại nên hiển thị thêm thông tin Môn học / Gói học (ví dụ: `Toán tư duy • Lớp 4`) để giáo viên/nhân viên luôn nắm rõ ngữ cảnh môn học đang chỉnh sửa.

---

## 5. KẾ HOẠCH HÀNH ĐỘNG TIẾP THEO

1. **Cập nhật Confluence:** Tiến hành cập nhật trực tiếp nội dung sửa đổi chuẩn hóa lên 4 trang Confluence (`BF-CARE-04`, `US-CARE-04-01`, `US-CARE-04-02`, `US-CARE-04-03`) thông qua Atlassian MCP tool.
2. **Đồng bộ mã nguồn & Tài liệu nội bộ:** Sau khi Confluence hoàn toàn chuẩn xác, tiến hành cập nhật các tệp đặc tả tương ứng trong thư mục `docs/00-business/` của kho mã nguồn dự án và chạy `npm run lint:docs` đảm bảo kiểm tra tự động đạt 0 lỗi (Zero Errors).
