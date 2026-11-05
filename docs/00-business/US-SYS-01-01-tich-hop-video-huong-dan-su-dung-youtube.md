---
id: US-SYS-01-01
title: "Nâng cấp & Tích hợp Video Hướng dẫn Sử dụng (HDSD) Động theo Ngữ cảnh Màn hình"
bf: BF-SYS-01
domain: CAP-SYS
persona: "PERSONA-BRANCH-MANAGER, PERSONA-CSM, PERSONA-TEACHER, PERSONA-ACCOUNTANT"
sr: "SR-SYS-001"
status: draft
tags: [upgrade, tutorial-video, youtube-integration, contextual-help, config-driven, actual-ui-sync]
---

# US-SYS-01-01: Nâng cấp & Tích hợp Video Hướng dẫn Sử dụng (HDSD) Động theo Ngữ cảnh Màn hình (Contextual Tutorial Video Integration)

> **Tham chiếu:** `BF-SYS-01` · `SR-SYS-001` · Giao diện Mẫu §4.2 (Thanh điều hướng trên cùng & Bảng nổi trợ giúp)  
> **Đường dẫn màn hình & Trạng thái liên quan:**  
> - `Toàn bộ màn hình hệ thống Station (/app/*)` -> Cụm nút trên cùng (Thanh điều hướng) -> Nút `HDSD` -> Bảng nổi danh sách video -> Hộp thoại trình chiếu rạp chiếu 16:9  

---

## 1. NHẬT KÝ THAY ĐỔI & BỐI CẢNH (CHANGELOG & CONTEXT)

### Lịch sử cập nhật tài liệu (Changelog)

| Ngày cập nhật | Nội dung cập nhật | Lý do cập nhật |
|---|---|---|
| 30/10/2026 | Tối ưu hóa kiến trúc quản trị: Chuyển đổi từ mô hình cơ sở dữ liệu và màn hình quản trị sang Cơ chế Tệp cấu hình danh mục video tập trung (Cách 3) | Đơn giản hóa tối đa quy trình vận hành, loại bỏ việc xây dựng màn hình quản trị cồng kềnh, cho phép thêm video mới chỉ trong vài giây |

### Bối cảnh & Mục tiêu nghiệp vụ (Context & Objectives)

* **Bối cảnh vận hành:** Nhân sự tại các cơ sở đào tạo (Quản lý chi nhánh, Giáo vụ, Giáo viên, Thu ngân) khi tiếp cận các nghiệp vụ mới hoặc thao tác phức tạp (xếp ca làm việc, quản lý học bù, cảnh báo chăm sóc học viên, kiểm tra chất lượng) thường gặp khó khăn hoặc mất thời gian hỏi người phụ trách.
* **Mục tiêu giải pháp:**
  * Cung cấp một nút trợ giúp trực quan **HDSD** ngay trên thanh điều hướng trên cùng của hệ thống.
  * Tự động nhận diện màn hình người dùng đang đứng để lọc và ưu tiên video hướng dẫn phù hợp nhất lên đầu danh sách.
  * Trình chiếu video theo chuẩn rạp chiếu 16:9 hiện đại, tối giản, không thanh bên hay nút co giãn rườm rà, giúp người dùng tập trung nắm bắt quy trình nhanh chóng.

---

### Kiến trúc Gán & Quản lý Video: Cơ chế Tệp Cấu hình Tập trung (Config-Driven Registry)

> [!TIP]
> **Giải pháp tối ưu: Quản lý danh mục bài học bằng Tệp cấu hình tập trung.**
> Không cần thiết lập bảng cơ sở dữ liệu mới và không cần xây dựng thêm màn hình quản trị phức tạp.

Để trả lời cho bài toán *"Lấy video gán như thế nào và sau này thêm video mới thì sao"*, hệ thống áp dụng cơ chế **Tệp cấu hình tập trung** như sau:

#### 1. Cấu trúc danh mục video trong tệp cấu hình tập trung
Toàn bộ danh mục video hướng dẫn được khai báo trong một tệp cấu hình duy nhất của hệ thống, mỗi bản ghi gồm các thuộc tính rõ ràng:
* **Mã định danh video (`id`):** Khóa duy nhất (ví dụ: `tut-makeup-01`, `tut-dashboard-01`).
* **Tiêu đề bài học (`title`):** Tên bài giảng hiển thị trên giao diện (ví dụ: *Quy trình Đăng ký & Quản lý Học bù*).
* **Mã video YouTube (`youtubeId`):** Mã định danh 11 ký tự của video trên YouTube (ví dụ: `M7lc1UVf-VE`, `dQw4w9WgXcQ`) hoặc đường dẫn YouTube đầy đủ.
* **Màn hình áp dụng (`targetScreen`):** Mã màn hình hệ thống mà video sẽ hiển thị ưu tiên (ví dụ: `makeup_class`, `students`, `calendar_class_schedule`, `student_operations_alert`). Nếu là video hướng dẫn chung cho mọi nhân sự thì đặt giá trị là `ALL`.
* **Chuyên mục (`category`):** Phân nhóm nghiệp vụ (ví dụ: *Học vụ & Đào tạo*, *Vận hành & Điểm danh*, *Mẹo & Năng suất*, *Tổng quan & Điều hành*).
* **Thời lượng bài học (`duration`):** Định dạng hiển thị phút:giây (ví dụ: `03:55`, `05:40`).
* **Ảnh thu nhỏ (`thumbnail`):** Tự động trích xuất trực tiếp từ máy chủ ảnh của YouTube theo cú pháp chuẩn của mã video, không cần tải lên thủ công.

#### 2. Cơ chế lọc và hiển thị tự động theo ngữ cảnh màn hình
* Khi nhân sự truy cập bất kỳ màn hình nào trên hệ thống Station, giao diện tự động đối chiếu mã màn hình hiện tại với danh mục trong tệp cấu hình:
  1. **Nhóm 1 (Ưu tiên theo màn hình hiện tại):** Những bài học có `targetScreen` trùng khớp với mã màn hình đang mở sẽ được đưa lên đầu danh sách kèm nhãn định danh màn hình màu xanh ở góc phải.
  2. **Nhóm 2 (Hướng dẫn chung khác):** Những bài học có `targetScreen = ALL` sẽ xuất hiện ở bên dưới dòng phân cách để nhân viên tham khảo thêm kỹ năng tổng quan.

#### 3. Quy trình bổ sung video mới sau này (Cực kỳ đơn giản & Nhanh chóng)
* Khi đội ngũ Đào tạo (Training PO / CSM) sản xuất xong một video hướng dẫn mới:
  1. Người phụ trách chỉ cần cung cấp: **Đường dẫn YouTube** + **Tên bài học** + **Màn hình áp dụng** (ví dụ: `makeup_class`).
  2. Người quản trị hoặc kỹ thuật viên chỉ việc mở tệp cấu hình danh mục và **sao chép thêm 1 dòng dữ liệu** vào danh sách.
  3. Ngay lập tức toàn bộ hệ thống tại tất cả chi nhánh nhận diện bài học mới trên đúng màn hình đó mà **không cần tạo bảng cơ sở dữ liệu, không cần máy chủ trung gian và không cần xây dựng màn hình giao diện quản trị**.

---

### Ràng buộc nghiệp vụ toàn cục (Global Rules):

* **[RULE-SYS-01] Bảo mật và chuẩn hóa nhúng YouTube:** Trình phát video sử dụng giao diện nhúng an toàn không quảng cáo ngoài luồng của YouTube (`https://www.youtube-nocookie.com/embed/...`), tự động bật tham số điều khiển chuẩn và bảo vệ quyền tác giả nội dung.
* **[RULE-SYS-02] Đơn giản hóa bảng danh sách video:** Bảng danh sách xem nhanh chỉ hiển thị ảnh đại diện, tiêu đề bài học và nhãn chuyên mục; lược bỏ số lượt xem, ngày đăng hoặc bộ lọc tìm kiếm phức tạp để người dùng không bị phân tâm.
* **[RULE-SYS-03] Định dạng rạp chiếu độc lập:** Khung xem video mở ở dạng rạp chiếu kích thước lớn (chuẩn tỉ lệ 16:9), thanh tiêu đề chỉ gồm Tên video, nút "Mở trên YouTube" và nút Đóng `[X]`; không có thanh bên danh sách phát hay chân trang chiếm diện tích.
* **[RULE-SYS-04] Tự động ẩn huy hiệu số khi không có video mới:** Huy hiệu số đỏ trên nút HDSD phản ánh số lượng video hướng dẫn chuyên biệt của màn hình hiện tại. Nếu màn hình chưa có video riêng, nút hiển thị ở trạng thái bình thường không có huy hiệu đỏ.

---

## 2. MÔ TẢ GIAO DIỆN (UI DESCRIPTION & ADJUSTMENT MATRIX)

### Giao diện: Thanh Header Station & Cụm Trợ Giúp Video HDSD

---

### 2.1 Cụm nút Nút bấm "HDSD" trên Thanh điều hướng (Header) - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Nút bấm HDSD** | Nút viền bo tròn hình viên thuốc | Nhãn chữ `HDSD` và biểu tượng máy quay | Đặt tại thanh điều hướng trên cùng, bên cạnh nút chuyển chế độ và nút Báo lỗi. Nhấp để bật bảng nổi danh sách video. | **Bổ sung:** Đưa nút trợ giúp video trực tiếp lên thanh điều hướng chính để người dùng có thể mở bất cứ lúc nào. |
| **Huy hiệu số đỏ trên nút** | Chấm tròn nền đỏ chữ trắng | Số lượng video khớp với màn hình hiện tại | Hiển thị số đếm (ví dụ: `1`, `2`) nếu màn hình có video hướng dẫn chuyên biệt. Tự động ẩn nếu màn hình không có video riêng. | **Bổ sung:** Huy hiệu nổi bật báo hiệu cho nhân sự biết màn hình này đã có bài giảng hướng dẫn chi tiết. |

---

### 2.2 Bảng nổi (Popover) Danh sách Video Hướng dẫn - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Khung Bảng nổi xem nhanh** | Khung nổi màu trắng bóng đổ nhẹ bo góc | Neo trực tiếp phía dưới nút bấm HDSD | Kích thước gọn gàng chiều rộng khoảng 380 điểm ảnh, tự động căn lề phải tránh tràn mép màn hình. Bấm ra ngoài để đóng. | **Bổ sung:** Bảng danh sách dạng popover tinh gọn, không chuyển hướng trang làm gián đoạn công việc hiện tại. |
| **Thanh tiêu đề Bảng nổi** | Thanh tiêu đề nhỏ chữ in thường | Tiêu đề "Video hướng dẫn" và nhãn màn hình | Hiển thị chữ thường không in đậm rườm rà. Góc phải có nhãn màu xanh chỉ rõ tên màn hình hiện tại (ví dụ: `Học bù học viên`). | **Điều chỉnh:** Bỏ biểu tượng rườm rà cạnh chữ tiêu đề, chuyển chữ về dạng thường thanh lịch theo phản hồi người dùng. |
| **Thẻ Video chuyên biệt màn hình** | Khối hàng ngang tương tác | Ảnh thu nhỏ, Tiêu đề, Chuyên mục, Thời lượng | Ảnh thu nhỏ có biểu tượng nút phát màu đỏ và nhãn thời lượng; nhấp vào thẻ để mở hộp thoại phát video. | **Bổ sung:** Đưa video khớp với nghiệp vụ hiện tại lên vị trí đầu tiên để người dùng học thao tác ngay. |
| **Dòng phân cách Chuyên mục chung** | Dòng tiêu đề phụ kèm biểu tượng sao | Nhãn chữ hoa `HƯỚNG DẪN CHUNG KHÁC` | Phân định rõ ràng giữa video chuyên biệt của màn hình hiện tại và các bài học chung toàn hệ thống. | **Bổ sung:** Phân nhóm trực quan giúp nhân sự tìm kiếm thêm các kỹ năng và mẹo thao tác trên hệ thống. |
| **Danh sách Video chung** | Danh sách các thẻ hàng ngang | Danh mục video toàn hệ thống | Hiển thị từ 2 đến 3 video bài học tổng quan (Bàn làm việc, Hồ sơ học viên, Phím tắt). | **Bổ sung:** Luôn có nội dung trợ giúp ngay cả khi màn hình nghiệp vụ chưa kịp sản xuất video chuyên biệt. |

---

### 2.3 Hộp thoại Trình chiếu Video Rạp chiếu chuẩn 16:9 (Cinema Player Dialog) - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Khung Hộp thoại Rạp chiếu** | Hộp thoại nổi giữa màn hình nền tối | Chiều rộng lớn từ 1360 đến 1480 điểm ảnh | Cố định kích thước lớn chuẩn rạp chiếu, tự động co giãn theo tỉ lệ màn hình; lớp nền phía sau được làm tối mờ nhẹ. | **Bổ sung:** Trình xem video kích thước lớn chuẩn rạp chiếu, tối ưu cho mắt theo dõi chi tiết bảng biểu trên video. |
| **Thanh tiêu đề Hộp thoại** | Thanh ngang đầu hộp thoại | Tiêu đề video, Nút YouTube và Nút Đóng `[X]` | Hiển thị rõ tên bài học. Có nút phụ "Mở trên YouTube" màu đỏ nhẹ và nút đóng `[X]` ở góc ngoài cùng bên phải. | **Điều chỉnh:** Lược bỏ toàn bộ nút phóng to/thu nhỏ rườm rà không cần thiết theo yêu cầu người dùng. |
| **Khung phát Video 16:9** | Khung phát video nhúng an toàn | Video phát trực tiếp từ máy chủ YouTube | Tỉ lệ cố định 16:9 sắc nét, hỗ trợ đầy đủ tạm dừng, tua lại, điều chỉnh âm lượng và chọn độ phân giải chất lượng cao. | **Bổ sung:** Tích hợp trực tiếp luồng video nhúng tốc độ cao, không tốn dung lượng máy chủ lưu trữ nội bộ. |
| **Thanh chân trang (Footer)** | Khối điều khiển đáy hộp thoại | Không sử dụng | Không cần hiển thị bất kỳ nút bấm hay thanh công cụ phụ nào ở đáy hộp thoại. | <span style="color: rgb(255,86,48);">**Lược bỏ:** Gỡ bỏ hoàn toàn thanh chân trang để không gian video được thoáng đạt tối đa.</span> |

---

### 2.4 Cấu trúc Tệp Danh mục Cấu hình Video (Quản trị & Bổ sung video mới) - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Mã video (id)** | Chuỗi ký tự định danh | Duy nhất trong toàn bộ hệ thống | Dùng để phân biệt các bài giảng, ví dụ: `tut-makeup-01`, `tut-booking-01`. | **Bổ sung:** Khóa định danh định hình bài học trong tệp cấu hình tập trung. |
| **Mã YouTube (youtubeId)** | Chuỗi 11 ký tự hoặc đường dẫn | Mã định danh video trên trang YouTube | Nhận trực tiếp mã định danh (ví dụ `M7lc1UVf-VE`) để tạo luồng phát video nhúng chuẩn rạp chiếu. | **Bổ sung:** Khai báo liên kết video bài giảng trực tiếp vào tệp cấu hình. |
| **Màn hình áp dụng (targetScreen)** | Mã màn hình hệ thống | Trùng với mã màn hình nghiệp vụ | Gán với mã màn hình tương ứng (ví dụ: `makeup_class`, `students`) hoặc giá trị `ALL` cho video chung. | **Bổ sung:** Xác định ngữ cảnh hiển thị tự động trên thanh điều hướng. |
| **Tiêu đề & Chuyên mục** | Chuỗi văn bản tiếng Việt | Tên bài học và tên nhóm nghiệp vụ | Hiển thị trực quan trên thẻ danh sách để nhân sự nhận diện nội dung đào tạo trước khi mở xem. | **Bổ sung:** Thuộc tính mô tả hoàn thiện thông tin bài học. |
| **Thời lượng (duration)** | Chuỗi thời gian chuẩn | Định dạng phút:giây | Cho nhân viên biết trước thời lượng bài học (ví dụ: `03:55`, `05:40`) để chủ động thời gian theo dõi. | **Bổ sung:** Hiển thị thời lượng trên góc ảnh thu nhỏ. |

---

## 3. KHỐI CHỨC NĂNG CHI TIẾT: ACTION & LUỒNG KÍCH HOẠT (ACTIONS & EVENTS)

### Khối chức năng 1: Xem video hướng dẫn theo ngữ cảnh trên thanh điều hướng

#### Action 1.1: Nhấp nút HDSD trên thanh điều hướng mở danh sách video theo ngữ cảnh
* **Luồng kích hoạt:** Người dùng nhấp chuột trái vào nút **HDSD** trên thanh điều hướng trên cùng.
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC-1 (Happy Path - Hiển thị danh sách video theo đúng màn hình đang thao tác):**
    - **Giả sử:** Người dùng đang làm việc tại màn hình "Học bù học viên" (`/app/makeup_class`) và màn hình này đã được cấu hình video bài học trong tệp danh mục.
    - **Khi:** Người dùng nhấp vào nút "HDSD".
    - **Thì:** Bảng nổi hiển thị ngay cạnh nút; dòng đầu tiên làm nổi bật bài học "Quy trình Đăng ký & Quản lý Học bù", góc phải có nhãn `Học bù học viên`; danh sách phía dưới hiển thị các bài học chung toàn hệ thống.
  - **AC-2 (Happy Path - Tự động ưu tiên video chuyên biệt lên đầu):**
    - **Giả sử:** Một màn hình nghiệp vụ có 2 video hướng dẫn nghiệp vụ chuyên biệt trong tệp cấu hình.
    - **Khi:** Bảng nổi mở ra.
    - **Thì:** Toàn bộ các video gắn với mã màn hình này được đẩy lên phần trên cùng danh sách, sắp xếp theo thứ tự khai báo.

#### Action 1.2: Nhấp chọn một video để mở Hộp thoại trình chiếu
* **Luồng kích hoạt:** Người dùng nhấp vào bất kỳ thẻ video nào trong bảng nổi.
* **Tiêu chí nghiệm thu:**
  - **AC-3 (Happy Path - Trình chiếu video định dạng rạp chiếu 16:9 độc lập):**
    - **Giả sử:** Bảng nổi danh sách video đang mở.
    - **Khi:** Người dùng nhấp vào thẻ bài học "Tối ưu hóa Phím tắt và Thao tác nhanh".
    - **Thì:** Bảng nổi tự động đóng lại; Hộp thoại trình chiếu rạp chiếu kích thước lớn hiển thị giữa màn hình với nền tối mờ; video sẵn sàng phát ở tỉ lệ 16:9 chuẩn nét; thanh tiêu đề hiển thị đúng tên bài học.

#### Action 1.3: Mở xem trực tiếp trên tab mới của YouTube
* **Luồng kích hoạt:** Người dùng nhấp vào nút "Mở trên YouTube" ở góc trên hộp thoại trình chiếu.
* **Tiêu chí nghiệm thu:**
  - **AC-4 (Happy Path - Điều hướng mở video gốc trên trang YouTube):**
    - **Giả sử:** Hộp thoại trình chiếu video đang mở trên giao diện Station.
    - **Khi:** Người dùng bấm vào nút "Mở trên YouTube".
    - **Thì:** Trình duyệt tự động mở một thẻ tab mới điều hướng trực tiếp đến đường dẫn YouTube của video đó; giao diện Station hiện tại vẫn giữ nguyên trạng thái không bị mất dữ liệu đang làm việc.

---

### Khối chức năng 2: Thêm mới và quản trị bài học qua tệp cấu hình danh mục

#### Action 2.1: Bổ sung bản ghi video mới vào tệp cấu hình tập trung
* **Luồng kích hoạt:** Người quản trị thêm một dòng đối tượng video vào tệp cấu hình danh mục bài học.
* **Tiêu chí nghiệm thu:**
  - **AC-5 (Happy Path - Thêm mới video bằng tệp cấu hình thành công):**
    - **Giả sử:** Đội ngũ Đào tạo vừa sản xuất bài học "Quy trình Đăng ký Lịch làm việc cho Giáo viên" và có mã YouTube `M7lc1UVf-VE`.
    - **Khi:** Quản trị viên thêm bản ghi với mã màn hình `work_registration` vào tệp cấu hình danh mục.
    - **Thì:** Ngay khi tải lại trang, nhân sự đứng tại màn hình Đăng ký Lịch làm việc sẽ thấy nút HDSD xuất hiện huy hiệu số đỏ và bài học mới được ưu tiên hiển thị ngay trên đầu bảng nổi.
  - **AC-6 (Happy Path - Khai báo video chung toàn hệ thống):**
    - **Giả sử:** Đội ngũ Đào tạo muốn bổ sung một bài học kỹ năng áp dụng cho tất cả nhân viên các bộ phận.
    - **Khi:** Quản trị viên khai báo bản ghi mới với mã màn hình áp dụng là `ALL`.
    - **Thì:** Bài học này tự động xuất hiện trong mục "HƯỚNG DẪN CHUNG KHÁC" trên tất cả các màn hình trong toàn hệ thống Station.

---

## 4. CÁC TRƯỜNG HỢP GÓC CẠNH & LUỒNG NGOẠI LỆ (CORNER CASES & EXCEPTION FLOWS)

* **[CASE-01] Màn hình hiện tại chưa có video hướng dẫn chuyên biệt nào:**
  * **Tình huống:** Người dùng đứng tại một màn hình mới phát hành hoặc màn hình phụ trợ chưa được sản xuất video hướng dẫn riêng biệt trong tệp cấu hình.
  * **Xử lý:** Nút HDSD trên thanh điều hướng không hiển thị huy hiệu số đỏ. Khi người dùng nhấp mở nút, bảng nổi vẫn hiển thị đầy đủ tiêu đề kèm danh mục các bài học hướng dẫn chung toàn hệ thống (Bàn làm việc, Hồ sơ 360, Mẹo phím tắt) để hỗ trợ người dùng, không để trống bảng.
* **[CASE-02] Video YouTube bị người tải lên xóa hoặc chuyển sang chế độ riêng tư:**
  * **Tình huống:** Video trên YouTube bị đổi quyền riêng tư (Private) hoặc bị gỡ khỏi kênh mà quản trị viên chưa kịp cập nhật lại mã video trong tệp cấu hình.
  * **Xử lý:** Khung phát video hiển thị thông báo thân thiện của YouTube giải thích video không khả dụng. Người dùng có thể bấm nút "Mở trên YouTube" để kiểm tra hoặc bấm Đóng quay lại màn hình mà không làm treo ứng dụng Station.
* **[CASE-03] Gián đoạn kết nối mạng trong quá trình đang phát video:**
  * **Tình huống:** Đường truyền internet tại cơ sở bị mất kết nối hoặc chập chờn khi người dùng đang theo dõi bài giảng.
  * **Xử lý:** Trình phát video hiển thị biểu tượng tải dữ liệu; khi có kết nối trở lại, video tự động tiếp tục phát tại vị trí tạm dừng mà không yêu cầu người dùng phải mở lại hộp thoại từ đầu.
* **[CASE-04] Khai báo mã YouTube hoặc đường dẫn liên kết trong tệp cấu hình:**
  * **Tình huống:** Người cấu hình dán mã định danh 11 ký tự (ví dụ: `M7lc1UVf-VE`) hoặc đường dẫn đầy đủ dạng `https://youtu.be/...`.
  * **Xử lý:** Giao diện tự động chuẩn hóa và nhận diện chính xác mã định danh để nạp vào khung nhúng chuẩn, đảm bảo video luôn phát chính xác bất kể định dạng link đầu vào.
* **[CASE-05] Mở video hướng dẫn khi người dùng đang nhập dở biểu mẫu chưa lưu:**
  * **Tình huống:** Người dùng đang điền thông tin học viên hoặc xếp lịch dở dang thì quên thao tác và bấm mở video HDSD để xem lại.
  * **Xử lý:** Hộp thoại video hiển thị ở lớp phủ bên trên (lớp giao diện cao hơn), toàn bộ dữ liệu người dùng đã nhập trên biểu mẫu phía dưới được giữ nguyên vẹn 100%. Sau khi xem xong bấm Đóng hoặc bấm phím ESC, người dùng tiếp tục hoàn thành biểu mẫu bình thường.
* **[CASE-06] Kích thước màn hình thiết bị nhỏ (máy tính xách tay hoặc máy tính bảng):**
  * **Tình huống:** Nhân sự sử dụng máy tính xách tay 13 inch hoặc máy tính bảng có độ phân giải màn hình nhỏ hơn 1400 điểm ảnh.
  * **Xử lý:** Hộp thoại rạp chiếu tự động co giãn theo tỉ lệ 95% độ rộng khung nhìn (tối đa bằng chiều rộng màn hình khả dụng) và duy trì đúng tỉ lệ chuẩn 16:9, đảm bảo video không bị tràn viền hay xuất hiện thanh cuộn ngang gây khó khăn khi thao tác.
