---
id: ENTERPRISE_STANDARDS
title: Enterprise Standards & Policies
domain: Architecture
status: core
tags: [architecture, policy, mdm, iam, rules]
---

# Đạo luật Nền tảng (Enterprise Standards & Policies)

Tài liệu này đóng vai trò "Hiến pháp" của hệ thống Rinov5 EdTech ERP. Nó định nghĩa các tiêu chuẩn kiến trúc cốt lõi, bắt buộc mọi module, tài liệu CAP, BF và mã nguồn phải tuân thủ tuyệt đối.

---

## CHƯƠNG 1: QUẢN TRỊ DỮ LIỆU GỐC (MDM & ENTITY GOVERNANCE)

### `[POLICY-MDM-01]` Nguyên tắc Bản ghi Vàng (The Golden Record)
Mọi thực thể là con người (Học viên, Phụ huynh, Giáo viên, Nhân viên) chỉ được phép tồn tại dưới **một bản ghi duy nhất** (Person Entity) trên toàn bộ hệ sinh thái RinoEdu. Mọi hoạt động nghiệp vụ ở các phân hệ khác nhau đều phải trỏ về `person_id` này. Nghiêm cấm nhân bản dữ liệu định danh (PII).

### `[POLICY-MDM-02]` Phân ly Bản dạng và Liên hệ (Identity vs Communication Split)
Dữ liệu cá nhân phải được chia thành 2 thực thể độc lập:
- **Identity (Bản dạng):** Chứa thông tin tĩnh/ít thay đổi (Họ tên, Ngày sinh, CCCD, Giới tính). Quan hệ 1-1.
- **Contact (Liên hệ):** Chứa thông tin giao tiếp (SĐT, Email, Địa chỉ). Quan hệ 1-N. Một Person có thể có nhiều Contact, phục vụ cho việc liên lạc đa phương thức và lưu lịch sử thay đổi thông tin.

### `[POLICY-MDM-03]` Tách biệt 3 tầng Thực thể (The 3-Tier Entity Separation)
Một con người tham gia hệ thống được quản lý qua 3 lớp tách biệt, vòng đời độc lập:
1. **Person (Bản dạng gốc):** Quản lý bởi MDM. Lưu thông tin PII.
2. **Worker (Hồ sơ công tác):** Quản lý bởi HR. Lưu chức danh, phòng ban, lương. (Chỉ áp dụng nếu Person là nhân sự).
3. **User (Tài khoản truy cập):** Quản lý bởi SYS. Lưu thông tin đăng nhập và phân quyền.

### `[POLICY-MDM-04]` Mô hình Dữ liệu Bảng (Party Data Model)
Theo chuẩn kiến trúc giáo dục (Education Data Architecture), MDM phải tách biệt 2 luồng thực thể để giải quyết bài toán B2C và B2B:
- **Person (Cá nhân):** Định danh con người độc lập.
- **Account/Group (Tổ chức/Nhóm):** Tập hợp các Person có chung lợi ích hoặc tài chính. Bao gồm **Household Account** (Hộ gia đình - dùng để gộp Bill, quản lý quan hệ Sibling/Parent) và **Business Account** (Đối tác B2B, Trường liên kết). Khái niệm Account không chứa thông tin định danh (PII) mà chỉ đóng vai trò container chứa các Person.

---

## CHƯƠNG 2: QUẢN TRỊ DANH TÍNH & TRUY CẬP (IAM)

### `[POLICY-IAM-01]` Phân ly Dịch vụ IAM (Decoupled IAM / Segregation of Duties)
Kiến trúc an ninh (Security) không được gộp thành một cục nguyên khối, mà phải tuân thủ Segregation of Duties (SoD), tách thành 3 dịch vụ:
1. **Identity Lifecycle (ILM):** Quản lý vòng đời User Account (Joiner-Mover-Leaver).
2. **Entitlement & Authorization (AuthZ):** Định nghĩa Role, Ma trận quyền, Data Scope.
3. **Authentication (IdP/AuthN):** Xử lý quy trình Đăng nhập, SSO, Session.

### `[POLICY-IAM-02]` Mặc định Cấm (Default Deny)
Tất cả người dùng (User Account) khi mới khởi tạo mặc định **KHÔNG CÓ BẤT KỲ QUYỀN GÌ**. Quyền chỉ phát sinh khi người dùng được gán một hoặc nhiều Role đang ở trạng thái kích hoạt (Active).

### `[POLICY-IAM-03]` Kết hợp RBAC và ABAC (Role-Based + Attribute-Based Access Control)
Hệ thống phân quyền sử dụng mô hình lai:
- **RBAC:** Xác định "Hành động" (Action) được phép làm (View, Create, Edit, Delete) thông qua Permission Matrix.
- **ABAC (Data Scope):** Xác định "Phạm vi dữ liệu" (Data boundary) được phép tác động (Cá nhân, Team, Chi nhánh, Toàn quyền), dựa trên ngữ cảnh công tác từ HR.

### `[POLICY-IAM-04]` Chính sách Chia sẻ Bản ghi (Record Sharing Grants / ACL)
Cơ chế chia sẻ ngoại lệ: Khi một bản ghi nằm ngoài Data Scope của một người dùng, họ chỉ có thể truy cập nếu được cấp quyền thông qua Access Control List (ACL) dưới hình thức Record Share (VD: Giáo viên A share học viên cho Giáo viên B).

---

## CHƯƠNG 3: BỐI CẢNH DỮ LIỆU & TỔ CHỨC (DATA & ORG CONTEXT)

### `[POLICY-ORG-01]` Bộ lọc Dữ liệu theo Ngữ cảnh (Contextual Data Filtering)
Mọi API trả về danh sách dữ liệu (GET list) bắt buộc phải đi qua một Middleware/Service để lọc theo **Data Scope của người dùng**. Quá trình này hoàn toàn trong suốt với Frontend. Nếu Frontend yêu cầu ID nằm ngoài Scope, Backend phải trả về `403 Forbidden` thay vì `404 Not Found`.

---

## CHƯƠNG 4: HỆ THỐNG THIẾT KẾ (DESIGN SYSTEM GOVERNANCE)

### `[POLICY-DS-01]` Tiêu chuẩn Hệ thống Thiết kế (Design System Standard)
Mọi giao diện trong RinoEdu phải tuân thủ `docs/DESIGN_SYSTEM.md`. Tài liệu này được biên soạn theo tiêu chuẩn ngành (`docs/DESIGN_SYSTEM_STANDARD.md`) tham chiếu Material Design 3, Carbon DS (IBM), Ant Design, WCAG 2.1 AA, và Nielsen's 10 Heuristics.

### `[POLICY-DS-02]` Quản trị Trạng thái Thị giác (Visual Status Governance)
Mọi trạng thái entity (Active, Inactive, Locked, Pending...) PHẢI được đăng ký trong `src/lib/statusColors.ts`. Nghiêm cấm hardcode màu status trong screen component. Khi một BF hoặc US định nghĩa trạng thái mới, trạng thái đó PHẢI được bổ sung vào `statusColors.ts` trước khi code UI.

### `[POLICY-DS-03]` Đồng bộ Tài liệu Nghiệp vụ và Thiết kế (Documentation-Design Alignment)
Khi biên soạn hoặc cập nhật tài liệu nghiệp vụ (CAP, BF, US, FLOW), AI Agent và Developer PHẢI kiểm tra tính đồng bộ với Design System:
1. **Entity statuses** được đề cập trong US/FLOW → phải tồn tại trong `statusColors.ts` mapping (§3.2).
2. **Màn hình mới** được mô tả trong US → phải tuân thủ Layout Pattern phù hợp: List Page (§4.2), Detail Page (§4.3), hoặc Form (§4.4).
3. **Hành động phá hủy** (Xóa, Khóa, Hủy) trong US/FLOW → phải ghi rõ yêu cầu Confirm Dialog (`[DS-P4]`).
4. **Tìm kiếm/Lọc** trong US → phải tuân thủ Search + Filter pattern (§6.4, §4.2).

### `[POLICY-DS-04]` Tách biệt Quy chuẩn Thiết kế và Quy tắc Nghiệp vụ (Design vs Business Separation)
- **Design System** (`DESIGN_SYSTEM.md`): Chỉ chứa quy chuẩn thị giác — token, layout, component, interaction. KHÔNG chứa business logic.
- **Business Functions** (`BF/US/FLOW`): Chứa quy tắc nghiệp vụ — workflow, validation, quyền hạn. KHÔNG chứa style/class.
- Khi US mô tả giao diện, chỉ tham chiếu pattern (VD: "Hiển thị theo List Page Pattern §4.2"), KHÔNG chỉ định CSS class cụ thể.

### `[POLICY-DS-05]` Ngôn ngữ Tự nhiên trong Tài liệu Nghiệp vụ (Natural Language in Business Docs)
Tài liệu nghiệp vụ (CAP, BF, US, FLOW) PHẢI sử dụng **100% ngôn ngữ tự nhiên hoặc thuật ngữ nghiệp vụ**. Nghiêm cấm:
1. **CSS / Style specs:** `border-radius`, `opacity`, `min-width`, `shadow-lg`, `px`, `rem`, `flex-direction`. → Dùng: "Bo tròn nhẹ", "Mờ đi", "Có bóng đổ".
2. **Code references:** `src/mocks/X.ts`, `src/services/Y.js`, tên biến (`familyMembers.length`), hàm, event. → XÓA hoàn toàn.
3. **Dev jargon:** `API`, `Backend`, `Frontend`, `middleware`, `token`, `cookie`, `session`, `DOM`, `JSON`, `REST`. → Dùng: "Hệ thống", "Giao diện", "Phiên làm việc", "Thông tin phiên".
4. **Component tech names:** `Div`, `Checkbox grid`, `Floating panel`. → Dùng: "Ô chọn", "Bảng nổi", "Hộp thoại".
5. **Color names Tailwind:** `nền indigo`, `màu emerald`. → Dùng: "Màu nhấn", "Màu tích cực". Tham chiếu `statusColors.ts` nếu cần ghi rõ.
