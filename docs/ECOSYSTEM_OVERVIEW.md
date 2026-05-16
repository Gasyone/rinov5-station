# Tổng quan Hệ Sinh thái RinoEdu (Ecosystem Overview)

## 1. Giới thiệu RinoEdu
RinoEdu là một tổ chức kinh doanh giáo dục chuyên cung cấp các chương trình học nâng cao, bao gồm các bộ môn như Toán, Tiếng Anh và nhiều môn học khác.

## 2. Mô hình Hoạt động
Hệ sinh thái giáo dục của RinoEdu không chỉ giới hạn ở một hình thức duy nhất mà bao gồm nhiều mô hình giảng dạy vận hành song song để đáp ứng đa dạng nhu cầu học tập:

- **Station**: Trạm học tập / Trung tâm học tập vật lý (Offline). Nơi học viên đến học trực tiếp tại các cơ sở, chi nhánh.
- **Tutor**: Hệ thống gia sư. Giáo viên kèm riêng học viên theo nhóm nhỏ hoặc 1-1.
- **Digital**: Hệ thống giáo viên kỹ thuật số / trực tuyến (Online). Cung cấp các khóa học và dịch vụ giáo dục qua nền tảng số.

## 3. Định vị hệ thống Rinov5 (Station)
Trong quá khứ, hệ thống quản trị của RinoEdu bị phân mảnh thành nhiều domain riêng biệt, gây khó khăn trong việc đồng bộ và vận hành:
- *LMS (Learning Management System)*
- *ERP cũ (Enterprise Resource Planning)*
- *CRM cũ (Customer Relationship Management)*
- *Care cũ (Customer Care)*

**Dự án Rinov5 (được kế thừa từ Rinov4)** sinh ra để hợp nhất các domain phân mảnh này. Tuy nhiên, quan trọng nhất: **Rinov5 là phân hệ chuyên biệt phục vụ cho "Station"**.
Hệ thống này đóng vai trò lõi trong việc quản lý, vận hành và tối ưu hóa các quy trình tại các chi nhánh/trung tâm học tập trực tiếp.

## 4. Lưu ý về Kiến trúc (Parallel Domains)
Vì RinoEdu có các domain `Tutor` và `Digital` chạy song song với `Station`, việc thiết kế tính năng và cơ sở dữ liệu trên Rinov5 cần lường trước:
- Khả năng giao tiếp chéo (Cross-domain communication) giữa Station với Tutor/Digital.
- Dữ liệu học viên (Student Profile) và Đơn hàng (Orders) có thể được luân chuyển hoặc chia sẻ giữa các mô hình học.
- Tránh tư duy "hardcode" logic nghiệp vụ theo hướng chỉ tồn tại duy nhất mô hình Station.
