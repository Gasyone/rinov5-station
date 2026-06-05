---
id: US-MDM-01-01
title: Xem & Tìm kiếm danh sách Person
bf: BF-MDM-01
domain: CAP-MDM
status: core
tags: [mdm, person, list, search, filter, golden-record]
---

# US-MDM-01-01: Xem & Tìm kiếm danh sách Person (Person Directory)

> **Tuân thủ Tiêu chuẩn:**
> - `[POLICY-MDM-01]` Golden Record — Mỗi Person hiển thị là 1 bản ghi duy nhất.
> - `[POLICY-MDM-02]` Identity vs Contact Split — Tìm kiếm hoạt động xuyên qua cả Identity lẫn Contact.

> **Phạm vi:** Màn hình `/app/mdm_persons`. Đây là điểm tra cứu trung tâm cho toàn bộ dữ liệu con người trong hệ sinh thái RinoEdu — bất kể họ là Học viên, Phụ huynh, Giáo viên hay Nhân viên.

**Là một** Sale / CSM / HR Admin,
**tôi muốn** tìm kiếm nhanh bất kỳ cá nhân nào trong hệ thống theo nhiều tiêu chí (tên, SĐT, email, CCCD),
**để** tra cứu thông tin khách hàng/nhân sự phục vụ tư vấn, chăm sóc và vận hành.

---

## 1. Business Value

- Là điểm tra cứu DUY NHẤT cho toàn bộ dữ liệu con người — thay vì tìm ở nhiều nơi khác nhau.
- Sale tìm nhanh khách hàng bằng SĐT khi có cuộc gọi đến.
- HR Admin tìm Person trước khi onboard nhân sự mới (tránh tạo trùng).
- CSM tra cứu thông tin liên hệ phụ huynh trong quá trình chăm sóc.

---

## 2. Scope

| Hạng mục | Mô tả |
|---|---|
| Tìm kiếm đa chiều | Tìm xuyên qua bảng Person (Identity) và bảng Contact (SĐT, Email, CCCD). |
| Bộ lọc | Trạng thái (Active / Inactive / Merged), Chi nhánh gốc. |
| Bảng dữ liệu | Avatar, Họ tên, Ngày sinh, Giới tính, Primary SĐT, Primary Email, Trạng thái, Ngày tạo. |
| Actions | [Xem chi tiết], [Chỉnh sửa], [Merge] (chỉ Admin). |
| Phân trang | 20 record/trang, sắp xếp theo cột. |

### 2.1. Thành phần giao diện

| Thành phần | Loại | Mô tả | Ghi chú |
|---|---|---|---|
| Ô tìm kiếm | Text Input + Icon Search | Placeholder: "Tìm theo tên, SĐT, email, CCCD...". Debounce 300ms. | Search xuyên qua cả bảng Identity và Contact. |
| Nút [+ Tạo Person] | Primary Button | Mở form tạo Person mới (`US-MDM-01-02`). | Chỉ hiện nếu user có quyền `persons:create`. |
| Filter Trạng thái | Select Dropdown | Active / Inactive / Merged / Tất cả. | Mặc định: Active. |
| Filter Chi nhánh | Select Dropdown | Danh sách chi nhánh từ `BF-ORG-01`. | Chỉ hiện nếu user có scope >= `team`. |
| Bảng Person | Data Table | Các cột: Avatar, Họ tên, DOB, Giới tính, Primary SĐT, Primary Email, Trạng thái, Ngày tạo. | Sortable trên tất cả cột. |
| Badge trạng thái | Status Badge | Active (xanh), Inactive (xám), Merged (vàng, italic "Đã gộp"). | Person merged = read-only, không cho thao tác. |
| Row Actions | Icon Buttons | [👁 Xem], [✏ Sửa], [🔗 Merge] (chỉ Admin). | Merge chỉ hiện cho Admin. |
| Phân trang | Pagination | 20 record/trang, hiển thị tổng số record. | |
| Empty State | Illustration + Text | "Không tìm thấy kết quả phù hợp". | Hiện khi search/filter không có kết quả. |

---

## 3. Out of Scope

- Không hiển thị thông tin Worker (chức danh, phòng ban) — thuộc `CAP-HR`.
- Không hiển thị thông tin User Account (username, role) — thuộc `CAP-SYS`.
- Không thực hiện Merge trên màn này — Merge có form riêng (`US-MDM-01-04`).
- Không quản lý Household — thuộc `BF-MDM-02`.

---

## 4. Preconditions

- Hệ thống đã có ít nhất 1 Person trong mock data.
- User đang đăng nhập với Role có quyền `persons:read`.
- API Person search hỗ trợ tìm kiếm xuyên bảng Identity + Contact.

---

## 5. Business Definitions

| Thuật ngữ | Định nghĩa |
|---|---|
| Person | Golden Record — bản ghi duy nhất đại diện cho 1 con người thật trong hệ thống. |
| Primary SĐT | SĐT được đánh dấu Primary trong danh sách Contact — dùng làm SĐT liên lạc chính. |
| Merged Person | Person đã bị gộp vào Person khác. Record vẫn tồn tại nhưng ở trạng thái read-only. |
| Cross-table Search | Tìm kiếm xuyên qua 2 bảng: `persons` (Tên, CCCD) và `contacts` (SĐT, Email). |

---

## 6. Main Flow

1. User mở màn `/app/mdm_persons`.
2. Hệ thống load danh sách Person (mặc định filter: Active, sắp xếp: Ngày tạo mới nhất).
3. Bảng hiển thị 20 record đầu tiên.
4. User nhập từ khóa vào ô tìm kiếm (VD: "0912345678").
5. Sau 300ms debounce, hệ thống gửi query tìm kiếm xuyên bảng Identity + Contact.
6. Kết quả trả về hiển thị trong bảng, highlight phần text khớp.
7. User có thể lọc thêm theo Trạng thái hoặc Chi nhánh.
8. User bấm vào row → mở trang chi tiết Person.

---

## 7. Corner Cases

| # | Tình huống | Cách xử lý |
|---|---|---|
| C-01 | Tìm SĐT trả về nhiều Person (trùng SĐT) | Hiển thị tất cả kết quả. Badge "⚠ Nghi trùng" trên mỗi row. |
| C-02 | Person ở trạng thái Merged | Hiển thị row mờ, badge "Đã gộp". Không cho Edit/Delete, chỉ cho Xem. |
| C-03 | Không có kết quả | Empty state: "Không tìm thấy. Bạn có muốn tạo Person mới?" + link tạo. |
| C-04 | User không có quyền `persons:create` | Ẩn nút [+ Tạo Person]. |
| C-05 | Danh sách rỗng (hệ thống mới) | Empty state: "Chưa có dữ liệu Person. Bắt đầu bằng cách tạo Person đầu tiên." |
| C-06 | Từ khóa tìm kiếm quá ngắn (1 ký tự) | Không gửi request, hiện tooltip "Nhập ít nhất 2 ký tự". |

---

## 8. Acceptance Criteria

- [ ] **AC-01** Danh sách Person hiển thị với phân trang 20 record/trang.
- [ ] **AC-02** Tìm kiếm hoạt động xuyên qua bảng Person (Tên, CCCD) và Contact (SĐT, Email).
- [ ] **AC-03** Tìm kiếm có debounce 300ms.
- [ ] **AC-04** Kết quả tìm kiếm highlight phần text khớp.
- [ ] **AC-05** Lọc theo Trạng thái (Active/Inactive/Merged) hoạt động chính xác.
- [ ] **AC-06** Sắp xếp theo cột (Tên A-Z, Ngày tạo) hoạt động.
- [ ] **AC-07** Person Merged hiển thị mờ, badge "Đã gộp", không cho Edit/Delete.
- [ ] **AC-08** Nút [+ Tạo Person] chỉ hiện khi user có quyền `persons:create`.
- [ ] **AC-09** Empty state hiển thị đúng khi không có kết quả.
- [ ] **AC-10** Badge trạng thái đúng màu: Active=xanh, Inactive=xám, Merged=vàng.

---

## 9. Dependencies

- `BF-MDM-01`: Dịch vụ lấy danh sách Person + tìm kiếm.
- `BF-MDM-01`: Dịch vụ Contact (lấy SĐT chính, Email chính).
- `BF-ORG-01`: Dịch vụ danh sách chi nhánh (cho bộ lọc).
- Dữ liệu mẫu Person và Contact.
