# Yêu cầu Người dùng - Quản lý Lớp học (Class Management)

Phân hệ này quản lý vòng đời của lớp học, định nghĩa thông tin cơ bản, xếp lịch tuần và gán nhân sự giáo viên.

## 1. Mô tả Nghiệp vụ
* **Mục tiêu**: Hỗ trợ CS/Admin thiết lập lớp học mới dễ dàng, gán giáo viên chủ nhiệm linh hoạt và quản lý trạng thái lớp học đồng nhất.
* **Đối tượng**: CS/Admin trung tâm (quản lý tạo lớp), Quản lý học thuật (phê duyệt gán giáo viên).

## 2. Danh sách Yêu cầu Nghiệp vụ
Quản lý danh sách lớp học là để quản lý các lớp học trên hệ thống.
Có thể lọc các lớp học theo bộ trạng thái. (Nháp, chờ khai giaingr, đang học, tạm dừng, đóng lớp, hủy)
Có thể mở chi tiết lớp để xem thông tin về lớp đó
Có thể tạo lớp học mới, xóa lớp học, cập nhật thông tin lớp học
Tạo lớp nháp trước để lưu thông tin lớp, sau đó có thể cập nhật thêm thông tin và kích hoạt để chờ khai giảng
Có thể thay đổi trạng thái của lớp, nhưng không được thay đổi thông tin cơ bản của lớp sau khi lớp đã có học viên. 
Lớp nháp phải duyệt mới được mở lớp chờ khai giảng
Nếu lớp có nhiều buổi, có thể mở modal để xem danh sách các buổi, 
Có thể lọc theo chi nhánh/ trường
Có thể tìm kiếm
Có thể filter nâng cao
Khi tạo lớp có thể nhập mã lớp, nếu không nhập nó tự tạo, nếu nhập nó lấy làm mẫ lớp
Môn học ràng buộc theo khung chương trình, nếu chọn khung chương trình thì sẽ hiển thị danh sách các môn học tương ứng
Có 2 loại lớp là chính thức và workshop
Sĩ số dự kiến
Loại giáo viên sẽ lọc giáo viên phù hợp
Trình độ lấy theo khung chương trình, 
Chọn phòng học ở các ngày trong tuần phải thuộc trường đang chọn.
Giáo viên chọn phải lấy theo trường đang chọn
Giờ phải lấy theo khung giờ đang đăng ký ca, nếu đổi khung giờ, phải chọn lại giờ và ngày học.
Có thể tạo lớp nháp luôn hoặc sang bước khác để thêm học viên. 
Khi thêm học viên thì mở modal để chọn học viên từ danh sách học viên.
Modal danh sách học viên có tab lọc học viên tất cả, phù hợp với lớp, học viên trial, có thể chọn nhiều học viên, nhưng danh sách chủ yếu là học viên chưa xếp lớp, học sinh trial nếu có. 
ở mỗi học viên, hiển thị đầy đủ thông tin về học viên để CS/Admin dễ dàng chọn học viên phù hợp.
Các thông tin bao gồm avatar, mã học viên, tên, ngày sinh, gói đã mua, các ghi chú từ sale, ghi chú học viên, thời gian rảnh của học viên, 
Khi chọn học viên và ấn thêm, nó sẽ đổ về danh sách học viên của lớp đó,
Modal detail có đầy đủ thông tin về lớp và trạng thái của lớp
Modal detail có các action phù hợp với từng trạng thái của lớp
Modal detail chia ra các tab học viên, chi tiết, lịch học, buổi học, các ghi chú, logs, 
modal detail có phần gán lộ trình học tập để mở ra page thiết lập lộ trình học tập. 

Kiểu 1 là chọn 1 giá viên cho 1 lớp
Kiểu 2 là chọn nhiều giáo viên, có thể chọn trợ giảng.
Chọn giáo viên theo điều kiện, có thể gối.
Khi tạo - ngày khai giảng ở quá khứ, thì trạng thái đang học
Khi tương lại sẽ là chờ khai giảng.

Hệ thống tự đông: - khi đến ngày kết thúc.


Không có tính năng duyệt khai giảng 
Lớp nháp tọa 1 - 1 mới có
Đang học sang tạm nghỉ -Điều kiện
Từ đang học sanng kết thúc: Yêu cầu xóa hết học sinh
Tạm nghỉ kết thúc
Chờ khai giảng cũng có thể kết thúc cũng phải đẩy ra. 
Khi bị kick ra khỏi lớp thì sẽ quay về tab học viên tất cả thì có 1 case nếu hết buổi thì tự động, về hết buổi.l
Nếu chưa học buổi nào -> Chờ xếp lớp
Nếu đang học dở -. chờ chuyển lớp

Tạo lớp xong
Thêm lộ trình
Thêm khung chương trình
Chọn buổi học đầu tiên.



