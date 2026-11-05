---
id: US-XXX-YY-ZZ
title: "Nâng cấp / Điều chỉnh Giao diện [Tên Màn Hình / Nghiệp Vụ]"
bf: BF-XXX-YY
domain: CAP-XXX
persona: "PERSONA-BRANCH-MANAGER, PERSONA-CSM, PERSONA-TEACHER"
sr: "SR-XXX-001"
status: draft
tags: [upgrade, adjustment, ui-sync, actual-ui-sync]
---

# US-XXX-YY-ZZ: Nâng cấp / Điều chỉnh Giao diện [Tên Màn Hình / Nghiệp Vụ] ([English Title])

> **Tham chiếu:** `BF-XXX-YY` · `SR-XXX-001` · Giao diện Mẫu §4.2 (Màn hình Danh sách / Lưới / Biểu mẫu chuẩn)  
> **Đường dẫn màn hình & Trạng thái liên quan:**  
> - `[Tên Màn hình] (/app/[menu_id])` -> Chế độ xem: `[Tuần / Ngày / Danh sách]` | Trạng thái: `[Trạng thái 1]`, `[Trạng thái 2]`, `[Trạng thái 3]`  

---

## 1. NHẬT KÝ THAY ĐỔI & BỐI CẢNH (CHANGELOG & CONTEXT)

### Lịch sử cập nhật tài liệu (Changelog)

| Ngày cập nhật | Nội dung cập nhật | Lý do cập nhật |
|---|---|---|
| DD/MM/YYYY | Tinh giản và phân định rõ ràng 2 cột: Mô tả giao diện mới (biểu diễn trực quan kèm dữ liệu mẫu) và Nội dung điều chỉnh (phân loại rõ Bổ sung, Điều chỉnh, Lược bỏ) | Nâng cao độ mạch lạc, súc tích và trực quan theo góp ý của người dùng và thiết kế thực tế |

### Ràng buộc nghiệp vụ toàn cục (Global Rules):

* **[RULE-XXX-01] Bảo toàn dữ liệu & Không thay đổi xử lý hệ thống:** Việc nâng cấp chỉ điều chỉnh cách thức hiển thị và tương tác trên giao diện, giữ nguyên các trường dữ liệu và logic xử lý hệ thống đã có.
* **[RULE-XXX-02] Che số điện thoại chống sao chép hàng loạt:** Trong mọi thành phần hiển thị danh sách, bảng nổi và thẻ xem nhanh, số điện thoại của nhân sự hoặc phụ huynh (nếu có) phải được che ẩn ở giữa theo định dạng `091****111`. Chỉ người dùng có thẩm quyền mở màn hình chi tiết mới được xem số điện thoại đầy đủ.
* **[RULE-XXX-03] Thẻ trạng thái và số đếm đi theo toàn bộ bộ lọc:** Tất cả số lượng đếm trên tiêu đề, thẻ trạng thái và các phân nhóm phải tự động tính toán lại theo tổ hợp bộ lọc đang áp dụng tại thanh công cụ và bảng lọc nâng cao.
* **[RULE-XXX-04] Cơ chế Lọc Nháp trên Bảng điều khiển:** Việc chọn các tiêu chí lọc trong bảng điều khiển nâng cao thực hiện ở chế độ nháp; chỉ khi người dùng nhấp nút "Áp dụng", hệ thống mới thực hiện lọc lại dữ liệu.

---

## 2. MÔ TẢ GIAO DIỆN

### Giao diện: [https://www.figma.com/design/...](https://www.figma.com/design/...)

### 2.1 [Tên Cụm Giao Diện 1 - Ví dụ: Thanh công cụ & Bộ lọc] - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **[Tên Thành phần 1]** | Hộp chọn thả xuống | Danh sách [Dữ liệu nguồn] | Cho phép chọn 1 giá trị duy nhất. Giá trị mặc định là [Giá trị mặc định]. | **Điều chỉnh:** Di dời vị trí từ [Vị trí cũ] sang [Vị trí mới] để định hình phạm vi dữ liệu trước tiên. |
| **[Tên Thành phần 2]** | Hộp chọn thả xuống | `Tất cả` hoặc [Tên danh mục cụ thể] | Lọc nhanh các bản ghi thuộc danh mục đã chọn. Mặc định là `Tất cả`. | **Bổ sung:** Đưa bộ chọn nhanh trực tiếp lên thanh công cụ chính, cho phép lọc 1 chạm. |
| **<span style="color: rgb(255,86,48);">[Tên Thành phần Lược bỏ]</span>** | Nút bấm / Ô chọn | Dữ liệu thừa không sử dụng | Thành phần không còn phù hợp với quy trình vận hành thực tế. | <span style="color: rgb(255,86,48);">**Lược bỏ:** Gỡ bỏ hoàn toàn thành phần này khỏi thanh công cụ.</span> |

### 2.2 [Tên Cụm Giao Diện 2 - Ví dụ: Thẻ hiển thị / Bảng danh sách] - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **[Tên Khối thẻ / Bảng]** | Khối thẻ tương tác hình chữ nhật | Hiển thị dữ liệu thực thể [Tên thực thể] | Thẻ được xếp vào đúng vị trí và nhóm tương ứng. Có hiệu ứng nổi nhẹ và viền sáng khi rê chuột. | **Điều chỉnh:** Thêm viền màu chỉ thị trạng thái đậm hơn theo loại thực thể. |
| **Dòng 1: [Tiêu đề / Tên chính]** | Văn bản tĩnh, in đậm | Tên thực thể / Tiêu đề buổi | Chỉ hiển thị trong 1 dòng. Nếu tên dài, tự động chuyển về dạng "..." ở cuối. | **Điều chỉnh:** Giới hạn tên trong 1 dòng, hiển thị "..." nếu tên quá dài. |
| **<span style="color: rgb(255,86,48);">[Thông tin Lược bỏ]</span>** | Văn bản tĩnh | Dữ liệu phụ rườm rà | Không cần thiết hiển thị trực tiếp trên thẻ tóm tắt. | <span style="color: rgb(255,86,48);">**Lược bỏ:** Lược bỏ thông tin này để tinh giản diện tích thẻ.</span> |
| **Dòng chân thẻ: [Nhân sự & Chỉ số]** | Biểu tượng & Nhãn văn bản | Chỉ số hoàn thành / Sĩ số & Tên nhân sự | Hiển thị đầy đủ biểu tượng và họ tên nhân sự. Nếu chưa phân công thì hiện nhãn cam cảnh báo. | **Điều chỉnh:** Hiển thị họ tên đầy đủ thay vì chỉ hiện chữ cái viết tắt mơ hồ. |

### 2.3 [Tên Cụm Giao Diện 3 - Ví dụ: Bảng điều khiển Lọc nâng cao] - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Bộ lọc theo [Tiêu chí mới]** | Nhãn và Danh sách hộp kiểm | Danh sách các giá trị phân loại | Cho phép chọn nhiều giá trị đồng thời để áp dụng lọc kết hợp. | **Bổ sung:** Bổ sung nhóm lọc mới trong bảng điều khiển lọc nâng cao. |
| **Tìm kiếm nhân sự phụ trách** | Ô nhập văn bản kèm hộp kiểm | Danh sách nhân sự tại cơ sở | Nhập từ khóa để lọc nhanh tên nhân sự trong danh sách dài. | **Bổ sung:** Ô tìm kiếm nhanh nhân sự và cơ chế thu gọn/mở rộng nhóm lọc. |

### 2.4 [Tên Cụm Giao Diện 4 - Ví dụ: Bảng nổi Xem nhanh khi rê chuột] - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Thẻ nổi Xem nhanh** | Khung thẻ nổi màu trắng bo góc | Bật lên sau 200 phần nghìn giây khi rê chuột | Tự động tính toán vị trí hiển thị thông minh không tràn mép màn hình; tự đóng khi con trỏ chuột rời khỏi vùng thẻ. | **Bổ sung:** Xem nhanh nội dung chi tiết và tóm tắt mà không cần chuyển trang hoặc mở hộp thoại lớn. |

---

## 3. KHỐI CHỨC NĂNG CHI TIẾT: ACTION & LUỒNG KÍCH HOẠT (ACTIONS & EVENTS)

### Khối chức năng 1: [Tên Khối chức năng 1 - Ví dụ: Điều hướng và Bộ lọc nhanh]

#### Action 1.1: [Tên Action - Ví dụ: Chuyển đổi bộ lọc nhanh trên thanh công cụ]
* **Luồng kích hoạt:** Người dùng nhấp chọn một giá trị trên ô chọn bộ lọc nhanh.
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC-1 (Happy Path - Lọc dữ liệu theo tiêu chí đã chọn):**
    - **Giả sử:** Người dùng đang ở màn hình [Tên màn hình] và có quyền xem dữ liệu cơ sở.
    - **Khi:** Người dùng nhấp chọn tiêu chí "[Tiêu chí mẫu]".
    - **Thì:** Danh sách / Lưới tự động làm mới, chỉ hiển thị các bản ghi thuộc tiêu chí đã chọn; số lượng đếm trên từng phân nhóm được tính toán lại chính xác.
  - **AC-2 (Happy Path - Khôi phục hiển thị tất cả):**
    - **Giả sử:** Danh sách đang được lọc theo một tiêu chí cụ thể.
    - **Khi:** Người dùng chọn lại "Tất cả".
    - **Thì:** Hệ thống khôi phục hiển thị toàn bộ danh sách dữ liệu ban đầu.

---

### Khối chức năng 2: [Tên Khối chức năng 2 - Ví dụ: Tương tác gập mở phân nhóm]

#### Action 2.1: [Tên Action - Ví dụ: Nhấp tiêu đề nhóm để Thu gọn hoặc Mở rộng]
* **Luồng kích hoạt:** Người dùng nhấp chuột vào thanh tiêu đề của một nhóm bất kỳ.
* **Tiêu chí nghiệm thu:**
  - **AC-3 (Happy Path - Thu gọn nhóm để tối ưu không gian hiển thị):**
    - **Giả sử:** Toàn bộ các nhóm đang ở trạng thái mở rộng.
    - **Khi:** Người dùng nhấp vào thanh tiêu đề của "[Nhóm mẫu]".
    - **Thì:** Toàn bộ nội dung của nhóm đó thu gọn lại, biểu tượng mũi tên trên thanh tiêu đề xoay ngang, chỉ hiển thị thanh tiêu đề và tổng số lượng; các nhóm khác vẫn giữ nguyên trạng thái mở.

---

### Khối chức năng 3: [Tên Khối chức năng 3 - Ví dụ: Tương tác trên thẻ hoặc dòng dữ liệu]

#### Action 3.1: [Tên Action - Ví dụ: Rê chuột xem Thẻ nổi chi tiết]
* **Luồng kích hoạt:** Người dùng di chuyển con trỏ chuột vào vùng thẻ và dừng lại 200 phần nghìn giây.
* **Tiêu chí nghiệm thu:**
  - **AC-4 (Happy Path - Hiển thị thẻ nổi thông tin chi tiết nhanh):**
    - **Giả sử:** Người dùng muốn xem nhanh thông tin tóm tắt mà không muốn rời khỏi trang.
    - **Khi:** Người dùng rê chuột vào thẻ bản ghi "[Mã định danh mẫu]" và dừng 200 phần nghìn giây.
    - **Thì:** Thẻ nổi tự động hiển thị mượt mà phía trên hoặc bên cạnh thẻ, bao gồm đầy đủ các thông tin tóm tắt; khi con trỏ chuột rời khỏi thẻ thì thẻ nổi tự động biến mất.

---

## 4. CÁC TRƯỜNG HỢP GÓC CẠNH & LUỒNG NGOẠI LỆ (CORNER CASES & EXCEPTION FLOWS)

### **Nhóm 1: [Tên Nhóm 1 - Ví dụ: Khung hiển thị & Điều hướng]**
* **[CASE-01] [Tên trường hợp - Ví dụ: Nhóm dữ liệu không có bản ghi phát sinh sau khi lọc]:**
  * **Tình huống:** Trong phạm vi thời gian hoặc sau khi áp dụng bộ lọc, một nhóm dữ liệu hoàn toàn không có bản ghi nào.
  * **Xử lý:** Thanh tiêu đề của nhóm đó tự động ẩn hoàn toàn khỏi giao diện, không hiển thị khoảng trống thừa; các nhóm khác tự động dồn lên để tối ưu không gian hiển thị.
* **[CASE-02] [Tên trường hợp - Ví dụ: Điều hướng khi nhóm đang ở trạng thái thu gọn]:**
  * **Tình huống:** Người dùng đã nhấn gập gọn một nhóm, sau đó thực hiện chuyển trang hoặc chuyển mốc thời gian.
  * **Xử lý:** Giao diện duy trì trạng thái thu gọn của nhóm đó xuyên suốt các lần điều hướng, không tự động bung mở lại làm xáo trộn bố cục người dùng đang theo dõi.

---

### **Nhóm 2: [Tên Nhóm 2 - Ví dụ: Thẻ hiển thị & Nội dung đặc biệt]**
* **[CASE-03] [Tên trường hợp - Ví dụ: Tiêu đề hoặc tên bản ghi có độ dài vượt khung]:**
  * **Tình huống:** Tên bản ghi quá dài vượt quá độ rộng của thẻ hiển thị hoặc cột bảng.
  * **Xử lý:** Dòng hiển thị tự động cắt bớt văn bản và hiển thị dấu ba chấm (`...`) ở cuối để không làm vỡ chiều cao thẻ. Toàn bộ tên đầy đủ sẽ được hiển thị khi người dùng rê chuột vào hoặc mở xem chi tiết.
* **[CASE-04] [Tên trường hợp - Ví dụ: Chưa phát sinh dữ liệu chỉ số hoặc chưa gán nhân sự]:**
  * **Tình huống:** Bản ghi chưa được gán nhân sự phụ trách hoặc chưa phát sinh dữ liệu chỉ số đánh giá.
  * **Xử lý:** Hiển thị nhãn cảnh báo `Chưa gán` màu cam nổi bật để cảnh báo người quản lý, tránh để trống gây hiểu lầm.
* **[CASE-05] [Tên trường hợp - Ví dụ: Phát sinh thêm đối tượng bổ sung / học thử / ngoại lệ (+n)]:**
  * **Tình huống:** Bản ghi phát sinh thêm đối tượng ngoại lệ hoặc học viên mới ghép vào.
  * **Xử lý:** Hiển thị thêm ký hiệu `(+n)` cùng biểu tượng nhận diện màu cam nổi bật; nếu không có (n=0), ký hiệu này tự động ẩn hoàn toàn.

---

### **Nhóm 3: [Tên Nhóm 3 - Ví dụ: Bộ lọc nâng cao & Điều kiện kết hợp]**
* **[CASE-06] [Tên trường hợp - Ví dụ: Tìm kiếm trong bộ lọc không có dữ liệu trùng khớp]:**
  * **Tình huống:** Người dùng nhập từ khóa tìm kiếm nhân sự hoặc danh mục không tồn tại trong danh sách.
  * **Xử lý:** Danh sách gợi ý hiển thị thông báo không tìm thấy kết quả phù hợp, đồng thời giữ nguyên trạng thái tích chọn của các tiêu chí khác đang có.
* **[CASE-07] [Tên trường hợp - Ví dụ: Chọn kết hợp đồng thời nhiều tiêu chí lọc]:**
  * **Tình huống:** Người dùng tích chọn đồng thời từ 2 tiêu chí lọc trở lên trong bảng lọc nâng cao.
  * **Xử lý:** Danh sách lọc và hiển thị tất cả các bản ghi thỏa mãn điều kiện kết hợp; các chỉ số đếm trên thanh tiêu đề tự động cập nhật tổng số lượng khớp chính xác.
