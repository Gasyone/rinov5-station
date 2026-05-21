---
title: "BF-SYS-04: Phân quyền & Giới hạn dữ liệu (Entitlement & Authorization)"
type: "Business Function"
domain: "CAP-SYS"
status: "Standardized"
tags: [sys, authz, role, rbac, abac]
---

# BF-SYS-04: Phân quyền & Giới hạn dữ liệu (Entitlement & Authorization)

> **Capability:** CAP-SYS (Năng lực Quản trị Hệ thống)
> **Giai đoạn:** 1 - Thiết lập nền tảng
> **Nhóm chức năng:** Quản lý quyền
> **Mã màn hình:** `permissions`

---

## 1. Mô tả tổng quan

Quản lý Ủy quyền và Cấp phép (Authorization) — quyết định "Người dùng được phép làm gì và thấy dữ liệu nào trên hệ thống?". Phân hệ này được tách bạch hoàn toàn khỏi Quản lý Tài khoản (ILM - `BF-SYS-01`) để đảm bảo bảo mật. Nó chịu trách nhiệm định nghĩa các Nhóm quyền (Roles), Ma trận quyền (Permission Matrix), Giới hạn Vùng dữ liệu (Data Scope), và các chính sách Record Sharing (ACL).

## 2. Đối tượng sử dụng (Vai trò)

- **Quản trị Hệ thống (System Admin):** Quyền tối cao, tạo và sửa đổi các Nhóm quyền.
- **Cán bộ An ninh Thông tin (Security Officer):** Thiết lập chính sách bảo mật, giám sát Data Scope (nếu hệ thống có role này).

## 3. Ranh giới Nghiệp vụ (Scope)

### Có bao gồm (In Scope)
- **Topic & Role:** Tạo Topic phân loại (Nhóm Sales, Nhóm Academic), Tạo Nhóm quyền (Role).
- **Permission Matrix (RBAC):** Gán quyền hành động chi tiết (Create, Read, Update, Delete, Export) cho từng Phân hệ/Màn hình (Module).
- **Data Scope (ABAC):** Thiết lập cấp độ dữ liệu (Tầm nhìn) trên Role (`personal` - Của tôi, `team` - Nhóm của tôi, `descendants` - Chi nhánh của tôi, `global` - Toàn hệ thống).
- **Role Assignment:** Gán một hoặc nhiều Role cho Tài khoản (`Account`).

### Không bao gồm (Out of Scope)
- Tạo tài khoản định danh, Reset password → Thuộc `BF-SYS-01` (Quản lý Tài khoản).
- Xác thực đăng nhập (Login/SSO) → Thuộc `BF-SYS-05` (Authentication).
- Cấu hình sơ đồ cơ cấu tổ chức (Khối/Vùng/Chi nhánh) → Thuộc `CAP-HR` (`BF-ORG-02`).

## 4. Mô hình Dữ liệu Nghiệp vụ (Data Entities)

| Tên Thực thể | Trường định danh | Thuộc tính quan trọng | Ràng buộc quan hệ | Diễn giải |
|--------------|------------------|-----------------------|-------------------|----------|
| Nhóm quyền (Role) | Mã Role | Tên, Mô tả, Data Scope mặc định, Mã Topic | Trỏ về Mã Topic | Vai trò cụ thể (VD: Chuyên viên Tư vấn). |
| Ma trận quyền (Role Permission) | Mã Permission | Phân hệ (Module), Hành động (Action) | Trỏ về Mã Role | Cấu hình chi tiết (VD: Sinh viên - Đọc). |
| Gán quyền (User Role) | Mã Assignment | (Mapping table) | Trỏ về Mã Tài khoản & Mã Role | Một User có thể có nhiều Role. |

### 4.1. Vòng đời Trạng thái (Status Lifecycle)

*(Phân hệ này quản lý các thiết lập Cấu hình (Configuration/Matrix), nên không có vòng đời trạng thái chuyển đổi liên tục. Một Role thường chỉ có Trạng thái `Active` hoặc `Inactive`).*

### 4.2. Ví dụ Dữ liệu mẫu

*Giúp AI và Lập trình viên thiết kế luồng kiểm tra quyền.*

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
|------------|-----------------|-------------------|
| Tạo Nhóm quyền mới | Tên: "Sales Executive", Phân hệ: Đơn hàng (Cho phép Create, Read). Data Scope: Personal. | Lưu Role mới. Mặc định chưa gán cho ai. |
| Gán quyền | Gán Role "Sales Executive" cho Tài khoản `nguyenvana`. | User `nguyenvana` khi login sẽ thấy menu Đơn hàng, nhưng chỉ xem được các Đơn hàng do chính mình tạo (Personal). |

## 5. Quy tắc Nghiệp vụ Tổng thể (Business Rules)

1. **[RULE-AUTH-01] Nguyên tắc "Mặc định Từ chối" (Default Deny):** Tuân thủ `[POLICY-IAM-02]`, hệ thống luôn luôn ở trạng thái đóng cửa. Nếu hệ thống API không tìm thấy bản ghi Mapping rõ ràng giữa User và Permission yêu cầu, MẶC ĐỊNH CHẶN thao tác (Trả về lỗi 403 Forbidden).
2. **[RULE-AUTH-02] Cộng dồn Quyền hạn (Effective Permission Union):** Nếu một User được gán đồng thời nhiều Role (VD: Vừa là Sales, Vừa là Giáo viên), thì quyền hạn thực tế của người đó là "Phép Hợp" (Set Union) của tất cả các quyền từ các Role đó mang lại. Không có chuyện Role này ghi đè xóa quyền của Role kia.
3. **[RULE-AUTH-03] Bảo vệ Quyền Root (Hardcoded Admin):** Nhóm quyền mang mã `SYS_ADMIN` được hardcoded trong lõi hệ thống. Hệ thống TUYỆT ĐỐI CHẶN mọi hành động Sửa, Xóa, hoặc Thu hẹp quyền hạn đối với Role này. Role `SYS_ADMIN` tự động vượt qua mọi lớp kiểm tra quyền (Auto-pass).
4. **[RULE-AUTH-04] Dịch thuật Data Scope:** Khi có truy vấn vào CSDL:
   - Nếu `Data Scope === 'personal'`: Bắt buộc nối thêm điều kiện `WHERE created_by = current_user.id`.
   - Nếu `Data Scope === 'branch'`: Bắt buộc nối thêm điều kiện `WHERE branch_id = current_user.branch_id`.
   - Nếu `Data Scope === 'global'`: Bỏ qua điều kiện lọc vùng.

## 6. Danh sách Yêu cầu Người dùng (User Stories)

| Mã Yêu cầu | Tên Yêu cầu (Loại màn hình) | Đường dẫn truy cập | Trạng thái |
|------------|-----------------------------|--------------------|------------|
| US-SYS-04-01 | Thiết lập Topic, Nhóm quyền, Ma trận (Biểu mẫu Ma trận) | /app/permissions | Đã có US |
| US-SYS-04-02 | Gán nhóm quyền cho tài khoản (Danh sách & Bảng phụ) | /app/user_roles | Đã có US |
| US-SYS-04-03 | Áp dụng Data Scope (Cấu hình ngầm) | N/A | Đã có US |

---

## 7. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Tuân thủ chặt chẽ cấu trúc thực thể ở mục 4. Phải đảm bảo tính toàn vẹn dữ liệu nghiệp vụ (dữ liệu bảng con phải trỏ đúng mã có thật của bảng cha).
- Mọi trạng thái liệt kê trong sơ đồ 4.1 phải được ánh xạ đầy đủ vào hệ thống.
- Giao diện và luồng xử lý phải tuân thủ bảng chuyển đổi trạng thái (chỉ hiển thị các hành động hợp lệ theo từng trạng thái và phân quyền).

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** thêm trường dữ liệu hoặc thực thể ngoài danh sách quy định ở mục 4.
- **KHÔNG** thay đổi cấu trúc quan hệ thực thể mà chưa được phê duyệt từ Product Owner.
- **KHÔNG** tạo trạng thái nghiệp vụ mới ngoài sơ đồ ở mục 4.1. Mọi sự thay đổi vòng đời phải được cập nhật vào tài liệu này trước.

