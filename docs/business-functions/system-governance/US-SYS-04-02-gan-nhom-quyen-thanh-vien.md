---
id: US-SYS-04-02
title: Thiết lập thành viên và gán nhóm quyền
domain: IAM/AuthZ
status: core
tags: [iam, authz, member, assign]
bf: BF-SYS-04
---

# US-SYS-04-02 - Thiết lập thành viên và gán nhóm quyền

> **Tuân thủ Tiêu chuẩn:** 
> - `[POLICY-IAM-03]` Cấp quyền qua Role, không cấp trực tiếp cho User.
> - `[POLICY-MDM-03]` Gán quyền cho User Account, không gán vào Worker hay Person.

> **Phạm vi:** Nền tảng dữ liệu cho màn hình quản lý thành viên. Giai đoạn phát triển chỉ thiết lập thành viên và gán nhóm quyền trực tiếp trên hệ thống nền; không bao gồm giao diện.

**Là một** Admin / Vận hành hệ thống,  
**tôi muốn** tạo/cập nhật thành viên và gán nhóm quyền cho từng thành viên trực tiếp trên hệ thống nền,  
**để** mỗi tài khoản có role assignment rõ ràng và có thể đăng nhập với đúng quyền được cấp.

---

## 1. Business Value

- Tạo nguồn user/role assignment thật để kiểm thử login và phân quyền.
- Đảm bảo mỗi thành viên có tài khoản và nhóm quyền rõ ràng trước khi làm UI quản lý user.
- Giảm rủi ro user đăng nhập thành công nhưng không có quyền hoặc có sai quyền.
- Cho phép Dev/QA test các scenario admin, user thường, user bị khóa và user chưa được gán role.

---

## 2. Scope

| Hạng mục | Mô tả |
|---|---|
| Thành viên | Tạo/cập nhật user trong `users`. |
| Trạng thái tài khoản | Quản lý các trạng thái cần cho login: active, locked, deleted/soft-deleted nếu hệ thống nền hỗ trợ. |
| Gán nhóm quyền | Tạo/cập nhật mapping trong `user_roles` giữa `user_id` và `role_id`. |
| Liên kết profile | Nếu cần, duy trì liên kết `user_profiles` để hiển thị thông tin cá nhân của thành viên. |
| Kiểm tra dữ liệu | Đảm bảo role được gán là role active và tồn tại trong `roles`. |

---

## 3. Out of Scope

- Không làm UI cho `/app/users`.
- Không làm bảng trượt chi tiết, biểu mẫu tạo user, đặt lại mật khẩu, khóa/mở khóa trên giao diện.
- Không tạo/sửa nhóm quyền trong story này; nhóm quyền thuộc `US-SYS-04-01`.
- Không xử lý luồng mới người dùng tự đăng ký tài khoản.
- Không thay đổi màn hình login, chỉ chuẩn bị data contract để login lấy đúng quyền.

---

## 4. Preconditions

- Đã hoàn thành `US-SYS-04-01` hoặc đã có topic/role/permission đang hoạt động trong hệ thống.
- Hệ thống nền có các bảng dữ liệu: thành viên, nhóm quyền, gán quyền thành viên.
- Nếu cần hiển thị thông tin cá nhân, hệ thống có bảng hồ sơ và liên kết hồ sơ-thành viên.
- Dev có danh sách thành viên cần seed/cập nhật cho giai đoạn Dev.
- Mỗi user có một định danh đăng nhập duy nhất, ví dụ username hoặc email đăng nhập theo quy ước xác thực.

---

## 5. Business Definitions

| Thuật ngữ | Định nghĩa |
|---|---|
| Thành viên / User | Tài khoản có thể đăng nhập vào hệ thống, lưu tại `users`. |
| Role assignment | Bản ghi `user_roles` gán một user với một role. |
| Active user | User được phép đăng nhập, không bị khóa và không soft-delete. |
| Locked user | User không được đăng nhập, dù thông tin xác thực đúng. |
| Primary role | Role mặc định của user nếu user có nhiều role; nếu hệ thống chưa có cơ chế primary thì dùng role đầu tiên theo thứ tự đọc dữ liệu. |

---

## 6. Main Flow

1. Dev xác định danh sách thành viên cần seed/cập nhật.
2. Dev tạo/cập nhật record trong `users` với thông tin đăng nhập và trạng thái tài khoản.
3. Dev tạo/cập nhật role assignment trong `user_roles`.
4. Hệ thống đọc lại user catalog và role assignment từ hệ thống nền.
5. Mỗi user trong catalog có danh sách role assignment tương ứng với `roles` active.
6. Login story sử dụng các assignment này để tính effective permission.

---

## 7. Suggested Initial Dataset

| User mẫu | Mục đích | Role cần gán |
|---|---|---|
| `admin_dev` | Test toàn quyền quản trị user/permission. | Quản trị hệ thống |
| `sale_dev` | Test user nghiệp vụ có quyền giới hạn. | Sale Staff |
| `academic_dev` | Test user học thuật có quyền giới hạn. | Academic Staff |
| `locked_dev` | Test tài khoản bị khóa không đăng nhập được. | Bất kỳ role active, status locked |
| `no_role_dev` | Test user active nhưng chưa được gán role. | Không gán role |

---

## 8. Corner Cases

| # | Tình huống | Cách xử lý mong đợi |
|---|---|---|
| C-01 | User active nhưng không có role trong `user_roles` | Login thành công hay thất bại phụ thuộc contract auth, nhưng effective permission phải rỗng và không được mở menu quản trị. |
| C-02 | User được gán role đã soft-delete | Hệ thống bỏ qua role đó khi tính permission. |
| C-03 | User có nhiều role active | Effective permission là hợp nhất các quyền của các role active, không nhân đôi role trùng. |
| C-04 | `user_roles` có bản ghi trùng `user_id + role_id` active | Chỉ tính một assignment; Dev cần cleanup dữ liệu trùng. |
| C-05 | User bị `locked` | Không cho đăng nhập hoặc session bị coi là logged out. |
| C-06 | User bị soft-delete | Không hiển thị trong user catalog active và không được tính role assignment. |
| C-07 | Role assignment trỏ đến user không tồn tại | Bỏ qua mapping lỗi và đưa vào danh sách data issue. |
| C-08 | Role assignment trỏ đến role không tồn tại | Bỏ qua mapping lỗi và đưa vào danh sách data issue. |

---

## 9. Acceptance Criteria

- [ ] **AC-01** Mỗi user Dev seed có `username` hoặc định danh đăng nhập duy nhất.
- [ ] **AC-02** User active có `deleted_at IS NULL` và trạng thái không phải locked.
- [ ] **AC-03** User locked không được coi là session authenticated sau login.
- [ ] **AC-04** Mỗi `user_roles.user_id` phải trỏ đến một user active, trừ các test case có chủ đích.
- [ ] **AC-05** Mỗi `user_roles.role_id` phải trỏ đến một role active, trừ các test case có chủ đích.
- [ ] **AC-06** Hệ thống đọc user catalog từ hệ thống nền kèm role assignment đúng.
- [ ] **AC-07** Nếu user có nhiều role active, catalog trả về đủ các assignment và không làm mất role nào.
- [ ] **AC-08** Nếu user không có role, catalog vẫn có user nhưng permission assignment rỗng.
- [ ] **AC-09** Không có mapping `user_id + role_id` active bị trùng trong dữ liệu seed chính.
- [ ] **AC-10** Dữ liệu user/role assignment có thể dùng trực tiếp cho `US-SYS-05-01` để test login effective permission.

---

## 10. Dependencies

- `US-SYS-04-01` cung cấp topic, role và permission matrix.
- Dịch vụ xác thực đọc dữ liệu thành viên, nhóm quyền, gán quyền và hồ sơ.
- Dịch vụ chuẩn hóa thành viên và gán quyền cho phiên đăng nhập.

---

## 11. Open Questions

- User có được có nhiều role trong giai đoạn Dev không, hay chỉ một role/user?
- Nếu user có nhiều role, có cần cột/flag primary role trong hệ thống không?
- Trạng thái locked dùng field nào chính thức trong `users`?
- User mới có được gán role mặc định tự động không?
- Có cần seed liên kết `profiles`/`user_profiles` cho tất cả user Dev không?
