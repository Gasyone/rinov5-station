# US-ACC-03 - Login nạp đúng quyền, topic và phạm vi đã được gán

> **Phạm vi:** Màn `/login` và runtime permission sau khi đăng nhập. User đăng nhập bằng email/username và mật khẩu; hệ thống xác thực, nạp đúng user, topic, nhóm quyền, scope và permission đã được gán để điều hướng và hiển thị menu/action phù hợp.

**Là một** thành viên hệ thống,  
**tôi muốn** đăng nhập vào RinoEdu bằng tài khoản nội bộ của mình,  
**để** tôi chỉ nhìn thấy và thao tác được các menu/action đúng với nhóm quyền, topic và phạm vi dữ liệu đã được cấp.

---

## 1. Business Value

- Đảm bảo phân quyền có hiệu lực ngay khi user đăng nhập.
- Ngăn user truy cập menu/action không nằm trong quyền được gán.
- Đảm bảo topic, nhóm quyền và scope đã thiết lập được dùng làm nguồn xác định quyền runtime.
- Tạo nền tảng kiểm thử các nhóm quyền ở `/app/permissions` và user assignment ở `/app/users`.

---

## 2. Scope

| Hạng mục | Mô tả |
|---|---|
| Màn login | Sử dụng màn `/login` hiện có với logo RinoEdu, field email/username, field mật khẩu và nút đăng nhập. |
| Chọn ngôn ngữ | Cho phép user chọn ngôn ngữ hiển thị trên màn login: Tiếng Việt, English, 中文. |
| Xác thực | Gửi email/username và mật khẩu vào luồng auth hiện có. |
| Trạng thái login | Xử lý loading, lỗi đăng nhập, backend chưa cấu hình, tài khoản bị khóa và yêu cầu đổi mật khẩu nếu có. |
| Nạp user | Match đúng user active theo `user_id`, username hoặc email trả về từ auth. |
| Nạp assignment | Lấy các nhóm quyền active đã gán cho user. |
| Nạp topic và scope | Lấy topic của role và scope của role: `personal`, `team`, `descendants`, `global`. |
| Nạp permission | Lấy permission matrix của các role active được gán. |
| Runtime permission | Tính effective permission để hiển thị sidebar, menu và action. |
| Điều hướng | Sau login thành công, đưa user tới menu đầu tiên được phép truy cập. |

---

## 2.1. Thành phần giao diện

| Thành phần | Loại kiểm soát | Mô tả | Ghi chú |
|---|---|---|---|
| Logo RinoEdu | Image | Hiển thị logo ở đầu card login. | Dùng logo hiện có của hệ thống. |
| Chọn ngôn ngữ | Dropdown / Select Menu | Hiển thị ngôn ngữ hiện tại bằng cờ và cho phép chọn Tiếng Việt, English, 中文. | Khi đổi ngôn ngữ, toàn bộ copy trên màn login phải đổi theo locale đã chọn. |
| Tiêu đề màn login | Text Heading | Hiển thị tiêu đề đăng nhập theo ngôn ngữ hiện tại. | Ví dụ tiếng Việt: **Đăng nhập RinoEdu**. |
| Mô tả ngắn | Supporting Text | Mô tả mục đích đăng nhập theo ngôn ngữ hiện tại. | Ví dụ tiếng Việt: **Sử dụng tài khoản nội bộ để truy cập hệ thống.** |
| Email hoặc username | Text Input | User nhập email hoặc username để đăng nhập. | Có icon email, hỗ trợ autocomplete username. |
| Mật khẩu | Password Input | User nhập mật khẩu đăng nhập. | Có icon khóa, mặc định che mật khẩu. |
| Hiện/ẩn mật khẩu | Icon Button | Cho phép đổi trạng thái hiển thị mật khẩu. | Có aria-label theo ngôn ngữ hiện tại. |
| Đăng nhập | Primary Button | Gửi thông tin đăng nhập vào luồng auth hiện có. | Khi submit thì chuyển loading/disabled. |
| Thông báo lỗi | Inline Alert | Hiển thị lỗi đăng nhập, backend chưa cấu hình hoặc tài khoản bị khóa. | Nội dung lỗi phải theo locale hiện tại. |
| Reset password bắt buộc | Form State | Hiển thị form đổi mật khẩu nếu session yêu cầu cập nhật mật khẩu. | Không làm mới forgot password trong story này. |

---

## 3. Out of Scope

- Không thiết kế lại màn login.
- Không làm mới forgot password, MFA, SSO hoặc policy mật khẩu.
- Không tạo/sửa topic, role, permission hoặc user assignment trong story này.
- Không làm UI quản trị `/app/permissions` hoặc `/app/users`.
- Không cấp full access fallback khi catalog quyền lỗi hoặc chưa nạp được.

---

## 4. Preconditions

- `US-ACC-01` đã có topic, nhóm quyền, scope và permission matrix active.
- `US-ACC-02` đã có user và role assignment active.
- Màn `/login` hiện có cho phép nhập email/username và mật khẩu.
- Auth trả về được định danh user, ưu tiên `user_id`; nếu không có thì dùng username/email.
- Runtime có thể đọc được catalog quyền từ nguồn dữ liệu đang bật trong môi trường Dev.

---

## 5. Business Definitions

| Thuật ngữ | Định nghĩa |
|---|---|
| Identifier | Email hoặc username user nhập ở màn login. |
| Ngôn ngữ đăng nhập | Locale user chọn trên màn login để hiển thị nội dung theo Tiếng Việt, English hoặc 中文. |
| Active user | User được phép đăng nhập, không bị khóa và không bị xóa/inactive. |
| Role assignment | Bản ghi gán user với một nhóm quyền/role. |
| Topic | Nhóm phân loại nghiệp vụ của role, ví dụ System Admin, Sale, Academic. |
| Scope | Phạm vi dữ liệu của role: Cá nhân, Team, Team & nhánh dưới, Toàn hệ thống. |
| Effective permission | Tập quyền cuối cùng của user sau khi hợp nhất tất cả role active được gán. |
| Allowed menu | Menu user được phép truy cập theo effective permission. |
| Allowed action | Action user được phép thao tác trên một module, ví dụ create, update, delete, download, share, view_all. |

---

## 6. Main Flow

1. User mở màn `/login`.
2. User có thể chọn ngôn ngữ hiển thị trên màn login.
3. User nhập email/username và mật khẩu.
4. User bấm **Đăng nhập**.
5. Hệ thống xác thực thông tin đăng nhập.
6. Nếu xác thực thành công, hệ thống match đúng user active.
7. Hệ thống lấy các role assignment active của user.
8. Hệ thống lấy topic, scope và permission matrix của từng role active.
9. Hệ thống hợp nhất permission của các role để tạo effective permission.
10. Hệ thống xác định effective scope của user.
11. Hệ thống tạo session authenticated.
12. Hệ thống điều hướng user tới menu đầu tiên được phép truy cập.
13. Sidebar, menu và action trong workspace hiển thị theo effective permission.

---

## 7. Permission Resolution Rules

| Rule | Mô tả |
|---|---|
| R-01 | Chỉ tính user, role, topic và permission active. |
| R-02 | Assignment trỏ tới role không tồn tại hoặc không active thì bị bỏ qua. |
| R-03 | Permission trỏ tới module/action không hợp lệ thì không cấp quyền runtime. |
| R-04 | User có nhiều role thì effective permission là union của tất cả role active. |
| R-05 | User không có role active thì effective permission rỗng. |
| R-06 | Topic chỉ là metadata phân loại role; topic không tự cấp quyền. |
| R-07 | Role không có scope hợp lệ thì scope mặc định là `personal`. |
| R-08 | Nếu user có nhiều role, effective scope lấy phạm vi rộng nhất theo thứ tự `personal < team < descendants < global`. |

---

## 8. Corner Cases

| # | Tình huống | Cách xử lý mong đợi |
|---|---|---|
| C-01 | Email/username hoặc mật khẩu sai | Không tạo session; hiển thị lỗi đăng nhập. |
| C-01a | User đổi ngôn ngữ trước khi đăng nhập | Màn login đổi toàn bộ label, button, thông báo và aria-label theo ngôn ngữ đã chọn. |
| C-02 | Auth thành công nhưng không match được user active | Không tạo session; hiển thị lỗi cấu hình tài khoản. |
| C-03 | User bị khóa | Từ chối đăng nhập hoặc chuyển session về logged out. |
| C-04 | User active nhưng không có role active | Có thể đăng nhập, nhưng không được mở menu/action ngoài danh sách luôn hiển thị được Product xác nhận. |
| C-05 | Role active nhưng không có permission | Role không cấp quyền menu/action nào. |
| C-06 | Role có scope rỗng hoặc sai | Normalize về `personal`. |
| C-07 | Permission catalog load thất bại | Không fallback thành full access. |
| C-08 | User truy cập URL menu không có quyền | Điều hướng về menu đầu tiên user được phép truy cập. |
| C-09 | User bấm đăng nhập nhiều lần liên tục | Chỉ xử lý một request đang chạy; nút đăng nhập ở trạng thái loading/disabled. |
| C-10 | Permission thay đổi sau khi user đã login | Session hiện tại chỉ nhận quyền mới sau refresh/re-login hoặc cơ chế refresh catalog chủ động. |

---

## 9. Acceptance Criteria

- [ ] **AC-01** Màn `/login` hiển thị đủ logo RinoEdu, field email/username, field mật khẩu và nút **Đăng nhập**.
- [ ] **AC-02** Màn `/login` có control chọn ngôn ngữ và hỗ trợ tối thiểu Tiếng Việt, English, 中文.
- [ ] **AC-03** Khi user đổi ngôn ngữ, label, placeholder, button, thông báo lỗi và aria-label trên màn login đổi theo locale đã chọn.
- [ ] **AC-04** User có thể nhập email hoặc username làm identifier.
- [ ] **AC-05** User có thể hiện/ẩn mật khẩu bằng icon trong field mật khẩu.
- [ ] **AC-06** Khi submit, hệ thống hiển thị trạng thái loading và không gửi nhiều request song song.
- [ ] **AC-07** Nếu login thất bại, hệ thống hiển thị thông báo lỗi rõ ràng bằng ngôn ngữ hiện tại; locale `vi` phải có dấu đầy đủ.
- [ ] **AC-08** Sau login thành công, session user được match ưu tiên bằng `user_id`; nếu không có thì match bằng username/email.
- [ ] **AC-09** Hệ thống chỉ nạp role assignment active của user.
- [ ] **AC-10** Hệ thống chỉ nạp role, topic và permission active.
- [ ] **AC-11** Effective permission bằng union permission của tất cả role active được gán.
- [ ] **AC-12** Topic của role được gắn đúng vào metadata quyền runtime.
- [ ] **AC-13** Scope của role được gắn đúng vào assignment/runtime role.
- [ ] **AC-14** User không có `permissions:read` không được truy cập hợp lệ vào `/app/permissions`.
- [ ] **AC-15** User không có `users:read` không được truy cập hợp lệ vào `/app/users`.
- [ ] **AC-16** User có `users:read` nhưng không có `users:create/update/delete` thì các action tương ứng phải false.
- [ ] **AC-17** Sau login, user được điều hướng vào menu đầu tiên được phép truy cập.
- [ ] **AC-18** Khi permission catalog load lỗi, hệ thống không cấp full access fallback.
- [ ] **AC-19** Sau logout và login lại, hệ thống nạp lại permission mới nhất từ nguồn dữ liệu đang bật.
- [ ] **AC-20** Kết quả allowed menus/actions có thể verify bằng runtime function `canAccessMenu` và `canAccessAction`.

---

## 10. Dependencies

- `US-ACC-01` cung cấp topic, role, scope và permission matrix.
- `US-ACC-02` cung cấp user và role assignment.
- `src/views/auth/LoginView.vue` là màn login.
- `src/locales/*/auth.json` cung cấp copy đa ngôn ngữ cho màn login.
- `src/stores/appShell.js` quản lý login session, route resolve và runtime permission.
- `src/composables/useAccessControl.js` tính menu/action được phép.
- `src/stores/permissionCatalog.js` nạp permission catalog.
- `src/services/authService.js` và `src/services/userAuthDomain.js` đọc/normalize user và permission data.

---

## 11. Open Questions

- User không có role active được vào workspace rỗng hay bị chặn login?
- Danh sách menu luôn hiển thị khi user không có quyền là gì?
- Permission thay đổi có cần auto-refresh session hay chỉ áp dụng sau refresh/re-login?
- Có cần audit log mỗi lần login nạp effective permission không?
