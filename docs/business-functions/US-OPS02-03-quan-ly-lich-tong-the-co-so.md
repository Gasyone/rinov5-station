---
id: US-OPS02-03
title: "Lịch học Cơ sở (Global Class Schedule)"
bf: BF-OPS-02
domain: CAP-OPS
status: standardized
tags: [schedule, class, ops, aggregator]
---

# US-OPS02-03: Lịch học Cơ sở (Global Class Schedule)

> **Tham chiếu:** BF-OPS-02 · Giao diện Mẫu §4.2 (Danh sách dạng Grid/Calendar)

## 1. Yêu cầu Người dùng (User Story)
**Là một** Quản lý chi nhánh hoặc Nhân viên Giáo vụ, **tôi muốn** xem toàn bộ lịch học (Class Sessions) của tất cả các lớp đang diễn ra tại cơ sở trên một giao diện lịch tổng, **để** nắm bắt tình hình sử dụng phòng học, lịch dạy của giáo viên, và nhanh chóng tra cứu thông tin của bất kỳ buổi học nào.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập với các US quản lý Lớp học. Đóng vai trò là Aggregator (Consumer).
> - [x] **N**egotiable — Chi tiết giao diện (bộ lọc, góc nhìn tháng/tuần/ngày) có thể linh hoạt.
> - [x] **V**aluable — Cung cấp "bức tranh toàn cảnh" về hoạt động đào tạo tại cơ sở.
> - [x] **E**stimable — Rất dễ ước lượng vì chỉ đơn thuần là UI mapping data từ API.
> - [x] **S**mall — Có thể hoàn thành nhanh trong 1 Sprint.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-CAL-01] Nguồn dữ liệu (Producer):** 
   - Lịch học cơ sở **chỉ** hiển thị các sự kiện là Buổi học (Sessions) được sinh ra từ Lớp học (`BF-OPS-02` / `BF-OPS-03`). KHÔNG chứa Booking Test hay Sự kiện (chúng nằm ở Lịch sự kiện).
2. **[RULE-CAL-02] Read-only & Detail Trigger:** 
   - Trên màn hình Lịch, người dùng KHÔNG thể kéo thả (drag & drop) để đổi lịch. Lịch ở chế độ **Read-only**.
   - Bất kỳ tương tác nào đều thông qua việc click vào thẻ sự kiện (Event Card) để mở Popup/Dialog Chi tiết Buổi học. Logic đổi giờ, dạy thay, hủy buổi nằm hoàn toàn trong Popup chi tiết đó.
3. **[RULE-CAL-03] Đồng bộ tự động:** 
   - Khi có thay đổi trạng thái buổi học (VD: đổi phòng, hủy) từ Popup chi tiết, màn hình Lịch phải tự động tải lại (Refetch) để phản ánh trạng thái mới nhất.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
- **[METRIC-01] Hiệu năng (SLA):** Thời gian tải dữ liệu lịch của 1 Tuần (hoặc 1 Tháng) cho 1 Chi nhánh lớn (< 500 sessions) phải dưới 2 giây.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ (Toolbar)
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chế độ xem | Segmented Control | Ngày / Tuần / Tháng | Mặc định: Tuần. |
| Chọn Trung tâm | BranchSelect | Chọn cơ sở làm việc | Mặc định: Chi nhánh hiện tại của User. |
| Chọn Phòng học | Select (Dropdown) | Lọc lịch theo phòng học cụ thể | Rất quan trọng để check trống phòng. |
| Chọn Giáo viên | Select (Dropdown) | Lọc lịch theo Giáo viên | |
| Tìm kiếm | ExpandableSearch | Quét Tên lớp, Mã lớp | |
| Bộ lọc trạng thái| FilterIconButton | Lọc theo: Bình thường, Dạy thay, Đổi phòng, Đã hủy | |

### 3.2. Bảng Lịch (Calendar/Time Grid)
| Thành phần | Loại hiển thị | Dữ liệu | Ghi chú |
|------------|---------------|---------|---------|
| Trục thời gian | Cột giờ / Ngày | Dựa theo chế độ xem | Khung giờ chuẩn: 07:00 - 22:00. |
| Thẻ Lịch (Card) | Unified Event Block | Giờ, Mã Lớp, Tên GV, Phòng học | Chiều cao tự động co giãn theo thời lượng buổi học (VD: 1.5h, 2h). |
| Màu sắc thẻ | Background Color | Lấy từ `statusColors.ts` | VD: Buổi học bị hủy (Đỏ), Buổi học dạy thay (Vàng), Bình thường (Xanh). |

### 3.3. Thao tác trên Thẻ Lịch (Card)
| Nút | Loại | Logic | Điều kiện |
|-----|------|-------|-----------|
| Click Thẻ lịch | Nhấp chuột (Click) | Mở `<SessionDetailDialog>` của Lớp học | Truyền `sessionId` để Component kia tự fetch data và xử lý. |

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Không có lịch học | Hiển thị lưới lịch trống, không báo lỗi. |
| 4.2 | Lịch chồng chéo (Overlap) | Nếu do lỗi dữ liệu có 2 lớp xếp cùng phòng cùng giờ, UI phải render cả 2 thẻ dưới dạng chia đôi cột (Split width) và đánh dấu cảnh báo (Đỏ). |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- **Mô hình Consumer:** Màn hình này chỉ có logic `GET`. Mọi thay đổi dữ liệu (Update/Delete) phải được thực hiện thông qua việc gọi các Component của `BF-OPS-03`.
- Bắt buộc dùng `getStatusBadgeClass()` từ `src/lib/statusColors.ts` để hiển thị màu thẻ theo trạng thái buổi học.
- Dùng `ToolbarSelect`, `BranchSelect`, `SegmentedControl` từ `@/components/controls`.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** viết logic Cập nhật buổi học (Update Session API) tại file giao diện này.
- **KHÔNG** tự hardcode màu sắc cho các trạng thái buổi học trên lịch.

---

## 6. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Phân tách dữ liệu | Đảm bảo data không lẫn Booking Test | Chỉ hiện Class Sessions. |
| V-02 | Lọc theo phòng | Chọn Phòng 101 | Chỉ hiện các lớp học tại Phòng 101. |
| V-03 | Tương tác thẻ lịch | Click vào 1 Buổi học | Mở đúng Popup Chi tiết Buổi học, màn Lịch không thay đổi. |

---

## 7. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Render chuẩn xác | Xem lưới tuần | Thẻ lịch bám đúng vị trí giờ bắt đầu và kết thúc (VD: 18:00 - 19:30). |
| AC-02 | Đóng gói tương tác | Inspect mã nguồn | Lịch chỉ làm nhiệm vụ pass `sessionId` vào `<SessionDetailDialog>`, không chứa logic business. |
| AC-03 | Lọc dữ liệu mượt | Đổi chế độ Ngày/Tuần | Giao diện không bị giật/vỡ layout, dữ liệu khớp theo khung thời gian. |
