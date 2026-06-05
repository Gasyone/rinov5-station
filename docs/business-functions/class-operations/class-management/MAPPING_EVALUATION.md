# Bảng đối chiếu Nghiệp vụ & Hiện trạng Kỹ thuật — Quản lý Lớp học (Class Management)

Bảng đối chiếu này ánh xạ các yêu cầu nghiệp vụ chi tiết của phân hệ Quản lý Lớp học sang các thành phần nghiệp vụ (BF, US) và các thành phần kỹ thuật tương ứng trên Frontend Rinov5, đồng thời ghi nhận các quyết định thiết kế từ phiên làm việc thảo luận.

---

## 1. Danh sách Business Functions (BF) & User Stories (US) liên quan

Epic **Quản lý Lớp học** trải rộng qua các phân hệ nghiệp vụ thuộc Khối Vận hành:
- **BF-CLS-02: Quản lý Lớp học** (Chủ trì vòng đời lớp & Khung chương trình)
  - `US-CLS02-01`: Quản lý danh sách Lớp học (Màn hình chính)
  - `US-CLS02-02`: Tạo mới vỏ Lớp học & Xếp lịch tuần (Bước 1 của quy trình tạo)
  - `US-CLS02-03`: Gắn Khung chương trình (Syllabus) vào Lớp
  - `US-CLS02-04`: Xem chi tiết lớp học (Màn hình/Hộp thoại chi tiết)
  - `US-CLS02-05`: Phê duyệt & Vận hành trạng thái lớp (Duyệt nháp, Khai giảng, Tạm dừng, Hủy)
  - `US-CLS02-06`: Đóng lớp & Tốt nghiệp
- **BF-CLS-03: Quản lý Học viên**
  - `US-CLS03-02`: Thêm học viên vào lớp (Bước 2 của tạo lớp & Roster trong chi tiết)
- **BF-CLS-04: Quản lý Giáo viên chủ nhiệm**
  - `US-CLS04-01`: Phân công Giáo viên chủ nhiệm & Giáo viên giảng dạy
- **BF-OPS-02: Xếp lịch & Chống trùng**
  - `US-OPS02-01`: Thiết lập lịch học tuần & Phòng học theo chi nhánh

---

## 2. Bảng đối chiếu Nghiệp vụ - Kỹ thuật (Đã cập nhật theo Brainstorming & Phản hồi)

| Mã Yêu cầu | Nội dung Yêu cầu Nghiệp vụ | BF/US liên quan | Quy tắc nghiệp vụ chốt từ thảo luận | Thành phần Kỹ thuật (FE) | Hiện trạng Code FE |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-CLS-01** | Lọc lớp học theo bộ trạng thái (Nháp, Chờ khai giảng, Đang học, Tạm dừng, Đóng lớp, Hủy). | US-CLS02-01 | Trạng thái hiển thị đồng bộ gồm 6 trạng thái nghiệp vụ. | `ClassesToolbar` & `SegmentedControl` | **Đã hoàn thành:** Lọc động hoạt động chính xác. |
| **REQ-CLS-02** | Xem chi tiết lớp học để theo dõi thông tin vận hành. | US-CLS02-04 | Hiển thị thông tin lớp dạng Tab-based. | `ClassesDetailSheet` | **Đã hoàn thành 50%:** Hiện tại là bảng phẳng, chưa chia tab. |
| **REQ-CLS-03** | Khởi tạo lớp học mới, xóa lớp và cập nhật thông tin lớp học. | US-CLS02-02 US-CLS02-04 | Hỗ trợ thêm/xóa/sửa lớp học qua các form và dialog. | `ClassesCreateDialog`, `ConfirmDialog` | **Đã hoàn thành 80%:** Chưa có form cập nhật/chỉnh sửa lớp (Edit). |
| **REQ-CLS-04** | Cho phép tạo lớp nháp trước. Lớp nháp sau khi cấu hình đủ lịch và học viên có nút kích hoạt sang "Chờ khai giảng". | US-CLS02-02 US-CLS02-05 | Lớp Nháp → thiết lập lịch + roster → nút Kích hoạt chuyển sang Chờ khai giảng → Giáo viên điểm danh buổi 1 hoàn thành → Tự động chuyển Đang học. | Nút kích hoạt trong `ClassesDetailSheet` / Logic chuyển đổi trạng thái khi điểm danh buổi đầu. | **Đã hoàn thành 60%:** Đã có tạo nháp, chưa có nút "Kích hoạt" trên giao diện chi tiết để đẩy sang Chờ khai giảng. |
| **REQ-CLS-05** | Không cho phép thay đổi thông tin cơ bản của lớp học sau khi lớp đã có học viên tham gia. | US-CLS02-02 US-CLS02-04 | **Quy tắc:**<br>1. *Bất biến (khóa sửa)*: Môn học, Khung chương trình và Chi nhánh.<br>2. *Cho phép sửa*: Tên lớp học, Sĩ số tối đa (không được giảm thấp hơn số học viên hiện tại). | Logic khóa trường (disabled) trong Form chỉnh sửa khi `enrolledStudents > 0`. | **Chưa hoàn thành:** Chưa có form chỉnh sửa để áp dụng quy tắc này. |
| **REQ-CLS-06** | Mở hộp thoại xem danh sách các buổi học nếu lớp học gồm nhiều buổi. | US-CLS02-04 US-OPS-03 | Lớp có nhiều buổi sẽ hiển thị danh sách buổi học cụ thể. Cho phép đổi lịch từng buổi nếu trùng ngày lễ.<br>**Quy tắc đổi lịch tuần:** Dời các buổi học tương lai (Scheduled). Đối với buổi đã được đổi lịch thủ công trước đó, hiển thị danh sách tích chọn giữ nguyên hoặc ghi đè. | Tab "Buổi học" trong `ClassesDetailSheet` | **Chưa hoàn thành:** Chưa có tab Buổi học. |
| **REQ-CLS-07** | Tìm kiếm lớp học và lọc lớp học theo chi nhánh/trường học. | US-CLS02-01 | Tìm kiếm tự do và lọc nhanh theo cơ sở chi nhánh. | `BranchSelect` & `SearchInput` | **Đã hoàn thành:** Tìm kiếm và lọc chi nhánh hoạt động tốt. |
| **REQ-CLS-08** | Lọc nâng cao (theo Giáo viên, Trình độ, Phòng học, Khoảng ngày). | US-CLS02-01 | Kết hợp nhiều bộ lọc nâng cao trên thanh bên. | `FilterSheetPanel` | **Đã hoàn thành:** Tích hợp bộ lọc nhiều tiêu chí. |
| **REQ-CLS-09** | Cho phép tự nhập Mã lớp thủ công khi tạo. Nếu để trống, hệ thống sẽ tự động sinh mã theo quy tắc. | US-CLS02-02 | Cho phép nhập đè mã lớp tự sinh. | Input mã lớp trong `ClassesCreateDialog` | **Đã hoàn thành:** Gợi ý mã lớp theo môn học và hỗ trợ sửa thủ công. |
| **REQ-CLS-10** | Ràng buộc môn học và trình độ theo Khung chương trình đã chọn. | US-CLS02-03 | Khi chọn Syllabus, các trường Môn học và Trình độ sẽ tự động nạp dạng chỉ xem (Read-only), giáo vụ không được tự nhập. | Khóa Input và tự động gán giá trị theo Syllabus | **Chưa hoàn thành:** Chưa ràng buộc Read-only, giáo vụ vẫn tự chọn độc lập. |
| **REQ-CLS-11** | Thiết lập loại lớp (Chính thức/Workshop) và sĩ số dự kiến. | US-CLS02-02 | Lựa chọn loại lớp và số lượng học viên tối đa. | Select trong `ClassesCreateDialog` | **Đã hoàn thành:** Có các trường nhập tương ứng. |
| **REQ-CLS-12** | Ràng buộc nghiệp vụ xếp lịch tuần:<br>1. Phòng học phải thuộc chi nhánh đã chọn.<br>2. Giáo viên được phép chọn liên chi nhánh (không giới hạn cơ sở của GV).<br>3. Giờ học nạp theo danh sách ca đăng ký sẵn (không tự động xóa lịch cũ khi đổi ca). | US-CLS04-01 US-OPS02-01 | Phòng học bắt buộc thuộc cơ sở của lớp học. Giáo viên không giới hạn (hỗ trợ freelance/biệt phái). Ca học nạp sẵn, không tự xóa lịch cũ. | Khóa điều kiện dữ liệu của Phòng học theo chi nhánh đang chọn. | **Chưa hoàn thành:** Các trường chọn Phòng học hiện tại nạp toàn bộ danh sách phòng của tất cả chi nhánh. |
| **REQ-CLS-13** | Cho phép tạo lớp nháp trực tiếp từ Bước 1 hoặc chuyển sang Bước 2 để thêm học viên vào lớp. | US-CLS03-02 | Quy trình linh hoạt: tạo nháp nhanh hoặc chuyển bước lập roster. | Form các bước trong `ClassesCreateDialog` | **Đã hoàn thành:** Nút "Tạo nháp" và "Tiếp theo" hoạt động tốt. |
| **REQ-CLS-14** | Hộp thoại thêm học viên: Cho phép chọn nhiều học viên; nạp danh sách học viên chưa xếp lớp hoặc học viên học thử (Trial); có các tab lọc ("Tất cả", "Phù hợp", "Học viên trial"). | US-CLS03-02 | Lọc học viên "Phù hợp" dựa trên thời gian rảnh trùng với lịch học lớp. Không giới hạn trình độ học viên. | Modal chọn học viên tích hợp với các tab lọc và checkbox đa chọn. | **Chưa hoàn thành:** Chỉ hỗ trợ "Thêm nhanh" bằng cách gõ tên học viên ở Step 2, chưa có danh sách chọn học viên kèm bộ lọc. |
| **REQ-CLS-15** | Hiển thị thông tin học viên đầy đủ trong danh sách chọn (Avatar, Mã học viên, Tên, Ngày sinh, Gói học đã mua, Ghi chú sale/học vụ, Lịch rảnh). | US-CLS03-02 | Hiển thị đầy đủ thông tin để hỗ trợ giáo vụ ra quyết định xếp lớp phù hợp. | Thiết kế Card thông tin chi tiết học viên trong modal chọn. | **Chưa hoàn thành:** Chỉ hiển thị mã và tên đơn giản trong bảng danh sách roster tạm thời. |
| **REQ-CLS-16** | Sau khi chọn và thêm học viên, dữ liệu đổ về danh sách học viên trực thuộc lớp học. | US-CLS03-02 | Cập nhật số lượng học viên trong lớp tức thì. Học viên Trial có tính vào sĩ số tối đa. | Roster state cập nhật và hiển thị số lượng sĩ số hiện tại. | **Đã hoàn thành:** Học viên được thêm hiển thị ngay trong danh sách roster tạm thời. |
| **REQ-CLS-17** | Màn hình chi tiết lớp học hiển thị đầy đủ thông tin tổng quan và trạng thái lớp. | US-CLS02-04 | Giao diện hiển thị chi tiết thông tin tĩnh và động của lớp học. | `ClassesDetailSheet` | **Đã hoàn thành 50%:** Hiển thị thông tin tĩnh cơ bản, thiếu tab chuyên sâu. |
| **REQ-CLS-18** | Các hành động (Actions) tại chi tiết lớp thay đổi động phù hợp với trạng thái lớp (Kích hoạt, Hủy lớp, Tạm dừng, Kết thúc). | US-CLS02-05 US-CLS02-06 | Khi hủy lớp Chờ khai giảng, học viên tự động đẩy ra danh sách "Chờ xếp lớp". Không can thiệp nghiệp vụ hoàn phí/tài chính. Học viên bảo lưu/chuyển lớp vẫn hiển thị trong roster kèm nhãn trạng thái và hỗ trợ bộ lọc. | Nhóm nút bấm động ở PageHeader trong Detail Modal. | **Chưa hoàn thành:** Hiện tại chỉ hiển thị duy nhất nút "Sửa". |
| **REQ-CLS-19** | Bố cục chi tiết lớp học dạng Tab-based bao gồm các tab: Học viên, Chi tiết, Lịch học, Buổi học, Ghi chú, Nhật ký hoạt động (Logs). | US-CLS02-04 | Tab Logs ghi nhận tất cả tương tác liên quan đến lớp (ngoài buổi học). Phân quyền xem logs cho tất cả vai trò. | Khung `<Tabs>` với các tab nội dung chuyên biệt. | **Chưa hoàn thành:** Hiện tại là bảng thông tin phẳng, không chia tab. |
| **REQ-CLS-20** | Tích hợp tính năng gán Lộ trình học tập trong chi tiết lớp để mở trang thiết lập lộ trình. | US-CLS02-03 | Lộ trình áp dụng chung cho cả lớp, làm cơ sở tự động sinh và ghép tên bài học tương ứng vào các buổi học (Session).<br>**Quy tắc lệch số buổi học ($N$ bài vs $M$ buổi)**:<br>1. *Nếu $N < M$*: Gán $N$ bài đầu, các buổi thừa gán mặc định là "Review/Assessment/Project".<br>2. *Nếu $N > M$*: Gán đến buổi thứ $M$, cảnh báo và gợi ý giáo vụ chọn (A) dời ngày bế giảng tự động sinh buổi, hoặc (B) chọn gộp một số bài học. | Liên kết/Nút hành động kích hoạt gán lộ trình giảng dạy cho lớp. | **Chưa hoàn thành:** Chưa có giao diện gán lộ trình giảng dạy cho lớp. |
