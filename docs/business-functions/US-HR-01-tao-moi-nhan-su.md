# US-HR-01 – Tạo mới nhân sự (Employee Creation)

> **Phạm vi:** Modal "Thêm nhân sự mới" từ màn hình Quản lý nhân sự (`/app/hr/employees`).

**Là một** Admin / HR,
**Tôi muốn** tạo mới nhân sự bằng cách chọn hồ sơ cá nhân có sẵn, gán cơ sở, phân bổ đơn vị tổ chức cùng phạm vi dữ liệu,
**Để** hệ thống ghi nhận nhân sự mới với đầy đủ thông tin tổ chức, chức danh và loại hợp đồng.

---

### Mô tả chi tiết

Admin mở form tạo nhân sự từ nút **"+ Thêm mới"** trên toolbar màn hình danh sách. Modal hiển thị dạng 1 cột, chia thành 4 section.

| # | Thành phần | Loại control | Mô tả |
|---|-----------|-------------|-------|
| 1 | **Chọn hồ sơ cá nhân** | Searchable Multi-select (Tag input) | Tìm kiếm profile theo tên, SĐT, email, mã hồ sơ. Kết quả hiển thị avatar, tên, SĐT, mã. Chọn nhiều profile dạng tag chip có nút xóa. Có nút **"+ Tạo hồ sơ mới"** mở nested modal tạo profile. |
| 2 | **Cơ sở** | Searchable Multi-select (Tag input) | Chọn một hoặc nhiều chi nhánh. Có option **"Tất cả các cơ sở"** (chọn xong disable các option còn lại). Hiển thị dạng tag chip. |
| 3 | **Phân bổ đơn vị & phạm vi dữ liệu** | Multi-row (dynamic) | Mỗi dòng gồm 4 thành phần (xem bảng dưới). Có nút **"+ Thêm đơn vị"** để thêm dòng. Dòng đầu tiên tự động là **Chính**. |
| 4 | **Loại hợp đồng** | Radio button | Toàn thời gian (mặc định) hoặc Bán thời gian. |

**Chi tiết mỗi dòng Assignment (Section 3):**

| Cột | Loại control | Mô tả |
|-----|-------------|-------|
| **Chức danh** | Select dropdown | Danh sách chức danh sắp xếp A-Z. Cho phép để trống. |
| **Phòng ban / Đơn vị** | Searchable input + Tree dropdown | Hiển thị cây tổ chức phân cấp (Khối → Vùng → Cơ sở → Phòng ban → Tổ). Đơn vị đã gán ở dòng khác bị disable. Có nút expand/collapse nhánh con. |
| **Phạm vi dữ liệu** | Select dropdown | 5 options: Cá nhân, Team, Phạm vi, Cấp dưới, Toàn hệ thống. Mặc định: Phạm vi. |
| **Hành động** | Badge + Button | Hiển thị badge "Chính" hoặc nút "Đặt chính". Nút xóa dòng (×). |

**Footer:** Nút "Hủy" và "Hoàn tất thêm mới" (disabled khi chưa chọn profile).

---

### Corner Cases

| # | Tình huống | Cách xử lý |
|---|-----------|------------|
| C-01 | Chưa chọn hồ sơ cá nhân | Nút "Hoàn tất thêm mới" bị disabled. |
| C-02 | Profile đã là nhân sự trong hệ thống | Bỏ qua profile trùng, hiển thị cảnh báo "đã tồn tại", chỉ tạo các profile chưa có. |
| C-03 | Không thêm dòng assignment nào | Cho phép tạo nhân sự không có phân bổ (assignment rỗng). |
| C-04 | Xóa dòng assignment đang là "Chính" | Tự động chuyển dòng đầu tiên còn lại thành "Chính". |
| C-05 | Chọn "Tất cả các cơ sở" rồi muốn đổi | Xóa tag "Tất cả" mới chọn được từng cơ sở cụ thể. |
| C-06 | Tạo profile mới từ nested modal | Sau khi tạo xong, profile mới tự động thêm vào danh sách và có thể chọn ngay. |
| C-07 | API backend tạo link chức danh bị lỗi | Lưu nhân sự local với trạng thái cảnh báo, cho phép retry. |

---

### Acceptance Criteria

- [ ] **AC-01** Modal hiển thị đúng 4 section. Mở từ nút "Thêm mới" trên toolbar.
- [ ] **AC-02** Tìm kiếm profile với debounce 400ms. Kết quả hiển thị avatar, tên, SĐT, mã hồ sơ.
- [ ] **AC-03** Chọn nhiều profile dạng tag chip. Mỗi tag có nút xóa (×).
- [ ] **AC-04** Nút "+ Tạo hồ sơ mới" mở nested ProfileCreateModal. Profile tạo xong emit về modal cha.
- [ ] **AC-05** Multi-select cơ sở: chọn "Tất cả" disable chọn đơn lẻ; xóa tag "Tất cả" enable lại.
- [ ] **AC-06** Phân bổ đơn vị: thêm/xóa dòng, chọn chức danh + đơn vị (tree) + phạm vi dữ liệu. Đơn vị đã chọn ở dòng khác bị disable trong dropdown.
- [ ] **AC-07** Đặt dòng chính: dòng đầu mặc định là "Chính". Bấm "Đặt chính" trên dòng khác chuyển badge.
- [ ] **AC-08** Nút "Hoàn tất" disabled khi `selectedProfiles.length === 0`.
- [ ] **AC-09** Khi tạo thành công: modal đóng, form clear, bảng danh sách tự động thêm record mới, drawer mở cho nhân sự vừa tạo.
- [ ] **AC-10** Nếu có backend: gọi API `createEmployeeJobTitleLinks()` đồng bộ. Nếu lỗi, hiển thị thông báo cảnh báo nhưng vẫn lưu local.
