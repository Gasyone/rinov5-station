# Business Function Catalog — RinoEdu

> **Hướng dẫn:** Trước khi đọc hoặc chỉnh sửa các BF, vui lòng nắm rõ quy tắc trong `[DOCUMENTATION_GUIDELINES.md](../DOCUMENTATION_GUIDELINES.md)` và các chính sách bảo mật trong `[ENTERPRISE_STANDARDS.md](../ENTERPRISE_STANDARDS.md)`.
> Tài liệu cơ sở cho toàn bộ quá trình phát triển hệ thống RinoEdu.
> Được cấu trúc lại theo chuẩn ngành Quản lý Giáo dục (EdTech/EA).
> Cập nhật lần cuối: 2026-05-18

## Quy ước

| Khái niệm | Viết tắt | Mô tả |
|-----------|----------|-------|
| Business Function | BF | Nghiệp vụ kinh doanh (Luồng End-to-End) |
| User Story | US | Câu chuyện người dùng — hành vi cụ thể trong BF |
| Master Flow | FLOW | Luồng tổng quát xuyên suốt nhiều BF |

## Tổng quan

- **Tổng số BFs (E2E):** 42 BFs
- **Tổng số Năng lực (Capabilities):** 11
- **Mô hình tiếp cận:** Quản trị theo vòng đời nghiệp vụ (Lifecycle), chia thành 3 lớp kiến trúc (Core, Support, Governance).

---

## Business Capabilities (11 Năng lực Nghiệp vụ chuẩn)

> 📌 Xem sơ đồ tổng thể: [CAP-MAP.md](./CAP-MAP.md)

Hệ thống được chia thành 3 phân lớp (Layers) như sau:

### Layer 1: Core Educational Capabilities (Giá trị lõi)
- [CAP-ACD: Học thuật & Đào tạo (Academic Management)](./CAP-ACD-academic-management.md)
- [CAP-ADM: Quản lý Tuyển sinh (Admissions Management)](./CAP-ADM-admissions-management.md)
- [CAP-COM: Thương mại & Bán hàng (Commerce & Sales)](./CAP-COM-commerce.md)
- [CAP-OPS: Quản lý học viên & Vận hành lớp (SIS & Class Operations)](./CAP-OPS-class-operations.md)
- [CAP-CARE: Chăm sóc học viên (Student Care & Retention)](./CAP-CARE-student-care.md)

### Layer 2: Supporting Capabilities (Khối hỗ trợ)
- [CAP-FIN: Quản trị Tài chính (Financial Management)](./CAP-FIN-financial-management.md)
- [CAP-HR: Tổ chức & Nhân sự (HR & Organization)](./CAP-HR-human-resources.md)
- [CAP-FCM: Quản lý Cơ sở vật chất (Facility Management)](./CAP-FCM-facility-management.md)

### Layer 3: Governance & Management (Khối quản trị)
- [CAP-SYS: Quản trị Hệ thống (System & Identity Governance)](./CAP-SYS-system-governance.md)
- [CAP-MDM: Dữ liệu Gốc (Master Data Management)](./CAP-MDM-master-data.md)
- [CAP-RPT: Báo cáo & Phân tích (Reporting & Analytics)](./CAP-RPT-reporting-analytics.md)

---

## Danh mục Business Functions theo Capability

### 1. Học thuật & Đào tạo (`CAP-ACD`)
- `BF-ACD-01`: Quản lý Chương trình đào tạo (Program Management)
- `BF-ACD-02`: Lộ trình học (Learning Path)
- `BF-ACD-03`: Khung chương trình (Syllabus)
- `BF-ACD-04`: Thành phần bài học (Lesson Components)
- `BF-ACD-05`: Nhóm kỹ năng (Skill Category)
- `BF-ACD-06`: Giáo trình (Curriculum)
- `BF-ACD-07`: Thiết lập học thuật (Academic Settings) (✅ Đã chuẩn hóa)
  - `US-ACD-07-01`: Thiết lập Tham số Lớp học (Thời lượng, Sĩ số)
  - `US-ACD-07-02`: Thiết lập Lịch nghỉ lễ Học thuật
- `BF-QA-01`: Đánh giá chất lượng giảng dạy (Academic QC)

### 2. Quản lý Tuyển sinh (`CAP-ADM`)
- `BF-CRM-01`: Lead Generation & Qualification (✅ Chuẩn vàng)
- `BF-CRM-02`: Sales Pipeline & Opportunity Mgt (✅ Chuẩn vàng)
- `BF-ENR-01`: Assessment Booking & Execution (✅ Chuẩn vàng)
  - `US-BT01`: Quản lý Danh sách Booking Test
  - `US-BT02`: Tạo mới Booking Test
  - `US-BT03`: Xem/Cập nhật Chi tiết Booking
  - `US-BT04`: Đánh giá English Assessment Path
  - `US-BT05`: Thực thi & Đồng bộ Kết quả Test iPad
- `BF-ENR-02`: Trial Booking & Execution (✅ Chuẩn vàng)
  - `US-ENR02-01`: Quản lý Danh sách Booking Học thử
  - `US-ENR02-02`: Tạo mới Booking Học thử
  - `US-ENR02-03`: Thao tác Ghép lớp & Buổi học
  - `US-ENR02-04`: Xử lý Ngoại lệ Booking
  - `US-ENR02-05`: Giáo viên Nhận xét & Trả kết quả
- `BF-ENR-03`: Quản lý sự kiện tuyển sinh (✅ Chuẩn vàng)
- `BF-SAL-03`: Đánh giá năng lực

### 3. Thương mại & Bán hàng (`CAP-COM`)
- `BF-PRD-01`: Product & Bundle Strategy (✅ Chuẩn vàng)
- `BF-SAL-01`: Order Creation & Fulfillment (✅ Chuẩn vàng)

### 4. Vận hành Lớp & Học viên (`CAP-OPS`)
- `BF-OPS-02`: Class Scheduling & Conflict Resolution (✅ Đã chuẩn hóa)
  - `US-OPS02-01`: Quản lý Danh sách Buổi học tại Lớp
  - `US-OPS02-02`: Khởi tạo & Sinh Lịch học
  - `US-OPS02-03`: Quản lý Lịch Tổng thể Cơ sở
  - `US-OPS02-04`: Thuật toán Quét xung đột
- `BF-OPS-03`: Class Delivery Lifecycle (✅ Đã chuẩn hóa)
  - `US-OPS03-01`: Xử lý Dạy thay
  - `US-OPS03-02`: Xử lý Đổi phòng
  - `US-OPS03-03`: Hủy Buổi học & Dịch lịch
  - `US-OPS03-04`: Tổ chức Học bù
- `BF-OPS-04`: Nhận xét & Bài tập (Session Feedback) (✅ Đã chuẩn hóa)
  - `US-OPS04-01`: Nhận xét học viên theo buổi
  - `US-OPS04-02`: Bảng điều khiển nhận xét toàn trung tâm
  - `US-OPS04-03`: Quản lý bài tập theo buổi
- `BF-CLS-02`: Quản lý Lớp học (✅ Đã chuẩn hóa)
  - `US-CLS02-01`: Quản lý Danh sách Lớp học
  - `US-CLS02-02`: Tạo mới Vỏ lớp học
  - `US-CLS02-03`: Gán Khung chương trình vào Lớp
  - `US-CLS02-04`: Xem Dashboard Tiến độ Lớp học
  - `US-CLS02-05`: Đóng lớp / Tốt nghiệp
- `BF-CLS-03`: Quản lý Học viên (gồm Chờ xếp lớp) (✅ Đã chuẩn hóa)
  - `US-CLS03-01`: Quản lý Danh sách HV Cơ sở
  - `US-CLS03-02`: Xem Danh sách HV trong Lớp
  - `US-CLS03-03`: Gắn Tag Chú ý HV
  - `US-CLS03-04`: Tab Tổng quan Thông tin Lớp đang học
  - `US-CLS03-05`: Tab Lịch sử Điểm danh
  - `US-CLS03-06`: Tab Lịch sử Nhận xét
  - `US-CLS03-07`: Tab Đơn hàng / Gói đăng ký
  - `US-CLS03-08`: Tab Năng lực / Trình độ
  - `US-CLS03-09`: Tab Lịch sử Buổi học
  - `US-CLS03-10`: Tab Bài tập về nhà
  - `US-CLS03-11`: Tab Chăm sóc / Ticket
  - `US-CLS03-12`: Tab Ghi chú Vận hành
  - `US-CLS03-13`: Tab Nhật ký Thao tác
  - `US-CLS03-14`: Tab Lịch sử Trạng thái
  - `US-CLS03-15`: Tab Lịch học Sắp tới
  - `US-CLS03-16`: Tab Thông tin Phụ huynh
  - `US-CLS01-01`: Bộ lọc HV chờ xếp lớp (hợp nhất vào BF-CLS-03)
  - `US-CLS01-02`: Thêm HV từ Chi tiết lớp (hợp nhất vào BF-CLS-03)
  - `US-CLS01-03`: Xếp lớp Hàng loạt (hợp nhất vào BF-CLS-03)
- `BF-CLS-04`: Quản lý Giáo viên chủ nhiệm (✅ Đã chuẩn hóa)
  - `US-CLS04-01`: Quản lý Danh sách GV Cơ sở
  - `US-CLS04-02`: Gán/Đổi GV Chủ nhiệm
  - `US-CLS04-03`: Xem Lịch sử Thay đổi GV
  - `US-CLS04-04`: Tab Tổng quan GV
  - `US-CLS04-05`: Tab Lớp đang Phụ trách
  - `US-CLS04-06`: Tab Lịch dạy Tuần
  - `US-CLS04-07`: Tab Lịch sử Dạy thay
  - `US-CLS04-08`: Tab Đánh giá Chất lượng
  - `US-CLS04-09`: Tab Thống kê Giờ dạy
  - `US-CLS04-10`: Tab Phản hồi từ HV
  - `US-CLS04-11`: Tab Ghi chú Vận hành GV
  - `US-CLS04-12`: Tab Nhật ký Thao tác GV
- `BF-CLS-05`: Điểm danh & Nhận xét (✅ Đã chuẩn hóa)
  - `US-CLS05-01`: Điểm danh / Chấm điểm theo Buổi
  - `US-CLS05-02`: Đánh giá Định kỳ theo Lớp
  - `US-CLS05-03`: Xem Báo cáo Điểm danh / Học tập
  - `US-CLS05-04`: Kiểm duyệt Điểm danh
  - `US-CLS05-05`: Xem Kết quả BTVN theo Buổi
  - `US-CLS05-06`: Quản lý BTVN Toàn trung tâm
  - `US-CLS05-07`: Upload Media Buổi học
- `BF-CLS-06`: Nghỉ học, Bảo lưu, Chuyển lớp (✅ Đã chuẩn hóa)
  - `US-CLS06-01`: Xử lý Chuyển lớp
  - `US-CLS06-02`: Xử lý Bảo lưu
  - `US-CLS06-03`: Xử lý Nghỉ học Hạn
  - `US-CLS06-04`: Duyệt Đơn Nghỉ phép

### 5. Chăm sóc học viên (`CAP-CARE`)
- `BF-CARE-01`: Student Care & Ticket Lifecycle (✅ Chuẩn vàng)
- `BF-CARE-02`: Renewal & Retention Campaign (✅ Chuẩn vàng)

### 6. Quản trị Tài chính (`CAP-FIN`)
- `BF-FIN-01`: Thiết lập Chính sách Tài chính (✅ Mới tạo)
  - `US-FIN-01-01`: Thiết lập Chính sách Hoàn tiền
- `BF-SAL-02`: Payment, Receipt & Revenue Management

### 7. Tổ chức & Nhân sự (`CAP-HR`)
- `BF-ORG-01`: Branch & Facility Setup (✅ Chuẩn vàng)
  - `US-ORG-01-01`: Thiết lập Giờ Hoạt động Chi nhánh
- `BF-ORG-02`: Organization Structure Governance (✅ Chuẩn vàng)
- `BF-HR-01`: Employee Lifecycle — Hire-to-Retire (✅ Đã có US)
  - `US-HR-01`: Tạo mới Nhân sự
  - `US-HR-01-01`: Quản lý Danh sách Nhân sự
- `BF-HR-02`: Quản lý Lịch làm việc & Quỹ thời gian (Workforce Scheduling) (✅ Đã chuẩn hóa)
  - `US-HR-02-01`: Cá nhân đăng ký lịch rảnh (Quỹ thời gian)
  - `US-HR-02-02`: Quản lý Đăng ký hộ & Theo dõi
  - `US-HR-02-03`: Quản lý lịch theo trung tâm (Heatmap)
  - `US-HR-02-04`: Xem Lịch của tôi (My Schedule / Aggregator)
- `BF-HR-03`: Phối hợp & Sự kiện nội bộ (Collaboration & Events) (Dự kiến)
  - `US-HR-03-01`: Nhận & Phản hồi lời mời họp (Inbox)
  - `US-HR-03-02`: Tạo & Cập nhật Sự kiện cá nhân
  - `US-HR-03-03`: Mời & Quản lý người tham dự (Attendees)
  - `US-HR-03-04`: Đặt phòng & Tài nguyên (Resource Booking)
  - `US-HR-03-05`: Thiết lập Lịch lặp & Nhắc nhở

### 8. Cơ sở vật chất (`CAP-FCM`)
- `BF-QA-02`: Facility Maintenance & Checklist

### 9. Quản trị Hệ thống (`CAP-SYS`)
- `BF-SYS-01`: Identity Lifecycle Management (ILM) (✅ Đã chuẩn hóa)
  - `US-SYS-01-01`: Danh sách Tài khoản
  - `US-SYS-01-02`: Tạo Tài khoản
  - `US-SYS-01-03`: Khóa / Mở khóa Tài khoản
  - `US-SYS-01-04`: Reset Mật khẩu
- `BF-SYS-02`: Platform Configuration Governance (✅ Đã có)
  - `US-SYS-02-01`: Cấu hình Chung
  - `US-SYS-02-02`: Tham số Vận hành
- `BF-SYS-03`: Device Provisioning Lifecycle (✅ Đã có)
  - `US-SYS-03-01`: Danh sách Thiết bị
  - `US-SYS-03-02`: Chuyển Thiết bị
  - `US-SYS-03-03`: Đồng bộ LMS
- `BF-SYS-04`: Entitlement & Authorization (✅ Đã chuẩn hóa)
  - `US-SYS-04-01`: Thiết lập Topic / Nhóm quyền
  - `US-SYS-04-02`: Gán Nhóm quyền cho Thành viên
  - `US-SYS-04-03`: Áp dụng Data Scope
- `BF-SYS-05`: Authentication Services (IdP) (✅ Đã chuẩn hóa)
  - `US-SYS-05-01`: Đăng nhập & Nạp quyền
  - `US-SYS-05-02`: Đổi Mật khẩu
  - `US-SYS-05-03`: Đăng xuất

### 10. Dữ liệu Gốc (`CAP-MDM`)
- `BF-MDM-01`: Person Identity Lifecycle (✅ Đã chuẩn hóa)
  - `US-MDM-01-01`: Quản lý Danh tính Cá nhân
  - `US-MDM-01-02`: Tạo / Cập nhật Hồ sơ Cá nhân
  - `US-MDM-01-03`: Quản lý Thông tin Liên lạc
  - `US-MDM-01-04`: Gộp Bản ghi Trùng lặp
- `BF-MDM-02`: Household & Relationship Governance (✅ Đã chuẩn hóa)
  - `US-MDM-02-01`: Danh sách Hộ gia đình
  - `US-MDM-02-02`: Quản lý Thành viên Hộ
  - `US-MDM-02-03`: Cây Quan hệ
- `BF-MDM-03`: B2B Partner Entity Management (✅ Đã chuẩn hóa)
  - `US-MDM-03-01`: Danh sách Đối tác
  - `US-MDM-03-02`: Gán Key Contact

### 11. Báo cáo & Phân tích (`CAP-RPT`)
- `BF-RPT-01`: Executive Reporting & Analytics

---

## Luồng nghiệp vụ tổng thể (Master Flows)
- [FLOW-MDM-00: Vòng đời Dữ liệu Đối tác (Party Data Lifecycle)](./FLOW-MDM-00-party-data-lifecycle.md)
- [FLOW-ENR-00: Luồng Tuyển sinh (Lead to Student)](./FLOW-ENR-00-vong-doi-tuyen-sinh.md)
- [FLOW-ENR-01: Vòng đời Booking Test](./FLOW-ENR-01-booking-test.md)
- [FLOW-ENR-02: Học thử ghép buổi](./FLOW-ENR-02-hoc-thu-ghep-buoi.md)
- [FLOW-OPS-00: Vòng đời Lớp học (Class Lifecycle)](./FLOW-OPS-00-vong-doi-lop-hoc.md)
- [FLOW-OPS-01: Vòng đời Buổi học (Session Lifecycle)](./FLOW-OPS-01-vong-doi-buoi-hoc.md)
- [FLOW-SYS-00: Vòng đời IAM (Identity & Access Lifecycle)](./FLOW-SYS-00-iam-lifecycle.md)
