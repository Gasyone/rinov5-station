---
title: "BF-SYS-02: Quản trị Cấu hình Nền tảng (Platform Configuration)"
type: "Business Function"
domain: "CAP-SYS"
status: "Standardized"
tags: [sys, configuration, tenant-settings, technical-params]
---

# BF-SYS-02: Quản trị Cấu hình Nền tảng (Platform Configuration)

> **Capability:** CAP-SYS (Năng lực Quản trị Hệ thống)
> **Giai đoạn:** 1 - Thiết lập nền tảng
> **Nhóm chức năng:** Thiết lập tổ chức
> **Mã màn hình:** `system_config`

---

## 1. Mô tả tổng quan

Quản lý các tham số cấu hình chung mang tính chất **Kỹ thuật (Technical) và Nền tảng (Platform)** của toàn bộ hệ thống. Theo nguyên tắc Domain-Driven Design (DDD), phân hệ này TUYỆT ĐỐI KHÔNG chứa các tham số nghiệp vụ (như ngày nghỉ lễ, sĩ số lớp, hoàn tiền). 

Mục tiêu chính là kiểm soát hành vi bảo mật (Security Policies), khu vực hóa (Localization), và nhận diện thương hiệu (Branding) của hệ thống phần mềm.

## 2. Đối tượng sử dụng (Vai trò)

- **Quản trị Hệ thống (System Admin):** Quyền duy nhất được thay đổi cấu hình nền tảng.

## 3. Ranh giới Nghiệp vụ (Scope)

### Có bao gồm (In Scope)
- **Localization (Khu vực hóa):** Thiết lập Ngôn ngữ mặc định (vi, en, zh), Timezone hệ thống.
- **Branding (Nhận diện):** Khai báo Tên tổ chức, Logo nền tảng, Màu chủ đạo (Theme).
- **Security & Tech Params (Tham số Kỹ thuật & Bảo mật):**
  - Session Timeout (Thời gian tự động đăng xuất nếu không có tương tác).
  - Password Policy (Độ phức tạp yêu cầu đối với mật khẩu).
  - Giới hạn dung lượng file upload (Max Upload Size).
- **Feature Flags:** Công tắc Bật/Tắt các phân hệ hoặc tính năng toàn cục.

### Không bao gồm (Out of Scope)
- Cấu hình Ngày nghỉ lễ (Holidays) → Thuộc `BF-ACD-07` (Thiết lập Học thuật).
- Cấu hình Giờ hoạt động của Chi nhánh → Thuộc `BF-ORG-01` (Quản lý Chi nhánh).
- Tham số thanh toán, hoàn tiền → Thuộc `BF-FIN-01`.

## 4. Mô hình Dữ liệu Nghiệp vụ (Data Entities)

| Tên Thực thể | Trường định danh | Thuộc tính quan trọng | Ràng buộc quan hệ | Diễn giải |
|--------------|------------------|-----------------------|-------------------|----------|
| Tham số Cấu hình (SystemConfig) | Tên Khóa (Key) | Giá trị (Value), Nhóm (Category), Kiểu dữ liệu | Độc lập | Key-value store lưu cấu hình hệ thống. |
| Nhật ký Cấu hình (Audit Log) | Mã Log | Tên Khóa, Giá trị cũ, Giá trị mới, Người đổi | Trỏ về Mã Tài khoản (Account) | Lưu vết mọi thay đổi kỹ thuật. |

### 4.1. Vòng đời Trạng thái (Status Lifecycle)

*(Phân hệ này quản lý các tham số Settings (Key-Value), do đó không có vòng đời chuyển đổi trạng thái thực thể phức tạp).*

### 4.2. Ví dụ Dữ liệu mẫu

*Giúp AI và Lập trình viên tạo dữ liệu kiểm thử chính xác.*

| Khóa (Key) | Giá trị (Value) | Kiểu dữ liệu | Diễn giải |
|------------|-----------------|--------------|-----------|
| `SESSION_TIMEOUT_MINS` | `30` | Number | Sau 30 phút không tương tác, tự động đăng xuất người dùng. |
| `DEFAULT_LOCALE` | `"vi-VN"` | String | Ngôn ngữ giao diện mặc định cho tài khoản mới. |
| `FEATURE_B2B_ENABLED` | `true` | Boolean | Bật phân hệ B2B (BF-MDM-03). |

## 5. Quy tắc Nghiệp vụ Tổng thể (Business Rules)

1. **[RULE-SYS-02-01] Áp dụng tức thì (Real-time Propagation):** Các thay đổi liên quan đến cấu hình hệ thống (Ví dụ: Session Timeout, Branding) sẽ được áp dụng ngay lập tức cho các phiên làm việc (Session) mới, hoặc ép buộc client fetch lại dữ liệu đối với những thay đổi giao diện.
2. **[RULE-SYS-02-02] Giá trị dự phòng (Fail-safe Fallback):** Hệ thống mã nguồn (Frontend/Backend) bắt buộc phải cấu hình Hardcoded Default Value cho TẤT CẢ các Khóa (Key) cấu hình. Nếu tham số trong Cơ sở dữ liệu bị xóa hoặc rỗng, hệ thống sẽ tự động dùng giá trị mặc định để tránh Crash.
3. **[RULE-SYS-02-03] Lưu vết thay đổi (Strict Audit Trace):** BẮT BUỘC ghi lại toàn bộ log (Ai đổi, thời gian, Giá trị cũ, Giá trị mới) cho mọi thao tác Cập nhật Cấu hình.

## 6. Danh sách Yêu cầu Người dùng (User Stories)

| Mã Yêu cầu | Tên Yêu cầu (Loại màn hình) | Đường dẫn truy cập | Trạng thái |
|------------|-----------------------------|--------------------|------------|
| US-SYS-02-01 | Cấu hình chung & Branding (Biểu mẫu) | /app/system_config/general | Đã có US |
| US-SYS-02-02 | Tham số Kỹ thuật & Bảo mật (Biểu mẫu) | /app/system_config/security | Đã có US |
| US-SYS-02-03 | Quản lý Danh mục Từ điển (Chức danh, Hợp đồng) | /app/system_config/dictionaries | Đã chuẩn hóa |
