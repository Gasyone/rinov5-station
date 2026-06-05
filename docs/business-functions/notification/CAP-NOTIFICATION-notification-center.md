---
title: "Năng lực Trung tâm Thông báo (In-App Notification)"
type: "Capability"
domain: "CAP-NOTIFICATION"
status: "Draft"
id: "CAP-NOTIFICATION"
parent_br: "BR-003"
tags: [capability, notification, inbox, in-app]
---

# Capability: Năng lực Trung tâm Thông báo (In-App Notification)

**ID:** `CAP-NOTIFICATION`  
**Domain:** Thông báo Trong hệ thống  
**Phân loại:** Năng lực Hỗ trợ  
**BR cha:** `BR-003` (Nâng cao trải nghiệm và hiệu quả vận hành)

---

## 1. Mục tiêu & Phạm vi

Cung cấp hệ thống thông báo trong ứng dụng (In-App Notification) để người dùng nhận được tín hiệu thời gian thực về các sự kiện nghiệp vụ quan trọng xảy ra trong hệ thống. Đảm bảo không bỏ sót việc cần xử lý, giảm thời gian chuyển màn hình, và tăng tốc độ phản hồi.

**Phạm vi:**
- Bell Icon + Badge unread trên Header
- Notification Panel (Dropdown) hiển thị danh sách thông báo
- Quản lý trạng thái đọc/chưa đọc (read/unread)
- Phân loại thông báo theo danh mục (Category) và mức độ ưu tiên (Priority)
- Routing Rules: sự kiện X từ CAP nào → sinh thông báo cho ai
- Click-to-navigate: chọn thông báo → điều hướng tới màn hình liên quan

**KHÔNG bao gồm:**
- Gửi tin nhắn ngoài hệ thống (SMS, Zalo, Email) → Thuộc domain Communication Channel riêng
- Toast transient feedback → Toast chỉ là phản hồi thao tác trực tiếp, không phải notification

## 2. Thực thể Dữ liệu cốt lõi

*   **Thông báo (Notification):** Bản ghi thông báo trong hệ thống, chứa tiêu đề, nội dung, loại, trạng thái đọc, thời gian phát sinh, mã nguồn sự kiện, đường dẫn điều hướng.
*   **Quy tắc Routing (Notification Routing Rule):** Ánh xạ sự kiện nghiệp vụ → người nhận → loại thông báo. Mỗi BF trigger event phải có quy tắc routing tương ứng.
*   **Cài đặt Thông báo (Notification Preference):** Cấu hình cá nhân của mỗi user — cho phép bật/tắt từng loại thông báo, cài đặt giờ không làm phiền (Do Not Disturb).

## 3. Tuân thủ Tiêu chuẩn (Policy Compliance)

Khối năng lực này chịu sự ràng buộc của các điều luật cốt lõi trong `ENTERPRISE_STANDARDS.md`:

1. **Tuân thủ `[POLICY-IAM-01]`:** Phân ly IAM — thông báo chỉ hiển thị cho người dùng có quyền, dựa trên Data Scope của người dùng.
2. **Tuân thủ `[POLICY-IAM-03]`:** RBAC + ABAC — người dùng chỉ nhận thông báo trong scope chi nhánh/phòng ban được phân công.
3. **Tuân thủ `[POLICY-DS-01]`:** Tiêu chuẩn thiết kế — giao diện thông báo tuân thủ Design System §4.2 (List Page Pattern), §6.1 (Component Conventions).
4. **Tuân thủ `[POLICY-DS-02]`:** Quản trị trạng thái thị giác — trạng thái read/unread, priority được ánh xạ màu sắc từ `statusColors.ts`.
5. **Tuân thủ `[POLICY-ORG-01]`:** Lọc dữ liệu theo ngữ cảnh — thông báo được lọc theo Data Scope của currentUser.

## 4. Kiến trúc & Nguyên tắc cốt lõi

Hệ thống thông báo vận hành theo mô hình **Event-Driven + Central Inbox**:

```
[CAP/ BF Event Trigger]
        │
        ▼
[Notification Engine] ←─ Routing Rules
        │
        ▼
[Notification Store/State] ←─ useUIStore (Zustand)
        │
        ├──► [Bell Icon + Badge] (Header)
        ├──► [Notification Panel] (Dropdown)
        └──► [Notification Center] (Màn hình riêng cho Admin/BM)
```

**Nguyên tắc:**
- **Push Model:** BF trigger event → Engine tự sinh notification cho user đích. User không phải refresh.
- **Single Source of Truth:** `useUIStore.notifications` là nguồn dữ liệu duy nhất cho tất cả UI notification.
- **Persistence qua session:** Notification được lưu trong Zustand store với localStorage (giữ qua reload).
- **Click-to-Navigate:** Mỗi notification có `targetRoute` — khi click, điều hướng tới màn hình xử lý sự kiện đó.

## 5. Giao tiếp Liên miền (Cross-Capability Interactions)

*   👉 **Cung cấp dữ liệu cho:**
    - **Toàn bộ CAP/BF:** Dịch vụ thông báo nhận sự kiện từ các CAP khác và sinh notification cho user đích.
    - `CAP-RPT`: Cung cấp số liệu thống kê thông báo (tỷ lệ đọc, thời gian phản hồi).

*   👈 **Nhận dữ liệu từ:**
    - `CAP-OPS`: Sự kiện điểm danh, hủy buổi, bảo lưu, chuyển lớp.
    - `CAP-ADM`: Sự kiện booking test hoàn thành, học thử hoàn thành.
    - `CAP-COM`: Sự kiện đơn hàng mới, đơn hàng bị hủy.
    - `CAP-CARE`: Sự kiện ticket mới, SLA sắp hết, HV at-risk.
    - `CAP-SYS`: Sự kiện cấp tài khoản, khóa tài khoản, reset mật khẩu.
    - `CAP-HR`: Sự kiện phân công lịch, đăng ký hộ, điều chuyển nhân sự.
    - `CAP-MDM`: Sự kiện thay đổi quan hệ hộ gia đình.

## 6. Phân ranh giới Sở hữu Dữ liệu

| Dữ liệu | Khối này sở hữu | Thuộc khối khác |
|----------|-----------------|-----------------|
| Bản ghi Notification (id, message, type, read, timestamp) | ✅ | |
| Routing Rules (event → recipient) | ✅ | |
| Notification Preference (bật/tắt theo loại) | ✅ | |
| Badge unread count | ✅ | |
| Nội dung sự kiện gốc (VD: nội dung ticket, chi tiết đơn hàng) | | → CAP gốc sở hữu |
| Danh sách người dùng/phân quyền | | → `CAP-SYS` |
| Hành động xử lý sự kiện (VD: xử lý ticket, duyệt đơn) | | → CAP gốc xử lý |

## 7. Danh sách Phân hệ Nghiệp vụ (Business Functions)

| Mã BF | Tên Phân hệ Nghiệp vụ | Trạng thái |
|-------|------------------------|------------|
| `BF-NOTIF-01` | Quản lý Trung tâm Thông báo (Notification Center) | Đang soạn thảo |
| `BF-NOTIF-02` | Routing Rules — Ánh xạ sự kiện → Thông báo | Đang soạn thảo |
