# Yêu cầu Người dùng - Lịch học & Lịch biểu (Scheduling)

Phân hệ này quản lý việc lập lịch học tự động, xếp phòng học và giải quyết xung đột lịch giảng dạy của giáo viên.

## 1. Mô tả Nghiệp vụ
* **Mục tiêu**: Hỗ trợ CS/Admin xếp lịch dạy tối ưu cho giáo viên, quản lý phòng trống, kiểm duyệt lịch học tổng thể của trung tâm và phát hiện xung đột thời gian giảng dạy.
* **Đối tượng**: CS/Admin (xếp lịch, đổi phòng), Giáo viên (theo dõi lịch dạy cá nhân).

## 2. Danh sách Yêu cầu Nghiệp vụ
* **REQ-CLS-12**: Khởi tạo và sinh lịch học tự động cho cả khóa học dựa trên ngày bắt đầu, ngày kết thúc và tần suất buổi học trong tuần.
* **REQ-CLS-13**: Quản lý lịch học tổng thể cơ sở, cho phép bộ phận giáo vụ lọc tìm kiếm ca học theo lớp, giáo viên, phòng hoặc trạng thái xung đột.
* **REQ-CLS-14**: Thuật toán quét và cảnh báo trùng lịch: Tự động cảnh báo khi xếp giáo viên vào phòng học bị trùng lịch hoặc giáo viên đang có ca dạy khác cùng giờ.
