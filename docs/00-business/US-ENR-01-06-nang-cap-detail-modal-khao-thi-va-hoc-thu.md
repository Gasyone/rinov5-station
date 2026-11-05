---
id: US-ENR-01-06
title: "Nâng cấp Hộp thoại Chi tiết Dòng sự kiện Khảo thí & Học thử Học viên"
bf: BF-ENR-01
domain: CAP-ADM
persona: "PERSONA-BRANCH-MANAGER, PERSONA-CSM, PERSONA-TEACHER"
sr: "SR-ADM-006"
status: draft
tags: [upgrade, adjustment, ui-sync, actual-ui-sync, admissions, booking-test, trial-class, unified-detail]
---

# US-ENR-01-06: Nâng cấp Hộp thoại Chi tiết Dòng sự kiện Khảo thí & Học thử Học viên (Unified Assessment & Trial Detail Modal)

> **Tham chiếu:** `BF-ENR-01` · `SR-ADM-006` · Giao diện Mẫu §4.3 (Hộp thoại chi tiết chuẩn)  
> **Đường dẫn màn hình & Trạng thái liên quan:**  
> - `Kiểm tra đầu vào (/app/booking_test)` -> Trạng thái: `Đã đặt lịch`, `Đã đến`, `Đang đánh giá`, `Hoàn tất`, `Không đạt`, `Đã hủy`  
> - `Lớp học thử (/app/trial_class)` -> Trạng thái: `Chờ xác nhận`, `Đã ghép lớp`, `Cần đổi lịch`, `Hoàn thành`, `Từ chối ghép`, `Đã hủy`  

---

## 1. NHẬT KÝ THAY ĐỔI & BỐI CẢNH (CHANGELOG & CONTEXT)

### Lịch sử cập nhật tài liệu (Changelog)

| Ngày cập nhật | Nội dung cập nhật | Lý do cập nhật |
|---|---|---|
| 27/10/2026 | Tăng bề rộng hộp thoại lên một bước, tăng bề rộng panel trái và giữ cố định panel phải; bỏ đường kẻ dưới tiêu đề, xóa mã định danh và trạng thái thừa ở tiêu đề; chuyển thanh chọn môn thành các nút bấm độc lập nổi bật khi chọn | Tối ưu không gian hiển thị cho các thẻ đánh giá ở panel trái, làm tinh gọn tiêu đề hộp thoại và tăng tính trực quan cho bộ chọn môn học |
| 27/10/2026 | Bổ sung nhãn trạng thái cuối chuẩn (Hoàn tất, Đã hủy, Không đạt, Không đến) trên thanh tiêu đề của từng thẻ Lần; bổ sung nút Sửa trình độ học viên và tái sử dụng hộp thoại cập nhật trình độ theo kết quả mới nhất | Đảm bảo tính nhất quán về trạng thái theo chuẩn hệ thống và cho phép cập nhật linh hoạt trình độ học viên |
| 27/10/2026 | Tách phân vùng Lịch sử ở giữa panel trái; thu gọn các lần kiểm tra trước đó và hiển thị nổi bật ca kiểm tra hiện tại; đưa thao tác nhận xét và kết quả xuống cùng dòng với điểm số | Tối ưu hóa phân tầng thị giác, giúp người dùng tập trung xử lý ca kiểm tra hiện tại mà không bị rối bởi danh sách các lần cũ |
| 27/10/2026 | Gộp liên kết xem bài làm từ máy tính bảng vào dòng Điểm trắc nghiệm (LWR); Gộp thao tác nhận xét vào dòng Điểm Nói (Speaking); Xóa bỏ dòng tiêu đề kết quả dư thừa; Đưa các nút hành động (Hủy lịch, Check-in, Hoàn tất) về từng thẻ Lần và loại bỏ thanh chân hộp thoại | Tối ưu hóa ngữ cảnh thao tác trực tiếp trên từng lần, loại bỏ thanh chân hộp thoại dùng chung gây nhầm lẫn khi học viên có nhiều lần kiểm tra, và tăng tính cân đối giữa hai cột điểm |
| 26/10/2026 | Tách riêng hai khối Học viên và Phụ huynh; đưa trình độ sau kiểm tra lên trên, thông tin trường và học lực xuống dưới; loại bỏ thẻ thời hạn và phụ trách riêng biệt | Tối ưu hóa cấu trúc cột hồ sơ, xóa bỏ thông tin trùng lặp gây hiểu nhầm và tập trung vào trình độ cốt lõi |
| 26/10/2026 | Bỏ nút lọc tất cả các môn, chuyển sang bộ chọn từng môn riêng rẽ; gom trọn vẹn thông tin lần và kết quả đánh giá vào một thẻ duy nhất cho từng lần | Tối ưu hóa tính chuyên môn hóa theo môn học và loại bỏ sự phân mảnh giữa lịch hẹn và kết quả đánh giá theo góp ý người dùng |

### Ràng buộc nghiệp vụ toàn cục (Global Rules):

* **[RULE-ADM-01] Bảo toàn dữ liệu & Không thay đổi xử lý hệ thống:** Việc nâng cấp chỉ điều chỉnh cách thức hiển thị và tương tác trên giao diện hộp thoại chi tiết, giữ nguyên cấu trúc các trường dữ liệu và cơ chế xử lý nghiệp vụ sẵn có.
* **[RULE-ADM-02] Che số điện thoại chống sao chép hàng loạt:** Trong mọi thành phần hiển thị danh sách, bảng nổi và thẻ xem nhanh, số điện thoại của nhân sự hoặc phụ huynh phải được che ẩn ở giữa theo định dạng `098****555`. Chỉ người dùng có thẩm quyền mở màn hình chi tiết mới được xem số điện thoại đầy đủ và sử dụng nút sao chép.
* **[RULE-ADM-03] Thẻ trạng thái và số đếm đi theo toàn bộ bộ lọc:** Tất cả số lượng đếm trên tiêu đề, thẻ trạng thái và các phân nhóm phải tự động tính toán lại theo tổ hợp bộ lọc đang áp dụng tại thanh công cụ và bảng lọc nâng cao.
* **[RULE-ADM-04] Cơ chế Lọc Nháp trên Bảng điều khiển:** Việc chọn các tiêu chí lọc trong bảng điều khiển nâng cao thực hiện ở chế độ nháp; chỉ khi người dùng nhấp nút "Áp dụng", hệ thống mới thực hiện lọc lại dữ liệu.

---

## 2. MÔ TẢ GIAO DIỆN

### Giao diện: [https://www.figma.com/design/frct7JUaJQBN2uOSyfMqcL/Rinoedu?node-id=154-81](https://www.figma.com/design/frct7JUaJQBN2uOSyfMqcL/Rinoedu?node-id=154-81)

### 2.1 Cụm Tiêu đề & Điều hướng Hộp thoại - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Tiêu đề hộp thoại** | Dòng văn bản tinh gọn | Tiêu đề hộp thoại | Loại bỏ đường kẻ ngang dưới tiêu đề, xóa bỏ mã định danh và trạng thái thừa để không gian thanh thoát. | **Điều chỉnh:** Giữ tiêu đề thuần túy "Chi tiết Phiếu kiểm tra đầu vào", loại bỏ đường kẻ dưới, mã phiếu và trạng thái thừa. |
| **Kích thước hộp thoại** | Khung hiển thị mở rộng | Bề rộng hộp thoại | Tăng bề rộng hộp thoại lên mức rộng rãi hơn, dành toàn bộ không gian gia tăng cho panel trái, giữ nguyên bề rộng panel phải. | **Điều chỉnh:** Tăng bề rộng tổng thể hộp thoại, mở rộng tối đa panel trái để các thẻ đánh giá không bị co cụm. |
| **Nút đóng hộp thoại** | Nút biểu tượng góc phải | Thao tác đóng hộp thoại | Nhấp để đóng hộp thoại và khôi phục màn hình danh sách ban đầu. | **Điều chỉnh:** Giữ nguyên vị trí góc phải trên cùng với độ trễ phản hồi tức thì. |

### 2.2 Panel Phải (40% diện tích): Hồ sơ Học viên & Phụ huynh tách riêng hai khối - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Khối Thông tin Học viên** | Khung thẻ chữ nhật phẳng bo góc nhẹ | Họ tên, tuổi, ngày sinh, trình độ, trường học, học lực | Tập trung toàn bộ thông tin nhân khẩu học và năng lực học thuật của học viên. | **Điều chỉnh:** Tách riêng thành một khối độc lập với phần phụ huynh. |
| **Khối Trình độ sau kiểm tra** | Bảng phẳng hai cột không lồng viền | Trình độ chính, trình độ phụ, nút Sửa thông tin trình độ | Đưa lên trên ngay dưới tên học viên; hiển thị trực tiếp Trình độ và Trình độ phụ; tích hợp nút "Sửa" mở hộp thoại cập nhật trình độ; giá trị luôn lấy theo trình độ mới nhất của học viên. | **Điều chỉnh:** Tích hợp nút Sửa mở hộp thoại cập nhật trình độ chuẩn; tự động đồng bộ theo trình độ mới nhất. |
| **Thông tin Trường & Học lực** | Dòng thông tin nhãn - giá trị | Tên trường đang học, năng lực học tập ban đầu | Cung cấp bối cảnh học tập nền tảng của học viên. | **Điều chỉnh:** Đưa xuống dưới khối trình độ sau kiểm tra để ưu tiên kết quả năng lực. |
| **Khối Thông tin Phụ huynh** | Khung thẻ chữ nhật phẳng tách riêng | Tên phụ huynh, mối quan hệ, số điện thoại, địa chỉ liên hệ | Tách rời hoàn toàn khỏi khối học viên thành một phân vùng riêng biệt; dòng địa chỉ có biểu tượng bản đồ và liên kết mở Google Maps có màu sắc nhận diện rõ nét. | **Điều chỉnh:** Tách riêng thành một khối liên hệ tinh gọn; bỏ ghi chú ở phụ huynh (đã có ở ca tương ứng); thêm màu nổi bật cho biểu tượng địa chỉ và liên kết bản đồ ngoài. |

### 2.3 Panel Trái (60% diện tích): Gom Lần và Kết quả theo Môn riêng rẽ - Các điều chỉnh

| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |
|---|---|---|---|---|
| **Thanh chọn Môn học riêng rẽ** | Các nút bấm độc lập có hiệu ứng nổi bật | `Tiếng Anh`, `Toán tư duy` | Chuyển đổi từ dải thanh xám liền mạch sang các nút bấm riêng rẽ độc lập; khi được chọn sẽ có hiệu ứng nổi bật màu nhấn rõ nét kèm số lượng buổi phát sinh. | **Điều chỉnh:** Tách thành các nút bấm độc lập, nổi bật màu nhấn khi chọn thay vì dải thanh xám trải dài. |
| **Thẻ gom Lần và Kết quả đánh giá** | Thẻ chữ nhật bo góc hoàn chỉnh | Thông tin ca học kết hợp kết quả đánh giá và nút hành động | Mỗi lần kiểm tra hoặc học thử là một thẻ duy nhất chứa cả lịch hẹn, cơ sở, giáo viên, kết quả đánh giá chi tiết và các nút thao tác chuyển đổi trạng thái của lần đó. | **Điều chỉnh:** Gom toàn bộ lịch hẹn, kết quả và nút thao tác về từng thẻ Lần; loại bỏ hoàn toàn thanh chân hộp thoại (footer); xóa bỏ dòng tiêu đề "Kết quả đánh giá trình độ" dư thừa. |
| **Thanh tiêu đề thẻ Lần** | Hàng ngang tương tác phẳng | Số thứ tự lần, nhãn loại hình, biểu tượng điểm danh, nhãn trạng thái cuối, nút thao tác | Hiển thị thứ tự Lần, loại hình, biểu tượng điểm danh (tích xanh hoặc chéo đỏ); khi ca đã có đầy đủ kết quả (điểm Speaking, LWR, trình độ xếp lớp) nhưng chưa kết thúc, hiển thị nút "Hoàn tất" góc phải; đối với các buổi đã kết thúc (hoàn thành, hủy, không đạt, không đến) hiển thị nhãn trạng thái cuối chuẩn hệ thống ở góc phải; tự động ẩn các nút hành động khi đã ở trạng thái cuối. | **Điều chỉnh:** Bổ sung nút Hoàn tất khi đã có đủ kết quả kiểm tra; bổ sung nhãn trạng thái cuối chuẩn hệ thống (Hoàn tất, Đã hủy, Không đạt, Không đến) ở góc phải; ẩn nút check-in/hủy lịch khi đã kết thúc. |
| **Khu vực Thao tác Khảo thí ở giữa** | Khối thông báo và nút bấm tương tác ở giữa thân thẻ | Trạng thái điểm danh, nút Check-in, nút Nhận xét | - Nếu ca chưa điểm danh: ở giữa hiển thị hai nút Check in và Nhận xét (có thể bấm 1 trong 2).<br>- Nếu bấm Check in: chuyển sang khối mô tả đã điểm danh và chỉ còn nút Nhận xét.<br>- Nếu bấm Nhận xét khi chưa điểm danh: hệ thống vừa thực hiện điểm danh, vừa chuyển sang mô tả đã điểm danh, vừa mở hộp thoại đánh giá.<br>- Nếu ca đã có điểm: hiển thị đầy đủ Trình độ đầu vào, Nhánh trình độ, Điểm Speaking, Điểm LWR như bố cục chuẩn. | **Điều chỉnh:** Đưa nút Check in và Nhận xét vào giữa thân thẻ khi chưa điểm danh; tinh gọn luồng một chạm vừa điểm danh vừa mở đánh giá; chỉ hiển thị bảng điểm đầy đủ khi đã có kết quả kiểm tra. |
| **Cột Điểm Nói (Speaking) & Thao tác Nhận xét** | Cột điểm kết hợp nút thao tác | Điểm giáo viên, điểm trí tuệ nhân tạo, tổng điểm nói | Gộp nút "Nhập nhận xét" hoặc "Sửa nhận xét" vào cùng dòng tiêu đề với nhãn Điểm Nói (Speaking); nhấp để mở hộp thoại chấm điểm và nhận xét chuyên sâu. | **Điều chỉnh:** Gộp thao tác nhận xét trực tiếp vào dòng tiêu đề Điểm Nói, giúp người dùng thao tác nhận xét ngay tại ngữ cảnh điểm nói. |
| **Cột Điểm Trắc nghiệm (LWR) & Liên kết Máy tính bảng** | Cột điểm kết hợp liên kết ngoài | Cấp độ, điểm thô, điểm quy đổi, liên kết bài làm | Gộp liên kết "Xem bài từ iPad" trực tiếp vào dòng tiêu đề Điểm Trắc nghiệm (LWR); nhấp để mở bài làm trực tiếp của học viên. | **Điều chỉnh:** Gộp liên kết xem bài làm trên máy tính bảng trực tiếp vào dòng tiêu đề Điểm LWR; xóa bỏ dòng liên kết riêng lẻ bên dưới. |
| **Dòng tiêu đề ca đặt lịch** | Hàng ngang tương tác phân cách bởi đường kẻ mỏng | Người phụ trách, thời gian ca, cơ sở | Đưa người phụ trách lên đầu dòng kèm nút gán hoặc đổi; đưa thời gian ca hẹn sang cạnh cơ sở ở cuối dòng kèm biểu tượng mũi tên để đóng/mở phần mở rộng. | **Điều chỉnh:** Người phụ trách ở đầu dòng; đưa thời gian ca hẹn sang đứng liền kề với cơ sở ở cuối dòng. |
| **Phần mở rộng thông tin ca (Thường đóng)** | Khung lưới thông tin bổ sung | Chương trình, trình độ dự kiến, ghi chú ca, người tạo | Mở rộng hiển thị các trường dữ liệu bổ sung của ca mà không lặp lại thời gian và cơ sở đã có ở dòng tiêu đề trên. | **Điều chỉnh:** Bỏ đường kẻ dưới ghi chú ca; chuyển mã ca xuống trước ngày tạo sát chân thẻ ca và bỏ nhãn chữ ngày tạo; bỏ phòng và điểm danh; thêm trình độ dự kiến. |
| **Khối Nhận xét Học thử trong thẻ** | Điểm sao và khung nhận xét | Số sao đánh giá, mức độ hòa nhập, phản xạ | Nằm ngay bên dưới phần lớp ghép của thẻ học thử, hiển thị đánh giá định tính của giáo viên đứng lớp. | **Điều chỉnh:** Tích hợp trực tiếp bên trong thẻ của lần tương ứng. |
| **Danh sách các Lần phát sinh & Phân vùng Lịch sử** | Dòng thẻ xếp dọc phân cách bởi nhãn Lịch sử | Ca hiện tại nổi bật ở trên, nhãn Lịch sử ở giữa và các lần trước đó | Ca kiểm tra hiện tại hiển thị đầy đủ chi tiết trên cùng; ở giữa có vạch phân cách và nhãn "Lịch sử" kèm số lượng ca cũ; các lần trước đó được gom vào lịch sử ở trạng thái thu gọn tinh tế, có thể nhấp để mở rộng xem lại. | **Điều chỉnh:** Bổ sung nhãn phân vùng Lịch sử ở giữa panel trái; tự động thu gọn các lần trước đó để tập trung vào ca hiện tại. |

---

## 3. KHỐI CHỨC NĂNG CHI TIẾT: ACTION & LUỒNG KÍCH HOẠT (ACTIONS & EVENTS)

### Khối chức năng 1: Chuyển đổi Môn học Riêng rẽ

#### Action 1.1: Nhấp chọn môn học trên thanh điều khiển môn
* **Luồng kích hoạt:** Người dùng nhấp chọn nút "Tiếng Anh" hoặc "Toán tư duy".
* **Tiêu chí nghiệm thu (Acceptance Criteria):**
  - **AC-1 (Happy Path - Quản lý độc lập theo môn Tiếng Anh):**
    - **Giả sử:** Người dùng đang mở hộp thoại chi tiết của học viên.
    - **Khi:** Người dùng nhấp chọn nút "Tiếng Anh".
    - **Thì:** Toàn bộ danh sách các lần kiểm tra và học thử môn Tiếng Anh được hiển thị; huy hiệu trình độ ở Panel Phải tự động cập nhật đúng trình độ môn Tiếng Anh của học sinh.
  - **AC-2 (Happy Path - Quản lý độc lập theo môn Toán):**
    - **Giả sử:** Người dùng muốn kiểm tra tiến độ học thử và khảo thí môn Toán.
    - **Khi:** Người dùng nhấp chọn nút "Toán tư duy".
    - **Thì:** Giao diện Panel Trái chuyển sang hiển thị các lần phát sinh của môn Toán; huy hiệu trình độ ở Panel Phải chuyển sang hiển thị trình độ môn Toán.

---

### Khối chức năng 2: Thu gọn hoặc Mở rộng Thẻ Gom Lần & Kết quả

#### Action 2.1: Nhấp vào thanh tiêu đề của một Lần
* **Luồng kích hoạt:** Người dùng nhấp chuột vào thanh tiêu đề của một thẻ lần bất kỳ.
* **Tiêu chí nghiệm thu:**
  - **AC-3 (Happy Path - Mở rộng xem toàn bộ ca và kết quả của lần đó):**
    - **Giả sử:** Thẻ của một lần trước đang ở trạng thái thu gọn tóm tắt một dòng.
    - **Khi:** Người dùng nhấp vào thanh tiêu đề thẻ đó.
    - **Thì:** Thẻ mở rộng hiển thị đầy đủ cả hai phần: Thông tin lịch hẹn/người phụ trách và Kết quả đánh giá chi tiết của chính lần đó.

---

### Khối chức năng 3: Cập nhật Trình độ Đầu vào Trực tiếp trong Thẻ Lần

#### Action 3.1: Thay đổi giá trị Trình độ hoặc Nhánh trình độ
* **Luồng kích hoạt:** Người dùng có thẩm quyền nhấp vào hộp chọn Trình độ đầu vào trên thẻ kiểm tra và chọn một giá trị mới.
* **Tiêu chí nghiệm thu:**
  - **AC-4 (Happy Path - Tự động đồng bộ lên Huy hiệu Trình độ ở Panel Phải):**
    - **Giả sử:** Học viên vừa hoàn thành bài kiểm tra Tiếng Anh và có kết quả chấm điểm từ giáo viên.
    - **Khi:** Giáo viên khảo thí chọn trình độ "Kindie 3" từ hộp chọn tại thẻ Lần đó.
    - **Thì:** Giá trị "Kindie 3" được lưu trữ vào dữ liệu buổi kiểm tra, đồng thời Huy hiệu "Trình độ môn Tiếng Anh" ở Panel Phải tự động cập nhật ngay lập tức thành "Kindie 3".

---

### Khối chức năng 4: Thao tác Chuyển đổi Trạng thái Trực tiếp trên từng Lần

#### Action 4.1: Thực hiện thao tác Check-in, Hoàn tất hoặc Hủy lịch trên thẻ Lần
* **Luồng kích hoạt:** Người dùng có thẩm quyền nhấp nút "Check-in", "Nhận xét", "Hoàn tất" hoặc "Hủy lịch" trên thẻ của một Lần cụ thể.
* **Tiêu chí nghiệm thu:**
  - **AC-5 (Happy Path - Hoàn tất ca kiểm tra khi đã có đầy đủ kết quả):**
    - **Giả sử:** Học viên đã có đầy đủ kết quả kiểm tra (Điểm Speaking, Điểm LWR, Trình độ xếp lớp) và ca đang ở trạng thái đánh giá.
    - **Khi:** Giáo viên hoặc nhân viên phụ trách nhấp nút "Hoàn tất" trên thanh tiêu đề thẻ Lần.
    - **Thì:** Trạng thái ca kiểm tra chuyển sang "Hoàn thành", nút "Hoàn tất" và nút "Hủy lịch" tự động biến thành huy hiệu trạng thái cuối "Hoàn tất", hệ thống hiển thị thông báo hoàn tất thành công.
  - **AC-5.1 (Happy Path - Điểm danh học viên từ giữa thân thẻ):**
    - **Giả sử:** Học viên có ca kiểm tra chưa điểm danh và chưa có điểm.
    - **Khi:** Người dùng nhấp nút "Check in" ở giữa thân thẻ.
    - **Thì:** Ca kiểm tra chuyển sang trạng thái đã điểm danh, khu vực giữa thẻ chuyển sang hiển thị mô tả đã điểm danh và chỉ còn nút "Nhận xét".
  - **AC-5.2 (Happy Path - Vừa điểm danh vừa mở hộp thoại nhận xét):**
    - **Giả sử:** Học viên có ca kiểm tra chưa điểm danh và người dùng muốn đánh giá ngay.
    - **Khi:** Người dùng nhấp nút "Nhận xét" ở giữa thân thẻ.
    - **Thì:** Hệ thống tự động ghi nhận điểm danh cho học viên, chuyển nội dung giữa thân thẻ sang mô tả đã điểm danh, đồng thời mở ngay hộp thoại đánh giá nhận xét.
  - **AC-5.3 (Happy Path - Hiển thị bảng điểm khi ca đã có kết quả):**
    - **Giả sử:** Ca kiểm tra đã được chấm điểm hoặc đã lưu kết quả đánh giá.
    - **Khi:** Người dùng mở xem chi tiết ca.
    - **Thì:** Thân thẻ hiển thị đầy đủ các trường Trình độ đầu vào, Nhánh trình độ, Điểm Speaking và Điểm LWR kèm liên kết bài làm.
  - **AC-6 (Happy Path - Hủy lịch ca kiểm tra qua hộp thoại xác nhận):**
    - **Giả sử:** Ca kiểm tra chưa kết thúc và người dùng muốn hủy lịch do phụ huynh báo bận.
    - **Khi:** Người dùng nhấp nút "Hủy lịch" trên thanh tiêu đề của Lần đó và xác nhận trên hộp thoại cảnh báo.
    - **Thì:** Trạng thái của Lần chuyển sang "Đã hủy", các nút thao tác chuyển đổi trạng thái tự động ẩn đi và hệ thống hiển thị thông báo hủy thành công.

---

### Khối chức năng 5: Cập nhật Trình độ Học viên từ Panel Hồ sơ

#### Action 5.1: Nhấp nút Sửa trình độ và lưu thông tin
* **Luồng kích hoạt:** Người dùng có thẩm quyền nhấp nút "Sửa" tại khối Trình độ học viên ở Panel Phải.
* **Tiêu chí nghiệm thu:**
  - **AC-7 (Happy Path - Cập nhật trình độ học viên qua hộp thoại chuẩn):**
    - **Giả sử:** Người dùng muốn điều chỉnh lại trình độ đầu vào hoặc nhánh trình độ của học viên sau khi trao đổi lại với phụ huynh.
    - **Khi:** Người dùng nhấp nút "Sửa" tại khối Trình độ, chọn trình độ và nhánh trình độ mới trên hộp thoại cập nhật trình độ và nhấp "Lưu thay đổi".
    - **Thì:** Dữ liệu trình độ của ca kiểm tra gần nhất tự động được cập nhật, khối Trình độ học viên hiển thị ngay giá trị mới và hệ thống hiển thị thông báo cập nhật thành công.

---

## 4. CÁC TRƯỜNG HỢP GÓC CẠNH & LUỒNG NGOẠI LỆ (CORNER CASES & EXCEPTION FLOWS)

### **Nhóm 1: Dữ liệu Khảo thí & Lịch sử Đa chiều**
* **[CASE-01] Học viên chưa từng phát sinh hoạt động nào ở môn đang chọn:**
  * **Tình huống:** Người dùng chuyển sang tab môn Toán nhưng học sinh chưa từng đăng ký test hay học thử môn Toán.
  * **Xử lý:** Panel Trái hiển thị khung thông báo nhẹ nhàng: "Chưa có lịch Toán tư duy" kèm hướng dẫn phụ huynh hoặc tư vấn viên đặt lịch khi có nhu cầu.
* **[CASE-02] Học viên có nhiều lần kiểm tra hoặc học thử trong cùng một môn:**
  * **Tình huống:** Học viên tham gia 2 lần test và 1 buổi học thử cho cùng môn Tiếng Anh.
  * **Xử lý:** Giao diện hiển thị lần lượt các thẻ Lần 1, Lần 2, Lần 3; mỗi thẻ gom đầy đủ thông tin ca và kết quả tương ứng của lần đó; thẻ buổi hiện tại tự động mở rộng để thao tác nhanh.
* **[CASE-03] Học viên học thử môn học chưa từng thực hiện kiểm tra đầu vào:**
  * **Tình huống:** Phụ huynh đăng ký học thử ngay một môn mà học sinh chưa từng qua bước kiểm tra năng lực.
  * **Xử lý:** Huy hiệu trình độ môn đó ở Panel Phải hiển thị trạng thái "Chưa kiểm tra", giúp người quản lý nhận diện nhanh để bổ sung bài đánh giá năng lực.

---

### **Nhóm 2: Lọc Môn học & Không gian Hiển thị**
* **[CASE-04] Chuyển đổi môn học khi đang mở hộp thoại:**
  * **Tình huống:** Người dùng đang xem chi tiết một ca kiểm tra môn Tiếng Anh và bấm chuyển sang tab môn Toán.
  * **Xử lý:** Dòng danh sách các lần tự động chuyển đổi mượt mà sang môn Toán mà không làm tải lại toàn bộ hộp thoại; thông tin học viên cố định ở Panel Phải không bị xáo trộn.
* **[CASE-05] Tên trường học hoặc địa chỉ của học viên có độ dài vượt khung:**
  * **Tình huống:** Tên trường học của học sinh dài quá giới hạn một dòng của thẻ thông tin.
  * **Xử lý:** Dòng hiển thị tự động ngắt dòng hợp lý hoặc cắt gọn kèm dấu ba chấm (`...`); khi người dùng rê chuột vào sẽ hiển thị đầy đủ tên trường qua hộp chú giải nổi.

---

### **Nhóm 3: Bảo mật & Tác vụ Phụ trợ**
* **[CASE-06] Sao chép số điện thoại khi gia đình có nhiều người liên hệ:**
  * **Tình huống:** Hồ sơ gia đình lưu trữ thông tin của cả Bố và Mẹ.
  * **Xử lý:** Giao diện hiển thị rõ ràng từng người liên hệ kèm vai trò; mỗi người đi kèm nút sao chép riêng biệt và thông báo sao chép ghi rõ họ tên người liên hệ tương ứng.
* **[CASE-07] Học viên chuyển đổi trạng thái hủy buổi hiện tại:**
  * **Tình huống:** Người dùng thực hiện thao tác hủy buổi kiểm tra hoặc học thử hiện tại qua hộp thoại xác nhận.
  * **Xử lý:** Trạng thái buổi đó lập tức chuyển sang "Đã hủy", các nút thao tác nghiệp vụ tự động khóa lại, đồng thời hệ thống tự động ghi nhận một dòng nhật ký kiểm toán mới vào lịch sử hoạt động.
