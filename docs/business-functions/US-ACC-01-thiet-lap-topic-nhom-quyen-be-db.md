# US-ACC-01 - Thiết lập topic và nhóm quyền trên BE/DB

> **Phạm vi:** Nền tảng dữ liệu và UI tối thiểu cho menu `/app/permissions`. Giai đoạn Dev thiết lập topic, nhóm quyền, phạm vi role và ma trận quyền; UI chỉ bổ sung cột phạm vi và field phạm vi trong modal tạo/xem chi tiết nhóm quyền.

**Là một** Admin / Dev vận hành hệ thống,  
**tôi muốn** thiết lập danh sách topic, nhóm quyền, phạm vi role và các quyền theo module/action,  
**để** hệ thống có catalog phân quyền chính xác làm nguồn dữ liệu cho việc gán quyền và login.

---

## 1. Business Value

- Chuẩn hóa cấu trúc phân quyền trước khi mở thao tác quản trị trên FE.
- Đảm bảo mỗi nhóm quyền có topic rõ ràng, dễ truy vết và quản lý theo nghiệp vụ.
- Tạo nguồn dữ liệu tin cậy cho menu `/app/users` khi gán quyền cho thành viên.
- Giảm rủi ro login hiển thị sai menu/action do thiếu hoặc sai mapping quyền.

---

## 2. Scope

| Hạng mục | Mô tả |
|---|---|
| Topic quyền | Tạo/cập nhật seed dữ liệu trong `role_topics`. |
| Nhóm quyền | Tạo/cập nhật seed dữ liệu trong `roles`, mỗi role gắn với một `topic_id` hợp lệ. |
| Phạm vi role | Mỗi role phải chọn 1 phạm vi dữ liệu: Cá nhân, Team, Team & nhánh dưới hoặc Toàn hệ thống. |
| Ma trận quyền | Tạo/cập nhật `role_permissions` theo `role_id`, `model`, `action`. |
| UI danh sách | Bảng `/app/permissions` hiển thị thêm cột **Phạm vi** của role. |
| UI modal role | Modal tạo mới và modal chi tiết nhóm quyền hiển thị field chọn **Phạm vi**. |
| Module/action | Chỉ sử dụng các `model` và `action` được hệ thống hỗ trợ trong `modules` và permission catalog. |
| Soft delete | Nếu cần vô hiệu hóa topic/role/permission thì dùng `deleted_at`, không tạo dữ liệu trùng lặp. |

---

## 2.1. Thành phần giao diện

| Thành phần | Loại kiểm soát | Mô tả | Ghi chú |
|---|---|---|---|
| Thanh tìm kiếm | Text Input | Tìm nhóm quyền theo tên nhóm, mô tả hoặc topic. | Áp dụng trên danh sách nhóm quyền hiện có. |
| Bộ lọc topic | Select / Dropdown | Lọc danh sách nhóm quyền theo topic. | Chỉ hiển thị topic active. |
| Tạo nhóm quyền | Primary Button | Mở modal tạo mới nhóm quyền. | Chỉ bật khi user có quyền tạo/sửa permission. |
| Bảng nhóm quyền | Data Table | Hiển thị danh sách nhóm quyền, topic, phạm vi, số thành viên, số module bật và độ phủ quyền. | Bổ sung cột **Phạm vi** cho role. |
| Cột phạm vi | Table Column | Hiển thị scope của role: Cá nhân, Team, Team & nhánh dưới hoặc Toàn hệ thống. | Scope phải lấy từ dữ liệu role đã lưu. |
| Dòng nhóm quyền | Table Row | Cho phép mở chi tiết nhóm quyền để xem hoặc chỉnh sửa ma trận quyền. | Không làm thay đổi layout bảng ngoài các cột cần thiết. |
| Modal tạo nhóm quyền | Modal Dialog | Nhập tên nhóm quyền, mô tả, chọn topic, chọn phạm vi và cấu hình ma trận quyền. | Field **Phạm vi** mặc định là `personal`. |
| Modal chi tiết nhóm quyền | Modal Dialog | Xem thông tin nhóm quyền, topic, phạm vi và ma trận quyền đã lưu. | Khi vào edit mode có thể đổi phạm vi nếu có quyền. |
| Chọn topic | Select / Dropdown | Chọn topic active cho nhóm quyền. | Không cho lưu nếu thiếu topic hợp lệ. |
| Chọn phạm vi | Select / Dropdown | Chọn một trong bốn scope: `personal`, `team`, `descendants`, `global`. | Bắt buộc khi tạo hoặc cập nhật role. |
| Ma trận quyền | Permission Matrix | Bật/tắt action theo từng module trong catalog. | Chỉ hiển thị action module hỗ trợ. |
| Thông báo lỗi | Inline Alert / Toast | Báo lỗi khi topic, scope hoặc permission matrix không hợp lệ. | Nội dung tiếng Việt phải có dấu đầy đủ. |

---

## 3. Out of Scope

- Không làm mới toàn bộ UI cho `/app/permissions`; chỉ bổ sung field/cột phạm vi role vào màn hiện có.
- Không làm lại modal tạo/sửa/xóa topic.
- Không gán role cho user trong story này; việc gán quyền cho thành viên thuộc `US-ACC-02`.
- Không thay đổi thiết kế sidebar, router hoặc navigation FE.
- Không định nghĩa lại danh sách module/action ngoài catalog hiện có nếu chưa có yêu cầu riêng.

---

## 4. Preconditions

- Backend/DB có các bảng: `role_topics`, `roles`, `role_permissions`, `modules`.
- Bảng `modules` đã có danh sách module/action cần cấp quyền, bao gồm ít nhất `users` và `permissions`.
- Bảng `roles` có field lưu phạm vi role. Trong giai đoạn hiện tại dùng field `warehouse` để lưu scope code nếu chưa có field `data_scope` riêng.
- Dev có quyền migration/seed hoặc quyền ghi DB tương đương.
- Quy tắc action được thống nhất:
  - `read` tương ứng xem/truy cập.
  - `create` tương ứng tạo mới.
  - `update` tương ứng chỉnh sửa.
  - `delete` tương ứng xóa/vô hiệu hóa.
  - `download`, `upload`, `view_all`, `share` chỉ dùng khi module hỗ trợ.

---

## 5. Business Definitions

| Thuật ngữ | Định nghĩa |
|---|---|
| Topic | Nhóm phân loại nghiệp vụ của các role, lưu tại `role_topics`. Ví dụ: `Mặc định`, `Sale`, `Academic`, `System Admin`. |
| Nhóm quyền / Role | Tập hợp các quyền theo module/action, lưu tại `roles`. |
| Phạm vi role | Phạm vi dữ liệu mặc định của role khi user được gán role đó. |
| Permission row | Một dòng trong `role_permissions`, đại diện cho 1 role được phép thực hiện 1 action trên 1 model. |
| Model | Permission key/module key, ví dụ `users`, `permissions`, `booking_test`. |
| Active record | Record có `deleted_at IS NULL`. Chỉ active record được sử dụng khi tính quyền. |

**Bảng phạm vi của role:**

| Scope code | Tên hiển thị | Ý nghĩa |
|---|---|---|
| `personal` | Cá nhân | Chỉ áp dụng cho dữ liệu cá nhân của thành viên. |
| `team` | Team | Áp dụng cho team trực tiếp của thành viên. |
| `descendants` | Team & nhánh dưới | Áp dụng cho team hiện tại và toàn bộ nhánh dưới. |
| `global` | Toàn hệ thống | Áp dụng cho toàn bộ hệ thống. |

---

## 6. Main Flow

1. Dev xác định danh sách topic cần dùng cho giai đoạn Dev.
2. Dev tạo/cập nhật topic trong `role_topics`.
3. Dev tạo/cập nhật các nhóm quyền trong `roles`, mỗi nhóm quyền có `topic_id` trỏ đến topic active và một scope hợp lệ.
4. Dev tạo/cập nhật các dòng `role_permissions` cho từng nhóm quyền.
5. Hệ thống đọc lại permission catalog từ BE/DB và chỉ lấy dữ liệu active.
6. Bảng `/app/permissions` hiển thị đúng topic, phạm vi, thành viên, module bật và độ phủ của từng nhóm quyền.
7. Modal tạo mới nhóm quyền cho phép chọn topic, phạm vi và ma trận quyền.
8. Modal chi tiết nhóm quyền hiển thị phạm vi đã lưu; khi vào edit mode có thể đổi phạm vi và lưu lại.
9. Catalog trả về được danh sách topic, nhóm quyền, scope, ma trận quyền và số lượng permission row hợp lệ.

---

## 7. Suggested Initial Dataset

| Topic | Role | Scope đề xuất | Mô tả | Quyền tối thiểu |
|---|---|---|---|---|
| System Admin | Quản trị hệ thống | `global` | Toàn quyền quản trị tài khoản và phân quyền. | `users: read/create/update/delete`, `permissions: read/create/update/delete` |
| Mặc định | Quyền mặc định | `personal` | Quyền nền cho tài khoản mới nếu chưa được phân quyền chuyên biệt. | Chỉ các module được Product xác nhận cho phép truy cập mặc định |
| Sale | Sale Staff | `team` hoặc `descendants` | Quyền nghiệp vụ bán hàng/tư vấn. | Các module Sale được scope riêng nếu có |
| Academic | Academic Staff | `team` hoặc `descendants` | Quyền nghiệp vụ học thuật. | Các module Academic được scope riêng nếu có |

---

## 8. Corner Cases

| # | Tình huống | Cách xử lý mong đợi |
|---|---|---|
| C-01 | Tạo role với `topic_id` không tồn tại hoặc đã soft-delete | Không chấp nhận seed/migration; báo lỗi dữ liệu. |
| C-02 | Tạo permission với `model` không tồn tại trong catalog/module | Không đưa permission đó vào effective catalog; ghi nhận để Dev sửa mapping. |
| C-03 | Tạo permission với `action` module không hỗ trợ | Không sử dụng permission đó khi tính quyền. |
| C-04 | Role bị trùng tên trong cùng topic | Không tạo bản ghi trùng; cập nhật role hiện có hoặc đổi tên rõ ràng. |
| C-05 | Role có permission rows nhưng role đã soft-delete | Hệ thống bỏ qua role và toàn bộ permission liên quan khi đọc catalog. |
| C-06 | Topic không có role | Cho phép tồn tại topic rỗng trong Dev, nhưng không ảnh hưởng login/effective permission. |
| C-07 | Role không có permission row | Role vẫn tồn tại nhưng không cấp quyền truy cập module/action nào. |
| C-08 | Role chưa có scope hoặc scope rỗng | Hệ thống mặc định về `personal` và hiển thị "Cá nhân". |
| C-09 | Role có scope ngoài danh sách hợp lệ | Không sử dụng raw value; normalize về `personal` và ghi nhận data issue nếu cần. |

---

## 9. Acceptance Criteria

- [ ] **AC-01** `role_topics` có đủ các topic Dev cần dùng và mỗi topic active có `deleted_at IS NULL`.
- [ ] **AC-02** Mỗi record trong `roles` phải có `name` rõ ràng và `topic_id` trỏ đến một topic active.
- [ ] **AC-03** Mỗi record trong `roles` phải có scope hợp lệ thuộc `personal`, `team`, `descendants`, `global`.
- [ ] **AC-04** Bảng `/app/permissions` hiển thị cột **Phạm vi** cho từng nhóm quyền.
- [ ] **AC-05** Modal tạo mới nhóm quyền hiển thị field **Phạm vi** và mặc định là `personal`.
- [ ] **AC-06** Modal chi tiết nhóm quyền hiển thị đúng phạm vi đã lưu; khi edit và lưu thì scope được cập nhật vào BE/DB.
- [ ] **AC-07** Mỗi record trong `role_permissions` phải có `role_id`, `model`, `action` hợp lệ.
- [ ] **AC-08** Permission catalog chỉ đọc topic, role và permission có `deleted_at IS NULL`.
- [ ] **AC-09** Nhóm quyền quản trị hệ thống có tối thiểu quyền `read/create/update/delete` cho `users` và `permissions`.
- [ ] **AC-10** Không có permission row trùng lặp theo bộ `role_id + model + action` trong tập active.
- [ ] **AC-11** Khi cập nhật lại seed/migration, dữ liệu không bị nhân đôi topic, role hoặc permission.
- [ ] **AC-12** Permission catalog trả về được topic name, role name, scope và permission matrix đúng với dữ liệu BE/DB.
- [ ] **AC-13** Nếu có record sai mapping module/action/scope, Dev có danh sách record lỗi để sửa trước khi handoff.

---

## 10. Dependencies

- `src/services/authService.js` đọc permission catalog từ `/role_topics`, `/roles`, `/role_permissions`, `/modules`.
- `src/services/permissionData.js` định nghĩa mapping action và permission item.
- `src/views/system-admin/PermissionsScreenView.vue` hiển thị bảng nhóm quyền, bao gồm cột phạm vi.
- `src/views/system-admin/components/PermissionGroupEditorModal.vue` hiển thị modal tạo mới/chi tiết nhóm quyền, bao gồm field phạm vi.
- `docs/PERMISSION_GROUPS_TEST_PLAN.md` là tài liệu đối chiếu test permission catalog.

---

## 11. Open Questions

- Danh sách topic chính thức cho Dev seed gồm những topic nào?
- Role `Quyền mặc định` có được gán tự động cho user mới hay không?
- Có cần `is_default` cho role nào trong giai đoạn Dev không?
- Có cần đổi field lưu scope từ `roles.warehouse` sang `roles.data_scope` trong migration chính thức không?
- Có cần ràng buộc DB unique cho `role_id + model + action` không?
- Các module mock/demo có cần bị chặn theo permission catalog ngay trong giai đoạn này không?
