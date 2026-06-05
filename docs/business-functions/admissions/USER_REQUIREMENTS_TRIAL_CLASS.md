# Yêu cầu Người dùng & Hiện trạng (User Requirements & Status) - Đặt lịch học thử

Tài liệu này ghi nhận các yêu cầu nghiệp vụ, mô tả nghiệp vụ và đánh giá hiện trạng triển khai của module **Đặt lịch học thử** thuộc phân hệ Tuyển sinh.

---

## 1. Mô tả Nghiệp vụ (Business Description)

*Nhập mô tả tổng quan về luồng nghiệp vụ, mục tiêu của module này đối với vận hành của trung tâm.*
- **Mục tiêu chính:** Tài liệu này là tài liệu đầu vào cho việc phát triển tính năng cho module đặt lịch học thử
- **Đối tượng sử dụng chính:** Học sinh là người được đăng ký, phụ huynh sẽ là phụ trách, sale là nhân viên tuyển sinh, cs là quản lý và xác nhận, giáo viên là người dạy thử cho học viên và viết đánh giá
- **Phạm vi nghiệp vụ:**
Lấy danh sách booking được đặt từ crm cho học thử
Cập nhật các yêu cầu đổi lịch từ crm
Xác nhận, từ chối lịch học thử do điều kiện lớp học từ trung tâm
đổi lịch học thử của học viên do điều kiện lớp học từ trung tâm
Tổng hợp link nhận xét từ kết quả học
Hủy buổi học thử của học viên
theo dõi trạng thái booking học thử, 
bản demo theo link sản phẩm: http://localhost:3000/app/trial_class


## 2. Danh sách Yêu cầu Nghiệp vụ (Requirements List)

*Mô tả các tính năng, hành vi mong muốn của người dùng đối với module này.*
Booking học thử vẫn từ crm, không nằm trong phạm vi epic này. 
Trung tâm, giáo viên có thể xem được tất cả các booking học thử theo từng trung tâm
Lọc theo đầy đủ trạng thái, Chờ xác nhận, từ chối ghép, đã ghép lớp, cần đổi lịch, hoàn thành, đã hủy. 
Người phụ trách có thể chấp thuận hoặc từ chối booking học thử
Người phụ trách lọc theo các trạng thái bên trên
Người phục trách có thể đổi lớp cho booking. 
Khi đổi lớp thì vẫn có thông tin lớp hiện tại, sau đó chọn thời gian để liệt kê các lớp trong thời gian phù hợp. 
Yêu cầu đổi lịch từ crm sẽ được chấp thuận hoặc từ chối lại dựa theo tình trạng lớp học đổi lịch hiện có,
Sau khi nhận xong, trả link nhận xét của giáo viên về cho mỗi booking
Booking học thử chỉ được đặt tối đa 2 lần trong 3 tháng, 1 người việt, 1 người nước ngoài. 
Booking học thử chỉ được đặt 1 lần trên 1 thời điểm. 
Điều kiện 2 lần booking tính từ ngày phát sinh booking đầu tiên. 
Có các action ở cột Booking học thử, các action sẽ thay đổi theo trạng thái và theo giao diện hiện hành, 
Filter nâng cao theo các danh mục theo thiết kế hiện hành, 

