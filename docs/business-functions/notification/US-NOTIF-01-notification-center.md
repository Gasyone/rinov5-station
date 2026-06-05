---
id: US-NOTIF-01
title: "Trung tâm Thông báo In-App (Notification Center)"
bf: BF-NOTIF-01
domain: CAP-NOTIFICATION
status: draft
tags: [notification, inbox, bell, dropdown, unread]
---

# US-NOTIF-01: Trung tâm Thông báo In-App (Notification Center)

> **Tham chiếu:** BF-NOTIF-01 · BF-NOTIF-02 · `[POLICY-DS-01]` · `[POLICY-DS-02]` · `[POLICY-ORG-01]`

## 1. Yêu cầu Người dùng (User Story)

**Là một** người dùng hệ thống (Sale, CSM, GV, BM, Admin),
**tôi muốn** nhận thông báo trong ứng dụng khi có sự kiện nghiệp vụ liên quan đến mình,
**để** không bỏ sót việc cần xử lý, phản hồi kịp thời mà không cần chuyển màn hình.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập, component riêng trong Header.
> - [x] **N**egotiable — Thứ tự hiển thị, số lượng items có thể điều chỉnh.
> - [x] **V**aluable — Giúp người dùng nhận thông tin quan trọng kịp thời, giảm thời gian tìm kiếm.
> - [x] **E**stimable — Đủ rõ để ước lượng: Bell Icon + Badge + DropdownPanel + NotificationItem.
> - [x] **S**mall — Hoàn thành trong 1 vòng phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-NOTIF-UI-01]:** Badge count trên Bell Icon bằng tổng số notification chưa đọc (unread) của user hiện tại. Khi unread = 0, badge ẩn.
2. **[RULE-NOTIF-UI-02]:** Notification được sắp xếp theo thời gian giảm dần — mới nhất trên cùng.
3. **[RULE-NOTIF-UI-03]:** Click vào notification → đánh dấu Read → điều hướng tới trang `targetRoute`. Nếu trang không tồn tại hoặc ngoài Data Scope, điều hướng về Dashboard với toast thông báo.
4. **[RULE-NOTIF-UI-04]:** Notification type được phân loại: System (hệ thống), Workflow (luồng nghiệp vụ), Reminder (nhắc nhở), Alert (cảnh báo khẩn).
5. **[RULE-NOTIF-UI-05]:** Priority hiển thị bằng biểu tượng: Cao (🔴 chấm đỏ), Trung bình (🟡 chấm vàng), Thấp (⚪ chấm xám).
6. **[RULE-NOTIF-UI-06]:** Relative time: ≤ 59 phút → "X phút trước"; ≤ 23 giờ → "X giờ trước"; ≤ 6 ngày → "X ngày trước"; > 6 ngày → hiển thị ngày cụ thể.
7. **[RULE-NOTIF-UI-07]:** Lọc theo loại (Segmented Control): All | System | Workflow | Reminder | Alert. Lọc chỉ áp dụng trong UI, không thay đổi trạng thái read/unread.
8. **[RULE-NOTIF-UI-08]:** Notification ở trạng thái Read sau 7 ngày tự động bị xóa khỏi store (auto-purge).

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Bell Icon + Badge

| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Bell Icon | Nút biểu tượng (lucide-react: Bell) | Mở/đóng Notification Panel | aria-label="Thông báo". Hover: đổi màu nền. |
| Badge unread | Badge tròn đỏ với số | Hiển thị số unread trên góc Bell | Ẩn khi unread = 0. Tối đa hiển thị "99+". |
| Pulse animation | Hiệu ứng nhịp | Khi có unread mới trong < 30 giây | Nhịp 2 lần rồi dừng. Không lặp vô hạn. |

### 3.2. Notification Panel (Dropdown)

| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Tiêu đề | Văn bản in đậm | Luôn hiển thị "Thông báo" | Góc trên trái. |
| Nút "Đánh dấu tất cả đã đọc" | Nút văn bản | Đánh dấu toàn bộ unread thành read | Hiển thị khi có unread > 0. Góc trên phải. |
| Segmented Control | Nhóm nút phân đoạn (5 tab) | Lọc theo loại: All, System, Workflow, Reminder, Alert | Mặc định: All. Mỗi tab hiển thị số lượng. |
| Danh sách thông báo | Danh sách cuộn | Hiển thị notification items | Tối đa 10 items hiển thị, cuộn để xem thêm. |
| Thông báo trống | Placeholder | "Chưa có thông báo nào" | Hiển thị khi danh sách rỗng (sau khi lọc). |
| Nút "Xem tất cả" | Nút văn bản | Điều hướng tới màn hình Notification Center (tương lai) | Nằm cuối danh sách. |

### 3.3. Notification Item

*Mỗi dòng trong danh sách thông báo.*

| Thành phần | Loại hiển thị | Trường Dữ liệu | Ghi chú |
|------------|---------------|----------------|---------|
| Priority dot | Chấm tròn màu | Priority (Cao/Trung bình/Thấp) | Góc trên trái. Cao: đỏ, Trung bình: vàng, Thấp: xám. |
| Icon loại | Biểu tượng | Category (System, Workflow, Reminder, Alert) | System: Settings, Workflow: ArrowRight, Reminder: Clock, Alert: AlertTriangle. |
| Tiêu đề | Văn bản in đậm | notification.title | Cắt ngắn nếu > 40 ký tự. Tooltip hiển thị đầy đủ khi hover. |
| Nội dung | Văn bản phụ | notification.message (tùy chọn) | Cắt ngắn nếu > 60 ký tự. Màu chữ phụ. |
| Thời gian | Văn bản nhỏ | notification.timestamp | Relative time (§2, RULE-NOTIF-UI-06). Góc trên phải. |
| Trạng thái read/unread | Border trái viền đậm | notification.read | Unread: border-l-4 border-primary. Read: border-l border-border. |

### 3.4. Thao tác trên Notification Item

| Thao tác | Loại | Logic | Điều kiện |
|----------|------|-------|-----------|
| Click dòng | Điều hướng + Mark as read | Chuyển đến targetRoute, đánh dấu Read | Luôn khả dụng. |
| Hover → Actions | Nhóm nút biểu tượng | Hiển thị: Đánh dấu đã đọc, Xóa | Chỉ unread mới hiện "Đánh dấu đã đọc". |
| Đánh dấu đã đọc | Nút biểu tượng (Check) | Chuyển thành Read, giữ nguyên vị trí | Chỉ hiện khi unread. |
| Xóa | Nút biểu tượng (X) | Xóa notification khỏi store | Hiện confirm dialog trước khi xóa ([DS-P4]). |

### 3.5. Danh sách thông báo mẫu (Mock Data)

*Dựa trên Bảng Routing Rules từ `BF-NOTIF-02` mục 4.1.*

| # | Tiêu đề | Loại | Ưu tiên | Thời gian | Trạng thái | Route |
|---|---------|------|---------|-----------|------------|-------|
| 1 | HV Nguyễn Văn A vắng buổi học CLASS-001 | Workflow | Cao | 5 phút trước | Unread | `/app/students/HV-A` |
| 2 | Đơn hàng ORD-2026-001 mới tạo | Workflow | Trung bình | 15 phút trước | Unread | `/app/orders/ORD-2026-001` |
| 3 | GV Trần Thị B đã điểm danh lớp IELTS-05 | System | Thấp | 2 giờ trước | Unread | `/app/classes/IELTS-05` |
| 4 | Buổi học SESSION-012 đã bị hủy | Alert | Cao | 3 giờ trước | Read | `/app/calendar_class_schedule` |
| 5 | Ticket "HV phàn nàn học phí" mới tạo | Alert | Cao | 1 ngày trước | Read | `/app/support_tickets` |
| 6 | Lịch học mới cho lớp TOEIC-03 | Reminder | Trung bình | 2 ngày trước | Read | `/app/calendar_class_schedule` |

---

## 4. Xử lý Ngoại lệ

| # | Tình huống | Cách xử lý |
|---|-----------|------------|
| 4.1 | Không có thông báo nào | Panel hiển thị "Chưa có thông báo nào", centered, icon Bell mờ. |
| 4.2 | Lọc không có kết quả (VD: chọn Alert nhưng không có Alert nào) | Hiển thị "Không có thông báo loại này", giữ Segmented Control. |
| 4.3 | targetRoute không tồn tại hoặc ngoài Data Scope | Điều hướng về Dashboard, hiển thị toast "Trang không khả dụng". |
| 4.4 | Store đầy (> 100 notifications) | Tự động xóa các notification đã đọc cũ nhất (FIFO), giữ unread. |
| 4.5 | Mất kết nối khi đang mở panel | Giữ nguyên dữ liệu đã load, không hiển thị lỗi (read-only view). |
| 4.6 | Badge count khác store thực tế | Sync lại từ store mỗi khi panel mở. Lấy store làm nguồn sự thật. |
| 4.7 | Notification bị xóa khi đang hover | Item biến mất, panel tự điều chỉnh layout. Không crash. |
| 4.8 | User chuyển role trong session | Notification cũ vẫn hiển thị. Notification mới theo role mới. |

---

## 5. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Badge count | Thêm 3 unread, kiểm tra Badge | Hiển thị số "3". Ẩn khi 0. |
| V-02 | Click → Read | Click notification bất kỳ | Chuyển thành Read, border thay đổi, badge giảm 1. |
| V-03 | Click → Navigate | Click notification có route | Điều hướng tới đúng trang. |
| V-04 | Mark all as read | Nhấn nút "Đánh dấu tất cả" | Tất cả unread → Read, badge = 0. |
| V-05 | Filter by type | Chọn tab "Workflow" | Chỉ hiện Workflow notifications. |
| V-06 | Empty state | Xóa hết notifications | Hiển thị "Chưa có thông báo nào". |
| V-07 | Delete notification | Nhấn X + confirm | Item biến mất khỏi danh sách. |
| V-08 | Priority display | Kiểm tra 3 priority levels | Đỏ (Cao), Vàng (TB), Xám (Thấp). |
| V-09 | Relative time | Kiểm toán thời gian khác nhau | "5 phút trước", "2 giờ trước", "3 ngày trước". |
| V-10 | Mobile responsive | Thu hẹp viewport < 768px | Panel width đủ, scroll hoạt động. |

---

## 6. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|---------------------|----------------------|-------------------|
| AC-01 | Bell Icon + Badge | Kiểm tra trên Header | Bell hiển thị, Badge đúng số unread. Ẩn khi 0. |
| AC-02 | Notification Panel mở/đóng | Click Bell | Panel mở với danh sách notification. Click ngoài → đóng. |
| AC-03 | Danh sách sắp xếp đúng | Kiểm tra thứ tự | Mới nhất trên cùng (theo timestamp). |
| AC-04 | Read/Unread visual distinction | So sánh 2 trạng thái | Unread: border-l-4 border-primary. Read: border-l border-border. |
| AC-05 | Click → Mark as Read + Navigate | Click notification | Read ngay, điều hướng trang trong ≤ 200ms. |
| AC-06 | Mark all as read | Nhấn nút | Badge = 0, tất cả items thành Read. |
| AC-07 | Filter by category | Chọn tab System/Workflow/Reminder/Alert | Chỉ hiện loại đã chọn. Tab có số lượng. |
| AC-08 | Empty state | Khi không có notification | Hiển thị placeholder "Chưa có thông báo nào". |
| AC-09 | Delete với confirm | Nhấn X → xác nhận | Item xóa khỏi store, badge cập nhật. |
| AC-10 | Priority display | Kiểm tra 3 levels | Chấm đỏ/vàng/xám đúng priority. |
| AC-11 | Relative time correct | Kiểm toán các mốc | ≤ 59p: phút, ≤ 23h: giờ, ≤ 6d: ngày, > 6d: date. |
| AC-12 | Data Scope respected | Login vai trò khác nhau | Mỗi user chỉ thấy notification trong phạm vi của mình. |
| AC-13 | Mock data đủ 6 items | Kiểm tra khi load | 6 notifications từ Mock Data §3.5 hiển thị đúng. |
| AC-14 | Panel responsive | Test at 768px, 1024px, 1280px | Hiển thị đúng, không overflow, scroll hoạt động. |
