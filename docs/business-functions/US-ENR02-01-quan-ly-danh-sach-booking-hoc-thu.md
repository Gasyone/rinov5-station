# US-ENR02-01: Quản lý danh sách và Xem chi tiết Booking

## 1. Thông tin chung
- **Epic:** Học thử ghép buổi
- **Business Function:** `BF-ENR-02`
- **Menu ID:** `trial_class`
- **Loại:** User Story

## 2. Mục tiêu (User Story)
- **Là (As a):** Sale, CSM, Branch Manager
- **Tôi muốn (I want to):** Xem toàn bộ danh sách vé học thử, sử dụng bộ lọc đa chiều và xem chi tiết lịch sử của một vé.
- **Để (So that):** Quản lý trạng thái phễu khách hàng học thử, dễ dàng theo dõi ai đang chờ ghép lớp, ai đã hoàn thành để follow-up.

## 3. Giao diện (UI/UX)
- Sử dụng màn hình `trial_class` chính.
- **Filter Tabs:** Tất cả, Chờ ghép (Pending), Đã xác nhận (Confirmed), Cần đổi lịch (Reschedule), Đã hủy (Cancelled), Hoàn thành (Completed).
- **Table Data:** ID, Tên Lead, SĐT Phụ huynh, Môn học, Trình độ dự kiến, Lớp ghép (nếu có), Ngày/Giờ buổi học, Người phụ trách, Trạng thái.
- **Drawer Chi tiết:** Khi click vào một dòng, mở Drawer bên phải hiển thị chi tiết:
  - Thông tin Lead.
  - Lịch sử thao tác (Log: Ai tạo, ai ghép lớp, lý do hủy).
  - Box hiển thị kết quả nhận xét (nếu đã Hoàn thành).

## 4. Acceptance Criteria (Tiêu chí nghiệm thu)
- **AC1:** Hiển thị đúng số lượng Booking trên từng Filter Tab dựa trên trạng thái.
- **AC2:** Hỗ trợ tìm kiếm nhanh bằng Mã KH, Tên Lead, Số điện thoại.
- **AC3:** Hỗ trợ bộ lọc nâng cao (Filter Drawer): Theo Cơ sở, Theo khoảng thời gian (Ngày tạo hoặc Ngày dự kiến học), Theo người phụ trách (Owner).
- **AC4:** Drawer chi tiết hiển thị đầy đủ thông tin Audit Log, không cho phép chỉnh sửa trực tiếp các trường Read-only (như lịch sử).

## 5. Corner Cases
| Case ID | Tình huống | Xử lý mong muốn |
|---------|------------|-----------------|
| CC01 | Booking bị thay đổi trạng thái bởi 1 user khác. | Nút Refresh data / Cập nhật realtime (nếu có) hoặc báo lỗi "Dữ liệu đã cũ" khi user cố thao tác. |
