---
id: US-HR-01-01
title: "Quản lý Danh sách Nhân sự"
bf: BF-HR-01
domain: CAP-HR
status: draft
tags: [hr, employee, list]
---

# US-HR-01-01: Quản lý Danh sách Nhân sự

> **Tham chiếu:** BF-HR-01 · Giao diện Mẫu §4.2 (Danh sách tiêu chuẩn)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Chuyên viên Nhân sự (HR) / Quản lý Chi nhánh (BM), **tôi muốn** xem, tìm kiếm, và lọc danh sách toàn bộ nhân sự trong phạm vi quản lý, **để** theo dõi thông tin, quá trình công tác và thực hiện các nghiệp vụ quản trị liên quan.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Danh sách hiển thị độc lập với việc tạo mới.
> - [x] **N**egotiable — Giao diện Drawer chi tiết có thể tinh chỉnh sau.
> - [x] **V**aluable — Giúp nhà quản lý nắm bắt nhanh tổng quan nguồn lực.
> - [x] **E**stimable — Dựa trên component DataTable chuẩn.
> - [x] **S**mall — Chỉ tập trung vào xem, lọc và tương tác cơ bản.
> - [x] **T**estable — Có các kịch bản kiểm thử rõ ràng ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-HR-LIST-01]:** Danh sách chỉ hiển thị nhân viên thuộc Chi nhánh / Vùng mà người dùng có quyền (Data Scope áp dụng từ CAP-SYS).
2. **[RULE-HR-LIST-02]:** Chức danh, đơn vị và cơ sở hiển thị trong bảng dữ liệu phải lấy từ **Vị trí Chính (Primary Assignment)** của nhân viên đó.
3. **[RULE-HR-LIST-03]:** Việc Xóa (Hard Delete) chỉ khả dụng nếu nhân sự đó ở trạng thái "Thử việc" và chưa phát sinh bất kỳ giao dịch nào (để tránh lỗi toàn vẹn dữ liệu). Các trạng thái khác chỉ được phép sử dụng tính năng "Đổi trạng thái" (Nghỉ việc, Đình chỉ).
4. **[RULE-HR-LIST-04] Hệ quả của việc Nghỉ việc:** Khi một nhân sự bị chuyển trạng thái thành "Đã nghỉ việc", hệ thống phải TỰ ĐỘNG gọi sang khối `CAP-SYS` để khóa (Deactivate) tài khoản đăng nhập của người này, ngăn chặn truy cập trái phép.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** Module Toolbar → Status Tabs → Data Table → Pagination. Tích hợp Drawer (Panel bên phải) để xem chi tiết nhanh.

### 3.1. Các nút Thao tác (Action Buttons)
| Nút | Vị trí | Quyền hạn | Chức năng |
|-----|--------|-----------|-----------|
| + Thêm mới | Toolbar (Primary) | HR Admin | Chuyển đến trang Tạo mới Nhân sự (`US-HR-01-02`). |
| Xuất dữ liệu | Toolbar (Secondary)| HR Admin | Tải file Excel danh sách nhân sự hiện tại. |
| Đổi trạng thái | Inline (Table) | HR Admin | Mở Dialog đổi trạng thái (Tạm đình chỉ, Đã nghỉ việc). Cập nhật theo RULE-HR-LIST-04. |
| Xóa | Inline (Table) | HR Admin | Xóa hồ sơ (hiển thị Dialog xác nhận). Chặn theo RULE-HR-LIST-03. |
| Xem chi tiết | Inline (Click dòng) | BM, HR | Mở Drawer chi tiết nhân sự bên phải màn hình. |

### 3.2. Bộ lọc (Filters)
| Bộ lọc | Loại UI | Nguồn dữ liệu | Mặc định |
|--------|---------|---------------|----------|
| Tìm kiếm | Text Input | Họ tên, Mã NV, CCCD, SĐT | Bỏ trống |
| Trạng thái HĐ | Checkbox | Danh mục trạng thái | Tất cả |
| Chi nhánh | Dropdown | Danh sách Chi nhánh | Chi nhánh hiện tại |
| Loại hợp đồng | Dropdown | Full-time, Part-time | Tất cả |

### 3.3. Bảng dữ liệu (Data Table)
| Cột | Hiển thị | Sắp xếp | Ghi chú |
|-----|----------|---------|---------|
| Thông tin | Avatar, Họ tên, SĐT, Mã NV | Không | Cột chính, click vào để mở Drawer. |
| Chức danh | Tên chức danh | Không | Lấy từ Vị trí Chính (Primary). |
| Đơn vị | Tên phòng ban / tổ chức | Không | Lấy từ Vị trí Chính (Primary). |
| Cơ sở | Tên Chi nhánh | Có | Lấy từ Vị trí Chính (Primary). |
| Loại hợp đồng | Full-time / Part-time | Không | |
| Trạng thái | Nhãn màu (Badge) | Có | Đang làm việc (Tích cực), Đã nghỉ việc (Báo lỗi). |

### 3.4. Giao diện Chi tiết Nhanh (Drawer / Panel)
Mở từ bên phải khi click vào một dòng.
- **Tab Thông tin nhân viên:** Danh sách thẻ (card) mô tả các vị trí công tác (Đơn vị, Chức danh, Badge "Chính"), Chi nhánh trực thuộc.
- **Tab Thông tin cá nhân:** Họ tên, Email, SĐT, Ngày sinh, Giới tính, Địa chỉ. Có nút "Sửa" nếu có quyền.

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Không tìm thấy dữ liệu | Hiển thị EmptyState: "Không có nhân sự nào khớp với điều kiện lọc". |
| 4.2 | Nhân sự chưa có Phân bổ tổ chức | Bảng dữ liệu cột Chức danh, Đơn vị hiển thị "Chưa cập nhật". Drawer hiển thị EmptyState dạng dashed border. |
| 4.3 | Cố xóa nhân sự đã phát sinh dữ liệu | Hiển thị lỗi (Toast) chặn việc xóa. Hướng dẫn đổi trạng thái sang "Đã nghỉ việc". |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Phải kiểm tra phân quyền (Authorization) và phạm vi dữ liệu (Data Scope) trước khi cho phép xem dữ liệu và thực hiện thao tác xóa/sửa.
- Nhãn trạng thái bắt buộc lấy màu từ bộ quy tắc trạng thái chuẩn của doanh nghiệp (Design System).
- Bố cục danh sách phải đáp ứng đúng chuẩn trải nghiệm người dùng, sử dụng chung component DataTable hiện có.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** thêm cột, trường lọc, hoặc nút bấm ngoài danh sách đã được định nghĩa ở mục 3.
- **KHÔNG** bỏ qua các trạng thái Trống / Đang tải / Lỗi (Empty, Loading, Error state) trong thiết kế luồng.
- **KHÔNG** bỏ qua bước xác nhận (Confirmation Dialog) khi thực hiện chức năng Xóa.

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Phân quyền hiển thị | Đăng nhập bằng tài khoản BM chi nhánh A | Chỉ nhìn thấy nhân viên thuộc chi nhánh A. Không thấy chi nhánh B. |
| AC-02 | Tìm kiếm thời gian thực | Nhập "Nguyen" vào ô tìm kiếm | Bảng lọc ngay lập tức danh sách các nhân sự có tên "Nguyen". Bỏ dấu tiếng Việt. |
| AC-03 | Hiển thị Vị trí Chính | Kiểm tra nhân viên có 2 vị trí công tác | Bảng chỉ hiển thị Chức danh và Đơn vị của Vị trí được đánh dấu là "Chính" (Primary). |
| AC-04 | Mở chi tiết nhanh | Click vào một dòng trong bảng | Drawer mở ra bên phải, hiển thị 2 tab thông tin nhân viên và cá nhân đúng dữ liệu. |
| AC-05 | Đổi trạng thái Nghỉ việc | Bấm "Đổi trạng thái" $\rightarrow$ Chọn "Nghỉ việc" | Hệ thống báo thành công. Trạng thái đổi thành đỏ. Tài khoản đăng nhập tương ứng bị khóa. |
| AC-06 | Ngăn chặn xóa | Xóa nhân sự ở trạng thái "Chính thức" | Hệ thống chặn và hiển thị thông báo lỗi. Nút xóa bị vô hiệu hóa hoặc ẩn đi. |
