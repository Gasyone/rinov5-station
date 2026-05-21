---
id: US-HR-01-03
title: "Chi tiết Hồ sơ Nhân sự"
bf: BF-HR-01
domain: CAP-HR
status: draft
tags: [hr, employee, detail, profile]
---

# US-HR-01-03: Chi tiết Hồ sơ Nhân sự

> **Tham chiếu:** BF-HR-01 · Giao diện Mẫu §4.3 (Trang chi tiết)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Chuyên viên Nhân sự (HR), **tôi muốn** có một màn hình quản lý chi tiết vòng đời của nhân viên, **để** cập nhật thông tin cá nhân, theo dõi lịch sử điều chuyển công tác, và thay đổi trạng thái làm việc (như nghỉ việc, tạm hoãn).

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập với quy trình tạo mới.
> - [x] **N**egotiable — Số lượng thẻ (Tab) có thể mở rộng theo nghiệp vụ (Lương, Đánh giá).
> - [x] **V**aluable — Cung cấp cái nhìn 360 độ về một nhân viên trong tổ chức.
> - [x] **E**stimable — Dựa trên cấu trúc chuẩn của trang chi tiết.
> - [x] **S**mall — Hoàn thành trong 1 vòng phát triển.
> - [x] **T**estable — Có tiêu chí kiểm tra việc chặn sửa Mã nhân viên và ghi nhận lịch sử.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-HR-DETAIL-01]:** Cấm sửa Mã nhân viên: Mã nhân viên (Employee ID) là trường dữ liệu bất biến sau khi được khởi tạo, tuyệt đối không được phép chỉnh sửa để đảm bảo tính toàn vẹn dữ liệu.
2. **[RULE-HR-DETAIL-02]:** Chuyển trạng thái nghỉ việc: Khi chuyển trạng thái sang "Đã nghỉ việc", hệ thống phải cảnh báo và tự động gửi tín hiệu vô hiệu hóa tài khoản đăng nhập sang phân hệ Hệ thống (`CAP-SYS`). Nhân viên nghỉ việc sẽ bị mất quyền truy cập phần mềm ngay lập tức.
3. **[RULE-HR-DETAIL-03]:** Lịch sử tự động: Mọi thay đổi liên quan đến Vị trí công tác (Chi nhánh, Phòng ban, Chức danh) đều phải sinh ra một bản ghi mới trong Thẻ Lịch sử điều chuyển, không được ghi đè bản ghi hiện tại.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** 2 cột (Tóm tắt 30% / Chi tiết 70%).

### 3.1. Tiêu đề & Nút thao tác
| Nút | Loại | Logic chuyển trạng thái | Điều kiện |
|-----|------|-------------------------|-----------|
| Đổi trạng thái | Nút màu cảnh báo | Mở Hộp thoại xác nhận đổi trạng thái làm việc (Thử việc -> Chính thức, Tạm hoãn, Đã nghỉ việc) | Trừ khi đang "Đã nghỉ việc" |
| Sửa thông tin | Nút biểu tượng | Kích hoạt chế độ sửa ở Thẻ hiện tại | Trừ khi đang "Đã nghỉ việc" |

### 3.2. Cột trái — Tóm tắt (Chỉ xem)
| Thông tin | Loại | Trường | Ghi chú |
|-----------|------|--------|---------|
| Ảnh đại diện | Hình ảnh | Avatar | |
| Họ và tên | Chữ đậm lớn | Họ và tên | |
| Trạng thái | Nhãn màu | Trạng thái (Thử việc/Chính thức/Đã nghỉ việc) | Theo bộ màu chuẩn |
| Vị trí chính | Chữ đậm vừa | Chức danh - Phòng ban | |
| Mã nhân viên | Chữ nhỏ mờ | Mã nhân viên | Bất biến |
| Liên hệ nhanh | Danh sách dọc | SĐT, Email | |

### 3.3. Cột phải — Chi tiết
Bao gồm hệ thống Thẻ (Tabs) để phân chia lượng thông tin lớn.

**Thẻ 1: Thông tin cá nhân**
| Khu vực | Loại | Trường | Ghi chú |
|---------|------|--------|---------|
| Định danh | Tiêu đề-Giá trị | Ngày sinh, Giới tính, CCCD | |
| Địa chỉ | Tiêu đề-Giá trị | Tỉnh/Thành phố, Địa chỉ thường trú | |
| Thông tin khác | Ô nhập liệu tự do | Ghi chú cá nhân, Sở thích | Sửa nhanh |

**Thẻ 2: Quá trình công tác**
| Khu vực | Loại | Trường | Ghi chú |
|---------|------|--------|---------|
| Vị trí hiện tại | Bảng dữ liệu | Chi nhánh, Phòng ban, Chức danh, Ngày bắt đầu | Thể hiện cả Vị trí chính và Kiêm nhiệm |
| Lịch sử điều chuyển | Dòng thời gian | Lịch sử thay đổi vị trí công tác | Tự động sinh khi có thay đổi |

### 3.4. Lịch sử hoạt động
| Thành phần | Loại | Dữ liệu | Hoạt động |
|------------|------|---------|-----------|
| Nhật ký thao tác | Danh sách dọc | Lịch sử cập nhật hồ sơ, đổi trạng thái | Mới nhất trên cùng. Có lưu vết người thực hiện. |

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Xem hồ sơ không tồn tại | Hiện thông báo "Không tìm thấy dữ liệu nhân sự". Quay về màn hình danh sách. |
| 4.2 | Thao tác Đổi sang Nghỉ việc | Bắt buộc hiện Hộp thoại Xác nhận nguy hiểm: "Nhân viên này sẽ bị khóa tài khoản truy cập hệ thống ngay lập tức. Xác nhận cho nghỉ việc?" |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Tuân thủ chặt chẽ ranh giới trách nhiệm: Giao diện chi tiết chỉ hiển thị và điều phối các thành phần con, không ôm đồm xử lý logic thay đổi vị trí công tác (giao cho Component điều chuyển).
- Các hành động thay đổi vòng đời (Đổi sang Nghỉ việc) phải bắt buộc thông qua hệ thống Xác nhận (`<ConfirmDialog>`) thống nhất và gọi hàm hủy phiên làm việc.
- Áp dụng các quy tắc phân quyền (Authorization) trước khi hiển thị các nút Sửa và Đổi trạng thái.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** cho phép sửa Mã nhân viên dưới bất kỳ hình thức nào.
- **KHÔNG** cho phép xóa (Hard Delete) lịch sử điều chuyển công tác.
- **KHÔNG** bỏ qua bước xác nhận cho hành động Nghỉ việc.

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Bố cục 2 cột | So với §4.3 | 2 cột trên máy tính, 1 cột trên điện thoại. |
| AC-02 | Khóa Mã nhân viên | Bấm nút Sửa thông tin cá nhân | Ô nhập Mã nhân viên vẫn bị làm mờ (chỉ đọc), không thể tương tác. |
| AC-03 | Đổi trạng thái nghỉ việc | Bấm Đổi trạng thái -> Chọn Đã nghỉ việc | Hiện Hộp thoại cảnh báo rủi ro khóa tài khoản. Bấm Xác nhận thì cập nhật trạng thái. |
| AC-04 | Lịch sử điều chuyển | Thay đổi chức danh từ Nhân viên lên Trưởng nhóm | Hệ thống tự động thêm 1 dòng vào Thẻ Quá trình công tác ghi nhận thay đổi này, hiển thị ngày thực hiện. |
