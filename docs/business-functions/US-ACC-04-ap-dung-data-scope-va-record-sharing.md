# US-ACC-04 - Áp dụng data scope và record sharing khi tải dữ liệu module

> **Phạm vi:** Lớp kiểm soát dữ liệu sau login. Khi user truy cập một menu/module, hệ thống chỉ tải và hiển thị các record mà user được phép xem theo quyền module/action, phạm vi dữ liệu từ role và thông tin cơ sở/team lấy từ HR. Nếu record được chia sẻ cho user, hệ thống cho phép xem record đó theo đúng quyền chia sẻ.

**Là một** thành viên hệ thống,  
**tôi muốn** khi mở từng menu, hệ thống chỉ hiển thị dữ liệu thuộc cơ sở/team/phạm vi của tôi hoặc dữ liệu được chia sẻ cho tôi,  
**để** tôi làm việc đúng phạm vi được cấp mà không nhìn thấy dữ liệu ngoài quyền.

---

## 1. Business Value

- Đảm bảo phân quyền không chỉ dừng ở việc ẩn/hiện menu mà còn áp dụng vào dữ liệu thực tế.
- Ngăn user xem dữ liệu của cơ sở/team khác nếu không có scope phù hợp.
- Cho phép cộng tác qua cơ chế chia sẻ record mà không cần mở rộng role quá mức.
- Tách rõ nguồn HR dùng để xác định cơ sở/team với lớp authorization dùng để quyết định record nào được xem.

---

## 2. Scope

| Hạng mục | Mô tả |
|---|---|
| Nguồn cơ sở/team | Đọc cơ sở, team/phòng ban hoặc đơn vị tổ chức của user từ `hr_employees` hoặc mapping nhân sự tương đương. |
| Role data scope | Áp dụng scope của role đã nạp sau login: `personal`, `team`, `descendants`, `global`. |
| Module/action permission | Kiểm tra user có quyền truy cập module/action trước khi trả dữ liệu hoặc cho thao tác. |
| Record scope filter | Lọc record theo owner, team/phòng ban, cơ sở hoặc nhánh dưới tùy scope. |
| Record sharing | Cho phép user xem/thao tác record được chia sẻ trực tiếp cho user, role hoặc team theo action được chia sẻ. |
| Load data từng menu | Mỗi menu khi tải dữ liệu phải đi qua rule data access chung hoặc API đã enforce cùng rule. |
| Audit/debug | Có thể xác định vì sao một record được hiển thị: do scope, do owner, do global hoặc do sharing. |

---

## 3. Out of Scope

- Không tạo/sửa màn HR hoặc nghiệp vụ quản lý `hr_employees`.
- Không tạo UI chia sẻ record nếu từng module chưa có yêu cầu riêng.
- Không định nghĩa lại topic, role hoặc permission matrix; phần đó thuộc `US-ACC-01`.
- Không gán role cho user; phần đó thuộc `US-ACC-02`.
- Không xử lý login; phần đó thuộc `US-ACC-03`.
- Không thay thế security ở BE/DB bằng filter FE. FE chỉ được xem là lớp hỗ trợ UX/mock, không phải lớp bảo mật chính.

---

## 4. Preconditions

- `US-ACC-01` đã có role, permission matrix và data scope hợp lệ.
- `US-ACC-02` đã có user và role assignment active.
- `US-ACC-03` đã nạp đúng effective permission và effective scope vào session.
- User có mapping nhân sự active trong `hr_employees` hoặc nguồn tương đương để xác định cơ sở/team.
- Record của từng module có metadata đủ để lọc, ví dụ `owner_user_id`, `branch_id`, `branch_name`, `team_id`, `org_unit_id` hoặc `department_id`.
- Nếu hỗ trợ sharing, hệ thống có nguồn dữ liệu chia sẻ record, ví dụ `record_share_grants` hoặc bảng ACL tương đương.

---

## 5. Business Definitions

| Thuật ngữ | Định nghĩa |
|---|---|
| Data scope | Phạm vi dữ liệu user được xem theo role: cá nhân, team, team & nhánh dưới hoặc toàn hệ thống. |
| HR assignment | Thông tin user thuộc cơ sở/team/phòng ban nào, lấy từ `hr_employees` hoặc mapping nhân sự tương đương. |
| Scoped record | Record nằm trong phạm vi dữ liệu của user. |
| Shared record | Record không nằm trong scope mặc định nhưng được chia sẻ cho user/role/team qua ACL. |
| Record owner | User sở hữu hoặc tạo record, dùng cho scope `personal`. |
| Branch scope | Phạm vi theo cơ sở/chi nhánh của user. |
| Team scope | Phạm vi theo team/phòng ban trực tiếp của user. |
| Descendants scope | Phạm vi gồm team/cơ sở hiện tại và các nhánh con bên dưới. |
| ACL | Access Control List, danh sách quyền chia sẻ record cụ thể cho user/role/team. |

---

## 6. Main Flow

1. User đã login thành công và có session chứa effective permission, role scope và thông tin user.
2. User mở một menu/module trong workspace.
3. Hệ thống kiểm tra user có quyền `access/read` với module đó.
4. Hệ thống lấy HR assignment của user để xác định cơ sở/team/phòng ban hiện hành.
5. Hệ thống xác định data scope áp dụng cho module.
6. Hệ thống tải dữ liệu module qua data access layer hoặc API đã enforce authorization.
7. Hệ thống giữ lại record thỏa một trong các điều kiện hợp lệ:
   - record thuộc owner của user với scope `personal`;
   - record thuộc team/phòng ban của user với scope `team`;
   - record thuộc team/cơ sở hiện tại hoặc nhánh dưới với scope `descendants`;
   - record thuộc toàn hệ thống với scope `global`;
   - record được chia sẻ cho user/role/team với action phù hợp.
8. Hệ thống trả về hoặc hiển thị danh sách record hợp lệ.
9. Với từng action như sửa/xóa/tải xuống/chia sẻ, hệ thống kiểm tra lại action permission và sharing grant tương ứng.

---

## 7. Access Resolution Rules

| Rule | Mô tả |
|---|---|
| R-01 | User phải có quyền module/action phù hợp trước khi thao tác dữ liệu của module. |
| R-02 | Record nằm ngoài data scope mặc định vẫn có thể được xem nếu có sharing grant active cho user/role/team và action `read/access`. |
| R-03 | Sharing grant không tự động cấp toàn quyền module. Grant chỉ áp dụng cho record, resource và action được chia sẻ. |
| R-04 | Nếu user không có quyền mở module, record được chia sẻ không được làm user có toàn quyền vào module, trừ khi Product định nghĩa một luồng “shared with me” riêng. |
| R-05 | Scope `personal` chỉ cho xem record do user sở hữu/tạo/được giao trực tiếp, cộng với record được chia sẻ hợp lệ. |
| R-06 | Scope `team` cho xem record thuộc team/phòng ban trực tiếp của user, cộng với record được chia sẻ hợp lệ. |
| R-07 | Scope `descendants` cho xem record thuộc team/cơ sở hiện tại và nhánh dưới, cộng với record được chia sẻ hợp lệ. |
| R-08 | Scope `global` cho xem record toàn hệ thống trong module mà user có quyền. |
| R-09 | Nếu user có nhiều role, data scope lấy phạm vi rộng nhất; action permission là union các action của role active. |
| R-10 | Nếu thiếu HR assignment, hệ thống không được tự nâng scope; mặc định chỉ cho dữ liệu `personal` và shared record hợp lệ. |
| R-11 | Filter FE chỉ dùng để hỗ trợ trải nghiệm và mock data; BE/DB vẫn phải enforce cùng rule khi có API thật. |

---

## 8. Corner Cases

| # | Tình huống | Cách xử lý mong đợi |
|---|---|---|
| C-01 | User có quyền module nhưng không có HR assignment | Chỉ hiển thị dữ liệu cá nhân và shared record hợp lệ; không tự mở toàn cơ sở. |
| C-02 | User có scope `team` nhưng record thiếu team/phòng ban | Không hiển thị record đó trừ khi user là owner hoặc record được chia sẻ hợp lệ. |
| C-03 | User có scope `descendants` nhưng cây tổ chức thiếu nhánh con | Chỉ áp dụng được scope trên nhánh xác định được; ghi nhận data issue nếu cần. |
| C-04 | Record được chia sẻ nhưng sharing grant hết hạn hoặc inactive | Không hiển thị record theo sharing grant đó. |
| C-05 | Record được chia sẻ quyền xem nhưng user bấm sửa | Chỉ cho sửa nếu sharing grant hoặc role permission có action sửa hợp lệ. |
| C-06 | User không có `module:access` nhưng record được chia sẻ | Không mở toàn menu; chỉ xử lý nếu có luồng “shared with me” được Product xác nhận. |
| C-07 | User có nhiều role ở nhiều cơ sở | Hiển thị union dữ liệu theo các scope/cơ sở hợp lệ của từng role, không nhân đôi record. |
| C-08 | Record thuộc cơ sở A nhưng được share cho user ở cơ sở B | User ở cơ sở B được xem record đó nếu grant active và action phù hợp. |
| C-09 | FE filter và BE filter cho kết quả khác nhau | BE/DB là nguồn quyết định; FE phải đồng bộ lại hoặc hiển thị lỗi dữ liệu không hợp lệ. |
| C-10 | User đổi cơ sở trong HR sau khi đã login | Session chỉ nhận scope/cơ sở mới sau refresh/re-login hoặc cơ chế refresh catalog chủ động. |

---

## 9. Acceptance Criteria

- [ ] **AC-01** Khi user mở một menu, hệ thống kiểm tra quyền `access/read` của module trước khi tải hoặc hiển thị dữ liệu.
- [ ] **AC-02** Hệ thống xác định được cơ sở/team/phòng ban của user từ `hr_employees` hoặc mapping nhân sự tương đương.
- [ ] **AC-03** Với scope `personal`, user chỉ thấy record cá nhân và shared record hợp lệ.
- [ ] **AC-04** Với scope `team`, user thấy record thuộc team/phòng ban trực tiếp và shared record hợp lệ.
- [ ] **AC-05** Với scope `descendants`, user thấy record thuộc team/cơ sở hiện tại, nhánh dưới và shared record hợp lệ.
- [ ] **AC-06** Với scope `global`, user thấy record toàn hệ thống trong module được cấp quyền.
- [ ] **AC-07** Record nằm ngoài scope nhưng được chia sẻ active cho user/role/team được hiển thị theo đúng action được chia sẻ.
- [ ] **AC-08** Sharing grant chỉ cấp quyền trên record được chia sẻ, không tự cấp toàn quyền module.
- [ ] **AC-09** User không có action sửa/xóa/tải xuống không thực hiện được action đó dù record đang hiển thị.
- [ ] **AC-10** Record không có metadata cơ sở/team hợp lệ không được hiển thị theo scope team/descendants, trừ khi có owner/share hợp lệ.
- [ ] **AC-11** Khi user có nhiều role, danh sách record là union dữ liệu hợp lệ theo các role/scope active và không bị trùng.
- [ ] **AC-12** Khi HR assignment thiếu hoặc lỗi, hệ thống không tự fallback thành toàn hệ thống.
- [ ] **AC-13** Khi sharing grant hết hạn/inactive, record không còn hiển thị theo sharing.
- [ ] **AC-14** Data access rule có thể verify ở BE/API hoặc data-access layer bằng test case cho scope, cơ sở và sharing.
- [ ] **AC-15** FE không được hiển thị record ngoài kết quả đã được data-access layer/API cho phép.

---

## 10. Dependencies

- `US-ACC-01` cung cấp role, permission matrix và scope của role.
- `US-ACC-02` cung cấp user và role assignment.
- `US-ACC-03` nạp user, effective permission và effective scope sau login.
- `US-HR-01` và `US-HR-02` cung cấp hồ sơ nhân sự, cơ sở/team/phòng ban của user.
- Data model HR cần có mapping từ user/account sang `hr_employees`.
- Data model từng module cần có metadata owner/cơ sở/team để lọc.
- Data model sharing cần có bảng hoặc nguồn ACL cho record được chia sẻ.

---

## 11. Open Questions

- Record sharing sẽ áp dụng cho tất cả module hay chỉ một số module như Contacts, Calendar, Students, Orders?
- Có cần một menu riêng “Được chia sẻ với tôi” cho record được share nhưng user không có quyền mở menu gốc không?
- Sharing grant được cấp cho user, role, team hay cả ba?
- Sharing grant có cần ngày hết hạn, trạng thái active/inactive và audit log không?
- Scope `team & nhánh dưới` lấy cây tổ chức theo cơ sở, phòng ban hay cả hai?
- Khi user có nhiều HR assignment ở nhiều cơ sở, role scope áp dụng theo từng assignment hay union toàn bộ assignment?
