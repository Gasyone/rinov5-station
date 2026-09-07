# 🏢 Hệ thống Quản trị Trung tâm & Trường học (Rinov5 Station)

## 🎓 1. Đào tạo & Học vụ (Academic Ops)
- 🏫 **Quản lý Lớp học (`/classes`)**
  - Danh sách & Trạng thái lớp (Sắp khai giảng, Đang học, Tạm dừng, Kết thúc)
  - Sĩ số tối đa & Tỷ lệ lấp đầy
  - Lộ trình học & Khung chương trình
- 👨‍🎓 **Hồ sơ Học viên (`/students`)**
  - Thông tin cá nhân & Liên hệ phụ huynh (Ẩn số điện thoại chống copy)
  - Quá trình học tập & Lịch sử lớp đã học
  - Điểm kiểm tra định kỳ & Nhận xét của giáo viên
- 📅 **Thời khóa biểu & Lịch phòng (`/calendar_class_schedule`)**
  - Lịch học theo tuần / tháng / giảng viên
  - Phân bổ phòng học & Tránh xung đột phòng
- 📋 **Xử lý Sự vụ Học tập**
  - Đơn xin nghỉ phép & Bảo lưu kết quả
  - Xếp lịch học bù & Đảo buổi học
  - Điểm danh & Ghi nhận vắng mặt

## 🎯 2. Tuyển sinh & Trải nghiệm (Admissions & Testing)
- 📝 **Đặt lịch Kiểm tra Đầu vào (`/booking-test`)**
  - Tiếp nhận đăng ký test từ CRM/CARE
  - Phân ca kiểm tra & Giáo viên chấm
  - Trả kết quả & Đề xuất lớp học phù hợp
- 🔄 **Quy trình Chuyển đổi**
  - Chuyển học viên tiềm năng thành học viên chính thức
  - Tạo đơn đăng ký khóa học tự động

## 👥 3. Nhân sự & Giảng viên (HR & Faculty)
- 👩‍🏫 **Đội ngũ Giảng viên & Trợ giảng**
  - Chuyên môn, Bằng cấp & Chứng chỉ
  - Lịch bận & Hạn mức giờ dạy tối đa
  - Đánh giá chất lượng giảng dạy từ học viên
- 👔 **Cán bộ & Nhân viên (`/hr_employees`)**
  - Hồ sơ nhân sự theo cơ sở
  - Phân quyền vị trí công việc
  - Chấm công & Phân ca làm việc

## 💰 4. Tài chính & Bán hàng (Finance & Commerce)
- 📑 **Đơn hàng & Học phí (`/orders`)**
  - Quản lý phiếu thu học phí & Đặt cọc
  - Theo dõi công nợ & Trả góp
  - Xuất hóa đơn điện tử
- 📦 **Sản phẩm & Khóa học (`/products`)**
  - Gói học phí (Ngắn hạn, Dài hạn, 1-kèm-1)
  - Giáo trình, Học liệu & Đồng phục
  - Chương trình khuyến mãi, Voucher & Học bổng

## 🏛️ 5. Vận hành Cơ sở & Tài sản (Campus & Logistics)
- 🏢 **Chi nhánh & Cơ sở (`/branches`)**
  - Thiết lập thời gian hoạt động
  - Thông tin liên hệ & Quản lý trưởng cơ sở
- 🚪 **Phòng học & Trang thiết bị**
  - Sức chứa từng phòng (Ghế, Máy tính, Máy chiếu)
  - Trạng thái bảo trì & Lịch sử sử dụng thiết bị

## ⚙️ 6. Kiến trúc & Nền tảng Kỹ thuật (Architecture)
- 💻 **Frontend Station (Rinov5)**
  - Next.js 16 (App Router) + React 19 + TypeScript
  - Giao diện TailwindCSS v4 + Thư viện chuẩn shadcn/ui
  - Quản lý trạng thái: Zustand Store + Cookie Auth Session
  - Chuẩn Design System: StatusBadge, MetricTiles, DataTableFrame
- 🗄️ **Backend & Cơ sở dữ liệu Dùng chung**
  - Dùng chung CSDL đồng nhất với CRM, ERP, CARE
  - Zero Sync Job: Không cần job đồng bộ ngầm vì chung bảng dữ liệu
  - Phân quyền động theo Năng lực Nguyên tử (Atomic Capability Gating)
