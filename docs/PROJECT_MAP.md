# Bản Đồ Tính Năng Dự Án (Features Map)

Tài liệu này ánh xạ cấu trúc hệ thống dựa trên các **Tính Năng Nghiệp Vụ (Business Features)** hiện có trên phiên bản Demo của Rinov5. 

Dự án áp dụng mô hình phân tách thành 11 Năng lực nghiệp vụ cốt lõi (Business Capabilities). Chi tiết các nghiệp vụ xem tại thư mục `docs/business-functions/CATALOG.md`.

## 1. Màn Hình & Phân Hệ Giao Diện (Screens)

Các màn hình được tổ chức theo cây menu bên trái (Sidebar Navigation) và quản lý định tuyến động qua `/app/[menuId]`.

| Menu ID (Route) | Tên Màn Hình | Capability | Mô tả tính năng / Luồng nghiệp vụ |
| --- | --- | --- | --- |
| `/app/dashboard` | Dashboard | Báo cáo | Bảng điều khiển tổng quan chỉ số hoạt động. |
| `/app/students` | Quản lý Học viên | CAP-OPS | Danh sách học viên tại cơ sở, hồ sơ học viên 360, các thao tác chuyển lớp, bảo lưu, nghỉ học. |
| `/app/classes` | Quản lý Lớp học | CAP-OPS | Danh sách các lớp học hiện tại, tổng quan tiến độ, danh sách học viên trong lớp, giáo viên chủ nhiệm. |
| `/app/calendar_class_schedule` | Lịch dạy / Lịch học | CAP-OPS | Xem lịch dưới dạng Calendar (Ngày/Tuần/Tháng). Hỗ trợ trạng thái phòng, giáo viên và điểm danh. |
| `/app/booking_test` | Đăng ký Test / Học thử | CAP-ADM | Đặt lịch kiểm tra năng lực đầu vào hoặc xếp buổi học thử. |
| `/app/orders` | Đơn hàng & Thanh toán | CAP-COM | Quản lý giỏ hàng, các gói sản phẩm đã bán và hóa đơn thanh toán của học viên. |
| `/app/products` | Sản phẩm & Khóa học | CAP-COM | Danh mục các khóa học, bundle, học cụ, dịch vụ đi kèm. |
| `/app/hr_employees` | Quản lý Nhân sự | CAP-HR | Danh sách nhân viên, phân công vai trò (Admin, Manager, Teacher, Sale, CSM). |
| `/app/org_branches` | Quản lý Chi nhánh | CAP-HR | Thông tin, trạng thái hoạt động và cấu hình của từng cơ sở/chi nhánh. |

## 2. Hệ Thống Dữ Liệu (Mock Data Entities)

Dữ liệu của bản Demo được mô phỏng hoàn toàn (không kết nối API). Các thực thể nghiệp vụ chính bao gồm:

| Thực thể (Entity) | Vai trò trong hệ thống | Liên kết |
| --- | --- | --- |
| **User/Auth** | Phân quyền và định danh người dùng đăng nhập. | Điều hướng Sidebar theo quyền. |
| **Branch** | Đơn vị chi nhánh trung tâm. | Lọc dữ liệu theo phạm vi cơ sở. |
| **Student** | Học viên. | Liên kết đến lớp học, đơn hàng, kết quả test. |
| **Class** | Lớp học đang hoạt động/chờ khai giảng. | Liên kết với danh sách sinh viên, giáo viên, khung chương trình. |
| **Employee/Teacher** | Nhân sự & Giáo viên. | Được phân công đứng lớp, phụ trách sales/chăm sóc. |
| **Schedule/Event** | Các khung thời gian, sự kiện. | Dùng trong Calendar, điểm danh, học thử, kiểm tra. |
| **Product/Order** | Sản phẩm & Đơn hàng. | Thể hiện doanh thu, lộ trình đóng phí. |

## 3. Cấu trúc Tài Liệu Nghiệp Vụ (Docs)

| Thư mục / File | Nội dung |
| --- | --- |
| `docs/business-functions/CATALOG.md` | Bản đồ toàn vẹn 11 Business Capabilities và các chức năng con. |
| `docs/business-functions/BF-*.md` | Mô tả luồng Business Function chi tiết (End-to-End). |
| `docs/business-functions/US-*.md` | User Story chi tiết cho từng nghiệp vụ (Các trường thông tin, validations, luồng thao tác UI). |
| `docs/business-functions/FLOW-*.md` | Mô tả các vòng đời tổng quát (Ví dụ: Vòng đời Tuyển sinh, Vòng đời Lớp học). |
| `docs/PROGRAM_MANAGEMENT_CONTENT_GUIDE.md` | Cẩm nang quy chuẩn nội dung, wording (tiêu đề, message lỗi, thông báo) theo chuẩn Design System. |

## 4. Ghi Chú Phát Triển Demo

- Vì là bản Demo, mục tiêu quan trọng nhất là trải nghiệm người dùng cuối. 
- Mọi thao tác tìm kiếm (search), lọc (filter), phân trang (pagination), thêm/sửa/xóa đều được thực hiện dựa trên trạng thái nội bộ của Client (Zustand hoặc React state kết hợp file mock).
- Tránh đưa thêm các độ trễ phi logic vào UI trừ khi muốn demo trạng thái Loading (`<ModuleLoadingSkeleton />` hoặc component `<Skeleton />`).
