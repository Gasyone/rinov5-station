---
id: US-SYS-01-02
title: "Nâng cấp Giao diện & Tính năng Báo lỗi, Yêu cầu Điều chỉnh Tự động (Bug Report & Feedback System)"
bf: BF-SYS-01
domain: CAP-SYS
persona: "PERSONA-BRANCH-MANAGER, PERSONA-CSM, PERSONA-TEACHER, PERSONA-ACCOUNTANT"
sr: "SR-SYS-002"
status: draft
tags: [upgrade, feedback, bug-report, action-trail, auto-screenshot, actual-ui-sync]
---

# US-SYS-01-02: Nâng cấp Giao diện & Tính năng Báo lỗi, Yêu cầu Điều chỉnh Tự động (Automated Bug Report & Feedback System)

> **Tham chiếu:** `BF-SYS-01` · `SR-SYS-002` · Giao diện Mẫu §4.2 (Thanh điều hướng trên cùng & Bảng nổi báo lỗi 2 cột)  
> **Đường dẫn màn hình & Trạng thái liên quan:**  
> - `Toàn bộ màn hình hệ thống Station (/app/*)` -> Cụm nút trên cùng (Thanh điều hướng) -> Nút `Báo lỗi & Góp ý` -> Cửa sổ nổi 2 cột (Panel Trái: Bằng chứng ngữ cảnh & Nhật ký thao tác; Panel Phải: Biểu mẫu phân loại & Nút gửi)  

---

## 1. NHẬT KÝ THAY ĐỔI & BỐI CẢNH (CHANGELOG & CONTEXT)

### Lịch sử cập nhật tài liệu (Changelog)

| Ngày cập nhật | Nội dung cập nhật | Lý do cập nhật |
|---|---|---|
| 30/10/2026 | Tinh giản và nâng cấp toàn diện cơ chế Báo lỗi: Bỏ các tab Gửi mới / Lịch sử; Chuyển sang bố cục 2 cột (Panel Trái: Ảnh chụp màn hình thực tế, URL kèm nút chép và Nhật ký thao tác; Panel Phải: Phân loại, Mức độ, Ô nhập placeholder không tiêu đề và nút Gửi không đường viền) | Tối ưu hóa trải nghiệm người dùng, tự động hóa 100% bằng chứng lỗi giúp đội ngũ kỹ thuật và vận hành xử lý sự cố tức thì |

### Bối cảnh & Mục tiêu nghiệp vụ (Context & Objectives)

* **Bối cảnh vận hành:** Trong quá trình vận hành tại các cơ sở, khi nhân viên gặp sự cố phần mềm (đơ nút bấm, sai số liệu, lỗi hiển thị) hoặc cần đề xuất cải tiến giao diện, quy trình báo lỗi truyền thống thường rất rườm rà: nhân viên phải chụp màn hình bằng điện thoại, copy link, gõ lại các bước rồi gửi qua nhóm chat, dẫn đến thiếu thông tin và đội ngũ kỹ thuật mất nhiều thời gian hỏi lại để tái hiện lỗi.
* **Mục tiêu giải pháp:**
  * Tích hợp nút **Báo lỗi & Góp ý** thường trực trên thanh điều hướng trên cùng của hệ thống.
  * **Tự động chụp lại ảnh màn hình thực tế** ngay tại khoảnh khắc xảy ra vấn đề mà không cần nhân viên thao tác phức tạp.
  * **Tự động ghi nhận chuỗi thao tác vừa thực hiện (Nhật ký hành vi):** Ghi nhớ từ 6 đến 12 thao tác nhấp chuột, chuyển màn hình hoặc cảnh báo phát sinh trước khi báo lỗi.
  * Chuyển phát trực tiếp thông tin và hình ảnh về nhóm điều hành qua dịch vụ gửi tin nhắn tức thời để đội ngũ kỹ thuật xử lý sự cố khẩn cấp (P0) chỉ trong vài phút.

---

### Kiến trúc Tự động hóa Bằng chứng & Kênh Tiếp nhận Sự cố

#### 1. Cơ chế Chụp ảnh màn hình thực tế tự động
* Khi người dùng nhấp mở nút "Báo lỗi & Góp ý", hệ thống tự động kích hoạt tiến trình tạo ảnh chụp toàn bộ giao diện làm việc hiện tại.
* Cửa sổ báo lỗi được tự động loại trừ khỏi ảnh chụp, đảm bảo bức ảnh thể hiện trung thực trạng thái màn hình phía sau (bảng biểu, số liệu, dòng lỗi phát sinh).
* Hỗ trợ công cụ **Chụp lại** nhanh và tính năng **Dán ảnh từ bộ nhớ tạm bằng phím tắt <kbd>Ctrl + V</kbd>** (khi người dùng cắt cúp bằng phím chụp màn hình hệ điều hành).

#### 2. Cơ chế Tự động ghi nhận Nhật ký thao tác (Action Trail)
* Hệ thống duy trì một bộ lắng nghe hành vi nhẹ nhàng trong phiên làm việc, tự động lưu trữ các sự kiện:
  * Thao tác nhấp chuột vào các nút hành động, thẻ bảng, bộ lọc (kèm nhãn nút bấm).
  * Thao tác chuyển trang, điều hướng màn hình.
  * Các cảnh báo lỗi hoặc thông báo phát sinh.
* Khi người dùng mở cửa sổ báo lỗi, danh sách 6 thao tác gần nhất được trích xuất tức thì kèm mốc thời gian chi tiết đến từng giây (ví dụ: `11:29:03 [Nhấp chuột] Nút xác nhận`, `11:29:03 [Điều hướng] Khởi tạo trang: /app/student_operations_alert`).

#### 3. Kênh Tiếp nhận & Phân loại Sự cố tức thì
* Toàn bộ dữ liệu (Tiêu đề, Phân loại, Mức độ ưu tiên, Đường dẫn màn hình, Họ tên người gửi, Thời gian, Nhật ký hành vi và Ảnh chụp màn hình) được đóng gói và gửi thẳng về kênh điều hành xử lý sự cố.
* Nhóm kỹ thuật nhận được thông báo ngay lập tức trên thiết bị di động kèm hình ảnh trực quan và chuỗi bước tái hiện rõ ràng.

---

### Ràng buộc nghiệp vụ toàn cục (Global Rules):

* **[RULE-SYS-05] Không bắt buộc nhập mô tả dài dòng:** Để giảm thiểu rào cản cho người dùng khi gặp sự cố, trường mô tả chi tiết không bắt buộc nhập. Nếu người dùng để trống, hệ thống tự động sinh mô tả tiêu chuẩn dựa trên màn hình hiện tại và loại phản hồi.
* **[RULE-SYS-06] Lược bỏ tab chuyển đổi rườm rà:** Bỏ hoàn toàn các tab "Gửi mới" và "Lịch sử" trong cửa sổ báo lỗi để giữ giao diện luôn ở trạng thái sẵn sàng ghi nhận sự cố 1 chạm.
* **[RULE-SYS-07] Bố cục 2 cột phân định rạch ròi:** Cột bên trái dành riêng cho việc hiển thị bằng chứng tự động (ảnh chụp, liên kết trang web, nhật ký thao tác); Cột bên phải dành cho các trường tương tác của người dùng (phân loại, mức độ, tiêu đề, mô tả, nút gửi).
* **[RULE-SYS-08] Liền mạch khu vực nút gửi:** Hàng nút bấm ở đáy biểu mẫu không sử dụng đường kẻ ngang ngăn cách, tạo cảm giác thông thoáng, liên tục với khung nhập mô tả bên trên.

---

## 2. MÔ TẢ GIAO DIỆN (UI DESCRIPTION & ADJUSTMENT MATRIX)

### Giao diện: Thanh Header Station & Cửa Sổ Báo Lỗi 2 Cột

---

### 2.1 Cụm nút Báo lỗi & Góp ý trên Thanh điều hướng (Header) - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Nút bấm Báo lỗi & Góp ý** | Nút viền bo tròn hình viên thuốc | Biểu tượng bọ cánh cam và nhãn `Báo lỗi & Góp ý` | Nằm cạnh nút HDSD trên thanh điều hướng; sử dụng gam màu hổ phách/cam dịu nhẹ nổi bật vừa đủ. Nhấp để bật cửa sổ báo lỗi. | **Bổ sung:** Đưa nút báo lỗi thường trực lên thanh điều hướng trên cùng, người dùng có thể kích hoạt tại mọi màn hình. |

---

### 2.2 Bố cục Panel Trái: Ảnh chụp màn hình, Đường dẫn và Nhật ký thao tác - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Khung xem trước Ảnh chụp** | Khung hiển thị tỉ lệ 16:9 bo góc có bóng đổ nhẹ | Ảnh chụp giao diện thực tế của màn hình | Tự động tạo ảnh khi mở cửa sổ; góc dưới có huy hiệu xanh `Đã chụp màn hình`, góc trên có nút `[X]` để xóa ảnh khi không cần thiết. | **Bổ sung:** Tích hợp ảnh chụp thực tế tự động, xóa bỏ hoàn toàn thẻ đồ họa mô phỏng màu đen của bản cũ. |
| **Nút Chụp lại** | Nút liên kết văn bản nhỏ kèm biểu tượng làm mới | Kích hoạt tiến trình chụp ảnh | Nằm cạnh tiêu đề "Ảnh chụp màn hình:"; nhấp để chụp lại ảnh màn hình mới nhất. | **Điều chỉnh:** Tinh giản thành một nút "Chụp lại" duy nhất, lược bỏ các nút phức tạp gây phân vân cho người dùng. |
| **Khung chỉ dẫn khi chưa có ảnh** | Khung viền nét đứt nền xám nhạt | Biểu tượng máy ảnh và hướng dẫn phím tắt | Hiển thị thông điệp hướng dẫn: "Chưa có ảnh. Bạn có thể bấm chụp hoặc nhấn Ctrl + V để dán ảnh." kèm nút bấm chụp. | **Bổ sung:** Hỗ trợ tính năng dán ảnh trực tiếp từ bộ nhớ tạm (<kbd>Ctrl + V</kbd>) sau khi dùng phím tắt chụp màn hình. |
| **Khối Màn hình & Đường dẫn** | Khung thẻ nhỏ bo góc | Tên màn hình và liên kết URL đầy đủ | Hiển thị tên màn hình hiện tại (ví dụ: `Chi tiết chăm sóc`) và đường dẫn trang web kèm nút sao chép liên kết 1 chạm. | **Bổ sung:** Đưa thông tin màn hình và liên kết sang cột trái để kỹ thuật đối chiếu chính xác địa chỉ xảy ra lỗi. |
| **Khối Nhật ký thao tác vừa thực hiện** | Khung danh sách có thanh cuộn | Tối đa 6 thao tác gần nhất kèm thời gian | Tự động liệt kê các hành vi nhấp chuột, chuyển trang hoặc lỗi theo mốc thời gian chi tiết đến từng giây. | **Bổ sung:** Bổ sung danh sách thao tác tự động ghi, cung cấp các bước tái hiện sự cố chuẩn xác cho đội ngũ kiểm thử. |

---

### 2.3 Bố cục Panel Phải: Phân loại, Mức độ nghiêm trọng, Biểu mẫu và Nút gửi - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Bộ chọn Phân loại phản hồi** | Lưới 4 nút bấm dạng thẻ nhỏ | `Báo lỗi` (Đỏ), `Giao diện` (Tím), `Nghiệp vụ` (Lam), `Ý kiến khác` (Cam) | Cho phép chọn 1 phân loại duy nhất. Mặc định là `Báo lỗi`. Thẻ được chọn có viền sáng và nền nổi bật. | **Điều chỉnh:** Giữ nguyên 4 phân loại trực quan, tối ưu khoảng cách hiển thị vừa vặn trong cột phải. |
| **Bộ chọn Mức độ nghiêm trọng** | Dãy 3 nút bấm viên thuốc | `Bình thường`, `Cao`, `🚨 Khẩn cấp (P0)` | Chọn 1 mức độ. Mức độ Khẩn cấp P0 có viền đỏ đậm và chữ in đậm cảnh báo sự cố gián đoạn vận hành trung tâm. | **Điều chỉnh:** Đồng bộ nhãn cảnh báo khẩn cấp P0 để ưu tiên xử lý trong luồng trực ban kỹ thuật. |
| **Ô nhập Tiêu đề tóm tắt** | Ô nhập văn bản một dòng | Văn bản tự do; chỉ hiển thị chữ gợi ý mờ | Placeholder: `Tiêu đề (VD: Nút xác nhận bị đơ...)`. Không có dòng tiêu đề chữ phía trên. | **Điều chỉnh:** Lược bỏ nhãn tiêu đề bên trên theo phản hồi của người dùng, giữ ô nhập phẳng thoáng đãng. |
| **Khung nhập Mô tả chi tiết** | Khung văn bản nhiều dòng tự co giãn | Văn bản tự do; không bắt buộc | Placeholder: `Mô tả chi tiết nếu cần (hoặc để trống bấm Gửi luôn)...`. Tự động mở rộng chiều cao lấp đầy khoảng trống. | **Điều chỉnh:** Lược bỏ nhãn tiêu đề bên trên và bỏ ràng buộc bắt buộc nhập, cho phép người dùng gửi nhanh 1 chạm. |
| **Hàng nút chân trang** | Cụm nút căn lề phải ở đáy cột | Nút `Đóng` và nút `Gửi Telegram` | Nút Đóng viền mỏng; Nút Gửi Telegram màu đỏ nổi bật cho Báo lỗi (hoặc màu xanh cho Giao diện/Nghiệp vụ). | **Điều chỉnh:** Bỏ hoàn toàn đường kẻ ngang phân cách bên trên hàng nút bấm, tạo sự liền mạch với khung mô tả. |
| **<span style="color: rgb(255,86,48);">Thanh chuyển tab Gửi mới / Lịch sử (Bản cũ)</span>** | Thanh nút chuyển tab trên đỉnh | Chuyển đổi giữa gửi mới và xem lại lịch sử | Gây phân tâm và làm chật chội không gian thao tác khi cần báo lỗi gấp. | <span style="color: rgb(255,86,48);">**Lược bỏ:** Gỡ bỏ hoàn toàn thanh tab; cửa sổ luôn mở thẳng vào biểu mẫu gửi mới.</span> |

---

## 3. KHỐI CHỨC NĂNG CHI TIẾT: ACTION & LUỒNG KÍCH HOẠT (ACTIONS & EVENTS)

### Khối chức năng 1: Mở popover và tự động ghi nhận ngữ cảnh sự cố

#### Action 1.1: Nhấp nút Báo lỗi & Góp ý trên thanh điều hướng
* **Luồng kích hoạt:** Người dùng nhấp chuột vào nút **Báo lỗi & Góp ý** trên thanh điều hướng trên cùng.
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC-1 (Happy Path - Tự động ghi lại ảnh màn hình, liên kết và nhật ký thao tác):**
    - **Giả sử:** Người dùng đang thao tác tại màn hình "Chi tiết chăm sóc" và vừa nhấp mở một thẻ học viên.
    - **Khi:** Người dùng nhấp vào nút "Báo lỗi & Góp ý".
    - **Thì:** Cửa sổ 2 cột mở ra mượt mà; cột trái tự động chụp lại ảnh màn hình làm việc phía sau và hiển thị trong khung xem trước; đường dẫn URL được cập nhật đầy đủ; danh sách hiển thị các thao tác vừa thực hiện; cột phải sẵn sàng tiếp nhận thông tin.
  - **AC-2 (Happy Path - Tự động cập nhật thời gian mở sự cố):**
    - **Giả sử:** Người dùng kích hoạt báo lỗi tại thời điểm bất kỳ trong ngày.
    - **Khi:** Cửa sổ nổi hiển thị.
    - **Thì:** Góc trên bên phải cửa sổ tự động hiển thị mốc thời gian thực theo định dạng `Giờ:Phút:Giây Ngày/Tháng/Năm`.

#### Action 1.2: Chụp lại hoặc Dán ảnh chụp bằng phím tắt
* **Luồng kích hoạt:** Người dùng chụp ảnh màn hình bằng phím tắt hệ điều hành và nhấn phím <kbd>Ctrl + V</kbd> trong cửa sổ báo lỗi.
* **Tiêu chí nghiệm thu:**
  - **AC-3 (Happy Path - Dán ảnh màn hình từ bộ nhớ tạm):**
    - **Giả sử:** Người dùng vừa chụp một vùng lỗi trên màn hình bằng công cụ chụp ảnh của hệ điều hành.
    - **Khi:** Người dùng đang mở cửa sổ báo lỗi và nhấn tổ hợp phím <kbd>Ctrl + V</kbd>.
    - **Thì:** Ảnh từ bộ nhớ tạm được nạp ngay lập tức vào khung xem trước ở cột trái, hiển thị thông báo "Đã dán ảnh từ bộ nhớ tạm" và thay thế ảnh chụp tự động trước đó.

---

### Khối chức năng 2: Điền thông tin và gửi phản hồi đến kênh điều hành

#### Action 2.1: Lựa chọn phân loại và mức độ nghiêm trọng
* **Luồng kích hoạt:** Người dùng nhấp chọn loại phản hồi hoặc mức độ nghiêm trọng.
* **Tiêu chí nghiệm thu:**
  - **AC-4 (Happy Path - Đổi mức độ khẩn cấp P0):**
    - **Giả sử:** Sự cố đang xảy ra làm nghẽn toàn bộ quy trình điểm danh tại trung tâm.
    - **Khi:** Người dùng nhấp chọn mức độ "Khẩn cấp (P0)".
    - **Thì:** Nút mức độ P0 sáng đỏ nổi bật, nút gửi đổi sang trạng thái cảnh báo ưu tiên cao để khi gửi đến kênh điều hành sẽ kích hoạt chuông báo khẩn cấp.

#### Action 2.2: Gửi báo cáo sự cố kèm đầy đủ bằng chứng
* **Luồng kích hoạt:** Người dùng nhấp chuột vào nút **Gửi Telegram** ở góc dưới cùng bên phải.
* **Tiêu chí nghiệm thu:**
  - **AC-5 (Happy Path - Gửi báo cáo thành công có đính kèm ảnh và nhật ký thao tác):**
    - **Giả sử:** Cột trái đã có ảnh chụp màn hình và nhật ký 6 thao tác; cột phải người dùng đã chọn phân loại Báo lỗi.
    - **Khi:** Người dùng bấm nút "Gửi Telegram".
    - **Thì:** Nút chuyển sang trạng thái "Đang gửi..."; hệ thống gửi gói dữ liệu kèm ảnh chụp đến dịch vụ gửi tin nhắn của kênh điều hành; hiển thị thông báo thành công "Đã gửi báo lỗi kèm ảnh chụp & nhật ký thao tác về kênh điều hành!"; các ô nhập được làm trống và cửa sổ tự động đóng lại.
  - **AC-6 (Happy Path - Tự động điền mô tả mặc định khi để trống nội dung):**
    - **Giả sử:** Người dùng chỉ muốn báo lỗi nhanh với ảnh chụp mà không gõ thêm văn bản mô tả.
    - **Khi:** Người dùng để trống cả tiêu đề và mô tả chi tiết rồi bấm "Gửi Telegram".
    - **Thì:** Hệ thống tự động thiết lập tiêu đề mặc định dạng `Báo lỗi tại [Tên màn hình]` và nội dung mô tả mặc định tương ứng, gửi trọn vẹn dữ liệu ảnh và nhật ký thao tác đi mà không chặn người dùng.

---

## 4. CÁC TRƯỜNG HỢP GÓC CẠNH & LUỒNG NGOẠI LỆ (CORNER CASES & EXCEPTION FLOWS)

* **[CASE-01] Mạng internet bị ngắt kết nối hoặc mất tín hiệu khi bấm Gửi:**
  * **Tình huống:** Đường truyền mạng tại cơ sở bị mất kết nối đúng lúc người dùng nhấn nút "Gửi Telegram".
  * **Xử lý:** Nút gửi dừng trạng thái xoay vòng, hiển thị cảnh báo màu vàng "Đã lưu nội dung! Lỗi kết nối gửi tin nhắn", đồng thời nội dung đã nhập vẫn được bảo lưu tạm thời trong phiên làm việc để người dùng không bị mất dữ liệu khi kết nối lại.
* **[CASE-02] Ảnh chụp màn hình dung lượng lớn hoặc thời gian tạo ảnh chậm:**
  * **Tình huống:** Màn hình có nhiều bảng dữ liệu và đồ họa phức tạp, quá trình tạo ảnh kéo dài hơn 1 giây.
  * **Xử lý:** Cột trái hiển thị nhãn chữ màu cam kèm biểu tượng tải dữ liệu xoay vòng "Đang chụp..."; người dùng vẫn có thể nhập tiêu đề và chọn phân loại ở cột phải song song mà không bị khóa đơ giao diện.
* **[CASE-03] Người dùng mở báo lỗi khi chưa phát sinh thao tác nào trên hệ thống:**
  * **Tình huống:** Người dùng vừa đăng nhập và tải trang lần đầu tiên thì gặp lỗi ngay lập tức mà chưa nhấp chuột vào đâu.
  * **Xử lý:** Danh sách thao tác tự động ghi nhận 1 dòng sự kiện khởi tạo trang hiện tại kèm thời gian; nếu hoàn toàn không có thao tác nào thì hiển thị dòng chữ in nghiêng màu xám "Chưa có thao tác nào được ghi nhận" một cách tự nhiên.
* **[CASE-04] Hệ quả phân loại Khẩn cấp (P0) đối với quy trình tiếp nhận sự cố:**
  * **Tình huống:** Báo cáo gửi đi với mức độ "Khẩn cấp (P0)".
  * **Xử lý:** Thông điệp gửi đến kênh điều hành được đính kèm biểu tượng còi báo động đỏ, tự động kích hoạt thẻ gắn tên trưởng nhóm trực ban kỹ thuật để đảm bảo thời gian phản hồi dưới 5 phút.
* **[CASE-05] Mở cửa sổ báo lỗi trên màn hình đang hiển thị hộp thoại dữ liệu:**
  * **Tình huống:** Người dùng đang mở một hộp thoại xếp lớp hoặc biểu mẫu học viên và phát hiện lỗi bên trong hộp thoại đó.
  * **Xử lý:** Cửa sổ báo lỗi được thiết lập lớp hiển thị trên cùng (cao hơn mọi hộp thoại khác). Tiến trình chụp ảnh tự động thu nạp toàn bộ nội dung của hộp thoại đang mở phía dưới, giúp kỹ thuật thấy rõ trạng thái lỗi của form dữ liệu.
* **[CASE-06] Xóa ảnh chụp màn hình và chỉ gửi nội dung văn bản:**
  * **Tình huống:** Người dùng phát hiện ảnh chụp chứa thông tin nhạy cảm riêng tư không muốn gửi kèm và bấm nút `[X]` trên ảnh.
  * **Xử lý:** Khung xem trước ảnh chuyển về trạng thái nét đứt ban đầu; khi người dùng bấm "Gửi Telegram", hệ thống tự động chuyển sang chế độ gửi tin nhắn văn bản thuần túy không kèm tệp ảnh, thông báo gửi đi vẫn bao gồm đầy đủ nhật ký thao tác và mô tả.
