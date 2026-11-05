---
id: US-CAL-02-07
title: "Chi tiết buổi học - Bổ sung nút Calling và Hộp thoại gọi điện thoại"
bf: BF-CAL-02
domain: CAP-ADM
persona: "PERSONA-BRANCH-MANAGER, PERSONA-CSM, PERSONA-TEACHER"
sr: "SR-CSM-002"
status: ready
tags: [class-session, calling, voip, session-detail, student-care, care-log, capability-gating]
---

# US-CAL-02-07: Chi tiết buổi học - Bổ sung nút Calling và Hộp thoại gọi điện thoại (Session Detail - VoIP Calling Dialog & Student Care Log)

> **Tham chiếu:** `BF-CAL-02` (Quản lý Lịch học trung tâm) · `BF-CARE-01` (Quản lý Chăm sóc học viên) · `US-CAL-02-06` (Chi tiết buổi học - Cập nhật điểm danh) · Tiêu chuẩn Thiết kế Giao diện §4.3 (Hộp thoại Chi tiết buổi học)  
> **Đường dẫn màn hình & Trạng thái liên quan:**  
> - `Lịch học trung tâm (/app/calendar_class_schedule)` -> Nhấp chọn thẻ buổi học -> Mở Hộp thoại Chi tiết buổi học -> Tab `Học viên`  
> - `Màn hình Chi tiết Chăm sóc học viên (/app/renewal)` -> Hồ sơ học viên -> Khối `Lịch sử chăm sóc`  
> - Trạng thái cuộc gọi: `Đang gọi đi`, `Đang kết nối`, `Cuộc gọi đã dừng`  

---

## 1. NHẬT KÝ THAY ĐỔI & BỐI CẢNH (CHANGELOG & CONTEXT)

### Lịch sử cập nhật tài liệu (Changelog)

| Ngày cập nhật | Nội dung cập nhật | Lý do cập nhật |
|---|---|---|
| 30/10/2026 | Khởi tạo tài liệu đặc tả nghiệp vụ (Phiên bản 1.0): Bổ sung tính năng Calling và Hộp thoại gọi điện thoại trong Hộp thoại Chi tiết buổi học; thiết lập cơ chế phân quyền phân cấp 2 cấp độ; tự động kết nối cuộc gọi qua tổng đài viễn thông; tốc ký ghi chú trong cuộc gọi; tích hợp nghe lại ghi âm trực tiếp trên tiêu đề; tách riêng ô nội dung trao đổi và ô ý kiến phụ huynh; ghi nhận nhật ký chăm sóc học viên; cập nhật chỉ báo trạng thái cuộc gọi trên bảng điểm danh; xử lý bẫy tiêu điểm bàn phím mượt mà. | Phát hành bản đặc tả chính thức phiên bản 1.0 phục vụ triển khai tính năng Calling và Hộp thoại gọi điện thoại trong vận hành ca học tại trung tâm. |

### Bối cảnh & Vấn đề nghiệp vụ (Context & Problem)

* **Bối cảnh nghiệp vụ:** Trong quá trình vận hành ca dạy tại cơ sở, khi học viên vắng mặt, đi muộn, hoặc phát sinh các vấn đề đột xuất trong lớp học (sức khỏe, thái độ học tập, thành tích đặc biệt), giáo viên và nhân viên chăm sóc học viên tại cơ sở cần gọi điện ngay cho phụ huynh hoặc người giám hộ.
* **Vấn đề trước đây:**
  1. *Thao tác thủ công rời rạc:* Nhân sự phải rời khỏi màn hình buổi học, mở phân hệ chăm sóc học viên hoặc danh sách liên hệ để tìm số điện thoại của từng học sinh, gây mất thời gian và ngắt quãng tiến trình quản lý ca dạy.
  2. *Thất thoát thông tin trao đổi:* Sau khi gọi điện bên ngoài, nhân viên thường quên ghi chép lại kết quả cuộc gọi, dẫn đến việc thiếu đồng bộ lịch sử giữa các bộ phận (Giáo viên, Giáo vụ, Quản lý cơ sở).
* **Giải pháp & Cơ chế vận hành:**
  1. *Gọi điện thoại trực tiếp một chạm:* Bổ sung biểu tượng Calling ngay trên từng dòng học viên trong Tab Học viên của Hộp thoại Chi tiết buổi học. Khi nhấp nút, hệ thống tự động nhận diện danh tính học viên, lấy thông tin người liên hệ chính và số điện thoại tương ứng để quay số.
  2. *Hộp thoại gọi điện nổi độc lập:* Hộp thoại gọi điện thoại được thiết kế như một thẻ nổi thông minh ở góc màn hình, cho phép nhân viên vừa đàm thoại, vừa tốc ký ghi chú nhanh, vừa quan sát toàn bộ danh sách lớp học mà không bị che khuất hay làm tắt hộp thoại buổi học.
  3. *Lưu trữ có chọn lọc vào lịch sử chăm sóc:*
     - Khi cuộc gọi kết thúc, người dùng rà soát nội dung trao đổi và nhập ý kiến phụ huynh, bấm **"Lưu kết quả cuộc gọi"**, hệ thống sẽ ghi nhận toàn bộ thông tin (thời lượng, nội dung trao đổi, ý kiến phụ huynh, thời gian thực hiện) vào cơ sở dữ liệu chăm sóc học viên, hiển thị ngay tại khối Lịch sử chăm sóc của học viên đó.
     - Nếu người dùng bấm **"Đóng"**, **"Bỏ qua ghi chú"** hoặc tắt hộp thoại mà không xác nhận lưu, toàn bộ dữ liệu ghi chú nháp sẽ được **xóa sạch hoàn toàn**, không tạo bất kỳ bản ghi thừa nào trong lịch sử chăm sóc.
  4. *Mở thẻ trình duyệt mới xem chi tiết chăm sóc:* Nhấp vào tên hoặc ảnh đại diện học viên sẽ mở trực tiếp thẻ trình duyệt mới đến màn hình Chi tiết Chăm sóc học viên, bảo toàn nguyên vẹn ngữ cảnh ca dạy đang mở.

### Ràng buộc nghiệp vụ toàn cục (Global Rules)

* **[RULE-CALL-01] Nguồn dữ liệu người liên hệ và số điện thoại:** Khi người dùng bấm biểu tượng Calling trên dòng học viên, hệ thống tự động truy xuất hồ sơ học viên trong cơ sở dữ liệu để lấy họ tên phụ huynh/người giám hộ và số điện thoại chính xác. Nếu học viên chưa có thông tin liên hệ, hệ thống hiển thị thông báo hướng dẫn bổ sung hồ sơ.
* **[RULE-CALL-02] Che số điện thoại chống sao chép hàng loạt:** Trên danh sách học viên và bảng chú giải nổi khi rê chuột, số điện thoại bắt buộc phải được che ẩn ở giữa theo định dạng `091****111` để phòng ngừa sao chép dữ liệu trái phép. Số điện thoại chỉ hiển thị đầy đủ bên trong Hộp thoại gọi điện thoại để phục vụ quá trình đàm thoại.
* **[RULE-CALL-03] Cơ chế xử lý ghi chú và nhật ký cuộc gọi:**
  - Trong cuộc gọi, người dùng có thể nhập các dòng ghi chú ngắn (Enter để thêm dòng mới).
  - Khi kết thúc cuộc gọi, các dòng ghi chú ngắn được tự động tổng hợp vào ô tóm tắt nội dung trao đổi dạng gạch đầu dòng; ô nhập ý kiến phụ huynh hiển thị độc lập ngay bên dưới.
  - **Hành động Lưu:** Chỉ khi người dùng bấm nút "Lưu kết quả cuộc gọi", hệ thống mới gọi đến cơ sở dữ liệu chăm sóc học viên để lưu trữ vĩnh viễn và tạo dòng nhật ký mới.
  - **Hành động Hủy/Đóng:** Nếu người dùng bấm "Đóng", "Bỏ qua ghi chú" hoặc đóng cuộc gọi trước khi lưu, hệ thống hủy bỏ và xóa trắng toàn bộ nội dung đã nhập, không lưu vào cơ sở dữ liệu.
* **[RULE-CALL-04] Độc lập hoàn toàn với Hộp thoại Chi tiết buổi học:** Hộp thoại gọi điện thoại hoạt động như một thành phần nổi độc lập. Mọi thao tác nhấp chuột, gõ phím, hủy cuộc gọi hay lưu kết quả trên hộp thoại gọi tuyệt đối không làm đóng hoặc ảnh hưởng đến trạng thái của Hộp thoại Chi tiết buổi học đang mở phía sau.
* **[RULE-CALL-05] Phân quyền phân cấp động (Dynamic Hierarchical Capabilities):** Tính năng Calling được cấu hình phân quyền động theo mô hình cây phân cấp trong hệ thống quản trị vai trò:
  - **Phân hệ quản lý:** `STATION` (Nhóm quyền: *Vận hành lớp học - Trung tâm*).
  - **Cấp tính năng cha (Cấp 1):** `Chi tiết buổi học` (Yêu cầu cấp quyền: *Truy cập* và *Sửa*).
  - **Cấp tính năng con (Cấp 2):** `Gọi điện cho phụ huynh` (Yêu cầu cấp quyền: **Truy cập**).
  - **Mã quyền nguyên tử:** `station.session.call`.
  - **Kiểm soát giao diện:** Khi tài khoản người dùng được tích chọn quyền *Truy cập* tại mục con `Gọi điện cho phụ huynh` (trong mục `Chi tiết buổi học`), biểu tượng Calling sẽ hiển thị trên từng dòng học viên trong tab Học viên của Hộp thoại Chi tiết buổi học. Nếu tài khoản không có quyền này, biểu tượng Calling sẽ tự động ẩn hoàn toàn khỏi giao diện.
* **[RULE-CALL-06] Phản hồi trực quan trên Bảng điểm danh:** Khi cuộc gọi được lưu thành công, biểu tượng Calling của học viên trên bảng điểm danh chuyển sang màu xanh ngọc kèm chấm tròn nổi. Khi rê chuột vào biểu tượng, hệ thống hiển thị bảng chú giải xem nhanh: thời gian gọi, nội dung tóm tắt và ý kiến phụ huynh.
* **[RULE-CALL-07] Bảo toàn tiêu điểm bàn phím khi nhập liệu:** Cửa sổ cuộc gọi nổi tự động giải phóng bẫy tiêu điểm của hộp thoại nền phía sau, đảm bảo con trỏ bàn phím luôn nhận diện chính xác trong các ô nhập văn bản và tự động đặt con trỏ vào ô ghi chú khi cuộc gọi kết thúc.

---

## 2. MÔ TẢ GIAO DIỆN

### 2.1 Tab Học viên trong Hộp thoại Chi tiết buổi học

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc |
|---|---|---|---|
| **Nút Calling trên dòng học viên** | Biểu tượng nút bấm hình điện thoại | Nằm cạnh nút Cập nhật điểm danh tại cột Học viên | Nút hình tròn nhỏ, biểu tượng tai nghe điện thoại màu xanh ngọc. Khi rê chuột vào hiển thị bảng chú giải nổi. Hiển thị phụ thuộc vào quyền `station.session.call`. |
| **Bảng chú giải nổi (Tooltip) nút Calling** | Khung chú giải nhỏ khi rê chuột | Tên người liên hệ và số điện thoại che | Hiển thị: `Gọi cho [Họ tên phụ huynh] ([Số điện thoại che 091****111])`. Tự ẩn khi rê chuột ra ngoài. |
| **Chỉ báo cuộc gọi đã thực hiện trên dòng học viên** | Biểu tượng điện thoại xanh kèm chấm trạng thái | Hiển thị khi học viên đã có nhật ký cuộc gọi | Biểu tượng tai nghe màu xanh ngọc viền nổi kèm chấm xanh nhỏ. Khi rê chuột vào hiển thị thời gian và nội dung tóm tắt cuộc gọi đã lưu. |
| **Liên kết Tên và Ảnh đại diện học viên** | Nút liên kết dạng thẻ thông tin | Nhấp mở thẻ trình duyệt mới | Khi nhấp vào ảnh hoặc tên học viên, hệ thống tự động mở một thẻ trình duyệt mới dẫn đến màn hình Chi tiết Chăm sóc học viên theo mã định danh học viên. |
| **Nút Cập nhật điểm danh** | Biểu tượng nút bấm hình người kèm dấu kiểm | Danh mục 3 trạng thái điểm danh | Cho phép cập nhật điểm danh nhanh cho học viên đã học hoặc đang học trong ngày, nằm cạnh nút Calling tạo thành cụm thao tác nhanh đồng bộ. |
| **Huy hiệu phân loại đối tượng** | Nhãn màu bo góc tròn | `Học thử`, `Mới`, `Học bù` | Hiển thị phân loại học viên để nhân viên dễ dàng nhận biết ngữ cảnh trao đổi phù hợp với phụ huynh. |

### 2.2 Hộp thoại gọi điện thoại nổi - Giai đoạn 1: Đang gọi đi (Dialing / Ringing)

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc |
|---|---|---|---|
| **Khung hộp thoại nổi** | Thẻ nổi góc dưới bên phải màn hình | Kích thước gọn gàng, viền bo góc tròn | Nổi phía trên mọi cửa sổ khác, có bóng đổ sâu, nền mờ kính, viền vàng hổ phách nhẹ khi đang gọi đi. Không có nút X ở góc trên (người dùng đóng qua nút hành động bên dưới). |
| **Tiêu đề 2 dòng Đang gọi đi** | Khối tiêu đề phân tầng thông minh | Dòng 1: Tên phụ huynh & SĐT; Dòng 2: Trạng thái kết nối | Dòng 1 chiếm 100% chiều ngang hiển thị: `Đang gọi: [Họ tên phụ huynh] ([Số điện thoại])` đầy đủ không bị cắt cụt. Dòng 2 hiển thị chấm tròn nhấp nháy: `Đang đổ chuông... Đang kết nối CRM`. |
| **Thông tin học viên liên quan** | Dòng văn bản phụ trợ tinh gọn | Tên học viên và tên tiếng Anh | Hiển thị dòng phụ: `Học viên: [Tên học viên]` ngay đầu khu vực nội dung bên dưới thanh tiêu đề. |
| **Thông báo kết nối viễn thông thực tế** | Văn bản hướng dẫn trung tâm | Khởi tạo cuộc gọi qua tổng đài viễn thông | Hiển thị: `Đang khởi tạo cuộc gọi qua tổng đài CRM... Hệ thống sẽ tự động kết nối sau vài giây.` Chuẩn hóa quy trình viễn thông tự động phục vụ vận hành thực tế. |
| **Nút Hủy cuộc gọi** | Nút bấm bo tròn màu đỏ nhạt | Biểu tượng gác máy điện thoại | Nằm gọn ở góc dưới bảng điều khiển. Nhấp vào để hủy ngay cuộc gọi đang đổ chuông, đóng hộp thoại gọi và xóa sạch phiên làm việc. |

### 2.3 Hộp thoại gọi điện thoại nổi - Giai đoạn 2: Đang kết nối (Connected)

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc |
|---|---|---|---|
| **Tiêu đề 2 dòng Đang kết nối & Ghi âm** | Khối tiêu đề phân tầng thông minh | Dòng 1: Tên phụ huynh & SĐT; Dòng 2: Trạng thái, REC, Đồng hồ | Dòng 1 chiếm 100% chiều ngang hiển thị: `Đang kết nối: [Họ tên phụ huynh] ([Số điện thoại])`. Dòng 2 bên trái hiển thị `Đã kết nối thành công (Nghe máy)`, bên phải hiển thị huy hiệu `[🔴 REC]` và đồng hồ đếm giờ `[⏱ mm:ss]`. |
| **Thông tin học viên liên quan** | Dòng văn bản phụ trợ tinh gọn | Tên học viên liên quan ca dạy | Hiển thị: `Học viên: [Tên học viên]` ở đầu khu vực tương tác giúp nhân sự nắm rõ ngữ cảnh học sinh. |
| **Bộ nút điều khiển cuộc gọi (Mic & Loa)** | Cụm 2 nút bấm bo góc | Bật/Tắt Micro, Bật/Tắt Loa ngoài | Nút `[Mic]` cho phép bật/tắt micro đàm thoại; nút `[Loa ngoài]` chuyển đổi trạng thái loa. Thiết kế tinh gọn, tập trung vào đàm thoại trực tiếp số di động. |
| **Khu vực tốc ký ghi chú nhanh trong cuộc gọi** | Danh sách các ô nhập văn bản theo dòng | Mỗi dòng là 1 gạch đầu dòng | Không hiển thị nhãn thừa; hiển thị gợi ý placeholder: `Nhập ghi chú nhanh (Enter thêm dòng)...`. Nhấn Enter để thêm dòng mới; nhấn Backspace dòng trống để xóa dòng. |
| **Nút Kết thúc cuộc gọi** | Nút bấm bo góc màu đỏ nổi bật | Biểu tượng gác máy và chữ `Kết thúc` | Nằm ở góc phải thanh công cụ. Nhấp vào để ngắt đàm thoại, dừng đồng hồ đếm giây và chuyển sang bước ghi nhận kết quả. |

### 2.4 Hộp thoại gọi điện thoại nổi - Giai đoạn 3: Cuộc gọi đã dừng & Ghi nhận kết quả (Call Ended)

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc |
|---|---|---|---|
| **Tiêu đề Kết thúc & Nút nghe lại ghi âm trực tiếp** | Khối tiêu đề màu ngọc bích tích cực | Thông tin người nghe, thời lượng và nút nghe lại | Dòng 1 hiển thị `Đã kết thúc với: [Họ tên phụ huynh] ([Số điện thoại])`. Dòng 2 hiển thị `✓ Thời lượng: mm:ss • Đã lưu vết ghi âm` kèm nút nghe lại trực tiếp dạng huy hiệu bấm được `[▶ mm:ss]` tích hợp thanh tiến trình. |
| **Thông tin học viên liên quan** | Dòng văn bản phụ trợ tinh gọn | Tên học viên liên quan ca dạy | Hiển thị: `Học viên: [Tên học viên]` ở đầu khu vực nhập liệu. |
| **Ô nhập ghi chú tóm tắt nội dung trao đổi** | Khung nhập văn bản nhiều dòng | Tự động gom các dòng ghi chú tốc ký | Tự động tổng hợp toàn bộ các dòng ghi chú tốc ký đã nhập trong cuộc gọi thành các gạch đầu dòng. Không có nhãn tiêu đề thừa; gợi ý placeholder: `Nhập ghi chú tóm tắt nội dung đã trao đổi...`. Tự động nhận tiêu điểm bàn phím khi chuyển sang màn hình này. |
| **Ô nhập ý kiến / phản hồi của phụ huynh** | Khung nhập văn bản nhiều dòng độc lập | Nội dung phản hồi, thắc mắc, đề xuất của phụ huynh | Khung nhập độc lập chuyên biệt giúp phân tách rõ giữa ghi chú nghiệp vụ của nhân viên và ý kiến riêng của phụ huynh. Gợi ý placeholder: `Nhập ý kiến / phản hồi của phụ huynh...`. |
| **Nút Lưu kết quả cuộc gọi (Chính)** | Nút bấm màu xanh lá tích cực | Lưu vào cơ sở dữ liệu chăm sóc học viên | Khi nhấp: Ghi nhận nhật ký mới kèm thời lượng, nội dung trao đổi và ý kiến phụ huynh vào cơ sở dữ liệu chăm sóc học viên, hiển thị thông báo thành công và đóng cuộc gọi. |
| **Nút Đóng / Bỏ qua (Phụ)** | Nút bấm viền xám mảnh | Đóng hộp thoại và xóa dữ liệu nháp | Khi nhấp: Không lưu dữ liệu vào cơ sở dữ liệu, xóa sạch toàn bộ nội dung ghi chú và đưa giao diện về trạng thái ban đầu. |

---

## 3. KHỐI CHỨC NĂNG CHI TIẾT: ACTION & LUỒNG KÍCH HOẠT (ACTIONS & EVENTS)

```mermaid
sequenceDiagram
    autonumber
    actor U as Giáo viên / Giáo vụ
    participant F as Hộp thoại Chi tiết buổi học
    participant C as Hộp thoại Gọi điện thoại (CallDialog)
    participant CRM as Hệ thống Quản trị CRM
    participant S as Hệ thống Máy chủ Station
    participant DB as Cơ sở dữ liệu Chăm sóc học viên
    participant CARE as Màn hình Chi tiết Chăm sóc

    U->>F: Nhấp biểu tượng Calling trên dòng học viên
    F->>S: Yêu cầu lấy thông tin người liên hệ và số điện thoại của học viên
    S->>DB: Gọi đến cơ sở dữ liệu học viên để lấy thông tin phụ huynh
    DB-->>S: Trả về tên phụ huynh và số điện thoại
    S-->>F: Cung cấp dữ liệu người liên hệ
    F->>C: Khởi chạy Hộp thoại gọi điện thoại ở trạng thái Đang gọi đi
    
    alt Người dùng Hủy cuộc gọi khi đang đổ chuông
        U->>C: Nhấp nút Hủy cuộc gọi
        C->>C: Hủy tiến trình quay số, đóng hộp thoại gọi
        C-->>U: Hiển thị thông báo "Đã kết thúc cuộc gọi"; Hộp thoại buổi học giữ nguyên
    else Kết nối cuộc gọi thành công
        S-->>C: Tự động kết nối viễn thông sau thời gian đổ chuông
        C->>C: Bắt đầu đếm thời lượng mm:ss, kích hoạt ghi chú tốc ký
        U->>C: Nhập các dòng ghi chú trao đổi (Enter thêm dòng)
        U->>C: Nhấp nút Kết thúc cuộc gọi
        C->>C: Dừng cuộc gọi, chuyển sang trạng thái Cuộc gọi đã dừng
        
        alt Người dùng Lưu kết quả cuộc gọi
            U->>C: Rà soát nội dung trao đổi, nhập ý kiến phụ huynh và bấm "Lưu kết quả cuộc gọi"
            C->>S: Gửi gói dữ liệu nhật ký cuộc gọi kèm thời lượng, ghi chú tóm tắt và ý kiến phụ huynh
            S->>DB: Gọi đến cơ sở dữ liệu chăm sóc học viên để tạo bản ghi nhật ký mới
            DB-->>S: Xác nhận lưu bản ghi thành công
            S-->>C: Phản hồi kết quả lưu thành công
            C-->>U: Hiển thị thông báo "Đã lưu kết quả cuộc gọi thành công" và đóng hộp thoại
            Note over F: Biểu tượng Calling trên dòng điểm danh chuyển màu xanh kèm chỉ báo đã liên hệ
            Note over DB,CARE: Dữ liệu cuộc gọi lập tức xuất hiện tại khối Lịch sử chăm sóc
        else Người dùng Đóng không lưu
            U->>C: Nhấp nút "Đóng"
            C->>C: Xóa sạch toàn bộ dữ liệu ghi chú nháp, đóng hộp thoại gọi
            C-->>U: Không gọi đến cơ sở dữ liệu; Giữ nguyên lịch sử chăm sóc cũ
        end
    end

    opt Xem chi tiết hồ sơ chăm sóc học viên
        U->>F: Nhấp vào tên hoặc ảnh đại diện học viên
        F->>CARE: Mở thẻ trình duyệt mới dẫn đến màn hình Chi tiết Chăm sóc học viên
    end
```

### Khối chức năng 1: Khởi tạo và Điều khiển cuộc gọi điện thoại

#### Action 1.1: Nhấp biểu tượng Calling trên dòng học viên
* **Luồng kích hoạt:** Người dùng nhấp biểu tượng Calling (hình điện thoại xanh) tại cột Học viên trong Tab Học viên của Hộp thoại Chi tiết buổi học.
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC-1 (Happy Path - Khởi tạo cuộc gọi thành công từ thông tin học viên):**
    - **Giả sử:** Người dùng đang mở Hộp thoại Chi tiết buổi học và có quyền Calling (`station.session.call`).
    - **Khi:** Người dùng nhấp biểu tượng Calling trên dòng học viên "[Tên học viên]".
    - **Thì:** Hệ thống tự động truy xuất thông tin phụ huynh và số điện thoại; Hộp thoại gọi điện thoại nổi bật lên ở góc phải màn hình ở trạng thái `Đang gọi: [Tên phụ huynh] ([Số điện thoại])`; dòng trạng thái đổ chuông hiển thị rõ ràng; thông tin học viên tách xuống đầu vùng nội dung; Hộp thoại Chi tiết buổi học phía sau vẫn giữ nguyên trạng thái mở và không bị gián đoạn.
  - **AC-2 (Happy Path - Hủy cuộc gọi khi đang đổ chuông):**
    - **Giả sử:** Cuộc gọi đang ở trạng thái đổ chuông.
    - **Khi:** Người dùng nhấp nút "Hủy cuộc gọi" trên thanh điều khiển.
    - **Thì:** Hệ thống hủy bỏ ngay tiến trình quay số; Hộp thoại gọi điện thoại đóng lại; hiển thị thông báo "Đã kết thúc cuộc gọi"; không có bất kỳ dữ liệu nào được ghi nhận vào cơ sở dữ liệu.

#### Action 1.2: Đàm thoại và Tốc ký ghi chú nhanh trong cuộc gọi
* **Luồng kích hoạt:** Cuộc gọi chuyển sang trạng thái kết nối đàm thoại (`Đang kết nối`).
* **Tiêu chí nghiệm thu:**
  - **AC-3 (Happy Path - Tự động kết nối viễn thông và ghi chú trực tiếp nhiều dòng):**
    - **Giả sử:** Cuộc gọi đang ở trạng thái đổ chuông.
    - **Khi:** Hệ thống kết nối viễn thông thành công.
    - **Thì:** Tiêu đề dòng 1 giữ nguyên tên đầy đủ phụ huynh và số điện thoại; dòng 2 hiển thị trạng thái kết nối cùng huy hiệu REC và đồng hồ đếm thời lượng mm:ss; khu vực tốc ký hiển thị dòng gạch đầu dòng đầu tiên cho phép người dùng gõ nội dung; khi nhấn phím Enter, một dòng gạch đầu dòng mới tự động được tạo ra ngay phía dưới để tiếp tục ghi chép.
  - **AC-4 (Happy Path - Kết thúc cuộc gọi đàm thoại):**
    - **Giả sử:** Người dùng đang trong cuộc đàm thoại với phụ huynh.
    - **Khi:** Người dùng nhấp nút "Kết thúc" màu đỏ trên thanh điều khiển.
    - **Thì:** Cuộc gọi ngắt đàm thoại ngay lập tức; đồng hồ đếm thời lượng dừng lại; giao diện tự động chuyển sang trạng thái `Cuộc gọi đã dừng`, tổng hợp các dòng ghi chú vào ô tóm tắt nội dung trao đổi, hiển thị ô nhập ý kiến phụ huynh và tự động đặt tiêu điểm bàn phím vào ô nhập liệu đầu tiên.

---

### Khối chức năng 2: Lưu trữ hoặc Hủy bỏ kết quả cuộc gọi

#### Action 2.1: Lưu kết quả cuộc gọi vào lịch sử chăm sóc học viên
* **Luồng kích hoạt:** Người dùng nhấp nút "Lưu kết quả cuộc gọi" tại màn hình kết thúc cuộc gọi.
* **Tiêu chí nghiệm thu:**
  - **AC-5 (Happy Path - Ghi nhận thành công nhật ký cuộc gọi vào cơ sở dữ liệu):**
    - **Giả sử:** Cuộc gọi đã kết thúc và hiển thị thời lượng đàm thoại thực tế.
    - **Khi:** Người dùng kiểm tra nội dung ghi chú tóm tắt, nhập ý kiến phản hồi của phụ huynh (nếu có) và nhấp nút "Lưu kết quả cuộc gọi".
    - **Thì:** Hệ thống gọi đến cơ sở dữ liệu chăm sóc học viên để lưu bản ghi mới bao gồm: người thực hiện, thời gian gọi, thời lượng, nội dung trao đổi và ý kiến phụ huynh; hiển thị thông báo "Đã lưu kết quả cuộc gọi thành công"; Hộp thoại gọi điện thoại tự động đóng lại; bản ghi mới này lập tức xuất hiện trong danh sách Lịch sử chăm sóc tại màn hình Chi tiết Chăm sóc của học viên đó; đồng thời biểu tượng Calling trên dòng học viên tại bảng điểm danh chuyển sang màu xanh ngọc kèm chỉ báo đã liên hệ.

#### Action 2.2: Đóng hoặc Bỏ qua không lưu kết quả cuộc gọi
* **Luồng kích hoạt:** Người dùng nhấp nút "Đóng" tại màn hình kết thúc cuộc gọi.
* **Tiêu chí nghiệm thu:**
  - **AC-6 (Happy Path - Hủy bỏ dữ liệu nháp và không ghi nhận vào hồ sơ):**
    - **Giả sử:** Cuộc gọi đã kết thúc, người dùng có thể đã nhập hoặc chưa nhập nội dung ghi chú.
    - **Khi:** Người dùng nhấp nút "Đóng".
    - **Thì:** Hệ thống hủy bỏ toàn bộ dữ liệu ghi chú nháp; không gửi bất kỳ yêu cầu ghi nhận nào đến cơ sở dữ liệu chăm sóc học viên; Hộp thoại gọi điện thoại đóng lại; danh sách Lịch sử chăm sóc của học viên được giữ nguyên vẹn không có bản ghi mới.

---

### Khối chức năng 3: Mở Tab mới Chi tiết Chăm sóc học viên

#### Action 3.1: Nhấp vào tên hoặc ảnh đại diện học viên
* **Luồng kích hoạt:** Người dùng nhấp vào họ tên hoặc ảnh đại diện của học viên tại cột Học viên.
* **Tiêu chí nghiệm thu:**
  - **AC-7 (Happy Path - Mở thẻ trình duyệt mới dẫn thẳng đến hồ sơ chăm sóc):**
    - **Giả sử:** Người dùng đang xem danh sách học viên trong Hộp thoại Chi tiết buổi học.
    - **Khi:** Người dùng nhấp chuột trái vào tên hoặc ảnh đại diện của học viên "[Tên học viên]".
    - **Thì:** Trình duyệt tự động mở một thẻ mới dẫn đến màn hình Chi tiết Chăm sóc học viên; màn hình hiển thị đầy đủ thông tin học thuật, cảnh báo chăm sóc và lịch sử các lần tương tác của học viên đó; thẻ trình duyệt cũ chứa Hộp thoại Chi tiết buổi học hoàn toàn không bị thay đổi hay tải lại trang.

---

## 4. CÁC TRƯỜNG HỢP GÓC CẠNH & LUỒNG NGOẠI LỆ (CORNER CASES & EXCEPTION FLOWS)

* **[CASE-01] Học viên chưa có thông tin phụ huynh hoặc số điện thoại trong cơ sở dữ liệu:**
  * **Tình huống:** Người dùng nhấp biểu tượng Calling trên dòng học viên nhưng hồ sơ của học viên này chưa được cập nhật số điện thoại phụ huynh hoặc người liên hệ.
  * **Xử lý:** Hệ thống không mở Hộp thoại gọi điện thoại, đồng thời hiển thị thông báo hướng dẫn: `"Học viên chưa có số điện thoại liên hệ. Vui lòng cập nhật hồ sơ học viên trước khi gọi."`.
* **[CASE-02] Phụ huynh không bắt máy hoặc máy bận (Thời lượng cuộc gọi bằng 0 giây):**
  * **Tình huống:** Cuộc gọi kết thúc mà phụ huynh không nhấc máy, thời lượng đàm thoại ghi nhận `00:00`.
  * **Xử lý:** Tại màn hình kết thúc cuộc gọi, hệ thống tự động nhận diện thời lượng bằng 0 và gán trạng thái phân loại mặc định là "Không nghe máy"; người dùng có thể bấm "Lưu kết quả cuộc gọi" ngay để lưu vết mà không cần thao tác phân loại thủ công.
* **[CASE-03] Thao tác trên Hộp thoại Chi tiết buổi học trong khi cuộc gọi đang diễn ra:**
  * **Tình huống:** Trong lúc đang đàm thoại qua Hộp thoại gọi điện thoại, người dùng cuộn xem danh sách học viên, đổi tab sang Media/Tổng quan, hoặc cập nhật điểm danh cho học sinh khác.
  * **Xử lý:** Cả hai cửa sổ hoạt động hoàn toàn độc lập và trơn tru. Hộp thoại gọi điện thoại duy trì trạng thái đàm thoại và đếm giây bình thường, không bị gián đoạn hay mất dữ liệu khi người dùng thao tác ở màn hình phía sau.
* **[CASE-04] Người dùng vô tình nhấp ra ngoài vùng Hộp thoại gọi điện thoại:**
  * **Tình huống:** Người dùng nhấp chuột vào nền tối hoặc các vị trí khác bên ngoài Hộp thoại gọi điện thoại khi đang đàm thoại hoặc đang ghi chép kết quả.
  * **Xử lý:** Hộp thoại gọi điện thoại được cố định trên màn hình và không tự ý đóng lại khi nhấp ra ngoài. Điều này ngăn chặn triệt để nguy cơ mất trắng nội dung ghi chú người dùng đang soạn thảo.
* **[CASE-05] Thực hiện nhiều cuộc gọi liên tiếp cho nhiều học viên khác nhau trong cùng buổi học:**
  * **Tình huống:** Người dùng vừa hoàn tất cuộc gọi cho học viên A (đã lưu hoặc đóng), sau đó nhấp tiếp biểu tượng Calling của học viên B.
  * **Xử lý:** Hệ thống tự động làm mới hoàn toàn trạng thái phiên gọi: nạp thông tin phụ huynh và số điện thoại của học viên B, đặt lại đồng hồ đếm thời lượng về `00:00`, xóa sạch nội dung ghi chú cũ và mở lại trạng thái Đang gọi đi mới.
* **[CASE-06] Người dùng bị thu hồi quyền Calling trong khi phiên làm việc đang mở:**
  * **Tình huống:** Quyền gọi điện thoại của tài khoản bị quản trị viên gỡ bỏ trên hệ thống quản trị CRM trong lúc người dùng đang mở Hộp thoại Chi tiết buổi học.
  * **Xử lý:** Trên giao diện, tất cả các biểu tượng Calling tự động ẩn đi; nếu cuộc gọi đang diễn ra dở dang, hệ thống cho phép hoàn tất cuộc gọi hiện tại nhưng từ chối khởi tạo bất kỳ cuộc gọi mới nào tiếp theo.
* **[CASE-07] Nội dung ghi chú trao đổi có độ dài lớn:**
  * **Tình huống:** Người dùng nhập nội dung ghi chú rất dài vượt quá độ cao hiển thị mặc định của ô nhập văn bản tại màn hình kết thúc cuộc gọi.
  * **Xử lý:** Ô nhập văn bản tự động kích hoạt thanh cuộn dọc nội bộ mượt mà, cho phép người dùng cuộn xem lại toàn bộ nội dung mà không làm vỡ kích thước hay tràn bố cục của Hộp thoại gọi điện thoại.
* **[CASE-08] Xử lý bẫy tiêu điểm bàn phím khi hộp thoại gọi hiển thị đè lên hộp thoại buổi học:**
  * **Tình huống:** Hộp thoại Chi tiết buổi học phía sau có cơ chế kiểm soát bẫy tiêu điểm bàn phím, có thể gây ra hiện tượng giật con trỏ phím khi người dùng click vào các ô ghi chú của Hộp thoại gọi điện thoại.
  * **Xử lý:** Hệ thống tự động giải phóng bẫy tiêu điểm của màn hình nền khi Hộp thoại gọi điện thoại mở ra, cho phép con trỏ bàn phím nhấp nháy tự do trong ô tốc ký và các ô ghi chú nội dung/ý kiến phụ huynh để người dùng nhập liệu liên tục, không bị ngắt quãng.
