# US-HR-02 – Quản lý nhân sự (Employee Management)

> **Phạm vi:** Màn hình danh sách nhân sự (`/app/hr/employees`) và Drawer chi tiết nhân sự.

**Là một** Admin / HR,
**Tôi muốn** xem danh sách, tìm kiếm, lọc, xem chi tiết và chỉnh sửa thông tin nhân sự,
**Để** quản lý toàn bộ nhân sự trong hệ thống một cách hiệu quả.

---

### Mô tả chi tiết

#### A. Danh sách nhân sự (EmployeesView)

| Thành phần | Loại control | Mô tả |
|-----------|-------------|-------|
| **Toolbar** | ModuleToolbar | Ô tìm kiếm (theo tên, CCCD, SĐT), nút "+ Thêm mới", nút Filter. |
| **Filter Tabs** | Tab group | 3 tab: Tất cả / Đang làm việc / Đã nghỉ việc — mỗi tab hiển thị count. |
| **Filter Drawer** | Side drawer | Lọc theo trạng thái hợp đồng (checkbox). |
| **Bảng dữ liệu** | Table | 7 cột (xem bảng dưới). Click dòng mở Drawer chi tiết. |
| **Xóa nhân sự** | Inline action | Icon xóa hiện khi hover dòng. Hiển thị modal xác nhận trước khi xóa. |

**Cột bảng dữ liệu:**

| # | Cột | Nội dung |
|---|-----|---------|
| 1 | Checkbox | Multi-select dòng |
| 2 | Thông tin | Avatar/initials, họ tên, SĐT, mã nhân sự |
| 3 | Chức danh | Chức danh chính (active hoặc đầu tiên) |
| 4 | Đơn vị | Tên đơn vị tổ chức chính |
| 5 | Cơ sở | Tên chi nhánh chính (hoặc "Toàn hệ thống") |
| 6 | Loại hợp đồng | Full-time / Part-time |
| 7 | Trạng thái | Badge: Đang làm việc (xanh) / Đã nghỉ việc (đỏ) |

#### B. Drawer chi tiết nhân sự (EmployeeDrawer)

Drawer mở từ bên phải khi click dòng trong bảng. Gồm 2 tab:

**Tab 1 — Thông tin nhân viên:**

| Thành phần | Chế độ xem | Chế độ sửa |
|-----------|-----------|-----------|
| **Phân bổ tổ chức** | Danh sách card: chức danh, đơn vị, phạm vi dữ liệu, badge "Chính" | — (chỉ xem) |
| **Chi nhánh** | Text hiển thị | Input text |
| **Loại hợp đồng** | Badge màu (Emerald/Amber) | Select dropdown |

**Tab 2 — Thông tin cá nhân:**

| Thành phần | Chế độ xem | Chế độ sửa |
|-----------|-----------|-----------|
| **Họ tên** | Text | Input |
| **Email** | Text | Input email |
| **SĐT** | Text | Input tel |
| **Ngày sinh** | Text | Date picker |
| **Giới tính** | Text | Radio: Nam / Nữ / Khác |
| **Địa chỉ** | Text | Textarea |

**Footer:** Nút "Chỉnh sửa" (chế độ xem) → Nút "Hủy" + "Lưu thay đổi" (chế độ sửa).

---

### Corner Cases

| # | Tình huống | Cách xử lý |
|---|-----------|------------|
| C-01 | Danh sách rỗng | Hiển thị empty state với text gợi ý. |
| C-02 | Tìm kiếm không có kết quả | Hiển thị empty state. |
| C-03 | Xóa nhân sự đang mở drawer | Đóng drawer, xóa record khỏi bảng. |
| C-04 | Nhân sự không có assignment | Hiển thị empty state dạng dashed border: "Chưa có phân bổ tổ chức". |
| C-05 | Nhân sự không có thông tin cá nhân | Hiển thị "Chưa cập nhật" cho các trường trống. |
| C-06 | Hủy chỉnh sửa giữa chừng | Discard toàn bộ thay đổi, quay về chế độ xem. |

---

### Acceptance Criteria

- [ ] **AC-01** Bảng hiển thị đủ 7 cột. Dữ liệu load từ backend (nếu có) hoặc local store.
- [ ] **AC-02** Tìm kiếm realtime theo họ tên, CCCD/CMND, SĐT. Normalize tiếng Việt (bỏ dấu khi so sánh).
- [ ] **AC-03** Filter tabs hiển thị đúng count: Tất cả / Đang làm việc / Đã nghỉ việc.
- [ ] **AC-04** Click dòng mở Drawer chi tiết bên phải. Hiển thị đúng thông tin nhân sự.
- [ ] **AC-05** Tab "Thông tin nhân viên": hiển thị danh sách phân bổ tổ chức (chức danh, đơn vị, phạm vi, badge chính), chi nhánh, loại hợp đồng.
- [ ] **AC-06** Tab "Thông tin cá nhân": hiển thị họ tên, email, SĐT, ngày sinh, giới tính, địa chỉ. Có nút "Chỉnh sửa hồ sơ cá nhân".
- [ ] **AC-07** Chế độ sửa (Tab 1): cho phép sửa chi nhánh và loại hợp đồng. Bấm "Lưu thay đổi" cập nhật store. Bấm "Hủy" discard.
- [ ] **AC-08** Xóa nhân sự: hiển thị modal xác nhận với tên nhân sự. Xác nhận → xóa khỏi store và bảng.
- [ ] **AC-09** Empty state hiển thị đúng khi không có dữ liệu (bảng, assignment, thông tin cá nhân).
