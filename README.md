# Rinov5 - Demo Application

Đây là bản Demo ứng dụng Front-end cho Hệ thống ERP Quản lý Giáo dục (RinoEdu) phiên bản mới nhất, sử dụng kiến trúc Next.js (App Router). Phiên bản này được xây dựng để trình diễn các chức năng nghiệp vụ cốt lõi, hoàn toàn dựa trên dữ liệu giả lập (Mock Data) ở phía Client.

## Bối Cảnh Hệ Sinh Thái RinoEdu
RinoEdu là một tổ chức kinh doanh giáo dục chuyên cung cấp các chương trình học nâng cao (Toán, Tiếng Anh,...). Hệ sinh thái của RinoEdu bao gồm nhiều mô hình giảng dạy:
- **Station**: Các trung tâm học tập trực tiếp (vật lý).
- **Tutor**: Hệ thống gia sư.
- **Digital**: Hệ thống giáo viên trực tuyến/số hóa.

Hệ thống quản trị trước đây được phân mảnh thành nhiều domain riêng biệt (LMS, ERP cũ, CRM cũ, Care cũ). **Dự án Rinov5 (kế thừa từ Rinov4)** được định vị là hệ thống lõi dành riêng cho **Station** nhằm hợp nhất và tối ưu hóa toàn bộ quá trình quản trị, vận hành tại các chi nhánh/trung tâm.

## Mục Tiêu Của Dự Án Demo
* **Trình diễn luồng nghiệp vụ**: Thể hiện trực quan các luồng nghiệp vụ trong quản lý trung tâm/trường học (từ khi có khách hàng tiềm năng đến quản lý học viên, xếp lớp, báo cáo).
* **Đồng nhất UI/UX**: Sử dụng Design System chuẩn (shadcn/ui + TailwindCSS) để mang lại trải nghiệm hiện đại, phản hồi nhanh gọn và đồng nhất.
* **Hoạt động Độc Lập**: Có thể chạy và demo cho người dùng, nhà đầu tư hoặc các bên liên quan mà không cần backend hay database (không phụ thuộc kết nối mạng/API).

## Các Phân Hệ Tính Năng Chính (Core Modules)
Dự án được chia thành các phân hệ nghiệp vụ chính dựa trên 11 Năng lực Ký thuật (Capabilities) của hệ thống EdTech:

1. **Dashboard & Tổng quan**: Theo dõi các chỉ số chính của chi nhánh, hệ thống.
2. **Quản lý Tuyển sinh (Admissions)**: Booking học thử (Test/Trial), theo dõi các cơ hội (Sales Pipeline).
3. **Quản lý Lớp & Học viên (Class Operations)**: Xếp lớp, điểm danh, quản lý học viên (chuyển lớp, bảo lưu, nghỉ học), quản lý lịch học.
4. **Học thuật & Đào tạo (Academic)**: Quản lý khung chương trình, bài giảng, giáo trình.
5. **Thương mại & Bán hàng (Commerce)**: Quản lý sản phẩm, giỏ hàng, phiếu thu, đơn hàng (Orders).
6. **Nhân sự & Tổ chức (HR & Org)**: Sơ đồ tổ chức (Chi nhánh, Phòng ban), danh sách nhân viên (Giáo viên, Sale, CS...).
7. **CSKH (Student Care)**: Quản lý ticket khiếu nại/yêu cầu của phụ huynh, gia hạn khóa học.

## Công Nghệ Sử Dụng (Tech Stack)
* **Framework**: Next.js 16.2 (App Router), React 19, TypeScript 5.
* **Styling & UI**: TailwindCSS v4, shadcn/ui (42 components), Radix UI, Lucide Icons.
* **State Management**: Zustand.
* **Mock Data**: Dữ liệu ảo tĩnh tích hợp sẵn.

## Cách Khởi Chạy
Dự án được cấu hình sẵn để chạy ở môi trường phát triển:

```bash
npm install
npm run dev
```

Mở trình duyệt tại [http://localhost:3000](http://localhost:3000). Tại màn hình Login, bạn có thể nhập Email/Mật khẩu bất kỳ để đăng nhập hệ thống và xem các luồng demo.

## Tài Liệu Tham Khảo
Vui lòng tham khảo thư mục `docs/` để xem bản đồ tính năng chi tiết và đặc tả nghiệp vụ (Business Functions/User Stories) của các module.
