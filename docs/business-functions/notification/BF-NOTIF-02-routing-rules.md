---
title: "BF-NOTIF-02: Routing Rules — Ánh xạ Sự kiện → Thông báo"
type: "Business Function"
domain: "CAP-NOTIFICATION"
status: "Draft"
tags: [notification, routing, event, trigger, rule-engine]
---

# BF-NOTIF-02: Routing Rules — Ánh xạ Sự kiện → Thông báo

> **Capability:** CAP-NOTIFICATION (Năng lực Trung tâm Thông báo)
> **Giai đoạn:** 1 - Thiết lập nền tảng
> **Nhóm chức năng:** Cấu hình Thông báo

---

## 1. Mô tả tổng quan

Phân hệ định nghĩa và quản lý các quy tắc ánh xạ sự kiện nghiệp vụ (Event Trigger) từ các CAP/BF khác thành thông báo (Notification) cho người dùng đích. Mỗi quy tắc xác định: sự kiện gì → ai nhận → loại thông báo → mức ưu tiên → trang xử lý. Đây là bộ não của hệ thống thông báo, đảm bảo người đúng nhận thông tin đúng thời điểm.

## 2. Đối tượng sử dụng (Vai trò)

- **Quản trị hệ thống (Admin):** Cấu hình và quản lý routing rules.
- **Quản lý Chi nhánh (BM):** Xem danh sách rules áp dụng cho chi nhánh của mình.
- **Hệ thống (Backend Engine):** Tự động thực thi rules khi có sự kiện nghiệp vụ.

## 3. Ranh giới Nghiệp vụ (Scope)

### Có bao gồm (In Scope)
- Định nghĩa Bảng Routing Rules: Event Source → Recipient Role → Category → Priority → Target Route
- Cấu hình recipients theo vai trò (Role-Based): VD: "CSM của chi nhánh" → nhận thông báo HV at-risk
- Cấu hình recipients cụ thể (User-Specific): VD: "Giáo viên A" → nhận thông báo bị dạy thay
- Kích hoạt/Vô hiệu hóa rule riêng lẻ
- Thứ tự ưu tiên khi nhiều rules trigger cùng lúc

### Không bao gồm (Out of Scope)
- Giao diện Notification Center (Bell, Panel) → Thuộc `BF-NOTIF-01`
- Cài đặt preference cá nhân → Thuộc `BF-NOTIF-01` (US-NOTIF-02)
- Gửi tin nhắn ngoài hệ thống → Thuộc Communication Channel domain

## 4. Mô hình Dữ liệu Nghiệp vụ (Data Entities)

| Tên Thực thể | Trường định danh | Thuộc tính quan trọng | Ràng buộc quan hệ | Diễn giải |
|--------------|------------------|-----------------------|-------------------|----------|
| Quy tắc Routing | Mã rule (UUID) | Tên, Nguồn sự kiện, Vai trò nhận, Loại thông báo, Mức ưu tiên, Đường dẫn, Trạng thái (Bật/Tắt) | Độc lập | Ánh xạ 1 loại sự kiện → người nhận. |

### 4.1. Bảng Routing Rules Tổng thể (Master Routing Table)

*Bảng này là tài liệu chuẩn cho mọi ánh xạ sự kiện → thông báo trong hệ thống.*

| # | Nguồn sự kiện | BF Trigger | Sự kiện | Vai trò nhận | Loại | Ưu tiên | Tiêu đề mẫu | Đường dẫn |
|---|---------------|------------|---------|-------------|------|---------|-------------|-----------|
| 1 | Điểm danh | `BF-CLS-05` | HV vắng mặt buổi học | CSM của lớp | Workflow | Cao | "HV {name} vắng buổi học {code}" | `/app/students/{id}` |
| 2 | Điểm danh | `BF-CLS-05` | GV điểm danh xong buổi | BM của chi nhánh | System | Thấp | "GV {teacher} đã điểm danh lớp {class}" | `/app/classes/{id}` |
| 3 | Hủy buổi | `BF-OPS-03` | Buổi học bị hủy | HV (phụ huynh) + GV của lớp | Alert | Cao | "Buổi học {code} đã bị hủy" | `/app/calendar_class_schedule` |
| 4 | Dạy thay | `BF-OPS-03` | GV bị dạy thay | GV được phân dạy thay | Workflow | Cao | "Bạn được phân dạy thay buổi {code}" | `/app/calendar_class_schedule` |
| 5 | Bảo lưu | `BF-CLS-06` | Đơn bảo lưu được duyệt | CSM của HV | Workflow | Trung bình | "HV {name} đã được bảo lưu đến {date}" | `/app/students/{id}` |
| 6 | Chuyển lớp | `BF-CLS-06` | HV chuyển lớp thành công | GV lớp mới + GV lớp cũ | Workflow | Trung bình | "HV {name} chuyển từ lớp {old} sang {new}" | `/app/classes/{id}` |
| 7 | Booking Test | `BF-ENR-01` | Kết quả test có sẵn | Sale phụ trách | Workflow | Cao | "HV {name} có kết quả test mới" | `/app/booking_test` |
| 8 | Học thử | `BF-ENR-02` | GV nộp nhận xét học thử | Sale phụ trách | Workflow | Cao | "HV {name} hoàn thành học thử" | `/app/trial_class` |
| 9 | Đơn hàng | `BF-SAL-01` | Đơn hàng mới tạo | CSM + Sale | Workflow | Trung bình | "Đơn hàng {orderNo} mới tạo" | `/app/orders/{id}` |
| 10 | Đơn hàng | `BF-SAL-01` | Đơn hàng bị hủy | BM của chi nhánh | Alert | Cao | "Đơn hàng {orderNo} đã bị hủy" | `/app/orders/{id}` |
| 11 | Ticket | `BF-CARE-01` | Ticket mới tạo | CSM được phân công | Alert | Cao | "Ticket mới: {title}" | `/app/support_tickets` |
| 12 | SLA | `BF-CARE-01` | Ticket sắp hết hạn SLA | CSM được phân công | Alert | Cao | "Ticket {id} còn 2h hết hạn SLA" | `/app/support_tickets` |
| 13 | Tài khoản | `BF-SYS-01` | Tài khoản mới được cấp | Người dùng mới | System | Trung bình | "Tài khoản của bạn đã được kích hoạt" | `/app/dashboard` |
| 14 | Tài khoản | `BF-SYS-01` | Tài khoản bị khóa | Người dùng bị ảnh hưởng | Alert | Cao | "Tài khoản của bạn đã bị khóa" | `/login` |
| 15 | Quỹ thời gian | `BF-HR-02` | Được đăng ký hộ | Nhân viên được đăng ký | Reminder | Thấp | "Quản lý {name} đã đăng ký lịch cho bạn" | `/app/my_schedule` |
| 16 | Xếp lịch | `BF-OPS-02` | Lịch học mới được sinh | GV của lớp | Reminder | Trung bình | "Lịch học mới cho lớp {class}" | `/app/calendar_class_schedule` |
| 17 | Lớp học | `BF-CLS-02` | Lớp mới Mở chiêu sinh | Sales + CSM của chi nhánh | System | Thấp | "Lớp {classCode} đã mở chiêu sinh" | `/app/classes/{id}` |
| 18 | Hộ gia đình | `BF-MDM-02` | Thay đổi Guardian chính | CSM của HV | System | Thấp | "Guardian chính của HV {name} đã thay đổi" | `/app/students/{id}` |

### 4.2. Ví dụ Dữ liệu mẫu

*Giúp AI và Lập trình viên tạo dữ liệu kiểm thử chính xác.*

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
|------------|-----------------|-------------------|
| Rule trigger: HV vắng | HV-A vắng buổi CLASS-001, Session-05 | 1 notification gửi tới CSM, type=Workflow, priority=High, target=/app/students/HV-A |
| Rule bị tắt | Rule #7 (Booking Test) bị tắt | Không sinh notification khi có kết quả test |
| Nhiều rules cùng trigger | Đơn hàng mới → Rule #9 (CSM) + Rule #9 (Sale) | 2 notifications, 1 cho mỗi người |

## 5. Quy tắc Nghiệp vụ Tổng thể (Business Rules)

1. **[RULE-NOTIF-R01] Vai trò nhận động (Dynamic Recipient):** Người nhận được xác định theo vai trò trong bối cảnh sự kiện (contextual role), NOT theo danh sách cố định. VD: "CSM của chi nhánh có HV" → CSM phụ trách chi nhánh đó tại thời điểm sự kiện xảy ra.
2. **[RULE-NOTIF-R02] Rule Priority:** Khi nhiều rules cùng trigger cho cùng 1 user trong < 60 giây, hệ thống gộp thành 1 notification với tiêu đề dạng "{count} thông báo mới".
3. **[RULE-NOTIF-R03] Bật/Tắt Rule:** Rule bị tắt KHÔNG xóa notifications đã sinh — chỉ ngăn sinh notifications mới.
4. **[RULE-NOTIF-R04] Audit Trail:** Mỗi lần rule trigger thành công hoặc thất bại đều được ghi log để debug.

## 6. Danh sách Yêu cầu Người dùng (User Stories)

| Mã Yêu cầu | Tên Yêu cầu (Loại màn hình) | Đường dẫn truy cập | Trạng thái |
|------------|-----------------------------|--------------------|------------|
| `US-NOTIF-03` |Xem danh sách Routing Rules (Danh sách) | /app/notification_rules | Đề xuất |
| `US-NOTIF-04` | Bật/Tắt Routing Rule (Hành động) | Nằm trong danh sách rules | Đề xuất |
